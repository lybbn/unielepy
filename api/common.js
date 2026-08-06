/**
 * common.js 兼容 facade
 * 降级为 utils 聚合对象的再导出，方法名与旧版 100% 对齐
 * 未迁移页面通过 this.$common.* 调用，零改动可运行
 *
 * 注意：checkLogin / clearUser 委托给 store，保证与状态管理一致
 */
import util from '@/utils/index.js'
import store from '@/store/index.js'

const common = {
  ...util,
  // 委托 store 判断登录态
  checkLogin() {
    return store.getters['user/isLogin']
  },
  // 委托 store 登出
  clearUser() {
    store.dispatch('user/logout')
  }
}

export default common
module.exports = common
