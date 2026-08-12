<template>
  <div class="demo">
    <h1 class="demo__title">接口演示</h1>
    <p class="demo__desc">提交姓名与年龄，调用公开接口 <code>POST /api/demo</code> 并展示响应。</p>
    <form class="demo-form" @submit.prevent="handleSubmit">
      <div class="demo-form__item">
        <label class="demo-form__label" for="demo-name">姓名</label>
        <input
          id="demo-name"
          v-model="form.name"
          class="demo-form__input"
          type="text"
          maxlength="30"
          placeholder="请输入姓名"
        />
      </div>
      <div class="demo-form__item">
        <label class="demo-form__label" for="demo-age">年龄</label>
        <input
          id="demo-age"
          v-model.number="form.age"
          class="demo-form__input"
          type="number"
          min="0"
          max="150"
          placeholder="请输入年龄"
        />
      </div>
      <p v-if="errorTip" class="demo-form__error" role="alert">{{ errorTip }}</p>
      <button type="submit" class="demo-form__submit" :disabled="loading">
        <span v-if="!loading">提交</span>
        <span v-else>提交中...</span>
      </button>
    </form>
    <div v-if="result" class="demo-result">
      <h2 class="demo-result__title">响应结果</h2>
      <dl class="demo-result__list">
        <dt>姓名</dt>
        <dd>{{ result.name ?? '(空)' }}</dd>
        <dt>年龄</dt>
        <dd>{{ result.age ?? '(空)' }}</dd>
      </dl>
    </div>
  </div>
</template>

<script setup>
import { demo } from '@/api/demo'

const form = ref({
  name: '',
  age: null
})
const loading = ref(false)
const errorTip = ref('')
const result = ref(null)

function validate() {
  if (!form.value.name || !form.value.name.trim()) {
    errorTip.value = '请输入姓名'
    return false
  }
  if (form.value.age === null || form.value.age === '' || Number.isNaN(form.value.age)) {
    errorTip.value = '请输入年龄'
    return false
  }
  if (form.value.age < 0 || form.value.age > 150) {
    errorTip.value = '年龄需在 0 到 150 之间'
    return false
  }
  errorTip.value = ''
  return true
}

function handleSubmit() {
  if (loading.value || !validate()) {
    return
  }
  loading.value = true
  result.value = null
  demo({ name: form.value.name.trim(), age: form.value.age })
    .then((res) => {
      result.value = res
    })
    .catch(() => {
      // 网络与协议错误由请求层统一提示，这里仅结束加载态
    })
    .finally(() => {
      loading.value = false
    })
}
</script>

<style lang="scss" scoped>
.demo {
  max-width: 640px;
  margin: 0 auto;
  padding: 48px 16px;
}

.demo__title {
  margin: 0;
  font-size: 24px;
  color: var(--color-text);
}

.demo__desc {
  margin: 8px 0 24px;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.demo-form {
  background: #ffffff;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 24px;
}

.demo-form__item {
  margin-bottom: 20px;
}

.demo-form__label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: var(--color-text);
}

.demo-form__input {
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 14px;
  color: var(--color-text);
  outline: none;

  &:focus {
    border-color: var(--color-primary);
  }
}

.demo-form__error {
  margin: 0 0 16px;
  font-size: 13px;
  color: var(--color-danger);
}

.demo-form__submit {
  width: 100%;
  height: 40px;
  border: none;
  border-radius: 4px;
  background: var(--color-primary);
  color: #ffffff;
  font-size: 15px;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.demo-result {
  margin-top: 24px;
  background: #ffffff;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 24px;
}

.demo-result__title {
  margin: 0 0 16px;
  font-size: 16px;
  color: var(--color-text);
}

.demo-result__list {
  margin: 0;
  display: grid;
  grid-template-columns: 80px 1fr;
  row-gap: 8px;
  font-size: 14px;

  dt {
    color: var(--color-text-secondary);
  }

  dd {
    margin: 0;
    color: var(--color-text);
    word-break: break-all;
  }
}
</style>
