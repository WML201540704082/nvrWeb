<template>
    <div style="width: 100%;height: 100%;">
        <div v-if="sessionId" style="width: 100%;height: calc(100% - 10px);position: absolute;"></div>
        <div class="channel">
            <div class="title">
                <div style="width:180px">
                    <span style="color: #ffffff; font-size: 18px;">设备通道</span>
                </div>
                <div class="refresh_icon" @click="changeAllChannel">
                    <div :class="{'disabled': !clickAllFlg}">
                        <svg-icon icon="eye_close" v-if="openNum" style="color: #ffffff; font-size: 13px; padding-left: 26px;"></svg-icon>
                        <svg-icon icon="eye_open" v-else style="color: #ffffff; font-size: 13px; padding-left: 26px;"></svg-icon>
                    </div>
                </div>
            </div>
            <div class="overflowChannel">
                <div v-for="(item,index) of channelList" :key="index">
                    <div class="channel_item" 
                        @dblclick="changePreview(item.channel,index,item.itemRef,item.eyeEnable,item.streamType)"
                        :style="{'color': item.eyeEnable ? '#1890FF' : '#ffffff', 
                                'pointerEvents': item.status != 1 ? 'none' : '',
                                'background-color': item.eyeEnable ? '#033E70' : ''}">
                        <!-- 通道名称 -->
                        <tooltip-over
                            :style="{'color': item.status != 1 ? '#AAB0BB' : ''}"
                            :content="item.channelName"
                            class="channel_name"
                            refName="channelName"
                        ></tooltip-over>
                        <!-- 切换码流 -->
                        <!-- <div v-if="item.streamEnable" style="position: absolute;left:140px;height: 40px;display: flex;flex-direction: column;justify-content: space-around;">
                            <button style="width:45px;height:18px;font-size:12px">主码流</button>
                            <button style="width:45px;height:18px;font-size:12px">子码流</button>
                        </div>
                        <div @click="showStream(index)">
                            <el-tooltip placement="top" :open-delay="500" style="cursor:pointer;height: 40px;line-height: 48px;">
                                <div slot="content"><pre style="overflow:auto;">切换码流</pre></div>
                                <svg-icon icon="share"></svg-icon>
                            </el-tooltip>
                        </div> -->
                        <div class="change-stream">
                            <el-tooltip placement="bottom" :open-delay="600" :offset="-2" effect="#003768" style="cursor:pointer;">
                                <div slot="content" class="con">
                                    <span class="tool-con" :style="{background: item.streamType === 0 ?  '#004A88' : ''}" @click="changeStream(0, item.channel, index)">
                                        <svg-icon icon="main-stream" class="stream-in"></svg-icon>
                                        <span class="title">主码流</span>
                                    </span>
                                    <!-- 判读主子码流是否存在 index 0是主码流 index 1是子码流 -->
                                    <span class="tool-con" v-show="item.streamInfo && item.streamInfo[1] && item.streamInfo[1].bitstream" :style="{background: item.streamType === 1 ?  '#004A88' : ''}" @click="changeStream(1, item.channel, index)">
                                        <svg-icon icon="sub-stream" class="stream-in"></svg-icon>
                                        <span class="title">子码流</span>
                                    </span>
                                </div>
                                <span>
                                    <svg-icon v-if="item.streamType === 0 && item.status === 1" icon="main-stream" class="stream"></svg-icon>
                                    <svg-icon v-else-if="item.streamType === 0 && item.status != 1" icon="main-stream-disabled" class="stream"></svg-icon>
                                    <svg-icon v-else icon="sub-stream" class="stream"></svg-icon>
                                </span>
                            </el-tooltip>
                        </div>
                        <!-- 开启预览 -->
                        <div class="open_preview" @click="changePreview(item.channel,index,item.itemRef,item.eyeEnable,item.streamType)">
                            <el-tooltip placement="right" :open-delay="500" effect="light" style="cursor:pointer;">
                                <div slot="content"><pre style="overflow:auto;">{{!item.eyeEnable ? '开启预览' : '关闭预览'}}</pre></div>
                                    <svg-icon :style="{'color': item.status != 1 ? '#AAB0BB' : ''}" v-if="!item.eyeEnable" icon="eye_open" class="preview_eye"></svg-icon>
                                    <svg-icon v-else icon="eye_close" class="preview_eye"></svg-icon>
                            </el-tooltip>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import bus from '@/utils/eventBus'
