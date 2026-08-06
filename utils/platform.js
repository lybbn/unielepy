/**
 * 跨端平台判断工具
 * 全端安全，所有 navigator/document/window 访问均用 #ifdef H5 包裹
 * 小程序/App 端用 uni.getSystemInfoSync()
 */

let _systemInfo = null
function getSystemInfo() {
  if (!_systemInfo) {
    try {
      _systemInfo = uni.getSystemInfoSync()
    } catch (e) {
      _systemInfo = {}
    }
  }
  return _systemInfo
}

// 平台标识（H5 / 微信小程序 / App 等）
export function getPlatform() {
  // #ifdef H5
  return 'h5'
  // #endif
  // #ifdef MP-WEIXIN
  return 'mp-weixin'
  // #endif
  // #ifdef APP-PLUS
  return 'app-plus'
  // #endif
  // #ifdef MP-ALIPAY
  return 'mp-alipay'
  // #endif
  return 'unknown'
}

export const isH5 = getPlatform() === 'h5'
export const isMpWeixin = getPlatform() === 'mp-weixin'
export const isApp = getPlatform() === 'app-plus'

// 操作系统
export function getOS() {
  return (getSystemInfo().platform || '').toLowerCase()
}
export const isIos = getOS() === 'ios'
export const isAndroid = getOS() === 'android'

// 设备信息
export function getSystemInfoSync() {
  return getSystemInfo()
}

// 是否在微信浏览器中打开（仅 H5 端有意义）
export function isWeixinBrowser() {
  // #ifdef H5
  const ua = (navigator.userAgent || '').toLowerCase()
  return ua.indexOf('micromessenger') !== -1
  // #endif
  // #ifndef H5
  return false
  // #endif
}

// 获取 H5 userAgent（非 H5 端返回空串）
export function getH5UserAgent() {
  // #ifdef H5
  return navigator.userAgent || ''
  // #endif
  // #ifndef H5
  return ''
  // #endif
}

// H5 端判断是否 iOS 设备
export function isH5Ios() {
  // #ifdef H5
  const ua = navigator.userAgent || ''
  return !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
  // #endif
  // #ifndef H5
  return isIos
  // #endif
}
