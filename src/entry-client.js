/**
 * 客户端入口
 */
import { createApp } from './app'

const { app, router, store } = createApp()

if (window.__INITIAL_STATE__) { 
  store.replaceState(window.__INITIAL_STATE__)
}
// 客户端特定引导逻辑。。。
router.onReady(() => { 
  app.$mount('#app')
})


