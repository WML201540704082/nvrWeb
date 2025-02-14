const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
const webpack = require('webpack')

const url = "172.17.21.19";

module.exports = {
    publicPath: './',
    devServer:{
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        proxy:{ //配置跨域
            '/api':{
              target: `http://${url}`,
              ws:true,
              changeOrigin:true,//允许跨域
            },
            '/video':{
              target: `http://${url}`,
              ws:true,
              changeOrigin:true,//允许跨域
            },
            "/image": {
              target: `http://${url}`,
              // target: `${url}`,
              secure: false,
              changeOrigin: true,
            },
        },
        open: true
    },
    pluginOptions: {
      'style-resources-loader': {
        preProcessor: 'less',
        patterns: [
          path.resolve(__dirname, './src/assets/css/comm.less')
        ]
      }
    },
    chainWebpack(config) {
        // 设置 svg-sprite-loader
        // config 为 webpack 配置对象
        // config.module 表示创建一个具名规则，以后用来修改规则
        config.module
          // 规则
          .rule('svg')
          // 忽略
          .exclude.add(resolve('src/icons'))
          // 结束
          .end()
        // config.module 表示创建一个具名规则，以后用来修改规则
        config.module
          // 规则
          .rule('icons')
          // 正则，解析 .svg 格式文件
          .test(/\.svg$/)
          // 解析的文件
          .include.add(resolve('src/icons'))
          // 结束
          .end()
          // 新增了一个解析的loader
          .use('svg-sprite-loader')
          // 具体的loader
          .loader('svg-sprite-loader')
          // loader 的配置
          .options({
            symbolId: 'icon-[name]'
          })
          // 结束
          .end()
        config
          .plugin('ignore')
          .use(
            new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn$/)
          )
        config.module
          .rule('icons')
          .test(/\.svg$/)
          .include.add(resolve('src/icons'))
          .end()
          .use('svg-sprite-loader')
          .loader('svg-sprite-loader')
          .options({
            symbolId: 'icon-[name]'
          })
          .end()
    },
    lintOnSave: false,
    configureWebpack: {
      name: 'nvr',
      devtool: process.env.NODE_ENV === 'development'? 'source-map': 'source-map',
      resolve: {
        alias: {
          "@": resolve("src")
        }
      }
    }
}