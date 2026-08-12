package com.foundation.business.domain;

import java.math.BigDecimal;
import java.util.Date;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;

/**
 * MySQL8常见字段类型示例对象 bsn_demo
 * 
 * @author foundation
 * @date 2026-08-04
 */
public class BsnDemo extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 主键ID */
    private Long id;

    /** tinyint类型字段，范围-128~127 */
    @Excel(name = "tinyint类型字段，范围-128~127")
    private Long tinyintCol;

    /** smallint类型字段，范围-32768~32767 */
    @Excel(name = "smallint类型字段，范围-32768~32767")
    private Long smallintCol;

    /** mediumint类型字段，范围-8388608~8388607 */
    @Excel(name = "mediumint类型字段，范围-8388608~8388607")
    private Long mediumintCol;

    /** int类型字段，范围-2147483648~2147483647 */
    @Excel(name = "int类型字段，范围-2147483648~2147483647")
    private Long intCol;

    /** bigint类型字段，范围-9223372036854775808~9223372036854775807 */
    @Excel(name = "bigint类型字段，范围-9223372036854775808~9223372036854775807")
    private Long bigintCol;

    /** tinyint无符号类型，范围0~255 */
    @Excel(name = "tinyint无符号类型，范围0~255")
    private String tinyintUnsignedCol;

    /** smallint无符号类型，范围0~65535 */
    @Excel(name = "smallint无符号类型，范围0~65535")
    private String smallintUnsignedCol;

    /** int无符号类型，范围0~4294967295 */
    @Excel(name = "int无符号类型，范围0~4294967295")
    private String intUnsignedCol;

    /** bigint无符号类型，范围0~18446744073709551615 */
    @Excel(name = "bigint无符号类型，范围0~18446744073709551615")
    private String bigintUnsignedCol;

    /** float单精度浮点类型 */
    @Excel(name = "float单精度浮点类型")
    private BigDecimal floatCol;

    /** double双精度浮点类型 */
    @Excel(name = "double双精度浮点类型")
    private BigDecimal doubleCol;

    /** decimal定点类型，用于高精度数值，如金额 */
    @Excel(name = "decimal定点类型，用于高精度数值，如金额")
    private BigDecimal decimalCol;

    /** bit位类型，用于存储位数据 */
    @Excel(name = "bit位类型，用于存储位数据")
    private Integer bitCol;

    /** boolean布尔类型，实际为tinyint(1)，0为false，非0为true */
    @Excel(name = "boolean布尔类型，实际为tinyint(1)，0为false，非0为true")
    private Integer booleanCol;

    /** char定长字符串类型，长度固定 */
    @Excel(name = "char定长字符串类型，长度固定")
    private String charCol;

    /** varchar变长字符串类型，长度可变 */
    @Excel(name = "varchar变长字符串类型，长度可变")
    private String varcharCol;

    /** tinytext短文本类型 */
    @Excel(name = "tinytext短文本类型")
    private String tinytextCol;

    /** text长文本类型 */
    @Excel(name = "text长文本类型")
    private String textCol;

    /** mediumtext中等长度文本类型 */
    @Excel(name = "mediumtext中等长度文本类型")
    private String mediumtextCol;

    /** longtext极大文本类型 */
    @Excel(name = "longtext极大文本类型")
    private String longtextCol;

    /** binary定长二进制字符串类型 */
    @Excel(name = "binary定长二进制字符串类型")
    private String binaryCol;

    /** varbinary变长二进制字符串类型 */
    @Excel(name = "varbinary变长二进制字符串类型")
    private String varbinaryCol;

    /** tinyblob小二进制数据类型 */
    @Excel(name = "tinyblob小二进制数据类型")
    private String tinyblobCol;

    /** blob二进制长文本类型 */
    @Excel(name = "blob二进制长文本类型")
    private String blobCol;

    /** mediumblob中等长度二进制数据类型 */
    @Excel(name = "mediumblob中等长度二进制数据类型")
    private String mediumblobCol;

    /** longblob极大二进制数据类型 */
    @Excel(name = "longblob极大二进制数据类型")
    private String longblobCol;

    /** enum枚举类型，只能从预定义值中选择单个值 */
    @Excel(name = "enum枚举类型，只能从预定义值中选择单个值")
    private String enumCol;

    /** set集合类型，可以从预定义值中选择多个值 */
    @Excel(name = "set集合类型，可以从预定义值中选择多个值")
    private String setCol;

    /** date日期类型，格式YYYY-MM-DD */
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Excel(name = "date日期类型，格式YYYY-MM-DD", width = 30, dateFormat = "yyyy-MM-dd")
    private Date dateCol;

    /** time时间类型，格式hh:mm:ss */
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Excel(name = "time时间类型，格式hh:mm:ss", width = 30, dateFormat = "yyyy-MM-dd")
    private Date timeCol;

    /** year年份类型，格式YYYY */
    @Excel(name = "year年份类型，格式YYYY")
    private String yearCol;

    /** datetime日期时间类型，格式YYYY-MM-DD hh:mm:ss */
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Excel(name = "datetime日期时间类型，格式YYYY-MM-DD hh:mm:ss", width = 30, dateFormat = "yyyy-MM-dd")
    private Date datetimeCol;

    /** timestamp时间戳类型，自动更新 */
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Excel(name = "timestamp时间戳类型，自动更新", width = 30, dateFormat = "yyyy-MM-dd")
    private Date timestampCol;

    /** json类型，用于存储JSON格式数据 */
    @Excel(name = "json类型，用于存储JSON格式数据")
    private String jsonCol;

    public void setId(Long id) 
    {
        this.id = id;
    }

    public Long getId() 
    {
        return id;
    }

    public void setTinyintCol(Long tinyintCol) 
    {
        this.tinyintCol = tinyintCol;
    }

    public Long getTinyintCol() 
    {
        return tinyintCol;
    }

    public void setSmallintCol(Long smallintCol) 
    {
        this.smallintCol = smallintCol;
    }

    public Long getSmallintCol() 
    {
        return smallintCol;
    }

    public void setMediumintCol(Long mediumintCol) 
    {
        this.mediumintCol = mediumintCol;
    }

    public Long getMediumintCol() 
    {
        return mediumintCol;
    }

    public void setIntCol(Long intCol) 
    {
        this.intCol = intCol;
    }

    public Long getIntCol() 
    {
        return intCol;
    }

    public void setBigintCol(Long bigintCol) 
    {
        this.bigintCol = bigintCol;
    }

    public Long getBigintCol() 
    {
        return bigintCol;
    }

    public void setTinyintUnsignedCol(String tinyintUnsignedCol) 
    {
        this.tinyintUnsignedCol = tinyintUnsignedCol;
    }

    public String getTinyintUnsignedCol() 
    {
        return tinyintUnsignedCol;
    }

    public void setSmallintUnsignedCol(String smallintUnsignedCol) 
    {
        this.smallintUnsignedCol = smallintUnsignedCol;
    }

    public String getSmallintUnsignedCol() 
    {
        return smallintUnsignedCol;
    }

    public void setIntUnsignedCol(String intUnsignedCol) 
    {
        this.intUnsignedCol = intUnsignedCol;
    }

    public String getIntUnsignedCol() 
    {
        return intUnsignedCol;
    }

    public void setBigintUnsignedCol(String bigintUnsignedCol) 
    {
        this.bigintUnsignedCol = bigintUnsignedCol;
    }

    public String getBigintUnsignedCol() 
    {
        return bigintUnsignedCol;
    }

    public void setFloatCol(BigDecimal floatCol) 
    {
        this.floatCol = floatCol;
    }

    public BigDecimal getFloatCol() 
    {
        return floatCol;
    }

    public void setDoubleCol(BigDecimal doubleCol) 
    {
        this.doubleCol = doubleCol;
    }

    public BigDecimal getDoubleCol() 
    {
        return doubleCol;
    }

    public void setDecimalCol(BigDecimal decimalCol) 
    {
        this.decimalCol = decimalCol;
    }

    public BigDecimal getDecimalCol() 
    {
        return decimalCol;
    }

    public void setBitCol(Integer bitCol) 
    {
        this.bitCol = bitCol;
    }

    public Integer getBitCol() 
    {
        return bitCol;
    }

    public void setBooleanCol(Integer booleanCol) 
    {
        this.booleanCol = booleanCol;
    }

    public Integer getBooleanCol() 
    {
        return booleanCol;
    }

    public void setCharCol(String charCol) 
    {
        this.charCol = charCol;
    }

    public String getCharCol() 
    {
        return charCol;
    }

    public void setVarcharCol(String varcharCol) 
    {
        this.varcharCol = varcharCol;
    }

    public String getVarcharCol() 
    {
        return varcharCol;
    }

    public void setTinytextCol(String tinytextCol) 
    {
        this.tinytextCol = tinytextCol;
    }

    public String getTinytextCol() 
    {
        return tinytextCol;
    }

    public void setTextCol(String textCol) 
    {
        this.textCol = textCol;
    }

    public String getTextCol() 
    {
        return textCol;
    }

    public void setMediumtextCol(String mediumtextCol) 
    {
        this.mediumtextCol = mediumtextCol;
    }

    public String getMediumtextCol() 
    {
        return mediumtextCol;
    }

    public void setLongtextCol(String longtextCol) 
    {
        this.longtextCol = longtextCol;
    }

    public String getLongtextCol() 
    {
        return longtextCol;
    }

    public void setBinaryCol(String binaryCol) 
    {
        this.binaryCol = binaryCol;
    }

    public String getBinaryCol() 
    {
        return binaryCol;
    }

    public void setVarbinaryCol(String varbinaryCol) 
    {
        this.varbinaryCol = varbinaryCol;
    }

    public String getVarbinaryCol() 
    {
        return varbinaryCol;
    }

    public void setTinyblobCol(String tinyblobCol) 
    {
        this.tinyblobCol = tinyblobCol;
    }

    public String getTinyblobCol() 
    {
        return tinyblobCol;
    }

    public void setBlobCol(String blobCol) 
    {
        this.blobCol = blobCol;
    }

    public String getBlobCol() 
    {
        return blobCol;
    }

    public void setMediumblobCol(String mediumblobCol) 
    {
        this.mediumblobCol = mediumblobCol;
    }

    public String getMediumblobCol() 
    {
        return mediumblobCol;
    }

    public void setLongblobCol(String longblobCol) 
    {
        this.longblobCol = longblobCol;
    }

    public String getLongblobCol() 
    {
        return longblobCol;
    }

    public void setEnumCol(String enumCol) 
    {
        this.enumCol = enumCol;
    }

    public String getEnumCol() 
    {
        return enumCol;
    }

    public void setSetCol(String setCol) 
    {
        this.setCol = setCol;
    }

    public String getSetCol() 
    {
        return setCol;
    }

    public void setDateCol(Date dateCol) 
    {
        this.dateCol = dateCol;
    }

    public Date getDateCol() 
    {
        return dateCol;
    }

    public void setTimeCol(Date timeCol) 
    {
        this.timeCol = timeCol;
    }

    public Date getTimeCol() 
    {
        return timeCol;
    }

    public void setYearCol(String yearCol) 
    {
        this.yearCol = yearCol;
    }

    public String getYearCol() 
    {
        return yearCol;
    }

    public void setDatetimeCol(Date datetimeCol) 
    {
        this.datetimeCol = datetimeCol;
    }

    public Date getDatetimeCol() 
    {
        return datetimeCol;
    }

    public void setTimestampCol(Date timestampCol) 
    {
        this.timestampCol = timestampCol;
    }

    public Date getTimestampCol() 
    {
        return timestampCol;
    }

    public void setJsonCol(String jsonCol) 
    {
        this.jsonCol = jsonCol;
    }

    public String getJsonCol() 
    {
        return jsonCol;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this,ToStringStyle.MULTI_LINE_STYLE)
            .append("id", getId())
            .append("tinyintCol", getTinyintCol())
            .append("smallintCol", getSmallintCol())
            .append("mediumintCol", getMediumintCol())
            .append("intCol", getIntCol())
            .append("bigintCol", getBigintCol())
            .append("tinyintUnsignedCol", getTinyintUnsignedCol())
            .append("smallintUnsignedCol", getSmallintUnsignedCol())
            .append("intUnsignedCol", getIntUnsignedCol())
            .append("bigintUnsignedCol", getBigintUnsignedCol())
            .append("floatCol", getFloatCol())
            .append("doubleCol", getDoubleCol())
            .append("decimalCol", getDecimalCol())
            .append("bitCol", getBitCol())
            .append("booleanCol", getBooleanCol())
            .append("charCol", getCharCol())
            .append("varcharCol", getVarcharCol())
            .append("tinytextCol", getTinytextCol())
            .append("textCol", getTextCol())
            .append("mediumtextCol", getMediumtextCol())
            .append("longtextCol", getLongtextCol())
            .append("binaryCol", getBinaryCol())
            .append("varbinaryCol", getVarbinaryCol())
            .append("tinyblobCol", getTinyblobCol())
            .append("blobCol", getBlobCol())
            .append("mediumblobCol", getMediumblobCol())
            .append("longblobCol", getLongblobCol())
            .append("enumCol", getEnumCol())
            .append("setCol", getSetCol())
            .append("dateCol", getDateCol())
            .append("timeCol", getTimeCol())
            .append("yearCol", getYearCol())
            .append("datetimeCol", getDatetimeCol())
            .append("timestampCol", getTimestampCol())
            .append("jsonCol", getJsonCol())
            .toString();
    }
}
