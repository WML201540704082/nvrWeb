import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from "axios"
import { userPermision } from '@/api';
import { getNVRDeviceInfo } from '@/api/systemAPI';

import { source, refreshSource } from '@/api/request.js';

Vue.use(VueRouter)

// 配置路由表
const routes = [
	{
		path: '/login',
		name: 'login',
		component: resolve => require(['@/views/Login.vue'], resolve)
	},
	{
		path: '/',
		component: resolve => require(['@/views/layout'], resolve),
		redirect: {
			name: 'login'
		},
		children:[
			{
				path: '/preview',
				name: 'preview',
				component: resolve => require(['@/views/preview'], resolve)
			},
			{
				path: '/playback',
				name: 'playback',
				component: resolve => require(['@/views/playback'], resolve)
			},
			// 智能分析
			{
				path: '/smart',
				name: 'smart',
				component: resolve => require(['@/views/smart'], resolve),
				children:[
					// 事件播报
					{
						path: '/smart/eventBroadcast',
						name: 'eventBroadcast',
						component: resolve => require(['@/views/smart/eventBroadcast/cardView'], resolve)
					},
					// 通行记录
					{
						path: '/smart/passRecord',
						name: 'passRecord',
						component: resolve => require(['@/views/smart/passRecord'], resolve)
					},
					// 通行记录
					{
						path: '/smart/passRecordOld',
						name: 'passRecordOld',
						component: resolve => require(['@/views/smart/passRecordOld'], resolve)
					},
					// 智能布防
					{
						path: '/smart/params',
						name: 'params',
						component: resolve => require(['@/views/smart/params'], resolve)
					},
					// 库管理
					{
						path: '/smart/lib',
						name: 'lib',
						component: resolve => require(['@/views/smart/lib'], resolve)
					},
					// 算法管理
					{
						path: '/smart/alg',
						name: 'alg',
						component: resolve => require(['@/views/smart/alg'], resolve)
					},
					//算法详情
					{
						path: '/smart/algorithmDetails',
						name: 'algorithmDetails',
						component: resolve => require(['@/views/smart/algorithmDetails'], resolve)
					},
				]
			},
			// 通道管理
			{
				path: '/channel',
				name: 'channel',
				component: resolve => require(['@/views/channel'], resolve),
				children:[
					// 通道配置
					{
						path: '/channel/channelConfig',
						name: 'channelConfig',
						component: resolve => require(['@/views/channel/channelConfig'], resolve)
					},
					// 码流配置
					{
						path: '/channel/bigstreamConfig',
						name: 'bigstreamConfig',
						component: resolve => require(['@/views/channel/bigstreamConfig'], resolve)
					},
					// 画面显示配置
					{
						path: '/channel/overlayConfig',
						name: 'overlayConfig',
						component: resolve => require(['@/views/channel/overlayConfig'], resolve)
					},
					{
						path: '/channel/imageConfig',
						name: 'imageConfig',
						component: resolve => require(['@/views/channel/imageConfig'], resolve)
					},
				]
			},
			// 存储管理
			{
				path: '/storage',
				name: 'storage',
				component: resolve => require(['@/views/storage'], resolve),
				children:[
					// 录像管理
					// 录像计划
					{
						path: '/storage/video/videoProgram',
						name: 'videoProgram',
						component: resolve => require(['@/views/storage/video/videoProgram'], resolve)
					},
					// 录像参数
					{
						path: '/storage/video/commonParameter',
						name: 'commonParameter',
						component: resolve => require(['@/views/storage/video/commonParameter'], resolve)
					},
					// {
					// 	path: '/storage/video/screenshotsPlan',
					// 	name: 'screenshotsPlan',
					// 	component: resolve => require(['@/views/storage/video/screenshotsPlan'], resolve)
					// },
					// 硬盘管理
					{
						path: '/storage/partybuffalo',
						name: 'partybuffalo',
						component: resolve => require(['@/views/storage/partybuffalo'], resolve)
					},
					// 存储模式
					{
						path: '/storage/storageschema',
						name: 'storageschema',
						component: resolve => require(['@/views/storage/storageschema'], resolve)
					},
					// RAID管理
					{
						path: '/storage/raidmanage',
						name: 'raidmanage',
						component: resolve => require(['@/views/storage/raidmanage'], resolve)
					},
					// 硬盘检测
					{
						path: '/storage/diskcheck',
						name: 'diskcheck',
						component: resolve => require(['@/views/storage/diskcheck'], resolve)
					},
				]
			},
			// 系统设置
			{
				path: '/system',
				name: 'system',
				component: resolve => require(['@/views/system'], resolve),
				children:[
					// 网络配置
					{
						path: '/system/netConfig',
						name: 'netConfig',
						component: resolve => require(['@/views/system/netConfig'], resolve)
					},
					{
						path: '/system/netConfig/topConfig',
						name: 'topConfig',
						component: resolve => require(['@/views/system/netConfig/topConfig'], resolve)
					},
					// 平台设置
					// {
					// 	path: '/system/platformConfig',
					// 	name: 'platformConfig',
					// 	component: resolve => require(['@/views/system/platformConfig'], resolve)
					// },
					// 系统管理
					{
						path: '/system/systemManage/timeConfig',
						name: 'timeConfig',
						component: resolve => require(['@/views/system/systemManage/timeConfig'], resolve)
					},
					{
						path: '/system/systemManage/userConfig',
						name: 'userConfig',
						component: resolve => require(['@/views/system/systemManage/userConfig'], resolve)
					},
					{
						path: '/system/systemManage/moreConfig',
						name: 'moreConfig',
						component: resolve => require(['@/views/system/systemManage/moreConfig'], resolve)
					},
					// 事件管理
					{
						path: '/system/event/alarmManage',
						name: 'alarmManage',
						component: resolve => require(['@/views/system/event/alarmManage'], resolve)
					},
					{
						path: '/system/event/commonDeployment',
						name: 'commonDeployment',
						component: resolve => require(['@/views/system/event/commonDeployment'], resolve)
					},
					// {
					// 	path: '/system/event/alarminput',
					// 	name: 'alarminput',
					// 	component: resolve => require(['@/views/system/event/alarminput'], resolve)
					// },
					// 产品维护
					{
						path: '/system/maintain/logDownload',
						name: 'logDownload',
						component: resolve => require(['@/views/system/maintain/logDownload'], resolve)
					},
					{
						path: '/system/maintain/deviceInfo',
						name: 'deviceInfo',
						component: resolve => require(['@/views/system/maintain/deviceInfo'], resolve)
					},
					// {
					// 	path: '/system/maintain/videoStateDetection',
					// 	name: 'videoStateDetection',
					// 	component: resolve => require(['@/views/system/maintain/videoStateDetection'], resolve)
					// },
					{
						path: '/system/maintain/deviceMaintain',
						name: 'deviceMaintain',
						component: resolve => require(['@/views/system/maintain/deviceMaintain'], resolve)
					},
					{
						path: '/system/maintain/channelInfo',
						name: 'channelInfo',
						component: resolve => require(['@/views/system/maintain/channelInfo'], resolve)
					},
					{
						path: '/system/maintain/deviceRecovery',
						name: 'deviceRecovery',
						component: resolve => require(['@/views/system/maintain/deviceRecovery'], resolve)
					},
				]
			},
		]
	}
]

