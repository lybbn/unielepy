/**
 * 统一网络请求封装
 * - token 从 store 读取（不再读 storage）
 * - 4001 鉴权失败 reject（修复旧版 resolve 导致调用方无法 catch 的 bug）
 * - 合并 PUT/DELETE 与 GET/POST/PATCH 重复代码为单一 ajax
 * - 修复 chooseUploadImg 中 reject 参数拼写错误（rejct → reject）导致的 ReferenceError
 * - 导出名严格保持：ajaxGet/ajaxPut/ajaxDelete/ajaxPost/ajaxPatch/baseUrl/chooseUploadImg/uploadImg
 */
import store from '@/store/index.js'
import { env, baseUrl } from '@/config/env.js'
import { showToast } from '@/utils/feedback.js'

const NULL_TOKEN = 'nulltoken'

// 从 store 读取 token
function getToken() {
  const token = store.getters['user/token']
  return token || NULL_TOKEN
}

// 清理 params 中的 null/undefined 字段
function cleanParams(params) {
  if (!params || Object.prototype.toString.call(params) === '[object FormData]') {
    return params
  }
  const result = JSON.parse(JSON.stringify(params))
  for (const key in result) {
    if (result[key] == null || result[key] === 'undefined') {
      delete result[key]
    }
  }
  return result
}

// 鉴权失败统一处理：登出 + 提示
function handleAuthError() {
  store.dispatch('user/logout')
  showToast('请先登录')
}

/**
 * 统一请求
 * @param {Object} opt { url, params }
 * @param {String} method GET/POST/PUT/PATCH/DELETE
 */
function ajax(opt, method) {
  const token = getToken()
  let params = opt.params ? cleanParams(opt.params) : {}

  const config = {
    url: baseUrl + opt.url,
    method,
    header: {
      Authorization: 'JWT ' + token
    },
    timeout: env.timeout
  }
  // 所有方法统一用 data 传参（GET 的 data 会被 uni.request 当作 query）
  config.data = params

  return new Promise((resolve, reject) => {
    uni.request({
      ...config,
      success: function (res) {
        if (res.data && res.data.code == env.authErrorCode) {
          handleAuthError()
          // 修复：鉴权失败 reject，让调用方能 catch
          reject(res.data)
        } else {
          resolve(res.data)
        }
      },
      fail: function (res) {
        showToast('请求失败')
        reject(res)
      }
    })
  })
}

export function ajaxGet(opt) {
  return ajax(opt, 'GET')
}
export function ajaxPost(opt) {
  return ajax(opt, 'POST')
}
export function ajaxPut(opt) {
  return ajax(opt, 'PUT')
}
export function ajaxDelete(opt) {
  return ajax(opt, 'DELETE')
}
export function ajaxPatch(opt) {
  return ajax(opt, 'PATCH')
}
export { baseUrl }

/******************单张图片上传*********************/
// 选择图片
const uniChooseImage = (param) => {
  let sourcetype = ['album', 'camera']
  if (param) sourcetype = param
  return new Promise((resolve, reject) => {
    uni.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: sourcetype,
      success: res1 => {
        resolve(res1.tempFilePaths[0])
      },
      fail: err => reject(err)
    })
  })
}

// 选择相片并上传图片
export const chooseUploadImg = async (param) => {
  const token = getToken()
  // 修复：消除 await .then() 混用，直接 await
  const filePath = await uniChooseImage(param.params)
  return new Promise((resolve, reject) => {
    uni.showLoading({ title: '上传中..' })
    uni.uploadFile({
      url: baseUrl + param.url,
      filePath,
      header: {
        Authorization: 'JWT ' + token
      },
      formData: {
        uploadimg: 'lybbn-unielepy'
      },
      name: 'file',
      success: res => {
        uni.hideLoading()
        if (res.statusCode == 200) {
          const data = res.data ? JSON.parse(res.data) : {}
          if (data.code == env.successCode) {
            resolve(data)
          } else if (data.code == env.authErrorCode) {
            handleAuthError()
            reject(data)
          } else {
            // 修复：原 reject('上传失败') 但 Promise 参数是 rejct，会 ReferenceError
            reject(data)
          }
        } else {
          showToast('请求错误：' + res.statusCode)
          reject(new Error('请求错误：' + res.statusCode))
        }
      },
      fail: res => {
        showToast('上传图片失败')
        uni.hideLoading()
        reject(res)
      }
    })
  })
}

// 单张图片上传（直接传 filePath）
export const uploadImg = (param) => {
  const filePath = param.params
  const token = getToken()
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: baseUrl + param.url,
      filePath,
      header: {
        Authorization: 'JWT ' + token
      },
      formData: {
        uploadimg: 'lybbn-unielepy'
      },
      name: 'file',
      success: res => {
        if (res.statusCode == 200) {
          const data = res.data ? JSON.parse(res.data) : {}
          if (data.code == env.successCode) {
            resolve(data)
          } else if (data.code == env.authErrorCode) {
            handleAuthError()
            reject(data)
          } else {
            resolve(data)
          }
        } else {
          showToast('请求错误：' + res.statusCode)
          reject(new Error('请求错误：' + res.statusCode))
        }
      },
      fail: res => {
        showToast('上传图片失败')
        reject(res)
      }
    })
  })
}
