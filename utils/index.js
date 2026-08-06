/**
 * utils 聚合入口
 * 方法名与旧 api/common.js 完全对齐，作为 $util 与 $common facade 的统一数据源
 * copyData 不再依赖 this.showToast，改为直接 import feedback
 */
import * as date from './date.js'
import * as validate from './validate.js'
import * as storage from './storage.js'
import * as nav from './nav.js'
import * as platform from './platform.js'
import * as feedback from './feedback.js'
import * as download from './download.js'
import * as sku from './sku.js'
import stopRepeatClick from './stopRepeatClick.js'

// 跨端复制（兼容安卓/iOS/小程序，H5 用 document.execCommand）
function copyData(val) {
  // #ifndef H5
  uni.setClipboardData({
    data: val,
    success: () => feedback.showToast('内容已复制')
  })
  // #endif
  // #ifdef H5
  const textarea = document.createElement('textarea')
  textarea.value = val
  textarea.readOnly = 'readOnly'
  document.body.appendChild(textarea)
  textarea.select()
  textarea.setSelectionRange(0, val.length)
  document.execCommand('copy')
  textarea.remove()
  feedback.showToast('内容已复制')
  // #endif
}

// 检查登录态（委托给 store，由 facade 覆盖；这里默认走 storage 兜底）
function checkLogin() {
  return !!storage.getData(storage.TOKEN_KEY) || !!storage.getData(storage.LEGACY_USER_KEY)
}

const util = {
  // date
  dateFormats: date.dateFormats,
  getHoursT: date.getHoursT,
  timeago: date.timeago,
  // validate
  isRealPrice: validate.isRealPrice,
  isRealZhengNum: validate.isRealZhengNum,
  checkPhoneNum: validate.checkPhoneNum,
  checkIdcard: validate.checkIdcard,
  checkCarNo: validate.checkCarNo,
  checkAmount: validate.checkAmount,
  // storage
  setJson: storage.setJson,
  getJson: storage.getJson,
  setData: storage.setData,
  getData: storage.getData,
  remove: storage.remove,
  clear: storage.clear,
  clearUser: storage.clearUser,
  // nav
  linkjump: nav.linkjump,
  navTo: nav.navTo,
  navBack: nav.navBack,
  redirect: nav.redirect,
  switchTab: nav.switchTab,
  reloadPage: nav.reloadPage,
  // platform
  ...platform,
  // feedback
  showLoading: feedback.showLoading,
  hideLoading: feedback.hideLoading,
  showToast: feedback.showToast,
  // download
  downloadFile: download.downloadFile,
  // sku
  selectGoodsSKU: sku.selectGoodsSKU,
  // 综合
  copyData,
  checkLogin,
  stopRepeatClick
}

export default util
