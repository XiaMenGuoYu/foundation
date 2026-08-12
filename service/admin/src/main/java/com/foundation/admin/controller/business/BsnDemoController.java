package com.foundation.admin.controller.business;

import java.util.List;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.foundation.business.domain.BsnDemo;
import com.foundation.business.service.IBsnDemoService;
import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.common.core.page.TableDataInfo;

/**
 * MySQL8常见字段类型示例Controller
 * 
 * @author foundation
 * @date 2026-08-04
 */
@RestController
@RequestMapping("/business/demo")
public class BsnDemoController extends BaseController
{
    @Autowired
    private IBsnDemoService bsnDemoService;

    /**
     * 查询MySQL8常见字段类型示例列表
     */
    @PreAuthorize("@ss.hasPermi('business:demo:list')")
    @GetMapping("/list")
    public TableDataInfo list(BsnDemo bsnDemo)
    {
        startPage();
        List<BsnDemo> list = bsnDemoService.selectBsnDemoList(bsnDemo);
        return getDataTable(list);
    }

    /**
     * 导出MySQL8常见字段类型示例列表
     */
    @PreAuthorize("@ss.hasPermi('business:demo:export')")
    @Log(title = "MySQL8常见字段类型示例", businessType = BusinessType.EXPORT)
    @PostMapping("/export")
    public void export(HttpServletResponse response, BsnDemo bsnDemo)
    {
        List<BsnDemo> list = bsnDemoService.selectBsnDemoList(bsnDemo);
        ExcelUtil<BsnDemo> util = new ExcelUtil<BsnDemo>(BsnDemo.class);
        util.exportExcel(response, list, "MySQL8常见字段类型示例数据");
    }

    /**
     * 获取MySQL8常见字段类型示例详细信息
     */
    @PreAuthorize("@ss.hasPermi('business:demo:query')")
    @GetMapping(value = "/{id}")
    public AjaxResult getInfo(@PathVariable("id") Long id)
    {
        return success(bsnDemoService.selectBsnDemoById(id));
    }

    /**
     * 新增MySQL8常见字段类型示例
     */
    @PreAuthorize("@ss.hasPermi('business:demo:add')")
    @Log(title = "MySQL8常见字段类型示例", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@RequestBody BsnDemo bsnDemo)
    {
        return toAjax(bsnDemoService.insertBsnDemo(bsnDemo));
    }

    /**
     * 修改MySQL8常见字段类型示例
     */
    @PreAuthorize("@ss.hasPermi('business:demo:edit')")
    @Log(title = "MySQL8常见字段类型示例", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@RequestBody BsnDemo bsnDemo)
    {
        return toAjax(bsnDemoService.updateBsnDemo(bsnDemo));
    }

    /**
     * 删除MySQL8常见字段类型示例
     */
    @PreAuthorize("@ss.hasPermi('business:demo:remove')")
    @Log(title = "MySQL8常见字段类型示例", businessType = BusinessType.DELETE)
	@DeleteMapping("/{ids}")
    public AjaxResult remove(@PathVariable Long[] ids)
    {
        return toAjax(bsnDemoService.deleteBsnDemoByIds(ids));
    }
}
