/**
 * 轻量全局消息提示，替代管理端 Element Plus 的 ElMessage/ElNotification。
 * 样式定义在 assets/styles/index.scss 的 app-toast 相关类。
 */
const TYPE_CLASS = {
  success: 'app-toast--success',
  error: 'app-toast--error',
  warning: 'app-toast--warning',
  info: 'app-toast--info'
}

let container = null

function ensureContainer() {
  if (!container || !document.body.contains(container)) {
    container = document.createElement('div')
    container.className = 'app-toast-container'
    document.body.appendChild(container)
  }
  return container
}

/**
 * 弹出一条消息
 * @param {string} message 消息内容
 * @param {'success'|'error'|'warning'|'info'} type 类型
 * @param {number} duration 自动关闭毫秒数，<=0 时手动关闭
 * @returns {Function} 关闭函数
 */
export function toast(message, type = 'info', duration = 3000) {
  const el = document.createElement('div')
  el.className = `app-toast ${TYPE_CLASS[type] || TYPE_CLASS.info}`
  el.setAttribute('role', 'status')
  el.textContent = message
  ensureContainer().appendChild(el)
  requestAnimationFrame(() => el.classList.add('is-visible'))

  let removed = false
  const close = () => {
    if (removed) {
      return
    }
    removed = true
    el.classList.remove('is-visible')
    el.addEventListener('transitionend', () => el.remove(), { once: true })
    // 兜底：prefers-reduced-motion 或无过渡时直接移除
    setTimeout(() => el.remove(), 300)
  }
  if (duration > 0) {
    setTimeout(close, duration)
  }
  return close
}

export const toastSuccess = (message, duration) => toast(message, 'success', duration)
export const toastError = (message, duration) => toast(message, 'error', duration)
export const toastWarning = (message, duration) => toast(message, 'warning', duration)
export const toastInfo = (message, duration) => toast(message, 'info', duration)
