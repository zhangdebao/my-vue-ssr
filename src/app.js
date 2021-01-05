import Vue from 'vue'
import App from './App.vue'
import VueMeta from 'vue-meta'
import { createStore } from './store/'

import { createRouter } from './router'
Vue.use(VueMeta)

Vue.mixin({
  metaInfo: {
    titleTemplate: '%s - 拉钩教育'
  }
})
/**
 * 导出一个工厂函数， 用户创建新的应用程序，router和 store实例
 * @param {void}
 * @return {*} app, router
 */
export function createApp() { 
  const router = createRouter()
  const store = createStore()
  const app = new Vue({
    router, // 把路由挂载到Vue根实例中
    store, // 把容器(store)挂载到Vue根实例中
    render: h => h(App) // 根实例简单的渲染应用程序组件
  })
  return { app, router, store }
}
