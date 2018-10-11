let http = require('http')
let fs = require('fs')
let url = require('url')
let qiniu = require('qiniu')
let qiniu_conf = JSON.parse(fs.readFileSync('./private.json')).qiniu
let port = process.argv[2] || 8080

let server = http.createServer((request, response) => {
  let parsedUrl = url.parse(request.url, true)
  let path = parsedUrl.pathname

  /*******************/

  console.log('路径\n' + path)

  if (path === '/uptoken') {
    let mac = new qiniu.auth.digest.Mac(qiniu_conf.ACCESS_KEY, qiniu_conf.SECRET_KEY);
    let options = {
      scope: 'music-player',
    }
    let putPolicy = new qiniu.rs.PutPolicy(options)
    let uploadToken = putPolicy.uploadToken(mac)

    response.statusCode = 200
    response.setHeader('Content-Type', 'text/json;charset=utf-8')
    response.setHeader('Access-Control-Allow-Origin', '*')    
    response.write(`{ "uptoken": "${uploadToken}" }`)
    response.end()
  } else {
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.end()
  }

  /*******************/
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请打开 http://localhost:' + port)