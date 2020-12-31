const Vue = require('vue')
const express = require('express')
const fs = require('fs')
const serverBundle = require('./dist/vue-ssr-server-bundle.json')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')
const template = fs.readFileSync('./index.template.html', 'utf-8')
const renderer = require('vue-server-renderer').createBundleRenderer(serverBundle, {
  template,
  clientManifest
}) // 渲染器
const server = express()

server.use('/dist', express.static('./dist')) // 碰到/dist 前缀的请求， 会在./dist下寻找

server.get('/', (req, res) => { 
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
})
server.listen(3000, () => { 
  console.log('server running in 3000')
})