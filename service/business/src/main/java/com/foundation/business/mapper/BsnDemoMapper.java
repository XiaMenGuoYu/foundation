package com.foundation.business.mapper;

import java.util.List;

import com.foundation.business.domain.BsnDemo;

/**
 * MySQL8常见字段类型示例Mapper接口
 * 
 * @author foundation
 * @date 2026-08-04
 */
public interface BsnDemoMapper 
{
    /**
     * 查询MySQL8常见字段类型示例
     * 
     * @param id MySQL8常见字段类型示例主键
     * @return MySQL8常见字段类型示例
     */
    public BsnDemo selectBsnDemoById(Long id);

    /**
     * 查询MySQL8常见字段类型示例列表
     * 
     * @param bsnDemo MySQL8常见字段类型示例
     * @return MySQL8常见字段类型示例集合
     */
    public List<BsnDemo> selectBsnDemoList(BsnDemo bsnDemo);

    /**
     * 新增MySQL8常见字段类型示例
     * 
     * @param bsnDemo MySQL8常见字段类型示例
     * @return 结果
     */
    public int insertBsnDemo(BsnDemo bsnDemo);

    /**
     * 修改MySQL8常见字段类型示例
     * 
     * @param bsnDemo MySQL8常见字段类型示例
     * @return 结果
     */
    public int updateBsnDemo(BsnDemo bsnDemo);

    /**
     * 删除MySQL8常见字段类型示例
     * 
     * @param id MySQL8常见字段类型示例主键
     * @return 结果
     */
    public int deleteBsnDemoById(Long id);

    /**
     * 批量删除MySQL8常见字段类型示例
     * 
     * @param ids 需要删除的数据主键集合
     * @return 结果
     */
    public int deleteBsnDemoByIds(Long[] ids);
}
