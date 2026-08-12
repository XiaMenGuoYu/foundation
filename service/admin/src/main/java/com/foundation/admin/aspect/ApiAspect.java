package com.foundation.admin.aspect;

import com.ruoyi.common.core.domain.entity.SysUser;
import com.ruoyi.common.core.domain.model.LoginUser;
import com.ruoyi.common.exception.ServiceException;

import jakarta.servlet.http.HttpServletRequest;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.HashSet;

/**
 * API切面: 处理API请求的权限验证
 * 
 * @author foundation
 * @date 2026-08-04
 */
@Aspect
@Component
public class ApiAspect {

    /** API密钥 */
    private final static String API_KEY = "foundation";

    @Pointcut("execution(* com.foundation.admin.controller.api.*ApiController.*(..))")
    public void apiPointcut() {}

    @Before("apiPointcut()")
    public void doBefore(JoinPoint joinPoint) {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes.getRequest();

        
        String apiKey = request.getHeader("api-key");
        if (API_KEY.equals(apiKey) ) {
            // 设置虚拟用户到SecurityContextHolder
            SysUser sysUser = new SysUser();
            sysUser.setUserId(1L);
            sysUser.setUserName("api");
            LoginUser virtualUser = new LoginUser(1L, 1L, sysUser, new HashSet<>());
            Authentication authentication = new UsernamePasswordAuthenticationToken(virtualUser, null, virtualUser.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);
        } else {
            throw new ServiceException("权限不足，无法调用");
        }
    }

}