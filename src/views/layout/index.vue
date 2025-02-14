<template>
	<div style="overflow: hidden;">
		<div class="main-content" :style="{display:qt?'none':''}">
			<div class="top">
				<img src="@/assets/img/top_bg1920.png" alt="backgroundImage is not found" class="top_bg">
				<div class="header-main-title">
					<span class="nvr-header-title top-title">
						{{ title }}
					</span>
				</div>
				<el-menu 
					:default-active="activeMenu"
					@open="handleOpen"
					@select="selectOpen"
					text-color="#fff" 
					active-text-color="#fff"
					:router="true" mode="horizontal"
					class="nav_item">
					<!--引用其他子应用-->
					<el-menu-item :class="size.contentWidth > 1440 ? 'btnItem' : 'btnItem1'"
						index="/preview" v-if="permission.includes('PermChsLive')">
						<div class="btn_span">
							视频预览
						</div>
					</el-menu-item>
					<el-menu-item :class="size.contentWidth > 1440 ? 'btnItem' : 'btnItem1'"
						index="/playback" v-if="permission.includes('PermChsPlayback')">
						<div class="btn_span">
							录像回放
						</div>
					</el-menu-item>
						
					<!-- 如果有PermSmart权限说明有时间播报和通行记录菜单，初次点击应进入时间播报界面 -->
					<el-menu-item :class="size.contentWidth > 1440 ? 'btnItem' : 'btnItem1'"
						index="/smart/eventBroadcast" v-if="permission.includes('PermSmart')">
						<div class="btn_span">
							智能分析
						</div>
					</el-menu-item>
					<!-- 如果没有PermSmart权限但是有PermEventMng权限说明没有有时间播报和通行记录菜单，初次点击应进入智能事件配置界面 -->
					<el-menu-item :class="size.contentWidth > 1440 ? 'btnItem' : 'btnItem1'"
						index="/smart/params" v-if="!permission.includes('PermSmart') && permission.includes('PermEventMng')">
						<div class="btn_span">
							智能分析
						</div>
					</el-menu-item>

					<el-menu-item :class="size.contentWidth > 1440 ? 'btnItem' : 'btnItem1'"
						index="/channel/channelConfig" v-if="permission.includes('PermChanMng')">
						<div class="btn_span">
							通道管理
						</div>
					</el-menu-item>
					<!-- 存储管理同理 -->
					<el-menu-item :class="size.contentWidth > 1440 ? 'btnItem' : 'btnItem1'"
						index="/storage/video/videoProgram" v-if="permission.includes('PermHardDiskMng')">
						<div class="btn_span">
							存储管理
						</div>
					</el-menu-item>
					<el-menu-item :class="size.contentWidth > 1440 ? 'btnItem' : 'btnItem1'"
						index="/storage/video/videoProgram" v-if="!permission.includes('PermHardDiskMng') && permission.includes('PermRecordMng')">
						<div class="btn_span">
							存储管理
						</div>
					</el-menu-item>
					<!-- 系统设置同理 -->
					<el-menu-item :class="size.contentWidth > 1440 ? 'btnItem' : 'btnItem1'"
						index="/system/netConfig" v-if="permission.includes('PermNetMng')">
						<div class="btn_span">
							系统设置
						</div>
					</el-menu-item>
					<el-menu-item :class="size.contentWidth > 1440 ? 'btnItem' : 'btnItem1'"
						index="/system/systemManage/timeConfig" v-if="(!permission.includes('PermNetMng') && permission.includes('PermSysMng'))">
						<div class="btn_span">
							系统设置
						</div>
					</el-menu-item>
					<el-menu-item :class="size.contentWidth > 1440 ? 'btnItem' : 'btnItem1'"
						index="/system/systemManage/userConfig" v-if="(!permission.includes('PermNetMng') && !permission.includes('PermSysMng') && permission.includes('PermUserMng'))">
						<div class="btn_span">
							系统设置
						</div>
					</el-menu-item>
					<el-menu-item :class="size.contentWidth > 1440 ? 'btnItem' : 'btnItem1'"
						index="/system/event/alarmManage" v-if="(!permission.includes('PermNetMng') && !permission.includes('PermSysMng') && !permission.includes('PermUserMng') && permission.includes('PermEventMng'))">
						<div class="btn_span">
							系统设置
						</div>
					</el-menu-item>
					<el-menu-item :class="size.contentWidth > 1440 ? 'btnItem' : 'btnItem1'"
						index="/system/maintain/logDownload" v-if="(!permission.includes('PermNetMng') && !permission.includes('PermSysMng') && !permission.includes('PermUserMng') && !permission.includes('PermEventMng') && permission.includes('PermSysMaintain'))">
						<div class="btn_span">
							系统设置
						</div>
					</el-menu-item>
				</el-menu>
				<div class="header-right">
					<div
            class="notify-con"
            v-if="permission.includes('PermSmart')"
            @click="notifyClick"
						
          >
            <svg-icon style="margin: 0px 15px -5px 0px;" icon="bell" class="smart-bell"></svg-icon>
            <span
              v-if="this.$store.getters.getEvent"
              class="smart-dot"
            ></span>
          </div>
					<div class="exit_content">
						<el-header class="header">
							<svg-icon style="margin: 0px 15px -5px 0px;" icon="userindex"></svg-icon>
						<el-dropdown class="header-dropdown">
							<span class="el-dropdown-link" >
								{{user.userName || '--'}}<i class="el-icon-arrow-down el-icon--right"></i>
							</span>
							<el-dropdown-menu slot="dropdown" style="margin-top:-10px">
								<el-dropdown-item
									@click.native="editPassword"
								>修改密码</el-dropdown-item>
								<el-dropdown-item
									@click.native="onLogout"
								>退出</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
						</el-header>
					</div>
				</div>
			</div>
		</div>
        <edit ref="edit"></edit>
		<router-view></router-view>
	</div>
