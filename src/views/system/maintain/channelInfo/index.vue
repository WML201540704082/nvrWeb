<template>
    <div class="channel-info">
        <el-row class="info-container">
            <el-col :span="24">
                <el-col :span="12" class="info">
                    <el-col :span="24" class="grid-content bg-purple">
                    <el-col :span="24" class="info-title">主码流信息</el-col>
                    <el-col :span="6" class="info-section">
                        <el-col :span="24" class="col">
                            <span>分辨率 </span>
                            <span>{{mainObject.resolution}}</span>
                        </el-col>
                        <el-col :span="24" class="col">
                            <span>编码标准 </span>
                            <span>{{mainObject.vcodes}}</span>
                        </el-col>
                        <el-col :span="24" class="col">
                            <span>编码级别 </span>
                            <span>{{mainObject.profilecaps}}</span>
                        </el-col>
                    </el-col>
                    <el-col :span="6" class="info-section">
                        <el-col :span="24" class="col">
                            <span>视频码率 </span>
                            <span>{{mainObject.vBitrate}}</span>
                        </el-col>
                        <el-col :span="24" class="col">
                            <span>码率类型 </span>
                            <span>{{mainObject.bitrateTypes}}</span>
                        </el-col>
                        <el-col :span="24" class="col">
                            <span>码流类型 </span>
                            <span>{{mainObject.streamTypes}}</span>
                        </el-col>
                    </el-col>
                    <el-col :span="6" class="info-section">
                        <el-col :span="24" class="col">
                            <span>帧率 </span>
                            <span>{{mainObject.vFrameRate}}</span>
                        </el-col>
                        <el-col :span="24" class="col">
                            <span>I帧间隔 </span>
                            <span>{{mainObject.IFrameInterval}}</span>
                        </el-col>
                    </el-col>
                    <el-col :span="6" class="info-section">
                        <el-col :span="24" class="col">
                            <span>音频格式 </span>
                            <span>{{mainObject.acodes}}</span>
                        </el-col>
                        <el-col :span="24" class="col">
                            <span>音频码流 </span>
                            <span>{{mainObject.aBitrate}}</span>
                        </el-col>
                    </el-col>
                </el-col>
                </el-col>
                
                <el-col :span="12" :offset="0" class="info">
                    <el-col :span="24" class="grid-content bg-purple">
                    <el-col :span="24" class="info-title">子码流信息</el-col>
                    <el-col :span="6" class="info-section">
                        <el-col :span="24" class="col">
                            <span>分辨率 </span>
                            <span>{{subObject.resolution}}</span>
                        </el-col>
                        <el-col :span="24" class="col">
                            <span>编码标准 </span>
                            <span>{{subObject.vcodes}}</span>
                        </el-col>
                        <el-col :span="24" class="col">
                            <span>编码级别 </span>
                            <span>{{subObject.profilecaps}}</span>
                        </el-col>
                    </el-col>
                    <el-col :span="6" class="info-section">
                        <el-col :span="24" class="col">
                            <span>视频码率 </span>
                            <span>{{subObject.vBitrate}}</span>
                        </el-col>
                        <el-col :span="24" class="col">
                            <span>码率类型 </span>
                            <span>{{subObject.bitrateTypes}}</span>
                        </el-col>
                        <el-col :span="24" class="col">
                            <span>码流类型 </span>
                            <span>{{subObject.streamTypes}}</span>
                        </el-col>
                    </el-col>
                    <el-col :span="6" class="info-section">
                        <el-col :span="24" class="col">
                            <span>帧率 </span>
                            <span>{{subObject.vFrameRate}}</span>
                        </el-col>
                        <el-col :span="24" class="col">
                            <span>I帧间隔 </span>
                            <span>{{subObject.IFrameInterval}}</span>
                        </el-col>
                    </el-col>
                    <el-col :span="6" class="info-section">
                        <el-col :span="24" class="col">
                            <span>音频格式 </span>
                            <span>{{subObject.acodes}}</span>
                        </el-col>
                        <el-col :span="24" class="col">
                            <span>音频码流 </span>
                            <span>{{subObject.aBitrate}}</span>
                        </el-col>
                    </el-col>
                </el-col>
                </el-col>
                
            </el-col>
        </el-row>
        <div class="info-options" v-if="!isLocal">
            <el-button type="primary" size="small" @click="()=>this.$router.push('/storage/video/videoProgram')">
                录像计划界面入口
            </el-button>
            <el-button type="primary" size="small" @click="()=>this.$router.push('/channel/channelConfig')">
                通道配置界面入口
            </el-button>
        </div>
        <el-table
            size="mini"
            :data="channelList"
            tooltip-effect="dark"
            @row-click="channelClick"
            highlight-current-row
            :height="`${size.contentHeight - 320}`"
            style="width: 100%;min-height: 300px; max-height: calc(100vh - 320px);overflow: auto;margin-top: 10px;">
            <el-table-column
                type="index"
                label="序号"
                width="55">
            </el-table-column>
            <el-table-column
                prop="channelName"
                label="通道名称">
                <template slot-scope="scope">
                    <!--  -->
                    <tooltip-over
                        :content="scope.row.channelName"
                        class="channel_name"
                        refName="channelName"
                    ></tooltip-over>
                </template>
            </el-table-column>
            <el-table-column
                prop="ip"
                label="IP/域名">
            </el-table-column>
            <el-table-column
                prop="channel"
                label="通道号">
            </el-table-column>
            <el-table-column
                label="通道状态">
                <template slot-scope="scope">
                    <div class="status" :class="STATUS_MAP[scope.row.status]?.status"></div>
                    {{ STATUS_MAP[scope.row.status]?.label || '' }}
                </template>
            </el-table-column>
            <el-table-column
                label="录像状态">
                <template slot-scope="scope">
                    <!-- {{scope.row.recordState === 1 ? 'not enable' : scope.row.recordState === 2 ? 'media no ready' : scope.row.recordState === 3 ? 'not in the record plan' : 
                      scope.row.recordState === 4 ? 'recording' : scope.row.recordState === 5 ? 'stop record' : scope.row.recordState === 6 ? 'time mismatch' : 
                      scope.row.recordState === 7 ? 'no frame data' : ''}} -->
                      {{scope.row.recordState === 1 ? '未开启' : scope.row.recordState === 2 ? '未准备就绪' : scope.row.recordState === 3 ? '不在录像计划中' : 
                        scope.row.recordState === 4 ? '录像中' : scope.row.recordState === 5 ? '停止录像' : scope.row.recordState === 6 ? '时间不匹配' : 
                        scope.row.recordState === 7 ? '无数据' : ''}}
                </template>
            </el-table-column>
            <el-table-column
                label="手动录像状态">
                <template slot-scope="scope">
                    {{scope.row.recordStateManual === 20 ? '未就绪' :scope.row.recordStateManual === 21 ? '录像中' : scope.row.recordStateManual === 22 ? '停止' : scope.row.recordStateManual === 23 ? '无数据' : '异常'}}
                </template>
            </el-table-column>
            <el-table-column
                label="主码流分辨率">
                <template slot-scope="scope">
                    {{scope.row.streamInfo && scope.row.streamInfo[0] ? scope.row.streamInfo[0].resolution : ''}}
                </template>
            </el-table-column>
            <el-table-column
                label="子码流分辨率">
                <template slot-scope="scope">
                    <span v-if="scope.row.streamInfo">
                        {{scope.row.streamInfo && scope.row.streamInfo[1] ? scope.row.streamInfo[1].resolution : ''}}
                    </span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import { getChannelList,getVideoStatus } from '@/api';
