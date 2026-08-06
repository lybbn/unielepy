/**
 * Vuex3 入口
 * Vue2 必须用 Vuex 3
 */
import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user.js'
import { env } from '@/config/env.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user
  },
  // 开发环境开启严格模式，禁止直接修改 state
  strict: env.isDev
})

export default store
