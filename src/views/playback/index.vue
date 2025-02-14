<template>
    <div class="layout">
        <div class="channel" v-if="!labelListVisible">
            <div class="title">
                <span style="color: rgb(255, 255, 255); font-size: 18px;">设备通道</span>
            </div>
            <div v-if="!this.$store.getters.getSyncPlayMode" class="overflowChannel">
                <div v-for="(item,index) of channelList" :key="index">
                    <div class="channel_item"
                        :style="{'color': item.color ? '#1890FF' : 'rgb(255, 255, 255)', 
                            'background-color': item.color ? '#033E70' : ''}" 
                        @click="clickChannelItem(item.channel,item)">
                        <tooltip-over
                            :content="(item.channelType + item.channel + (!item.chanNameList ? '' : (item.chanNameList.length>0 ? ('-' + item.chanNameList[0].channelName) : '')))"
                            class="channel_name"
                            refName="channelName"
                        ></tooltip-over>
                    </div>
                </div>
            </div>
            <div v-if="this.$store.getters.getSyncPlayMode" class="overflowChannel">
                <el-checkbox-group 
                    :max="4"
                    v-model="checkedSyncChannels">
                    <el-checkbox class="channel_item" 
                        v-for="(item,index) of channelList" 
                        :label="item"
                        :disabled="($store.getters.getSyncPlayMode && disableSearchButton)"
                        @change="e => handleCheckedChannelsChange(item, e)"
                        :style="{'color': item.color ? '#1890FF' : 'rgb(255, 255, 255)', 
                                                                    'background-color': item.color ? '#033E70' : ''}"
                        :key="index">
                        <tooltip-over
                            :content="(item.channelType + item.channel + (!item.chanNameList ? '' : (item.chanNameList.length>0 ? item.chanNameList[0].channelName : '')))"
                            class="channel_name" refName="channelName">
                        </tooltip-over>
                    </el-checkbox>
                </el-checkbox-group>
            </div>
        </div>
        <div class="channel" v-else>
            <div class="label">
                <div class="title">
                    <span class="title-name">标签回放</span>
                    <span class="title-icon" @click="leaveLabelList">
                        <svg-icon icon="leave"></svg-icon>
                    </span>
                </div>
                <div class="label-main">
                    <div class="filter">
                        <div class="channel-select">
                            <span class="select-name">通道</span>
                            <el-select v-model="channelSelect" clearable size="mini" placeholder="请选择通道">
                                <el-option 
                                    v-for="item in channelList" 
                                    :key="item.channel" 
                                    :label="(item.channelType + item.channel)" 
                                    :value="item.channel">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="label-select">
                            <span class="select-name">标签</span>
                            <el-input v-model="labelSearch" clearable size="mini" placeholder="请输入标签名"/>
                        </div>
                        <div class="time-select">
                            <span class="select-name">时间</span>
                            <el-date-picker v-model="labelStartTime" type="datetime" size="mini" class="label-date-input"
                                :picker-options="pickerOptionsStart"
                                @change="onStartTimeChange(labelStartTime)"
                                placeholder="选择开始时间"></el-date-picker>
                            <el-date-picker v-model="labelEndTime" type="datetime" size="mini" class="label-date-input label-date-input-second"
                                :picker-options="pickerOptionsEnd"
                                @change="onEndTimeChange(labelEndTime)"
                                placeholder="选择结束时间"></el-date-picker>
                        </div>
                    </div>
                    <div class="label-list">
                        <div v-for="(item,index) of tagList" :key="index">
                            <div class="label-item"
                                :class="{active: index == selectedLabelIndex}"
                                @click="clickLabelItem(index, item)">
                                <tooltip-over
                                    :content="(item.labelName)"
                                    class="label-name"
                                    refName="labelName"
                                ></tooltip-over>
                                <div class="buttons-con">
                                    <span @click="showEditDialog(item)">
                                        <svg-icon class="button-icon" icon="edit_black"></svg-icon>
                                    </span>
                                    <span @click.stop="deleteLabel(item.id)">
                                        <svg-icon class="button-icon" icon="delete_black"></svg-icon>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog
            title="修改标签名"
            :visible.sync="editLabelVisible"
            width="380px"
            :append-to-body="true" 
            :close-on-click-modal="false">
            <el-form :model="labelForm" :rules="labelFormRule" ref="data-form" label-width="80px">
                <el-form-item label="标签名" prop="label">
                    <el-input size="mini" style="width: 70%;" v-model="labelForm.label"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" type="primary" @click="editLabel()">确 定</el-button>
            </span>
        </el-dialog>
        <div class="playback">
            <div class="video">
                <playback-page ref="playback" @refResetCalendar="getResetCalendar" @refBackRun="getBackRun" @refChannelName="getChannelName" @refTimestamp="getTimestamp" @fullFlag="getFullFlag" @refChannelId="getChannelId" 
                @refUpdateTimeline="updateTimeLine" @refDisableSearchButton="onDisableSearchButton" 
                @refSwitchTime="getSwitchTime" @refSessionId="getNewSessionId" :screenWidth="size.contentWidth" :userDataFlag="userDataFlag"></playback-page>
            </div>
            <div class="timeline-stage" v-show="!isFullFlag">
                <div class="timeline-stage-top" :style="{marginLeft: size.contentWidth < 1260 ? '560px' : ''}">
                    <div class="stage-top-left" v-if="channelName" :style="{width: size.contentWidth > 1440 ? `calc(50vw - 470px)` : 260 + 'px'}">
                        <tooltip-over
                            :content="(isLabel ? '标签名称：' : '通道名称：') + channelName"
                            class="channel_name"
                            refName="channelName"
                        ></tooltip-over>
                    </div>
                    <span class="play-time">
                        <span class="time_title">时间轴调节</span>
                        <div class="time_but" @click="changeMinus">
                            <i class="el-icon-minus"></i>
                        </div>
                        <span class="time_res">{{timeAxis}}</span>
                        <div class="time_but" @click="changePlus">
                            <i class="el-icon-plus"></i>
                        </div>
                    </span>
                </div>
                <time-line ref="time_line" :isDraggable="isDraggable" :greenDateList="greenDateList" :isBackRun="isBackRun" :isSwitching="isSwitching" :timestampInit="timestampInit" :timestamp="timestamp" :widthAxis="widthAxis" :videoRef="videoRef" @refSwitchTime="getSwitchTime" 
                @refChangeFlag="getChangeFlag"></time-line>
            </div>
        </div>
        <div class="file" v-show="!isFullFlag">
            <div class="file_title">
                <span style="color: rgb(255, 255, 255); font-size: 18px;">文件检索</span>
            </div>
            <div class="left-wrap">
                <div class="calendar-wrap">
                    <el-calendar :first-day-of-week=7 v-model="calendar" style="background: #003A6B;" :disabled-date="disabledDate">
                        <div
                            slot="dateCell"
                            slot-scope="{ data }"
                            @click="clickCalendar(data)">
                            <p>{{ data.day.split('-').slice(2).join('-') }}<br/></p>
                            <!--标记-->
                            <div v-if="greenDay.find(item=>item===data.day)" class="green budge"></div>
                        </div>
                    </el-calendar>
                </div>
            </div>
            <div class="search_download">
                <!-- <div>
                    <div class="download_title">开始时间</div>
                        <el-time-picker
                            :disabled="labelListVisible"
                            :editable="false"
                            v-model="startTime"
                            style="flex: 1; margin: 10px;"
                            size="mini"
                            placeholder="开始时间">
                        </el-time-picker>
                </div>
                <div>
                    <div class="download_title">结束时间</div>
                        <el-time-picker
                            :disabled="labelListVisible"
                            :editable="false"
                            style="flex: 1; margin: 10px;"
                            v-model="endTime"
                            size="mini"
                            placeholder="结束时间">
                        </el-time-picker>
                </div> -->
                <div>
                    <div class="download_title">文件性质</div>
                    <el-select v-model="fileType" placeholder="请选择" size="mini" @change="changeFileType" style="flex: 1; margin: 10px;" :disabled="labelListVisible">
                        <el-option
                            v-for="item in fileTypeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div>
                    <el-button :disabled="($store.getters.getSyncPlayMode && (disableSearchButton || checkedSyncChannels.length < 2)) || labelListVisible" size="small" class="search_button" icon="el-icon-search" @click="retrieval()">检索</el-button>
                </div>
            </div>
        </div>
        <lock-list ref="lockList"></lock-list>
    </div>
