// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })

let proxyObj={}
proxyObj['/']={
  // websocket
  ws:false,
  //目标地址
  target:'http://43.134.190.143:8081',
  //发送请求头host会被设置target
  changeOrigin:true,
  //不重写请求地址
  pathReWrite:{
    '^/':'/'
  }
},

proxyObj['/ws']={
  //websocket
 ws:false,
 target:'http://43.134.190.143:8081'
},

module.exports={
  //开发者
  devServer:{
    host:'localhost',
    port:8080,
    //代理
    proxy:proxyObj
  }
}
