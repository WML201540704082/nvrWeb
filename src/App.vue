<template>
	<!-- QT本地先去掉锁屏 -->
	<!-- <div id="app" @click="clickDiv"> -->
	<div id="app">
		<!-- 路由出口 -->
		<router-view v-if="isReload"/>
	</div>
</template>

<script>
export default {
	name: 'App',
	provide() {
		return {
			reload: this.reload,
			size: this.size,
		}
	},
	data() {
		return {
			isReload: true,
			size: {
				contentWidth: document.body.clientWidth,
				contentHeight: document.body.clientHeight
			},
			lastTime: null, // 最后一次点击的时间
			currentTime: null, // 当前点击的时间
			timeOut: null, // 设置锁屏时间:10分钟
			timeInterval: null,
		}
	},
	created() {
		this.isLocal = JSON.parse(localStorage.getItem('isLocal'))
		this.timeOut = Number(localStorage.getItem('timeOut')) * 60000
		this.$nextTick(() => {
			if (process.env.NODE_ENV !== 'development') {
				// 禁止右键
				document.oncontextmenu = new Function("event.returnValue=false");
				// 禁用F5
				document.onkeydown=function(event){
					var e = event ||window.event || arguments.callee.caller.arguments[0];
					if(e && e.keyCode==116){
						return false;
					}
				}
			}
			// 禁止F12
			// document.onkeydown = new Function("event.returnValue=false");
		})
		this.getSize()
		document.title = localStorage.getItem('title') || '智能视频图像分析服务器'
	},
	methods: {
		reload() {
			this.isReload = false
			this.$nextTick(() => {
				this.isReload = true
			})
		},
		getSize() {
			window.addEventListener("resize", () => {
				return (() => {
					this.size.contentWidth = document.body.clientWidth
					this.size.contentHeight = document.body.clientHeight
				})()
			}, false)
		},
		clickDiv() {
			console.log('-=-=-=this.$route.path',this.$route.path);
			if (this.$route.path != '/preview' && this.$route.path != '/' && this.$route.path != '/login') {
				clearInterval(this.timeInterval);
				this.timeInterval = null
				this.lastTime = new Date().getTime();
				console.log('-=-=-=-=1',this.isLocal);
				if (this.isLocal) {
					console.log('-=-=-=-=2',this.$route.path);
					// 5秒钟检测一次
					this.timeInterval = setInterval(this.isTimeOut, 5000);
				}
			}
		},
		isTimeOut() {
			this.currentTime = new Date().getTime(); // 当前时间
			console.log('this.lastTime',this.lastTime,'this.currentTime',this.currentTime,'this.timeOut',this.timeOut);
			console.log('this.currentTime - this.lastTime > this.timeOut',this.currentTime - this.lastTime > this.timeOut);
			// 判断上次最后一次点击的时间和这次点击的时间间隔是否大于规定的时间,例:10分钟
			if (this.currentTime - this.lastTime > this.timeOut) {
				console.log('大于',this.timeInterval);
				clearInterval(this.timeInterval);
				this.timeInterval = null
				this.$router.push({
					name: 'preview',
					params: {
						type: 'lock'
					}
				});
			}
		},
	},
	beforeDestroy() {
		// 最后一步，离开页面的时候，清除一下定时器，也解绑点击事件
		clearInterval(this.timeInterval);
		this.timeInterval = null
	},
}
</script>


<style lang="less">
html, body {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
  // white-space: nowrap
	.el-tooltip__popper {
			padding: 6px;
	}
}
</style>