const router = new VueRouter({
	routes
})
async function checkAppNewVersion() {
	const url = `/static/version.json?t=${Date.now()}`
	let res = null
	try {
	  res = await axios.get(url)
	} catch (err) {
	  console.error('checkAppNewVersion error: ', err)
	}
	if (!res) return
	const version = res.data.version
	console.log(url);
	  
	if (version && version !==  localStorage.getItem('_version_')) {
	  localStorage.setItem('_version_', version)
	  console.log('更新');
		window.location.reload()
	}else{
	  console.log('不更新');
	}
   
  }  
// 路由导航守卫
router.beforeEach((to, from, next) => {
	const user = JSON.parse(window.localStorage.getItem('user'))
	if (from.path !== '/login') {
		checkAppNewVersion()
	}
	// 校验非登录页面的登录状态
	if (to.path !== '/login') {
		//  && !Boolean(localStorage.getItem('qt'))
		if (to.query && to.query.type == 'qt') {
			localStorage.setItem('qt',true)
			localStorage.setItem('isLocal', true)
			window.localStorage.setItem('user', JSON.stringify({
				token: to.query.qtToken
			}))
			userPermision().then(res => {
                if(res.data.code === 200000) {
                    window.localStorage.setItem('permisions', JSON.stringify(res.data.data.rights.local.permisions))
                }}
            )
			getNVRDeviceInfo().then(res => {
                if(res.data.code === 200000) {
                    window.localStorage.setItem('nvrRd',res.data.data.channelNumber)
                }
            })
			next(to.path)
			setTimeout(() => {
				location.reload(true)
			}, 1000);
		} else 
		if (user) {
			// 已登录，允许通过
			next()
		} else {
			// 没有登录，跳转到登录页面
			next('/login')
		}
	} else {
		localStorage.removeItem('qt')
		// 登录页面，正常允许通过
		next()
	}
	if(from.path === '/preview'){
		source.cancel('Operation canceled by the user.');
		refreshSource();
	}
	window.localStorage.removeItem('change-preview')
})

export default router