// unielepy-----django-vue-lyadmin----main.js
import Vue from 'vue'
import App from './App'
import uView from '@/uni_modules/uview-ui'
import store from '@/store/index.js'
import util from '@/utils/index.js'
import common from '@/api/common.js'
import stopRepeatClick from './utils/stopRepeatClick.js'

Vue.config.productionTip = false

// uView 必须在 new Vue 之前 use，确保实例化时组件能力已挂载
Vue.use(uView)

// 全局挂载
Vue.prototype.$store = store
Vue.prototype.$util = util
Vue.prototype.$common = common
Vue.prototype.$stopRepeatClick = stopRepeatClick

// 全局错误捕获
Vue.config.errorHandler = (err, vm, info) => {
  console.error('Vue error:', err, info)
}

App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})
app.$mount()
