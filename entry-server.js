import { createApp } from './app'

export default context => {
  // 因为有可能会是异步路由钩子函数或者组件， 所以我们将返回一个Pormise
  // 以便服务区能够等待所有的内容在渲染前就已经准备就绪
  const { app, router } = createApp()
  // 设置服务器端router的位置
  router.push(context.url)
  //等到router将可能的异步组件和钩子函数解析完
  await new Promise(router.onReady.bind(router))
  
  return app
}