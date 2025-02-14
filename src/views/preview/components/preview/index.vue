<template>
    <div :class="isFullFlag ? 'is-fullscreen' : 'normal'" @click="clickDiv">
        <div class="preview">
            <div :class="isFullFlag ? 'frame_full' : 'frame'" id="canvas_form">
                <div style="display:flex;flex-wrap: wrap;">
                    <div :style="{width: canvasWidth + 'px',height: canvasHeight + 'px'}">
                        <div v-for="(item,index) of page16List" :key="index">
                            <div class="box1" v-show="index >= (pageNum-1)*division_show_index && index < pageNum*division_show_index" 
                                :style="{width:(division_show_index === 1 ? canvasWidth :
                                                (division_show_index === 2 || division_show_index === 4) ? canvasWidth/2 :
												division_show_index === 6 ? (index%6===0 ? (canvasWidth/3*2-2) : (canvasWidth/3)) :
												division_show_index === 8 ? (index%8===0 ? (canvasWidth/4*3-1) : canvasWidth/4) :
                                                division_show_index === 9 ? canvasWidth/3 :
												division_show_index === 10 ? ((index%10===0 || index%10===1) ? (canvasWidth/2-1) : (canvasWidth/4)) :
                                                division_show_index === 16 ? (canvasWidth/4 - 1) : '') + 'px',
                                        height:(division_show_index === 1 ? canvasHeight :
                                                (division_show_index === 2 || division_show_index === 4) ? canvasHeight/2 :
												division_show_index === 6 ? (index%6===0 ? (canvasHeight/3*2-2) : (canvasHeight/3)) :
												division_show_index === 8 ? (index%8===0 ? (canvasHeight/4*3-1) : (canvasHeight/4)) :
                                                division_show_index === 9 ? canvasHeight/3 :
												division_show_index === 10 ? ((index%10===0 || index%10===1) ? (canvasHeight/2-1) : (canvasHeight/4)) :
												division_show_index === 16 ? (canvasHeight/4) : '') + 'px',
                                        marginTop: division_show_index === 2 ? canvasHeight/4 + 'px' : '',
										background:'#333333',
                                        border:(item.highlight ? '2px solid #009EFF' : '1px solid black'),
                                        cursor: 'pointer'}"
                                        @click="clickCanvas(item)"
                                        @dblclick="dbClickCanvas(item)">
                                <div @wheel="mousewheel" @mousemove="mousemove" @mousedown="mousedown" @mouseup="mouseup"
                                    style="overflow:hidden;" :style="{height: division_show_index === 1 ? canvasHeight + 'px' : ''}">
                                    <video
                                        :class="'orgchart'+(index+1)"
                                        disable-scroll
                                        :ref="item.ref" 
                                        :id="item.ref" 
                                        style="object-fit: fill;position:relative;"
                                        :style="{position:division_show_index === 1 ? 'relative' : 'absolute',
                                                top:division_show_index === 1 ? (videoTop + 'px') : '',
                                                left:division_show_index === 1 ? (videoLeft + 'px') : '',
                                                marginTop:division_show_index === 1 ? '' : 
                                                        (((division_show_index === 6 && index%6 === 0) ? videoTop*2.5 : 
                                                        (division_show_index === 8 && index%8 === 0) ? videoTop*3 : 
                                                        (division_show_index === 10 && (index%10 === 0 || index%10 === 1)) ? videoTop*2 :videoTop) + 'px'),
                                                marginLeft:division_show_index === 1 ? '' : 
                                                        (((division_show_index === 6 && index%6 === 0) ? videoLeft*2.5 : 
                                                        (division_show_index === 8 && index%8 === 0) ? videoLeft*3 : 
                                                        (division_show_index === 10 && (index%10 === 0 || index%10 === 1)) ? videoLeft*2 :videoLeft) + 'px')}"></video>
                                        <div class="name_con" v-show="item.chnlId"  
                                            :style="{
                                                marginTop:division_show_index === 1 ? -(canvasHeight + 2) + 'px' : '',
                                                width: !item.topNameFlag ? '20px' : '',
                                                background: !item.topNameFlag ? 'none' : ''
                                            }">
                                            <span class="channel_name" v-show="item.topNameFlag">
                                                {{channelList.filter(it=>it.channel == item.chnlId)[0]?.channelName}}
                                            </span>
                                            <span class="menu_icon" @click="changeTopName(index)">
                                                <svg-icon v-if="item.chnlId && item.topNameFlag" icon="menu_close"></svg-icon>
                                                <svg-icon v-else-if="item.chnlId && !item.topNameFlag" icon="menu_open"></svg-icon>
                                            </span>
                                        </div>
                                        <div class="info_con" v-show="item.chnlId"  
                                            :style="{
                                                width: !item.topInfoFlag ? '20px' : '',
                                                background: !item.topInfoFlag ? 'none' : ''
                                            }">
                                            <span class="channel-info" style="font-size: 16px; font-weight: 500; padding:5px 12px;" v-show="item.topInfoFlag">
                                                通道信息
                                            </span>
                                            <span class="channel-info" v-show="item.topInfoFlag">
                                                <span>编码格式：</span>
                                                {{channelList.filter(it=>it.channel == item.chnlId)[0]?.streamInfo[channelList.filter(it=>it.channel == item.chnlId)[0]?.streamType].vcodes}}
                                            </span>
                                            <span class="channel-info" v-show="item.topInfoFlag">
                                                <span>分辨率：</span>
                                                {{channelList.filter(it=>it.channel == item.chnlId)[0]?.streamInfo[channelList.filter(it=>it.channel == item.chnlId)[0]?.streamType].resolution}}
                                            </span>
                                            <span class="channel-info" v-show="item.topInfoFlag">
                                                <span>帧率：</span>
                                                {{channelList.filter(it=>it.channel == item.chnlId)[0]?.streamInfo[channelList.filter(it=>it.channel == item.chnlId)[0]?.streamType].vFrameRate}}
                                            </span>
                                            <span class="channel-info" v-show="item.topInfoFlag">
                                                <span>当前码率：</span>
                                                {{channelList.filter(it=>it.channel == item.chnlId)[0]?.streamInfo[channelList.filter(it=>it.channel == item.chnlId)[0]?.streamType].vBitrate}}
                                                <span>Kbs</span>
                                            </span>
                                            <span class="channel-info" v-show="item.topInfoFlag">
                                                <span>相机IP：</span>
                                                {{channelList.filter(it=>it.channel == item.chnlId)[0]?.ip}}
                                            </span>
                                            <span class="channel-info" v-show="item.topInfoFlag">
                                                <span>相机品牌：</span>
                                                {{channelList.filter(it=>it.channel == item.chnlId)[0]?.manufactor}}
                                            </span>
                                            <span class="menu_icon" @click="changeTopInfo(index)">
                                                <i v-if="item.chnlId && item.topInfoFlag" class="el-icon-arrow-up" style="font-size: 20px;"></i>
                                                <svg-icon style="font-size: 15px;" v-else-if="item.chnlId && !item.topInfoFlag" icon="preview-info"></svg-icon>
                                            </span>
                                        </div>
                                        <div style="width: 100px;height: 30px;background: #333333;position: absolute;z-index: 2000;bottom: 20px;color:#ffffff;padding-top: 5px;" :style="{left:(canvasWidth-100)/2 + 'px'}" v-if="item.timely">
                                            <span @click="changeTimely">
                                                <svg-icon icon="play" v-if="timelyFlag"></svg-icon>
                                                <svg-icon icon="suspend" v-else></svg-icon>
                                            </span>
                                            <span @click="closeTimely" style="float:right;margin-right: 10px;">X</span>
                                        </div>
                                        <canvas
                                            :class="'fgCover'+(index+1)"
                                            :ref="item.cover"
                                            :id="item.cover"
                                            width="180"
                                            height="100"
                                            style="position:relative;"
                                            :style="{position:division_show_index === 1 ? 'relative' : 'absolute',
                                                        top:division_show_index === 1 ? 
                                                        (((division_show_index === 6 && index%6 === 0) ? videoTop*2.5 : 
                                                          (division_show_index === 8 && index%8 === 0) ? videoTop*3 : 
                                                          (division_show_index === 10 && (index%10 === 0 || index%10 === 1)) ? videoTop*2 :videoTop) + 'px') : '',
                                                        marginTop: item.topInfoFlag ? '-210px' : item.chnlId ? '-49px' :'',
                                                        left:division_show_index === 1 ? 
                                                        (((division_show_index === 6 && index%6 === 0) ? videoLeft*2.5 : 
                                                          (division_show_index === 8 && index%8 === 0) ? videoLeft*3 : 
                                                          (division_show_index === 10 && (index%10 === 0 || index%10 === 1)) ? videoLeft*2 :videoLeft) + 'px') : ''}"
                                        ></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="sessionId" style="height: 55px;width: 99.8%;position: absolute;"></div>
            <div class="operate">
                <span @click="shotClick()" v-if="!isLocal">
                    <el-tooltip placement="top" :open-delay="300" effect="light" style="cursor:pointer;">
                        <div slot="content">截图</div>
                        <svg-icon icon="screenshot" style="width: 2em;height: 2em;margin: 15px 0 12px 20px;color:#ffffff;cursor: pointer;"></svg-icon>
                    </el-tooltip>
                </span>
                <!-- <span @click="roundPatrol()">
                    <el-tooltip placement="top" :open-delay="300" effect="light" style="cursor:pointer;">
                        <div slot="content">轮巡</div>
                        <svg-icon icon="round" style="margin: 15px 0 15px 10px;color:#ffffff;cursor: pointer;"></svg-icon>
                    </el-tooltip>
                </span> -->
                <span @click="clickTimelyPlayback()">
                    <el-tooltip placement="top" :open-delay="300" effect="light" style="cursor:pointer;">
                        <div slot="content">即时回放</div>
                        <svg-icon icon="timelyPlayback" style="margin: 15px 0 15px 14px;cursor: pointer;"></svg-icon>
                    </el-tooltip>
                </span>
                <span @click="clickManualRecord('start')" v-if="!manualFlag">
                    <el-tooltip placement="top" :open-delay="300" effect="light" style="cursor:pointer;">
                        <div slot="content">手动录像</div>
                        <svg-icon icon="manualRecord" style="width: 2em;height: 2em;margin: 15px 0 12px 14px;color:#ffffff;cursor: pointer;"></svg-icon>
                    </el-tooltip>
                </span>
                <span @click="clickManualRecord('end')" v-else>
                    <el-tooltip placement="top" :open-delay="300" effect="light" style="cursor:pointer;">
                        <div slot="content">结束手动录像</div>
                        <svg-icon icon="manualRecord" style="width: 2em;height: 2em;margin: 15px 0 12px 14px;color:#44fa28;cursor: pointer;"></svg-icon>
                    </el-tooltip>
                </span>
                <!-- <span @click="startCall" v-if="!intercomFlag" ref="start">
                    <el-tooltip placement="top" :open-delay="300" effect="light" style="cursor:pointer;">
                        <div slot="content">开启对讲</div>
                        <svg-icon icon="microphone" style="margin: 15px 0 15px 11px;color:#ffffff;cursor: pointer;"></svg-icon>
                    </el-tooltip>
                </span>
                <span @click="stopCall" v-else ref="stop">
                    <el-tooltip placement="top" :open-delay="300" effect="light" style="cursor:pointer;">
                        <div slot="content">关闭对讲</div>
                        <svg-icon icon="microphone" style="margin: 15px 0 15px 11px;color:#44fa28;cursor: pointer;"></svg-icon>
                    </el-tooltip>
                </span> -->
                <span @click="magnifierClick('open')" v-if="(!magnifierFlag && division_show_index === 1)">
                    <el-tooltip placement="top" :open-delay="300" effect="light" style="cursor:pointer;">
                        <div slot="content">开启放大</div>
                        <svg-icon icon="magnifier" style="margin: 15px 0 15px 14px;color:#ffffff;cursor: pointer;"></svg-icon>
                    </el-tooltip>
                </span>
                <span @click="magnifierClick('close')" v-if="(magnifierFlag && division_show_index === 1)">
                    <el-tooltip placement="top" :open-delay="300" effect="light" style="cursor:pointer;">
                        <div slot="content">关闭放大</div>
                        <svg-icon icon="magnifier_green" style="margin: 15px 0 15px 14px;cursor: pointer;"></svg-icon>
                    </el-tooltip>
                </span>
                <!-- <span style="color: #ffffff;cursor: pointer;" @click="changeSpeed()">
                    <svg-icon style="margin: 0px 0px 15px 12px;" icon="volume" v-if="speed"></svg-icon>
                    <svg-icon style="margin: 0px 0px 15px 12px;" icon="volume_disable" v-else></svg-icon>
                    <span v-if="!arrowFlag">
                        <span style="font-size:12px;transform:scale(0.8);position: absolute;margin-left: -6px;margin-top:9px;">{{ speed }}</span>
                    </span>
                    <span style="margin: 10px;position: absolute;" v-else>
                        <Progress :min="0" :max="100" v-model="speed"></Progress>
                    </span>
                </span> -->
                <div style="float:right;padding: 10px 20px;display: flex;">
                    <span style="margin:-8px 0 0 -12px">
                        <el-tooltip placement="top" :open-delay="300" effect="#003768" style="cursor:pointer;">
                            <div slot="content" class="con">
                                <span v-for="(item,index) of divisionArray" class="tool_con" :key="index">
                                    <span class="con_item"  @click="clickDivision(item)" :style="{background: division_show_index === item.index ?  '#004A88' : ''}">{{item.name}}</span>
                                </span>
                            </div>
                            <svg-icon icon="division" style="width: 1.7em;height: 1.7em;cursor: pointer;margin: 18px 0 15px 12px;color: #ffffff;"></svg-icon>
                        </el-tooltip>
                    </span>
                    <!-- 分页 -->
                    <div style="width:30px;height:30px;line-height: 44px;cursor: pointer;margin-top: 2px;color: #ffffff;text-align: center;margin-left: 10px;" @click="leftClick"><i class="el-icon-arrow-left"></i></div>
                    <div style="width:40px;line-height: 44px;margin-top: 2px;color: #ffffff;text-align: center;">{{pageNewNum + '/' + pageSize}}</div>
                    <div style="width:30px;height:30px;line-height: 44px;cursor: pointer;margin-top: 2px;color: #ffffff;text-align: center;margin-right: 10px;" @click="rightClick"><i class="el-icon-arrow-right"></i></div>
                    <!-- 切换分辨率 -->
                    <span style="margin:-8px 0 0 -12px">
                        <el-tooltip placement="top" :open-delay="300" effect="#003768" style="cursor:pointer;">
                            <div slot="content" class="con">
                                <span v-for="(item,index) of scaleArray" class="tool_con" :key="index">
                                    <span class="con_item" @click="changeScale(item)" :style="{cursor: division_show_index === 1 ? 'no-drop' : 'pointer',background: scale_show_index === item.index ?  '#004A88' : ''}">{{item.name}}</span>
                                </span>
                            </div>
                            <svg-icon icon="video_scale" style="height: 1.8em;width: 1.8em; cursor: pointer;margin: 17px 0 15px 12px;color: #ffffff;"></svg-icon>
                        </el-tooltip>
                    </span>
                    <!-- 展开 -->
                    <div @click="clickOpen">
                        <el-tooltip placement="top" :open-delay="300" effect="light" style="cursor:pointer;">
                            <div slot="content">全屏</div>
                            <svg-icon icon="amplify" style="margin: 12px 0px 15px 15px;cursor: pointer;color: #ffffff;"></svg-icon>
                        </el-tooltip>
                    </div>
                </div>
            </div>
        </div>
        <canvas id="download-canvas" style="visibility: hidden;"></canvas>
        <div v-if="isLock" v-ban-ctrl-r></div>
        <round ref="round" @refRound="getRound"></round>
        <play-video ref="video"></play-video>
        <lock-login ref="lockLogin" @refLockLogin="getLockLogin"></lock-login>
    </div>
