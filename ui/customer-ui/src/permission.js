import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import useUserStore from '@/store/modules/user'

NProgress.configure({ showSpinner: false })

const siteTitle = import.meta.env.VITE_APP_TITLE

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  document.title = to.meta?.title ? `${to.meta.title} - ${siteTitle}` : siteTitle
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
      return
    }
    const userStore = useUserStore()
    if (userStore.roles.length === 0) {
      try {
        await userStore.getInfo()
        next()
      } catch {
        // 会话已失效时按公开访问处理；需登录页面跳转登录页
        await userStore.logOut()
        if (to.meta.requiresAuth) {
          next(`/login?redirect=${to.fullPath}`)
          NProgress.done()
        } else {
          next()
        }
      }
    } else {
      next()
    }
  } else if (to.meta.requiresAuth) {
    next(`/login?redirect=${to.fullPath}`)
    NProgress.done()
  } else {
    next()
  }
})

router.afterEach(() => {
  NProgress.done()
})
