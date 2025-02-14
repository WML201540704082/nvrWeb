<template>
    <div>
        <div v-if="sessionId" style="width: 100%;height: 100%;position: absolute;z-index: 2000;"></div>
        <div class="control">
            <div class="name_con">云台控制</div>
            <div class="content">
                <div class="dome-box">
                    <div class="dome">
                        <ul class='pie'>
                            <!-- 镜头初始化：0 上：1 右上：2 右：3 右下：4 下：5 左下：6 左：7 左上：8 -->
                            <li @mousedown="startMove(1)" @mouseup="stopMove(1)">
                                <img src="./arrows/arrows_top.svg" class="arrows">
                            </li> 
                            <li @mousedown="startMove(2)" @mouseup="stopMove(2)">
                                <img src="./arrows/arrows_top1.svg" class="arrows1">
                            </li>
                            <li @mousedown="startMove(3)" @mouseup="stopMove(3)">
                                <img src="./arrows/arrows_right.svg" class="arrows">
                            </li>
                            <li @mousedown="startMove(4)" @mouseup="stopMove(4)">
                                <img src="./arrows/arrows_right1.svg" class="arrows1">
                                <!-- <svg-icon icon="arrows_right1"></svg-icon> -->
                            </li>
                            <li @mousedown="startMove(5)" @mouseup="stopMove(5)">
                                <img src="./arrows/arrows_bottom.svg" class="arrows">
                                <!-- <svg-icon icon="arrows_bottom"></svg-icon> -->
                            </li>
                            <li @mousedown="startMove(6)" @mouseup="stopMove(6)">
                                <img src="./arrows/arrows_bottom1.svg" class="arrows1">
                                <!-- <svg-icon icon="arrows_bottom1"></svg-icon> -->
                            </li>
                            <li @mousedown="startMove(7)" @mouseup="stopMove(7)">
                                <img src="./arrows/arrows_left.svg" class="arrows">
                                <!-- <svg-icon icon="arrows_left"></svg-icon> -->
                            </li>
                            <li @mousedown="startMove(8)" @mouseup="stopMove(8)">
                                <img src="./arrows/arrows_left1.svg" class="arrows1">
                                <!-- <svg-icon icon="arrows_left1"></svg-icon> -->
                            </li>
                        </ul>
                        <div class="center">
                            <div class="center-1" @mousedown="startMove(0)">
                                <svg-icon icon="refresh" class="center-icon"></svg-icon>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="progress">
                    <div class="progress_title">
                        <span>速度</span>
                    </div>
                    <div class="progress_content">
                        <Progress :min="1" :max="7" v-model="speed"></Progress>
                    </div>
                </div>
                <div class="plus-minus-box" v-for="(item,index) of plusMinusList" :key="index">
                    <div class="plus-minus">
                        <span>{{item.name}}</span>
                        <div class="plus-minus-item minus" @mousedown="startMove(item.cmd+1)" @mouseup="stopMove(item.cmd+1)">
                            <i class="el-icon-minus"></i>
                        </div>
                        <div class="plus-minus-item plus" @mousedown="startMove(item.cmd)" @mouseup="stopMove(item.cmd)">
                            <i class="el-icon-plus"></i>
                        </div>
                    </div>
                </div>
                <!-- <div class="img-settings-box">
                    <el-tooltip placement="top-start" content="灯光" :open-delay="300" effect="light" style="cursor:pointer;">
                        <svg-icon icon="lamplight" class="img-settings-item"></svg-icon>
                    </el-tooltip>
                    <el-tooltip placement="top-start" content="雨刷" :open-delay="300" effect="light" style="cursor:pointer;">
                        <svg-icon icon="wiper" class="img-settings-item"></svg-icon>
                    </el-tooltip>
                    <el-tooltip placement="top-start" content="平行移动" :open-delay="300" effect="light" style="cursor:pointer;">
                        <svg-icon icon="parallel"  class="img-settings-item"></svg-icon>
                    </el-tooltip>
                    <el-tooltip placement="top-start" content="镜头复位" :open-delay="300" effect="light" style="cursor:pointer;">
                        <svg-icon icon="camera"  class="img-settings-item"></svg-icon>
                    </el-tooltip>
                    <el-tooltip placement="top-start" content="辅助聚焦" :open-delay="300" effect="light" style="cursor:pointer;">
                        <span @click="startMove(18)" style="cursor: pointer;">
                            <svg-icon icon="auxiliary"  class="img-settings-item"></svg-icon>
                        </span>
                    </el-tooltip>
                </div> -->
                <div class="top_title"><svg-icon icon="cradle_head_top" class="head_icon"></svg-icon>云台高级设置</div>
                <div class="top_settings">
                    <div class="title-box">
                        <span class="title" :class="{active: selectedTabIndex === 0}" @click="onSelectTab(0)">预置点</span>
                        <span class="title" :class="{active: selectedTabIndex === 1}" @click="onSelectTab(1)">巡航</span>
                        <!-- <span class="title" :class="{active: selectedTabIndex === 2}" @click="onSelectTab(2)">轨迹</span> -->
                    </div>
                    <!-- 预置点列表 -->
                    <div v-show="selectedTabIndex === 0" >
                        <div 
                            class="top_content preset-content" 
                            :style="{ height: (size.contentHeight - 205) + 'px' }" 
                            v-loading="loadingPresetData"
                            element-loading-text=""
                            element-loading-spinner="el-icon-loading"
                            element-loading-background="rgba(0, 0, 0, 0.3)">
                            <div class="settings_item" :class="{hover: curPrestIndex === index}" v-for="(item, index) in presetList" :key="index" @click="selectPreset(index)">
                                <span class="item_title">{{item.name}}</span>
                                <div class="options">
                                    <i class="el-icon-position" title="调用" @click="gotoPreset(item.index)"></i>
                                    <i class="nvr-icon-focus" title="设置" @click="setPreset(item.index, item.name)"></i>
                                    <i class="el-icon-edit-outline" title="重设" @click="handleOpenPresetDialog(item)"></i>
                                </div>
                            </div>
                            <div v-if="presetList.length===0 && !loadingPresetData" class="empty-table">请先选择通道</div>
                        </div>
                    </div>
                    <!-- 巡航路径列表 -->
                    <div v-show="selectedTabIndex === 1 && !isEditTourMode">
                        <div 
                            class="top_content ptz-tour-content" 
                            :style="{height: (size.contentHeight - 205) + 'px'}"
                            v-loading="loadingTourData"
                            element-loading-text=""
                            element-loading-spinner="el-icon-loading"
                            element-loading-background="rgba(0, 0, 0, 0.3)"
                            >
                            <div class="settings_item" :class="{hover: selectedTourIndex === index}" v-for="(tourItem, index) in tourList" :key="index" @click="selectTour(index)">
                                <span class="item_title">巡航路径{{tourItem.index}}</span>
                                <div class="options">
                                    <i class="el-icon-position" title="调用" @click="callTrack(tourItem)"></i>
                                    <i class="nvr-icon-banned" title="停止调用" @click="stopTrack(tourItem)"></i>
                                    <i class="el-icon-edit-outline" title="编辑" @click="intoEditMode(tourItem)"></i>
                                </div>
                            </div>
                            <div v-if="tourList.length===0 && !loadingTourData" class="empty-table">请先选择通道</div> 
                        </div>
                    </div>
                    <!-- 已选中的巡航路径的预置点列表 -->
                    <div ref="tourContent" class="top_content ptz-tour-edit-content" v-show="selectedTabIndex === 1 && isEditTourMode" :style="{height: (size.contentHeight - 205) + 'px'}">
                        <div style="height: 40px;line-height: 40px;margin: 0 12px;">
                            <div class="content-title">
                                <span style="padding: 0 8px;" @click="exitEditMode">
                                    <i class="el-icon-arrow-left" title="返回"></i>
                                    巡航路径{{selectedTourIndex+1}}
                                </span>
                            </div>
                            <div class="content-options">
                                <i class="el-icon-plus" title="添加" @click="e =>{this.newPresetDialogVisible = true}"></i>
                                <i class="el-icon-delete" title="删除" @click="deleteTour"></i>
                                <i class="el-icon-top" :class="{disabled: !(selectedPresetIndex > -1 && selectedPresetIndex !== 0)}" title="上移" @click="selectedTourMoveUp"></i>
                                <i class="el-icon-bottom" :class="{disabled: !(selectedPresetIndex > -1 && selectedPresetIndex+1 !== selectedPresetList.length)}" title="下移" @click="selectedTourMoveDown"></i>
                            </div>
                        </div>
                        <table class="table table-striped">
                            <thead class="thead">
                                <tr>
                                    <th scope="col">编号</th>
                                    <th scope="col">预置点</th>
                                    <th scope="col">停留时间</th>
                                    <th scope="col">速度</th>
                                </tr>
                            </thead>
                            <draggable v-model="selectedPresetList" tag="tbody" @end="handlePresetDataMove">
                                <tr :class="{active:selectedPresetIndex === index}" @click="handlePresetSelected(index)" v-for="(selectedPreset, index) in selectedPresetList" :key="index">
                                    <td class="index">{{ index+1 }}</td>
                                    <td class="name">
                                        <el-tooltip :content="selectedPreset.name" placement="top" effect="light">
                                            <span>{{ selectedPreset.name }}</span>
                                        </el-tooltip>
                                    </td>
                                    <td class="stay-time">{{ selectedPreset.stayTime }}</td>
                                    <td class="speed">{{ selectedPreset.speed }}</td>
                                </tr>
                            </draggable>
                        </table>
                        <div v-if="!selectedPresetList || selectedPresetList.length===0" class="empty-table">暂无数据</div> 
                    </div>
                    <!-- 轨迹列表 -->
                    <div class="top_content ptz-tour-content" v-show="selectedTabIndex === 2" :style="{height: (size.contentHeight - 205) + 'px'}">
                        <div class="settings_item" :class="{hover: selectedPatternIndex === index}" v-for="(pattern, index) in patternList" :key="index">
                            <span class="item_title">轨迹{{pattern.index}}</span>
                            <div class="options">
                                <i v-show="pattern.status === RECORDING_STATUS.NO_RECORDING" class="nvr-icon-recording" title="录制" @click="startRecording(index)"></i>
                                <i v-show="pattern.status === RECORDING_STATUS.RECORDING" class="nvr-icon-end-recording" title="停止录制" @click="endRecording(index)"></i>
                                <i v-show="pattern.status === RECORDING_STATUS.STOPPED_RECORDING" class="nvr-icon-start-recording" title="重新录制" @click="restartRecording(index)"></i>
                                <i class="el-icon-position" title="调用" @click="callPattern(index)"></i>
                                <i class="nvr-icon-banned" title="停止调用" @click="uncalledPattern(index)"></i>
                            </div>
                        </div>
                        <div v-if="tourList.length===0" class="empty-table">请先选择通道</div> 
                    </div>
                </div>
            </div>
            <!-- 为选中的巡航路径添加新的预置点 -->
            <el-dialog title="添加预置点" class="new-preset-dialog" :append-to-body="true" :close-on-click-modal="false" width="33%"
                :visible.sync="newPresetDialogVisible">
                <el-form size="mini" ref="newPresetForm" :rules="newPresetFormRule" :model="newPresetForm" label-width="120px">
                    <el-form-item prop="index" label="预置点">
                        <el-select v-model="newPresetForm.index" style="width: 250px">
                            <el-option v-for="preset in presetList" :key="preset.index" :label="preset.name" :value="preset.index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="speed" label="巡航速度">
                        <el-input 
                            v-model="newPresetForm.speed"
                            :placeholder="`请保证数值在${this.tourOption?.speed?.min || 1}~${this.tourOption?.speed?.max || 7}范围内`"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="stayTime" label="停留时间">
                        <el-input 
                            v-model="newPresetForm.stayTime"
                            :placeholder="`请保证数值在${this.tourOption?.stayTime?.min || 120}~${this.tourOption?.stayTime?.max || 3600}范围内`"
                        ></el-input>
                        秒
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button size="small" @click="cancelAddPreset">取 消</el-button>
                    <el-button type="primary" size="small" @click="confirmAddPreset">确 定</el-button>
                </div>
            </el-dialog>
            <!-- 重设预置点列表内选中的预置点 -->
            <el-dialog title="重设预置点" class="edit-preset-dialog" :append-to-body="true" :close-on-click-modal="false" width="33%"
                :visible.sync="editPresetDialogVisible">
                <el-form size="mini" ref="editPresetForm" :rules="editPresetFormRule" :model="editPresetForm" label-width="120px">
                    <el-form-item prop="name" label="预置点名称">
                        <el-input 
                            v-model="editPresetForm.name"
                            :placeholder="`请输入`"
                        ></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button size="small" @click="cancelEditPreset">取 消</el-button>
                    <el-button type="primary" size="small" @click="confirmEditPreset">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import bus from '@/utils/eventBus'
