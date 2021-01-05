/**
 * 客户端入口
 */
import { createApp } from './app'

const { app, router } = createApp()
// 客户端特定引导逻辑。。。
router.onReady(() => { 
  app.$mount('#app')
})