</template>

<script>
import { logout} from '@/api';
import { HOST} from "@/utils/constant";
import edit from './edit'
export default {
	inject: ["size"],
	data() {
		return {
			user: {
				userName: ''
			},
			title:'',
			activeMenu: this.$route.path,
			permission: [],
			again: false,
			qt: false,
		}
	},
	components: {
        edit
    },
	mounted() {
		this.qt = localStorage.getItem('qt') == 'true' ? true : false
		this.user = JSON.parse(window.localStorage.getItem('user'))
		this.permission = JSON.parse(window.localStorage.getItem('permisions'))
		this.userIp = window.localStorage.getItem('userIp')
		this.userID = window.localStorage.getItem('userID')
	},
	created() {
		this.title = window.localStorage.getItem('title')
		this.getNotifyData()
		if(this.$route.path.includes('system')) {
			this.activeMenu = '/system/netConfig'
		} else if(this.$route.path.includes('storage')) {
			this.activeMenu = '/storage/video/videoProgram'
		} else if(this.$route.path.includes('smart')) {
			this.activeMenu = '/smart/eventBroadcast'
		} else if(this.$route.path.includes('channel')) {
			this.activeMenu = '/channel/channelConfig'
		} else {
			this.activeMenu = this.$route.path
		}
	},
	watch: {
		$route(to, from) {
			let val = to.path;
			if(val.includes('system')) {
				this.activeMenu = '/system/netConfig'
			} else if(val.includes('storage')) {
				this.activeMenu = '/storage/video/videoProgram'
			} else if(val.includes('smart')) {
				this.activeMenu = '/smart/eventBroadcast'
				if(val === '/smart/eventBroadcast') {
					this.$store.commit("changeEvent", false)
				}
			} else if(val.includes('channel')) {
				this.activeMenu = '/channel/channelConfig'
			} else {
				this.activeMenu = this.$route.path
			}
			if (to.path == "/smart/algorithmDetails") {
				window.location.reload();
			}
		}
	},
    methods: {
		notifyClick() {
			const path = '/smart/eventBroadcast'
			if (this.$route.path !== path) {
				this.$store.commit("changeEvent", false)
				this.$router.push(path)
			}
			this.$store.getters.getEvent && location.reload(true)
		},
		getNotifyData() {
			const token = JSON.parse(localStorage.getItem('user')).token
			// 实例化socket
			this.$socket = new WebSocket(`ws://${HOST}/api/notify?Authorization=${token}`);
			// 监听socket连接
			this.$socket.onopen = this.open;
			// 监听socket消息
			this.$socket.onmessage = this.getMessage;
			// 监听socket错误信息
			this.$socket.onerror = this.error;
			// 监听socket关闭
			this.$socket.onclose = this.close;
		},
		open() {
			// 连接成功
			console.log("socket已连接")
		},
		getMessage(msg) {
			msg = JSON.parse(msg.data)
			if (msg.code === 401000) {
				if (!this.again) {
					this.again = true
					this.getNotifyData()
				} else {
					this.$router.push('/login')
				}
			} else {
				this.again = false
				switch (msg.type) {
					case ('eventUpdate'):
						this.$store.commit("changeEvent", true);
						break;
					case "faceImport":
						this.$store.commit("changeFaceImport",msg.data);
						break;
					case "userKickOut":
						if(this.userIp === msg.data.data.ip && this.userID == msg.data.data.uid) {
							this.$router.push('/login')
							this.$message('您已被强制下线！')
						}
						break;
				}
			}
		},
		error(err) {
			console.log("socket连接错误");
		},
		close() {
			// 关闭
			console.log("socket已经关闭");
		},
		// 修改密码
		editPassword() {
			this.$nextTick(() => {
                this.$refs['edit'].init()
            })
		},
		onLogout() {
			// 下线
			this.offline()
		},
		async offline() {
			// 关闭下载窗口
			let dnFormId = window.localStorage.getItem("downloadFormId")
			if (dnFormId) {
				this.$layer.close(dnFormId)
			}
			// 跳转到登录页面
			this.$router.push('/login')
			window.localStorage.removeItem('change-preview')
			logout(JSON.parse(localStorage.getItem('user')).token)
			// 把用户的登录状态清除
			window.localStorage.removeItem('user')
		},
		handleOpen(key, keyPath) {
			console.log(key, keyPath);
			window.localStorage.removeItem('change-preview')
		},
		selectOpen(index, indexPath) {
			if (index === '/smart/eventBroadcast') {
				this.$store.commit("changeEvent", false);
			} else {
				this.$store.commit("changeRouter", index);
			}
		}
	},
	destroyed() {
		this.$socket.close()
	},
};
</script>
<style lang="less" scoped>
.main-content {
	width: 100%;
	background: #08233F;
	display: flex;
	user-select: none;
	-webkit-user-select: none;
	-moz-user-select: none;
	font-family: seri;
	font-family: YouSheBiaoTiHei;
	.top {
		width: 100%;
		height: 70px;;
		.top_bg {
			width: 100%;
			min-width: 1280px;
			height: 70px;
			position: absolute;
		}
		.header-main-title {
			width: 27.5%;
			min-width: 350px;
			position: absolute;
			font-size: 30px;
			display: flex;
    		justify-content: center;
			.top-title {
				display: inline-block;
				margin-top: 1%;
				// margin-left: 12%;
				color: #ECFDFF;
				line-height: 65px;
				letter-spacing: 5px;
				overflow:hidden; //超出的文本隐藏
                white-space:nowrap; //溢出不换行
			}
		}
		.nav_item {
			top: 29%;
			margin-left: 28%;
			background: none;
			color: #ECFDFF;
			font-size: 21px;
			width: 55%; 
			display: flex;
    		justify-content: space-between;
			min-width: 700px;
		}
		.btnItem {
			margin-left: 6%;
    		font-size: 23px;
			padding-left: 0px;
    		width: calc(6% + 32px);
			height: 45px;
			line-height: 45px;
		}
		.btnItem1 {
			margin-left: 5%;
    		font-size: 20px;
			padding-left: 0px;
			width: 80px;
			height: 45px;
			line-height: 45px;
		}
		.btn_span {
			letter-spacing: 3px;
			width: auto;
		}
		.header-right {
			right: 0;
			top: 0;
			height: 80px;
			line-height: 80px;
			position: absolute;
			display: flex;
			justify-content: space-between;
			flex-direction: row;
			cursor: pointer;
			.notify-con {
				width: 32px;
    			position: relative;
			}
			.smart-bell {
				color: #fff;
			}
			.smart-dot {
				position:absolute;
				top: 20px;
    		right: 5px;
				width:12px;
				height:12px;
				background-color:red;
				border-radius:6px;
			}
			.exit_content {
				font-family: 'Times New Roman', Times, serif;
				letter-spacing: 1px;
				display: inline-block;
				.header {
					.header-dropdown {
						margin-top: 0;
						cursor: pointer;
						color: #ffffff;
					}
				}
			}
		}
	}
  .el-menu.el-menu--horizontal {
    border-bottom: none;
  }
	.el-menu--horizontal>.el-menu-item {
    background: none;
	}
  .el-menu--horizontal>.el-menu-item.is-active {
    background: none;
		border-bottom: 2px solid #009EFF !important;
  }
}
</style>>