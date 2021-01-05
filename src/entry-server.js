import { createApp } from './app'

export default async context => {
  // 因为有可能会是异步路由钩子函数或者组件， 所以我们将返回一个Pormise
  // 以便服务区能够等待所有的内容在渲染前就已经准备就绪
  const { app, router, store } = createApp()

  const meta = app.$meta()
  // 设置服务器端router的位置
  router.push(context.url)
  context.meta = meta
  //等到router将可能的异步组件和钩子函数解析完
  await new Promise(router.onReady.bind(router))
  // 服务器渲染之后执行
  context.rendered = () => { 
    // Renderer 会把content.state数据对象内联到页面模板中
    // 最终发送给客户端的页面中会包含一段脚本， window.__INITAL_STATE__= contentstore.replaceState
    // 客户端就要把页面中的 window.__INITIAL_STATE__ 拿出来填充到客户端 store 容器中
    context.state = store.state
  }
  
  return app
}