<template>
    <div :class="isFullFlag ? 'is-fullscreen' : 'normal'">
        <div class="preview">
            <div :class="isFullFlag ? 'frame_full' : 'frame'" id="canvas_form">
                <div style="display:flex;flex-wrap: wrap;">
                    <div v-for="(item,index) of page16List" :key="index">
                        <div v-show="index >= (pageNum-1)*division_show_index && index < pageNum*division_show_index" :style="{width:(division_show_index === 1 ? (canvasWidth - 1) : division_show_index === 4 ? (canvasWidth/2 - 2) :
                                            division_show_index === 9 ? (canvasWidth/3 - 2): (canvasWidth/4 - 2)) + 'px',
                                    height:(division_show_index === 1 ? (canvasHeight - 1) : division_show_index === 4 ? (canvasHeight/2 - 2) :
                                            division_show_index === 9 ? (canvasHeight/3 - 2): (canvasHeight/4 - 2)) + 'px',background:'#333333',
                                    border:(item.highlight ? '1px solid #009EFF' : '1px solid black'),
                                    cursor: 'pointer'}"
                                    @click="clickCanvas(item)"
                                    @dblclick="dbClickCanvas(item)">
                            <canvas
                                :ref="item.ref"
                                style="position:absolute;"
                                :style="{marginTop:videoTop,
                                    marginLeft:videoLeft}"
                            ></canvas>
                            <div class="name_con" v-show="item.leftChannelName"  
                                :style="{
                                    width: !item.topNameFlag ? (20 + 'px') : '',
                                    background: !item.topNameFlag ? 'none' : ''
                                }">
                                <span class="channel_name" v-show="item.topNameFlag">
                                    {{item.leftChannelName}}
                                </span>
                                <span class="menu_icon" @click="changeTopName(index)">
                                    <svg-icon v-if="item.channelId && item.topNameFlag" icon="menu_close"></svg-icon>
                                    <svg-icon v-else-if="item.channelId && !item.topNameFlag" icon="menu_open"></svg-icon>
                                </span>
                            </div>
                            <canvas
                                :ref="item.cover"
                                :id="item.cover"
                                width="180"
                                height="100"
                                style="position:absolute;"
                                :style="{marginTop: item.leftChannelName ? -25 + 'px' : ''}"
                            ></canvas>
                        </div>
                    </div>
                </div>
            </div>
            <div class="operate_topCenter" :style="{left: isLocal ? `calc(50vw - 139px)` : `calc(50vw - 170px)`}" v-show="!isFullFlag">
                <!-- 单帧 -->
                <div class="icon_item icon_item1" :class="{disabled: $store.getters.getSyncPlayMode}" @click="singleClick()">
                    <div class="icon_title">单帧</div>
                    <svg-icon icon="single_click" class="item_icon"></svg-icon>
                </div>
                <!-- 截图 -->
                <div class="icon_item" :class="{disabled: $store.getters.getSyncPlayMode}" @click="shotClick()" v-if="!isLocal">
                    <div class="icon_title">截图</div>
                    <svg-icon icon="screenshot" class="item_icon"></svg-icon>
                </div>
                <!-- 锁定 -->
                <div class="icon_item" :class="{disabled: $store.getters.getSyncPlayMode}" @click="lockClick()">
                    <div class="icon_title">锁定</div>
                    <svg-icon icon="lock" class="item_icon"></svg-icon>
                </div>
                <!-- 标签 -->
                <div class="icon_item" :class="{disabled: $store.getters.getSyncPlayMode}" @click="tagClick()">
                    <div class="icon_title icon_title1">标签</div>
                    <svg-icon icon="tag" class="item_icon"></svg-icon>
                </div>
                <!-- 音量 -->
                <div class="icon_item icon_item2" :class="{disabled: (speed != 1 || !playbackFlag)}" @click="changeVolume()">
                    <div class="icon_title">音量</div>
                    <svg-icon icon="volume" class="item_icon" v-if="volume"></svg-icon>
                    <svg-icon icon="volume_disable" class="item_icon" v-else></svg-icon>
                    <span v-if="!arrowFlag" class="volume_res">{{ volume }}</span>
                    <span class="volume_pro" v-if="arrowFlag">
                        <Progress :min="0" :max="100" v-model="volume"></Progress>
                    </span>
                </div>
            </div>
            <div class="operate" v-show="!isFullFlag">
                <div class="operate-left">
                    <el-button-group>
                        <el-tooltip class="item" effect="light" content="常规播放" placement="top">
                            <el-button @click="onAsyncPlayMode" size="mini" :type="!this.$store.getters.getSyncPlayMode? 'primary': ''" class="async-mode-button" :class="{checked: !this.$store.getters.getSyncPlayMode}"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="light" content="同步播放" placement="top">
                            <el-button @click="onSyncPlayMode" size="mini" :type="this.$store.getters.getSyncPlayMode? 'primary': ''" class="sync-mode-button" :class="{checked: this.$store.getters.getSyncPlayMode}"></el-button>
                        </el-tooltip>
                    </el-button-group>
                </div>
                <div class="operate_center" :style="{left: screenWidth < 1260 ? '470px' : 'calc(50vw - 243px)'}">
                    <div class="svgMain">
                        <span @click="changeMinus">
                            <svg-icon icon="leftFast" class="svgClass"></svg-icon>
                        </span>
                    </div>
                    <div class="svgSpeed">{{speed}}x</div>
                    <div class="svgMain svgMain1">
                        <span @click="changePlus">
                            <svg-icon icon="rightFast" class="svgClass"></svg-icon>
                        </span>
                    </div>
                    <div class="svgMain">
                        <el-tooltip :disabled="$store.getters.getSyncPlayMode" effect="light" :content="playbackFlag ? '倒放' : '暂停'" placement="top" :open-delay="300">
                            <span v-if="!$store.getters.getSyncPlayMode" @click="backPlay">
                                <svg-icon v-if="playbackFlag" icon="leftSuspend" class="svgClass"></svg-icon>
                                <svg-icon v-else icon="play" class="svgClass"></svg-icon>
                            </span>
                            <span v-if="$store.getters.getSyncPlayMode">
                                <svg-icon v-if="playbackFlag" icon="leftSuspend" class="svgClass" :style="{color: '#AAB0BB', cursor: 'not-allowed'}"></svg-icon>
                            </span>
                        </el-tooltip>
                    </div>
                    <div class="svgMain">
                        <div class="svgPlay">
                            <el-tooltip effect="light" :content="isVideoPaused ? '播放' : '暂停'" placement="top" :open-delay="300">
                                <span @click="playVideoDebounce">
                                    <svg-icon v-if="isVideoPaused" icon="suspend" class="svgClass1 svgClass2"></svg-icon>
                                    <svg-icon v-else icon="play" class="svgClass1"></svg-icon>
                                </span>
                            </el-tooltip>
                        </div>
                    </div>
                    <div class="svgMain">
                        <el-tooltip effect="light" content="停止" placement="top" :open-delay="300">
                            <span @click="closeVideo">
                                <svg-icon icon="stop" class="svgClass"></svg-icon>
                            </span>
                        </el-tooltip>
                    </div>
                </div>
                <div class="operate_right" :style="{'right': isFullFlag ? '0px' : ''}">
                    <span style="margin:-8px 0 0 -12px">
                        <el-tooltip :disabled="$store.getters.getSyncPlayMode || (this.page16List.findIndex(item=>item.singleFlag)>-1 && isFireFox)" placement="top" :open-delay="300" effect="#003768" :style="{cursor:($store.getters.getSyncPlayMode || (this.page16List.findIndex(item=>item.singleFlag)>-1 && isFireFox)) ? 'not-allowed':'pointer', color: $store.getters.getSyncPlayMode? '#AAB0BB': '#FFFFFF'}">
                            <div v-if="!$store.getters.getSyncPlayMode" slot="content" class="con">
                                <span v-for="(item,index) of divisionArray" class="tool_con" :key="index">
                                    <span class="con_item"  @click="clickDivision(item)" :style="{background: division_show_index === item.index ?  '#004A88' : ''}">{{item.name}}</span>
                                    <span v-if="index!==3"><br/></span>
                                </span>
                            </div>
                            <svg-icon icon="division" style="width: 1.8em;height: 1.8em;cursor: pointer;margin: 12px 0 15px 12px;color: #ffffff;"></svg-icon>
                        </el-tooltip>
                    </span>
                    <!-- <el-tooltip placement="top" :open-delay="300" effect="light" content="倍速">
                        <span style="color: #fff; margin: 5px -7px 7px 18px;">
                            x{{ speed }}
                        </span>
                    </el-tooltip> -->
                    <!-- 分页 -->
                    <div style="width:30px;height:30px;line-height: 34px;cursor: pointer;margin-top: 2px;color: #ffffff;text-align: center;margin-left: 10px;" @click="leftClick"><i class="el-icon-arrow-left"></i></div>
                    <div style="width:40px;line-height: 34px;margin-top: 2px;color: #ffffff;text-align: center;">{{pageNum + '/' + pageSize}}</div>
                    <div style="width:30px;height:30px;line-height: 34px;cursor: pointer;margin-top: 2px;color: #ffffff;text-align: center;margin-right: 10px;" @click="rightClick"><i class="el-icon-arrow-right"></i></div>
                    <!-- 切换分辨率 -->
                    <span>
                        <el-tooltip :disabled="this.page16List.findIndex(item=>item.singleFlag)>-1 && isFireFox" placement="top" :open-delay="300" effect="#003768" :style="{cursor:(this.page16List.findIndex(item=>item.singleFlag)>-1 && isFireFox) ? 'not-allowed':'pointer'}">
                            <div slot="content" class="con">
                                <span v-for="(item,index) of scaleArray" class="tool_con" :key="index">
                                    <span class="con_item" @click="changeScale(item)" :style="{background: scale_show_index === item.index ?  '#004A88' : ''}">{{item.name}}</span>
                                    <span v-if="index!==3"><br/></span>
                                </span>
                            </div>
                            <svg-icon icon="video_scale" style="width: 2em;height: 2em;cursor: pointer;margin: 2px 0 15px 0px;color: #ffffff;"></svg-icon>
                        </el-tooltip>
                    </span>
                    <!-- 下载 
                    <span @click="downloadClick()">
                        <svg-icon icon="download" style="margin: 5px 0 15px 14px; color: #ffffff; cursor: pointer; font-size: 17px;"></svg-icon>
                    </span>-->
                    <el-tooltip placement="top" :open-delay="300" effect="light" style="cursor:pointer;">
                        <div slot="content">下载</div>
                        <span @click="download2Click()">
                            <svg-icon icon="download" style="width: 1.7em;height: 1.7em;margin: 5px 0 0 15px; color: #ffffff; cursor: pointer; font-size: 15px;"></svg-icon>
                        </span>
                    </el-tooltip>
                    <!-- 展开 -->
                    <div @click="clickOpen">
                        <el-tooltip :disabled="this.page16List.findIndex(item=>item.singleFlag)>-1 && isFireFox" placement="top" :open-delay="300" effect="light" :style="{cursor:(this.page16List.findIndex(item=>item.singleFlag)>-1 && isFireFox) ? 'not-allowed':'pointer'}" v-if="!isFullFlag">
                            <div slot="content">全屏</div>
                            <svg-icon icon="amplify" style="width: 1.8em;height: 1.7em;margin: 5px 0px 15px 15px;cursor: pointer;color: #ffffff;"></svg-icon>
                        </el-tooltip>
                        <el-tooltip placement="top" :open-delay="300" effect="light" style="cursor:pointer;" v-if="isFullFlag">
                            <div slot="content">取消全屏</div>
                            <svg-icon icon="shrink" style="margin: 5px 5px 5px 15px;cursor: pointer;color: #ffffff;"></svg-icon>
                        </el-tooltip>
                    </div>
                </div>
            </div>
        </div>
        <!-- <download ref="download"></download> -->
        <canvas id="download-canvas" style="visibility: hidden;"></canvas>
        <lock ref="lock"></lock>
        <tag ref="tag"></tag>
    </div>
