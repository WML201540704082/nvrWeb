import axios from 'axios'

let AUTH_TOKEN = (function () {
  return localStorage.getItem('token')
})()

let service = axios.create({
  timeout: 30 * 60 * 1000 // 上传升级文件防止超时
})
service.defaults.headers.common['Authorization'] = AUTH_TOKEN

// 过滤
service.interceptors.request.use(function(config){
  let url = config.url
  if(url.indexOf("login")>-1){
    localStorage.setItem('token',"")
    config.headers.Authorization = ""
  }
  if(url.indexOf("login")<0){
    config.headers.Authorization =localStorage.getItem("token")
  }
  return config
},function(err){
  return Promise.reject(err)
})

service.interceptors.response.use(res => {
  if(res.headers['refresh-token']){
    localStorage.setItem('token','Bearer ' + res.headers['refresh-token'])
  }
  return res
}, err => {
  return Promise.reject(err)
})

export default service
