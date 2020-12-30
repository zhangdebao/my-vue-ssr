const Vue = require('vue')
const express = require('express')
const fs = require('fs')

const renderer = require('vue-server-renderer').createRenderer({
  template: fs.readFileSync('./index.template.html', 'utf-8')
}) // 渲染器
const server = express()

server.get('/', (req, res) => { 
  const app = new Vue({
    template: `
      <div id="app">
      <h1>{{ message }}</h1>
    </div>
    `,
    data: {
      message: '中文'
    }
  })
  
  renderer.renderToString(app, {
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