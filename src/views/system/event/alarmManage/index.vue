<template>
    <div class="alarm-manage">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="设备管理" name="first">
                <DeviceManage />
            </el-tab-pane>
            <el-tab-pane label="设备配置" name="second">
                <DeviceConfig :clickFlag="clickFlag"/>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import DeviceConfig from './DeviceConfig.vue';
import DeviceManage from './DeviceManage.vue'
export default {
	components: {
        DeviceConfig,
        DeviceManage,
	},
	props: {},
	data() {
		return{
            activeName: 'first',
            clickFlag:false,
		}
	},
    methods: {
        handleClick(e){
            this.clickFlag = e.name == 'second' ? true:false
        }
    }
}
</script>

<style scoped lang="less">
.alarm-manage {
    margin: -20px;
    margin-top: 0px;
    background: #ebeef2;
    min-width: 1200px;
    /deep/ .el-tabs__header {
        background: #fff;
        margin: 0;
        padding-left: 20px;
    }
}
</style>