<template>
  <div class="login">
    <form class="login-form" @submit.prevent="handleLogin">
      <h3 class="login-form__title">{{ title }}</h3>
      <div class="login-form__item">
        <label class="login-form__label" for="login-username">账号</label>
        <div class="login-form__control">
          <svg-icon icon-class="user" class="login-form__icon" />
          <input
            id="login-username"
            v-model="loginForm.username"
            type="text"
            autocomplete="off"
            placeholder="请输入账号"
          />
        </div>
      </div>
      <div class="login-form__item">
        <label class="login-form__label" for="login-password">密码</label>
        <div class="login-form__control">
          <svg-icon icon-class="password" class="login-form__icon" />
          <input
            id="login-password"
            v-model="loginForm.password"
            type="password"
            autocomplete="off"
            placeholder="请输入密码"
            @keyup.enter="handleLogin"
          />
        </div>
      </div>
      <div v-if="captchaEnabled" class="login-form__item">
        <label class="login-form__label" for="login-code">验证码</label>
        <div class="login-form__captcha">
          <div class="login-form__control">
            <svg-icon icon-class="validCode" class="login-form__icon" />
            <input
              id="login-code"
              v-model="loginForm.code"
              type="text"
              autocomplete="off"
              placeholder="请输入验证码"
              @keyup.enter="handleLogin"
            />
          </div>
          <img
            v-if="codeUrl"
            :src="codeUrl"
            class="login-form__captcha-img"
            alt="验证码"
            @click="getCode"
          />
        </div>
      </div>
      <label class="login-form__remember">
        <input v-model="loginForm.rememberMe" type="checkbox" />
        <span>记住密码</span>
      </label>
      <p v-if="errorTip" class="login-form__error" role="alert">{{ errorTip }}</p>
      <button type="submit" class="login-form__submit" :disabled="loading">
        <span v-if="!loading">登 录</span>
        <span v-else>登 录 中...</span>
      </button>
    </form>
    <div class="login-footer">
      <span>{{ footerContent }}</span>
    </div>
  </div>
</template>

<script setup>
import { getCodeImg } from '@/api/login'
import Cookies from 'js-cookie'
import { encrypt, decrypt } from '@/utils/jsencrypt'
import useUserStore from '@/store/modules/user'
import defaultSettings from '@/settings'

const title = defaultSettings.title
const footerContent = defaultSettings.footerContent
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

const loginForm = ref({
  username: '',
  password: '',
  rememberMe: false,
  code: '',
  uuid: ''
})

const codeUrl = ref('')
const loading = ref(false)
const errorTip = ref('')
// 验证码开关
const captchaEnabled = ref(true)
const redirect = ref(undefined)

watch(
  route,
  (newRoute) => {
    redirect.value = newRoute.query && newRoute.query.redirect
  },
  { immediate: true }
)

function validate() {
  if (!loginForm.value.username) {
    errorTip.value = '请输入账号'
    return false
  }
  if (!loginForm.value.password) {
    errorTip.value = '请输入密码'
    return false
  }
  if (captchaEnabled.value && !loginForm.value.code) {
    errorTip.value = '请输入验证码'
    return false
  }
  errorTip.value = ''
  return true
}

function handleLogin() {
  if (loading.value || !validate()) {
    return
  }
  loading.value = true
  // 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码
  if (loginForm.value.rememberMe) {
    Cookies.set('username', loginForm.value.username, { expires: 30 })
    Cookies.set('password', encrypt(loginForm.value.password), { expires: 30 })
    Cookies.set('rememberMe', loginForm.value.rememberMe, { expires: 30 })
  } else {
    // 否则移除
    Cookies.remove('username')
    Cookies.remove('password')
    Cookies.remove('rememberMe')
  }
  // 调用action的登录方法
  userStore
    .login(loginForm.value)
    .then(() => {
      const query = route.query
      const otherQueryParams = Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
      router.push({ path: redirect.value || '/', query: otherQueryParams })
    })
    .catch(() => {
      loading.value = false
      // 重新获取验证码
      if (captchaEnabled.value) {
        getCode()
      }
    })
}

function getCode() {
  getCodeImg().then((res) => {
    captchaEnabled.value = res.captchaEnabled === undefined ? true : res.captchaEnabled
    if (captchaEnabled.value) {
      codeUrl.value = 'data:image/gif;base64,' + res.img
      loginForm.value.uuid = res.uuid
    }
  })
}

function getCookie() {
  const username = Cookies.get('username')
  const password = Cookies.get('password')
  const rememberMe = Cookies.get('rememberMe')
  loginForm.value = {
    ...loginForm.value,
    username: username === undefined ? loginForm.value.username : username,
    password: password === undefined ? loginForm.value.password : decrypt(password),
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
  }
}

getCode()
getCookie()
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  background-image: url('@/assets/images/login-background.jpg');
  background-size: cover;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 32px 32px 28px;
  box-sizing: border-box;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.login-form__title {
  margin: 0 auto 28px;
  text-align: center;
  font-size: 20px;
  color: var(--color-text);
}

.login-form__item {
  margin-bottom: 20px;
}

.login-form__label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: var(--color-text);
}

.login-form__control {
  display: flex;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 0 12px;
  height: 40px;
  box-sizing: border-box;

  &:focus-within {
    border-color: var(--color-primary);
  }

  input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 14px;
    color: var(--color-text);
    background: transparent;
    height: 100%;
    min-width: 0;
  }
}

.login-form__icon {
  margin-right: 8px;
  color: var(--color-text-secondary);
  font-size: 16px;
}

.login-form__captcha {
  display: flex;
  gap: 12px;

  .login-form__control {
    flex: 1;
  }
}

.login-form__captcha-img {
  height: 40px;
  cursor: pointer;
  flex-shrink: 0;
}

.login-form__remember {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 20px;
  font-size: 14px;
  color: var(--color-text);
  cursor: pointer;
}

.login-form__error {
  margin: 0 0 16px;
  font-size: 13px;
  color: var(--color-danger);
}

.login-form__submit {
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

.login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: center;
  color: #ffffff;
  font-size: 12px;
  letter-spacing: 1px;
}

@media (max-width: 480px) {
  .login-form {
    width: calc(100% - 32px);
    margin: 0 16px;
  }
}
</style>
