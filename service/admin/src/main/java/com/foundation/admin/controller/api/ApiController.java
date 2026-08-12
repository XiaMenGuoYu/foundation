package com.foundation.admin.controller.api;

import com.foundation.admin.controller.api.request.DemoRequest;
import com.foundation.admin.controller.api.response.DemoResponse;
import com.foundation.admin.service.ApiService;
import com.ruoyi.common.annotation.Anonymous;
import com.ruoyi.common.core.controller.BaseController;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;

/** 匿名公开资源导航接口。 */
@Anonymous
@Validated
@RestController
@RequestMapping("/api")
public class ApiController extends BaseController {

  private final ApiService apiService;

  public ApiController(ApiService apiService) {
    this.apiService = apiService;
  }

  /**
   * 演示接口
   * 
   * @param request 演示请求
   * @return 演示响应
   */
  @PostMapping("/demo")
  public DemoResponse demo(@RequestBody DemoRequest request) {
    return apiService.demo(request);
  }

}
