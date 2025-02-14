import axios from "axios";

// import qs from 'qs'

import router from "@/router";
import { Message } from "element-ui";
import { mess } from "@/utils/resetMessage.js";
import { HOST } from "@/utils/constant";
import { displayElementNotify } from "./displayNotify";
import Vue from 'vue'

let AUTH_TOKEN = (function() {
  return localStorage.getItem("token");
})();

let service = axios.create({
  timeout: 30 * 60 * 1000, // 上传升级文件防止超时
});
service.defaults.headers.common["Authorization"] = AUTH_TOKEN;

// pending请求cancel, 但批量导入人脸无法多线程执行
// let pending = []
// let cancelToken = axios.CancelToken
// let cancelPending = (config) => {
//   pending.forEach((item, index) => {
//     if(!!config){
//       if(item.u == config.url){ //只要是请求,上一条pending请求cancel掉
//         item.f() //取消请求
//         pending.splice(index, 1) //移除当前请求记录
//       }
//     } else {
//       item.f() //取消请求
//       pending.splice(index, 1) //移除当前请求记录
//     }
//   })
// }

//验证登录状态
// router.beforeEach((to, from, next) => {
// //如果是需要验证登录状态的页面
//   if (to.matched.some(record => record.meta.requireAuth)) {
//     let token = localStorage.getItem('token')
//     //如果已经登录，则正常进入
//     if(!!token){
//       cancelPending()
//       next()
//     }else{
//       next({'name': 'login', 'query': {'redirect': to.fullPath}})
//     };
//   } else if (to.name == 'login') { //如果是登录页，则验证如果当前是登录状态自动跳转至系统主页，否则正常进入登录页
//     let token = localStorage.getItem('token')
//     //如果已经登录，则重定向至系统首页
//     if(!!token){
//       router.push({'name': 'SystemWelcome'})
//     }else{
//       next()
//     }
//   } else { //其他页面正常进入
//     next()
//   }
// })

// 过滤 请求拦截器
service.interceptors.request.use(
  (config) => {
    // cancelPending(config)
    // config.cancelToken = new cancelToken((c) => {
    //   pending.push({'u': config.url, 'f': c})
    // })

    let url = config.url;
    if (url.indexOf("login") > -1) {
      localStorage.setItem("token", "");
      config.headers.Authorization = "";
    }
    if (url.indexOf("login") < 0) {
      config.headers.Authorization = localStorage.getItem("token");
    }
    return config;
  },
  function(err) {
    return Promise.reject(err);
  }
);
// 响应拦截器
service.interceptors.response.use(
  (res) => {
    // cancelPending(res.config)

    if (res.headers["refresh-token"]) {
      localStorage.setItem("token", "Bearer " + res.headers["refresh-token"]);
    }
    return res;
  },
  (err) => {
    if (err.response.status === 401) {
      if (Vue.prototype.$APP_MODE === "l4t") {
        window.location.href = `http://${HOST}/login`;
        mess.error("登录超时,请重新登录!");
      } else {
        // if (err.response.config.url.indexOf("/api/channel") < 0) {
          router.push("/");
          mess.error("登录超时,请重新登录!");
        // } else {

        // }
      }
    } else {
      if(displayElementNotify.isShow){
        console.log('err.response.data',err.response.data);
        // debugger
        const code = err.response.data.code;
        const codeData = err.response.data.data
        const codeMessage = err.response.data.message
        switch (code) {
          case 400000:
            if (err.response.config.url.indexOf("/api/tool/onvif/") < 0) {
              mess.error("请求错误");
              // Message({ duration: 1200, message: "请求错误", type: "error" });
            }
            break;
          case 400301:
            Message({ duration: 1200, message: "通道不存在", type: "error" });
            break;
          case 400302:
            Message({ duration: 1200, message: "通道已存在", type: "error" });
            break;
          case 400304:
            Message({
              duration: 1200,
              message: "通道正在使用中, 请先删除相关任务",
              type: "error",
            });
            break;
          case 403903:
            Message({
              duration: 1200,
              message: `IP已被设备${codeData.join(',')}占用，请重新设置`,
              type: "error",
            });
            break;
          case 400401:
            Message({
              duration: 1200,
              message: "任务授权受限",
              type: "error",
            });
            break;
          case 400501:
            Message({
              duration: 1200,
              message: "删除失败，人脸库正在使用中...",
              type: "error",
            });
            break;
          case 400502:
            Message({ duration: 1200, message: "人脸库不存在", type: "error" });
            break;
          case 400503:
            Message({
              duration: 1200,
              message: "删除失败，车辆库正在使用中...",
              type: "error",
            });
            break;
          case 400504:
            Message({ duration: 1200, message: "车辆库不存在", type: "error" });
            break;
          case 400601:
            mess.error("提取不出人脸特征, 请重新选择照片");
            break;
          case 400602:
            Message({
              duration: 1200,
              message: "人脸不在同一人脸库中",
              type: "error",
            });
            break;
          case 401000:
            Message({ duration: 1200, message: "登录超时", type: "error" });
            break;
          case 403000:
            if (codeData == "number of enabled channel algorithm will greater than 32") {
              Message({ duration: 2500, message: "即将开启算法总数超过32个，请减少", type: "warning" });
            } else {
              Message({ duration: 1200, message: "未授权", type: "error" });
            }
            break;
          case 403101:
            Message({
              duration: 1200,
              message: "用户名或密码错误",
              type: "error",
            });
            break;
          case 403102:
            Message({
              duration: 1200,
              message: "原始密码输入错误",
              type: "error",
            });
            break;
          case 403301:
            Message({
              duration: 1200,
              message: "通道通道添加数已超过授权总数",
              type: "error",
            });
            break;
            case 403302:
              if (typeof codeData == 'number' && codeMessage == 'the number of algorithms exceeds the limit') {
                Message({ duration: 2500, message: "算法容量不足", type: "warning" });
              } else {
                Message({ duration: 1200, message: "未授权", type: "error" });
              }
              break;
          case 403901:
            Message({
              duration: 1200,
              message: "当前版本不允许的操作!",
              type: "error",
            });
            break;
          case 403902:
            Message({ duration: 1200, message: "导入证书错误", type: "error" });
            break;
          case 404000:
            Message({ duration: 1200, message: "请求不存在", type: "error" });
            break;
          // case 429601:
          //   Message({duration: 1200, message: '请求过于频繁', type: 'error'})
          //   break;
          case 500000:
            mess.error("请求服务器出错");
            // Message({ duration: 1200, message: "请求服务器报错", type: "error" });
            break;
          case 502901:
            mess.error("接口调用出错");
            // Message({ duration: 1200, message: "接口调用出错", type: "error" });
            break;
        }
      }
    }
    return Promise.reject(err);
  }
);

// 封装get请求
export function get(url, params) {
  // params.t = new Date().getTime() // get方法加一个时间参数，解决浏览器可能存在的缓存问题
  return service({
    url: url,
    method: "GET",
    headers: {},
    params,
    // paramsSerializer(params) {
    //   return qs.stringify(params, {
    //     arrayFormat: 'repeat'
    //   })
    // }
  });
}

// 封装post请求
export function post(url, data) {
  let sendObj = {
    url: url,
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    data: data,
  };
  sendObj.data = JSON.stringify(data);
  return service(sendObj);
}

// 封装put方法
export function put(url, data) {
  return service({
    url: url,
    method: "PUT",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    data: JSON.stringify(data),
  });
}

// 封装delete方法
export function deletes(url, data) {
  return service({
    url: url,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    data: JSON.stringify(data),
  });
}

export default service;
