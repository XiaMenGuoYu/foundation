<template>
  <div class="site-layout">
    <header class="site-header">
      <div class="site-header__inner">
        <router-link to="/" class="site-logo">{{ title }}</router-link>
        <nav class="site-nav" aria-label="主导航">
          <router-link to="/" class="site-nav__item">首页</router-link>
          <router-link to="/demo" class="site-nav__item">接口演示</router-link>
        </nav>
        <div class="site-account">
          <template v-if="userStore.token">
            <span class="site-account__name">{{ userStore.nickName || userStore.name }}</span>
            <button type="button" class="site-account__action" @click="handleLogout">
              退出登录
            </button>
          </template>
          <router-link v-else to="/login" class="site-account__action">登录</router-link>
        </div>
      </div>
    </header>
    <main class="site-main">
      <router-view />
    </main>
    <footer class="site-footer">{{ footerContent }}</footer>
  </div>
</template>

<script setup>
import defaultSettings from '@/settings'
import useUserStore from '@/store/modules/user'
import { toastSuccess } from '@/plugins/toast'

const title = defaultSettings.title
const footerContent = defaultSettings.footerContent
const userStore = useUserStore()
const router = useRouter()

function handleLogout() {
  userStore.logOut().then(() => {
    toastSuccess('已退出登录')
    router.push('/')
  })
}
</script>

<style lang="scss" scoped>
.site-layout {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

.site-header {
  background: #ffffff;
  border-bottom: 1px solid var(--color-border);
}

.site-header__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  height: 56px;
  display: flex;
  align-items: center;
  gap: 32px;
}

.site-logo {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: none;
}

.site-nav {
  flex: 1;
  display: flex;
  gap: 24px;
}

.site-nav__item {
  color: var(--color-text);
  text-decoration: none;
  font-size: 14px;

  &:hover,
  &.router-link-active {
    color: var(--color-primary);
  }
}

.site-account {
  display: flex;
  align-items: center;
  gap: 12px;
}

.site-account__name {
  font-size: 14px;
  color: var(--color-text);
}

.site-account__action {
  border: none;
  background: none;
  padding: 0;
  font-size: 14px;
  color: var(--color-primary);
  cursor: pointer;
  text-decoration: none;
}

.site-main {
  flex: 1;
}

.site-footer {
  padding: 16px;
  text-align: center;
  font-size: 12px;
  color: var(--color-text-secondary);
}
</style>
