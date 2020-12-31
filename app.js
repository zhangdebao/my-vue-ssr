import Vue from 'vue'
import App from './App'
import { createRouter } from './router/'

/**
 * 导出一个工厂函数， 用户创建新的应用程序，router和 store实例
 * @param {void}
 * @return {*} app, router
 */
export function createApp() { 
  const router = createRouter()
  const app = new Vue({
    router, // 把路由挂载到Vue根实例中
    render: h => h(App) // 根实例简单的渲染应用程序组件
  })
  return { app, router }
}
