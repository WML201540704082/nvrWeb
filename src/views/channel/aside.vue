<template>
    <div>
        <el-menu
            :default-active="this.$route.path"
            @open="handleOpen"
            @close="handleClose"
            text-color="#000"
            router
        >
            <el-menu-item index="/channel/channelConfig" v-if="permisions.includes('PermChanMng')">
                <template slot="title">
                    <i class="el-icon-tickets"></i>
                    <span>通道配置</span>
                </template>
            </el-menu-item>
            <el-menu-item index="/channel/bigstreamConfig" v-if="permisions.includes('PermChanMng')">
                <template slot="title">
                    <i class="el-icon-s-cooperation"></i>
                    <span>码流配置</span>
                </template>
            </el-menu-item>
            <el-menu-item index="/channel/overlayConfig" v-if="permisions.includes('PermChanMng')">
                <template slot="title">
                    <i class="el-icon-document-remove"></i>
                    <span>画面显示配置</span>
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
