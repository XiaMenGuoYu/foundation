<template>
  <div class="error-page">
    <div class="error-page__code">404</div>
    <p class="error-page__desc">页面不存在或已被移除</p>
    <router-link to="/" class="error-page__link">返回首页</router-link>
  </div>
</template>

<style lang="scss" scoped>
.error-page {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 16px;
  box-sizing: border-box;
}

.error-page__code {
  font-size: 72px;
  font-weight: 600;
  color: var(--color-primary);
}

.error-page__desc {
  margin: 16px 0 24px;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.error-page__link {
  color: var(--color-primary);
  font-size: 14px;
  text-decoration: none;
}
</style>
