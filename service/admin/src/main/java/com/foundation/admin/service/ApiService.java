package com.foundation.admin.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import com.foundation.admin.controller.api.request.DemoRequest;
import com.foundation.admin.controller.api.response.DemoResponse;

/** 
 * API服务类
 * 
 * @author foundation
 * @date 2026-08-04
 */
@Slf4j
@Service
public class ApiService {


    /** 
     * 演示接口 
     * 
     * @param request 演示请求
     * @return 演示响应
     */
    public DemoResponse demo(DemoRequest request) {
        return new DemoResponse();
    }
 
}
