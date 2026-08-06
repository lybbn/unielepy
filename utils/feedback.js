/**
 * 交互反馈工具
 * 签名与旧 api/common.js 对齐
 */

export function showLoading(title = '加载中') {
  uni.showLoading({ title, mask: true })
}

export function hideLoading() {
  uni.hideLoading()
}

export function showToast(title, mask = false, duration = 2000, icon = 'none') {
  uni.showToast({ title, mask, duration, icon })
}

// 兼容旧 common.js 别名
export const showTip = showToast
