/**
 * 环境配置
 * dev/prod 分离，prod 强制 HTTPS（小程序正式版要求、App 也建议）
 * 修改下面地址为你的真实后端地址
 */
const isDev = process.env.NODE_ENV !== 'production'

// 开发环境地址（本地/测试服务器）
const devBaseUrl = 'http://django-vue-lyadmin.lybbn.cn/api/'
// 生产环境地址（必须 HTTPS）
const prodBaseUrl = 'https://django-vue-lyadmin.lybbn.cn/api/'

const baseUrl = isDev ? devBaseUrl : prodBaseUrl

const env = {
  isDev,
  baseUrl,
  // 接口请求超时（ms）
  timeout: 15000,
  // 上传文件超时（ms）
  uploadTimeout: 60000,
  // 鉴权相关 storage key
  tokenKey: 'unielepy_token',
  userInfoKey: 'unielepy_userinfo',
  // 旧版用户登录信息 key（用于老用户无感迁移）
  legacyUserKey: 'nuserlogininfo',
  // 鉴权失败业务码
  authErrorCode: 4001,
  // 成功业务码
  successCode: 2000
}

export { env, baseUrl, isDev }
// 兼容旧 api/url.js 的命名
export const url = baseUrl
export default env
