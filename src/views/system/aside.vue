<template>
    <div class="aside_con">
        <el-menu
            :default-active="this.$route.path"
            @open="handleOpen"
            @close="handleClose"
            router
        >
            <el-submenu index="/system/netConfig" v-if="permisions.includes('PermNetMng')">
                <template slot="title">
                    <i class="el-icon-s-opportunity"></i>
                    <span>网络配置</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="/system/netConfig">基本配置</el-menu-item>
                    <el-menu-item index="/system/netConfig/topConfig">高级配置</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <!-- <el-menu-item index="/system/platformConfig" v-if="permisions.includes('PermSysMng')">
                <i class="el-icon-s-platform"></i>
                <span slot="title">平台设置</span>
            </el-menu-item> -->
            <el-submenu index="/system/systemManage/timeConfig" v-if="permisions.includes('PermSysMng') || permisions.includes('PermUserMng')">
                <template slot="title">
                    <i class="el-icon-s-operation"></i>
                    <span>系统管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="/system/systemManage/timeConfig" v-if="permisions.includes('PermSysMng')">时间配置</el-menu-item>
                    <el-menu-item index="/system/systemManage/userConfig" v-if="permisions.includes('PermUserMng')">用户配置</el-menu-item>
                    <el-menu-item index="/system/systemManage/moreConfig" v-if="permisions.includes('PermUserMng')">更多配置</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="/system/event/alarmManage" v-if="permisions.includes('PermEventMng')">
                <template slot="title">
                    <i class="el-icon-s-management"></i>
                    <span>事件管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="/system/event/alarmManage">报警管理</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group>
                    <el-menu-item index="/system/event/commonDeployment">普通事件布防</el-menu-item>
                </el-menu-item-group>
                <!-- <el-menu-item-group>
                    <el-menu-item index="/system/event/alarminput">报警输入</el-menu-item>
                </el-menu-item-group> -->
            </el-submenu>
            <el-submenu index="/system/maintain/logDownload" v-if="permisions.includes('PermSysMaintain')">
                <template slot="title">
                    <i class="el-icon-collection"></i>
                    <span>产品维护</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="/system/maintain/logDownload">设备日志</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group>
                    <el-menu-item index="/system/maintain/deviceInfo">设备信息</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group>
                    <el-menu-item index="/system/maintain/deviceMaintain">设备维护</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group>
                    <el-menu-item index="/system/maintain/channelInfo">通道信息</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group>
                    <el-menu-item index="/system/maintain/deviceRecovery">设备恢复</el-menu-item>
                </el-menu-item-group>
                <!-- <el-menu-item-group>
                    <el-menu-item index="/system/maintain/videoStateDetection">录像状态检测</el-menu-item>
                </el-menu-item-group> -->
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
export default {
    name: 'AppAside',
    components: {},
    props: {},
    data() {
        return{
            permisions: []
        }
    },
    created() {
    },
    mounted() {
        this.permisions = JSON.parse(window.localStorage.getItem('permisions'))
    },
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        }
    },
}
</script>

<style scoped lang="less">
.aside-img{
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.aside_con::-webkit-scrollbar {
    /*隐藏滚轮*/
    display: none;
}
.aside_con {
    scrollbar-width: none; /* firefox */
    -ms-overflow-style: none; /* IE 10+ */
    overflow-x: hidden;
    overflow-y: auto;
}
</style>
