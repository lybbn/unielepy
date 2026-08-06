/**
 * storage 持久化封装
 * 纯函数，不依赖 this；与旧 api/common.js 同名方法签名一致
 */
import { env } from '@/config/env.js'

export const TOKEN_KEY = env.tokenKey
export const USER_INFO_KEY = env.userInfoKey
export const LEGACY_USER_KEY = env.legacyUserKey

// 设置 json 缓存（自动序列化）
export function setJson(key, value) {
  try {
    uni.setStorageSync(key, JSON.stringify(value))
  } catch (e) {
    console.error('setJson error:', e)
  }
}

// 获取 json 缓存（自动反序列化）
export function getJson(key) {
  try {
    const value = uni.getStorageSync(key)
    if (value) return JSON.parse(value)
    return null
  } catch (e) {
    console.error('getJson error:', e)
    return null
  }
}

// 设置原始缓存
export function setData(key, value) {
  try {
    uni.setStorageSync(key, value)
  } catch (e) {
    console.error('setData error:', e)
  }
}

// 获取原始缓存
export function getData(key) {
  try {
    return uni.getStorageSync(key)
  } catch (e) {
    console.error('getData error:', e)
    return null
  }
}

// 删除某条缓存
export function remove(key) {
  try {
    uni.removeStorageSync(key)
  } catch (e) {
    console.error('remove error:', e)
  }
}

// 清除全部缓存
export function clear() {
  try {
    uni.clearStorage()
  } catch (e) {
    console.error('clear error:', e)
  }
}

// 清除鉴权相关缓存（token + userInfo + 旧 key）
export function clearUser() {
  remove(TOKEN_KEY)
  remove(USER_INFO_KEY)
  remove(LEGACY_USER_KEY)
}
