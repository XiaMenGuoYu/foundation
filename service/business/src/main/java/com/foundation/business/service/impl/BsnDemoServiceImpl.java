package com.foundation.business.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.foundation.business.domain.BsnDemo;
import com.foundation.business.mapper.BsnDemoMapper;
import com.foundation.business.service.IBsnDemoService;

/**
 * MySQL8常见字段类型示例Service业务层处理
 * 
 * @author foundation
 * @date 2026-08-04
 */
@Service
public class BsnDemoServiceImpl implements IBsnDemoService 
{
    @Autowired
    private BsnDemoMapper bsnDemoMapper;

    /**
     * 查询MySQL8常见字段类型示例
     * 
     * @param id MySQL8常见字段类型示例主键
     * @return MySQL8常见字段类型示例
     */
    @Override
    public BsnDemo selectBsnDemoById(Long id)
    {
        return bsnDemoMapper.selectBsnDemoById(id);
    }

    /**
     * 查询MySQL8常见字段类型示例列表
     * 
     * @param bsnDemo MySQL8常见字段类型示例
     * @return MySQL8常见字段类型示例
     */
    @Override
    public List<BsnDemo> selectBsnDemoList(BsnDemo bsnDemo)
    {
        return bsnDemoMapper.selectBsnDemoList(bsnDemo);
    }

    /**
     * 新增MySQL8常见字段类型示例
     * 
     * @param bsnDemo MySQL8常见字段类型示例
     * @return 结果
     */
    @Override
    public int insertBsnDemo(BsnDemo bsnDemo)
    {
        return bsnDemoMapper.insertBsnDemo(bsnDemo);
    }

    /**
     * 修改MySQL8常见字段类型示例
     * 
     * @param bsnDemo MySQL8常见字段类型示例
     * @return 结果
     */
    @Override
    public int updateBsnDemo(BsnDemo bsnDemo)
    {
        return bsnDemoMapper.updateBsnDemo(bsnDemo);
    }

    /**
     * 批量删除MySQL8常见字段类型示例
     * 
     * @param ids 需要删除的MySQL8常见字段类型示例主键
     * @return 结果
     */
    @Override
    public int deleteBsnDemoByIds(Long[] ids)
    {
        return bsnDemoMapper.deleteBsnDemoByIds(ids);
    }

    /**
     * 删除MySQL8常见字段类型示例信息
     * 
     * @param id MySQL8常见字段类型示例主键
     * @return 结果
     */
    @Override
    public int deleteBsnDemoById(Long id)
    {
        return bsnDemoMapper.deleteBsnDemoById(id);
    }
}
