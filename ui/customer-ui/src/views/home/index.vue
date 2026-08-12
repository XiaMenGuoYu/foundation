<template>
  <div class="home">
    <h1 class="home__title">{{ title }}</h1>
    <p class="home__desc">用户端首页，业务功能建设中。</p>
  </div>
</template>

<script setup>
import defaultSettings from '@/settings'

const title = defaultSettings.title
</script>

<style lang="scss" scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 64px 16px;
  text-align: center;
}

.home__title {
  font-size: 28px;
  color: var(--color-text);
}

.home__desc {
  margin-top: 12px;
  font-size: 14px;
  color: var(--color-text-secondary);
}
</style>