import { queryTourByChannelId, updateTourByChannelId, callTourByChannelId, editPresetByChannelId, queryPatternByChannelId, updatePatternByChannelId, callPatternByChannelId } from "@/api";
import { putPtzCtrl, getPresets, gotoPreset, setPreset } from '@/api/systemAPI';
import Progress from '@/components/progress'
import draggable from "vuedraggable";
import { debounce } from "lodash";
export default {
    inject: ['size'],
    data() {
        let speedValidator = (rule, value, callback) => {
            if (!value) {
                callback(new Error('字段不能为空'));
            }
            if (!(value >= (this.tourOption?.speed?.min || 1) && value <= (this.tourOption?.speed?.max || 7))) {
                callback(new Error(`请保证数值在${this.tourOption?.speed?.min || 1}-${this.tourOption?.speed?.max || 7}范围内`));
            } else {
                callback();
            }
        };
        let stayTimeValidator = (rule, value, callback) => {
            if (!value) {
                callback(new Error('字段不能为空'));
            }
            if (!(value >= (this.tourOption?.stayTime?.min || 120) && value <= (this.tourOption?.stayTime?.max || 3600))) {
                callback(new Error(`请保证数值在${this.tourOption?.stayTime?.min || 120}-${this.tourOption?.stayTime?.max || 3600}范围内`));
            } else {
                callback();
            }
        };
        return {
            plusMinusList: [{
                index: 0,
                name: '调焦',
                icon: 'zoom',
                cmd: 9
            },{
                index: 1,
                name: '光圈',
                icon: 'operture',
                cmd: 11
            },{
                index: 2,
                name: '聚焦',
                icon: 'focal',
                cmd: 13
            }],
            maxPresetNum: 256,
            curPrestIndex: 1,
            dengguang: false,
            yushua: false,
            xuanzhuan: false,
            jujiao: false,
            selectedChannelId: 0,
            speedVal: 4,
            selectedTabIndex: 0,
            selectedTrackIndex: 0,
            selectedTourIndex: 0,
            selectedPatternIndex: 0,
            presetList: [...Array(100).keys()].map(p => {return {index: p+1, name: `预置点${p+1}`}}),
            tourOption: {},
            tourList: [...Array(4).keys()].map(t => {
                return {
                    index: t + 1,
                    presetList: []
                }
            }),
            CALL_OPERATION: {
                START: 'Start',
                STOP: 'Stop',
                PAUSE: 'Pause',
                EXTEND: 'Extended'
            },
            RECORDING_STATUS: {
                NO_RECORDING: 'NO_RECORDING',
                RECORDING: 'RECORDING',
                STOPPED_RECORDING: 'STOPPED_RECORDING'
            },
            patternList: [...Array(4).keys()].map(p => {
                return {
                    index: p + 1,
                    status: 'NO_RECORDING'
                }
            }),
            isEditTourMode: false,
            selectedPresetList: [],
            selectedTourIndex: -1,
            selectedPresetIndex: -1,
            isMouseMove: false,
            isMouseDown: false,
            newPresetDialogVisible: false,
            editPresetDialogVisible: false,
            newPresetForm: {
                index: undefined,
                speed: undefined,
                stayTime: undefined
            },
            editPresetForm: {
                name: undefined,
                index: undefined
            },
            newPresetFormRule: {
                index: [
                    { required: true, message: '请选择', trigger: 'blur' }
                ],
                speed: [
                    { required: true, message: '请填写', trigger: 'blur' },
                    { validator: speedValidator, trigger: 'blur'}
                ],
                stayTime: [
                    { required: true, message: '请填写', trigger: 'blur' },
                    { validator: stayTimeValidator, trigger: 'blur'}
                ],
            },
            editPresetFormRule: {
                name: [
                    { required: true, message: '请输入', trigger: 'blur' }
                ],
            },
            loadingPresetData: false,
            loadingTourData: false,
            isBeingAdded: false,
            sessionId: false
        }
    },
    components:{
        Progress,
        draggable
    },
    mounted() {
        bus.$on('channel',(itemRef,id,sum,params,clearChannel,sessionId) => {
            if (sessionId) {
                this.sessionId = true
            } else {
                this.sessionId = false
            }
            if (!JSON.parse(localStorage.getItem('isRoundFlag'))) {
                this.setChannelId(id, () => {
                    this.loadingPresetData = true;
                    this.loadingTourData = true;
                    this.fetchPTZData()
                })   
            }
        }),
        bus.$on('preview', ({ playFlag, channelId, channelLength }) => {
            if (!JSON.parse(localStorage.getItem('isRoundFlag')) && !channelLength && playFlag) {
                this.setChannelId(channelId, () => {
                    this.loadingPresetData = true;
                    this.loadingTourData = true;
                    this.fetchPTZData()
                })
            }
        })
    },
    computed: {
        speed: {
            get() {
                return this.speedVal;
            },
            set(val) {
                this.speedVal = val;
            },
        },
        height: {
            get() {
                return 50;
            },
            set(val) {
                console.log(val);
            },
        },
        sharpness: {
            get() {
                return 50;
            },
            set(val) {
                console.log(val);
            },
        },
        chroma: {
            get() {
                return 50;
            },
            set(val) {
                console.log(val);
            },
        },
        saturation: {
            get() {
                return 50;
            },
            set(val) {
                console.log(val);
            },
        },
        contrast: {
            get() {
                return 50;
            },
            set(val) {
                console.log(val);
            },
        },
    },
    watch: {
        selectedChannelId(val) {
            if(val == 0) {
               this.presetList = [...Array(100).keys()].map(p => {return {index: p+1, name: `预置点${p+1}`}})
            }
        }
    },
    methods: {
        setChannelId(id, cb) {
            this.selectedChannelId = id || 0;
            cb && id && cb()
        },
        fetchPTZData() {
            getPresets(this.selectedChannelId).then(res => {
                if (res.data.code === 200000) {
                    let data = res.data.data;
                    this.presetList = data
                    this.loadingPresetData = false;
                } else {
                    this.loadingPresetData = false;
                }
            }).catch(e => {
                this.presetList = [...Array(100).keys()].map(p => {return {index: p+1, name: `预置点${p+1}`}})
                this.loadingPresetData = false
                if(e.response.data.code === 400306) {
                    this.$message.closeAll()
                }
            })
            queryTourByChannelId(this.selectedChannelId).then(res => {
                if (res.data.code === 200000) {
                    let data = res.data.data;
                    let { options, tours } = data;
                    this.tourOption = options
                    this.tourList = tours
                    this.loadingTourData = false;
                } else {
                    this.loadingTourData = false;
                }
            }).catch(e => {
                this.loadingTourData = false
                if(e.response.data.code === 400306) {
                    this.$message.closeAll()
                }
            })
            queryPatternByChannelId(this.selectedChannelId).then(res => {
                if (res.data.code === 200000) {
                    let data = res.data.data;
                    this.patternList = data.map(p => {
                        return {
                            index: p,
                            status: this.RECORDING_STATUS.NO_RECORDING
                        }
                    })
                    this.loadingPatternData = false;
                } else {
                    this.loadingPatternData = false;
                }
            }).catch(e => this.loadingPatternData = false)
        },
        callTrack(tour) {
            callTourByChannelId(this.selectedChannelId, { 
                index: tour.index,
                oper: this.CALL_OPERATION.START
             }).then(res => {
                if (res.data.code === 200000) {
                    this.$message.success(`调用巡航路径${tour.index}成功！`)
                }
             }).catch(e => this.$message.error('操作失败'))
        },
        stopTrack(tour) {
            callTourByChannelId(this.selectedChannelId, { 
                index: tour.index,
                oper: this.CALL_OPERATION.STOP
             }).then(res => {
                if (res.data.code === 200000) {
                    this.$message.success(`停止调用巡航路径${tour.index}成功！`)
                }
            }).catch(e => this.$message.error('操作失败'))
        },
        intoEditMode(selectedTour) {
            this.isEditTourMode = true
            this.selectedTourIndex = selectedTour.index;
            this.selectedPresetList = selectedTour.presetList || [];
        },
        exitEditMode() {
            if (this.isEditTourMode) {
                this.isEditTourMode = false;
                this.selectedPresetIndex = -1;
                this.tourList[this.selectedTourIndex].presetList = this.selectedPresetList;
            }
        },
        handlePresetSelected(index) {
            this.selectedPresetIndex = index;
        },
        onPercentChange(num){
            this.volumeNum = num
        },
        startMove(cmd) {
            if (this.selectedChannelId <= 0) {
                this.$message.warning("请选择一个通道");
                return;
            }
        
            let obj = {
                ctrlCmd:cmd,
                speed:this.speed
            }

            putPtzCtrl(this.selectedChannelId, obj);
        },
        stopMove(cmd) {
            if (this.selectedChannelId <= 0) {
                return;
            }
        
            let obj = {
                ctrlCmd:cmd,
                speed: 0
            }

            putPtzCtrl(this.selectedChannelId, obj);
        },
        selectPreset(i) {
            this.curPrestIndex = i;
        },
        selectTour(i) {
            this.selectedTourIndex = i;
        },
        selectTrack(i) {
            this.selectedTrackIndex = i;
        },
        setPreset(index, name) {
            setPreset(this.selectedChannelId, { index: index, name: name }).then(res => {
                if (res.data.code) {
                    this.$message.success("设置成功")
                }
            }).catch(e => this.$message.error('操作失败'))
        },
        gotoPreset(i) {
            gotoPreset(this.selectedChannelId, { index: i }).then(() => { }).catch(e => this.$message.error('操作失败'));
        },
        startRecording(i) {
            updatePatternByChannelId(this.selectedChannelId, { index: this.patternList[i].index, oper: this.CALL_OPERATION.START }).then(res => {
                if (res.data.code === 200000) {
                    this.patternList[i].status = this.RECORDING_STATUS.RECORDING;
                    this.$message.success(`开启录制轨迹${this.patternList[i].index}`)
                }
            }).catch(e => {
                this.$message.error('操作失败')
            })
        },
        endRecording(i) {
            updatePatternByChannelId(this.selectedChannelId, { index: this.patternList[i].index, oper: this.CALL_OPERATION.STOP }).then(res => {
                if (res.data.code === 200000) {
                    this.patternList[i].status = this.RECORDING_STATUS.STOPPED_RECORDING;
                    this.$message.success(`停止录制轨迹${this.patternList[i].index}`)
                }
            }).catch(e => {
                this.$message.error('操作失败')
            })
        },
        restartRecording(i) { 
            this.startRecording(i)
        },
        callPattern(i) {
            callPatternByChannelId(this.selectedChannelId, { index: this.patternList[i].index, oper: this.CALL_OPERATION.START }).then(res => {
                if (res.data.code === 200000) {
                    this.$message.success(`调用轨迹${this.patternList[i].index}成功`)
                }
            }).catch(e => {
                this.$message.error('操作失败')
            })
        },
        uncalledPattern(i) {
            callPatternByChannelId(this.selectedChannelId, { index: this.patternList[i].index, oper: this.CALL_OPERATION.STOP }).then(res => {
                if (res.data.code === 200000) {
                    this.$message.success(`停止调用轨迹${this.patternList[i].index}成功`)
                }
            }).catch(e => {
                this.$message.error('操作失败')
            })
        },
        onSelectTab(index) {
            this.selectedTabIndex = index;
            this.exitEditMode();
        },
        handlePresetDataMove(e) {
            this.selectedPresetIndex = e.newIndex;
            this.updateTourByChannelId()
        },
        updateTourByChannelId:
            debounce(function () {
                updateTourByChannelId(this.selectedChannelId, {
                    tour: {
                        ...this.tourList[this.selectedTourIndex],
                        presetList: this.selectedPresetList
                    }
                }).then(res => {
                    if (res.data.code === 200000) {
                        if (this.isBeingAdded) {
                            this.$message.success('添加成功')
                            this.isBeingAdded = false
                        }
                        if (this.isBeingDeleted) {
                            this.$message.success('删除成功')
                            this.isBeingDeleted = false
                        }
                    }
                }).catch(e => {
                    this.tourList[this.selectedTourIndex] = {
                        index: this.selectedTourIndex + 1,
                        presetList: []
                    }
                    this.selectedPresetList = []
                    this.isBeingAdded = false;
                    this.isBeingDeleted = false
                    this.$message.error('操作失败')
                })
            }, 500)
        ,
        cancelAddPreset() {
            this.newPresetDialogVisible = false;
            this.newPresetForm = {
                index: undefined,
                speed: undefined,
                stayTime: undefined
            }
        },
        cancelEditPreset() {
            this.editPresetDialogVisible = false;
            this.editPresetForm = {
                name: undefined,
                index: undefined
            }
        },
        confirmAddPreset() {
            this.$refs.newPresetForm.validate((valid) => {
                if (valid) {
                    this.selectedPresetList.push({
                        ...this.newPresetForm,
                        index: parseInt(this.newPresetForm.index),
                        speed: parseInt(this.newPresetForm.speed),
                        stayTime: parseInt(this.newPresetForm.stayTime),
                        name: this.presetList.find(p=> p.index==this.newPresetForm.index).name
                    })
                    this.tourList[this.selectedTourIndex].presetList = this.selectedPresetList
                    this.isBeingAdded = true;
                    this.updateTourByChannelId()
                    this.cancelAddPreset()
                }
            })
        },
        confirmEditPreset() {
            this.$refs.editPresetForm.validate((valid) => {
                if (valid) {
                    this.loadingPresetData = true;
                    this.loadingTourData = true;
                    editPresetByChannelId(this.selectedChannelId, this.editPresetForm).then(res => {
                        if (res.data.code === 200000) {
                            this.$message.success(`修改成功`)
                            this.fetchPTZData()
                        } else {
                            this.$message.error(`修改失败`)
                            this.loadingPresetData = false;
                            this.loadingTourData = false;
                        }
                    }).catch(e => {
                        this.$message.error('操作失败')
                        this.loadingPresetData = false;
                        this.loadingTourData = false;
                    })
                    this.cancelEditPreset()
                }
            })
        },
        deleteTour() {
            if (!(this.selectedPresetIndex > -1 && this.selectedPresetList.length > 0)) {
                return
            }
            this.selectedPresetList.splice(this.selectedPresetIndex, 1);
            this.selectedPresetIndex = -1;
            this.tourList[this.selectedTourIndex].presetList = this.selectedPresetList
            this.isBeingDeleted = true;
            this.updateTourByChannelId()
        },
        selectedTourMoveUp() {
            if (!(this.selectedPresetIndex > -1 && this.selectedPresetIndex !== 0)) {
                return
            }
            let index = this.selectedPresetIndex;
            let moveItem = this.selectedPresetList.splice(index, 1);
            moveItem.length > 0 && this.selectedPresetList.splice(index - 1, 0, moveItem[0])
            this.selectedPresetIndex = index - 1;
            this.tourList[this.selectedTourIndex].presetList = this.selectedPresetList
            this.updateTourByChannelId()
        },
        selectedTourMoveDown() {
            if (!(this.selectedPresetIndex > -1 && this.selectedPresetIndex+1 !== this.selectedPresetList.length)) {
                return
            }
            let index = this.selectedPresetIndex;
            let moveItem = this.selectedPresetList.splice(index, 1);
            moveItem.length > 0 && this.selectedPresetList.splice(index + 1, 0, moveItem[0])
            this.selectedPresetIndex = index + 1;
            this.tourList[this.selectedTourIndex].presetList = this.selectedPresetList
            this.updateTourByChannelId()
        },
        handleOpenPresetDialog(selectedPreset) {
            this.editPresetDialogVisible = true;
            this.editPresetForm = {
                ...selectedPreset,
                index: selectedPreset.index,
                name: selectedPreset.name,
            }
        }
    }
}
</script>
<style lang="less" scoped>
.control {
    width: 100%;
    height: 100%;
    background: linear-gradient(360deg, #024B87 0%, #033763 19%, #032E54 100%);
    box-shadow: inset -4px 4px 10px 0px rgba(17,148,255,0.31);
    border: 1px solid #1A4D91;
    color: rgba(255,255,255);
    font-size: 14px;
    display: flex;
    flex-direction: column;
    .name_con {
        padding-left: 10px;
        height: 42px;
        line-height: 42px;
        font-size: 18px;
        background: linear-gradient(270deg, rgba(0,81,124,0) 0%, #005FB4 100%);
    }
    .content {
        height: calc(100vh - 110px);
        overflow-y: auto;
    }
    ::-webkit-scrollbar {
        /*隐藏滚轮*/
        display: none;
    }
    .dome-box{
        width: 208px;
        height: 208px;
        border-radius: 50%;
        background: #00396A;
        margin: 15px;
        display: flex;
        justify-content: center;
        align-items: center;
        .dome {
            width: 183px;
            height: 183px;
            border-radius: 50%;
            background: #00447D;
            border: 2px solid #368df1;
            .pie {
                width: 183px;
                height: 183px;
                border-radius: 50%;
                overflow: hidden;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: center;
                li {
                    list-style: none;
                    cursor: pointer;
                    overflow: hidden;
                    width: 50px;
                    height: 50px;
                    .arrows {
                        width: 45px;
                        height: 45px;
                        margin-left: 2px;
                        margin-top: 2px;
                    }
                    .arrows1 {
                        width: 60px;
                        height: 60px;
                        margin-top: -3px;
                        margin-left: 0px;
                    }
                }
                li:nth-child(1) {
                    transform: translateX(50px);
                }
                li:nth-child(2) {
                    transform: translate(43px, 19px);
                }
                li:nth-child(3) {
                    transform: translate(14px, 66px);
                }
                li:nth-child(4) {
                    transform: translate(91px, 48px);
                }
                li:nth-child(5) {
                    transform: translate(4px, 66px);
                }
                li:nth-child(6) {
                    transform: translate(-98px, 49px);
                }
                li:nth-child(7) {
                    transform: translate(-38px, -55px);
                }
                li:nth-child(8) {
                    transform: translate(-76px, -103px);
                }
            }
            .center{
                width: 75px;
                height: 75px;
                margin-top: -128px;
                margin-left: 53px;
                display: flex;
                justify-content: center;
                align-items: center;
                border: 1px solid rgba(0,139,255, 0.2);
                border-radius: 50%;
                .center-1 {
                    height: 60px;
                    width: 60px;
                    border-radius: 50%;
                    background: linear-gradient(180deg, #126DB1 0%, #194275 100%);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 26px;
                    cursor: pointer;
                    .center-icon {
                        width: 1em;
                        height: 1em;
                    }
                }
            }
        }
    }
    .plus-minus-box {
        margin-left: 13px;
        margin-bottom: 10px;
        .plus-minus {
            margin-bottom: 20px;
            width: 212px;
            display: flex;
            justify-content: space-around;
            .plus-minus-item {
                width: 70px;
                height: 24px;
                background: #00447D;
                border-radius: 2px;
                border: 1px solid #0A56A2;
                text-align: center;
                cursor: pointer;
            }
            .plus-minus-item:hover {
                background: rgb(41, 97, 175);
            }
        }
    }

    .img-settings-box {
        width: 250px; 
        margin-top: 25px;
        .img-settings-item {
            background: #00447D;
            border-radius: 2px;
            border: 1px solid #0A56A2;
            width: 40px; 
            margin-left: 6px; 
            padding-top: 2px; 
            padding-bottom: 2px;
        }
        .img-settings-item:hover {
            background: #0063B5;
        }
    }

    .progress {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top:-15px;
        padding-bottom:10px;
        .progress_title {
            margin-left: 2px; 
            margin-right: 19px;
        }
        .progress_content {
            /deep/ .slider {
                width: 100px;
                height: 7px;
            }
            /deep/ .slider .process {
                height: 7px;
                background: linear-gradient(270deg, #006BE1 0%, #064D90 100%);
            }
            /deep/ .slider .thunk {
                top: -2px;
            }
            /deep/ .result {
                width: 41px;
                height: 24px;
                line-height: 24px;
                border: 1px solid #10538A;
                text-align: center;
            }
        }
    }
    .top_title {
        width: 226px;
        height: 38px;
        line-height: 38px;
        margin: 27px 10px;
        background: #00447D;
        border-radius: 2px;
        border: 1px solid #0A56A2;
        .head_icon {
            color:rgb(255, 255, 255); 
            margin: 0 5px -3px 58px;
        }
    }
    .top_settings {
        .empty-table {
            text-align: center;
            padding: 32px;
            color: #B8CBD6 ;
        }
        .title-box {
            margin-left: 10px;
            width: 226px;
            height: 48px;
            color: #B8CBD6;
            display: flex;
            justify-content: center;
            background: linear-gradient(180deg, rgba(0,83,156,0.37) 0%, rgba(0,83,156,0) 100%);
            .title {
                display: inline-block;
                padding: 0 21px;
                height: 48px;
                line-height: 48px;
                text-align: center;
                cursor: pointer;
                &::after {
                    content: "";
                    position: absolute;
                    width: 100%;
                    left: 0;
                    bottom: 0;
                    height: 2px;
                    color: #ECFDFF;
                    visibility:hidden; 
                    opacity:0;
                    transition: all 0.2s;
                    background: linear-gradient(270deg, rgba(0,116,226,0) 0%, #3DA0FF 50%, rgba(51,125,255,0) 100%);  
                }
            }
            .active {
                position: relative;
                &::after {
                    visibility:visible; opacity:1;
                }
            }
        }
        .top_content {
            overflow-y:auto;
            height:400px;
            .settings_item {
                height:40px; 
                line-height: 40px;
                font-size: 14px; 
                // cursor: pointer; 
                margin-left: 12px;
                margin-right: 14px;
                position: relative;
                .item_title {
                    margin-left: 20px; 
                    line-height: 30px; 
                    vertical-align: middle;
                    &+.options{
                        visibility:hidden;
                        position: absolute;
                        display: inline-block;
                        right: 0;
                    }
                }

                &:hover, &.hover{
                    background: #033E70;
                    .options{
                        visibility:visible;
                    }
                }
                i {
                    margin-right: 10px;
                    cursor: pointer;
                    text-align: center;
                    vertical-align: middle;
                }
                
            }
            &.ptz-tour-edit-content {
                .content-title{
                    display: inline;
                    span {
                        cursor: pointer;
                        padding: 0px 8px;
                        display: inline-flex;
                        justify-items: center;
                        margin: 0;
                        height: 28px;
                        line-height: 28px;
                        vertical-align: middle;
                        &:hover{
                            background-color: #1E4473;
                            border-radius: 3px;
                        }
                        i{
                            margin-right: 6px;
                        }
                    }
                    i{
                        vertical-align: middle;
                        line-height: inherit;
                    }
                }
                .content-options{
                    display: inline;
                    float: right;
                    i {
                        padding: 4px;
                        margin: 0 2px;
                        &:hover{
                            color: #5cb6ff;
                            background-color: #1E4473;
                            border-radius: 3px;
                        }
                        &.el-icon-delete:hover{
                            color: #ea4f3d;
                        }
                    }
                }
                i{
                    cursor: pointer;
                    font-size: 16px;
                    line-height: 20px;
                    display: inline-block;
                    vertical-align: sub;
                    &.disabled{
                        cursor: not-allowed;
                        color: rgb(170, 176, 187);
                        &:hover{
                            color: rgb(170, 176, 187)
                        }
                    }
                }
                .table {
                    width: 100%;
                    border-collapse: collapse;
                    text-indent: initial;
                    border-spacing: 0;
                    tbody{
                        text-align: center;
                        tr {
                            border-bottom: 1px solid  #1D3F67;
                            &:hover {
                                background-color: #1E4473;
                            }
                            &.active{
                                background-color: #1A4D91;
                            }
                        }
                        td {
                            width: 100px;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            padding: 10px 2px;
                            &.index {
                                width: 50px;
                            }
                            &.name {
                                width: 70px;
                                vertical-align: middle;
                                display: inline-flex;
                            }
                            &.name span {
                                width: 70px;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                overflow: hidden;
                                display: inline-block;
                            }
                            &.stay-time {
                                width: 85px;
                            }
                            &.speed {
                                width: 50px;
                            }
                        }
                    }
                    th, tr, td {
                        padding: 10px;
                    }
                }
                
                /deep/ .el-table, /deep/ .el-table tr, /deep/ .el-table th.el-table__cell{
                    background-color: transparent;
                }
                /deep/ .el-table {
                    color: #ECFDFF;
                }
                tbody tr, /deep/ .el-table__row {
                    cursor: move;
                }
                thead, /deep/ .el-table thead{
                    color: #B8CBD6 ;
                }
                /deep/ .el-table__body tr.current-row>td.el-table__cell {
                    background-color: #1A4D91;
                }
                /deep/ .el-table td.el-table__cell, /deep/ .el-table th.el-table__cell.is-leaf {
                    border-bottom:1px solid  #1D3F67;
                }
                /deep/ .el-table--border::after, /deep/ .el-table--group::after, /deep/ .el-table::before{
                    background-color: #1D3F67;
                }
                /deep/ .el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell {
                    background-color: #1E4473;
                }
                /deep/ .el-table .cell{
                    padding-left: 0;
                    padding-right: 0;
                }
            }
        }
    }

    .switch {
        width:100%;
        height: 90px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        .switch-item {
            width:110px;
            display: flex;
            .switch-name {
                width: 60px;
            }
        }
    }
}
</style>