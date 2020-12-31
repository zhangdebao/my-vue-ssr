const fs = require('fs')
const path = require('path') 
const chokidar = require('chokidar')
const webpack = require('webpack')
const devMiddleware = require('webpack-dev-middleware') // 文件存储在内存中
const resolve = file => path.resolve(__dirname, file)
module.exports = (server, callback) => { 
  let ready
  const onReady = new Promise((r) => ready = r)
  // 监视构建  ->  更新ERenderer

  let template
  let serverBundle
  let clientManifest
  const update = () => { 
    if (template && serverBundle && clientManifest) { 
      ready()
      callback(serverBundle, template, clientManifest)
    }
  }
  // 监视构建 template -> 调用update -> 调用Renderer渲染器
  const templatePath = path.resolve(__dirname, '../index.template.html')
  template = fs.readFileSync(templatePath, 'utf-8') // 第一次读取
  update()
  // chokidar监视index.template.html 文件的变化
  chokidar.watch(templatePath).on('change', () => { 
    template = fs.readFileSync(templatePath, 'utf-8') // 变化之后重新读取
    update()
  })
  // 监视构建 serverBundle -> 调用update -> 调用Renderer渲染器
  const serverConfig = require('./webpack.server.config')
  const serverCompiler = webpack(serverConfig)

  const serverDevMiddleware = devMiddleware(serverCompiler, { // 会自动的执行打包构建， 默认也是按照监视的方式执行打包构建, 所以下面就不用手动调用serverCompiler.watch(了
    logLevel: 'silent' // 关闭日志输出， 由FriendlyErrorsWebpackPlugin处理
  })
  // serverCompiler的钩子函数done（构建结束之后就会触发）
  serverCompiler.hooks.done.tap('server', () => {  // 注册插件server
    serverBundle = JSON.parse( // 这里不使用requiure方式读取模块， 因为require读取本身会缓存
      serverDevMiddleware.fileSystem.readFileSync(
        resolve('../dist/vue-ssr-server-bundle.json'), 'utf-8')
    )
    update()
  })

  // serverCompiler.watch({}, (err, stats) => { // webpack打包编译, 并且监视
  //   if (err) throw err // webpack配置文件出错
  //   if (stats.hasErrors()) return // 自己写的源代码出错
  //   serverBundle = JSON.parse( // 这里不使用requiure方式读取模块， 因为require读取本身会缓存
  //     fs.readFileSync(resolve('../dist/vue-ssr-server-bundle.json'), 'utf-8')
  //   )
  //   console.log('serverBundle', serverBundle)
  // })

  // 监视构建 clientManifest -> 调用update -> 调用Renderer渲染器
  const clientConfig = require('./webpack.client.config')
  const clientCompiler = webpack(clientConfig)
  const clientDevMiddleware = devMiddleware(clientCompiler, { // 会自动的执行打包构建， 默认也是按照监视的方式执行打包构建, 所以下面就不用手动调用clientCompiler.watch(了
    publicPath: clientConfig.output.publicPath,
    logLevel: 'silent' // 关闭日志输出， 由FriendlyErrorsWebpackPlugin处理
  })
  // clientCompiler的钩子函数done（构建结束之后就会触发）
  clientCompiler.hooks.done.tap('client', () => {  // 注册插件client
    clientManifest = JSON.parse( // 这里不使用requiure方式读取模块， 因为require读取本身会缓存
      clientDevMiddleware.fileSystem.readFileSync(
        resolve('../dist/vue-ssr-client-manifest.json'), 'utf-8')
    )
    update()
  })

  // 重要！！！ 将clientDevMiddleware挂载到Express服务中，提供对其内部内存中数据的访问
  server.use(clientDevMiddleware)
  return onReady
}