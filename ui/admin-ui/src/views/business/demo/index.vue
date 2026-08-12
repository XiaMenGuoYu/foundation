<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="tinyint类型字段，范围-128~127" prop="tinyintCol">
        <el-input
          v-model="queryParams.tinyintCol"
          placeholder="请输入tinyint类型字段，范围-128~127"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="smallint类型字段，范围-32768~32767" prop="smallintCol">
        <el-input
          v-model="queryParams.smallintCol"
          placeholder="请输入smallint类型字段，范围-32768~32767"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="mediumint类型字段，范围-8388608~8388607" prop="mediumintCol">
        <el-input
          v-model="queryParams.mediumintCol"
          placeholder="请输入mediumint类型字段，范围-8388608~8388607"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="int类型字段，范围-2147483648~2147483647" prop="intCol">
        <el-input
          v-model="queryParams.intCol"
          placeholder="请输入int类型字段，范围-2147483648~2147483647"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="bigint类型字段，范围-9223372036854775808~9223372036854775807" prop="bigintCol">
        <el-input
          v-model="queryParams.bigintCol"
          placeholder="请输入bigint类型字段，范围-9223372036854775808~9223372036854775807"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="float单精度浮点类型" prop="floatCol">
        <el-input
          v-model="queryParams.floatCol"
          placeholder="请输入float单精度浮点类型"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="double双精度浮点类型" prop="doubleCol">
        <el-input
          v-model="queryParams.doubleCol"
          placeholder="请输入double双精度浮点类型"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="decimal定点类型，用于高精度数值，如金额" prop="decimalCol">
        <el-input
          v-model="queryParams.decimalCol"
          placeholder="请输入decimal定点类型，用于高精度数值，如金额"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="bit位类型，用于存储位数据" prop="bitCol">
        <el-input
          v-model="queryParams.bitCol"
          placeholder="请输入bit位类型，用于存储位数据"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="boolean布尔类型，实际为tinyint(1)，0为false，非0为true" prop="booleanCol">
        <el-input
          v-model="queryParams.booleanCol"
          placeholder="请输入boolean布尔类型，实际为tinyint(1)，0为false，非0为true"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="char定长字符串类型，长度固定" prop="charCol">
        <el-input
          v-model="queryParams.charCol"
          placeholder="请输入char定长字符串类型，长度固定"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="varchar变长字符串类型，长度可变" prop="varcharCol">
        <el-input
          v-model="queryParams.varcharCol"
          placeholder="请输入varchar变长字符串类型，长度可变"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="date日期类型，格式YYYY-MM-DD" prop="dateCol">
        <el-date-picker clearable
          v-model="queryParams.dateCol"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择date日期类型，格式YYYY-MM-DD">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="time时间类型，格式hh:mm:ss" prop="timeCol">
        <el-date-picker clearable
          v-model="queryParams.timeCol"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择time时间类型，格式hh:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="datetime日期时间类型，格式YYYY-MM-DD hh:mm:ss" prop="datetimeCol">
        <el-date-picker clearable
          v-model="queryParams.datetimeCol"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择datetime日期时间类型，格式YYYY-MM-DD hh:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="timestamp时间戳类型，自动更新" prop="timestampCol">
        <el-date-picker clearable
          v-model="queryParams.timestampCol"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择timestamp时间戳类型，自动更新">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['business:demo:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['business:demo:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['business:demo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['business:demo:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="demoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键ID" align="center" prop="id" />
      <el-table-column label="tinyint类型字段，范围-128~127" align="center" prop="tinyintCol" />
      <el-table-column label="smallint类型字段，范围-32768~32767" align="center" prop="smallintCol" />
      <el-table-column label="mediumint类型字段，范围-8388608~8388607" align="center" prop="mediumintCol" />
      <el-table-column label="int类型字段，范围-2147483648~2147483647" align="center" prop="intCol" />
      <el-table-column label="bigint类型字段，范围-9223372036854775808~9223372036854775807" align="center" prop="bigintCol" />
      <el-table-column label="tinyint无符号类型，范围0~255" align="center" prop="tinyintUnsignedCol" />
      <el-table-column label="smallint无符号类型，范围0~65535" align="center" prop="smallintUnsignedCol" />
      <el-table-column label="int无符号类型，范围0~4294967295" align="center" prop="intUnsignedCol" />
      <el-table-column label="bigint无符号类型，范围0~18446744073709551615" align="center" prop="bigintUnsignedCol" />
      <el-table-column label="float单精度浮点类型" align="center" prop="floatCol" />
      <el-table-column label="double双精度浮点类型" align="center" prop="doubleCol" />
      <el-table-column label="decimal定点类型，用于高精度数值，如金额" align="center" prop="decimalCol" />
      <el-table-column label="bit位类型，用于存储位数据" align="center" prop="bitCol" />
      <el-table-column label="boolean布尔类型，实际为tinyint(1)，0为false，非0为true" align="center" prop="booleanCol" />
      <el-table-column label="char定长字符串类型，长度固定" align="center" prop="charCol" />
      <el-table-column label="varchar变长字符串类型，长度可变" align="center" prop="varcharCol" />
      <el-table-column label="tinytext短文本类型" align="center" prop="tinytextCol" />
      <el-table-column label="text长文本类型" align="center" prop="textCol" />
      <el-table-column label="mediumtext中等长度文本类型" align="center" prop="mediumtextCol" />
      <el-table-column label="longtext极大文本类型" align="center" prop="longtextCol" />
      <el-table-column label="binary定长二进制字符串类型" align="center" prop="binaryCol" />
      <el-table-column label="varbinary变长二进制字符串类型" align="center" prop="varbinaryCol" />
      <el-table-column label="tinyblob小二进制数据类型" align="center" prop="tinyblobCol" />
      <el-table-column label="blob二进制长文本类型" align="center" prop="blobCol" />
      <el-table-column label="mediumblob中等长度二进制数据类型" align="center" prop="mediumblobCol" />
      <el-table-column label="longblob极大二进制数据类型" align="center" prop="longblobCol" />
      <el-table-column label="enum枚举类型，只能从预定义值中选择单个值" align="center" prop="enumCol" />
      <el-table-column label="set集合类型，可以从预定义值中选择多个值" align="center" prop="setCol" />
      <el-table-column label="date日期类型，格式YYYY-MM-DD" align="center" prop="dateCol" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.dateCol, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="time时间类型，格式hh:mm:ss" align="center" prop="timeCol" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.timeCol, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="year年份类型，格式YYYY" align="center" prop="yearCol" />
      <el-table-column label="datetime日期时间类型，格式YYYY-MM-DD hh:mm:ss" align="center" prop="datetimeCol" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.datetimeCol, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="timestamp时间戳类型，自动更新" align="center" prop="timestampCol" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.timestampCol, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="json类型，用于存储JSON格式数据" align="center" prop="jsonCol" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['business:demo:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['business:demo:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改MySQL8常见字段类型示例对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="demoRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="tinyint类型字段，范围-128~127" prop="tinyintCol">
          <el-input v-model="form.tinyintCol" placeholder="请输入tinyint类型字段，范围-128~127" />
        </el-form-item>
        <el-form-item label="smallint类型字段，范围-32768~32767" prop="smallintCol">
          <el-input v-model="form.smallintCol" placeholder="请输入smallint类型字段，范围-32768~32767" />
        </el-form-item>
        <el-form-item label="mediumint类型字段，范围-8388608~8388607" prop="mediumintCol">
          <el-input v-model="form.mediumintCol" placeholder="请输入mediumint类型字段，范围-8388608~8388607" />
        </el-form-item>
        <el-form-item label="int类型字段，范围-2147483648~2147483647" prop="intCol">
          <el-input v-model="form.intCol" placeholder="请输入int类型字段，范围-2147483648~2147483647" />
        </el-form-item>
        <el-form-item label="bigint类型字段，范围-9223372036854775808~9223372036854775807" prop="bigintCol">
          <el-input v-model="form.bigintCol" placeholder="请输入bigint类型字段，范围-9223372036854775808~9223372036854775807" />
        </el-form-item>
        <el-form-item label="float单精度浮点类型" prop="floatCol">
          <el-input v-model="form.floatCol" placeholder="请输入float单精度浮点类型" />
        </el-form-item>
        <el-form-item label="double双精度浮点类型" prop="doubleCol">
          <el-input v-model="form.doubleCol" placeholder="请输入double双精度浮点类型" />
        </el-form-item>
        <el-form-item label="decimal定点类型，用于高精度数值，如金额" prop="decimalCol">
          <el-input v-model="form.decimalCol" placeholder="请输入decimal定点类型，用于高精度数值，如金额" />
        </el-form-item>
        <el-form-item label="bit位类型，用于存储位数据" prop="bitCol">
          <el-input v-model="form.bitCol" placeholder="请输入bit位类型，用于存储位数据" />
        </el-form-item>
        <el-form-item label="boolean布尔类型，实际为tinyint(1)，0为false，非0为true" prop="booleanCol">
          <el-input v-model="form.booleanCol" placeholder="请输入boolean布尔类型，实际为tinyint(1)，0为false，非0为true" />
        </el-form-item>
        <el-form-item label="char定长字符串类型，长度固定" prop="charCol">
          <el-input v-model="form.charCol" placeholder="请输入char定长字符串类型，长度固定" />
        </el-form-item>
        <el-form-item label="varchar变长字符串类型，长度可变" prop="varcharCol">
          <el-input v-model="form.varcharCol" placeholder="请输入varchar变长字符串类型，长度可变" />
        </el-form-item>
        <el-form-item label="tinytext短文本类型" prop="tinytextCol">
          <el-input v-model="form.tinytextCol" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="text长文本类型" prop="textCol">
          <el-input v-model="form.textCol" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="mediumtext中等长度文本类型" prop="mediumtextCol">
          <el-input v-model="form.mediumtextCol" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="longtext极大文本类型" prop="longtextCol">
          <el-input v-model="form.longtextCol" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="date日期类型，格式YYYY-MM-DD" prop="dateCol">
          <el-date-picker clearable
            v-model="form.dateCol"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择date日期类型，格式YYYY-MM-DD">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="time时间类型，格式hh:mm:ss" prop="timeCol">
          <el-date-picker clearable
            v-model="form.timeCol"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择time时间类型，格式hh:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="datetime日期时间类型，格式YYYY-MM-DD hh:mm:ss" prop="datetimeCol">
          <el-date-picker clearable
            v-model="form.datetimeCol"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择datetime日期时间类型，格式YYYY-MM-DD hh:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="timestamp时间戳类型，自动更新" prop="timestampCol">
          <el-date-picker clearable
            v-model="form.timestampCol"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择timestamp时间戳类型，自动更新">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Demo">
import { listDemo, getDemo, delDemo, addDemo, updateDemo } from "@/api/business/demo"

const { proxy } = getCurrentInstance()

const demoList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    tinyintCol: null,
    smallintCol: null,
    mediumintCol: null,
    intCol: null,
    bigintCol: null,
    tinyintUnsignedCol: null,
    smallintUnsignedCol: null,
    intUnsignedCol: null,
    bigintUnsignedCol: null,
    floatCol: null,
    doubleCol: null,
    decimalCol: null,
    bitCol: null,
    booleanCol: null,
    charCol: null,
    varcharCol: null,
    tinytextCol: null,
    textCol: null,
    mediumtextCol: null,
    longtextCol: null,
    binaryCol: null,
    varbinaryCol: null,
    tinyblobCol: null,
    blobCol: null,
    mediumblobCol: null,
    longblobCol: null,
    enumCol: null,
    setCol: null,
    dateCol: null,
    timeCol: null,
    yearCol: null,
    datetimeCol: null,
    timestampCol: null,
    jsonCol: null
  },
  rules: {
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询MySQL8常见字段类型示例列表 */
function getList() {
  loading.value = true
  listDemo(queryParams.value).then(response => {
    demoList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

// 取消按钮
function cancel() {
  open.value = false
  reset()
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    tinyintCol: null,
    smallintCol: null,
    mediumintCol: null,
    intCol: null,
    bigintCol: null,
    tinyintUnsignedCol: null,
    smallintUnsignedCol: null,
    intUnsignedCol: null,
    bigintUnsignedCol: null,
    floatCol: null,
    doubleCol: null,
    decimalCol: null,
    bitCol: null,
    booleanCol: null,
    charCol: null,
    varcharCol: null,
    tinytextCol: null,
    textCol: null,
    mediumtextCol: null,
    longtextCol: null,
    binaryCol: null,
    varbinaryCol: null,
    tinyblobCol: null,
    blobCol: null,
    mediumblobCol: null,
    longblobCol: null,
    enumCol: null,
    setCol: null,
    dateCol: null,
    timeCol: null,
    yearCol: null,
    datetimeCol: null,
    timestampCol: null,
    jsonCol: null
  }
  proxy.resetForm("demoRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加MySQL8常见字段类型示例"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _id = row.id || ids.value
  getDemo(_id).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改MySQL8常见字段类型示例"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["demoRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateDemo(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addDemo(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功")
          open.value = false
          getList()
        })
      }
    }
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value
  proxy.$modal.confirm('是否确认删除MySQL8常见字段类型示例编号为"' + _ids + '"的数据项？').then(function() {
    return delDemo(_ids)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('business/demo/export', {
    ...queryParams.value
  }, `demo_${new Date().getTime()}.xlsx`)
}

getList()
</script>