</template>
<script>
import playbackPage from './components/playback.vue'
import { getRecordChannelList,playbackCalendar,getSessionId,ctrlRecordVideo, tagList, deleteTag, tagConfig, editTag } from '@/api';
import moment from "moment";
import { inRange, min, max } from "lodash";
import timeLine from '@/components/timeLine';
import tooltipOver from "@/components/tooltipOver"
import lockList from './components/lockList.vue';
import { timer } from "@/utils";
import axios from 'axios';
export default {
    name: 'layoutIndex',
    components: {
        playbackPage,
        timeLine,
        tooltipOver,
        lockList,
    },
    inject: ["size"],
    data() {
        return {
            selectedList: [],
            CONTROL: {
                PLAY_0: 0,
                PAUSE_1: 1,
                SEEK_2: 2,
                SPEED_3: 3,
                SINGLE_4: 4,
                BACK_5: 5,
            },
            size: {
				contentWidth: window.innerWidth,
				contentHeight: window.innerHeight
			},
            videoFlag: false,
            isFullFlag: false,
            isLabel: false,
            editLabelVisible: false,
            search:'video',
            file: 'device',
            channelList: [],
            channelSelect: '',
            checkedSyncChannels: [],
            labelSearch: '',
            input: null,
            activeName: 'first',
            calendar: new Date(),
            startTime: new Date(2022, 8, 11, 0, 0, 0),
            endTime: new Date(2022, 8, 11, 23, 59, 59),
            labelStartTime: '',
            labelEndTime: '',
            fileType: 0, // 默认定时
            fileTypeList: [{
                value: 0,
                label: '定时'
            },{
                value: 1,
                label: '报警'
            },{
                value: 2,
                label: '手动'
            },{
                value: 3,
                label: '锁定'
            },{
                value: 4,
                label: '标签回放'
            }],
            recyclingMethod: 0,
            recyclingMethodList:[{
                value: 0,
                label: '主码流播放'
            },{
                value: 1,
                label: '子码流播放'
            },{
                value: 2,
                label: '转码播放'
            }],
            greenDay:[],
            greenDateList: [],
            syncGreenDateListArray: [],
            timestampInit: {start_timestamp: new Date(new Date().setHours(0, 0, 0, 0) - 9 * 60 * 60 * 1000).getTime(), ts: new Date(new Date().setHours(0, 0, 0, 0) - 9 * 60 * 60 * 1000).getTime()},
            timestamp: new Date(new Date().setHours(0, 0, 0, 0) - 9 * 60 * 60 * 1000).getTime(),
            isSwitching: false,
            isBackRun: false,
            channelName: null,
            timeAxis: '24h',
            widthAxis: 24,
            timeAxisIndex: 5,
            timeAxisList: [{
                index: 0,
                name: '1min',
                time: 0.0166666667
            },{
                index: 1,
                name: '10min',
                time: 0.1666666667
            },{
                index: 2,
                name: '30min',
                time: 0.5
            },{
                index: 3,
                name: '1h',
                time: 1
            },{
                index: 4,
                name: '6h',
                time: 6
            },{
                index: 5,
                name: '12h',
                time: 12
            },{
                index: 6,
                name: '24h',
                time: 24
            }],
            minusFlag: true,
            plusFlag: true,
            userDataFlag: true,
            screenWidth: null,
            labelListVisible: false,//是否显示标签列表
            tagList: [],
            selectedLabelIndex: -1,
            disableSearchButton: false,
            videoRef: null,
            labelForm: {
                label: ''
            },
            labelFormRule: {
                label: [{ required: true, message: '请输入标签名', trigger: 'blur' },
                        { min: 1, max: 14, message: '长度在 1 到 14 个字符', trigger: 'blur' }]
            },
            isDraggable: false,//timeLine是否可以拖动
            pickerOptionsStart: {
                disabledDate: time => {
                    if (this.labelEndTime) {
                        return time.getTime() > new Date(this.labelEndTime).getTime()
                    }
                }
            },
            pickerOptionsEnd: {
                disabledDate: time => {
                    if (this.labelStartTime) {
                        return time.getTime() < new Date(this.labelStartTime).getTime()
                    }
                }
            },
        }
    },
    created() {
        this.$nextTick(() => {
            // 点击上个月
            let prevBtn = document.querySelector('.el-calendar__button-group .el-button-group>button:nth-child(1)');
            prevBtn.innerText = '<'
            prevBtn.addEventListener('click', () => {
                this.otherMonth('last')
            })
            // 点击下个月
            let nextBtn = document.querySelector('.el-calendar__button-group .el-button-group>button:nth-child(3)');
            nextBtn.innerText = '>'
            nextBtn.addEventListener('click', () => {
                this.otherMonth('next')
            })
        })
        this.getRecordChannelList()
    },
    watch: {
        channelSelect(val) {
            let params = {
                channel: val.toString(),
                label: this.labelSearch,
                beginTime: this.selectBeginTime,
                endTime: this.selectEndTime
            }
            this.getTagList(params)
        },
        labelSearch(val) {
            let params = {
                channel: this.channelSelect.toString(),
                label: val.toString().replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\"/g, '\\"').replace(/\*/g, "\\*").replace(/\%/g, '\\%').replace(/\_/g, "\\_"),
                beginTime: this.selectBeginTime,
                endTime: this.selectEndTime
            }
            this.getTagList(params)
        },
        '$store.state.syncPlayMode'(val) {
            this.greenDateList = []
            if (val) {
                this.fileType = 0
                this.fileTypeList = this.fileTypeList.filter(type => type.value == 0)
            } else {
                if (this.fileTypeList.findIndex(type => type.value === 4) === -1) {
                    this.fileTypeList.push({
                        value: 1,
                        label: '报警'
                    },{
                        value: 2,
                        label: '手动'
                    },{
                        value: 3,
                        label: '锁定'
                    },{
                        value: 4,
                        label: '标签回放'
                    })
                }
            }
        }
    },
    methods: {
        disabledDate(date) {
            return date < new Date();
        },
        /**
         * 获取录像回放应展示的channelList
         */
        getRecordChannelList() {
            getRecordChannelList().then((res) => {
                if (res.data.code === 200000) {
                    this.channelList = res.data.data.map(item => {
                        let channelName = item.channelType + item.channel + (!item.chanNameList ? '' : (item.chanNameList.length>0 ? item.chanNameList[0].channelName : ''))
                        return {
                            ...item,
                            channelName
                        }
                    }) || []
                }
            });
        },
        handleCheckedChannelsChange(item, selected) {
            if (selected) {
                this.selectedList.push(item.channel)
            } else {
                this.selectedList = this.selectedList.filter(item1=>item1 != item.channel)
            }
            this.clickChannelItem(item.channel,item,false,this.selectedList.map(it=>it.toString()))
        },
        /**
         * 切换通道，获取日历
         * @param {*} channelId 
         * @param {*} item 
         * @param {Boolean} type 是否是切换月份，如果是，不需要改变选择的通道的底色
         * @param {Array} selectedList 同步模式下勾选的通道
         */
        clickChannelItem(channelId,item,type,selectedList) {
            this.channelIdOld = channelId
            this.leftChannelNameOld = item.channelType + item.channel + (!item.chanNameList ? '' : (item.chanNameList.length>0 ? item.chanNameList[0].channelName : ''))
            this.channelList.forEach((item,index)=>{
                if (item.channel==channelId) {
                    if (!type) {
                        this.channelList[index].color = !this.channelList[index].color
                    }
                    if (selectedList) {
                        this.getGreenDay(selectedList,true)
                    } else {
                        this.getGreenDay(channelId)
                    }
                } else {
                    this.channelList[index].color = false
                }
            })
            this.$forceUpdate()
        },
        /**
         * 获取日历中的绿点
         * @param {*} channelId 
         * @param {Boole} model 是否是同步模式
         */
        getGreenDay(channelId,model) {
            let monthDay = moment(moment(this.calendar).format("YYYY-MM"), "YYYY-MM").daysInMonth()
            let leftMonthDay = moment(moment(this.calendar).subtract(1,'months').format("YYYY-MM"), "YYYY-MM").daysInMonth()
            let timeList = []
            for (let i = leftMonthDay-5; i <= leftMonthDay; i++) {
                timeList.push({
                    start: moment(this.calendar).subtract(1,'months').format("YYYY-MM") + '-' + (i<10 ? ('0' + i) : i) + " 00:00:00",
                    end: moment(this.calendar).subtract(1,'months').format("YYYY-MM") + '-' + (i<10 ? ('0' + i) : i) + " 23:59:59"
                })
            }
            for (let i = 1; i <= monthDay; i++) {
                timeList.push({
                    start: moment(this.calendar).format("YYYY-MM") + '-' + (i<10 ? ('0' + i) : i) + " 00:00:00",
                    end: moment(this.calendar).format("YYYY-MM") + '-' + (i<10 ? ('0' + i) : i) + " 23:59:59"
                })
            }
            if (moment(this.calendar).format("YYYY-MM") < moment(new Date()).format("YYYY-MM")) {
                for (let i = 1; i <= 11; i++) {
                    timeList.push({
                        start: moment(this.calendar).add(1,'months').format("YYYY-MM") + '-' + (i<10 ? ('0' + i) : i) + " 00:00:00",
                        end: moment(this.calendar).add(1,'months').format("YYYY-MM") + '-' + (i<10 ? ('0' + i) : i) + " 23:59:59"
                    })
                }
            }
            let params = {
                channelList: model ? channelId : [channelId.toString()],
                fileMode: 1,
                type: this.fileType,
                timeList,
                withPlaylist: false
            }
            // 调接口
            playbackCalendar(params).then(res => { 
                let greenDay = []
                res.data.data.data ? res.data.data.data.forEach(item=>{
                    greenDay.push(item.date)
                }) : []
                if (model && channelId.length > 1) {
                    const findAppearances = (arr, num) => {
                        let count = 0;
                        for(let i = 0; i < arr.length; i++){
                            const el = arr[i];
                            if(num !== el){
                                continue;
                            };
                            count++;
                        };
                        return count;
                    };
                    const pickAppearingTwice = (arr = []) => {
                        const res = [];
                        for(let i = 0; i < arr.length; i++){
                            const el = arr[i];
                            if(findAppearances(arr, el) === channelId.length && !res.includes(el)){
                                res.push(el);
                            };
                        };
                        return res;
                    };
                    this.greenDay = pickAppearingTwice(greenDay)
                } else {
                    this.greenDay = greenDay
                }
            })
        },
        /**
         * 切换文件类型
         */
        changeFileType() {
            this.getGreenDay(this.channelIdOld)
        },
        handleClick(tab, event) {
            console.log(tab, event);
        },
        /**
         * 
         * @param {Object} data 包括 {day,isSelected,type}
         */
        clickCalendar(data) {
            event.stopPropagation()
            this.calendar = new Date(data.day)
            if (data.type=='prev-month') {
                this.otherMonth()
            }
        },
        onStartTimeChange(val) {
            this.selectBeginTime = this.labelStartTime ? moment(this.labelStartTime).format("YYYY-MM-DD HH:mm:ss") : ''
            let params = {
                channel: this.channelSelect.toString(),
                label: this.labelSearch,
                beginTime: this.selectBeginTime,
                endTime: null
            }
            this.getTagList(params)
        },
        onEndTimeChange(val) {
            this.selectEndTime = this.labelEndTime ? moment(this.labelEndTime).format("YYYY-MM-DD HH:mm:ss") : ''
            let params = {
                channel: this.channelSelect.toString(),
                label: this.labelSearch,
                beginTime: this.selectBeginTime,
                endTime: this.selectEndTime
            }
            this.getTagList(params)
        },
		/**
		 * 点击标签中的某条数据
		 * @param {Number} index 数据所在tagList中的位置
		 * @param {Object} item tagList中的某个对象
		 */
        clickLabelItem(index,item) {
            this.isLabel = true
            this.leftChannelNameOld = '[' + item.channel + '] ' + item.label
            this.channelIdOld = item.channelId
            this.calendar = moment(item.beginTime).format("YYYY-MM-DD")
            this.startTime = item.beginTime
            this.endTime = this.calendar + ' 23:59:59'
            this.$store.commit("changeSyncPlayMode", false)
            this.selectedLabelIndex = index
            this.retrieval(item.type)
        },
        leaveLabelList() {
            this.labelListVisible = false
            this.greenDateList = []
            // this.$refs['playback'].clearAllPlayback();
            this.$message.success('退出标签回放')
        },
        /**
         * 删除标签
         * @param {Number} id 标签id
         */
        deleteLabel(id) {
            deleteTag( id ).then(res => {
              if (res.data.code === 200000) {
                let params = {
                    channel: this.channelSelect.toString(),
                    label: this.labelSearch,
                    beginTime: this.selectBeginTime,
                    endTime: this.selectEndTime
                }
                this.getTagList(params)
                this.$message.success('删除成功！')
              }
          })
        },
        showEditDialog(item) {
            this.editLabelVisible = true
            this.labelForm.label = item.label
            this.labelId = item.id
        },
        editLabel() {
            this.$refs['data-form'].validate((valid) => {
                if(valid) {
                    let param = {
                        label: this.labelForm.label,
                        id: this.labelId
                    }
                    editTag( param ).then(res => {
                        this.$message.success('标签名修改成功')
                        this.editLabelVisible = false
                        let params = {
                            channel: this.channelSelect.toString(),
                            label: this.labelSearch,
                            beginTime: this.selectBeginTime,
                            endTime: this.selectEndTime
                        }
                        this.getTagList(params)
                    }).catch(err => {
                        this.$message.error(err.message)
                    }) 
                }
            })
        },
        getTagList(params = {}) {
            tagList(params).then((res) => {
                if (res.data.code === 200000) {
                    this.tagList = []
                    let currentDate = new Date()
                    this.tagList = res.data.data.map(item => {
                        return {
                            ...item,
                            channel: `D${item.channel}`,
                            channelId: item.channel,
                            labelName: '[D' + item.channel + '] ' + item.label + ' ' + item.beginTime,
                            beginTime: moment(item.beginTime).format("YYYY-MM-DD HH:mm:ss"),
                            endTime: moment(currentDate).format("YYYY-MM-DD HH:mm:ss")
                        }
                    })
                }
            })
        },
        onDisableSearchButton(value) {
            if (this.$store.getters.getSyncPlayMode) {
                this.disableSearchButton = value
            }
        },
        /**
		 * 检索
		 */
		 retrieval(tagType) {
      console.log('this.fileType',this.fileType);
            if (this.fileType === 3) {
                // 锁定
                this.$refs.lockList.init()
            } else if (this.fileType === 4 && !this.labelListVisible) {
                // 标签回放
                // this.$refs['playback'].closeVideo();
                this.greenDateList = []
                this.selectedLabelIndex = null
                this.getTagList()
                this.labelListVisible = true
            } else {
                if (!this.startTime || !this.endTime) {
                    this.$message.warning('请选择开始和结束时间！')
                } else {
                    this.isDraggable = false
                    this.leftChannelName = this.leftChannelNameOld
                    this.channelId = this.channelIdOld
                    this.channelList.forEach(item=>{
                        if (item.channel==this.channelId) {
                            let currentDay = moment(this.calendar).format("YYYY-MM-DD");//前一天
                            let theDayBefore = moment(this.calendar).subtract(1,"days").format("YYYY-MM-DD");//前一天
                            let theNextDay = moment(this.calendar).add(1,"days").format("YYYY-MM-DD");//后一天
                            let timeList = [{
                                start: theDayBefore + " 00:00:00",
                                end: theDayBefore + " 23:59:59"
                            },{
                                start: currentDay + " 00:00:00",
                                end: currentDay + " 23:59:59"
                            },{
                                start: theNextDay + " 00:00:00",
                                end: theNextDay + " 23:59:59"
                            }]
                            if (!this.$store.getters.getSyncPlayMode) {
                                // 常规播放
                                let params = {
                                    channelList: [this.channelId.toString()],
                                    fileMode: 1,
                                    type: this.fileType === 4 ? tagType : this.fileType,
                                    timeList,
                                    withPlaylist: true
                                }
                                // 调接口
                                playbackCalendar(params).then(res => {
                                    let greenDateList = []
                                    res.data.data.data ? res.data.data.data.forEach(item => {
                                        item.playlist[0].timeList.forEach(item2 => {
                                            greenDateList.push({
                                                start: item.date + ' ' + item2.start,
                                                end: item.date + ' ' + (item2.end === '23:59:59' ? '24:00:00' : item2.end),
                                            })
                                        })
                                    }) : null
                                    this.greenDateList = greenDateList
                                    let startTime = moment(this.calendar).format("YYYY-MM-DD") + moment(this.startTime).format(" HH:mm:ss")
                                    let endTime = moment(this.calendar).format("YYYY-MM-DD") + moment(this.endTime).format(" HH:mm:ss")
                                    let startTime0 = startTime
                                    let isStartTimeInRange = this.greenDateList.findIndex(range => Date.parse(new Date(range.start)) <= Date.parse(new Date(startTime)) && Date.parse(new Date(range.end)) >= Date.parse(new Date(startTime))) >= 0
                                    if (!isStartTimeInRange && this.fileType === 4) {
                                        this.$message.warning('此时间段内没有对应标签回放录像！')
                                    } else {
                                        for (let i = 0; i < this.greenDateList.length; i++) {
                                            if (moment(this.greenDateList[i].start).format("YYYY-MM-DD") === moment(startTime).format("YYYY-MM-DD") && this.greenDateList[i].start >= startTime && !isStartTimeInRange ) {
                                                startTime0 = this.greenDateList[i].start;
                                                break;
                                            }
                                        }
                                        if (!this.greenDateList.find(item => Math.max(moment(startTime).valueOf(), moment(item.start).valueOf())
                                            <= Math.min(moment(endTime).valueOf(), moment(item.end).valueOf()))) {
                                            this.$message.warning('此时间段内没有对应录像！')
                                        }
                                        this.timestampInit = { start_timestamp: new Date(startTime0).getTime(), ts: new Date().getTime() };
                                        this.$refs['playback'].initSessionId(true)
                                        this.$refs['playback'].initColor()
                                        this.isSwitching = false
                                    }
                                })
                                return
                            } else {
                                // 同步播放
                                let requests = [];
                                this.checkedSyncChannels.map(channel => {
                                    let params = {
                                        channelList: [channel.channel.toString()],
                                        fileMode: 1,
                                        type: this.fileType,
                                        timeList,
                                        withPlaylist: true
                                    }
                                    requests.push(playbackCalendar(params))
                                })
                                let greenDateListArray = [];
                                let startTime0Array = [];
                                let endTimeArray = [];
                                let startTime = moment(this.calendar).format("YYYY-MM-DD") + moment(this.startTime).format(" HH:mm:ss")
                                let endTime = moment(this.calendar).format("YYYY-MM-DD") + moment(this.endTime).format(" HH:mm:ss")
                                axios.all(requests).then(axios.spread((...responses) => { 
                                    responses.map((res, index) => {
                                        let greenDateList = []
                                        if (res.data.data.data) {
                                            res.data.data.data.forEach(item => {
                                                item.playlist[0].timeList.forEach(item2 => {
                                                    greenDateList.push({
                                                        start: item.date + ' ' + item2.start,
                                                        end: item.date + ' ' + (item2.end === '23:59:59' ? '24:00:00' : item2.end),
                                                    })
                                                })
                                            })
                                            greenDateListArray.push(greenDateList);
                                            let startTime0 = startTime
                                            let isStartTimeInRange = this.greenDateList.findIndex(range => Date.parse(new Date(range.start)) <= Date.parse(new Date(startTime)) && Date.parse(new Date(range.end)) >=Date.parse(new Date(startTime))) >= 0
                                            for (let i = 0; i < greenDateList.length; i++) {
                                                if (moment(greenDateList[i].start).format("YYYY-MM-DD") === moment(startTime).format("YYYY-MM-DD") && greenDateList[i].start >= startTime && !isStartTimeInRange) {
                                                    startTime0 = greenDateList[i].start;
                                                    break;
                                                }
                                            }
                                            startTime0Array.push(startTime0);
                                            endTimeArray.push(endTime);
                                        }
                                        if (index + 1 === requests.length) {
                                            this.greenDateList = greenDateList;
                                        }
                                    })
                                    console.log('当前所选频道3天内所有视频区间', greenDateListArray);
                                    this.syncGreenDateListArray = greenDateListArray;
                                    let syncStartTime0 = min(startTime0Array.map(time => Date.parse(time)));
                                    let syncEndTime0 = max(endTimeArray.map(time => Date.parse(time)));
                                    if (!this.greenDateList.find(item => Math.max(moment(syncStartTime0).valueOf(), moment(item.start).valueOf())
                                        <= Math.min(moment(syncEndTime0).valueOf(), moment(item.end).valueOf()))) {
                                        this.$message.warning('此时间段内没有对应录像！')
                                    }
                                    this.timestampInit = { start_timestamp: syncStartTime0 || new Date(startTime).getTime(), ts: new Date().getTime() };
                                    this.$refs['playback'].initSessionId(true)
                                    this.$refs['playback'].initGreenDateList(this.syncGreenDateListArray, syncStartTime0)
                                    this.$refs['playback'].initColor()
                                    this.isSwitching = false
                                }))
                            }
                        }
                    })   
                }
            }
            if (this.$store.getters.getSyncPlayMode) { 
                // 同步模式下先清空所有canvas视频
                this.$refs['playback'].closeVideo();
                return
            }
        },
        clearTimeBar() {
            this.greenDateList = []
            this.isDraggable = false
            this.timestampInit = {start_timestamp: new Date(new Date().setHours(0, 0, 0, 0)).getTime(), ts: new Date(new Date().setHours(0, 0, 0, 0)).getTime()}
        },
        /**
         * 点击播放后允许拖动
         */
        draggableTrue() {
            this.isDraggable = true
        },
        searchPlay() {
            console.log('------',this.leftChannelName,this.channelId)
            let startTime = moment(this.calendar).format("YYYY-MM-DD") + moment(this.startTime).format(" HH:mm:ss")
            let endTime = moment(this.calendar).format("YYYY-MM-DD") + moment(this.endTime).format(" HH:mm:ss")
            let startTime0 = startTime
            let endTime0 = endTime
            for (let i = 0; i < this.greenDateList.length; i++) {
                if(!this.videoFlag && Math.max(moment(startTime).valueOf(),moment(this.greenDateList[i].start).valueOf())
                <=Math.min(moment(endTime).valueOf(),moment(this.greenDateList[i].end).valueOf())){
                    startTime0 = moment(startTime).valueOf() > moment(this.greenDateList[i].start).valueOf() ? startTime : this.greenDateList[i].start
                    this.videoFlag = true
                }
                if(this.videoFlag && moment(endTime).valueOf() >= moment(this.greenDateList[i].start).valueOf()
                    && moment(endTime).valueOf() <= moment(this.greenDateList[i].end).valueOf()){
                    break;
                }
                if (this.videoFlag && i > 0 && moment(endTime).valueOf()<moment(this.greenDateList[i].start).valueOf()) {
                    endTime0 = this.greenDateList[i-1].end
                    break
                }
                if (this.videoFlag && i == this.greenDateList.length - 1) {
                    endTime0 = this.greenDateList[i].end
                    break
                }
            }
            if (this.videoFlag) {
                let params = {
                    id: this.channelId.toString(),
                    videoParam: {
                        enable: true,
                        width: 960,
                        frameRate: 15,
                        height: 540,
                        streamId: "record",
                        startTime,
                        endTime,
                        type: this.labelListVisible ? 0 : this.fileType
                    },
                    detectParam: {
                        enable: true,
                    }
                }
                this.timestampInit = {start_timestamp: new Date(startTime0).getTime(), ts: new Date(new Date().setHours(0, 0, 0, 0)).getTime()};
                getSessionId(params).then(res => {
                    this.sessionId = res.data.data
                    this.$nextTick(() => {
                        this.$refs['playback'].init({
                            channelId: this.channelId.toString(),
                            sessionId: this.sessionId,
                            leftChannelName: (this.leftChannelName != 'NaN' ? this.leftChannelName : this.channelName),
                            fileType: this.fileType,
                            endTime: endTime0,
                            greenDateList: this.greenDateList
                        })
                    })
                })
                this.videoFlag = false
            } else {
                this.$message.warning('此时间段内没有可观看的视频！')
            } 
        },
        searchBatchPlay() { 
            console.log('同步播放并创建多个player', this.checkedSyncChannels);
            let startTime = moment(this.calendar).format("YYYY-MM-DD") + moment(this.startTime).format(" HH:mm:ss")
            let endTime = moment(this.calendar).format("YYYY-MM-DD") + moment(this.endTime).format(" HH:mm:ss")
            let startTime0 = startTime
            let endTime0 = endTime

            let requests = [];
            this.syncGreenDateListArray.map((greenDateList, checkedChannelIndex) => {
                for (let i = 0; i < greenDateList.length; i++) {
                    if (!this.videoFlag && Math.max(moment(startTime).valueOf(), moment(greenDateList[i].start).valueOf())
                        <= Math.min(moment(endTime).valueOf(), moment(greenDateList[i].end).valueOf())) {
                        startTime0 = moment(startTime).valueOf() > moment(greenDateList[i].start).valueOf() ? startTime : greenDateList[i].start
                        this.videoFlag = true
                    }
                    if (this.videoFlag && moment(endTime).valueOf() >= moment(greenDateList[i].start).valueOf()
                        && moment(endTime).valueOf() <= moment(greenDateList[i].end).valueOf()) {
                        break;
                    }
                    if (this.videoFlag && i > 0 && moment(endTime).valueOf() < moment(greenDateList[i].start).valueOf()) {
                        endTime0 = greenDateList[i - 1].end
                        break
                    }
                    if (this.videoFlag && i == greenDateList.length - 1) {
                        endTime0 = greenDateList[i].end
                        break
                    }
                }
                if (this.videoFlag) {
                    if (!this.checkedSyncChannels[checkedChannelIndex]?.channel) {
                        return
                    }
                    requests.push(getSessionId({
                        id: `${this.checkedSyncChannels[checkedChannelIndex].channel}`,
                        videoParam: {
                            enable: true,
                            width: 960,
                            frameRate: 15,
                            height: 540,
                            streamId: "record",
                            startTime,
                            endTime,
                            type: this.labelListVisible ? 0 : this.fileType
                        },
                        detectParam: {
                            enable: true,
                        }
                    }))
                } else {
                    this.$message.warning('此时间段内没有可观看的视频！')
                } 
                if (checkedChannelIndex + 1 === this.syncGreenDateListArray.length) {
                    this.videoFlag = false
                    this.onDisableSearchButton(true)
                }
            })
            axios.all(requests).then(axios.spread((...responses) => { 
                let batchInitArray = [];
                responses.map((res, checkedChannelIndex) => {
                    // 根据channelId, sessionId, greenDateList批量创建fgPlayer
                    if (!this.checkedSyncChannels[checkedChannelIndex]?.channel) {
                        return
                    }
                    batchInitArray.push({
                        channelId: `${this.checkedSyncChannels[checkedChannelIndex].channel}`,
                        sessionId: res.data.data,
                        leftChannelName: this.checkedSyncChannels[checkedChannelIndex].channelName,
                        fileType: this.fileType,
                        endTime: endTime0,
                        greenDateList: this.syncGreenDateListArray[checkedChannelIndex],
                        startTime: this.timestampInit.start_timestamp,
                    })
                })
                this.$refs['playback'].batchInit(batchInitArray, () => {
                    console.log('批量创建挂载完player, 定位时间到所有视频最小开始时间');
                    this.getSwitchTime(moment(this.timestampInit.start_timestamp).format('YYYY-MM-DD HH:mm:ss'), null, true)
                })
            }))
        },
        getResetCalendar() {
            this.calendar = new Date()
            this.greenDay = []
            this.startTime = new Date(2022, 8, 11, 0, 0, 0),
            this.endTime = new Date(2022, 8, 11, 23, 59, 59),
            this.fileType = 0
        },
        getBackRun (val) {
            this.isBackRun = val
            setTimeout(() => {
                this.startTime = new Date(2022, 8, 11, 0, 0, 0)
            }, 1000);
        },
        getChannelName(channelName) {
            this.channelName = channelName
            this.greenDateList = []
        },
        getTimestamp(timestamp) {
            if (moment(this.timestamp).format("YYYY-MM") != moment(timestamp).format("YYYY-MM")) {
                this.calendar = moment(timestamp).format("YYYY-MM-DD")
                this.getChannelId(this.channelId,timestamp)
            }
            this.timestamp = timestamp
            this.userDataFlag = true
        },
        getFullFlag(isFullFlag) {
            this.isFullFlag = isFullFlag
        },
        getNewSessionId(sessionId,leftChannelName) {
            this.sessionId = sessionId || this.sessionId
            this.channelName = leftChannelName
        },
        getChannelId(channelId, timestamp) {
            if (!channelId) {
                return
            }
            let channelRefs = this.$refs['playback'].refList;
            let videoRef = channelRefs.find(ref => ref.channelId == channelId);
            this.channelId = channelId;
            this.getNewDot(channelId);
            this.videoRef = videoRef;
            this.greenDateList = videoRef.greenDateList;
            this.isSwitching = false;
        },
        updateTimeLine() {
            this.$refs['time_line'].updateTimeLine()
        },
        getNewDot(channelId) {
            let monthDay = moment(moment(this.calendar).format("YYYY-MM"), "YYYY-MM").daysInMonth()
            let leftMonthDay = moment(moment(this.calendar).subtract(1,'months').format("YYYY-MM"), "YYYY-MM").daysInMonth()
            let timeList = []
            for (let i = leftMonthDay-5; i <= leftMonthDay; i++) {
                timeList.push({
                    start: moment(this.calendar).subtract(1,'months').format("YYYY-MM") + '-' + (i<10 ? ('0' + i) : i) + " 00:00:00",
                    end: moment(this.calendar).subtract(1,'months').format("YYYY-MM") + '-' + (i<10 ? ('0' + i) : i) + " 23:59:59"
                })
            }
            for (let i = 1; i <= monthDay; i++) {
                timeList.push({
                    start: moment(this.calendar).format("YYYY-MM") + '-' + (i<10 ? ('0' + i) : i) + " 00:00:00",
                    end: moment(this.calendar).format("YYYY-MM") + '-' + (i<10 ? ('0' + i) : i) + " 23:59:59"
                })
            }
            if (moment(this.calendar).format("YYYY-MM") < moment(new Date()).format("YYYY-MM")) {
                for (let i = 1; i <= 11; i++) {
                    timeList.push({
                        start: moment(this.calendar).add(1,'months').format("YYYY-MM") + '-' + (i<10 ? ('0' + i) : i) + " 00:00:00",
                        end: moment(this.calendar).add(1,'months').format("YYYY-MM") + '-' + (i<10 ? ('0' + i) : i) + " 23:59:59"
                    })
                }
            }
            let params = {
                channelList: [channelId.toString()],
                fileMode: 1,
                type: this.fileType,
                timeList,
                withPlaylist: false
            }
            // 调接口
            playbackCalendar(params).then(res => {
                let greenDay = []
                res.data.data.data ? res.data.data.data.forEach(item=>{
                    greenDay.push(item.date)
                }) : null
                this.greenDay = greenDay
            })
        },
        /**
         * 拖动切换时间
         * @param {String} switchTime 
         * @param {String} type 如果有type则不显示ctrlRecordVideo时间切换成功的提示
         * @param {String} isInit 如果有为searchBatchPlay初始化调用，不显示切换成功提示
         */
        async getSwitchTime(switchTime, type, isInit) {
            if (this.$refs['playback'].isDisableDrag) {
                console.log('[FGPlayer] 没进第一次onUserData回调之前禁止拖拽');
                return
            }
            //向后调整日期后还是以当日日期进行比较存在问题
            //改成从从所有可播放录像端进行检查，如果当前切换时间在这些时间段就代表存在视频可播放
            // if (new Date(switchTime).valueOf() > new Date().valueOf()) {
            //     this.$message.warning('此区域暂无视频！')
            //     return
            // }
            if(this.greenDateList){
                let checkFlg=false;
                let switchDate=new Date(switchTime).valueOf();
                for(let it of this.greenDateList){
                    let end=new Date(it.end).valueOf();
                    let start=new Date(it.start).valueOf();
                    if(switchDate>=start && switchDate <=end){
                        checkFlg=true;
                        break;
                    }
                }
                if(!checkFlg && !isInit){
                    this.$message.warning('此区域暂无视频！')  ;
                    // 光标拖动灰色区域，没有视频的时候
                    if (!this.$store.getters.getSyncPlayMode) {
                        this.$refs.playback.playGray()
                    }
                    return ;  
                } else {
                  // 光标重新拖动到绿色区域的时候
                  if (!this.$store.getters.getSyncPlayMode) {
                      this.$refs.playback.playGreen()
                  }
                }
            }else{
                this.$message.warning('此区域暂无视频！')  ;
                if (!this.$store.getters.getSyncPlayMode) {
                    this.$refs.playback.playGray()
                }
                return ;
            }

            if (moment(switchTime).format("YYYY-MM-DD") !== moment(this.calendar).format("YYYY-MM-DD")) {
                this.calendar = new Date(switchTime)
                // 当switchTime不在当天时，需关闭当前视频，然后重新启动下一天(或上一天)的当前视频
                this.$refs.playback.closeVideo()
                this.retrieval()
                setTimeout(() => {
                    this.$refs.playback.playVideo()
                }, 500);
                setTimeout(() => {
                    this.getSwitchTime(switchTime,true)
                }, 1000);
            }
            this.isSwitching = true

            if (this.$store.getters.getSyncPlayMode) {
              this.$refs['playback'].updateCursorTime(switchTime)
                let channelRefs = this.$refs['playback'].refList;
                let requestArray = [];
                channelRefs.map(channel => {
                    let params = {
                        streamId: channel.sessionId,
                        ctrl: this.CONTROL.SEEK_2,
                        playSpeed: this.$refs['playback'].playSpeed,
                        startTime: switchTime
                    }
                    let request = ctrlRecordVideo(channel.channelId.toString(),params)
                    requestArray.push(request)
                })
                await axios.all(requestArray).then(axios.spread((...responses) => {
                    responses.map(async (res, index) => {
                        let currentChannelId = channelRefs[index].channelId.toString()
                        let currentCanvas = this.$refs['playback'].refList.find(ref => ref.channelId === currentChannelId)
                        this.isSwitching = false

                        if (res.data.code === 200000) {
                            // 重新计算每个canvas内的timer倒计时
                            this.$refs['playback'].resetControlVideoTimer({
                                channelId: currentChannelId,
                                switchTime,
                                manual: true
                            });
                            // 更新视频结束时间点，用来判断是否销毁fgPlayer
                            this.$refs['playback'].setSessionEndTime(currentCanvas.sessionId, switchTime, currentCanvas.greenDateList)
                        }
                    })
                })).finally(() => {
                    !isInit && this.$message.success('时间切换成功')
                    // 更改完page16List内需要更改播放状态的canvas，还需要更改控制器的播放状态
                    this.$refs['playback'].updatePlayerButtonState()
                })
                return 
            }
            let params = {
                streamId: this.sessionId,
                ctrl: this.CONTROL.SEEK_2,
                playSpeed: 0,
                startTime: switchTime
            }
            ctrlRecordVideo(this.channelId.toString(),params).then(res=> {
                // 解决时间条跳动bug，找灰色区间的下一段绿色区间
                let p1 = -1
                let p2 = -1
                for (let i = 0; i < this.greenDateList.length; i++) {
                    if (switchTime >= this.greenDateList[i].start && switchTime <= this.greenDateList[i].end) {
                        p1 = i
                    }
                    if (switchTime <= this.greenDateList[i].start && p2 < 0) {
                        p2 = i
                    }
                }
                if (p1 < 0 && p2 >= 0) {
                    this.timestampInit = {start_timestamp: new Date(this.greenDateList[p2].start.replace(/-/g,"/")).getTime(), ts: new Date().getTime()};
                }

                this.isSwitching = false
                if (res.data.code === 200000) {
                    this.$refs['playback'].setSessionEndTime(this.sessionId,switchTime,this.greenDateList)
                    if (!type) {
                        this.$message.success('时间切换成功')
                    }
                }
            })
        },
        getChangeFlag(changeFlag) {
            if (changeFlag) {
                this.userDataFlag = false
            } else {
                this.userDataFlag = true
            }
        },
        // 减少
        changeMinus(){
            if (this.timeAxisIndex > 0) {
                this.timeAxisIndex -= 1
                this.minusFlag = true
                this.plusFlag = false
                this.timeAxis = this.timeAxisList[this.timeAxisIndex].name
                this.widthAxis = this.timeAxisList[this.timeAxisIndex].time
            } else {
                this.minusFlag = false
                this.plusFlag = false
            }
        },
        // 增加
        changePlus(){
            if (this.timeAxisIndex < 6) {
                this.timeAxisIndex += 1
                this.minusFlag = true
                this.plusFlag = false
                this.timeAxis = this.timeAxisList[this.timeAxisIndex].name
                this.widthAxis = this.timeAxisList[this.timeAxisIndex].time
            } else {
                this.plusFlag = true
                this.minusFlag = true
            }
        },
        otherMonth() {
            this.calendar = moment(this.calendar).format("YYYY-MM-DD")
            if (this.channelId) {
                this.clickChannelItem(this.channelId,this.channelList.filter(item => item.channel === this.channelId)[0],true)
            } else if (!this.channelId && this.channelIdOld) {
                this.clickChannelItem(this.channelIdOld,this.channelList.filter(item => item.channel === this.channelIdOld)[0],true)
            }
        },
    }
}
</script>
<style scoped lang="less">
.layout {
    display: flex;
    width: 100%;
    height: calc(100vh - 70px);
    background: #08233F;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    .channel {
        width: 250px;
        min-width: 250px;
        height: calc(100vh - 80px);
        margin-top: 5px;
        background: linear-gradient(360deg, #024B87 0%, #033763 19%, #032E54 100%);
        box-shadow: inset -5px 5px 13px 0px rgba(17,148,255,0.31);
        border: 1px solid #1A4D91;
        color: #697182;
        .title {
            height: 42px;
            line-height: 42px;
            padding: 0 10px;
            background: linear-gradient(270deg, rgba(0,81,124,0) 0%, #005FB4 100%);
            display: flex;
            justify-content: space-between;
            color: #fff;
            .title-name {
                width: 180px;
                overflow: hidden;
                font-size: 18px;
            }
            .title-icon {
                margin-top: 3px;
                cursor: pointer;
            }
        }
        .search {
            margin: 20px 15px 20px 6px;
            height: 20px;
            line-height: 20px;
        }
        /deep/ .el-input__inner {
            border-color: #094171;
            background: #032f55;
            height: 35px;
            line-height: 3px;
        }
        .overflowChannel {
            height: calc(100vh - 150px);
            margin-top: 10px;
            overflow-y: auto;
        }
        ::-webkit-scrollbar {
            /*隐藏滚轮*/
            display: none;
        }
        .channel_item {
            width: 230px;
            margin-left: 10px;
            height: 40px;
            line-height: 40px;
            font-size: 13px;
            display: flex;
            cursor: pointer;
            padding-left: 10px;
            overflow:hidden; //超出的文本隐藏
            text-overflow:ellipsis; //溢出用省略号显示
            white-space:nowrap; //溢出不换行
            .channel_name {
                // width: 180px;
                width: 205px;
                height: 100%;
                line-height: 40px;
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
        }
        /deep/.channel_item .el-checkbox__input {
            align-items: center;
            display: flex;
        }
        /deep/.channel_item.is-checked .el-checkbox__label {
            color: #FFFFFF;
        }
    }
    .label {
        animation: labelDivIn 500ms;
        .label-main {
            height: calc(100vh - 185px);
            .filter {
                padding: 0 10px;
                margin-left: 10px;
                height: 150px;
                color: #fff;
                font-size: 13px;
                .channel-select {
                    margin-top: 10px;
                    height: 33px;
                    line-height: 33px;
                    width: 100%;
                    display: flex;
                    /deep/ .el-input--mini {
                        width: 170px;
                    }
                }
                .label-select {
                    margin-top: 10px;
                    height: 33px;
                    line-height: 33px;
                    width: 100%;
                    display: flex;
                    /deep/ .el-input--mini {
                        width: 170px;
                    }
                }
                /deep/ .el-input--mini .el-input__inner {
                    color: #fff;
                }
                .select-name {
                    width: 30px;
                    margin-right: 10px;
                }
                .time-select {
                    width: 100%;
                    margin-top: 8px;
                    .label-date-input.el-input {
                        width: 170px;
                        margin-left: 3px;
                    }
                    .label-date-input-second.el-input {
                        margin-left: 38px;
                        margin-top: 5px;
                    }
                }
            }
            .label-list {
                height: calc(100vh - 310px);
                margin-top: 10px;
                overflow-y: auto;
                .label-item {
                    margin-left: 10px;
                    margin-right: 10px;
                    height: 33px;
                    line-height: 33px;
                    font-size: 13px;
                    display: flex;
                    cursor: pointer;
                    padding-left: 10px;
                    color: #fff;
                    .label-name {
                        width: 75%;
                        height: 100%;
                        line-height: 33px;
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
                    .buttons-con {
                        .button-icon {
                            margin-left: 6px;
                            cursor: pointer;
                            font-size: 11px;
                        }
                    }
                }
                .active {
                    color: #1890FF;
                    background: #033E70;
                }
            }
        }
    }
    @keyframes labelDivIn {
        0% {width: 0px;}
        100% {width: 250px;}
    }
    @-webkit-keyframes labelDivIn {
        0% {width: 0px;}
        100% {width: 250px;}
    }
    .playback {
        width: calc(100vw - 520px);
        height: calc(100vh - 80px);
        min-width: 730px;
        margin: 0 5px;
        margin-top: -6px;
        display: flex;
        flex-direction: column;
        .video {
            width: 100%;
            height: calc(100vh - 170px);
            margin-top: 10px;
            
        }
        .timeline-stage {
            width: 190px;
            margin-top: -50px;
            .timeline-stage-top {
                width: 100%;
                height: 32px;
                line-height: 32px;
                position: relative;
                font-size: 12px;
                .stage-top-left {
                    padding-left: 10px;
                    float: left;
                    width: 200px;
                    height: 30px;
                    overflow:hidden; //超出的文本隐藏
                    text-overflow:ellipsis; //溢出用省略号显示
                    white-space:nowrap; //溢出不换行
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    color: #ECFDFF;
                }
                .play-time {
                    margin-left: calc(100vw - 775px);
                    position: absolute;
                    width: 280px;
                    display: flex;
                    color: #ECFDFF;
                    .time_title {
                        font-size: 14px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        margin-top: -1px;
                        margin-right: 8px;
                    }
                    .time_res {
                        width: 60px;
                        height: 24px;
                        margin: 0 6px;
                        line-height: 24px;
                        border: 1px solid #10538A;
                        text-align: center;
                    }
                    .time_but {
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
        }
    }
    .file {
        float: right;
        width: 270px;
        min-width: 270px;
        height: calc(100vh - 80px);
        margin-top: 5px;
        overflow: auto;
        background: linear-gradient(360deg, #024B87 0%, #033763 19%, #032E54 100%);
        box-shadow: inset -5px 5px 13px 0px rgba(17,148,255,0.31);
        border: 1px solid #1A4D91;
        color: #fff;
        .file_title {
            height: 42px;
            line-height: 42px;
            padding-left: 10px;
            background: linear-gradient(270deg, rgba(0,81,124,0) 0%, #005FB4 100%);
            display: flex; 
        }
        /** 以下是日历样式 */
        .calendar-wrap /deep/ .el-button{
            padding: 6px!important;
        }
        .calendar-wrap /deep/ .el-icon-arrow-left,
        .calendar-wrap /deep/ .el-icon-arrow-right{
            font-weight:900 !important;
        }
        .left-wrap {
            width: 240px;
            height: 300px;
            margin: 10px;
            margin-top: 30px;
            background: #003A6B;
            box-shadow: 0px 12px 47px 16px rgba(0,0,0,0.03);
            border-radius: 2px;
            border: 1px solid #3082e0;
        }
        .left-wrap /deep/ .el-calendar__header {
            background: #003A6B;
            width: 200px;
            line-height: 10px;
            border-bottom: 1px solid #0B5795;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .left-wrap /deep/ .el-calendar__title {
            color: #fff;
            margin-left: 10px;
        }
        .left-wrap /deep/ .el-calendar__button-group .el-button--mini:nth-child(1) {
            margin-left: -145px;
            border: none;
            background: none;
            color: #ECFDFF;
            font-size: 14px;
        }
        .left-wrap /deep/ .el-calendar__button-group .el-button--mini:nth-child(2) {
            display: none;
        }
        .left-wrap /deep/ .el-calendar__button-group .el-button--mini:nth-child(3) {
            margin-left: 30px;
            margin-right: -35px;
            border: none;
            background: none;
            color: #ECFDFF;
            font-size: 14px;
        }
        .left-wrap /deep/ .el-calendar-table .el-calendar-day{
            height: 35px;
            line-height: 35px;
            padding: 0 8px;
            font-size: 14px;
            color: #537e9f;
            font-family: PingFangSC-Regular, PingFang SC;
        }
        .left-wrap /deep/ .el-calendar-table .el-calendar-day:hover{
            background: #1890FF;
            box-shadow: 0px 12px 47px 16px rgba(0,0,0,0.03);
            border-radius: 2px;
        }
        .left-wrap /deep/ .el-calendar__body {
            padding: 0 5px;
        }
        .left-wrap /deep/ .el-calendar__body thead th{
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #ECFDFF;
            padding: 10px 0 7px 0;
        }
        .left-wrap /deep/ .el-calendar-table {
            background: #003A6B;
            width: 100%;
            border-radius: 10px;
        }
        .left-wrap /deep/ .el-calendar-table td {
            border: none !important;
        }
        .left-wrap /deep/ .el-calendar-table td.is-selected {
            background: none;
        }
        .left-wrap /deep/ .el-backtop, .el-calendar-table td.is-selected p{
            width: 35px;
            color: white;
            line-height: 35px;
            margin-left: -8px;
            text-align: center;
            background-image: linear-gradient(to right, #2160dc, #4880f0);
        }
        .left-wrap /deep/ .el-backtop, .el-calendar-table td.is-selected p{
            height: 35px;
            background-color: #2160dc;
            color: white;
        }
        .budge{
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin: 0 5px;
            margin-top: -8px;
        }
        .green{
            background-color: #25b591;
        }
        /** 以下是检索与下载样式 */
        .search_download {
            margin-left: 15px;
            margin-top: 30px;
            .download_title {
                height: 23px;
                font-size: 15px;
                font-family: PingFangSC-Regular, PingFang SC;
                color: #ECFDFF;
                line-height: 23px;
            }
            .search_button {
                width: 240px;
                height: 38px;
                margin-top: 20px;
                background: #00447D;
                border-radius: 3px;
                border: 1px solid #0A56A2;
                color: #fff;
                font-size: 14px;
                &.is-disabled{
                    color: #AAB0BB;
                    background: #003058db;
                }
            }
            /deep/ .el-input--mini .el-input__inner {
                height: 31px;
                line-height: 31px;
                margin-left: -10px;
                width: 240px;
                border-radius: 3px;
                border: 1px solid #10538A;
                background: none;
                color: #ECFDFF;
            }
            /deep/ .el-input--mini .el-input__icon {
                margin-left: -10px;
            }
        }
    }
    ::-webkit-scrollbar {
        /*隐藏滚轮*/
        display: none;
    }
}
</style>