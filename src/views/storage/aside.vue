<template>
    <div>
        <el-menu
            :default-active="this.$route.path"
            @open="handleOpen"
            @close="handleClose"
            router
        >
            <el-submenu index="/storage/video/videoProgram" v-if="permisions.includes('PermRecordMng')">
                <template slot="title">
                    <i class="el-icon-video-camera-solid"></i>
                    <span>录像管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="/storage/video/videoProgram">录像计划</el-menu-item>
                    <el-menu-item index="/storage/video/commonParameter">通用参数</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-menu-item index="/storage/partybuffalo" v-if="permisions.includes('PermHardDiskMng')">
                <template slot="title">
                    <i class="el-icon-collection"></i>
                    <span>硬盘管理</span>
                </template>
            </el-menu-item>
            <el-menu-item index="/storage/storageschema" v-if="permisions.includes('PermHardDiskMng')">
                <template slot="title">
                    <i class="el-icon-s-finance"></i>
                    <span>存储模式</span>
                </template>
            </el-menu-item>
            <el-menu-item index="/storage/raidmanage" v-if="permisions.includes('PermHardDiskMng')">
                <template slot="title">
                    <i class="el-icon-receiving"></i>
                    <span>RAID管理</span>
                </template>
            </el-menu-item>
            <el-menu-item index="/storage/diskcheck" v-if="permisions.includes('PermHardDiskMng')">
                <template slot="title">
                    <i class="el-icon-magic-stick"></i>
                    <span>硬盘检测</span>
                </template>
            </el-menu-item>
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
</style>
