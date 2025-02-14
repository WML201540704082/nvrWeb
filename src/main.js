// 项目的启动入口
import Vue from 'vue'
import App from './App'
import router from './router'
// 加载 element 组件库
import ElementUI from 'element-ui'
// 加载 element 组件库的样式
import 'element-ui/lib/theme-chalk/index.css'
import myConfirm from './plugin/confirm'
// 加载 vue-layer 组件库和样式
import layer from 'vue-layer'
import moment from 'moment';
import 'vue-layer/lib/vue-layer.css';
// 加载全局样式文件
import store from './store'
import filters from './filters';
import "@/icons"
// 锁屏模式下禁用ctrl+r
import './directives/ban-ctrl-r.js'

import "./assets/iconfont/iconfont.css";
import './assets/css/font.css'

import { displayElementNotify } from "./views/smart/utils/displayNotify";
Vue.prototype.displayElementNotify = displayElementNotify

// 全局设置 elementUI的$message的默认显示时间
const messages = ['success', 'warning', 'info', 'error'];
messages.forEach(type => {
  ElementUI.Message[type] = options => {
    if (typeof options === 'string') {
      options = {
          message: options
      };
      // 默认配置
      options.duration = 1500;
      options.showClose = true;
    }
    options.type = type;
    return ElementUI.Message(options);
  }
})
// 全局注册element组件库
Vue.use(ElementUI);

Vue.use(myConfirm)

import VueI18n from "vue-i18n";
import LangZHCN from "@/assets/lang/zh-cn";
import LangENUS from "@/assets/lang/en-us";
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: "zh-CN", // 语言标识
  messages: {
    "zh-CN": LangZHCN, // 中文语言包
    "en-US": LangENUS, // 英文语言包
  },
  silentTranslationWarn: true,
});

Vue.config.productionTip = false
Vue.prototype.$layer = layer(Vue);
Vue.prototype.$moment = moment;

Vue.use(filters);

/* eslint-disable no-new */
// 创建 Vue 根实例
// 把 router 配置到根实例中
// 通过 render 方法把 App 根组件渲染到 #app 入口节点
new Vue({
	// el: '#app', //等价于 $mount('#app')
	router,
  i18n,
	store,
	render: h => h(App)
}).$mount('#app')