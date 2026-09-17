package com.foundation.integration.common;

import cn.hutool.core.util.StrUtil;
import lombok.Data;

@Data
public class ServerInfo {


    /** 服务器URL */
    private String serverUrl;
    /** 应用ID */
    private String appId;
    /** 应用密钥 */
    private String appSecret;
    /** 超时时间 */
    private Integer timeout;


    /**
     * 从配置值创建服务信息
     * @param configValue 配置值，格式为serverUrl,appId,appSecret,timeout
     * @return 服务信息
     */
    public static ServerInfo fromConfigValue(String configValue){
        if(StrUtil.isBlank(configValue)){
            return null;
        }else {
            String[] serverInfoArray = configValue.split(",");
            ServerInfo serverInfo = new ServerInfo();
            serverInfo.setServerUrl(serverInfoArray[0]);
            serverInfo.setAppId(serverInfoArray[1]);
            serverInfo.setAppSecret(serverInfoArray[2]);
             if(serverInfoArray.length > 3){
                 serverInfo.setTimeout(Integer.parseInt(serverInfoArray[3]));
            }else{
                serverInfo.setTimeout(5000);
            }
            return serverInfo;
        }
    }

}
