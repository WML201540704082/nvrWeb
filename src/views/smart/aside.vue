<template>
    <div>
        <el-menu
            :default-active="this.$route.path"
            @open="handleOpen"
            @close="handleClose"
            background-color="#FFF"
            router
        >
            <el-menu-item index="/smart/eventBroadcast" v-if="permisions.includes('PermSmart')">
                <template slot="title">
                    <i class="el-icon-phone-outline"></i>
                    <span>事件播报</span>
                </template>
            </el-menu-item>
            <el-menu-item index="/smart/passRecord" v-if="permisions.includes('PermSmart')">
                <template slot="title">
                    <i class="el-icon-document-remove"></i>
                    <span>通行记录</span>
                </template>
            </el-menu-item>
            <el-menu-item index="/smart/params" v-if="permisions.includes('PermEventMng')">
                <template slot="title">
                    <i class="el-icon-tickets"></i>
                    <span>智能事件配置</span>
                </template>
            </el-menu-item>
            <el-menu-item index="/smart/lib" v-if="permisions.includes('PermEventMng')">
                <template slot="title">
                    <i class="el-icon-s-cooperation"></i>
                    <span>库管理</span>
                </template>
            </el-menu-item>
            <el-menu-item index="/smart/alg" v-if="permisions.includes('PermEventMng')">
                <template slot="title">
                    <i class="el-icon-s-operation"></i>
                    <span>算法管理</span>
                </template>
            </el-menu-item>
            <el-menu-item index="/smart/algorithmDetails" v-if="permisions.includes('PermEventMng')">
                <template slot="title">
                    <i class="el-icon-s-marketing"></i>
                    <span>算法详情</span>
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
/deep/ .el-menu-item:hover {
    background-color: #ecf5ff !important;
}
</style>
