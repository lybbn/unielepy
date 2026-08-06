/**
 * 导航跳转工具
 * linkjump 保留旧逻辑：http→webview，/pages/→navigate/switchTab/redirect
 */

// 智能跳转（兼容 http/https 外链 与 /pages/ 内部跳转）
export function linkjump(link, isindex = false, isredirect = false) {
  if (!link) return
  if (link.indexOf('http://') !== -1 || link.indexOf('https://') !== -1) {
    uni.navigateTo({ url: `/pages/content/webview?url=${encodeURIComponent(link)}` })
  } else if (link.indexOf('/pages/') !== -1) {
    if (isindex) {
      uni.switchTab({ url: link })
    } else if (isredirect) {
      uni.redirectTo({ url: link })
    } else {
      uni.navigateTo({ url: link })
    }
  }
}

// 普通跳转
export function navTo(url) {
  uni.navigateTo({ url })
}

// 返回上一页
export function navBack(delta = 1) {
  uni.navigateBack({ delta })
}

// 关闭当前页跳转
export function redirect(url) {
  uni.redirectTo({ url })
}

// tabBar 跳转
export function switchTab(url) {
  uni.switchTab({ url })
}

// 延迟重载某页面
export function reloadPage(path) {
  setTimeout(() => {
    uni.redirectTo({ url: path })
  }, 2000)
}
