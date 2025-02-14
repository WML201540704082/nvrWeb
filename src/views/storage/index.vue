<template>
	<el-container class="layout-container">
		<el-aside width="200px" class="aside">
			<app-aside class="aside-menu"/>
		</el-aside>
		<el-container >
			<el-main id="systemBox" class="main">
				<!-- 子路由出口 -->
				<router-view />
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
import AppAside from './aside'
export default {
	components: {
		AppAside
	},
	props: {},
	data() {
		return{
		}
	},
}
</script>

<style scoped lang="less">
.layout-container {
	padding: 5px 0 0 0;
	margin-top: -5px;
	height: calc(100vh - 72px);
  background: #ebeef2;
}
.aside {
	box-shadow: 2px 0px 10px 0px rgb(80 131 254 / 20%);
  margin-right: 15px;
  background: white;
	.aside-menu {
		height: 100%;
	}
}

.main {
}
</style>