</template>
<script>
import bus from '@/utils/eventBus'
import { dataURLtoBlob } from '@/utils/download'
import { HOST} from "@/utils/constant";
import elementResizeDetectorMaker from 'element-resize-detector'
import { getMaskArea, getPreviewConfig, setAudioCtrl, screenshot, manualStart, manualEnd, getSessionId, ctrlRecordVideo, playbackCalendar} from '@/api'
import { getNVRDeviceInfo } from '@/api/systemAPI';
import { putMoreConfig } from '@/api/systemAPI'
import { Recorder } from '@/utils/DGRecorder.js'
import Progress from '@/components/progress'
import round from './round.vue';
import playVideo from '@/components/playVideo'
import screenfull from "screenfull";
import lockLogin from './lockLogin.vue';
import moment from 'moment';
import FGPlayer from "@/assets/libs/fgplayer/fgplayer.min.js";
export default {
    props: {
        isLock: {
            type: Boolean,
            required: false,
        },
    },
    data() {
        return {
            size: {
				contentWidth: window.innerWidth,
				contentHeight: window.innerHeight
			},
			lastTime: null, // 最后一次点击的时间
			currentTime: null, // 当前点击的时间
			timeOut: null, // 设置锁屏时间:10分钟
			timeInterval: '',
            isRoundFlag: false,
            arrowFlag: false,
            speedVal: 0,
            numMin: 1,
            ws: null,
            mediaStack: null,
            audioCtx: null,
            scriptNode: null,
            source: null,
            play: true,
            intercomFlag: false, // 音频
            manualFlag: false, // 手动录像
            magnifierFlag: false,
            isFullFlag: false,
            divisionArray: [{
                name: '单页面',
                index: 1
            },{
                name: '两页面',
                index: 2
            },{
                name: '四页面',
                index: 4
            },{
                name: '六页面',
                index: 6
            },{
                name: '八页面',
                index: 8
            },{
                name: '九页面',
                index: 9
            },{
                name: '十页面',
                index: 10
            },{
                name: '十六页面',
                index: 16
            }],
            division_prev_index: 4,
            division_prev_pagenum: 1,
            division_prev_pagenewnum: 1,
            division_show_index: 4,
            // playParams: { 
            //     retryTimes: 3,
            //     retryDelay: 2,
            //     codec: 'copy',
            //     renderer: 'jmuxer',
            // },
            // playParams265: { 
            //     retryTimes: 3,
            //     retryDelay: 2,
            // },
            isLoading: false,
            isCaching: false,
            bboxEnabled: true,
            canvasWidth: null,
            canvasHeight: null,
            page32List: new Array(64),
            page16List: [{
                ref: 'scene1',
                cover: 'coverArray1',
                player: null,
                mode: 0,
                topNameFlag: false,
                topInfoFlag: false,
                chnlId: null
            },{
                ref: 'scene2',
                cover: 'coverArray2',
                player: null,
                mode: 0,
                topNameFlag: false,
                topInfoFlag: false,
                chnlId: null
            },{
                ref: 'scene3',
                cover: 'coverArray3',
                player: null,
                mode: 0,
                topNameFlag: false,
                topInfoFlag: false,
                chnlId: null
            },{
                ref: 'scene4',
                cover: 'coverArray4',
                player: null,
                mode: 0,
                topNameFlag: false,
                topInfoFlag: false,
                chnlId: null
            },{
                ref: 'scene5',
                cover: 'coverArray5',
                player: null,
                mode: 0,
                topNameFlag: false,
                topInfoFlag: false,
                chnlId: null
            },{
                ref: 'scene6',
                cover: 'coverArray6',
                player: null,
                mode: 0,
                topNameFlag: false,
                topInfoFlag: false,
                chnlId: null
            },{
                ref: 'scene7',
                cover: 'coverArray7',
                player: null,
                mode: 0,
                topNameFlag: false,
                topInfoFlag: false,
                chnlId: null
            },{
                ref: 'scene8',
                cover: 'coverArray8',
                player: null,
                mode: 0,
                topNameFlag: false,
                topInfoFlag: false,
                chnlId: null
            },{
                ref: 'scene9',
                cover: 'coverArray9',
                player: null,
                mode: 0,
                topNameFlag: false,
                topInfoFlag: false,
                chnlId: null
            },{
                ref: 'scene10',
                cover: 'coverArray10',
                player: null,
                mode: 0,
                topNameFlag: false,
                topInfoFlag: false,
                chnlId: null
            },{
                ref: 'scene11',
                cover: 'coverArray11',
                player: null,
                mode: 0,
                topNameFlag: false,
                topInfoFlag: false,
                chnlId: null
            },{
                ref: 'scene12',
                cover: 'coverArray12',
                player: null,
                mode: 0,
                topNameFlag: false,
                topInfoFlag: false,
                chnlId: null
            },{
                ref: 'scene13',
                cover: 'coverArray13',
                player: null,
                mode: 0,
                topNameFlag: false,
                topInfoFlag: false,
                chnlId: null
            },{
                ref: 'scene14',
                cover: 'coverArray14',
                player: null,
                mode: 0,
                topNameFlag: false,
                topInfoFlag: false,
                chnlId: null
            },{
                ref: 'scene15',
                cover: 'coverArray15',
                player: null,
                mode: 0,
                topNameFlag: false,
                topInfoFlag: false,
                chnlId: null
            },{
                ref: 'scene16',
                cover: 'coverArray16',
                player: null,
                mode: 0,
                topNameFlag: false,
                topInfoFlag: false,
                chnlId: null
            }],
            pageNewNum: 1,//超出16路预览后折算前的页码(真实页码)
            pageNum: 1,//当前页
            pageSize: 1,//总页数
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
            topNum: 0,
            leftNum: 0,
            maxMarginTop: 0,
            maxMarginLeft: 0,
            moveFlag: false,
            bgWidth: 484,
            bgHeight: 324,
            channelList: [],
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
            frameNum: null,
            isLocal: false, //是否是本地
            timelyFlag: true, // 是否正在播放即时回放视频
            sessionId: null, // 即时回放时需获取sessionId，关闭即时回放时应置空sessionId，同时用是否有sessionId来判断是否可以点击除即时回放以外的其他地方
        }
    },
    inject: ['reload'],
    components:{
        Progress,
        round,
        playVideo,
        lockLogin
    },
    computed: {
        speed: {
            get() {
                return this.speedVal;
            },
            set(val) {
                this.speedVal = val;
                for (let i = 0; i < this.page16List.length; i++) {
                    if (this.page16List[i].ref === this.itemRef) {
                        // if (this.page16List[i].player.getVolume() == 0 && val > 0) {
                        //     setAudioCtrl(this.page16List[i].chnlId, {streamId: "", control: 2})
                        // } else if (this.page16List[i].player.getVolume() > 0 && val == 0) {
                        //     setAudioCtrl(this.page16List[i].chnlId, {streamId: "", control: 1})
                        // }
                        // this.page16List[i].player.changeVolume(val);
                    } else {
                        if (this.page16List[i].player) {
                            // if (this.page16List[i].player.getVolume() > 0) {
                            //     setAudioCtrl(this.page16List[i].chnlId, {streamId: "", control: 1})
                            // }
                            // this.page16List[i].player.changeVolume(0);
                        }
                    }
                }
            },
        },
    },
    watch: {
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
        '$store.state.channelList': {
            handler(newVal,oldVal){
                this.channelList = newVal
            },
            deep: true
        }
    },
    created() {
        this.getNVRRd()
        this.isLocal = JSON.parse(localStorage.getItem('isLocal'))
		this.timeOut = Number(localStorage.getItem('timeOut')) * 60000
        if (this.isLock) {
            this.isFullFlag = true
            this.$emit('fullFlag',this.isFullFlag)
            window.onkeydown = function() {
                if(window.event.keyCode===27){
                    window.event.keyCode=0;
                    window.event.returnValue=false;
                    console.log(window.event.keyCode)
                }
            }
            this.putMoreConfig(true)
        } else {
            if (this.isLocal) {
                this.clickDiv()
            }
        }
    },
    mounted() {
        this.initPlayers()

        window.addEventListener('beforeunload', this.updateHandler)
        let erd = elementResizeDetectorMaker()
        erd.listenTo(document.getElementById("canvas_form"), element => {
            this.$nextTick(() => {
                this.videoWidth = this.canvasWidth = element.offsetWidth
                this.videoHeight = this.canvasHeight = element.offsetHeight
                this.getContentWH()
                this.circulateCover()
                this.changeScale(this.scaleArray.filter(item=>item.index === this.scale_show_index)[0])
            })
        });
        window.onresize= () => {
            return (() => {
                let erd = elementResizeDetectorMaker()
                erd.listenTo(document.getElementById("canvas_form"), element => {
                    this.$nextTick(() => {
                        this.videoWidth = this.canvasWidth = element.offsetWidth
                        this.videoHeight = this.canvasHeight = element.offsetHeight
                        this.getContentWH()
                        this.circulateCover()
                        this.changeScale(this.scaleArray.filter(item=>item.index === this.scale_show_index)[0])
                    })
                });
                this.sizeChange()
            })();
        }
        bus.$on('preview',data => {
            this.mode = data.mode
            // if (data.openNums) {
            //     // 通道全选修改分页
            //     this.pageSize = Math.ceil(data.openNums / this.division_show_index)
            //     this.itemRef = undefined
            //     this.pageNewNum = 1
            //     this.pageNum = (this.pageNewNum <= Math.ceil((this.division_show_index == 9 ? 9 : 16)/this.division_show_index)) ? this.pageNewNum : ((this.division_show_index !=16 && this.division_show_index !=9) ? ((this.pageNewNum-1)%(Math.ceil(16/this.division_show_index))+1) : 1)
            //     this.changePage()
            //     return
            // }
            let sum = 0
            for (let i = 0; i < this.page16List.length; i++) {
                if (this.page16List[i].chnlId) {
                    sum += 1
                }
            }
            if (data.refresh) {
                // 右上角刷新按钮
                for (let i = 0; i < this.page16List.length; i++) {
                    if (this.page16List[i].chnlId) {
                        const canvas = document.getElementById(this.page16List[i].ref)
                        const canvas1 = document.getElementById(this.page16List[i].cover)
                        canvas.width = 0
                        canvas1.width = 0
                        this.page16List[i].player.stop();
                        this.page16List[i].player.video.currentTime = 0;
                        this.page16List[i].player.video.load();
                        this.page16List[i].chnlId = null;
                    }
                }
                this.speedVal = 0
                this.pageNum = 1
                this.pageSize = 1
                this.itemRef = undefined
            } else {
                if (data.playFlag) {
                    // 播放
                    this.itemRef = data.itemRef ? data.itemRef : this.itemRef
                    this.arrowFlag = false
                    // oriPosition用来记录折算前的位置
                    let oriPosition = 1
                    if ((this.itemRef && this.page16List[this.itemRef.substring(5)-1].chnlId) || !this.itemRef) {
                        console.log('******1111');
                        oriPosition = this.selectEmptyScene(data.channelId)
                    } else {
                        // 关闭视频再播放
                        let a =  Number(this.itemRef.substring(5))
                        let pageNum1 = (this.division_show_index != 6 && this.division_show_index != 9 && this.division_show_index != 10) ? (16/this.division_show_index) : 1 //折算后的页码
                        console.log('******a,pageNum1',a,pageNum1);
                        if (this.pageNewNum > pageNum1) {
                            oriPosition = ((this.division_show_index == 6 || this.division_show_index == 9 || this.division_show_index == 10) ? (this.pageNewNum-pageNum1) : pageNum1)*this.division_show_index + a
                        } else {
                            oriPosition = a
                        }
                        console.log('******oriPosition',oriPosition);
                        this.page32List[oriPosition-1] = {
                            chnlId: data.channelId,
                            mode: data.mode
                        }
                        console.log('******2222');
                    }
                    bus.$emit('channel',this.itemRef,null,sum)

                    const canvas = document.getElementById('coverArray' + this.itemRef.substring(5))
                    console.log('this.itemRef',this.itemRef);
                    this.coverCanvasWH(canvas,Number(this.itemRef.substring(5))-1)
                    let ctx = canvas.getContext('2d')
                    ctx.clearRect(0,0,canvas.width,canvas.height)
                    for (let i = 0; i < this.channelList.length; i++) {
                        if (this.channelList[i].channel == data.channelId) {
                            this.manualFlag = this.channelList[i].recordStateManual
                            this.playUrl(data.channelId,oriPosition,this.manualFlag)
                        }
                    }
                    // 全选逻辑
                    if (data.channelLength) {
                        console.log('data.channelLength',data.channelLength);
                        console.log('this.page32List.filter(item=>item).length', this.page32List.filter(item=>item).length);
                        // console.log('this.page32List.length---',data.channelLength,this.page32List[data.channelLength-1]);
                        if (18 == this.page32List.filter(item=>item).length) {
                            for (let j = 0; j < this.page16List.length; j++) {
                                if (this.page16List[j].chnlId == this.page32List[data.channelLength-1].chnlId) {
                                    this.clickCanvas(this.page16List[j])
                                }
                            }
                        }
                        for (let i = 0; i < this.page16List.length; i++) {
                            if (this.page16List[i].chnlId === data.channelId) {
                                this.page16List[i].topNameFlag = false
                                this.page16List[i].topInfoFlag = false
                                // 计算32List中原本的位置
                                let index = this.division_show_index*(this.pageNewNum-this.pageNum)+Number(this.itemRef.substring(5))-1
                                this.page32List[index].mode = data.mode
                                // 获取遮盖区域
                                getMaskArea(data.channelId).then(res=>{
                                    this.bgWidth = res.data.data.width
                                    this.bgHeight = res.data.data.height
                                    this['coverArray' + this.page16List[i].ref.substring(5)] = res.data.data.regions
                                    this.maskData(i,res.data.data.width,res.data.data.height,this['coverArray' + this.page16List[i].ref.substring(5)])
                                })
                                let params = {
                                    id: this.page16List[i].chnlId.toString(),
                                    videoParam: {
                                        enable: true,
                                        width: ((this.division_show_index === 1 || this.division_show_index === 2 || this.division_show_index === 4) &&
                                                (index+1) > Math.floor(data.channelLength/this.division_show_index)*this.division_show_index &&
                                                (index+1) < Math.ceil(data.channelLength/this.division_show_index)*this.division_show_index) ? 1920 : 640,
                                        frameRate: 15,
                                        streamMode: this.mode,
                                        height: ((this.division_show_index === 1 || this.division_show_index === 2 || this.division_show_index === 4) &&
                                                (index+1) > Math.floor(data.channelLength/this.division_show_index)*this.division_show_index &&
                                                (index+1) < Math.ceil(data.channelLength/this.division_show_index)*this.division_show_index) ? 1080 : 360,
                                    },
                                    detectParam: {
                                        enable: true
                                    }
                                }
                                if (!this.isRoundFlag) {
                                    // getPreviewConfig(params)
                                }
                            }
                        }
                    } else {
                        for (let i = 0; i < this.page16List.length; i++) {
                            if (this.page16List[i].chnlId === data.channelId) {
                                this.page16List[i].topNameFlag = false
                                this.page16List[i].topInfoFlag = false
                                // 计算32List中原本的位置
                                let index = this.division_show_index*(this.pageNewNum-this.pageNum)+Number(this.itemRef.substring(5))-1
                                this.page32List[index].mode = data.mode
                                // 获取遮盖区域
                                getMaskArea(data.channelId).then(res=>{
                                    this.bgWidth = res.data.data.width
                                    this.bgHeight = res.data.data.height
                                    this['coverArray' + this.page16List[i].ref.substring(5)] = res.data.data.regions
                                    this.maskData(i,res.data.data.width,res.data.data.height,this['coverArray' + this.page16List[i].ref.substring(5)])
                                })
                            }
                        }
                    }
                } else {
                    // 停止
                    let i = this.getPlayer(data.channelId)
                    if(i>=0 && this.page16List[i].chnlId === data.channelId) {
                        this.page16List[i].chnlId = null
                        if (this.page16List[i].timer) {
                            clearTimeout(this.page16List[i].timer)
                        }
                        if (this.itemRef === this.page16List[i].ref) {
                            // this.page16List[i].player?.changeVolume(0)
                            this.speedVal = 0
                        }
                        const canvas = document.getElementById(this.page16List[i].ref)
                        const canvas1 = document.getElementById(this.page16List[i].cover)
                        canvas.width = 0
                        canvas1.width = 0
                        this.page16List[i].player?.stop();
                        this.page16List[i].player.video.currentTime = 0;
                        this.page16List[i].player.video.load();
                        bus.$emit('channel',null,null,sum)
                    }
                    // 不管真关还是假关都得走这边循环关闭视频
                    for(let j=0;j<this.page32List.length;j++){
                        if(this.page32List[j]?.chnlId == data.channelId){
                            this.page32List[j]={}
                            break;
                        }
                    }
                }
            }
            if (data.playFlag === undefined && data.openNums === undefined) {
                this.pageNewNum = 1
                this.pageNum = 1
                this.pageSize = 1
                for (let i = 0; i < this.page16List.length; i++) {
                    this.page16List[i].oriPosition = null
                    this.page16List[i].topNameFlag = false
                    this.page16List[i].topInfoFlag = false
                }
                this.page32List = []
                console.log(this.page16List,'###',this.page32List)
            }
            // 非全选--单个操作
            if (!data.channelLength) {
                if (data.playFlag) {
                    // 播放
                    if (sum%this.division_show_index === 0) {
                        // 换页需重新全部加载
                        for (let i = 0; i < this.page16List.length; i++) {
                            if (this.page16List[i].chnlId) {
                                this.operateConfig(this.page16List[i],sum)
                            }
                        }
                    } else {
                        for (let i = 0; i < this.page16List.length; i++) {
                            if (this.page16List[i].chnlId === data.channelId) {
                                this.operateConfig(this.page16List[i],sum)
                            }
                        }
                    }
                } else {
                    // 取消播放时(逻辑还需优化--可能每个页面只有一两个视频的情况)
                    if (sum%this.division_show_index === 0) {
                        // 换页需重新全部加载
                        for (let i = 0; i < this.page16List.length; i++) {
                            if (this.page16List[i].chnlId) {
                                this.operateConfig(this.page16List[i],sum)
                            }
                        }
                    }
                }
            }
        })
    },
    beforeDestroy(){
        // console.log(this.page16List.some(item=>!item.player));
        for (let i = 0; i < this.page16List.length; i++) {
            if (this.page16List[i].player) {
                this.page16List[i].player.stop();
                this.page16List[i].player.video.currentTime = 0;
                this.page16List[i].player.video.load();
                this.page16List[i].player.destroy();
                this.page16List[i].player = null
            }
        }
		clearInterval(this.timeInterval);
        bus.$off('preview')
        localStorage.setItem('isRoundFlag',false)
    },
    destroyed() {
        window.removeEventListener('beforeunload', this.updateHandler)
    },
    methods: {
        async getNVRRd() {
            let nvrInfoData = await getNVRDeviceInfo();
            this.nvrRd = nvrInfoData.data.data.channelNumber
            localStorage.setItem('nvrRd',this.nvrRd)
            this.page32List = new Array(this.nvrRd)
        },
        /**
         * 是否锁屏状态
         * @param {Boolean} flag true为锁屏 false为不锁屏
         */
        putMoreConfig(flag) {
            putMoreConfig({
                isLockScreen: flag
            })
        },
        /**
         * config处理分辨率
         */
        operateConfig(item,sum) {
            let params = {
                id: item.chnlId.toString(),
                videoParam: {
                    enable: true,
                    width: ((this.division_show_index === 1 || (this.division_show_index === 2 || this.division_show_index === 4)) &&
                            Number(item.ref.substring(5))>(this.pageNum - 1) * this.division_show_index &&
                            Number(item.ref.substring(5)) < this.pageNum * this.division_show_index + 1) ? 1920 : (sum < 9 ? 960 : 640),
                    frameRate: 15,
                    streamMode: this.mode,
                    height: ((this.division_show_index === 1 || (this.division_show_index === 2 || this.division_show_index === 4)) &&
                            Number(item.ref.substring(5))>(this.pageNum - 1) * this.division_show_index &&
                            Number(item.ref.substring(5)) < this.pageNum * this.division_show_index + 1) ? 1080 : (sum < 9 ? 540 : 360),
                },
                detectParam: {
                    enable: true
                }
            }
            // getPreviewConfig(params)
        },
		clickDiv() {
            if (this.isLocal) {
                console.log('走了外面','---this.isLock',this.isLock,'+++this.timeInterval',this.timeInterval);
                if (this.timeInterval == '' && !this.isLock) {
                    console.log('走了里面');
                    // 5秒钟检测一次
                    this.timeInterval = setInterval(this.isTimeOut, 5000);
                }
                this.lastTime = new Date().getTime();
            }
		},
        isTimeOut() {
			this.currentTime = new Date().getTime();
			if (this.currentTime - this.lastTime > this.timeOut && !this.isLock && !this.isRoundFlag) {
                console.log('走了这里');
                this.isFullFlag = true
                this.$emit('fullFlag',this.isFullFlag,'true')
                this.putMoreConfig(true)
			} else if (this.isLock) {
                console.log('走了清空');
                clearInterval(this.timeInterval);   // 清除定时器
                this.timeInterval = '';
            } else {
                console.log('时间不够');
            }
		},
        initPlayers() {
            console.log("init fgplayers")
            for(let i = 0; i < this.page16List.length; i++) {
                if (this.page16List[i].player) {
                    continue;
                }
                this.page16List[i].player = new FGPlayer({ video: this.$refs[this.page16List[i].ref][0] })
            }
        },
        getPlayer(channelId) {
            for (let i = 0; i < this.page32List.length; i++) {
                if (this.page32List[i]?.chnlId == channelId) {
                    return (this.division_show_index == 6 || this.division_show_index == 9 || this.division_show_index == 10) ? i%this.division_show_index : i%16
                }
            }
            return -1
        },
        // 获取空格子
        selectEmptyScene(channelId) {
            let flag = 0
            let savePlace //该参数是此函数应该返回的位置(格子)
            let newPage = 0
            // 检查当前页
            for (let i = (this.pageNewNum-1)*this.division_show_index; i < this.pageNewNum*this.division_show_index; i++){
                if (!this.page32List[i]?.chnlId) {
                    savePlace = (i+1)
                    flag = 1
                    break
                }
            }
            // 如果当前页没有找到
            if (flag === 0) {
                // 先从第一页到已打开的页数(this.pageSize)找
                for (let i = 0; i < this.pageSize; i++) {
                    for (let j = i*this.division_show_index+1; j < (i+1)*this.division_show_index+1; j++) {
                        if (!this.page32List[j-1]?.chnlId) {
                            savePlace = j
                            console.log('^^^savePlace222',savePlace);
                            flag = 1
                            break
                        }
                    }
                }
                // 如果从第一页到已打开的页数(this.pageSize)都没有找到，新开一页
                if (flag === 0) {
                    this.pageSize += 1
                    newPage = 1
                    this.pageNewNum = this.pageSize
                    savePlace = ((this.pageSize - 1) * this.division_show_index + 1)
                }
            }
            let pageNum0 = Math.ceil(savePlace/this.division_show_index) //应该在的真实页码(折算前的)
            if(savePlace > ((this.division_show_index == 6 || this.division_show_index == 9 || this.division_show_index == 10) ? this.division_show_index : 16) || 
			this.pageNewNum > ((this.division_show_index == 6 || this.division_show_index == 9 || this.division_show_index == 10) ? 1 : (16/this.division_show_index))) {
                // 如果真实的格子>16或9 || 真实的页码>显示的最大的页码值(1或4或9或16)
                console.log("select new itemRef333:", this.pageNewNum,pageNum0,newPage)
                if (pageNum0 == this.pageNewNum && newPage != 1) {
                    // 在当前页
                    // if(this.page16List[savePlace - 16].chnlId) {
                    //     this.page16List[savePlace - 16].player.stop();
                    //     this.page16List[savePlace - 16].chnlId = null
                    //     this.page16List[savePlace - 16].topNameFlag = null
                    // }
                } else {
                    // pageNum1:实际显示的页码(用真实折算前的页码计算得出)
                    let pageNum1 = (this.division_show_index == 6 || this.division_show_index == 9 || this.division_show_index == 10 || this.division_show_index == 16) ? 1 : ((pageNum0-1)%(16/this.division_show_index)+1)
                    console.log("select new itemRef444:", pageNum1)
                    for(let i=(pageNum1-1)*this.division_show_index;i<pageNum1*this.division_show_index;i++){
                        console.log("select new itemRef111:", pageNum1,i)
                        this.page16List[i].player.stop();
                        this.page16List[i].player.video.currentTime = 0;
                        this.page16List[i].player.video.load();
                        this.page16List[i].chnlId = null
                        this.page16List[i].topNameFlag = null
                        this.page16List[i].topInfoFlag = null
                    }
                    for(let i=(pageNum0-1)*this.division_show_index;i<pageNum0*this.division_show_index;i++){
                        if(this.page32List[i]?.chnlId && !this.page16List[(this.division_show_index == 6 || this.division_show_index == 9 || this.division_show_index == 10) ? i%this.division_show_index : i%16].chnlId){
                            // 如果32的list有值，16的list没有值 --> 开启播放
                            this.playNewUrl(((this.division_show_index == 6 || this.division_show_index == 9 || this.division_show_index == 10) ? i%this.division_show_index : i%16),this.page32List[i]?.chnlId,i+1)
                                            // p(page16List中的index),  channelId,  oriPosition(折算前的格子位置)
                        }
                    }
                }
                this.itemRef = 'scene' + ((this.division_show_index == 6 || this.division_show_index == 9 || this.division_show_index == 10) ? ((savePlace-1)%this.division_show_index+1) :
										  (savePlace-1)%16+1) //(savePlace-1)再取余9然后+1是为了解决9%9=0的这种最后一个的特殊情况
            } else {
                this.itemRef = 'scene' + savePlace
            }
            this.page32List[savePlace-1]={
                chnlId: channelId,
                mode: this.mode
            }
            console.log("select new itemRef222:", this.itemRef,savePlace)
            this.clickCanvas({ref:this.itemRef})
            this.pageNum = this.division_show_index !=9 ? Math.ceil(Number(this.itemRef.substring(5))/this.division_show_index) : 1 // 折算后的页码
            this.pageNewNum = Math.ceil(savePlace/this.division_show_index) // 折算前的页码
            this.page16List.forEach((item,index)=>{
                if ((this.itemRef.substring(5) - 1) == index) {
                    this.page16List[index].highlight = true
                } else {
                    this.page16List[index].highlight = false
                }
            })
            return savePlace // 返回折算前真实的格子
        },
        /**
         * 获取contentWidth和contentHeight
         */
        getContentWH() {
            this.contentWidth = this.division_show_index === 1 ? (this.canvasWidth - 1) :
                                (this.division_show_index === 2 || this.division_show_index === 4) ? (this.canvasWidth/2 - 2) :
                                (this.division_show_index === 6 || this.division_show_index === 9) ? (this.canvasWidth/3 - 2) :
                                (this.division_show_index === 8 || this.division_show_index === 10 || this.division_show_index === 16) ? (this.canvasWidth/4 - 2) : ''
            this.contentHeight = this.division_show_index === 1 ? (this.canvasHeight - 1) :
                                 (this.division_show_index === 2 || this.division_show_index === 4) ? (this.canvasHeight/2 - 2) :
                                 (this.division_show_index === 6 || this.division_show_index === 9) ? (this.canvasHeight/3 - 2) :
                                 (this.division_show_index === 8 || this.division_show_index === 10 || this.division_show_index === 16) ? (this.canvasHeight/4 - 2) : ''
        },
        /**
         * 循环获取遮盖信息
         */
        circulateCover() {
            for (let i = 0; i < this.page16List.length; i++) {
                if (this.page16List[i].chnlId) {
                    getMaskArea(this.page16List[i].chnlId).then(res=>{
                        this.bgWidth = res.data.data.width
                        this.bgHeight = res.data.data.height
                        this['coverArray' + this.page16List[i].ref.substring(5)] = res.data.data.regions
                        this.maskData(i,res.data.data.width,res.data.data.height,this['coverArray' + this.page16List[i].ref.substring(5)])
                    })
                }
            }
        },
        /**
         * 获取每一个遮盖canvas的宽高
         * @param {*} canvas 
         * @param {Number} coverNo 遮盖的哪个canvas
         */
        coverCanvasWH(canvas,coverNo) {
            canvas.width = this.division_show_index === 1 ? (this.canvasWidth - 1) :
						   (this.division_show_index === 2 || this.division_show_index === 4) ? (this.canvasWidth/2 - 2) :
                           // 6画面每页第一个
                           (this.division_show_index === 6 && (coverNo%6 === 0)) ? (this.canvasWidth/3*2 - 2) :
                           // 6画面非每页第一个 和 9画面
                           ((this.division_show_index === 6 && coverNo%6 !== 0) || this.division_show_index === 9) ? (this.canvasWidth/3 - 2) :
                           // 8画面每页第一个
						   (this.division_show_index === 8 && coverNo%8 === 0) ? (this.canvasWidth/4*3 - 2) :
                           // 10画面每页第一个和第二个
						   (this.division_show_index === 10 && (coverNo%10 === 0 || coverNo%10 === 1)) ? (this.canvasWidth/2 - 2) :
                           // 8画面非每页第一个 and 10画面非每页第一个、第二个 and 16画面
						   ((this.division_show_index === 8 && coverNo%8 !== 0) || 
                            (this.division_show_index === 10 && coverNo%10 !== 0 && coverNo%10 !== 1) || 
                            this.division_show_index === 16) ? (this.canvasWidth/4 - 2) : ''
            canvas.height = this.division_show_index === 1 ? (this.canvasHeight - 1) :
                            (this.division_show_index === 2 || this.division_show_index === 4) ? (this.canvasHeight/2 - 2) :
                            // 6画面每页第一个
                            (this.division_show_index === 6 && coverNo%6 === 0) ? (this.canvasHeight/3*2 - 2) :
                            // 6画面非每页第一个 和 9画面
                            ((this.division_show_index === 6 && coverNo%6 !== 0) || this.division_show_index === 9) ? (this.canvasHeight/3 - 2) :
                            // 8画面每页第一个
                            (this.division_show_index === 8 && coverNo%8 === 0) ? (this.canvasHeight/4*3 - 2) :
                            // 10画面每页第一个和第二个
                            (this.division_show_index === 10 && (coverNo%10 === 0 || coverNo%10 === 1)) ? (this.canvasHeight/2 - 2) :
                            // 8画面非每页第一个 and 10画面非每页第一个、第二个 and 16画面
                            ((this.division_show_index === 8 && coverNo%8 !== 0) || 
                            (this.division_show_index === 10 && coverNo%10 !== 0 && coverNo%10 !== 1) || 
                            this.division_show_index === 16) ? (this.canvasHeight/4 - 2) : ''
        },
        /**
         * watch监听遮盖canvas坐标值改变后重新绘制
         * @param {Array} newVal 遮盖的坐标值
         * @param {String} coverNo 监听的值('coverArray1',2,3,...)
         */
        initCanvas(newVal,coverNo){
            const canvas = document.getElementById(coverNo)
            this.coverCanvasWH(canvas,Number(coverNo.substring(10))-1)
            let ctx = canvas.getContext('2d')
            ctx.clearRect(0,0,canvas.width,canvas.height)
            for (let i = 0; i < newVal?.length; i++) {
                ctx.beginPath()
                for (let j = 0; j < newVal[i].length; j++) {
                    if (j === 0) {
                        ctx.moveTo(newVal[i][0].x, newVal[i][0].y)
                    } else {
                        ctx.lineTo(newVal[i][j].x, newVal[i][j].y)
                    }
                }
                ctx.closePath() // 闭合
                ctx.strokeStyle = '#333333'
                ctx.stroke()    // 描边
                ctx.fillStyle = '#333333'
                ctx.fill()      // 填充
            }
        },
        changeTopName(index) {
            let realIndex
            // 计算真实的Index
			let pageNum1 = (this.division_show_index == 6 || this.division_show_index == 9 || this.division_show_index == 10 || this.division_show_index == 16) ? 1 :
						  (16/this.division_show_index) // 不复用之前的格子最大的页码数
                          console.log('this.pageNewNum',this.pageNewNum,'pageNum1',pageNum1);
            if (this.pageNewNum > pageNum1) {
                realIndex = (this.division_show_index == 6 || this.division_show_index == 9 || this.division_show_index == 10 || this.division_show_index == 16) ? (index+this.division_show_index*(this.pageNewNum-1)) : (index+16)
            } else {
                realIndex = index
            }
            this.page16List[index].topNameFlag = !this.page16List[index].topNameFlag
            this.page32List[realIndex].topNameFlag = !this.page32List[realIndex].topNameFlag
        },
        changeTopInfo(index) {
            let realIndex
            // 计算真实的Index
            let pageNum1 = (this.division_show_index != 6 && this.division_show_index != 9 && this.division_show_index != 10) ? (16/this.division_show_index) : 1 //折算后的页码
            if (this.pageNewNum > pageNum1) {
                realIndex = (this.division_show_index == 6 || this.division_show_index == 9 || this.division_show_index == 10 || this.division_show_index == 16) ? (index+this.division_show_index*(this.pageNewNum-1)) : (index+16)
            } else {
                realIndex = index
            }
            this.page16List[index].topInfoFlag = !this.page16List[index].topInfoFlag
            this.page32List[realIndex].topInfoFlag = !this.page32List[realIndex].topInfoFlag
        },
        updateHandler() {
            window.localStorage.removeItem('change-preview')
        },
        /**
         * 截图
         */
        shotClick() {
            // 关掉原先的预览视频,然后打开即时回放视频
            if (!this.itemRef) {
                this.$message.warning('请选择截图的视频')
                return
            }
            for (let i = 0; i < this.page16List.length; i++) {
                if (this.page16List[i].ref === this.itemRef) {
                    this.shotChannel = this.page16List[i].chnlId
                }
            }
            // 计算折算前原先的位置
            let index = this.division_show_index*(this.pageNewNum-this.pageNum)+Number(this.itemRef.substring(5))-1
            if (!this.page32List[index]?.chnlId) {
                this.$message.warning('此处没有视频！')
                return
            }
            let channelId = this.page32List[index].chnlId
            let mode = this.page32List[index].mode
            screenshot(channelId, '0', mode).then(res => {
                let coverNo = this.page16List.find(p => p.ref === this.itemRef).cover;
                let currentMaskData = this[`${coverNo}`];
                let resolution = this.channelList.filter(it => it.channel == channelId)[0]?.streamInfo[this.channelList.filter(it => it.channel == channelId)[0]?.streamType].resolution.match(/(\d+)x(\d+)P/);
                const canvas = document.getElementById(coverNo);
                const downloadCanvas = document.getElementById('download-canvas');
                downloadCanvas.width = resolution[1];
                downloadCanvas.height = resolution[2];
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
                    a.download = 'D' + this.shotChannel + ' ' + moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                    const event = new MouseEvent('click');
                    a.dispatchEvent(event);
                }

                // this.downloadFileByBase64(res.data.data)
            })
        },
        // 轮巡
        roundPatrol() {
            this.$refs.round.init()
        },
        /**
         * 获取轮巡数据
         * @param {Object} params 包括params.roundChannel: 轮巡通道数组; params.frameNum: 轮巡画面数; params.long: 轮巡时间间隔;
         */
        getRound(params) {
            this.frameNum = params.frameNum //将轮巡画面数赋到全局，以便退出轮巡时调用(解决退出轮巡作用域变大的问题)
            this.clickDivision({index: params.frameNum})
            this.clickOpen()
            this.isRoundFlag = true
            localStorage.setItem('isRoundFlag',true)
            bus.$emit('channel',null,null,null,params)
            this.afterRefreshTimer= setInterval(() => {
                if (this.page32List.findIndex(item=>item?.chnlId) > -1) {
                    this.turning(params.long)
                    clearInterval(this.afterRefreshTimer)
                }
            }, 500);
        },
        /**
         * 轮巡
         * @param {Number} long 轮巡的时间间隔
         */
        turning(long) {
            this.itemRef = undefined
            this.pageNum = 1
            this.pageNewNum = 1
            this.changePage()
            this.roundTimer = setInterval(() => {
                if (this.pageNewNum < this.pageSize) {
				    this.rightClick()
                } else {
                    this.pageNum = 1
                    this.pageNewNum = 1
					this.changePage() // 重置到第一页后，需重新加载
                }
			}, long * 1000);
        },
        //缩小按钮方法
        zoomMin() {
            let itemRef = this.itemRef
            this.$nextTick(() => {
                if (this.numMin > 1) {
                    this.numMin -= 0.10
                }
                let amplifyElements = '.orgchart' + itemRef.substring(5)
                document.querySelector(amplifyElements).style.transform = `matrix(${this.numMin}, 0, 0,${this.numMin}, 0, 0)`
                let coverElements = '.fgCover' + itemRef.substring(5)
                document.querySelector(coverElements).style.transform = `matrix(${this.numMin}, 0, 0,${this.numMin}, 0, 0)`
                this.maxMarginTop = (this.division_show_index === 1 ? (this.canvasHeight - 1) : (this.division_show_index === 2 || this.division_show_index === 4) ? (this.canvasHeight/2 - 2) :
                                     this.division_show_index === 9 ? (this.canvasHeight/3 - 2): (this.canvasHeight/4 - 2))
                                *(this.numMin-1)/2
                this.maxMarginLeft = (this.division_show_index === 1 ? (this.canvasWidth - 1) : (this.division_show_index === 2 || this.division_show_index === 4) ? (this.canvasWidth/2 - 2) :
                                     this.division_show_index === 9 ? (this.canvasWidth/3 - 2): (this.canvasWidth/4 - 2))
                                *(this.numMin-1)/2

                this.topNum = Math.abs(this.topNum ) < this.maxMarginTop ? this.topNum : this.topNum > 0 ? this.maxMarginTop : (-1 * this.maxMarginTop)
                this.leftNum = Math.abs(this.leftNum ) < this.maxMarginLeft ? this.leftNum : this.leftNum > 0 ? this.maxMarginLeft : (-1 * this.maxMarginLeft)
                this.videoTop = this.topNum
                this.videoLeft = this.leftNum
            })
        },
        //放大按钮方法
        zoomMax() {
            let itemRef = this.itemRef
            this.$nextTick(() => {
                if (this.numMin < 3) {
                    this.numMin += 0.10
                }
                let amplifyElements = '.orgchart' + itemRef.substring(5)
                document.querySelector(amplifyElements).style.transform = `matrix(${this.numMin}, 0, 0,${this.numMin}, 0, 0)`
                let coverElements = '.fgCover' + itemRef.substring(5)
                document.querySelector(coverElements).style.transform = `matrix(${this.numMin}, 0, 0,${this.numMin}, 0, 0)`
                this.maxMarginTop = (this.division_show_index === 1 ? (this.canvasHeight - 1) : (this.division_show_index === 2 || this.division_show_index === 4) ? (this.canvasHeight/2 - 2) :
                                     this.division_show_index === 9 ? (this.canvasHeight/3 - 2): (this.canvasHeight/4 - 2))
                                *(this.numMin-1)/2
                this.maxMarginLeft = (this.division_show_index === 1 ? (this.canvasWidth - 1) : (this.division_show_index === 2 || this.division_show_index === 4) ? (this.canvasWidth/2 - 2) :
                                     this.division_show_index === 9 ? (this.canvasWidth/3 - 2): (this.canvasWidth/4 - 2))
                                *(this.numMin-1)/2
            })
        },
        mousewheel(event) {
            // console.log('---mousewheel',event.wheelDelta/120);
            if (this.magnifierFlag) {
                if (event.wheelDelta<0) {
                    this.zoomMin()
                } else if (event.wheelDelta > 0) {
                    this.zoomMax()
                }
            }
        },
        mousedown(e) {
            this.moveFlag = true
            this.downX = e.offsetX
            this.downY = e.offsetY
        },
        mousemove(e) {
            if (this.moveFlag && this.magnifierFlag) {
                this.topNum = Math.abs(this.topNum + (e.offsetY - this.downY)) < this.maxMarginTop ? (this.topNum + (e.offsetY - this.downY)) : ((this.topNum + (e.offsetY - this.downY)) > 0 ? this.maxMarginTop : (-1 * this.maxMarginTop))
                this.leftNum = Math.abs(this.leftNum + (e.offsetX - this.downX)) < this.maxMarginLeft ? (this.leftNum + (e.offsetX - this.downX)) : ((this.leftNum + (e.offsetX - this.downX)) > 0 ? this.maxMarginLeft : (-1 * this.maxMarginLeft))
                this.videoTop = this.topNum
                this.videoLeft = this.leftNum               
            }
        },
        mouseup(e) {
            this.moveFlag = false
        },
        magnifierClick(type) {
            if (type=="close") {
                if (this.magnifierFlag) {
                    this.numMin = 1.10
                    this.zoomMin()
                    this.videoLeft = 0
                    this.videoTop = 0
                }
                this.magnifierFlag = false
                return
            }

            if (!this.itemRef) {
                this.$message.warning('请选择截图的视频')
                return
            }
            if (!this.page16List[this.itemRef.substring(5)-1].chnlId) {
                this.$message.warning('此处没有视频！')
                return
            }

            this.magnifierFlag = true
        },
        // 开始对讲
        startCall() {
            if (!this.itemRef) {
                this.$message.warning('请选择对讲的视频')
                return
            }
            // 计算折算前原先的位置
            let index = this.division_show_index*(this.pageNewNum-this.pageNum)+Number(this.itemRef.substring(5))-1
            if (!this.page32List[index]?.chnlId) {
                this.$message.warning('此处没有视频！')
                return
            }
            let channelId = this.page32List[index].chnlId
            this.initAudio(channelId);
        },
        // 关闭麦克风
        stopCall() {
            this.intercomFlag = !this.intercomFlag
            if (this.ws) {
                this.ws.close();
                this.record.stop();
                console.log('关闭对讲以及WebSocket');
            }
        },
        initRecord (rec) {//初始化录音
            this.record = rec;
        },
        initAudio (channelId) {//判断浏览是否开启麦克风权限
            const that = this;
            navigator.getUserMedia = navigator.getUserMedia
                || navigator.webkitGetUserMedia
                || navigator.mediaDevices?.getUserMedia;
            if (!navigator.getUserMedia) {
                // chrome://flags/#unsafely-treat-insecure-origin-as-secure
                if (navigator.userAgent.includes("Chrome")) {
                    alert('浏览器不支持音频输入,请前往chrome://flags/#unsafely-treat-insecure-origin-as-secure配置');
                } else if (navigator.userAgent.includes("Firefox")) {
                    alert('浏览器不支持音频输入,请前往about:config配置media.devices.insecure.enabled和media.getusermedia.insecure.enabled打开');
                } else {
                    alert('浏览器不支持音频输入,请前往浏览器设置页配置');
                }
            } else {
                this.intercomFlag = !this.intercomFlag;
                if (navigator.userAgent.includes("Firefox")) {
                    navigator.mediaDevices.getUserMedia({
                        audio: true,
                    }).then(
                        function (mediaStream) {
                            mediaStream.channelId = channelId
                            that.initRecord(new Recorder(mediaStream));
                            console.log('开始对讲');
                            that.useWebSocket(channelId);
                        })
                        .catch(
                            function (error) {
                                console.log(error);
                                switch (error.message || error.name) {
                                    case 'PERMISSION_DENIED':
                                    case 'PermissionDeniedError':
                                        console.info('用户拒绝提供信息。');
                                        break;
                                    case 'NOT_SUPPORTED_ERROR':
                                    case 'NotSupportedError':
                                        console.info('浏览器不支持硬件设备。');
                                        break;
                                    case 'MANDATORY_UNSATISFIED_ERROR':
                                    case 'MandatoryUnsatisfiedError':
                                        console.info('无法发现指定的硬件设备。');
                                        break;
                                    default:
                                        console.info('无法打开麦克风。异常信息:' + (error.code || error.name));
                                        break;
                                }
                            })
                } else {
                    navigator.getUserMedia({
                        audio: true,
                    },
                        function (mediaStream) {
                            mediaStream.channelId = channelId
                            that.initRecord(new Recorder(mediaStream));
                            console.log('开始对讲');
                            that.useWebSocket(channelId);
                        },
                        function (error) {
                            console.log(error);
                            switch (error.message || error.name) {
                                case 'PERMISSION_DENIED':
                                case 'PermissionDeniedError':
                                    console.info('用户拒绝提供信息。');
                                    break;
                                case 'NOT_SUPPORTED_ERROR':
                                case 'NotSupportedError':
                                    console.info('浏览器不支持硬件设备。');
                                    break;
                                case 'MANDATORY_UNSATISFIED_ERROR':
                                case 'MandatoryUnsatisfiedError':
                                    console.info('无法发现指定的硬件设备。');
                                    break;
                                default:
                                    console.info('无法打开麦克风。异常信息:' + (error.code || error.name));
                                    break;
                            }
                        })
                }
                
            }
        },
        useWebSocket (channelId) {//使用webscoket
            const that = this;
            const token = JSON.parse(localStorage.getItem('user')).token
            this.ws = new WebSocket(`ws://${HOST}/api/nvr/preview/channel/${channelId}/audio?Authorization=${token}`);
            this.ws.binaryType = 'arraybuffer'; //传输的是 ArrayBuffer 类型的数据
            this.ws.onopen = function () {
                console.log('握手成功');
                if (that.ws.readyState === 1) { //ws进入连接状态，则每隔500毫秒发送一包数据
                console.log('这里是连接状态');
                that.record.start();
                }
            };
            this.ws.onmessage = function (e) {

            }
            this.ws.onerror = function (err) {
                console.info(err)
            }
        },
        clearMove () {
            clearTimeout(this.timer)
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
        /**
         * 切换页面
         * @param {String} type 左右翻页传入type
         */
        changePage(type) {
            //获取折算后的页码
            this.pageNum = (this.pageNewNum <= Math.ceil(((this.division_show_index == 6 || this.division_show_index == 9 || this.division_show_index == 10) ? this.division_show_index : 16)/this.division_show_index)) ? this.pageNewNum :
						   ((this.division_show_index == 6 || this.division_show_index == 9 || this.division_show_index == 10) ? 1 :
						    ((this.pageNewNum-1)%(Math.ceil(16/this.division_show_index))+1))
            this.sizeChange()
            this.rez()
            // 关闭视频源
            // for(let i=(this.pageNum-1)*this.division_show_index;i<this.pageNum*this.division_show_index;i++){
            for(let i=0;i<16;i++){
                console.log('$$$11',this.page16List[i])
                if(this.page16List[i]?.oriPosition) {
                    let oriPageNum = Math.ceil(this.page16List[i]?.oriPosition/this.division_show_index)
                    if(oriPageNum != this.pageNewNum){
                        console.log('关闭播放视频源',i);
                        this.page16List[i].chnlId = null
                        this.page16List[i].player.stop()
                        this.page16List[i].player.video.currentTime = 0;
                        this.page16List[i].player.video.load();
                    }
                }
            }
            // 打开新的视频源
            for(let i=(this.pageNewNum-1)*this.division_show_index;i<this.pageNewNum*this.division_show_index;i++){
                console.log('$$$22',this.page32List[i],this.page16List[i%16])
                if(this.page32List[i]?.chnlId && !this.page16List[(this.division_show_index == 6 || this.division_show_index == 9 || this.division_show_index == 10) ? i%this.division_show_index : i%16]?.chnlId){
                    console.log('打开新的视频源',i,this.page32List[i].chnlId);
                    console.log('p,channelId,oriPosition---',i);
                    this.playNewUrl(((this.division_show_index == 6 || this.division_show_index == 9 || this.division_show_index == 10) ? i%this.division_show_index : i%16),this.page32List[i]?.chnlId,i+1)
                    getMaskArea(this.page32List[i].chnlId).then(res=>{
                        console.log('this.page16List[i%16]',this.page16List[i%16],'this.page32List[i]',this.page32List[i])
                        this.bgWidth = res.data.data.width
                        this.bgHeight = res.data.data.height
                        this['coverArray' + this.page16List[i%16].ref.substring(5)] = res.data.data.regions
                        this.maskData(i,res.data.data.width,res.data.data.height,this['coverArray' + this.page16List[i%16].ref.substring(5)])
                    })
                }
            }
            if (this.division_show_index === 1) {
                this.itemRef = 'scene' + this.pageNum
                this.page16List.forEach((item,index)=>{
                    if (index+1 == this.pageNum) {
                        this.page16List[index].highlight = true
                        if (this.page16List[index].player) {
                            // this.speedVal = Math.round(this.page16List[index].player.getVolume()*100)
                        }
                    } else {
                        this.page16List[index].highlight = false
                        if (this.page16List[index].player) {
                            // this.page16List[index].player.changeVolume(0);
                        }
                    }
                })
            }
            // 如果是向左翻页或者向右翻页需要重新点击当前页第一个canvas
            if (type) {
                this.clickCanvas(this.page16List.filter(item=>item.chnlId === this.page32List[this.division_show_index * (this.pageNewNum - 1)].chnlId)[0])
            }
        },
        leftClick() {
            console.log('&*&*left',this.pageNum,this.pageNewNum,this.page16List);
            this.magnifierClick('close')
            if(this.pageNewNum>1) {
                this.pageNewNum -= 1
                this.changePage('left')
            }
            if (!this.isRoundFlag) {
                this.circulateCover()
            }
        },
        rightClick(){
            console.log('&*&*right',this.pageNum,this.pageNewNum);
            this.magnifierClick('close')
            if(this.pageNewNum < this.pageSize) {
                this.pageNewNum += 1
                this.changePage('right')
            }
            if (!this.isRoundFlag) {
                this.circulateCover()
            }
        },
        /**
         * 即时回放
         */
        clickTimelyPlayback() {
            if (!this.itemRef) {
                this.$message.warning('请选择即时回放的视频')
                return
            }
            // 关掉原先的预览视频,然后打开即时回放视频
            for (let i = 0; i < this.page16List.length; i++) {
                if (this.page16List[i].ref === this.itemRef) {
                    let calendarParams = {
                        channelList: [this.page16List[i].chnlId.toString()],
                        fileMode: 1,
                        type: 0,
                        timeList: [{
                            start: moment(new Date()).format("YYYY-MM-DD") + " 00:00:00",
                            end: moment(new Date()).format("YYYY-MM-DD") + " 23:59:59"
                        }],
                        withPlaylist: true
                    }
                    // 调日历接口
                    playbackCalendar(calendarParams).then(res => {
                        let greenDateList = []
                        res.data.data.data ? res.data.data.data.forEach(item => {
                            item.playlist[0].timeList.forEach(item2 => {
                                greenDateList.push({
                                    start: item.date + ' ' + item2.start,
                                    end: item.date + ' ' + item2.end,
                                })
                            })
                        }) : null
                        this.greenDateList = greenDateList
                        let startTime = moment(new Date()).subtract(5,'minutes').format("YYYY-MM-DD HH:mm:ss")
                        let endTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
                        if (!this.greenDateList.find(item => Math.max(moment(startTime).valueOf(), moment(item.start).valueOf())
                            <= Math.min(moment(endTime).valueOf(), moment(item.end).valueOf()))) {
                            // 如果没有录像，提示一下
                            this.$message.warning('此时间点没有对应录像回放！')
                        } else {
                            // 否则获取sessionId播放回放视频
                            let params = {
                                id: this.page16List[i].chnlId.toString(),
                                videoParam: {
                                    enable: true,
                                    width: 960,
                                    frameRate: 15,
                                    height: 540,
                                    streamId: "record",
                                    startTime: moment(new Date()).subtract(5,'minutes').format("YYYY-MM-DD HH:mm:ss"),
                                    endTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                                    type: 0
                                },
                                detectParam: {
                                    enable: true,
                                }
                            }
                            const token = JSON.parse(localStorage.getItem('user')).token
                            getSessionId(params).then(res => {
                                this.sessionId = res.data.data
                                bus.$emit('channel',null,null,null,null,null,true)
                                this.page16List[i].player.play(
                                    `ws://${HOST}/api/nvr/record/channel/${params.id}/${this.sessionId}?Authorization=${token}`,
                                    // this.playParams
                                );
                            })
                            if(this.division_show_index !== 1) {
                                this.dbClickCanvas(this.page16List.filter(item=>item.ref === this.itemRef)[0])
                            }
                            this.page16List[i].timely = true
                            this.$forceUpdate()
                            this.page16List[i].player.stop();
                            this.page16List[i].player.video.currentTime = 0;
                            this.page16List[i].player.video.load();
                            this.timelyChannelId = this.page16List[i].chnlId.toString()
                        }
                    })
                }
            }
        },
        changeTimely() {
            let params = {
                streamId: this.sessionId,
                ctrl: this.timelyFlag ? 1 : 0,
                playSpeed: 0,
                playMode: 0,
            }
            ctrlRecordVideo(this.timelyChannelId,params).then(res=> {
                if (res.data.code === 200000) {
                    this.$message.success(this.timelyFlag ? '暂停成功' : '开启成功')
                    this.timelyFlag = !this.timelyFlag
                }
            })
        },
        /**
         * 关闭即时回放
         */
        closeTimely() {
            // 关闭即时回放视频，打开之前的预览视频
            for (let i = 0; i < this.page16List.length; i++) {
                if (this.page16List[i].ref === this.itemRef) {
                    this.page16List[i].timely = false
                    this.page16List[i].player.stop();
                    this.page16List[i].player.video.currentTime = 0;
                    this.page16List[i].player.video.load();
                    const token = JSON.parse(localStorage.getItem('user')).token
                    this.page16List[i].player.play(
                        `ws://${HOST}/api/nvr/preview/channel/${this.page16List[i].chnlId.toString()}/${this.page16List[i].mode}?Authorization=${token}`,
                        // this.playParams
                    );
                    this.sessionId = null
                    bus.$emit('channel')
                    this.dbClickCanvas(this.page16List[i])
                }
            }
        },
        /**
         * 手动录像
         * @param {String} type start or end
         */
        clickManualRecord(type) {
            if (!this.itemRef) {
                this.$message.warning('请选择即时回放的视频')
                return
            }
            // 计算折算前原先的位置
            let index = this.division_show_index*(this.pageNewNum-this.pageNum)+Number(this.itemRef.substring(5))-1
            if (!this.page32List[index]?.chnlId) {
                this.$message.warning('此处没有视频！')
                return
            }
            let channelId = this.page32List[index].chnlId.toString()
            let params = {
                tasks: [{
                    channelId
                }]
            }
            if (type == 'start') {
                manualStart(params).then(res => {
                    if (res.data.code == 200000) {
                        for (let i = 0; i < this.channelList.length; i++) {
                            if (this.channelList[i].channel == channelId) {
                                this.channelList[i].recordStateManual = true
                            }
                        }
                        this.$message.success('开始录制')
                    }
                })
            } else {
                manualEnd(params).then(res => {
                    if (res.data.code == 200000) {
                        for (let i = 0; i < this.channelList.length; i++) {
                            if (this.channelList[i].channel == channelId) {
                                this.channelList[i].recordStateManual = false
                            }
                        }
                        this.$message.success('录制结束')
                    }
                })
            }
            this.manualFlag = !this.manualFlag
        },
        rez() {
            let sum = 0
            for (let i = 0; i < this.page16List.length; i++) {
                if (this.page16List[i].chnlId) {
                    sum += 1
                }
            }
            for (let i = 0; i < this.page16List.length; i++) {
                if (this.page16List[i].chnlId) {
                    let params = {
                        id: this.page16List[i].chnlId.toString(),
                        videoParam: {
                            enable: true,
                            width: ((this.division_show_index === 1 || (this.division_show_index === 2 || this.division_show_index === 4)) &&
                                    Number(this.page16List[i].ref.substring(5))>(this.pageNum - 1) * this.division_show_index &&
                                    Number(this.page16List[i].ref.substring(5)) < this.pageNum * this.division_show_index + 1) ? 1920 : (sum < 9 ? 960 : 640),
                            streamMode: this.mode,
                            frameRate: 15,
                            height: ((this.division_show_index === 1 || (this.division_show_index === 2 || this.division_show_index === 4)) &&
                                     Number(this.page16List[i].ref.substring(5))>(this.pageNum - 1) * this.division_show_index &&
                                     Number(this.page16List[i].ref.substring(5)) < this.pageNum * this.division_show_index + 1) ? 1080 : (sum < 9 ? 540 : 360),
                        },
                        detectParam: {
                            enable: true
                        }
                    }
                    if (!this.isRoundFlag) {
                        // getPreviewConfig(params)
                        getMaskArea(this.page16List[i].chnlId).then(res=>{
                            this.bgWidth = res.data.data.width
                            this.bgHeight = res.data.data.height
                            this['coverArray' + this.page16List[i].ref.substring(5)] = res.data.data.regions
                            this.maskData(i,res.data.data.width,res.data.data.height,this['coverArray' + this.page16List[i].ref.substring(5)])
                        })
                    }
                }
            }
        },

        /**
         * 切换比例
         * @param {Object} item 切换对象 (item.index,item.name)
         * @param {String} type 类型 type==='db'的时候为双击canvas时
         */
        changeScale(item,type) {
            if (this.division_show_index === 1 && item.index !== 1) {
                return
            }
            this.magnifierClick('close')
            this.scale_show_index = item.index
            this.getContentWH()
            if (item.index === 0) {
                // 原比例 1920*1080
                if (1920/1080 >= this.canvasWidth/this.canvasHeight) {
                    this.videoWidth = this.canvasWidth
                    this.videoHeight = 1080*this.canvasWidth/1920
                    this.videoTop = (this.canvasHeight - 1080*this.canvasWidth/1920)/(this.division_show_index === 1 ? 2 : (this.division_show_index === 2 || this.division_show_index === 4) ? 4 : this.division_show_index === 9 ? 6 : 8)
                    this.videoLeft = 0
                } else {
                    this.videoHeight = this.canvasHeight
                    this.videoWidth = 1920*this.canvasHeight/1080
                    this.videoTop = 0
                    this.videoLeft = (this.canvasWidth - 1920*this.canvasHeight/1080)/(this.division_show_index === 1 ? 2 : (this.division_show_index === 2 || this.division_show_index === 4) ? 4 : this.division_show_index === 9 ? 6 : 8)
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
                    this.videoTop = (this.canvasHeight - 3*this.canvasWidth/4)/(this.division_show_index === 1 ? 2 : (this.division_show_index === 2 || this.division_show_index === 4) ? 4 : this.division_show_index === 9 ? 6 : 8)
                    this.videoLeft = 0
                } else {
                    this.videoHeight = this.canvasHeight
                    this.videoWidth = 4*this.canvasHeight/3
                    this.videoTop = 0
                    this.videoLeft = (this.canvasWidth - 4*this.canvasHeight/3)/(this.division_show_index === 1 ? 2 : (this.division_show_index === 2 || this.division_show_index === 4) ? 4 : this.division_show_index === 9 ? 6 : 8)
                }
            } else {
                // 16*9
                if (16/9 >= this.canvasWidth/this.canvasHeight) {
                    this.videoWidth = this.canvasWidth
                    this.videoHeight = 9*this.canvasWidth/16
                    this.videoTop = (this.canvasHeight - 9*this.canvasWidth/16)/(this.division_show_index === 1 ? 2 : (this.division_show_index === 2 || this.division_show_index === 4) ? 4 : this.division_show_index === 9 ? 6 : 8)
                    this.videoLeft = 0
                } else {
                    this.videoHeight = this.canvasHeight
                    this.videoWidth = 16*this.canvasHeight/9
                    this.videoTop = 0
                    this.videoLeft = (this.canvasWidth - 16*this.canvasHeight/9)/(this.division_show_index === 1 ? 2 : (this.division_show_index === 2 || this.division_show_index === 4) ? 4 : this.division_show_index === 9 ? 6 : 8)
                }
            }
            this.sizeChange()
            if (!type) {
                this.rez()
            } else {
                // 循环获取遮盖信息
                this.circulateCover()
            }
            this.$forceUpdate()
        },
        /**
         * 调声音
         */
        changeSpeed() {
            if (this.itemRef) {
                this.arrowFlag = !this.arrowFlag
            } else {
                this.$message.warning('请先选择视频！')
            }
        },
        /**
         * 切换画面
         * @param {Object} item 画面对象 (item.index,item.name)
         * @param {String} type 类型 type==='db'的时候为双击canvas时
         */
        clickDivision(item,type) {
            if (item.index === 1 && this.scale_show_index !== 1) {
                this.changeScale({index: 1,name: "自适应"})
            }
            // 解决右下角遮盖操作按键的问题
            window.addEventListener('beforeunload', this.updateHandler)
            let erd = elementResizeDetectorMaker()
            erd.listenTo(document.getElementById("canvas_form"), element => {
                this.$nextTick(() => {
                    this.canvasWidth = element.offsetWidth
                    this.canvasHeight = element.offsetHeight
                    for (let i = 0; i < this.page16List.length; i++) {
                        const canvas = document.getElementById('coverArray' + (i+1))
                        canvas.width = this.division_show_index === 1 ? (this.canvasWidth - 1) :
								       (this.division_show_index === 2 || this.division_show_index === 4) ? (this.canvasWidth/2 - 2) :
                                       // 6画面每页第一个
                                       (this.division_show_index === 6 && i%6 === 0) ? (this.canvasWidth/3*2 - 2) :
                                       // 6画面非每页第一个 和 9画面
                                       ((this.division_show_index === 6 && i%6 !== 0) || this.division_show_index === 9) ? (this.canvasWidth/3 - 2) :
                                       // 8画面每页第一个
                                       (this.division_show_index === 8 && i%8 === 0) ? (this.canvasWidth/4*3 - 2) :
                                       // 10画面每页第一个和第二个
                                       (this.division_show_index === 10 && (i%10 === 0 || i%10 === 1)) ? (this.canvasWidth/2 - 2) :
                                       // 8画面非每页第一个 and 10画面非每页第一个、第二个 and 16画面
                                       ((this.division_show_index === 8 && i%8 !== 0) || 
                                        (this.division_show_index === 10 && i%10 !== 0 && i%10 !== 1) || 
                                        this.division_show_index === 16) ? (this.canvasWidth/4 - 2) : ''
						canvas.height = this.division_show_index === 1 ? (this.canvasHeight - 1) :
										(this.division_show_index === 2 || this.division_show_index === 4) ? (this.canvasHeight/2 - 2) :
                                        // 6画面每页第一个
                                        (this.division_show_index === 6 && i%6 === 0) ? (this.canvasHeight/3*2 - 2) :
                                        // 6画面非每页第一个 和 9画面
                                        ((this.division_show_index === 6 && i%6 !== 0) || this.division_show_index === 9) ? (this.canvasHeight/3 - 2) :
                                        // 8画面每页第一个
                                        (this.division_show_index === 8 && i%8 === 0) ? (this.canvasHeight/4*3 - 2) :
                                        // 10画面每页第一个和第二个
                                        (this.division_show_index === 10 && (i%10 === 0 || i%10 === 1)) ? (this.canvasHeight/2 - 2) :
                                        // 8画面非每页第一个 and 10画面非每页第一个、第二个 and 16画面
                                        ((this.division_show_index === 8 && i%8 !== 0) || 
                                        (this.division_show_index === 10 && i%10 !== 0 && i%10 !== 1) || 
                                        this.division_show_index === 16) ? (this.canvasHeight/4 - 2) : ''
                    }
                })
            });
            this.division_show_index = item.index
            let sum = 0
            for (let i = this.page32List.length-1; i >= 0; i--){
                if (this.page32List[i]?.chnlId) {
                    sum = i + 1
                    break
                }
            }
            if (sum === 0) {
                this.pageSize = 1
            } else {
                this.pageSize = (sum % this.division_show_index > 0) ? Math.trunc(sum / this.division_show_index + 1) : Math.trunc(sum / this.division_show_index)
            }
            if (item.index === 1 && item.name && this.itemRef) {
                console.log('走了这里1',item.index, item.name, this.itemRef)
                this.pageNum = Number(this.itemRef.substring(5))
                this.pageNewNum = Math.ceil(this.page16List[this.pageNum - 1].oriPosition/this.division_show_index)
                if (this.pageNum > this.pageSize) {
                    this.pageSize = this.pageNum
                }
            } else {
                console.log('走了这里2',item.index, item.name, this.itemRef)
                this.pageNum = 1
                this.pageNewNum = 1
            }
            if (type!=='db') {
                for(let i=(this.pageNum-1)*this.division_show_index;i<this.pageNum*this.division_show_index;i++){
                    console.log('$$$11',this.page16List[i])
                    if(this.page16List[i]?.oriPosition) {
                        let oriPageNum = Math.ceil(this.page16List[i]?.oriPosition/this.division_show_index)
                        if(oriPageNum != this.pageNewNum){
                            this.page16List[i].chnlId = null
                            this.page16List[i].player.stop()
                            this.page16List[i].player.video.currentTime = 0;
                            this.page16List[i].player.video.load();
                        }
                    }
                }
                for(let i=(this.pageNewNum-1)*this.division_show_index;i<this.pageNewNum*this.division_show_index;i++){
                    console.log('$$$22',this.page32List[i],this.page16List[i%16])
                    if(this.page32List[i]?.chnlId && !this.page16List[i%16].chnlId){
                        this.playNewUrl(i%16,this.page32List[i]?.chnlId,i+1)
                    }
                }
            }
            this.changeScale(this.scaleArray.filter(item=>item.index === this.scale_show_index)[0],type)
        },
        getLockLogin() {
            this.isFullFlag = false
            this.$emit('fullFlag',this.isFullFlag,'false')
            this.$message.success('解锁成功！')
            this.putMoreConfig(false)
            setTimeout(() => {
                this.clickDiv()
            }, 500);
        },
        clickCanvas(item) {
            if (this.sessionId) {
                return
            }
            console.log('this.isLock',this.isLock);
            if (this.isLock && !this.isRoundFlag) {
                this.$refs.lockLogin.init()
                return
            }
            this.arrowFlag = false
            for (let i = 0; i < this.page16List.length; i++) {
                if (this.page16List[i].ref === item.ref) {
                    this.page16List[i].highlight = true
                    if (this.page16List[i].player) {
                        // this.speedVal = Math.round(this.page16List[i].player.getVolume()*100)
                    }
                } else {
                    this.page16List[i].highlight = false
                    if (this.page16List[i].player) {
                        // this.page16List[i].player.changeVolume(0);
                    }
                }
            }
            let sum = 0
            for (let i = 0; i < this.page16List.length; i++) {
                if (this.page16List[i].chnlId) {
                    sum += 1
                }
            }
            this.itemRef = item.ref
            if (item.chnlId) {
                for (let i = 0; i < this.channelList.length; i++) {
                    if (this.channelList[i].channel == item.chnlId) {
                        this.manualFlag = this.channelList[i].recordStateManual
                    }
                }
            } else {
                this.manualFlag = false
            }
            console.log('this.page16List[item.ref.substring(5)-1]',item.ref);
            if (this.page16List[item.ref.substring(5)-1].chnlId) {
                console.log('----------------当前点击的视频块有视频1111');
                // 当前点击的视频块有视频
                bus.$emit('channel','',this.page16List[item.ref.substring(5)-1].chnlId,sum)
            } else {
                console.log('++++++++++++++++当前点击的视频块没有视频');
                // 当前点击的视频块没有视频
                bus.$emit('channel',item.ref,null,sum)
            }
            this.$forceUpdate()
        },
        dbClickCanvas(item) {
            if (this.isRoundFlag || this.sessionId) {
                return
            }
            if (!this.page16List[item.ref.substring(5)-1].chnlId) {
                // this.$message.warning('此处没有视频,禁止双击！')
                return
            }
            this.magnifierClick('close')
            this.magnifierFlag = false
            if (item.chnlId) {
                let params = {
                    id: item.chnlId.toString(),
                    videoParam: {
                        enable: true,
                        width: this.division_show_index === 1 ? 
                               ((this.division_prev_index === 1 || this.division_prev_index === 2 || this.division_prev_index === 4) ? 1920 : this.division_prev_index === 9 ? 960 : 640) : 1920,
                        streamMode: this.mode,
                        frameRate: 15,
                        height: this.division_show_index === 1 ? 
                               ((this.division_prev_index === 1 || this.division_prev_index === 2 || this.division_prev_index === 4) ? 1080 : this.division_prev_index === 9 ? 540 : 360) : 1080
                    },
                    detectParam: {
                        enable: true
                    }
                }
                // getPreviewConfig(params)
            }
            if (this.division_show_index === 1) {
                let amplifyElements = '.orgchart' + this.itemRef.substring(5)
                // document.querySelector(amplifyElements).style.transform = `matrix(1, 0, 0, 1, 0, 0)`
                this.clickDivision({index: this.division_prev_index,name: this.division_prev_index + "页面"},'db')
                // this.pageNum = this.division_prev_pagenum
                this.pageNewNum = this.division_prev_pagenewnum
                this.changePage()
            } else {
                this.division_prev_index = this.division_show_index
                this.division_prev_pagenum = this.pageNum
                this.division_prev_pagenewnum = this.pageNewNum
                this.clickDivision({index: 1,name: "单页面"},'db')
                this.pageNum = Number(item.ref.substring(5))
                this.pageNewNum = Math.ceil(this.page16List[this.pageNum - 1].oriPosition)
            }
            this.sizeChange()
        },
        /**
         * 播放超过16路或者9路时那个视频走这个函数
         * @param {Number} p this.page16List的index
         * @param {Number} channelId this.page16List的通道id
         * @param {Number} oriPosition 折算前的格子位置
         */
        playNewUrl(p,channelId,oriPosition) {
            console.log('p,channelId,oriPosition',p,channelId,oriPosition,this.page16List[p]);
            this.page16List[p].chnlId = channelId
            this.page16List[p].oriPosition = oriPosition
            // 重新获取视频名称是否打开
            this.page16List[p].topNameFlag = this.page32List[oriPosition-1] ? this.page32List[oriPosition-1]?.topNameFlag : null
            this.page16List[p].topInfoFlag = this.page32List[oriPosition-1] ? this.page32List[oriPosition-1]?.topInfoFlag : null
            const token = JSON.parse(localStorage.getItem('user')).token
            try {
                if (this.page16List[p].player) {
                    console.log("playUrl1:", p, channelId, this.page16List[p].player)
                    this.playUrlExt(token, p, channelId)
                } else {
                    this.page16List[p].timer = setTimeout(()=>{
                        if (this.page16List[p].player) {
                            console.log("playUrl2:", p, channelId, this.page16List[p].player)
                            this.playUrlExt(token, p, channelId)
                        } else {
                            this.page16List[p].timer = setTimeout(()=>{
                                console.log("playUrl3:", p, channelId, this.page16List[p].player)
                                if (this.page16List[p].player) {
                                    this.playUrlExt(token, p, channelId)
                                } else {
                                    this.page16List[p].timer = setTimeout(()=>{
                                        console.log("playUrl4:", p, channelId, this.page16List[p].player)
                                        this.playUrlExt(token, p, channelId)
                                    }, 2000)
                                }
                            }, 2000)
                        }
                    }, 3000)
                }
            } catch (e) {
                throw new Error("Player 播放失败");
            }
        },
        // 播放视频
        playUrl(channelId,oriPosition) {
            let p = this.itemRef.substring(5)-1
            this.page16List[p].chnlId = channelId
            this.page16List[p].oriPosition = oriPosition
            const token = JSON.parse(localStorage.getItem('user')).token
            try {
                if (this.page16List[p].player) {
                    console.log("playUrl1:", p, channelId, this.page16List[p].player)
                    this.playUrlExt(token, p, channelId)
                } else {
                    this.page16List[p].timer = setTimeout(()=>{
                        if (this.page16List[p].player) {
                            console.log("playUrl2:", p, channelId, this.page16List[p].player)
                            this.playUrlExt(token, p, channelId)
                        } else {
                            this.page16List[p].timer = setTimeout(()=>{
                                console.log("playUrl3:", p, channelId, this.page16List[p].player)
                                if (this.page16List[p].player) {
                                    this.playUrlExt(token, p, channelId)
                                } else {
                                    this.page16List[p].timer = setTimeout(()=>{
                                        console.log("playUrl4:", p, channelId, this.page16List[p].player)
                                        this.playUrlExt(token, p, channelId)
                                    }, 2000)
                                }
                            }, 2000)
                        }
                    }, 3000)
                }
            } catch (e) {
                throw new Error("Player 播放失败");
            }
        },
        playUrlExt(token, p, channelId) {
            // let vcodes = this.channelList.filter(item=>item.channel == channelId)[0]?.streamInfo[this.channelList.filter(item=>item.channel == channelId)[0]?.streamType].vcodes
            // let playParams = vcodes === 'H265' ? this.playParams265 : this.playParams
            this.page16List[p].player.play(
                `ws://${HOST}/api/nvr/preview/channel/${channelId}/${this.page32List[p].mode}?Authorization=${token}`,
                // playParams
            );
            this.sizeChange()
            this.$forceUpdate()
        },
        sizeChange(w, h) {
            let rowNum = this.division_show_index === 1 ? 1 : (this.division_show_index === 2 || this.division_show_index === 4) ? 2 : (this.division_show_index === 6 || this.division_show_index === 9) ? 3 : 4
            let sWidth = this.videoWidth / rowNum
            let sHeight =  this.videoHeight / rowNum
            if (this.division_show_index === 1 || (this.division_show_index === 2 || this.division_show_index === 4) || this.division_show_index === 9 || this.division_show_index === 16) {
                for (let i = 0; i < this.division_show_index; i++) {
                    this.$refs['scene'+((i+(this.pageNum-1)*this.division_show_index)+1)][0].width = sWidth - 4
                    this.$refs['scene'+((i+(this.pageNum-1)*this.division_show_index)+1)][0].height = sHeight - 4
                    this.$refs['scene'+((i+(this.pageNum-1)*this.division_show_index)+1)][0].left = (i % rowNum * sWidth + 1) + 'px'
                    this.$refs['scene'+((i+(this.pageNum-1)*this.division_show_index)+1)][0].top = (i / rowNum * sHeight + 1) + 'px'
                }
            } else if (this.division_show_index === 6) {
                for (let i = 0; i < this.division_show_index; i++) {
                    if (i%6===0) {
                        this.$refs['scene'+((i+(this.pageNum-1)*this.division_show_index)+1)][0].width = sWidth * 2 - 5
                        this.$refs['scene'+((i+(this.pageNum-1)*this.division_show_index)+1)][0].height = sHeight * 2 - 5
                        this.$refs['scene'+((i+(this.pageNum-1)*this.division_show_index)+1)][0].left = (i % rowNum * sWidth + 1) + 'px'
                        this.$refs['scene'+((i+(this.pageNum-1)*this.division_show_index)+1)][0].top = (i / rowNum * sHeight + 1) + 'px'
                    } else {
                        this.$refs['scene'+((i+(this.pageNum-1)*this.division_show_index)+1)][0].width = sWidth - 3
                        this.$refs['scene'+((i+(this.pageNum-1)*this.division_show_index)+1)][0].height = sHeight - 3
                        this.$refs['scene'+((i+(this.pageNum-1)*this.division_show_index)+1)][0].left = (i % rowNum * sWidth + 1) + 'px'
                        this.$refs['scene'+((i+(this.pageNum-1)*this.division_show_index)+1)][0].top = (i / rowNum * sHeight + 1) + 'px'
                    }
                }
            } else if (this.division_show_index === 8) {
                for (let i = 0; i < this.division_show_index; i++) {
                    if (i%8===0) {
                        this.$refs['scene'+((i+(this.pageNum-1)*this.division_show_index)+1)][0].width = sWidth * 3 - 5
                        this.$refs['scene'+((i+(this.pageNum-1)*this.division_show_index)+1)][0].height = sHeight * 3 - 5
                        this.$refs['scene'+((i+(this.pageNum-1)*this.division_show_index)+1)][0].left = (i % rowNum * sWidth + 1) + 'px'
                        this.$refs['scene'+((i+(this.pageNum-1)*this.division_show_index)+1)][0].top = (i / rowNum * sHeight + 1) + 'px'
                    } else {
                        this.$refs['scene'+((i+(this.pageNum-1)*this.division_show_index)+1)][0].width = sWidth - 3
                        this.$refs['scene'+((i+(this.pageNum-1)*this.division_show_index)+1)][0].height = sHeight - 3
                        this.$refs['scene'+((i+(this.pageNum-1)*this.division_show_index)+1)][0].left = (i % rowNum * sWidth + 1) + 'px'
                        this.$refs['scene'+((i+(this.pageNum-1)*this.division_show_index)+1)][0].top = (i / rowNum * sHeight + 1) + 'px'
                    }
                }
            } else if (this.division_show_index === 10) {
                for (let i = 0; i < this.division_show_index; i++) {
                    if (i%10===0 || i%10===1) {
                        this.$refs['scene'+((i+(this.pageNum-1)*this.division_show_index)+1)][0].width = sWidth * 2 - 5
                        this.$refs['scene'+((i+(this.pageNum-1)*this.division_show_index)+1)][0].height = sHeight * 2 - 5
                        this.$refs['scene'+((i+(this.pageNum-1)*this.division_show_index)+1)][0].left = (i % rowNum * sWidth + 1) + 'px'
                        this.$refs['scene'+((i+(this.pageNum-1)*this.division_show_index)+1)][0].top = (i / rowNum * sHeight + 1) + 'px'
                    } else {
                        this.$refs['scene'+((i+(this.pageNum-1)*this.division_show_index)+1)][0].width = sWidth - 3
                        this.$refs['scene'+((i+(this.pageNum-1)*this.division_show_index)+1)][0].height = sHeight - 3
                        this.$refs['scene'+((i+(this.pageNum-1)*this.division_show_index)+1)][0].left = (i % rowNum * sWidth + 1) + 'px'
                        this.$refs['scene'+((i+(this.pageNum-1)*this.division_show_index)+1)][0].top = (i / rowNum * sHeight + 1) + 'px'
                    }
                }
            }
        },
        // 处理遮盖数据
        maskData(index,bgWidth,bgHeight,maskRegions) {
            for (let i = 0; i < maskRegions?.length; i++) {
                // bgWidth:背景图宽度, bgHeight:背景图高度, maskRegions:遮盖区域, this.contentWidth:此时canvas的宽度, this.contentHeight:此时canvas的高度
                let ratioX = bgWidth/this.contentWidth
                let ratioY = bgHeight/this.contentHeight
                if (this.scale_show_index === 1) {
					// 自适应
                    maskRegions[i].forEach(item=>{
                        item.x = item.x/ratioX,
                        item.y = item.y/ratioY
                    })
                } else if (this.scale_show_index === 0 || this.scale_show_index === 3) {
					// 原比例 or 16:9
                    if (16/9 >= this.canvasWidth/this.canvasHeight) {
                        maskRegions[i].forEach(item=>{
                            item.x = item.x/ratioX,
                            item.y = item.y/ratioY * this.contentWidth*9/16/this.contentHeight + ((this.division_show_index === 1 ? (this.canvasHeight - 1) : (this.division_show_index === 2 || this.division_show_index === 4) ? (this.canvasHeight/2 - 2) :
                                (this.division_show_index === 6 || this.division_show_index === 9) ? (this.canvasHeight/3 - 2): (this.canvasHeight/4 - 2))-(this.division_show_index === 1 ? (this.canvasWidth - 1) : (this.division_show_index === 2 || this.division_show_index === 4) ? (this.canvasWidth/2 - 2) :
                                (this.division_show_index === 6 || this.division_show_index === 9) ? (this.canvasWidth/3 - 2): (this.canvasWidth/4 - 2))*9/16)/2
                        })
                    } else {
                        maskRegions[i].forEach(item=>{
                            item.x = item.x/ratioX * this.contentHeight*16/9/this.contentWidth + ((this.division_show_index === 1 ? (this.canvasWidth - 1) : (this.division_show_index === 2 || this.division_show_index === 4) ? (this.canvasWidth/2 - 2) :
                                (this.division_show_index === 6 || this.division_show_index === 9) ? (this.canvasWidth/3 - 2): (this.canvasWidth/4 - 2))-(this.division_show_index === 1 ? (this.canvasHeight - 1) : (this.division_show_index === 2 || this.division_show_index === 4) ? (this.canvasHeight/2 - 2) :
                                (this.division_show_index === 6 || this.division_show_index === 9) ? (this.canvasHeight/3 - 2): (this.canvasHeight/4 - 2))*16/9)/2,
                            item.y = item.y/ratioY
                        })
                    }
                } else if (this.scale_show_index === 2) {
					// 4:3
                    if (4/3 >= this.canvasWidth/this.canvasHeight) {
                        maskRegions[i].forEach(item=>{
                            item.x = item.x/ratioX,
                            item.y = item.y/ratioY * this.contentWidth*3/4/this.contentHeight + ((this.division_show_index === 1 ? (this.canvasHeight - 1) : (this.division_show_index === 2 || this.division_show_index === 4) ? (this.canvasHeight/2 - 2) :
                                (this.division_show_index === 6 || this.division_show_index === 9) ? (this.canvasHeight/3 - 2): (this.canvasHeight/4 - 2))-(this.division_show_index === 1 ? (this.canvasWidth - 1) : (this.division_show_index === 2 || this.division_show_index === 4) ? (this.canvasWidth/2 - 2) :
                                (this.division_show_index === 6 || this.division_show_index === 9) ? (this.canvasWidth/3 - 2): (this.canvasWidth/4 - 2))*3/4)/2
                        })
                    } else {
                        maskRegions[i].forEach(item=>{
                            item.x = item.x/ratioX * this.contentHeight*4/3/this.contentWidth + ((this.division_show_index === 1 ? (this.canvasWidth - 1) : (this.division_show_index === 2 || this.division_show_index === 4) ? (this.canvasWidth/2 - 2) :
                            (this.division_show_index === 6 || this.division_show_index === 9) ? (this.canvasWidth/3 - 2): (this.canvasWidth/4 - 2))-(this.division_show_index === 1 ? (this.canvasHeight - 1) : (this.division_show_index === 2 || this.division_show_index === 4) ? (this.canvasHeight/2 - 2) :
                            (this.division_show_index === 6 || this.division_show_index === 9) ? (this.canvasHeight/3 - 2): (this.canvasHeight/4 - 2))*4/3)/2,
                            item.y = item.y/ratioY
                        })
                    }
                }
                // 处理非标准化格子(6画面第1个、8画面第1个、10画面第1，2个)的遮盖坐标
                if ((this.division_show_index==6 && index%6 == 0) || (this.division_show_index==10 && (index%10 == 0 || index%10 == 1))) {
                    maskRegions[i].forEach(item=>{
                        item.x = item.x*2,
                        item.y = item.y*2
                    })
                } else if (this.division_show_index==8 && index%8 == 0) {
                    maskRegions[i].forEach(item=>{
                        item.x = item.x*3,
                        item.y = item.y*3
                    })
                }
            }
        },
        /**
         * 全屏
         */
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
                    }else{
                        if (this.isRoundFlag) {
                            this.$message.warning('退出轮巡')
                            this.isRoundFlag = false
                            localStorage.setItem('isRoundFlag',false)
                            // 退出轮巡关闭所有正在播放的视频(调用通道列表部分的方法)
                            bus.$emit('channel',null,null,null,null,true)
                            this.pageNum = 1
                            this.pageSize = 1
                            // 解决退出轮巡作用域变大的问题
                            this.clickDivision({index: this.frameNum})
                            this.frameNum = null
                            clearTimeout(this.roundTimer)
                            this.clickDiv()
                        }
                        this.isFullFlag = false
                    }
                    this.$emit('fullFlag',this.isFullFlag)
                }); 
            }
            screenfull.toggle()
        },

    },
}
</script>
<style lang="less" scoped>
.is-fullscreen{
    width: 100%;
    height: 100%;
	position:fixed;
	top:-10px;
	right:0;
	bottom:0;
	left:0;
}
.normal {
    width: 100%;
    height: 100%;
}
.preview {
    display: flex;
    flex-direction: column;
    padding-top: 5px;
    background: #08233F;
;
    .frame {
        width: 100%;
        height: calc(100vh - 140px);
        display: flex;
        // background: blue;
    }
    .frame_full {
        width: 100%;
        height: calc(100vh);
        margin-top: 5px;
        display: flex;
    }
    .operate {
        height: 55px;
        background: linear-gradient(360deg, #014984 0%, #033662 100%);
        box-shadow: inset -4px 4px 10px 0px rgba(17,111,255,0.31);
        border: 1px solid #1A4D91;
        width: 99.8%;
        margin-top: -1px;
        padding-bottom: 4px;
        z-index: 10;
    }
    .name_con {
        width: 100%;
        height: 25px !important;
        position: relative;
        z-index: 2000;
        background: linear-gradient(270deg, rgba(0,81,124,0.2) 0%, #005FB4 100%);  
        font-family: PingFangSC-Semibold, PingFang SC;
        display: flex;
        align-items: center;
        color: #ECFDFF;
        .channel_name {
            padding-left: 10px;
            height: 22px;
            line-height: 22px;
            width: calc(93% - 10px);
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
    .info_con {
        width: 15vw;
        position: relative;
        flex-direction: column;
        z-index: 2000;
        background: rgba(41, 43, 44, 0.584);  
        font-family: PingFangSC-Semibold, PingFang SC;
        display: flex;
        align-items: center;
        color: #ECFDFF;
        .channel-info {
            padding-left: 10px;
            height: 22px;
            line-height: 22px;
            font-size: 13px;
            width: calc(93% - 10px);
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
            margin-bottom: 5px;
        }
    }
}
.box1{
    border: 1px solid #ccc;
    box-sizing: border-box;
    float: left;
}
</style>