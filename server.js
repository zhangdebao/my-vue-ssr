const Vue = require('vue')
const express = require('express')
const { createBundleRenderer } = require('vue-server-renderer')
const fs = require('fs')
const setupDevServer = require('./build/setup-dev-server')
const server = express()
server.use('/dist', express.static('./dist')) // 碰到/dist 前缀的请求， 会在./dist下寻找

let renderer
let onReady
const isProd = process.env.NODE_ENV === 'production'
if (isProd) {
  // 打包之后生成dist
  const serverBundle = require('./dist/vue-ssr-server-bundle.json')
  const clientManifest = require('./dist/vue-ssr-client-manifest.json')
  const template = fs.readFileSync('./index.template.html', 'utf-8')
  renderer = createBundleRenderer.createBundleRenderer(serverBundle, {
    template,
    clientManifest
  }) // 渲染器
} else { 
  // 开发模式 -> 见识打包构建 -> 重新生成Renderer渲染器
  /**
   * @设置开发模式下的服务 
   * @param {*} server: 用户挂载开发模式下的一些中间件
   * @param {*} callback： 回调函数， 在监视打包构建之后， 执行（重新生成Renderer渲染器）
   * @return {boolean} onReady: 构建状态（打包编译的状态）
  */
  onReady = setupDevServer(server, (serverBundle, template, clientManifest) => { 
    renderer = createBundleRenderer(serverBundle, {
      template,
      clientManifest
    }) // 渲染器
  })
  console.log('onReady', onReady)
}
const render = (req, res) => { 
  // 会找到entry-server.js， 里面创建的vue实例， 然后渲染
  renderer.renderToString({
    title: '可选传参',
    meta: '<meta name="description" content="meta传参格式"/>'
  }, (err, html) => {
    res.setHeader('Content-Type', 'text/html;charset=utf-8')
    if (err) { 
      res.status(500).end('Internal Server Errot')
    }
    res.end(html)
   })
}


server.get('/', isProd ? render :
  async (req, res) => { 
    // 等待有了Renderer 渲染器以后，调用render进行渲染
    await onReady
    render(req, res)
  }
)
server.listen(3000, () => { 
  console.log('server running in 3000')
})