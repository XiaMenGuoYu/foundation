package com.foundation.admin.controller.api.request;

import lombok.Data;

/** 
 * 演示请求
 * 
 * @author foundation
 * @date 2026-08-04
 */
@Data
public class DemoRequest {

    /** 
     * 姓名
     */
    private String name;
    /** 
     * 年龄
     */
    private Integer age;

}
