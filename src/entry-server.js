import { createApp } from './app'

export default context => {
  const { app } = createApp()
  // 服务器端路由匹配  和数据预取逻辑 
  return app
}