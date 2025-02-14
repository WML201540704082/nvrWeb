<template>
    <div class="layout">
        <div class="channel">
            <channel-page></channel-page>
        </div>
        <div class="preview">
            <preview-page :isLock="isLock" @fullFlag="getFullFlag((arguments))"></preview-page>
        </div>
        <div class="control" v-show="!isFullFlag">
            <control-page></control-page>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <span>检测到您的浏览器版本过低，请下载新版本浏览器</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary"><a href="/static/360cse_13.5.2044.0.exe" download style="text-decoration:none;color:#ffffff;">下 载</a></el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import channelPage from './components/channel'
import previewPage from './components/preview'
import controlPage from './components/control'
export default {
    name: 'layoutIndex',
    data() {
        return {
            size: {
				contentWidth: window.innerWidth,
				contentHeight: window.innerHeight
			},
            isFullFlag: false,
            isLock: false,
            browserVersion: null,
            dialogVisible: false,
        }
    },
    components: {
        channelPage,
        previewPage,
        controlPage
    },
    created() {
        if (this.$route.params.type) {
            this.isLock = true
        }
        if (this.$route.params.browserVersion && localStorage.getItem('qt') != 'true') {
            this.browserVersion = this.$route.params.browserVersion
            console.log('this.browserVersion',this.browserVersion);
            let versionNo = Number(this.browserVersion.version.split('.')[0])
            if (this.browserVersion.browser == 'chrome' && versionNo < 86) {
                setTimeout(() => {
                    this.dialogVisible = true
                }, 1000);
            }
        }
    },
    methods: {
        getFullFlag(params) {
            console.log('(arguments)',params);
            if (params[1] && params[1] == 'false') {
                this.isLock = false
            } else if (params[1] && params[1] == 'true') {
                this.isLock = true
            }
            this.isFullFlag = params[0]
        },

        //handleClose之前无这样方法，加个空方法，使不报错
        handleClose(){
        },
    },
}
</script>
<style scoped lang="less">
.layout {
    display: flex;
    height: calc(100vh - 70px);
    background: #08233F;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    .channel {
        width: 250px;
        min-width: 250px;
        margin-top: -2px;
        margin-right: 5px;
    }
    .preview {
        width: calc(100vw - 500px);
        // height: calc(100vh - 70px);
        min-width: 750px;
        // background: yellow;
    }
    .control {
        float: right;
        margin-top: 3px;
        width: 250px;
        min-width: 250px;
        margin-left: 5px;
    }
}
</style>