</template>
<script>
import { dataURLtoBlob } from '@/utils/download'
import { HOST} from "@/utils/constant";
import { timer } from "@/utils";
import { ctrlRecordVideo, setAudioCtrl, screenshot } from '@/api';
import elementResizeDetectorMaker from 'element-resize-detector'
import { getRecordMaskArea, getChannelList } from '@/api'
import download from './download.vue';
import download2 from './download2.vue';
import lock from './lock.vue';
import Tag from './tag.vue';
import Progress from '@/components/progress'
import screenfull from "screenfull"
import moment from "moment";
import axios from 'axios';
export default {
    components: {
        download,
        download2,
        lock,
        Tag,
        Progress
    },
    inject: ["size"],
    data() {
        return {
            back: false,
            arrowFlag: false,
            volumeVal: 0,
            timestamp: null,
            isFullFlag: false,
            downloadVis: false,
            isDisableDrag: false,
            CONTROL: {
                PLAY_0: 0,
                PAUSE_1: 1,
                SEEK_2: 2,
                SPEED_3: 3,
                SINGLE_4: 4,
                BACK_5: 5,
            },
            divisionArray: [{
                name: '单页面',
                index: 1
            },{
                name: '四页面',
                index: 4
            // },{
            //     name: '九页面',
            //     index: 9
            // },{
            //     name: '十六页面',
            //     index: 16
            }],
            division_prev_index: 4,
            division_prev_pagenum: 1,
            division_show_index: 4,
            playParams: { lateopen: true, preset: "realtime" },
            isLoading: false,
            isCaching: false,
            bboxEabled: true,
            canvasWidth: null,
            canvasHeight: null,
            page16List: [{
                ref: 'scene1',
                speed: 1,
                speed_show_index: 4,
                isVideoPaused: true,
                playbackFlag: true,
                speedFlag: false,
                speedBackFlag: false,
                topNameFlag: false,
                singleFlag: false,
                cover: 'coverArray1'
            },{
                ref: 'scene2',
                speed: 1,
                speed_show_index: 4,
                isVideoPaused: true,
                playbackFlag: true,
                speedFlag: false,
                speedBackFlag: false,
                topNameFlag: false,
                singleFlag: false,
                cover: 'coverArray2'
            },{
                ref: 'scene3',
                speed: 1,
                speed_show_index: 4,
                isVideoPaused: true,
                playbackFlag: true,
                speedFlag: false,
                speedBackFlag: false,
                topNameFlag: false,
                singleFlag: false,
                cover: 'coverArray3'
            },{
                ref: 'scene4',
                speed: 1,
                speed_show_index: 4,
                isVideoPaused: true,
                playbackFlag: true,
                speedFlag: false,
                speedBackFlag: false,
                topNameFlag: false,
                singleFlag: false,
                cover: 'coverArray4'
            },{
                ref: 'scene5',
                speed: 1,
                speed_show_index: 4,
                isVideoPaused: true,
                playbackFlag: true,
                speedFlag: false,
                speedBackFlag: false,
                topNameFlag: false,
                singleFlag: false,
                cover: 'coverArray5'
            },{
                ref: 'scene6',
                speed: 1,
                speed_show_index: 4,
                isVideoPaused: true,
                playbackFlag: true,
                speedFlag: false,
                speedBackFlag: false,
                topNameFlag: false,
                singleFlag: false,
                cover: 'coverArray6'
            },{
                ref: 'scene7',
                speed: 1,
                speed_show_index: 4,
                isVideoPaused: true,
                playbackFlag: true,
                speedFlag: false,
                speedBackFlag: false,
                topNameFlag: false,
                singleFlag: false,
                cover: 'coverArray7'
            },{
                ref: 'scene8',
                speed: 1,
                speed_show_index: 4,
                isVideoPaused: true,
                playbackFlag: true,
                speedFlag: false,
                speedBackFlag: false,
                topNameFlag: false,
                singleFlag: false,
                cover: 'coverArray8'
            },{
                ref: 'scene9',
                speed: 1,
                speed_show_index: 4,
                isVideoPaused: true,
                playbackFlag: true,
                speedFlag: false,
                speedBackFlag: false,
                topNameFlag: false,
                singleFlag: false,
                cover: 'coverArray9'
            },{
                ref: 'scene10',
                speed: 1,
                speed_show_index: 4,
                isVideoPaused: true,
                playbackFlag: true,
                speedFlag: false,
                speedBackFlag: false,
                topNameFlag: false,
                singleFlag: false,
                cover: 'coverArray10'
            },{
                ref: 'scene11',
                speed: 1,
                speed_show_index: 4,
                isVideoPaused: true,
                playbackFlag: true,
                speedFlag: false,
                speedBackFlag: false,
                topNameFlag: false,
                singleFlag: false,
                cover: 'coverArray11'
            },{
                ref: 'scene12',
                speed: 1,
                speed_show_index: 4,
                isVideoPaused: true,
                playbackFlag: true,
                speedFlag: false,
                speedBackFlag: false,
                topNameFlag: false,
                singleFlag: false,
                cover: 'coverArray12'
            },{
                ref: 'scene13',
                speed: 1,
                speed_show_index: 4,
                isVideoPaused: true,
                playbackFlag: true,
                speedFlag: false,
                speedBackFlag: false,
                topNameFlag: false,
                singleFlag: false,
                cover: 'coverArray13'
            },{
                ref: 'scene14',
                speed: 1,
                speed_show_index: 4,
                isVideoPaused: true,
                playbackFlag: true,
                speedFlag: false,
                speedBackFlag: false,
                topNameFlag: false,
                singleFlag: false,
                cover: 'coverArray14'
            },{
                ref: 'scene15',
                speed: 1,
                speed_show_index: 4,
                isVideoPaused: true,
                playbackFlag: true,
                speedFlag: false,
                speedBackFlag: false,
                topNameFlag: false,
                singleFlag: false,
                cover: 'coverArray15'
            },{
                ref: 'scene16',
                speed: 1,
                speed_show_index: 4,
                isVideoPaused: true,
                playbackFlag: true,
                speedFlag: false,
                speedBackFlag: false,
                topNameFlag: false,
                singleFlag: false,
                cover: 'coverArray16'
            },{
                ref: 'scene17',
                speed: 1,
                speed_show_index: 4,
                isVideoPaused: true,
                playbackFlag: true,
                speedFlag: false,
                speedBackFlag: false,
                topNameFlag: false,
                singleFlag: false,
                cover: 'coverArray17'
            },{
                ref: 'scene18',
                speed: 1,
                speed_show_index: 4,
                isVideoPaused: true,
                playbackFlag: true,
                speedFlag: false,
                speedBackFlag: false,
                topNameFlag: false,
                singleFlag: false,
                cover: 'coverArray18'
            }],
            pageNum: 1,//当前页
            pageSize: 1,//总页数
            refList: [],
            isVideoPaused: true,
            playbackFlag: true,
            speedFlag: false,
            speedBackFlag: false,
            speedArray: [{
                name: '1/16',
                index: 0,
                value: -4,
                speed: 1/16
            },{
                name: '1/8',
                index: 1,
                value: -3,
                speed: 1/8
            },{
                name: '1/4',
                index: 2,
                value: -2,
                speed: 1/4
            },{
                name: '1/2',
                index: 3,
                value: -1,
                speed: 1/2
            },{
                name: '1',
                index: 4,
                value: 0,
                speed: 1
            },{
                name: '2',
                index: 5,
                value: 1,
                speed: 2
            },{
                name: '4',
                index: 6,
                value: 2,
                speed: 4
            },{
                name: '8',
                index: 7,
                value: 3,
                speed: 8
            },{
                name: '16',
                index: 8,
                value: 4,
                speed: 16
            }],
            speed_show_index: 4,
            speed: 1,
            scaleArray: [{
                name: '原比例',
                index: 0
            },{
                name: '自适应',
                index: 1
            },{
                name: '4:3',
                index: 2
            },{
                name: '16:9',
                index: 3
            }],
            scale_show_index: 1,
            videoTop: 0,
            videoLeft: 0,
            bgWidth: 484,
            bgHeight: 324,
            coverArray1: [],
            coverArray2: [],
            coverArray3: [],
            coverArray4: [],
            coverArray5: [],
            coverArray6: [],
            coverArray7: [],
            coverArray8: [],
            coverArray9: [],
            coverArray10: [],
            coverArray11: [],
            coverArray12: [],
            coverArray13: [],
            coverArray14: [],
            coverArray15: [],
            coverArray16: [],
            coverArray17: [],
            coverArray18: [],
            xxxArray: [],
            itemRef: "",
            playVideoDebounce: () => {},
            isControllingStatus: false,
            isLocal: false, //是否是本地
            isFireFox: false,
        }
    },
    props: {
        userDataFlag: {
            type: Boolean,
            required: true
        },
        screenWidth: {
            type: Number,
            default: 0,
        }
    },
    computed: {
        volume: {
            get() {
                return this.volumeVal;
            },
            set(val) {
                this.volumeVal = val;
                if (!this.itemRef) {
                    return
                }
                for (let i = 0; i < this.page16List.length; i++) {
                    if (this.page16List[i].ref === this.itemRef) {
                        if (this['player' + (i+1)].getVolume() == 0 && val > 0) {
                            setAudioCtrl(this.page16List[i].channelId, {streamId: this.sessionId, control: 2})
                        } else if (this['player' + (i+1)].getVolume() > 0 && val == 0) {
                            setAudioCtrl(this.page16List[i].channelId, {streamId: this.sessionId, control: 1})
                        }
                        this['player' + (i+1)].changeVolume(val);
                    } else {
                        if (this['player' + (i+1)]) {
                            if (this['player' + (i+1)].getVolume() > 0) {
                                let sessionId = ""
                                this.refList.forEach(item=>{
                                    if (item.itemRef === this.page16List[i]) {
                                        sessionId = item.sessionId
                                    }
                                })
                                if (sessionId) {
                                    setAudioCtrl(this.page16List[i].channelId, {streamId: sessionId, control: 1})
                                }
                            }
                            this['player' + (i+1)].changeVolume(0);
                        }
                    }
                }
            },
        },
    },
    watch: {
        itemRef: {
            handler(newItem,oldItem){
                if (!newItem) {
                    return
                }
                this.arrowFlag = false
                if (this['player' + newItem.substring(5)]) {
                    this.volumeVal = Math.round(this['player' + newItem.substring(5)].getVolume()*100)
                } else {
                    this.volumeVal = 0
                }
            },
            deep: true
        },
        coverArray1: {
            handler(newVal,oldVal){
                this.initCanvas(newVal,'coverArray1')
            },
            deep: true
        },
        coverArray2: {
            handler(newVal,oldVal){
                this.initCanvas(newVal,'coverArray2')
            },
            deep: true
        },
        coverArray3: {
            handler(newVal,oldVal){
                this.initCanvas(newVal,'coverArray3')
            },
            deep: true
        },
        coverArray4: {
            handler(newVal,oldVal){
                this.initCanvas(newVal,'coverArray4')
            },
            deep: true
        },
        coverArray5: {
            handler(newVal,oldVal){
                this.initCanvas(newVal,'coverArray5')
            },
            deep: true
        },
        coverArray6: {
            handler(newVal,oldVal){
                this.initCanvas(newVal,'coverArray6')
            },
            deep: true
        },
        coverArray7: {
            handler(newVal,oldVal){
                this.initCanvas(newVal,'coverArray7')
            },
            deep: true
        },
        coverArray8: {
            handler(newVal,oldVal){
                this.initCanvas(newVal,'coverArray8')
            },
            deep: true
        },
        coverArray9: {
            handler(newVal,oldVal){
                this.initCanvas(newVal,'coverArray9')
            },
            deep: true
        },
        coverArray10: {
            handler(newVal,oldVal){
                this.initCanvas(newVal,'coverArray10')
            },
            deep: true
        },
        coverArray11: {
            handler(newVal,oldVal){
                this.initCanvas(newVal,'coverArray11')
            },
            deep: true
        },
        coverArray12: {
            handler(newVal,oldVal){
                this.initCanvas(newVal,'coverArray12')
            },
            deep: true
        },
        coverArray13: {
            handler(newVal,oldVal){
                this.initCanvas(newVal,'coverArray13')
            },
            deep: true
        },
        coverArray14: {
            handler(newVal,oldVal){
                this.initCanvas(newVal,'coverArray14')
            },
            deep: true
        },
        coverArray15: {
            handler(newVal,oldVal){
                this.initCanvas(newVal,'coverArray15')
            },
            deep: true
        },
        coverArray16: {
            handler(newVal,oldVal){
                this.initCanvas(newVal,'coverArray16')
            },
            deep: true
        },
        coverArray17: {
            handler(newVal,oldVal){
                this.initCanvas(newVal,'coverArray17')
            },
            deep: true
        },
        coverArray18: {
            handler(newVal,oldVal){
                this.initCanvas(newVal,'coverArray18')
            },
            deep: true
        },
    },
    created() {
        this.isFireFox = navigator.userAgent.indexOf("Firefox") > -1 ? true : false
        this.isLocal = JSON.parse(localStorage.getItem('isLocal'))
        getChannelList().then((res) => {
            if (res.data.code === 200000) {
                this.channelAllList = res.data.data
                this.channelList = res.data.data.filter(item => item.status === 1).map(item => {
                    return {
                        ...item,
                        streamEnable: false,
                        // streamListVisible: false,
                        streamType: 0,//0位主码流，1为子码流
                        eyeEnable: false,
                        channelName: item.channelType + item.channel + (!item.chanNameList ? '' : (item.chanNameList.length>0 ? item.chanNameList[0].channelName : '')),
                    }
                }) || []
            }
        });
    },
    mounted() {
        // 初始化 this['player'+(i+1)]
        for (let i = 0; i < 32; i++) {
            this['player'+(i+1)] = null
        }
        let erd = elementResizeDetectorMaker()
        erd.listenTo(document.getElementById("canvas_form"), element => {
            this.$nextTick(() => {
                this.canvasWidth = element.offsetWidth
                this.canvasHeight = element.offsetHeight

                this.videoWidth = this.canvasWidth
                this.videoHeight = this.canvasHeight

                this.contentWidth = this.division_show_index === 1 ? (this.canvasWidth - 1) : this.division_show_index === 4 ? (this.canvasWidth/2 - 2) :
                           this.division_show_index === 9 ? (this.canvasWidth/3 - 2): (this.canvasWidth/4 - 2)
                this.contentHeight = this.division_show_index === 1 ? (this.canvasHeight - 1) : this.division_show_index === 4 ? (this.canvasHeight/2 - 2) :
                            this.division_show_index === 9 ? (this.canvasHeight/3 - 2): (this.canvasHeight/4 - 2)
                for (let i = 1; i < 17; i++) {
                    if (this['player' + i]) {
                        getRecordMaskArea(i.toString()).then(res=>{
                            this.bgWidth = res.data.data.width
                            this.bgHeight = res.data.data.height
                            this['coverArray' + i] = []
                            if (res.data.data.regions) {
                                for (let j = 0; j < res.data.data.regions.length; j++) {
                                    this.maskData(res.data.data.width,res.data.data.height,res.data.data.regions[j])
                                    this['coverArray' + i].push(res.data.data.regions[j])
                                }
                            }
                        })
                    }
                }
                this.changeScale(this.scaleArray.filter(item=>item.index === this.scale_show_index)[0])
            })
        });
        window.onresize= () => {
            return (() => {
                let erd = elementResizeDetectorMaker()
                erd.listenTo(document.getElementById("canvas_form"), element => {
                    this.$nextTick(() => {
                        this.canvasWidth = element.offsetWidth
                        this.canvasHeight = element.offsetHeight

                        this.videoWidth = this.canvasWidth
                        this.videoHeight = this.canvasHeight

                        this.contentWidth = this.division_show_index === 1 ? (this.canvasWidth - 1) : this.division_show_index === 4 ? (this.canvasWidth/2 - 2) :
                           this.division_show_index === 9 ? (this.canvasWidth/3 - 2): (this.canvasWidth/4 - 2)
                        this.contentHeight = this.division_show_index === 1 ? (this.canvasHeight - 1) : this.division_show_index === 4 ? (this.canvasHeight/2 - 2) :
                            this.division_show_index === 9 ? (this.canvasHeight/3 - 2): (this.canvasHeight/4 - 2)

                        for (let i = 1; i < 17; i++) {
                            if (this['player' + i]) {
                                getRecordMaskArea(i.toString()).then(res=>{
                                    this.bgWidth = res.data.data.width
                                    this.bgHeight = res.data.data.height
                                    this['coverArray' + i] = []
                                    if (res.data.data.regions) {
                                        for (let j = 0; j < res.data.data.regions.length; j++) {
                                            this.maskData(res.data.data.width,res.data.data.height,res.data.data.regions[j])
                                            this['coverArray' + i].push(res.data.data.regions[j])
                                        }
                                    }
                                })
                            }
                        }
                        this.changeScale(this.scaleArray.filter(item=>item.index === this.scale_show_index)[0])
                    })
                });
                this.sizeChange()
            })();
        }
        this.playVideoDebounce = this.debounce(this.playVideo, 500, false)
    },
    beforeDestroy(){
        for (let i = 1; i < 17; i++) {
            if (this['player' + i]) {
                this['player' + i].stop();
                this['player' + i].destroy();
                this['player' + i] = null
            }
        }
        if (this.$refs['download']) {
            this.$refs['download'].clean()
        }
    },
    methods: {
        debounce(func, delay = 500, immediate = false) {
            let timer = null
            return function() {
                if(timer) {
                    clearTimeout(timer)
                }
                if(!timer && immediate) {
                    func.apply(this, arguments)
                }
                timer = setTimeout(() => {
                    func.apply(this, arguments)
                }, delay)
            }
        },
        initCanvas(newVal,coverNo){
            const canvas = document.getElementById(coverNo)
            canvas.width = this.division_show_index === 1 ? (this.canvasWidth - 1) : this.division_show_index === 4 ? (this.canvasWidth/2 - 2) :
                           this.division_show_index === 9 ? (this.canvasWidth/3 - 2): (this.canvasWidth/4 - 2)
            canvas.height = this.division_show_index === 1 ? (this.canvasHeight - 1) : this.division_show_index === 4 ? (this.canvasHeight/2 - 2) :
                            this.division_show_index === 9 ? (this.canvasHeight/3 - 2): (this.canvasHeight/4 - 2)
            let ctx = canvas.getContext('2d')
            ctx.clearRect(0,0,canvas.width,canvas.height)
            for (let i = 0; i < newVal.length; i++) {
                ctx.beginPath()
                for (let j = 0; j < newVal[i].length; j++) {
                    if (j === 0) {
                        ctx.moveTo(newVal[i][0].x, newVal[i][0].y)
                    } else {
                        ctx.lineTo(newVal[i][j].x, newVal[i][j].y)
                    }
                }
                // ctx.moveTo(newVal[i][newVal[i].length - 1].x, newVal[i][newVal[i].length - 1].y)
                // ctx.lineTo(newVal[i][0].x, newVal[i][0].y)
                // ctx.stroke()
                ctx.closePath() // 闭合
                ctx.strokeStyle = '#333333'
                ctx.stroke()    // 描边
                ctx.fillStyle = '#333333'
                ctx.fill()      // 填充
            }
        },
        initSessionId(flag) {
            this.sessionId = flag ? null : this.sessionId
            this.volumeVal = 0
            this.arrowFlag = false
            this.itemRef = ""
        },
        setSessionEndTime(sessionId, switchTime, greenList) {
            let refItem = this.refList.find(item => item.sessionId === sessionId)
            if (refItem) {
                if (refItem.endTime != "") {
                    let date1 = switchTime.substring(0,10)
                    let date2 = refItem.endTime.substring(0,10)
                    let time1 = switchTime.substring(11,19)
                    let time2 = refItem.endTime.substring(11,19)
                    if (date1 != date2) {
                        let endTime = ""
                        for (let i = 0; i < greenList.length; i++) {
                            if (greenList[i].end.substring(0,10) == date1) {
                                endTime = greenList[i].end
                            }
                        }
                        refItem.endTime = endTime
                    } else if (date1 == date2 && time1 >= time2) {
                        let endTime = ""
                        for (let i = 0; i < greenList.length; i++) {
                            if (greenList[i].end.substring(0,10) == date1) {
                                endTime = greenList[i].end
                            }
                        }
                        refItem.endTime = endTime
                    }
                }
            }
        },
        initColor() {
            this.itemRef = null
            for (let i = 0; i < this.page16List.length; i++) {
                this.page16List[i].highlight = false
            }
            this.isVideoPaused = true
            this.playbackFlag = true
            this.speed_show_index = 4
            this.speed = 1
            this.$forceUpdate()
        },
        batchInit(batchInitArray, callback) {
            let canvasRefArray = [];
            batchInitArray.map((canvasData, index) => {
                let { channelId, sessionId, leftChannelName, fileType, endTime, greenDateList, startTime } = canvasData
                let itemRef = null;
                if (index === 0) {
                    this.fileType = fileType;
                }
                if (!(itemRef && !this['player' + itemRef.substring(5)])) {
                    let isRefSet = false
                    for (let i = (this.pageNum-1)*this.division_show_index; i < this.pageNum*this.division_show_index; i++){
                        if (!this['player'+ (i+1)] && !canvasRefArray.includes('scene' + (i+1))) {
                            itemRef = 'scene' + (i+1)
                            isRefSet = true
                            break
                        }
                    }
                    if (!isRefSet) {
                        if (this.pageNum < this.pageSize) {
                            for (let i = (this.pageSize-1)*this.division_show_index; i < this.pageSize*this.division_show_index; i++){
                                if (!this['player'+ (i+1)] && !canvasRefArray.includes('scene' + (i+1))) {
                                    itemRef = 'scene' + (i+1)
                                    isRefSet = true
                                    break
                                }
                            }
                        }
                        if (!isRefSet) {
                            this.pageSize += 1
                            this.pageNum = this.pageSize
                            itemRef = 'scene' + ((this.pageSize - 1) * this.division_show_index + 1)   
                        }
                    }
                }
                canvasRefArray.push(itemRef)
                this.page16List.forEach((item,index)=>{
                    if ((itemRef.substring(5) - 1) == index) {
                        this.page16List[index].highlight = true
                        this.page16List[index].leftChannelName = leftChannelName
                        this.page16List[index].channelId = channelId
                        this.speed = this.page16List[index].speed
                        this.speedFlag = this.page16List[index].speedFlag
                        this.speedBackFlag = this.page16List[index].speedBackFlag
                    } else {
                        this.page16List[index].highlight = false
                    }
                    if (this.page16List[index].ref === itemRef) {
                        this.page16List[index].isVideoPaused = false
                    }
                })
                this.refList.push({
                    itemRef: itemRef,
                    sessionId: sessionId,
                    leftChannelName: leftChannelName,
                    channelId: channelId,
                    endTime: endTime,
                    greenDateList: greenDateList,
                    startTime
                })
                this.xxxArray.push({
                    ref: itemRef.substring(5),
                    channelId: channelId.toString(),
                })
                if (channelId) {
                    getRecordMaskArea(channelId.toString()).then(res=>{
                        this.bgWidth = res.data.data.width
                        this.bgHeight = res.data.data.height
                        this['coverArray' + itemRef.substring(5)] = []
                        if (res.data.data.regions) {
                            for (let j = 0; j < res.data.data.regions.length; j++) {
                                this.maskData(res.data.data.width,res.data.data.height,res.data.data.regions[j])
                                this['coverArray' + itemRef.substring(5)].push(res.data.data.regions[j])
                            }
                        }
                    })
                }
            })
            // 根据canvasRefArray 批量创建fgplayer
            let playerCreatedCount = 0;
            canvasRefArray.map(async (canvasRef, canvasRefIndex) => {
                this.refList.forEach(item => {
                    if (item.itemRef === canvasRef) {
                        this.sessionId = item.sessionId
                        this.$emit('refSessionId', item.sessionId, item.leftChannelName)
                    }
                })
                this.controlShow = false;
                this.isLoading = true;
                this.isCaching = false;
                // Chrome,Firefox,Safari等使用wasm, 通过fgplayer引入
                let itemRef = canvasRef
                let isReconnect = false
                let timestamp = 0
                // 根据itemRef绑定canvas，更新时间轴需要sessionId, 根据itemRef挂载player
                let canvasData = batchInitArray[canvasRefIndex];
                let { channelId, sessionId } = canvasData;
                let currentCanvas = this.refList[canvasRefIndex];
                await FGPlayer.create({
                    canvas: this.$refs[canvasRef][0],
                    enableBBox: this.bboxEabled,
                    onSizeChange: (width, height) => {
                        this.sizeChange(width, height);
                    },
                    onDisconnect: () => {
                        this.isLoading = true;
                        isReconnect = true
                        // currentCanvas.isStartPlay = false;
                    },
                    onConnect: () => {
                        this.isLoading = false;
                        console.log('[FGPlayer] onConnect');
                        if (!currentCanvas.isStartPlay) {
                            this.isDisableDrag = true;
                        }    
                        if (isReconnect && timestamp > 0) {
                            let params = {
                                streamId: sessionId,
                                ctrl: this.CONTROL.SEEK_2,
                                playSpeed: this.playSpeed,
                                startTime: moment(timestamp).format("YYYY-MM-DD HH:mm:ss")
                            }
                            ctrlRecordVideo(channelId.toString(), params).then(res => {
                            })
                        }
                    },
                    onCaching: () => {
                        this.isCaching = true;
                    },
                    onCached: () => {
                        this.isCaching = false;
                    },
                    onUserData: (data) => {
                        if (this.isDisableDrag) {
                            this.isDisableDrag = false;
                        }
                        if (data.eof) {
                            let refItem = this.refList.find(item => item.sessionId === sessionId)
                            if (refItem) {
                                if (this['player' + itemRef.substring(5)]) {
                                    this['player' + itemRef.substring(5)].stop();
                                }
                                if (itemRef === this.itemRef) {
                                    this.isVideoPaused = true
                                }
                            }
                        } else if (!data.eof && this.userDataFlag) {
                            // 根据sessionId找到refList中的ref，如果已经视频全部结束就销毁player，置空channelName
                            let refItem = this.refList.find(item => item.sessionId === sessionId)
                            if (refItem && refItem.endTime != "") {
                                if (data.timestamp >= new Date(refItem.endTime).getTime()) {
                                    return
                                }
                            }
                            // 触发时间轴绘制
                            let isLocal = JSON.parse(localStorage.getItem('isLocal'))
                            timestamp = !isLocal ? data.timestamp : moment(moment(data.timestamp).add(8, 'hour'), 'YYYY-MM-DD HH:mm:ss').valueOf()
                            if (this.sessionId === sessionId) {
                                // 发了请求还没等到请求回来，流已经推过来了，不能让它更新timestamp
                                if (this.isControllingStatus) {
                                    return;  
                                }
                                this.timestamp = timestamp
                                this.$emit('refTimestamp', timestamp)
                            }
                            // console.log(`[${currentCanvas.leftChannelName}] [FGPlayer]:onUserData::${moment(timestamp).format('YYYY-MM-DD HH:mm:ss')}`);
                            if (!currentCanvas.isStartPlay) {
                                currentCanvas.isStartPlay = true;
                                console.log(`[${currentCanvas.leftChannelName}] 首次播放`);

                                // 所有player都接上了数据之后全部调整起始时间
                                if (this.refList.filter(c => c.isStartPlay).length === this.refList.length) {
                                    this.refList.map(c => {
                                        let currentChannelId = c.channelId.toString();
                                        this.resetControlVideoTimer({
                                            channelId: currentChannelId,
                                            switchTime: moment(this.$parent.timestampInit.start_timestamp).format('YYYY-MM-DD HH:mm:ss'),
                                            manual: false
                                        })
                                    })
                                }
                            }
                        }
                    }
                })
                    .then(player => {
                        player.genOSD(
                            0,
                            [
                                "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
                                "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "对齐"
                            ],
                            "96px monospace",
                            undefined,
                            "#00ff00"
                        );

                        player.genOSD(
                            1,
                            ["当前人数：  "],
                            "96px monospace",
                            undefined,
                            "red"
                        );

                        player.genOSD(
                            3,
                            ['其他终端正在预览, 需等待对方关闭后再试'],
                            "96px monospace",
                            undefined,
                            "red"
                        );
                        // this.player = player; // 将player挂到vue全局上
                        this['player' + canvasRef.substring(5)] = player
                        const token = JSON.parse(localStorage.getItem('user')).token
                        player.play(
                            `ws://${HOST}/api/nvr/record/channel/${channelId}/${sessionId}?Authorization=${token}`,
                            this.playParams
                        );
                        // this.itemRef = null
                        this.$forceUpdate()
                        playerCreatedCount++;
                        if (playerCreatedCount === canvasRefArray.length) {
                            // 如果所有player挂载好了就触发回调，调整时间轴到起始点
                            callback && callback()
                            // 选中一个canvas临时解决时间轴不走动问题
                            let canvas = [...this.page16List].find(c => this.refList.map(r => r.itemRef).includes(c.ref))
                            this.clickCanvas(canvas);
                        }
                        // 创建完player给每个canvasRef添加timer，用来控制下一次自动暂停
                        currentCanvas.shouldControlIndex = currentCanvas.greenDateList.findIndex(date => 
                            moment(date.start).format('YYYY-MM-DD') === moment(currentCanvas.startTime).format('YYYY-MM-DD')
                        );
                        let delay = Date.parse(currentCanvas.greenDateList[currentCanvas.shouldControlIndex].end) - currentCanvas.startTime;
                        currentCanvas.isStartPlay = false;
                        currentCanvas.timer = timer({
                            name: currentCanvas.leftChannelName,
                            callback: async (manual) => {
                                let _canvas = this.page16List.find(c => c.channelId === currentCanvas.channelId)
                                console.log(`[${currentCanvas.leftChannelName}] [timer]::callback ${_canvas.isVideoPaused ? 'play': 'pause'}`);
                                
                                let params = {
                                    streamId: currentCanvas.sessionId,
                                    ctrl: _canvas.isVideoPaused ?
                                        this.CONTROL.PLAY_0 : this.CONTROL.PAUSE_1,
                                    playSpeed: this.playSpeed,
                                    startTime: moment(currentCanvas.startTime).format('YYYY-MM-DD HH:mm:ss')
                                }
                                this.isControllingStatus = true;
                                let res = await ctrlRecordVideo(currentCanvas.channelId, params);
                                this.isControllingStatus = false;
                                if (res.data.code !== 200000) {
                                    return
                                }
                                console.log('ctrlRecordVideo 请求回来了');
                                _canvas.isVideoPaused = !_canvas.isVideoPaused
                                if (this.channelId === currentCanvas.channelId) {
                                    this.updatePlayerButtonState()
                                }
                                // let delay = currentCanvas.timer.getRemainingTime();

                                if (manual === true) {
                                    console.log('拖动到了与上个状态相反区间，对正在视频的实施操作',);
                                    return
                                }

                                if (_canvas.isVideoPaused && this.timestamp) {
                                    // 自动播放结束应该暂停了，就重新设定下一个控制点
                                    // 等暂停时间过去了再重新设定
                                    let delay = 0;
                                    let dateArray = [...currentCanvas.greenDateList];
                                    let switchTime = new Date(this.timestamp);
                                    if (currentCanvas.shouldControlIndex >= 0 && dateArray[currentCanvas.shouldControlIndex + 1]) {
                                        delay = Date.parse(dateArray[currentCanvas.shouldControlIndex + 1].start) - Date.parse(switchTime);
                                        if (delay == 0) {
                                            // 发了请求还没等到请求回来执行停下，但流已经推过来了
                                            delay = Date.parse(dateArray[currentCanvas.shouldControlIndex + 1].start) - Date.parse(dateArray[currentCanvas.shouldControlIndex].end); 
                                        }
                                        currentCanvas.timer.reset({ delay: Math.ceil(delay / this.speedArray[this.speed_show_index].speed), speed: this.speedArray[this.speed_show_index].speed });
                                        !this.isLoading && currentCanvas.timer.start();
                                    }
                                    return
                                }
                                if (!_canvas.isVideoPaused && this.timestamp) {
                                    // 应该自动播放了，就重新设定下一个控制点
                                    // setTimeout的原因。待优化，请求回来了，但是不一定帧已经推过来
                                    setTimeout(async () => {
                                        console.log('应该自动播放了，就重新设定下一个控制点', moment(this.timestamp).format('YYYY-MM-DD HH:mm:ss'));
                                        let delay = 0;
                                        let dateArray = [...currentCanvas.greenDateList];
                                        let switchTime = new Date(this.$parent.$refs['time_line'].timestamp);
                                        currentCanvas.shouldControlIndex = currentCanvas.shouldControlIndex>=0? currentCanvas.shouldControlIndex+1:dateArray.findIndex((date, index) => Date.parse(switchTime) >= Date.parse(date.start) && Date.parse(switchTime) <= Date.parse(date.end))
                                        if (currentCanvas.shouldControlIndex >= 0) {
                                            delay = Date.parse(dateArray[currentCanvas.shouldControlIndex].end) - Date.parse(dateArray[currentCanvas.shouldControlIndex].start);
                                            if (delay <= 0) {
                                                // 发了请求还没等到请求回来执行停下，但流已经推过来了
                                                delay = Date.parse(dateArray[currentCanvas.shouldControlIndex].end) - Date.parse(dateArray[currentCanvas.shouldControlIndex].start); 
                                            }
                                            // 如果视频暂停中，恢复播放
                                            currentCanvas.timer.reset({ delay: Math.ceil(delay / this.speedArray[this.speed_show_index].speed), speed: this.speedArray[this.speed_show_index].speed });
                                            !this.isLoading && currentCanvas.timer.start();
                                            if (_canvas.isVideoPaused && currentCanvas.shouldControlIndex) {
                                                await currentCanvas.timer.callback();
                                            }
                                        } else {
                                            currentCanvas.shouldControlIndex = dateArray.findIndex((date, index) => dateArray[index-1] && Date.parse(switchTime) >= Date.parse(dateArray[index-1].start) && Date.parse(switchTime) <= Date.parse(dateArray[index].end))
                                            delay = Date.parse(dateArray[currentCanvas.shouldControlIndex].start) - Date.parse(switchTime);
                                        }
                                        currentCanvas.timer.reset({ delay: Math.ceil(delay / this.speedArray[this.speed_show_index].speed), speed: this.speedArray[this.speed_show_index].speed });
                                        !this.isLoading && currentCanvas.timer.start();
                                    }, 500);

                                }
                                
                            }
                        }, delay)
                    })
                    .catch(e => {
                        console.log(e);
                    })

                    if (canvasRefIndex === canvasRefArray.length - 1) {
                        this.$emit('refSwitchTime', moment(this.$parent.timestampInit.start_timestamp).format('YYYY-MM-DD HH:mm:ss'))
                    }
            })
        },
        init({channelId,sessionId,leftChannelName,fileType,endTime, greenDateList}) {
            this.fileType = fileType
            let sum = 0
            for (let i = 1; i < 17; i++) {
                if (this['player' + i]) {
                    sum += 1
                }
            }
            console.log('sum:',sum);
            if (sum > 15) {
                this.$message.warning('最多开启16路视频')
                return
            } else {
                if (this.$store.getters.getSyncPlayMode) {
                    this.batchInit();
                    return
                }
                this.channelId = channelId
                this.leftChannelName = leftChannelName
                if (!(this.itemRef && !this['player' + this.itemRef.substring(5)])) {
                    let flag = 0
                    for (let i = (this.pageNum-1)*this.division_show_index; i < this.pageNum*this.division_show_index; i++){
                        if (!this['player'+ (i+1)]) {
                            this.itemRef = 'scene' + (i+1)
                            flag = 1
                            break
                        }
                    }
                    if (flag === 0) {
                        if (this.pageNum < this.pageSize) {
                            for (let i = (this.pageSize-1)*this.division_show_index; i < this.pageSize*this.division_show_index; i++){
                                if (!this['player'+ (i+1)]) {
                                    this.itemRef = 'scene' + (i+1)
                                    flag = 1
                                    break
                                }
                            }
                        }
                        if (flag === 0) {
                            this.pageSize += 1
                            this.pageNum = this.pageSize
                            this.itemRef = 'scene' + ((this.pageSize - 1) * this.division_show_index + 1)   
                        }
                    }
                }
                this.page16List.forEach((item,index)=>{
                    if ((this.itemRef.substring(5) - 1) == index) {
                        this.page16List[index].highlight = true
                        this.page16List[index].leftChannelName = leftChannelName
                        this.page16List[index].channelId = channelId
                        this.speed = this.page16List[index].speed
                        this.speedFlag = this.page16List[index].speedFlag
                        this.speedBackFlag = this.page16List[index].speedBackFlag
                    } else {
                        this.page16List[index].highlight = false
                        this['player' + (index+1)]?.changeVolume(0)
                    }
                    if (this.page16List[index].ref === this.itemRef) {
                        this.page16List[index].isVideoPaused = !this.page16List[index].isVideoPaused
                        this.isVideoPaused = this.page16List[index].isVideoPaused
                    }
                })
                this.refList.push({
                    itemRef: this.itemRef,
                    sessionId: sessionId,
                    leftChannelName: leftChannelName,
                    channelId: channelId,
                    endTime: endTime,
                    greenDateList: greenDateList
                })
                this.xxxArray.push({
                    ref: this.itemRef.substring(5),
                    channelId:channelId.toString(),
                })
                if (channelId) {
                    getRecordMaskArea(channelId.toString()).then(res=>{
                        this.bgWidth = res.data.data.width
                        this.bgHeight = res.data.data.height
                        this['coverArray' + this.itemRef.substring(5)] = []
                        if (res.data.data.regions) {
                            for (let j = 0; j < res.data.data.regions.length; j++) {
                                this.maskData(res.data.data.width,res.data.data.height,res.data.data.regions[j])
                                this['coverArray' + this.itemRef.substring(5)].push(res.data.data.regions[j])
                            }
                        }
                    })
                }
                this.importPlayer(channelId,sessionId)
                // 回放
                // this.playUrl(channelId,sessionId);
            }
        },
        importPlayer(channelId,sessionId) {
            let isImportFgplayer;
            const srcList = document.querySelectorAll("script");
            srcList.forEach(item => {
                if (item.id === "fgplayer") {
                    isImportFgplayer = true;
                }
            });
            if (isImportFgplayer) {
                // 若已加载fgplayer.js, 则不再重复引入
                this.playUrl(channelId,sessionId);
            } else {
                const scr = document.createElement("script");
                scr.setAttribute("id", "fgplayer");
                scr.type = "text/javascript";
                scr.src = "/static/fgplayer.min.js"; // 除static目录下的文件不会被webpack编译
                scr.onload = () => this.playUrl(channelId,sessionId);
                document.body.appendChild(scr);
            }
        },
        onAsyncPlayMode() {
            if (this.$store.getters.getSyncPlayMode) {
                this.closeVideo();
                this.$store.commit("changeSyncPlayMode", false);
            }    
        },
        onSyncPlayMode() {
            if (this.$store.getters.getSyncPlayMode) { 
                return
            }
            this.clickDivision(this.divisionArray.find(e => e.index === 4))
            this.$store.commit("changeSyncPlayMode", true);
            this.closeVideo();
        },
        changeTopName(index) {
            this.page16List[index].topNameFlag = !this.page16List[index].topNameFlag
        },
        leftClick() {
            if(this.pageNum>1) {
                this.pageNum -= 1
                // 翻页时更新通道信息
                if (this.division_show_index === 1) {
                    this.clickCanvas(this.page16List[Number(this.itemRef.substring(5))-2])
                }
                this.sizeChange()
            }
        },
        rightClick(){
            if(this.pageNum<this.pageSize) {
                this.pageNum += 1
                // 翻页时更新通道信息
                if (this.division_show_index === 1) {
                    this.clickCanvas(this.page16List[Number(this.itemRef.substring(5))])
                }
                this.sizeChange()
            }
        },
        haveRecordPlaying() {
            let flg = false
            this.refList.forEach(item=>{
                if (this['player' + item.itemRef.substring(5)]) {
                    console.log("有视频正在播放，不切换时间线")
                    flg = true
                    return
                }
            })
            return flg
        },
        // 切换比例
        changeScale(item) {
            this.scale_show_index = item.index
            this.contentWidth = this.division_show_index === 1 ? (this.canvasWidth - 1) : this.division_show_index === 4 ? (this.canvasWidth/2 - 2) :
                           this.division_show_index === 9 ? (this.canvasWidth/3 - 2): (this.canvasWidth/4 - 2)
            this.contentHeight = this.division_show_index === 1 ? (this.canvasHeight - 1) : this.division_show_index === 4 ? (this.canvasHeight/2 - 2) :
                           this.division_show_index === 9 ? (this.canvasHeight/3 - 2): (this.canvasHeight/4 - 2)
            for (let i = 1; i < 17; i++) {
                if (this['player' + i]) {
                    let aaa = this.xxxArray.filter(item=>item.ref === i.toString())
                    getRecordMaskArea(aaa[0].channelId).then(res=>{
                        this.bgWidth = res.data.data.width
                        this.bgHeight = res.data.data.height
                        this['coverArray' + i] = []
                        if (res.data.data.regions) {
                            for (let j = 0; j < res.data.data.regions.length; j++) {
                                this.maskData(res.data.data.width,res.data.data.height,res.data.data.regions[j])
                                this['coverArray' + i].push(res.data.data.regions[j])
                            }   
                        }
                    })
                }
            }
            if (item.index === 0) {
                // 原比例 1920*1080
                if (1920/1080 >= this.canvasWidth/this.canvasHeight) {
                    this.videoWidth = this.canvasWidth
                    this.videoHeight = 1080*this.canvasWidth/1920
                    this.videoTop = (this.canvasHeight - 1080*this.canvasWidth/1920)/(this.division_show_index === 1 ? 2 : this.division_show_index === 4 ? 4 : this.division_show_index === 9 ? 6 : 8) + 'px'
                    this.videoLeft = 0
                } else {
                    this.videoHeight = this.canvasHeight
                    this.videoWidth = 1920*this.canvasHeight/1080
                    this.videoTop = 0
                    this.videoLeft = (this.canvasWidth - 1920*this.canvasHeight/1080)/(this.division_show_index === 1 ? 2 : this.division_show_index === 4 ? 4 : this.division_show_index === 9 ? 6 : 8) + 'px'
                }
            } else if (item.index === 1) {
                // 自适应
                this.videoWidth = this.canvasWidth
                this.videoHeight = this.canvasHeight
                this.videoTop = 0
                this.videoLeft = 0
            } else if (item.index === 2) {
                // 4*3
                if (4/3 >= this.canvasWidth/this.canvasHeight) {
                    this.videoWidth = this.canvasWidth
                    this.videoHeight = 3*this.canvasWidth/4
                    this.videoTop = (this.canvasHeight - 3*this.canvasWidth/4)/(this.division_show_index === 1 ? 2 : this.division_show_index === 4 ? 4 : this.division_show_index === 9 ? 6 : 8) + 'px'
                    this.videoLeft = 0
                } else {
                    this.videoHeight = this.canvasHeight
                    this.videoWidth = 4*this.canvasHeight/3
                    this.videoTop = 0
                    this.videoLeft = (this.canvasWidth - 4*this.canvasHeight/3)/(this.division_show_index === 1 ? 2 : this.division_show_index === 4 ? 4 : this.division_show_index === 9 ? 6 : 8) + 'px'
                }
            } else {
                // 16*9
                if (16/9 >= this.canvasWidth/this.canvasHeight) {
                    this.videoWidth = this.canvasWidth
                    this.videoHeight = 9*this.canvasWidth/16
                    this.videoTop = (this.canvasHeight - 9*this.canvasWidth/16)/(this.division_show_index === 1 ? 2 : this.division_show_index === 4 ? 4 : this.division_show_index === 9 ? 6 : 8) + 'px'
                    this.videoLeft = 0
                } else {
                    this.videoHeight = this.canvasHeight
                    this.videoWidth = 16*this.canvasHeight/9
                    this.videoTop = 0
                    this.videoLeft = (this.canvasWidth - 16*this.canvasHeight/9)/(this.division_show_index === 1 ? 2 : this.division_show_index === 4 ? 4 : this.division_show_index === 9 ? 6 : 8) + 'px'
                }
            }
            this.sizeChange()
            this.$forceUpdate()
        },
        clickDivision(item) {
            this.division_show_index = item.index
            let sum = 0
            for (let i = 16; i >= 1; i--){
                if (this['player'+i]) {
                    sum = i
                    break
                }
            }
            if (sum === 0) {
                this.pageSize = 1
            } else {
                this.pageSize = (sum % this.division_show_index > 0) ? Math.trunc(sum / this.division_show_index + 1) : Math.trunc(sum / this.division_show_index)
            }
            console.log('======',item,this.itemRef);
            if (item.index === 1 && item.name && this.itemRef) {
                this.pageNum = Number(this.itemRef.substring(5))
                if (this.pageNum > this.pageSize) {
                    this.pageSize = this.pageNum
                }
            } else {
                this.pageNum = 1
            }
            this.changeScale(this.scaleArray.filter(item=>item.index === this.scale_show_index)[0])
            // this.sizeChange()
            // this.$forceUpdate()
        },
        clickCanvas(item) {
            this.channelId = item.channelId
            if (item.ref === 'scene17' || item.ref === 'scene18') {
                this.$message.warning('本页不能点击最后两个')
                return
            }
            this.itemRef = item.ref
            if (!this['player' + this.itemRef.substring(5)]) {
                console.log('clickCanvas item', item);
                this.$parent.clearTimeBar()
                this.sessionId = null
            } else {
                this.$parent.draggableTrue()
            }
            this.sessionId = this.refList.some(it=>it.itemRef === this.itemRef) ? this.refList.filter(it=>it.itemRef === this.itemRef)[0].sessionId : this.sessionId
            for (let i = 0; i < this.page16List.length; i++) {
                if (this.page16List[i].ref === item.ref) {
                    this.page16List[i].highlight = true
                    this.isVideoPaused = this.page16List[i].isVideoPaused
                    this.playbackFlag = this.page16List[i].playbackFlag
                    this.speed = this.page16List[i].speed
                    this.speed_show_index = this.page16List[i].speed_show_index
                    this.speedFlag = this.page16List[i].speedFlag
                    this.speedBackFlag = this.page16List[i].speedBackFlag
                    console.log('clickCanvas++++++++++++++++++this.isVideoPaused',this.isVideoPaused,'this.playbackFlag',this.playbackFlag);
                    this.$forceUpdate()
                } else {
                    this.page16List[i].highlight = false
                    this['player' + (i+1)]?.changeVolume(0)
                }
            }
            if (this.refList.some(item=>item.itemRef === this.itemRef) && this['player' + this.itemRef.substring(5)]) {
                this.$emit('refSessionId',this.sessionId,item.leftChannelName)
            } else {
                this.$emit('refSessionId',this.sessionId)
            }
            this.$emit('refChannelId', item.channelId)
            this.$emit('refUpdateTimeline',item.channelId) 
            this.$forceUpdate()
        },
        dbClickCanvas(item) {
            if (this.page16List[Number(this.itemRef.substring(5))-1].singleFlag && this.isFireFox) {
                this.singleClick()
            }
            if (this.division_show_index == 1) {
                this.clickDivision({index: this.division_prev_index,name: this.division_prev_index + "页面"})
                this.pageNum = this.division_prev_pagenum
            } else {
                this.division_prev_index = this.division_show_index
                this.division_prev_pagenum = this.pageNum
                this.clickDivision({index: 1,name: "单页面"})
                this.pageNum = Number(item.ref.substring(5))
            }
            this.sizeChange()
        },
        // 播放视频
        playUrl(channelId, sessionId) {
            this.refList.forEach(item=>{
                if (item.itemRef === this.itemRef) {
                    this.sessionId = item.sessionId
                    this.$emit('refSessionId',this.sessionId,item.leftChannelName)
                }
            })
            this.controlShow = false;
            this.isLoading = true;
            this.isCaching = false;
            // Chrome,Firefox,Safiri等使用wasm, 通过fgplayer引入
            let itemRef = this.itemRef
            let isReconnect = false
            let timestamp = 0

            console.log('在根据哪个canvas创建fgplayer', this.itemRef, this.$refs[this.itemRef][0]);
            // 根据itemRef绑定canvas，更新时间轴需要sessionId, 根据itemRef挂载player
            FGPlayer.create({
                    canvas: this.$refs[this.itemRef][0],
                    enableBBox: this.bboxEabled,
                    onSizeChange: (width, height) => {
                        this.sizeChange(width, height);
                    },
                    onDisconnect: () => {
                        this.isLoading = true;
                        isReconnect = true
                    },
                    onConnect: () => {
                        this.isLoading = false;
                        if (isReconnect && timestamp > 0) {
                            let params = {
                                streamId: sessionId,
                                ctrl: this.CONTROL.SEEK_2,
                                playSpeed: 0,
                                startTime: moment(timestamp).format("YYYY-MM-DD HH:mm:ss")
                            }
                            ctrlRecordVideo(channelId.toString(),params).then(res=> {
                            })
                        }
                    },
                    onCaching: () => {
                        this.isCaching = true;
                    },
                    onCached: () => {
                        this.isCaching = false;
                    },
                    onUserData: (data) => {
                        console.log('data.eof',data.eof || 'false',data);
                        if (data.eof) {
                            let refItem = this.refList.find(item => item.sessionId === sessionId)
                            if (refItem) {
                                if (this['player' + itemRef.substring(5)]) {
                                    this['player' + itemRef.substring(5)].stop();
                                }
                                this.page16List[Number(itemRef.substring(5))-1].isVideoPaused = true
                                if (itemRef === this.itemRef) {
                                    console.log('进来了0000000');
                                    this.isVideoPaused = true
                                }
                            }
                        } else if (!data.eof && this.userDataFlag) {
                            // 根据sessionId找到refList中的ref，如果已经视频全部结束就销毁player，置空channelName
                            let refItem = this.refList.find(item => item.sessionId === sessionId)
                            if (refItem && refItem.endTime != "") {
                                if (data.timestamp >= new Date(refItem.endTime).getTime()) {
                                    return
                                }
                            }

                            // 触发时间轴绘制
                            let isLocal = JSON.parse(localStorage.getItem('isLocal'))
                            if (this.sessionId === sessionId) {
                                this.timestamp = !isLocal ? data.timestamp : moment(moment(data.timestamp).add(8,'hour'),'YYYY-MM-DD HH:mm:ss').valueOf()
                                this.$emit('refTimestamp',!isLocal ? data.timestamp : moment(moment(data.timestamp).add(8,'hour'),'YYYY-MM-DD HH:mm:ss').valueOf())
                            }
                            timestamp = !isLocal ? data.timestamp : moment(moment(data.timestamp).add(8, 'hour'), 'YYYY-MM-DD HH:mm:ss').valueOf()
                        }
                    }
                })
                .then(player => {
                    player.genOSD(
                        0,
                        [
                            "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
                            "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "对齐"
                        ],
                        "96px monospace",
                        undefined,
                        "#00ff00"
                        );

                        player.genOSD(
                        1,
                        ["当前人数：  "],
                        "96px monospace",
                        undefined,
                        "red"
                    );

                    player.genOSD(
                        3,
                        ['其他终端正在预览, 需等待对方关闭后再试'],
                        "96px monospace",
                        undefined,
                        "red"
                    );
                    // this.player = player; // 将player挂到vue全局上
                    this['player' + this.itemRef.substring(5)] = player
                    const token = JSON.parse(localStorage.getItem('user')).token
                    player.play(
                        `ws://${HOST}/api/nvr/record/channel/${channelId}/${sessionId}?Authorization=${token}`,
                        this.playParams
                    );
                    // this.itemRef = null
                    this.$forceUpdate()
                })
                .catch(e => {
                    console.log(e);
                });
        },
        sizeChange(w, h) {
            let rowNum = this.division_show_index === 1 ? 1 : this.division_show_index === 4 ? 2 : this.division_show_index === 9 ? 3 : 4
            // let sWidth = this.canvasWidth / rowNum
            // let sHeight =  this.canvasHeight / rowNum
            let sWidth = this.videoWidth / rowNum
            let sHeight =  this.videoHeight / rowNum
            for (let i = 0; i < this.division_show_index; i++) {
                this.$refs['scene'+((i+(this.pageNum-1)*this.division_show_index)+1)][0].width = sWidth - 2
                this.$refs['scene'+((i+(this.pageNum-1)*this.division_show_index)+1)][0].height = sHeight - 2
                this.$refs['scene'+((i+(this.pageNum-1)*this.division_show_index)+1)][0].left = (i % rowNum * sWidth + 1) + 'px'
                this.$refs['scene'+((i+(this.pageNum-1)*this.division_show_index)+1)][0].top = (i / rowNum * sHeight + 1) + 'px'
            }
        },
        // 处理遮盖数据
        maskData(bgWidth,bgHeight,maskRegions) {
            // bgWidth:背景图宽度, bgHeight:背景图高度, maskRegions:遮盖区域, this.contentWidth:此时canvas的宽度, this.contentHeight:此时canvas的高度
            let ratioX = bgWidth/this.contentWidth
            let ratioY = bgHeight/this.contentHeight
            // maskRegions.forEach(item=>{
            //     item.x = item.x/ratioX,
            //     item.y = item.y/ratioY
            // })
            if (this.scale_show_index === 1) {
                maskRegions.forEach(item=>{
                    item.x = item.x/ratioX,
                    item.y = item.y/ratioY
                })
            } else if (this.scale_show_index === 0 || this.scale_show_index === 3) {
                if (16/9 >= this.canvasWidth/this.canvasHeight) {
                    maskRegions.forEach(item=>{
                        item.x = item.x/ratioX,
                        item.y = item.y/ratioY * this.contentWidth*9/16/this.contentHeight + ((this.division_show_index === 1 ? (this.canvasHeight - 1) : this.division_show_index === 4 ? (this.canvasHeight/2 - 2) :
                           this.division_show_index === 9 ? (this.canvasHeight/3 - 2): (this.canvasHeight/4 - 2))-(this.division_show_index === 1 ? (this.canvasWidth - 1) : this.division_show_index === 4 ? (this.canvasWidth/2 - 2) :
                           this.division_show_index === 9 ? (this.canvasWidth/3 - 2): (this.canvasWidth/4 - 2))*9/16)/2
                    })
                } else {
                    maskRegions.forEach(item=>{
                        item.x = item.x/ratioX * this.contentHeight*16/9/this.contentWidth + ((this.division_show_index === 1 ? (this.canvasWidth - 1) : this.division_show_index === 4 ? (this.canvasWidth/2 - 2) :
                           this.division_show_index === 9 ? (this.canvasWidth/3 - 2): (this.canvasWidth/4 - 2))-(this.division_show_index === 1 ? (this.canvasHeight - 1) : this.division_show_index === 4 ? (this.canvasHeight/2 - 2) :
                            this.division_show_index === 9 ? (this.canvasHeight/3 - 2): (this.canvasHeight/4 - 2))*16/9)/2,
                        item.y = item.y/ratioY
                    })
                }
            } else if (this.scale_show_index === 2) {
                if (4/3 >= this.canvasWidth/this.canvasHeight) {
                    maskRegions.forEach(item=>{
                        item.x = item.x/ratioX,
                        item.y = item.y/ratioY * this.contentWidth*3/4/this.contentHeight + ((this.division_show_index === 1 ? (this.canvasHeight - 1) : this.division_show_index === 4 ? (this.canvasHeight/2 - 2) :
                            this.division_show_index === 9 ? (this.canvasHeight/3 - 2): (this.canvasHeight/4 - 2))-(this.division_show_index === 1 ? (this.canvasWidth - 1) : this.division_show_index === 4 ? (this.canvasWidth/2 - 2) :
                            this.division_show_index === 9 ? (this.canvasWidth/3 - 2): (this.canvasWidth/4 - 2))*3/4)/2
                    })
                } else {
                    maskRegions.forEach(item=>{
                        item.x = item.x/ratioX * this.contentHeight*4/3/this.contentWidth + ((this.division_show_index === 1 ? (this.canvasWidth - 1) : this.division_show_index === 4 ? (this.canvasWidth/2 - 2) :
                           this.division_show_index === 9 ? (this.canvasWidth/3 - 2): (this.canvasWidth/4 - 2))-(this.division_show_index === 1 ? (this.canvasHeight - 1) : this.division_show_index === 4 ? (this.canvasHeight/2 - 2) :
                            this.division_show_index === 9 ? (this.canvasHeight/3 - 2): (this.canvasHeight/4 - 2))*4/3)/2,
                        item.y = item.y/ratioY
                    })
                }
            }
        },
        /**
         * 倒放
         */
        backPlay() {
            if (!this.itemRef) {
                this.$message.warning('请先选择正放视频！')
                return
            }
            if (!this['player' + this.itemRef.substring(5)]) {
                this.$message.warning('此处没有视频！')
                return
            }
            // if (this.isVideoPaused) {
            //     this.$message.warning('请先正放视频！')
            //     return
            // }
            this.refList.forEach(item=>{
                if (item.itemRef === this.itemRef) {
                    this.sessionId = item.sessionId
                }
            })
            let params = {
                streamId: this.sessionId,
                ctrl: this.CONTROL.BACK_5,
                playMode: 1,
                startTime: moment(this.timestamp).format("YYYY-MM-DD HH:mm:ss"),
                playSpeed: this.playbackFlag ? 0 : (this.speedArray[this.speed_show_index].value)
            }
            let params2 = {
                streamId: this.sessionId,
                ctrl: this.CONTROL.PAUSE_1,
                playSpeed: 0
            }
            ctrlRecordVideo(this.channelId,this.playbackFlag ? params : params2).then(res=> {
                if (res.data.code === 200000) {
                    this.$message.success(this.playbackFlag ? '开启倒放！' : '关闭倒放！')
                    this.back = true
                    this.$emit('refBackRun',true)
                    this.page16List.forEach((item,index)=>{
                        if (item.ref === this.itemRef) {
                            if(!this.isVideoPaused) {
                                this.speed_show_index = item.speed_show_index = 4
                                this.speed = this.page16List[index].speed = 1
                            }
                            this.page16List[index].playbackFlag = !this.page16List[index].playbackFlag
                            this.playbackFlag = !this.playbackFlag
                            this.isVideoPaused = true;
                            this.page16List[index].isVideoPaused = true
                            // 倒放关闭声音
                            this.volumeVal = 0
                            this['player' + (index+1)].changeVolume(0);
                        }
                    })
                }
            })
        },
        // 暂停or重新开启视频
        playVideo() {
            // 点击播放或暂停需要可以拖动timeLine
            this.$parent.draggableTrue()
            if (this.itemRef && this['player' + this.itemRef.substring(5)]) {
                if (this.$store.getters.getSyncPlayMode) {
                    let selectedCanvasPaused = this.page16List.find(item => item.ref === this.itemRef).isVideoPaused;
                    let requests = [];
                    this.refList.forEach(item => {
                        // 如果有自动暂停的视频，并且当前选中canvas暂停了，那就批量播放
                        // 如果有自动暂停的视频，并且当前选中canvas播放中，那就批量暂停到此时
                        // 如果没有自动暂停的视频，根据当前选中canvas的状态，批量切换相反播放状态
                        let params = {
                            streamId: item.sessionId,
                            ctrl: selectedCanvasPaused ? this.CONTROL.PLAY_0 : this.CONTROL.PAUSE_1,
                            playSpeed: 0,
                            playMode: 0,
                            startTime: moment(this.timestamp).format("YYYY-MM-DD HH:mm:ss")
                        }
                        requests.push(ctrlRecordVideo(item.channelId, params))
                    })
                    axios.all(requests).then(axios.spread((...responses) => { 
                        responses.map((res, resIndex) => {
                            if (res.data.code === 200000) {
                                // 批量暂停、批量播放的提示
                                if (resIndex + 1 === responses.length) {
                                    this.$message.success(selectedCanvasPaused ? '开启成功' : '暂停成功')
                                }
                                this.back = false
                                this.$emit('refBackRun', false)
                                this.page16List.forEach((item, index) => {
                                    if (item.ref === this.refList[resIndex].itemRef) {
                                        if (!this.playbackFlag) {
                                            this.speed_show_index = 4
                                            this.speed = this.page16List[index].speed = 1
                                        }
                                        this.page16List[index].isVideoPaused = !selectedCanvasPaused
                                        this.playbackFlag = true;
                                        this.page16List[index].playbackFlag = true;
                                    }
                                })
                                // 停止当前canvas的timer
                                let currentCanvas = this.refList[resIndex];
                                if (selectedCanvasPaused ) {
                                    currentCanvas?.timer && currentCanvas.timer.continue();
                                } else {
                                    currentCanvas?.timer && currentCanvas.timer.pause();
                                }
                            }
                        })
                    })).finally(() => {
                        this.$emit('refDisableSearchButton', selectedCanvasPaused)
                        this.isVideoPaused = !selectedCanvasPaused;
                    })
                    return
                }
                this.refList.forEach(item=>{
                    if (item.itemRef === this.itemRef) {
                        this.sessionId = item.sessionId
                    }
                })
                if (this.back) {
                    this.page16List.forEach((item,index)=>{
                        if (item.ref === this.itemRef) {
                            if(this.back) {
                                this.speed_show_index = item.speed_show_index = 4
                                this.speed = this.page16List[index].speed = 1
                            }
                        }
                    })   
                }
                let params = {
                    streamId: this.sessionId,
                    ctrl: this.back ? this.CONTROL.BACK_5 : !this.isVideoPaused ? this.CONTROL.PAUSE_1 : this.CONTROL.PLAY_0,
                    playSpeed: 0,
                    playMode: 0,
                    startTime: moment(this.timestamp).format("YYYY-MM-DD HH:mm:ss")
                }
                ctrlRecordVideo(this.channelId,params).then(res=> {
                    if (res.data.code === 200000) {
                        this.$message.success(!this.isVideoPaused ? '暂停成功' : '开启成功')
                        this.back = false
                        this.$emit('refBackRun',false)
                        this.page16List.forEach((item,index)=>{
                            if (item.ref === this.itemRef) {
                                if(!this.playbackFlag) {
                                    this.speed_show_index = item.speed_show_index = 4
                                    this.speed = this.page16List[index].speed = 1
                                }
                                this.page16List[index].isVideoPaused = !this.page16List[index].isVideoPaused
                                this.isVideoPaused = !this.isVideoPaused
                                this.playbackFlag = true
                                this.page16List[index].playbackFlag = true
                            }
                        })
                        this.$forceUpdate()
                    }
                })
            } else {
                this.back = false
                this.$emit('refBackRun', false)
                if (this.$store.getters.getSyncPlayMode) {
                    this.$parent.searchBatchPlay();
                    return
                }
                this.$parent.searchPlay();
            }
        },
        // 更改完page16List内需要更改播放状态的canvas，还需要更改控制器的播放状态
        updatePlayerButtonState() {
            let _canvas = this.page16List.find(c => c.highlight)
            setTimeout(() => {
                this.isVideoPaused = _canvas.isVideoPaused;
            }, 200);
        },
        // 拖拽行为后重新计时
        async resetControlVideoTimer({channelId, switchTime, manual}) {
            let currentCanvas = this.refList.find(ref => ref.channelId === channelId)
            if (!currentCanvas.isStartPlay) {
                // 如果fgplayer还没有初始化完成不需要执行以下操作
                return
            }
            let delay = 0;
            // 更新shouldControlIndex
            // 去找需要控制播放/暂停的时间点
            currentCanvas.shouldControlIndex = -1;
            // 判断帧是否走到了非视频区间
            let dateArray = [...currentCanvas.greenDateList]
            dateArray.map((date, index) => {
                let nextVideoRange = dateArray[index + 1]
                if (nextVideoRange) {
                    if (index === 0 && Date.parse(switchTime) < Date.parse(dateArray[0].start)) {
                        currentCanvas.shouldControlIndex = index;
                        delay = Date.parse(dateArray[index].start) - Date.parse(switchTime);
                    } else if ( moment(date.end) < moment(switchTime) && moment(switchTime) < moment(nextVideoRange.start)) {
                        currentCanvas.shouldControlIndex = index + 1
                        delay = Date.parse(dateArray[index + 1].start) - Date.parse(switchTime);
                    } 
                } else {
                    if (moment(switchTime) > moment(date.end) && moment().endOf((moment(date).format('YYYY-MM-DD'))) >= moment(switchTime) ) { 
                        currentCanvas.shouldControlIndex = index + 1;
                        delay = Date.parse(moment().endOf((moment(date).format('YYYY-MM-DD')))) - Date.parse(switchTime);
                    }
                }
            });
            // 帧走到了非视频区间就暂停timer
            let _canvas = this.page16List.find(c => c.channelId === currentCanvas.channelId)
            if (currentCanvas.shouldControlIndex >= 0) {
                // 仅对正在播放的实施暂停
                if (!_canvas.isVideoPaused) {
                    console.log('拖动到了非视频区间，对正在播放的实施暂停');
                    await currentCanvas.timer.callback(manual);
                }
                currentCanvas.timer.reset({ delay: Math.ceil(delay / this.speedArray[this.speed_show_index].speed), speed: this.speedArray[this.speed_show_index].speed });
                !this.isLoading && currentCanvas.timer.start();
            }
            // 帧走到了视频区间就重新计算timer
            else {
                currentCanvas.shouldControlIndex = currentCanvas.greenDateList.findIndex((date, index) =>
                    moment(switchTime)>= moment(date.start) && moment(switchTime) <= moment(date.end)
                );
                if (currentCanvas.shouldControlIndex >= 0) {
                    delay = Date.parse(currentCanvas.greenDateList[currentCanvas.shouldControlIndex].end) - Date.parse(switchTime);
                    // 如果视频暂停中，恢复播放
                    currentCanvas.timer.reset({ delay: Math.ceil(delay / this.speedArray[this.speed_show_index].speed), speed: this.speedArray[this.speed_show_index].speed });
                    console.log('拖动到了视频区间，如果视频暂停中，恢复播放');
                    !this.isLoading && currentCanvas.timer.start();
                    if (_canvas.isVideoPaused && currentCanvas.shouldControlIndex) {
                        currentCanvas.timer.callback(manual);
                    }
                }
            }
        },
        // 关闭视频
        closeVideo() {
            if (this.$store.getters.getSyncPlayMode) {
                this.refList.map((ref) => {
                    this.page16List.forEach((item, index) => {
                        if (this.page16List[index].ref == ref.itemRef) {
                            this.isVideoPaused = this.page16List[index].isVideoPaused = true
                            this.playbackFlag = this.page16List[index].playbackFlag = true
                            // 关闭视频将leftChannelName置空
                            this.speed_show_index = 4
                            this.speed = this.page16List[index].speed = 1
                            this.page16List[index].leftChannelName = ''
                        }
                    })
                    if (this['player' + ref.itemRef.substring(5)]) {
                        this['player' + ref.itemRef.substring(5)].stop();
                        this['player' + ref.itemRef.substring(5)].destroy();
                        this['player' + ref.itemRef.substring(5)] = null
                        console.log('关闭视频销毁player', ref.itemRef.substring(5));
                        this.$emit('refChannelName', null)
                    }
                    ref.deleted = true
                })
                this.refList = this.refList.filter(r => !r.deleted)
                this.refList.map(currentCanvas => {
                    currentCanvas.timer.clear();
                })
                this.$emit('refDisableSearchButton', false);
                return
            }
            if (this.itemRef) {
                this.page16List.forEach((item,index)=>{
                    if (this.page16List[index].ref == this.itemRef) {
                        this.isVideoPaused = this.page16List[index].isVideoPaused = true
                        this.playbackFlag = this.page16List[index].playbackFlag = true
                        // 关闭视频将leftChannelName置空
                        this.speed_show_index = this.page16List[index].speed_show_index = 4
                        this.speed = this.page16List[index].speed = 1
                        this.page16List[index].leftChannelName = ''
                    }
                })
                if (this['player' + this.itemRef.substring(5)]) {
                    this['player' + this.itemRef.substring(5)].stop();
                    this['player' + this.itemRef.substring(5)].destroy();
                    this['player' + this.itemRef.substring(5)] = null
                    this.$emit('refChannelName',null)
                } else {
                    this.$message.warning('此处没有视频！')
                }
            }
        },
        /**
         * 倍速(调大)
         */
        changePlus() {
            if (this.$store.getters.getSyncPlayMode) {
                this.refList.map((canvasRef, index) => {
                    if (this.speed_show_index < 8) {
                        let pageCanvasIndex = this.page16List.findIndex(c => c.ref === canvasRef.itemRef);
                        this.page16List[pageCanvasIndex].speed_show_index = this.page16List[pageCanvasIndex].speed_show_index + 1
                        this.speed_show_index = this.page16List[pageCanvasIndex].speed_show_index
                        this.speed = this.speedArray[this.speed_show_index].name
                        this.page16List[pageCanvasIndex].speed = this.speed
                        this.playSpeed = this.speedArray[this.speed_show_index].value
                        console.log(`[${canvasRef.leftChannelName}] 增加倍速到了`, this.speedArray[this.speed_show_index].speed);
                        this.speedFlag = true
                        if (index + 1 === this.refList.length) {
                            this.speedClick()
                        }
                    }
                })
                return
            }
            this.page16List.forEach((item, index) => {
                if (this.page16List[index].ref == this.itemRef) {
                    if (this.speed_show_index<8) {
                        this.speed_show_index = ++this.page16List[index].speed_show_index
                        this.speed = this.speedArray[this.speed_show_index].name
                        this.page16List[index].speed = this.speed
                        this.playSpeed = this.speedArray[this.speed_show_index].value
                        this.speedFlag = true
                        this.speedClick()
                        // 倍速播放关闭声音
                        this.volumeVal = 0
                        this['player' + (index+1)].changeVolume(0);
                    }
                }
            })
        },
        /**
         * 倍速(调小)
         */
        changeMinus() {
            if (this.$store.getters.getSyncPlayMode) {
                this.refList.map((canvasRef, index) => {
                    if (this.speed_show_index > 0) {
                        let pageCanvasIndex = this.page16List.findIndex(c => c.ref === canvasRef.itemRef);
                        this.page16List[pageCanvasIndex].speed_show_index = this.page16List[pageCanvasIndex].speed_show_index - 1
                        this.speed_show_index = this.page16List[pageCanvasIndex].speed_show_index
                        this.speed = this.speedArray[this.speed_show_index].name
                        this.page16List[pageCanvasIndex].speed = this.speed
                        this.playSpeed = this.speedArray[this.speed_show_index].value
                        console.log(`[${canvasRef.leftChannelName}] 减少倍速到了`, this.speedArray[this.speed_show_index].speed);
                        this.speedFlag = true
                        if (index + 1 === this.refList.length) {
                            this.speedClick()
                        }

                    }
                })
                return
            }
            this.page16List.forEach((item,index)=>{
                if (this.page16List[index].ref == this.itemRef) {
                    if (this.speed_show_index>0) {
                        this.speed_show_index = --this.page16List[index].speed_show_index
                        this.speed = this.speedArray[this.speed_show_index].name
                        this.page16List[index].speed = this.speed
                        this.playSpeed = this.speedArray[this.speed_show_index].value
                        this.speedFlag = true
                        this.speedClick()
                        // 倍速播放关闭声音
                        this.volumeVal = 0
                        this['player' + (index+1)].changeVolume(0);
                    }
                }
            })
        },
        // 切换倍速(正放)
        speedClick() {
            if (!this.itemRef) {
                this.$message.warning('请先选择要已开启或暂停的视频！')
                return
            }
            if (!this['player' + this.itemRef.substring(5)]) {
                this.$message.warning('此处没有视频！')
                return
            }
            if (this.$store.getters.getSyncPlayMode) {
              let requests = [];
              this.refList.map(canvasRef=>{
                let params = {
                  streamId: canvasRef.sessionId,
                  ctrl: this.CONTROL.SPEED_3,
                  playSpeed: this.playSpeed
                }
                requests.push(ctrlRecordVideo(canvasRef.channelId,params))
              })
              axios.all(requests).then(axios.spread((...responses) => { 
                // todo: 批量倍速播放成功回调
                responses.map((res, canvasRefIndex) => {
                    let currentCanvas = this.refList[canvasRefIndex]
                    let delay = currentCanvas.timer.getRemain();
                    currentCanvas.timer.reset({ delay: delay, speed: this.speedArray[this.speed_show_index].speed })
                    !this.isLoading && currentCanvas.timer.start();  
                })
              }))
              return
            }
            this.refList.forEach(item=>{
                if (item.itemRef === this.itemRef) {
                    this.sessionId = item.sessionId
                }
            })
            let params = {
                streamId: this.sessionId,
                ctrl: this.CONTROL.SPEED_3,
                playSpeed: this.playSpeed
            }
            ctrlRecordVideo(this.channelId,params).then(res=> {
                if (res.data.code === 200000) {
                    // this.$message.success(!this.speedFlag ? '开启倍速播放！' : '关闭倍速播放！')
                    // this.speedFlag = !this.speedFlag
                    // this.page16List.forEach((item,index)=>{
                    //     if (item.ref === this.itemRef) {
                    //         this.page16List[index].speedFlag = !this.page16List[index].speedFlag
                    //     }
                    // })
                }
            })
        },
        // 切换倍速(倒放)
        speedBackClick() {
            if (!this.itemRef) {
                this.$message.warning('请先选择要已开启或暂停的视频！')
                return
            }
            if (!this['player' + this.itemRef.substring(5)]) {
                this.$message.warning('此处没有视频！')
                return
            }
            this.refList.forEach(item=>{
                if (item.itemRef === this.itemRef) {
                    this.sessionId = item.sessionId
                }
            })
            let params = {
                streamId: this.sessionId,
                ctrl: this.CONTROL.SPEED_3,
                playSpeed: this.speedBackFlag ? 0 : (this.speedArray[this.speed_show_index].value)
            }
            ctrlRecordVideo(this.channelId,params).then(res=> {
                if (res.data.code === 200000) {
                    this.$message.success(!this.speedBackFlag ? '开启倍速倒放！' : '关闭倍速倒放！')
                    this.speedBackFlag = !this.speedBackFlag
                    this.page16List.forEach((item,index)=>{
                        if (item.ref === this.itemRef) {
                            this.page16List[index].speedBackFlag = !this.page16List[index].speedBackFlag
                        }
                    })
                }
            })
        },
        // 单帧
        singleClick(index) {
            if (this.$store.getters.getSyncPlayMode) {
                return
            }
            if (!this.itemRef) {
                this.$message.warning('请选择视频！')
                return
            }
            if (!this['player' + this.itemRef.substring(5)]) {
                this.$message.warning('此处没有视频！')
                return
            }
            this.refList.forEach(item=>{
                if (item.itemRef === this.itemRef) {
                    this.sessionId = item.sessionId
                }
            })
            let params = {
                streamId: this.sessionId,
                ctrl: this.CONTROL.SINGLE_4,
                playSpeed: 0
            }
            ctrlRecordVideo(this.channelId,params).then(res=> {
                if (res.data.code === 200000) {
                    // this.$message.success('获取单帧成功')
                    this.page16List[index ? index : Number(this.itemRef.substring(5))-1].singleFlag = true
                    this.isVideoPaused = false
                }
            }).catch(err => {
                this.$message.error('获取单帧失败')
            })
        },
        shotClick() {
            if (this.$store.getters.getSyncPlayMode) {
                return
            }
            if (!this.itemRef) {
                this.$message.warning('请选择视频')
                return
            }
            for (let i = 0; i < this.page16List.length; i++) {
                if (this.page16List[i].ref === this.itemRef) {
                    this.shotChannel = this.page16List[i].channelId
                }
            }
            if (!this['player' + this.itemRef.substring(5)]) {
                this.$message.warning('此处没有视频！')
                return
            }
            screenshot(this.sessionId, "1").then(res => {
                let coverNo = this.page16List.find(p => p.ref === this.itemRef).cover;
                let currentMaskData = this[`${coverNo}`];
                let resolution = this.channelList.filter(it => it.channel == this.channelId)[0]?.streamInfo[this.channelList.filter(it => it.channel == this.channelId)[0]?.streamType].resolution.match(/(\d+)x(\d+)P/);
                const canvas = document.getElementById(coverNo);
                const downloadCanvas = document.getElementById('download-canvas');
                downloadCanvas.width = resolution?.[1] || 1920;
                downloadCanvas.height = resolution?.[2] || 1080;
                let ctx = downloadCanvas.getContext('2d')
                let image = new Image()
                let base64 = 'data:image/png;base64,' + res.data.data
                var myBlob = dataURLtoBlob(base64);
                var myUrl = URL.createObjectURL(myBlob);
                image.src = myUrl;
                image.onload = () => {
                    ctx.clearRect(0, 0, downloadCanvas.width, downloadCanvas.height)
                    ctx.drawImage(image, 0, 0, downloadCanvas.width, downloadCanvas.height)
                    currentMaskData.map(maskPoints => {
                        ctx.beginPath()
                        maskPoints.map((point, i) => {
                            if (i === 0) {
                                ctx.moveTo(point.x / canvas.width * resolution[1], point.y / canvas.height * resolution[2])
                            } else {
                                ctx.lineTo(point.x / canvas.width * resolution[1], point.y / canvas.height * resolution[2])
                            }
                        })
                        ctx.closePath() // 闭合
                        ctx.strokeStyle = '#333333'
                        ctx.stroke()    // 描边
                        ctx.fillStyle = '#333333'
                        ctx.fill()      // 填充
                    })
                    const a = document.createElement('a');
                    a.href = downloadCanvas.toDataURL();
                    a.download = 'D' + this.shotChannel + (this.timestamp ? ' ' + moment(this.timestamp).format('YYYY-MM-DD HH:mm:ss') : '');
                    const event = new MouseEvent('click');
                    a.dispatchEvent(event);
                }
                // this.downloadFileByBase64(res.data.data)
            })
        },
        lockClick() {
            if (this.$store.getters.getSyncPlayMode) {
                return
            }
            if (!this.itemRef) {
                this.$message.warning('请选择视频')
                return
            }
            if (!this['player' + this.itemRef.substring(5)]) {
                this.$message.warning('此处没有视频！')
                return
            }
            this.$refs.lock.init(this.channelId,this.timestamp,this.fileType)
        },
        tagClick() {
            if (this.$store.getters.getSyncPlayMode) {
                return
            }
            if (!this.itemRef) {
                this.$message.warning('请选择视频')
                return
            }
            if (!this['player' + this.itemRef.substring(5)]) {
                this.$message.warning('此处没有视频！')
                return
            }
            if (this.timestamp) {
                this.$refs['tag'].init( this.channelId, this.timestamp, this.fileType )
            } else {
                setTimeout(()=>{
                    if (this.timestamp) {
                        this.$refs['tag'].init( this.channelId, this.timestamp, this.fileType )
                    } else {
                        setTimeout(()=>{
                            if (this.timestamp) {
                                this.$refs['tag'].init( this.channelId, this.timestamp, this.fileType )
                            } else {
                                setTimeout(()=>{
                                    this.$refs['tag'].init( this.channelId, this.timestamp, this.fileType )
                                }, 500)
                            }
                        }, 500) 
                    }
                },500)
            }
        },
        downloadFileByBase64(base64, name = "视频截图") {
            base64 = 'data:image/png;base64,' + base64
            var myBlob = dataURLtoBlob(base64);
            var myUrl = URL.createObjectURL(myBlob);
            let a = document.createElement("a");
            a.setAttribute("href", myUrl);
            a.setAttribute("download", name);
            a.click()
            URL.revokeObjectURL(myUrl)
        },
        downloadClick() {
            this.downloadVis = true
            this.$refs['download'].init(this.downloadVis)
        },
        download2Click() {
            if (this.downloadFormId) {
                this.$layer.full(this.downloadFormId)
            } else {
                this.downloadFormId = this.$layer.iframe({
                    content: {
                        content: download2,
                        parent: this,
                        data: { 
                            info: {downloadVis: true}
                        }
                    },
                    area: ['1000px', '550px'],
                    title: '录像下载',
                    maxmin: true,
                    shade: false,
                    shadeClose: false,
                    cancel: () => {
                        this.downloadFormId = null
                        window.localStorage.removeItem("downloadFormId")
                    }
                });
                window.localStorage.setItem("downloadFormId", this.downloadFormId)     
            }
        },
        clickOpen() {
            if (!screenfull.isEnabled) {
                this.$message({
                    message: '浏览器不支持',
                    type: 'warning'
                })
                return false
            } else {
                screenfull.on('change', () => {
                    if(screenfull.isFullscreen){
                        this.isFullFlag = true
                        this.$emit('fullFlag',this.isFullFlag)
                    }else{
                        this.isFullFlag = false
                        this.$emit('fullFlag',this.isFullFlag)
                    }
                }); 
            }
            screenfull.toggle()
        },
        /**
         * 切换音量
         */
        changeVolume() {
            // 1倍速并且非倒放模式下可点击
            if (this.speed == 1 && this.playbackFlag) {
                this.arrowFlag = !this.arrowFlag
            }
        },
        clearAllPlayback() {
            this.page16List.forEach((item,index)=>{
                this.isVideoPaused = this.page16List[index].isVideoPaused = true
                this.playbackFlag = this.page16List[index].playbackFlag = true
                this.speed_show_index = 4
                this.speed = this.page16List[index].speed = 1
                this.page16List[index].leftChannelName = ''
            })
            for (let i = 1; i < 17; i++) {
                if (this['player' + i]) {
                    this['player' + i].stop();
                    this['player' + i].destroy();
                    this['player' + i] = null
                }
            }
            this.itemRef = null
        },
    },
}
</script>
<style lang="less" scoped>
.is-fullscreen{
    width: 100%;
    height: 100%;
	position:fixed;
	top:0;
	right:0;
	bottom:0;
	left:0;
}
.frame_full {
    width: 100%;
    height: 100%;
}
.normal {
    width: 100%;
    height: 100%;
}
.preview {
    display: flex;
    flex-direction: column;
    background: linear-gradient(360deg, #014984 0%, #033662 100%);
    box-shadow: inset -5px 5px 13px 0px rgba(17,111,255,0.31);
    border: 1px solid #1A4D91;
    height: 100%;
    .frame {
        width: 100%;
        height: calc(100% - 60px);
        display: flex;
    }
    .operate {
        height: 45px;
        width: calc(100vw - 536px);
        position: fixed;
        top: calc(100vh - 52px);
        background: linear-gradient(360deg, #014984 0%, #033662 100%);
        box-shadow: inset -5px 5px 13px 0px rgba(17,111,255,0.31);
        border: 1px solid #1A4D91;
        .play-time {
            width: 250px;
            height: 40px;
            line-height: 40px;
            color: #ECFDFF;
            font-size: 14px;
            .time_title {
                margin: 0 10px;
            }
            .time_con {
                width: 170px;
                display: inline-block;
                .time_res {
                    display: inline-block;
                    width: 48px;
                    height: 24px;
                    margin: 0 6px;
                    line-height: 24px;
                    border: 1px solid #10538A;
                    text-align: center;
                }
                .time_but {
                    display: inline-block;
                    width: 38px;
                    height: 24px;
                    line-height: 24px;
                    background: #00447D;
                    border-radius: 2px;
                    border: 1px solid #0A56A2;
                    text-align: center;
                    cursor: pointer;
                }
            }
        }
        &_topCenter {
            position: fixed;
            display: flex;
            height: 30px;
            line-height: 30px;
            top: calc(100vh - 155px);
            .icon_item {
                width: 53px;
                padding-left: 10px;
                background: #00447D;
                border: 1px solid #0A56A2;
                border-left: none;
                color: #ECFDFF;
                font-size: 14px;
                cursor: pointer;
                .icon_title {
                    display: inline-block;
                    font-family: PingFangSC-Regular, PingFang SC;
                    margin-right: 3px;
                }
                .icon_title1 {
                    
                }
                .item_icon {
                    font-size: 10px;
                }
                .volume_res {
                    font-size:12px;
                    transform:scale(0.8);
                    position: absolute;
                    margin-left: -3px;
                    margin-top: 3px;
                }
                .volume_pro {
                    width:167px;
                    margin-top: -30px;
                    margin-left: -60px;
                    position: absolute;
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
            .icon_item:hover {
                background: rgb(41, 97, 175);
            }
            .icon_item1 {
                border-radius: 3px 0px 0px 3px;
                border-left: 1px solid #0A56A2;
            }
            .icon_item2 {
                width: 65px;
                border-radius: 0px 3px 3px 0px;
            }
        }
        &_center {
            position: fixed;
            top: calc(100vh - 63px);
            display: flex;
            .speedCon {
                margin-right: -10px;
            }
            .svgMain {
                width: 40px;
                margin-top: 15px;
                margin-left: 16px;
                height: 40px; 
                .svgPlay {
                    border: 1px solid #fff;
                    width: 33px;
                    height: 33px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 1px;
                }
            }
            .svgSpeed {
                color: #ffffff;
                width: 40px;
                display: flex;
                justify-content: center;
                height: 40px;
                line-height: 40px;
                margin: 15px 8px;
                margin-right: -8px;
            }
            .svgClass {
                margin: 6px 0px 0px 7px;
                color: #ffffff;
                cursor: pointer;
                font-size:17px;
            }
            .svgClass1 {
                margin-top: 2px;
                color: #ffffff;
                cursor: pointer;
                font-size:17px;
            }
            .svgClass2 {
                margin-left: 2px;
            }
            .svgMain1 {
                margin-right: -10px;
            }
        }
        &_right {
            position: fixed;
            top: calc(100vh - 58px);
            right: 270px;
            padding: 10px 20px;
            display: flex;
        }
        .async-mode-button,.sync-mode-button{
            background: transparent;
            border: transparent;
            background-repeat: no-repeat;
            width: 24px;
            height: 24px;
            margin: 8px;
            padding: 0;
            background-size: 90%;
            background-position: center;
            &.checked {
                color: #005FB4;
            }
        }
        .async-mode-button {
            background-position: bottom;
            background-image:url('~@/assets/icons/async-mode.svg');
            // &.checked {
            //     background-image:url('~@/assets/icons/async-mode-checked.svg');
            // }
        }
        .sync-mode-button {
            background-image:url('~@/assets/icons/sync-mode.svg');
            // &.checked {
            //     background-image:url('~@/assets/icons/sync-mode-checked.svg');
            // }
        }
        .operate-left {
            margin-left: 12px;
        }
    }
    .name_con {
        width: 100%;
        height: 25px !important;
        position: relative;
        z-index: 100;
        background: linear-gradient(270deg, rgba(0,81,124,0.2) 0%, #005FB4 100%);  
        font-family: PingFangSC-Semibold, PingFang SC;
        display: flex;
        align-items: center;
        color: #ECFDFF;
        .channel_name {
            display: inline-block;
            padding-left: 10px;
            width: calc(93% - 10px);
            height: 22px;
            line-height: 22px;
            overflow: hidden;
            word-break:keep-all;
	        white-space:nowrap;
            text-overflow:ellipsis;
            -o-text-overflow:ellipsis;
            -icab-text-overflow:ellipsis;
            -khtml-text-overflow:ellipsis;
            -moz-text-overflow: ellipsis;
            -webkit-text-overflow:ellipsis;
        }
        .menu_icon {
            font-size: 12px;
        }
    }
    #division-page {
        position: relative;
        width: 240px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        border-radius: 6px;
        background: #ffffff;
        overflow: visible;
    }
    #division-page::before {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        border: 10px solid transparent;
        border-left-color: #ffffff;
        top: 10px;
        right: -20px;
    }
}
.con {
    width: 100px;
    border-radius: 2px;
    border: 1px solid #0056A0;
    /deep/ .tool_con {
        background: #003768;
        display: inline-block;
        width: 100px;
        // height: 25px;
        .con_item {
            display: inline-block;
            cursor: pointer; 
            width: 100px; 
            font-family: PingFangSC-Regular, PingFang SC;
            color: #ECFDFF; 
            text-align: center; 
            // font-size: 12px;
            // font-weight: 400;
            font-size: 15px;
            height: 30px; 
            line-height: 30px;
            border: none;
        }
    }
}
</style>