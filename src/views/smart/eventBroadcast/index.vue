<template>
    <div class="event-broadcast">
        <div class="top_left">
            <div style="width:90px">普通事件</div>
            <div class="select-box">
                <el-checkbox class="select-all" :indeterminate="isCommonIndeterminate" v-model="checkCommonAll" @change="commonAllChange">全选</el-checkbox>
                <el-checkbox-group v-model="checkedCommonItems" @change="commonItemsChange">
                    <el-checkbox v-for="(item,index) in commonItems" :label="item.value" :key="index">{{item.label}}</el-checkbox>
                </el-checkbox-group>
            </div>
        </div>
        <div class="top_left" style="border-bottom: 1px solid #9ca9be;">
            <div style="width:90px">Smart事件</div>
            <div class="select-box">
                <el-checkbox class="select-all" :indeterminate="isSmartIndeterminate" v-model="checkSmartAll" @change="smartAllChange">全选</el-checkbox>
                <el-checkbox-group v-model="checkedSmartItems" @change="smartItemsChange">
                    <el-checkbox v-for="(item,index) in smartItems" :label="item.value" :key="index">{{item.label}}</el-checkbox>
                </el-checkbox-group>
            </div>
        </div>
        <div>
            <el-table
                size="mini"
                :data="eventData"
                tooltip-effect="dark"
                style="width: 100%;min-height: 300px; max-height: calc(100vh - 340px);overflow: auto;margin-top: 5px;">
                <el-table-column
                    type="index"
                    label="序号"
                    width="55">
                </el-table-column>
                <el-table-column
                    label="报警产生时间"
                    min-width="150">
                    <template slot-scope="scope">
                        <span :style="{color:scope.row.mark ? 'red' : ''}">{{scope.row.detectTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="报警类别"
                    min-width="100">
                    <template slot-scope="scope">
                        <span :style="{color:scope.row.mark ? 'red' : ''}">{{scope.row.type}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="详细信息"
                    min-width="300">
                    <template slot-scope="scope">
                        <span :style="{color:scope.row.mark ? 'red' : ''}">{{scope.row.detailName}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="通道号"
                    min-width="80">
                    <template slot-scope="scope">
                        <span :style="{color:scope.row.mark ? 'red' : ''}">{{scope.row.channelID || '/'}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="185">
                    <template slot-scope="scope">
                        <span :style="{color:scope.row.mark ? 'red' : '',cursor: 'pointer'}" @click="signRed(scope.row.id,scope.row.mark)">{{scope.row.mark ? '取消标记' : '标记'}}</span>
                        <span style="padding-left:20px;cursor:pointer;" @click="viewDetails(eventData,scope.$index)">查看详情</span>
                        <span v-if="scope.row.linkageVideos && scope.row.linkageVideos.length>0" style="color:green;padding-left: 20px;cursor: pointer;" @click="play(scope.row)">播放</span>
                    </template>
                </el-table-column>
            </el-table>
            <dg-pagination :total="count" :currentPage="pageNum" :pageSize="pageSize" @updatePagination="pagination_event"/>
        </div>
        <play-video ref="video"></play-video>
        <detail ref="detail"></detail>
    </div>
</template>
<script>
import dgPagination from '@/components/dg-pagination'
import { eventBroadcast,eventMark } from '@/api'
import { filterStatus } from '@/utils'
import playVideo from '@/components/playVideo'
import detail from './detail'
import moment from 'moment'
export default {
    name: 'EventBroadcast',
    data() {
        return {
            filterStatus,
            checkCommonAll: true,
            checkedCommonItems: [],
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
                label: '人脸告警',
                value: 'faceAlert'
            },{
                label: '机动车告警',
                value: 'vehicleAlert'
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
            count: 0,
            pageSize: 20,
            pageNum: 1,
        }
    },
    components: {
        playVideo,
        dgPagination,
        detail
    },
    created() {
        this.checkedCommonItems = this.commonItems.map(item=>item.value);
        this.isCommonIndeterminate = false;
        this.checkedSmartItems = this.smartItems.map(item=>item.value);
        this.isSmartIndeterminate = false;
        this.allItems = this.commonItems.concat(this.smartItems)
        this.getEventList()
    },
    methods: {
        async getEventList() {
            let params = {
                events: this.checkedCommonItems.concat(this.checkedSmartItems),
                pageSize: this.pageSize,
                pageNum: this.pageNum,
            }
            const { data } = await eventBroadcast(params)
            if (data.code == 200000) {
                this.eventData = data.data.map(item=>{
                    return {
                        ...item,
                        type: (item.type == 'diskFull' || item.type == 'ipConflict' || item.type == 'cableDisconnect' || item.type == 'cpuOverheat' || 
                                item.type == 'fanFaliure' || item.type == 'diskFaliure' || item.type == 'illegalAccess') ? 
                                ('异常事件' + ' -- ' + filterStatus(item.type, this.exceptItems)) : 
                                filterStatus(item.type, this.allItems),
                        detectTime: moment(item.detectTime).add(8, "hours").format('YYYY-MM-DD HH:mm:ss'),
                        videoStartTime: (item.linkageVideos && item.linkageVideos[0]) ? moment(item.linkageVideos[0].start).add(8, "hours").format('YYYY-MM-DD HH:mm:ss') : null,
                        videoEndTime: (item.linkageVideos && item.linkageVideos[0]) ? moment(item.linkageVideos[0].end).add(8, "hours").format('YYYY-MM-DD HH:mm:ss') : null,
                        detailName: (item.type == 'diskFull' || item.type == 'ipConflict' || item.type == 'cableDisconnect' || item.type == 'cpuOverheat' || 
                                item.type == 'fanFaliure' || item.type == 'diskFaliure' || item.type == 'illegalAccess') ?
                                item.details.content : ((item.linkageVideos && item.linkageVideos[0]) ? 
                                                        (moment(item.linkageVideos[0].start).add(8, "hours").format('YYYY-MM-DD HH:mm:ss') + ' -- ' + 
                                                        (moment(item.linkageVideos[0].end).add(8, "hours").format('YYYY-MM-DD HH:mm:ss'))) : null)
                    }
                })
                this.count = data.count
            } else {
                this.$message.error(data.message)
            }
        },
        // 分页
        pagination_event(val) {
            this.pageSize = val.pageSize
            this.pageNum = val.currentPage
            this.getEventList()
        },
        commonAllChange(val) {
            this.checkedCommonItems = val ? this.commonItems.map(item=>item.value) : [];
            this.isCommonIndeterminate = false;
            this.getEventList()
        },
        commonItemsChange(value) {
            let checkedCount = value.length;
            this.checkCommonAll = checkedCount === this.commonItems.length;
            this.isCommonIndeterminate = checkedCount > 0 && checkedCount < this.commonItems.length;
            this.getEventList()
        },
        smartAllChange(val) {
            this.checkedSmartItems = val ? this.smartItems.map(item=>item.value) : [];
            this.isSmartIndeterminate = false;
            this.getEventList()
        },
        smartItemsChange(value) {
            let checkedCount = value.length;
            this.checkSmartAll = checkedCount === this.smartItems.length;
            this.isSmartIndeterminate = checkedCount > 0 && checkedCount < this.smartItems.length;
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
    background: gray;
    height: calc(100vh - 130px);
    .select-box {
        display: flex;
        width: calc(100% - 90px);
    }
    .select-all {
        margin-right: 30px;
    }
}
.top_left {
    display: flex;
    flex-direction: row;
    padding-bottom: 10px;
}
</style>