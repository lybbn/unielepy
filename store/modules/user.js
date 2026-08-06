/**
 * 用户模块：token / userInfo 的唯一真源
 * storage 仅作持久化层；老用户 token 在旧 key nuserlogininfo 中，启动时自动迁移
 */
import * as storage from '@/utils/storage.js'
import { TOKEN_KEY, USER_INFO_KEY, LEGACY_USER_KEY } from '@/utils/storage.js'

const NULL_TOKEN = 'nulltoken'

export default {
  namespaced: true,
  state: {
    token: '',
    userInfo: null
  },
  getters: {
    token: state => state.token,
    userInfo: state => state.userInfo || {},
    isLogin: state => !!state.token && state.token !== NULL_TOKEN
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token || ''
      if (token) {
        storage.setData(TOKEN_KEY, token)
      } else {
        storage.remove(TOKEN_KEY)
      }
    },
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo || null
      if (userInfo) {
        storage.setJson(USER_INFO_KEY, userInfo)
      } else {
        storage.remove(USER_INFO_KEY)
      }
    },
    CLEAR_AUTH(state) {
      state.token = ''
      state.userInfo = null
      storage.clearUser()
    }
  },
  actions: {
    // 登录成功后调用：写入 token 与 userInfo
    // payload: { access, ...userInfo } 或 { token, userInfo }
    login({ commit }, payload) {
      if (!payload) return
      // 兼容旧接口返回结构 { access, refresh, ... } 与新结构 { token, userInfo }
      const token = payload.token || payload.access || ''
      const userInfo = payload.userInfo || (token ? payload : null)
      commit('SET_TOKEN', token)
      commit('SET_USER_INFO', userInfo)
    },
    logout({ commit }) {
      commit('CLEAR_AUTH')
    },
    // App 启动时调用：从 storage 恢复登录态，兼容旧 key 无感迁移
    restoreFromStorage({ commit }) {
      // 1. 优先读新 key
      let token = storage.getData(TOKEN_KEY)
      let userInfo = storage.getJson(USER_INFO_KEY)

      // 2. 回退读旧 key（老用户），解析 .access
      if (!token) {
        const legacy = storage.getData(LEGACY_USER_KEY)
        if (legacy && typeof legacy === 'object') {
          token = legacy.access || ''
          userInfo = legacy
        } else if (legacy && typeof legacy === 'string') {
          // 旧版可能存的是 JSON 字符串
          try {
            const parsed = JSON.parse(legacy)
            token = parsed.access || ''
            userInfo = parsed
          } catch (e) {
            // ignore
          }
        }
        // 旧 key 迁移成功后，写入新 key 并清除旧 key
        if (token) {
          storage.setData(TOKEN_KEY, token)
          if (userInfo) storage.setJson(USER_INFO_KEY, userInfo)
          storage.remove(LEGACY_USER_KEY)
        }
      }

      if (token) {
        commit('SET_TOKEN', token)
        if (userInfo) commit('SET_USER_INFO', userInfo)
      }
    }
  }
}