import tooltipOver from "@/components/tooltipOver"
export default {
    inject: ["size"],
    components: {
        tooltipOver
    },
    data() {
        return {
            channelList: [],
            mainObject: {},
            subObject: {},
            STATUS_MAP: {
                0: {
                    label: '不在线',
                    status: 'danger'
                },
                1: {
                    label: '在线',
                    status: 'success'
                },
                2: {
                    label: '带宽不足',
                    status: 'warning'
                },
                3: {
                    label: 'mac校验失败',
                    status: 'warning'
                },
                4: {
                    label: '网络异常',
                    status: 'warning'
                },
                5: {
                    label: '用户名密码错误',
                    status: 'warning'
                },
                6: {
                    label: '正在连接',
                    status: 'info'
                },
            }
        }
    },
    created() {
        this.isLocal = JSON.parse(localStorage.getItem('isLocal'))
        this.getChannelList()
    },
    methods: {
        getChannelList() {
            getChannelList().then((res) => {
                if (res.data.code === 200000) {
                    console.log('res.data.data:',res.data.data);
                    this.channelList = res.data.data.map(item=>{
                        return {
                            ...item,
                            streamEnable: false,
                            eyeEnable: false,
                            channelName: item.channelType + item.channel + (!item.chanNameList ? '' : (item.chanNameList.length>0 ? item.chanNameList[0].channelName : '')),
                            recordState: ''
                        }
                    }) || []
                    console.log('this.channelList:',this.channelList);
                    setTimeout(this.getVideoStatus(),1000)
                }
            });
        },
        getVideoStatus() {
            getVideoStatus().then((res) => {
                if (res.data.code === 200000) {
                    for (let i = 0; i < this.channelList.length; i++) {
                        for (let j = 0; j < res.data.data.length; j++) {
                            if (this.channelList[i].channel == res.data.data[j].channel) {
                                this.channelList[i].recordState = res.data.data[j].recordState
                                this.channelList[i].recordStateManual = res.data.data[j].recordStateManual
                            }
                        }
                    }
                }
            });
        },
        // getVideoPlan() {
        //     for (let i = 0; i < this.channelList.length; i++) {
        //         getVideoPlan(this.channelList[i].channel).then((res) => {
        //         })
        //     }
        // },
        channelClick(row) {
            this.mainObject = row.streamInfo[0]
            if(row.streamInfo[1]){
                this.subObject = row.streamInfo[1]
            }else{
                this.subObject = {}
            }
        }
    }
}
</script>
<style lang="less" scoped>
.channel-info {
    .info-container {
        color: #000000;
        font-size: 12px;
        margin-bottom: 14px;
        .info {
            padding: 14px 10px;
            .grid-content {
                background-color: #F3F5F9;
                margin: -14px -10px;
                margin-right: 10px;
                padding: 14px;
            }
            .info-title {
                font-weight: 500;
                margin-bottom: 14px;
            }
            .col{
                margin-bottom: 12px;
            }
            .info-section {
                margin-right: 10px;
                height: 80px;
                padding-left: 10px;
                margin-left: -10px;
                border-right: 1px solid #E9E9E9;
                &:last-child {
                    border-color: transparent;
                }
                .col {
                    & > span{
                        color: #666666;
                    }
                }
            }
        }
    }
}

.status {
  width: 10px;
  height: 10px;
  display: inline-block;
  background: #909399;
  border: 2px solid #d3d4d6;
  border-radius: 50%;
  &.success {
    background: #67c23a;
    border-color: #c2e7b0;
  }
  &.warning {
    background: #e6a23c;
    border-color: #f5dab1;
  }
  &.danger {
    background: #f56c6c;
    border-color: #fbc4c4;
  }
}
</style>