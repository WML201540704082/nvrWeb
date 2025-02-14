<template>
    <div class="event-broadcast">
        <div class="filterBox" style="min-width:1040px;">
            <el-col :span="20" style="width:100%;padding: 20px;margin-bottom: 20px;position: relative;">
                <!-- 过滤条件 -->
                <div ref="filterBox" class="mt20" style="width:85%;display: inline-block;">
                    <!-- 普通事件 -->
                    <div class="top_left" clearable>
                        <div class="item-label" style="">普通事件</div>
                        <div class="select-box">
                            <el-checkbox class="select-all" :indeterminate="isCommonIndeterminate" v-model="checkCommonAll"
                                @change="commonAllChange">全选</el-checkbox>
                            <el-checkbox-group v-model="checkedCommonItems" @change="commonItemsChange">
                                <el-checkbox v-for="(item,index) in commonItems" :label="item.value" :key="index">{{item.label}}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                    <!-- 智能事件 -->
                    <div class="top_left" clearable>
                        <div class="item-label">智能事件</div>
                        <div class="select-box">
                            <el-checkbox class="select-all" :indeterminate="isSmartIndeterminate" v-model="checkSmartAll"
                                @change="smartAllChange">全选</el-checkbox>
                            <el-checkbox-group v-model="checkedSmartItems" @change="smartItemsChange">
                                <el-checkbox v-for="(item,index) in smartItems" :label="item.value" :key="index">{{item.label}}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                    <!-- 报警端子 -->
                    <el-col :span="6" :offset="0" class="filterItem" clearable>
                        <el-col :span="6" class="searchTitle">报警端子</el-col>
                        <el-col :span="14" class="flexRowBetween spanBox">
                            <el-select v-model="alarmTerminal" size="mini" @change="onTerminalChange" style="margin-left:10px"
                                :style="{width: (size.contentWidth > 1600 ? 260 : 180) + 'px'}" multiple>
                                <el-option v-for="item in GpioInList" :label="item" :value="item" :key="item"></el-option>
                            </el-select>
                        </el-col>
                    </el-col>
                    <!-- 通道 -->
                    <el-col :span="6" :offset="1" class="filterItem" clearable>
                        <el-col :span="3" class="searchTitle">通道</el-col>
                        <el-col :span="14" class="flexRowBetween spanBox">
                            <el-select v-model="channelIDs" @change="onChannelChange(channelIDs)" size="mini"
                                style="margin-left:10px" :style="{width: (size.contentWidth > 1600 ? 260 : 180) + 'px' }"
                                multiple>
                                <el-option v-for="item in channelData" :key="'channelId' + item.channel" :label="item.chName" :value="item.channel + ''"
                                    class="ellipsis">{{ item.chName }}</el-option>
                            </el-select>
                        </el-col>
                    </el-col>
                    <!-- 时间 -->
                    <el-col :span="10" :offset="1" class="filterItem">
                        <el-col :span="3" class="searchTitle">{{ $t('time') }}</el-col>
                        <div class="flexRowBetween spanBox">
                            <el-button-group>
                                <el-button size="mini" style="padding-left: 7px;padding-right: 7px;"
                                    v-for="(obj, index) of time" :key="index"
                                    :class="{ active: checkedTime === obj.value }" @click="onTimeChange(obj.value)">
                                    {{ $t(obj.label) }}
                                </el-button>
                            </el-button-group>
                            <div v-if="filterAuto" style="display: inline-flex">
                                <el-date-picker v-model="startTime" type="datetime" size="mini" class="ml10"
                                    :style="{ width: (size.contentWidth > 1600 ? 180 : 130) + 'px' }"
                                    :picker-options="pickerOptionsStart"
                                    @change="onStartTimeChange(startTime)"
                                    placeholder="选择开始时间"></el-date-picker>
                                <span style="margin:0 3px;">-</span>
                                <el-date-picker v-model="endTime" type="datetime" size="mini" class="ml10"
                                    :style="{ width: (size.contentWidth > 1600 ? 180 : 130) + 'px' }"
                                    :picker-options="pickerOptionsEnd"
                                    @change="onEndTimeChange(endTime)"
                                    placeholder="选择结束时间"></el-date-picker>
                            </div>
                        </div>
                    </el-col>
                </div>
                <div :span="4" style="display: inline-block;">
                    <button class="button btnItem" @click="clear">
                        <i class="iconfont iconClear">&#xe62f;</i>{{ $t('ClaerConditons') }}
                    </button>
                </div>
            </el-col>
        </div>
        <div class="card-box" :style="{ height: size.contentWidth >= 1600 ? 'calc(100vh - 350px)' : 'calc(100vh - 350px)' }">
            <div v-if="!eventData.length" class="no-data">暂无数据</div>  
            <div class="u-border">
                <!--卡片-->
                <el-row :gutter="10" style="margin-right: 0; margin-left: 0;">
                    <div class="card grid-content" v-for="(event, index) in eventData" :key="index">
                        <div v-if="event.alertType">
                            <div v-if="event.typeValue === 'faceAlert'" class="face-container">
                                <div>
                                    <span class="score" v-if="event.alertType === 1">{{ event.score }}</span>
                                    <span class="score" v-else>未比中</span>
                                    <div class="trapezoid"></div>
                                </div>
                                <div>
                                    <img
                                        class="img-scale-down"
                                        :src="event?.details.data?.faceImagePath"
                                        :onerror="errorFaceImg"
                                    />
                                    <img
                                        :src="(event.alertType === 2 || event.alertType === 5) ? strangerImg : 
                                            ((event?.details.data?.face === null || event?.details.data?.face === undefined) ? strangerImg : 
                                            event?.details.data?.face.imagePath)"
                                        class="img-scale-down"
                                        :onerror="errorFaceImg"
                                    />
                                </div>
                                <div class="card-info">
                                    <div class="card-info-section">
                                        <div class="contentDet ellipsis" style="width:120px">
                                            <i class="iconfont">&#xe63a;</i><span>{{ event.chName || '/'}}</span>
                                        </div>
                                        <div class="type">{{event.alertType === 1 ? '人脸比中告警' : (event.alertType === 2 ? '陌生人告警' : 
                                                            event.alertType === 3 ? '非准入告警' : event.alertType === 4 ? '人脸疑似告警' : '人脸异常告警')}}</div>
                                    </div>
                                    <div class="card-info-section">
                                        <div class="detect-time">
                                            <i class="iconfont">&#xe655;</i>
                                            <span>{{ event.detectTime | format('yyyy-MM-DD HH:mm:ss') }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-option">
                                    <div class="card-option-section">
                                        <div v-if="!isLocal" :class="{'disabled': !(event.linkageVideos && event.linkageVideos.length>0)}" @click="event.linkageVideos && event.linkageVideos.length>0? play(event): null">
                                            <i class="iconfont icon-shipin"></i>
                                            <span>事件视频</span>
                                        </div>
                                        <div class="divider" v-if="!isLocal"></div>
                                        <div @click="viewDetails(eventData, index)">
                                            <i class="iconfont">&#xe628;</i>
                                            <span>查看详情</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="vehicle-container">
                                <div>
                                    <img
                                        :src="event.cropImagePath"
                                        class="img-scale-down"
                                        :onerror="errorVehicleImg"
                                    />
                                    <img
                                        v-if="event.alertType === 1"
                                        :src="event.details.data?.cropImagePath"
                                        class="img-scale-down"
                                        :onerror="errorVehicleImg"
                                    />
                                    <img
                                        v-else-if="event.alertType === 2"
                                        src="@/assets/img/vehicle.png"
                                        class="img-scale-down"
                                    />
                                </div>
                                <div class="card-info">
                                    <div class="card-info-section">
                                        <div class="contentDet ellipsis" style="width:120px">
                                            <i class="iconfont">&#xe63a;</i><span>{{ event.chName || '/'}}</span>
                                        </div>
                                        <div class="type">{{event.alertType === 1 ? '机动车比中告警' : (event.alertType === 2 ? ('机动车' + $t("alarmNotInComparison")) : $t("StrangerWarn"))}}</div>
                                    </div>
                                    <div class="card-info-section">
                                        <div class="detect-time">
                                            <i class="iconfont">&#xe655;</i>
                                            <span>{{ event.detectTime | format('yyyy-MM-DD HH:mm:ss') }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-option">
                                    <div class="card-option-section">
                                        <div v-if="!isLocal" :class="{'disabled': !(event.linkageVideos && event.linkageVideos.length>0)}" @click="event.linkageVideos && event.linkageVideos.length>0? play(event): null">
                                            <i class="iconfont icon-shipin"></i>
                                            <span>事件视频</span>
                                        </div>
                                        <div class="divider" v-if="!isLocal"></div>
                                        <div @click="viewDetails(eventData, index)">
                                            <i class="iconfont">&#xe628;</i>
                                            <span>查看详情</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <div class="card-thumbnail">
                                <img :src="event.sceneImagePath" :onerror="errorImg">
                                <div @click="play(event)" class="mask">
                                    <i class="el-icon-video-play play-button"></i>
                                </div>
                            </div>
                            <div class="card-info">
                                <div class="card-info-section">
                                    <div class="contentDet ellipsis" style="width:120px">
                                        <i class="iconfont">&#xe63a;</i><span>{{ event.chName || '/'}}</span>
                                    </div>
                                    <div class="type">{{ event.type }}</div>
                                </div>
                                <div class="card-info-section">
                                    <div class="detect-time">
                                        <i class="iconfont">&#xe655;</i>
                                        <span>{{ event.detectTime | format('yyyy-MM-DD HH:mm:ss') }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="card-option">
                                <div class="card-option-section">
                                    <div v-if="!isLocal" :class="{'disabled': !(event.linkageVideos && event.linkageVideos.length>0)}" @click="event.linkageVideos && event.linkageVideos.length>0? play(event): null">
                                        <i class="iconfont icon-shipin"></i>
                                        <span>事件视频</span>
                                    </div>
                                    <div class="divider" v-if="!isLocal"></div>
                                    <div @click="viewDetails(eventData, index)">
                                        <i class="iconfont">&#xe628;</i>
                                        <span>查看详情</span>
                                    </div>
                                </div>
                            </div>
                            <!-- <div class="card-footer" :class="{'empty': !(event.linkageVideos && event.linkageVideos.length>0)}">
                                <template>
                                    可观看对应视频回放
                                </template>
                            </div> -->
                        </div>
                    </div>
                </el-row>
            </div>
        </div>
        <!--分页器-->
            <div class="pagination-box" v-show="count > 0"  :style="{ width: size.contentWidth - 144 + 'px' }">
                <el-pagination
                    @current-change="handlePaginationEvent"
                    :current-page="pageNum"
                    :page-size="pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="count"
                    
                ></el-pagination>
            </div>
        <play-video ref="video"></play-video>
        <detail ref="detail"></detail>
    </div>
</template>
<script>
import dgPagination from '@/components/dg-pagination'
import { eventBroadcast, eventMark } from '@/api'
import { channelApi } from '@/api/pass.js'
import { getGpioIn, getChannelList, getChannel, getAlarmInput,getIpgpioIn} from '@/api/systemAPI';
import { filterStatus } from '@/utils'
import playVideo from '@/components/playVideo'
import detail from './detail'
import moment from 'moment'
import { debounce } from "lodash";
export default {
    inject: ["size"],
    name: 'EventBroadcastCardView',
    data() {
        return {
            filterStatus,
            checkCommonAll: true,
            checkedCommonItems: [],
            GpioInList: [],
            channelIDs: [],
            checkedTime: 'all',
            checkedChannelSave: '',
            // chanel/车辆品牌查询
            channelData: [],
            // 按时间查询
            filterAuto: false,
            alarmTerminal: [],
            startTime: '',
            _startTime: '',
            _endTime: '',
            endTime: '',
            time: [{
                label: 'all',
                value: 'all'
            }, {
                label: 'today',
                value: 'today'
            }, {
                label: 'threeDays',
                value: 'threeDays'
            }, {
                label: 'sevenDays',
                value: 'sevenDays'
            }, {
                label: 'auto',
                value: 'auto'
                }],
            pickerOptionsStart: {
                disabledDate: time => {
                    if (this.endTime) {
                        return time.getTime() > new Date(this.endTime).getTime()
                    } else {
                        return time.getTime() > Date.now()
                    }
                }
            },

            pickerOptionsEnd: {
                disabledDate: time => {
                    if (this.startTime && moment(time).isBefore(moment(this.startTime).add(8,'hours'), 'day')) {
                        return true
                    } else {
                        return time.getTime() > Date.now()
                    }
                }
            },
            exceptItems: [{
                label: '硬盘满',
                value: 'diskFull'
            }, {
                label: 'IP冲突',
                value: 'ipConflict'
            }, {
                label: '网线断开',
                value: 'cableDisconnect'
            }, {
                label: 'CPU温度过高',
                value: 'cpuOverheat'
            }, {
                label: '风扇故障',
                value: 'fanFaliure'
            }, {
                label: '磁盘故障',
                value: 'diskFaliure'
            }, {
                label: '非法访问',
                value: 'illegalAccess'
            }],
            commonItems: [{
                label: '报警输入',
                value: 'alarmIn'
            }, {
                label: '移动侦测',
                value: 'event-motion'
            }, {
                label: '视频遮挡',
                value: 'event-tamper'
            }, {
                label: '视频丢失',
                value: 'event-videolose'
            }, {
                label: '异常事件',
                value: 'exception'
            }],
            isCommonIndeterminate: true,

            checkSmartAll: true,
            checkedSmartItems: [],
            smartItems: [{
                label: '人脸比中告警',
                value: 'faceAlert1'
            },{
                label: '陌生人告警',
                value: 'faceAlert2'
            },{
                label: '非准入告警',
                value: 'faceAlert3'
            },{
                label: '人脸疑似告警',
                value: 'faceAlert4'
            },{
                label: '人脸异常告警',
                value: 'faceAlert5'
            },{
                label: '机动车比中告警',
                value: 'vehicleAlert1'
            },{
                label: '机动车未比中告警',
                value: 'vehicleAlert2'
            },{
                label: '进入区域',
                value: 'enterArea'
            },{
                label: '离开区域',
                value: 'leaveArea'
            },{
                label: '越界侦测',
                value: 'outOfBounds'
            },{
                label: '人员徘徊',
                value: 'hover'
            },{
                label: '快速移动',
                value: 'fastMove'
            },{
                label: '遗留物检测',
                value: 'remain'
            },{
                label: '人员倒地',
                value: 'fall'
            },{
                label: '烟雾火灾监测',
                value: 'smogFire'
            },{
            //     label: '人流量监测',
            //     value: 'smogFire'
            // },{
                label: '人员打斗',
                value: 'struggle'
            },{
                label: '摄像头移动',
                value: 'ipcmove'
            },{
                label: '拍屏',
                value: 'shoot'
            },{
                label: '临时离柜',
                value: 'cash'
            },{
                label: '箱包',
                value: 'bag'
            },{
                label: '睡岗',
                value: 'sleep'
            },{
                label: '玩手机',
                value: 'playPhone'
            },{
                label: 'ATM遗留物',
                value: 'atmRemain'
            },{
                label: '吸烟',
                value: 'smoking'
            }],
            isSmartIndeterminate: true,
            eventData: [],
            selectedPersonIds: [],
            count: 0,
            pageSize: 24,
            pageNum: 1,
            errorImg: 'this.src="' + require('@/assets/img/blank.png') + '"',
            strangerImg: require("@/assets/img/stranger.png"),
            errorFaceImg: 'this.src="' + require("@/assets/img/stranger.png") + '"',
            errorVehicleImg: 'this.src="' + require("@/assets/img/vehicle.png") + '"'
        }
    },
    components: {
        playVideo,
        dgPagination,
        detail,
    },
    created() {
        this.isLocal = JSON.parse(localStorage.getItem('isLocal'))
        this.checkedCommonItems = this.commonItems.map(item=>item.value);
        this.isCommonIndeterminate = false;
        this.checkedSmartItems = this.smartItems.map(item=>item.value);
        this.isSmartIndeterminate = false;
        this.allItems = this.commonItems.concat(this.smartItems)
        this.getEventList()
        this.queryGpioIn()
        this.getChannel()
    },
    methods: {
        getEventList: debounce(async function () {
            this.alertType = []
            this._alertType = []
            this.checkedSmartItem = this.checkedSmartItems.map(item => {
                if(item.includes('faceAlert')) {
                    this.alertType.push(Number(item.slice(-1)))
                    return item.slice(0, -1)
                } else if (item.includes('vehicleAlert')) {
                    this._alertType.push(Number(item.slice(-1)))
                    return item.slice(0, -1)
                } else {
                    return item
                }
            })
            this.checkedSmartItem = [...new Set(this.checkedSmartItem)]
            this.eventList = this.checkedCommonItems.concat(this.checkedSmartItem).map(item => {
                if(item == 'faceAlert') {
                    return {
                        event: item,
                        alertTypes: this.alertType
                    }
                } else if (item == 'vehicleAlert') {
                    return {
                        event: item,
                        alertTypes: this._alertType
                    }
                } else {
                    return {
                        event: item
                    }
                }
            })
            let params = {
                events: this.eventList,
                channels: [...this.channelIDs, ...this.alarmTerminal],
                // alertTypes: this.alertType,
                time: this.checkedTime,
                startTime: this._startTime,
                endTime: this._endTime,
                pageSize: this.pageSize,
                pageNum: this.pageNum,
            }
            const { data } = await eventBroadcast(params)
            if (data.code == 200000) {
                this.eventData = data.data.map(item=>{
                    return {
                        ...item,
                        typeValue: item.type,
                        chName: item.channelID ? (this.channelData[item.channelID - 1] ? this.channelData[item.channelID - 1].chName : item.channelID) : "/",
                        type: (item.type == 'diskFull' || item.type == 'ipConflict' || item.type == 'cableDisconnect' || item.type == 'cpuOverheat' || 
                                item.type == 'fanFaliure' || item.type == 'diskFaliure' || item.type == 'illegalAccess') ? 
                                filterStatus(item.type, this.exceptItems) : 
                                (item.type == 'faceAlert' || item.type == 'vehicleAlert') ?
                                filterStatus((item.type + item.alertType), this.allItems) :
                                filterStatus(item.type, this.allItems),
                        detectTime: moment(item.detectTime).add(8, "hours").format('YYYY-MM-DD HH:mm:ss'),
                        videoStartTime: (item.linkageVideos && item.linkageVideos[0]) ? moment(item.linkageVideos[0].start).add(8, "hours").format('YYYY-MM-DD HH:mm:ss') : null,
                        videoEndTime: (item.linkageVideos && item.linkageVideos[0]) ? moment(item.linkageVideos[0].end).add(8, "hours").format('YYYY-MM-DD HH:mm:ss') : null,
                        detailName: (item.type == 'diskFull' || item.type == 'ipConflict' || item.type == 'cableDisconnect' || item.type == 'cpuOverheat' || 
                                item.type == 'fanFaliure' || item.type == 'diskFaliure' || item.type == 'illegalAccess') ?
                                item.details.content : ((item.linkageVideos && item.linkageVideos[0]) ? 
                                                        (moment(item.linkageVideos[0].start).add(8, "hours").format('YYYY-MM-DD HH:mm:ss') + ' -- ' + 
                                                        (moment(item.linkageVideos[0].end).add(8, "hours").format('YYYY-MM-DD HH:mm:ss'))) : null),
                        score: Number(item?.details?.data?.score).toFixed(2) || 0
                    }
                })
                this.count = data.count
            } else {
                this.$message.error(data.message)
            }
        }, 300),
        clear() {
            this.clearFilter();
            this.pageNum = 1;
            this.getEventList()
        },
        // 清除条件
        clearFilter() {
            this.filterAuto = false
            this.brand = []
            this.channelIDs = []
            this.alarmTerminal = []
            this.startTime = ''
            this._startTime = ''
            this.endTime = ''
            this._endTime = ''
            this.vehicleID = ''
            this.checkedSmartItems = []
            this.checkedCommonItems = []
            this.isCommonIndeterminate = false;
            this.isSmartIndeterminate = false;
            this.checkSmartAll = false;
            this.checkCommonAll = false;
        },
        onTimeChange(val) {
            this.checkedTime = val
            let _startTime = '';
            let _endTime = '';
            const time = new Date()
            if (this.checkedTime !== 'auto') {
                this.filterAuto = false
                _startTime = ''
                _endTime = ''
            }
            if (this.checkedTime === 'all') {
                _startTime = ''
                _endTime = ''
            } else if (this.checkedTime === 'today') {
                _startTime = moment(time).subtract(1, 'days').format('YYYY-MM-DD 16:00:00')
                _endTime = moment(time).format('YYYY-MM-DD 16:00:00')
            } else if (this.checkedTime === 'threeDays') {
                // const startTime = new Date(time.getTime() - 10/3*24*60*60*1000)
                _startTime = moment(time).subtract(3, 'days').format('YYYY-MM-DD 16:00:00')
                _endTime = moment(time).format('YYYY-MM-DD 16:00:00')
            } else if (this.checkedTime === 'sevenDays') {
                // const startTime = new Date(time.getTime() - 22/3*24*60*60*1000)
                _startTime = moment(time).subtract(7, 'days').format('YYYY-MM-DD 16:00:00')
                _endTime = moment(time).format('YYYY-MM-DD 16:00:00')
            } else if (this.checkedTime === 'auto') {
                this.filterAuto = !this.filterAuto
                _startTime = ''
                _endTime = ''
                
            } else {
            }
            this._startTime = _startTime;
            this._endTime = _endTime;
            this.pageNum = 1;
            this.getEventList()
        },
        onStartTimeChange(val) {
            if (this.filterAuto) {
                let _startTime = '';
                _startTime = moment(this.startTime).subtract(8, 'hours').format('YYYY-MM-DD HH:mm:ss')
                this._startTime = _startTime;
            }
            this.pageNum = 1;
            this.getEventList()
        },
        onEndTimeChange(val) {
            if (this.filterAuto) {
                let _endTime = '';
                _endTime = moment(this.endTime).subtract(8, 'hours').format('YYYY-MM-DD HH:mm:ss')
                this._endTime = _endTime;
            }
            this.pageNum = 1;
            this.getEventList()
        },
        getChannel() {
            // const params = { pageSize: 99 }
            // channelApi.Get(params)
            //     .then(res => {
            //         this.channelData = res.data.data
            //         this.channelData.forEach(item => {
            //             item._name = item.chConfig.channelType + item.chConfig.channel
            //             item.detectTime = moment(item.detectTime).format('MM-DD HH:mm:ss')
            //         })
            //     })
            getChannelList().then(res => {
                if(res.data.code === 200000) {
                    this.channelData = res.data.data
                    this.channelData.forEach((item,index)=> {
                        let name = !item.chanNameList ? '' : (item.chanNameList.length>0 ? item.chanNameList[0].channelName : '')
                        this.channelData[index] = {...this.channelData[index], chName: ('[' + item.channelType + "" + item.channel + ']' + name)}
                    })
                }
            })
            getChannel().then(res => {
                if (res.data.code === 200000) {
                    res.data.data.unboundList.forEach(item => {
                        this.channelData.push( { chName: '[' + item.name + ']', channel: item.id })
                    })
                    this.channelData = this.channelData.sort((a,b) => a.channel - b.channel)
                }
            })
        },
        // 获取输入端子列表
        queryGpioIn() {
            getGpioIn().then(res => {
                let arr1 = []
                if (res.data.code == 200000) {
                    arr1 = res.data.data
                }
                this.GpioInList = [...arr1,]
            })
        },
        // 报警端子change
        onTerminalChange(e) {
            this.alarmTerminal = e
            this.pageNum = 1;
            this.getEventList()
        },
        onChannelChange(channelID) {
            this.channelIDs = channelID
            this.pageNum = 1;
            this.getEventList()
        },
        // 分页
        handlePaginationEvent(val) {
            this.pageNum = val
            this.getEventList()
        },
        commonAllChange(val) {
            this.checkedCommonItems = val ? this.commonItems.map(item=>item.value) : [];
            this.isCommonIndeterminate = false;
            this.pageNum = 1;
            this.getEventList()
        },
        commonItemsChange(value) {
            let checkedCount = value.length;
            this.checkCommonAll = checkedCount === this.commonItems.length;
            this.isCommonIndeterminate = checkedCount > 0 && checkedCount < this.commonItems.length;
            this.pageNum = 1;
            this.getEventList()
        },
        smartAllChange(val) {
            this.checkedSmartItems = val ? this.smartItems.map(item=>item.value) : [];
            this.isSmartIndeterminate = false;
            this.pageNum = 1;
            this.getEventList()
        },
        smartItemsChange(value) {
            let checkedCount = value.length;
            this.checkSmartAll = checkedCount === this.smartItems.length;
            this.isSmartIndeterminate = checkedCount > 0 && checkedCount < this.smartItems.length;
            this.pageNum = 1;
            this.getEventList()
        },
        // 标记
        async signRed(id,mark) {
            const { data } = await eventMark(id)
            if (data.code == 200000) {
                this.$message.success(!mark ? '标记成功' : '取消标记成功')
                this.getEventList()
            } else {
                this.$message.error(data.message)
            }
        },
        play(row) {
            this.$nextTick(()=>{
                this.$refs['video'].init(row)
            })
        },
        viewDetails(details,index) {
            this.$nextTick(()=>{
                this.$refs['detail'].init(details,index)
            })
        }
    }
}
</script>
<style lang="less" scoped>
.event-broadcast {
    margin: -20px -20px 0px -20px;
    background: rgb(235, 238, 242);
    height: calc(100vh - 160px);
    .select-box {
        display: flex;
        width: calc(100% - 90px);
        .el-checkbox {
            width: 108px;
        }
    }
    .select-all {
        margin-right: 30px;
        &.el-checkbox {
            width: 50px;
        }
    }
    .img-scale-down {
        width: 100px;
        height: 100px;
        margin: 5px;
    }
    .alert-type {

        height:12px;
        line-height:12px;
    }
}
.top_left {
    display: flex;
    flex-direction: row;
    padding-bottom: 10px;
    color: #000;
    .item-label, .sub-item-label {
        text-align: left;
        vertical-align: middle;
        font-size: 14px;
        padding: 0 20px 0 0;
        box-sizing: border-box;
        display: inline-block;
        line-height: 19px;
        color: #606266;
        font-weight: normal;
        width: 100px;
    }
}

.grid-content {
    // border-radius: 4px;
    box-shadow: 0px 0px 8px 0px rgb(58 116 255 / 40%);
    min-height: 36px;
    margin: 5px 0;
}
.trapezoid {
    position: absolute;
    z-index: 1;
    width: 76px;
    border: 22px solid transparent;
    border-bottom-color: red;
    margin: 61px 0 0 50px;
}
.score {
    position: absolute;
    z-index: 2;
    height: 20px;
    margin: 84px 0 0 90px;
    color: white;
    font-family: medium;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
}
.no-data {
    color: #909399;
    font-size: 14px;
    text-align: center;
    width: 100%;
    height: 200px;
    line-height: 200px;
}
.filter-box {
    min-width: 850px;
    background: white;
    margin-top: 15px;
    padding-left: 20px;
    margin-bottom: 15px;
}
.filterBox {
    scrollbar-width: none;
    color: #000;
    .el-col {
      background: white;
    }
  }

  // 过滤查询
  .searchTitle {
    height: 30px;
    font-size: 14px;
    font-weight: 400;
    color: #909399;
    line-height: 30px;
  }

.card-box {
    overflow-y: scroll;
    overflow-x: initial;
    min-width: 700px;
    padding-left: 15px;
    padding-top: 15px;
    padding-bottom: 0;
    background: white;
}
.pagination-box {
    text-align: center;
    position: fixed;
    bottom: 0;
    height: 50px;
    background: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
.filterItem {
    height: 30px;
    white-space: nowrap;
    margin-bottom: 10px
  }
#systemBox .event-broadcast .filterBox {
    /deep/.el-select__tags {
        white-space: nowrap !important;
        overflow: hidden !important;
        flex-wrap: unset !important;
    }
}
.button {
  width: 96px;
  height: 28px;
  cursor: pointer;
  color: white;
  border: none;
  background: #2178C8;
  border-radius: 2px;
  margin-right: 20px;
}
.button i {
  padding-right: 5px;
}
.iconClear {
    font-size: 12px;
    margin-right: 4px;
    height: 11px;
}
.btnItem {
    position: absolute;
    top: 20px;
    right: 12px;
    cursor: pointer;
    background: transparent;
    border: 1px solid #409eff;
    color: #409eff;
    width: 90px;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
  }

  .btnItem:hover {
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
  }
.card {
    background-color: #FFFFFF;
    overflow: hidden;
    width: 220px;
    float: left;
    min-height: 187px;
    margin: 4px 8px 9px 3px;
    border: 2px solid transparent;
    color: initial;

    &:hover {
        border: 2px solid #3a74ff;
    }
    .card-thumbnail {
        background-color: #FFFFFF;
        display: flex;
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 56%;
        img {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            object-fit: cover;
        }
        .mask {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            background: rgba( 0, 0, 0, .4) no-repeat center;
            display: none;
            .play-button{
                font-size: 3rem;
                color: #bcbcbc;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
            }
        }

        &.playable {
            cursor: pointer;
            &:hover .mask{
                display: block;
            }
        }
    }
    .card-info, .card-option {
        padding: 0.5rem;
    }
    .card-option {
        height: 42px;
        // padding: 0 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .card-option {
        display: none;
    }
    .card-info-section, .card-option-section {
        display: flex;
        justify-content: space-between;
        white-space: nowrap;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: grey;
        line-height: 17px;
        div {
            align-self: center;
        }

        i.iconfont {
            font-size: 14px;
        }

        span {
            margin-left: 4px;
        }

        .detect-time {
            width: auto;
        }

        .type {
            color: #f56c6c;
            background: #fef0f0;
            padding: 4px;
        }
    }
    .card-option-section {
        div:hover {
            cursor: pointer;
            color: #3a74ff;
        }
        div.disabled:hover {
            cursor: not-allowed;
            color: currentColor;
        }
        div.divider {
            border-right: 1px solid rgb(219, 220, 231);
            margin: 0 10px;
            height: 16px;
        }
    }
    &:hover {
        .card-info {
            display: none;
        }
        .card-option {
            display: flex;
        }
    }
    .card-footer {
        background-color: #AAD3F5;
        color: #519048;
        font-size: 12px;
        padding: 4px 0;
        font-weight: bold;
        height: 18px;
        text-align: center;
        &.empty {
            background-color: transparent;
            visibility: hidden;
        }
    }
}
</style>