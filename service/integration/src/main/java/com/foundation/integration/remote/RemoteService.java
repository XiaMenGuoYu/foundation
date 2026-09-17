package com.foundation.integration.remote;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Component;

import com.foundation.integration.common.ServerInfo;
import com.foundation.integration.remote.dto.RemoteDTO;

import cn.hutool.core.date.DateUtil;
import cn.hutool.http.HttpRequest;
import cn.hutool.http.HttpResponse;
import cn.hutool.http.HttpUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class RemoteService {

    /**
     * 查询远程接口
     * 
     * @param serverInfo 服务信息
     * @param keyword    搜索关键词
     * @param keyword    搜索关键词
     */
    public List<RemoteDTO> queryFunction(ServerInfo serverInfo, String keyword) throws RuntimeException {

        StringBuilder url = new StringBuilder(serverInfo.getServerUrl() + "/t1/remote");
        String timeStamp = String.valueOf(DateUtil.currentSeconds());
        // 构建加密串
        JSONObject body = new JSONObject();
        body.set("timestamp", timeStamp);
        body.set("keyword", keyword);
        
        // 构建请求
        url.append("?app_id=").append(serverInfo.getAppId());
        url.append("&timestamp=").append(timeStamp);
        url.append("&keyword=").append(keyword);
       
        HttpRequest request = HttpUtil.createGet(url.toString()).setConnectionTimeout(serverInfo.getTimeout());

        log.info("查询远程接口:url-{},body-{}", url, body.toString());
        HttpResponse response = request.execute();
        if (response.isOk()) {
            JSONObject responseBody = JSONUtil.parseObj(response.body());
            if (responseBody.getInt("code") == 0) {
                log.info("查询远程接口成功：{}", response.body());
                JSONObject data = responseBody.getJSONObject("data");
                List<RemoteDTO> result = new ArrayList<>();
                return result;
            } else {
                log.warn("查询远程接口失败，业务异常：{}", responseBody.getStr("msg"));
                throw new RuntimeException(responseBody.getStr("msg"));
            }
        } else {
            log.warn("查询远程接口失败，响应：{}", response.body());
            throw new RuntimeException(response.body());
        }
    }

}
