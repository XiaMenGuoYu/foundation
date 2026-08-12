package com.foundation.integration.minio;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;

import cn.hutool.http.HttpUtil;
import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.foundation.integration.minio.config.MinioConfig;


/**
 * 图片服务类
 *
 * @author nextselector
 */
@Slf4j
@Service
public class ImageService {

    @Autowired
    private MinioClient minioClient;

    @Autowired
    private MinioConfig minioConfig;

    /**
     * 获取无WebP格式的图片URL
     *
     * @param imgUrl 图片URL
     * @return 无WebP格式的图片URL / null
     */
    public String getNoWebpUrl(String imgUrl) {
        byte[] imageBytes = HttpUtil.downloadBytes(imgUrl);
        if (imageBytes == null || imageBytes.length == 0) {
            log.warn("下载图片失败: {}", imgUrl);
            return null;
        }

        String type = getImageType(imageBytes);
        // 检查是否为WebP格式
        if ("webp".equals(type)) {
            // 转换为jpg格式
            imageBytes = convertWebpToFormat(imageBytes, "jpg");
            if (imageBytes != null) {
                // 上传到minio
                String newUrl = uploadToMinio(imageBytes, "jpg", "tmp");
                return newUrl;
            } else {
                log.warn("转换为jpg格式失败: {}", imgUrl);
                return null;
            }
        } else {
            // 非WebP格式，直接返回原始URL
            return imgUrl;
        }
    }

    /**
     * 上传图片到MinIO
     * @param imageBytes 图片字节数组
     * @return 访问URL
     */
    public String uploadToMinio(byte[] imageBytes) {
        String extension = getImageType(imageBytes);
        return uploadToMinio(imageBytes, extension, "static");
    }


    /**
     * 上传图片到MinIO
     *
     * @param imageBytes 图片字节数组
     * @param extension  文件扩展名（jpg/png等）
     * @param folder     文件夹路径（例如：tmp）
     * @return 访问URL
     */
    public String uploadToMinio(byte[] imageBytes, String extension, String folder) {
        if (imageBytes == null || imageBytes.length == 0) {
            log.warn("上传图片失败：图片字节数组为空");
            return null;
        }

        try {
            // 检查bucket是否存在，不存在则创建
            boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(minioConfig.getBucketName()).build());
            if (!found) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(minioConfig.getBucketName()).build());
                log.info("创建MinIO存储桶: {}", minioConfig.getBucketName());
            }

            // 生成文件名：folder/UUID.ext
            String fileName = UUID.randomUUID().toString().replace("-", "") + "." + extension;
            String objectName = folder + "/" + fileName;

            // 上传文件
            InputStream inputStream = new ByteArrayInputStream(imageBytes);
            minioClient.putObject(PutObjectArgs.builder()
                            .bucket(minioConfig.getBucketName())
                            .object(objectName)
                            .stream(inputStream, imageBytes.length, -1)
                            .contentType(getContentType(extension))
                            .build()
            );

            // 构建访问URL
            String url = buildMinioUrl(objectName);
            log.info("图片上传成功: {}", url);
            return url;

        } catch (Exception e) {
            log.error("上传图片到MinIO失败: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * 构建MinIO访问URL
     *
     * @param objectName 对象名称
     * @return 访问URL
     */
    private String buildMinioUrl(String objectName) {
        return minioConfig.getPublicUrl() +  minioConfig.getBucketName() + "/" + objectName;
    }

    /**
     * 根据文件扩展名获取Content-Type
     *
     * @param extension 文件扩展名
     * @return Content-Type
     */
    private String getContentType(String extension) {
        if (extension == null) {
            return "application/octet-stream";
        }
        switch (extension.toLowerCase()) {
            case "jpg":
            case "jpeg":
                return "image/jpeg";
            case "png":
                return "image/png";
            case "gif":
                return "image/gif";
            case "bmp":
                return "image/bmp";
            case "webp":
                return "image/webp";
            default:
                return "application/octet-stream";
        }
    }


    /**
     * 将WebP图片转换为指定格式
     *
     * @param imageBytes 图片字节数组
     * @param format 目标格式（jpg/png）
     * @return 转换后的字节数组，如果不是WebP或转换失败返回null
     */
    private byte[] convertWebpToFormat(byte[] imageBytes, String format) {

        try {
            log.info("开始转换WebP图片为{}格式", format);

            // 读取WebP图片
            BufferedImage image = ImageIO.read(new ByteArrayInputStream(imageBytes));
            if (image == null) {
                log.warn("读取WebP图片失败，可能缺少WebP支持依赖");
                return null;
            }

            // 转换为目标格式
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            boolean success = ImageIO.write(image, format, outputStream);

            if (success) {
                log.info("WebP图片转换成功: {} bytes", outputStream.size());
                return outputStream.toByteArray();
            } else {
                log.warn("WebP图片转换失败: {}", format);
                return null;
            }
        } catch (IOException e) {
            log.error("转换WebP图片失败: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * 根据图片字节数组判断图片类型
     * 通过检查文件头（魔数）来识别图片格式
     *
     * @param imageBytes 图片字节数组
     * @return 图片类型（jpg/png/gif/webp/bmp等），如果无法识别返回null
     */
    public String getImageType(byte[] imageBytes) {
        if (imageBytes == null || imageBytes.length < 8) {
            return null;
        }

        // 检查JPEG (JFIF) - 文件头: FF D8 FF
        if (imageBytes[0] == (byte) 0xFF && 
            imageBytes[1] == (byte) 0xD8 && 
            imageBytes[2] == (byte) 0xFF) {
            return "jpg";
        }

        // 检查PNG - 文件头: 89 50 4E 47 0D 0A 1A 0A
        if (imageBytes[0] == (byte) 0x89 && 
            imageBytes[1] == 'P' && 
            imageBytes[2] == 'N' && 
            imageBytes[3] == 'G') {
            return "png";
        }

        // 检查GIF - 文件头: 47 49 46 38
        if (imageBytes[0] == 'G' && 
            imageBytes[1] == 'I' && 
            imageBytes[2] == 'F' && 
            imageBytes[3] == '8') {
            return "gif";
        }

        // 检查WebP - 文件头: RIFF + WEBP
        if (imageBytes.length >= 12 &&
            imageBytes[0] == 'R' && 
            imageBytes[1] == 'I' && 
            imageBytes[2] == 'F' && 
            imageBytes[3] == 'F' &&
            imageBytes[8] == 'W' && 
            imageBytes[9] == 'E' && 
            imageBytes[10] == 'B' && 
            imageBytes[11] == 'P') {
            return "webp";
        }

        // 检查BMP - 文件头: 42 4D
        if (imageBytes[0] == 'B' && 
            imageBytes[1] == 'M') {
            return "bmp";
        }

        // 检查TIFF - 文件头: 49 49 2A 00 或 4D 4D 00 2A
        if (imageBytes.length >= 4 &&
            ((imageBytes[0] == 'I' && imageBytes[1] == 'I' && 
              imageBytes[2] == '*' && imageBytes[3] == 0) ||
             (imageBytes[0] == 'M' && imageBytes[1] == 'M' && 
              imageBytes[2] == 0 && imageBytes[3] == '*'))) {
            return "tiff";
        }

        // 检查ICO - 文件头: 00 00 01 00
        if (imageBytes.length >= 4 &&
            imageBytes[0] == 0 && 
            imageBytes[1] == 0 && 
            imageBytes[2] == 1 && 
            imageBytes[3] == 0) {
            return "ico";
        }

        // 无法识别
        return null;
    }


}