import { getChannelList, getVideoStatus } from '@/api';
import tooltipOver from "@/components/tooltipOver"
export default {
    data() {
        return {
            channelList: [],
            eyeVisible: true,
            videoSum: 0,
            openNum: 0,
            clickAllFlg: false,
            isAllClick: false,//是否是全选
            sessionId: false,
        }
    },
    components:{
        tooltipOver
    },
    mounted() {
        bus.$on('channel',(itemRef,id,sum,params,clearChannel,sessionId) => {
            if (sessionId) {
                this.sessionId = true
            } else {
                this.sessionId = false
            }
            if (clearChannel) {
                // 退出轮巡关闭所有正在播放的视频
                this.changeAllChannel()
            } else if (params) {
                this.refreshChannel()
                setTimeout(() => {
                    for (let i = 0; i < params.roundChannel.length; i++) {
                        this.changePreview(params.roundChannel[i].channel,params.roundChannel[i].index,'scene'+(i+1),false,this.channelList[i].streamType)
                    }
                }, 1000);
            } else {
                this.sum = sum
                if (id) {
                    this.channelList.forEach((item,index)=>{
                        if (item.channel == id) {
                            this.channelList[index].color = true
                        } else {
                            this.channelList[index].color = false
                        }
                    })
                    this.$forceUpdate()
                } else {
                    if (this.index || this.index === 0) {
                        this.channelList[this.index].itemRef = itemRef
                        this.channelList.forEach((item,index)=>{
                            if (index != this.index) {
                                this.channelList[index].color = false
                            } else {
                                this.channelList[this.index].color = true
                            }
                        })   
                    }
                }   
            }
        })
        document.addEventListener('visibilitychange', this.handleVisibleChange)

    },
    // 子组件被销毁前需解除绑定
    beforeDestroy() {
        document.removeEventListener('visibilitychange', this.handleVisibleChange)
        bus.$off('channel')
        this.hiddenTimer && clearTimeout(this.hiddenTimer);
    },
    created() {
        let aaa = JSON.parse(window.localStorage.getItem('permisions'))
        if (aaa && aaa.includes('PermChsLive')) {
            this.getChanelList()
        }
        setTimeout(() => {
            this.clickAllFlg = true
        }, 3000);
    },
    methods: {
        handleVisibleChange(e){
            switch(e.target.visibilityState){
                case 'prerender':
                // 网页预渲染，内容不可见
                  break;
                case 'hidden':
                  // 内容不可见，处理后台，最小化，锁屏状态
                  // 最小化页面一分钟后自动停止通道预览的播放
                 this.hiddenTimer= setTimeout(()=>{
                    this.operationChannel(false);
                    this.closeFlg=true;
                  },60000)
                  console.log('hidden update',new Date());
                  break;
                case 'visible':
                  // 离开页面再次进入后如果超过一分钟，重新开启通道预览
                  this.hiddenTimer && clearTimeout(this.hiddenTimer);
                  if(this.closeFlg){
                    this.closeFlg=false;
                    this.operationChannel(true);
                  }
                  break;
            }
        },
        operationChannel(flg){
            console.log(flg?'visible update!':'hidden update',new Date())
            let opnChannelList =this.channelList.filter(it=>it.eyeEnable===true); //获取正在播放的视频通道
                for(let item of opnChannelList){
                    bus.$emit('preview',{playFlag:flg,channelId:item.channel,itemRef:item.itemRef,
                        openNum:this.openNum,mode:0,channelLength:this.isAllClick?this.channelList.length:null
                    })
                }
        },
        getChanelList(type) {
            getChannelList().then((res) => {
                if (res.data.code === 200000) {
                    this.channelList = res.data.data.map(item=>{
                        return {
                            ...item,
                            streamEnable: false,
                            // streamListVisible: false,
                            streamType: 0,//0位主码流，1为子码流
                            eyeEnable: false,
                            channelName: item.channelType + item.channel + (!item.chanNameList ? '' : (item.chanNameList.length>0 ? ('-' + item.chanNameList[0].channelName) : '')),
                        }
                    }) || []
                    this.getVideoStatus()
                    if (JSON.parse(window.localStorage.getItem('change-preview')) && !type) {
                        let aaa = JSON.parse(window.localStorage.getItem('change-preview'))
                        this.changePreview(aaa.channel,aaa.index,aaa.itemRef)
                    }
                }
            });
        },
        getVideoStatus() {
            getVideoStatus().then((res) => {
                if (res.data.code === 200000) {
                    for (let i = 0; i < this.channelList.length; i++) {
                        for (let j = 0; j < res.data.data.length; j++) {
                            if (this.channelList[i].channel == res.data.data[j].channel) {
                                this.channelList[i].recordStateManual = res.data.data[j].recordStateManual === 21 ? true : false
                            }
                        }
                    }
                }
                this.$store.commit("changeChannelList",this.channelList);
            });
        },
        /**
         * 切换码流
         * @param {Number} mode 0-主 1-子
         * @param {String} channel 通道id
         * @param {Number} index 索引值
         */
        changeStream(mode, channel, index) {
            if(mode != this.channelList[index].streamType) {
                this.channelList.forEach(item => {
                    if(item.channel === channel && item.eyeEnable) {
                        this.changePreview(channel,index,item.itemRef,item.eyeEnable,item.streamType)
                        this.changePreview(channel,index,item.itemRef,item.eyeEnable,mode)
                    }
                })
                this.channelList[index].streamType = mode
            }
            // 为修改NVR-342bug做的临时处理
            this.getVideoStatus()
            this.$forceUpdate()
        },
        // 刷新
        refreshChannel() {
            bus.$emit('preview',{refresh: true})
            this.openNum = 0
            // this.getChanelList(true)
            this.channelList = this.channelList.map(item=>{
                return{
                    ...item,
                    eyeEnable: false
                }
            })
        },
        changeAllChannel() {
            if (this.openNum) {
                this.isAllClick = false
                this.refreshChannel()
            } else {
                if (this.clickAllFlg) {
                    this.isAllClick = true
                    let openNums = this.channelList.length || 64
                    for (let i = 0; i < openNums; i++) {
                        if (this.channelList[i].status == 1) {
                            this.changePreview(this.channelList[i].channel,i,'scene'+(i+1),false,this.channelList[i].streamType,this.channelList[i].status)
                        }
                    }
                    // bus.$emit('preview',{openNums})
                }
            }
        },
        // 切换码流
        showStream(index) {
            this.channelList[index].streamEnable = !this.channelList[index].streamEnable
        },
        // 小眼睛--观看视频
        changePreview(channel,index,itemRef,eyeEnable,mode = 0,status) {
            if (status && status != 1) {
                return
            }
            this.channelList[index].eyeEnable = !this.channelList[index].eyeEnable
            if (!eyeEnable) {
                let openNum = 0;
                for (let i = 0; i < this.channelList.length; i++) {
                    if (this.channelList[i].eyeEnable ) {
                        openNum += 1
                    }
                }
                // if (openNum > 32) {
                //     this.$message.warning('最多开启32路视频')
                //     return
                // }
                this.openNum = openNum
            } else {
                this.openNum--
            }
            console.log(channel,index,itemRef,mode,itemRef)
            if (channel && (index || index === 0) && !itemRef) {
                let params = {
                    channel: channel,
                    index: index,
                    itemRef: itemRef
                }
                window.localStorage.setItem('change-preview', JSON.stringify(params))
            }
            this.index = index
            bus.$emit('preview',{playFlag:!eyeEnable,channelId:channel,itemRef:null,openNum:this.openNum,mode,channelLength:this.isAllClick?this.channelList.length:null})
        },
    },
}
</script>
<style lang="less" scoped>
.channel {
    width: 100%;
    height: calc(100% - 10px);
    background: linear-gradient(360deg, #024B87 0%, #033763 19%, #032E54 100%);
    box-shadow: inset -4px 4px 10px 0px rgba(17,148,255,0.31);
    color: #697182;
    .design {
        width: 100%;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #131212;
        .design_img {
            margin: 0 15px -5px 30px;
            width: 20px;
            height: 20px;
        }
    }
    .title {
        height: 42px;
        line-height: 42px;
        padding-left: 10px;
        margin-top: 10px;
        background: linear-gradient(270deg, rgba(0,81,124,0) 0%, #005FB4 100%);
        display: flex;
        .refresh_icon {
            margin-top: 5px;
            margin-right: 10px;
            cursor: pointer;
            width: 60px;
            height: 25px;
            div.disabled:hover {
                cursor: not-allowed;
                color: currentColor;
            }
        }
    }
    .search {
        margin: 20px 15px 20px 6px;
        height: 20px;
        line-height: 20px;
        display: flex;
        cursor: pointer;
    }
    .overflowChannel {
        height: calc(100vh - 150px);
        margin-top: 10px;
        overflow-y: auto;
        .channel_item {
            width: 230px;
            height: 40px;
            display: flex;
            font-size: 13px;
            cursor: pointer;
            margin-left: 10px;
            .channel_name {
                // width: 180px;
                width: 205px;
                height: 100%;
                line-height: 40px;
                padding-left: 10px;
                overflow:hidden; //超出的文本隐藏
                text-overflow:ellipsis; //溢出用省略号显示
                white-space:nowrap; //溢出不换行
                // 双击不选中文字
                -moz-user-select:none;/*火狐*/
                -webkit-user-select:none;/*webkit浏览器*/
                -ms-user-select:none;/*IE10*/
                -khtml-user-select:none;/*早期浏览器*/
                user-select:none;
            }
            .open_preview{
                width: 30px;
                display: flex;
                justify-content: center;
                align-items: center;
                .preview_eye {
                    font-size: 12px;
                    margin-right: 12px;
                }
                &.disabled {
                    cursor: not-allowed;
                    color: #AAB0BB;
                    background: #003058db;
                    &:hover{
                        color: #AAB0BB;
                        background: #003058db;
                    }
                }
            }
            .change-stream {
                font-size: 12px;
                width: 30px;
                display: flex;
                justify-content: center;
                align-items: center;
                .stream {
                    margin-right: 8px;
                }
            }
        }
    }
    .left_bottom_button {
        background: rgb(31, 103, 152);
        z-index: 0;
        height: 50px;
        margin-top: 14px;
        box-shadow: 4px 4px 4px rgba(55, 50, 50, 0.71),-4px -4px 3px rgb(113, 174, 217);
        border-radius: 0px 20px 0px 0px;
    }
    ::-webkit-scrollbar {
        /*隐藏滚轮*/
        display: none;
    }
}
.el-tooltip__popper {
    max-width: 40%;
}
.con {
    width: 100px;
    border-radius: 2px;
    border: 1px solid #0056A0;
    .tool-con {
        background: #003768;
        width: 100px;
        display: flex;
        justify-content: center;
        cursor: pointer; 
        color: #ECFDFF; 
        text-align: center; 
        font-size: 12px;
        font-weight: 400;
        height: 28px; 
        line-height: 28px;
        border: none;
        .stream-in {
            margin-top: 4px;
            margin-right: 6px;
        }
    }
}
/deep/ .el-input__inner {
    border-color: #094171;
    background: #032f55;
    height: 35px;
    line-height: 3px;
    color: #ECFDFF;
}

</style>