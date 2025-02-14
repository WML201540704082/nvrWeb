<template>
    <el-dialog 
        title="锁定文件列表"
        width="800px"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        style="margin-top:-25px">
        <el-form :model="form" ref="form" label-width="80px" style="display:flex;margin-top: -20px;">
            <el-form-item label="通道:" prop="channel">
                <el-select v-model="form.channel" size="small" clearable>
                    <el-option v-for="(item,index) in channelList" :label="item.label" :value="item.value" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="position: absolute;right: 60px;">
                <el-button type="primary" icon="el-icon-search" size="small" @click="getLockList">搜索</el-button>
            </el-form-item>
        </el-form>
        <el-table
            size="mini"
            :data="lockList"
            tooltip-effect="dark"
            highlight-current-row
            style="width: 100%;height: 400px;overflow: auto;margin-top: 5px;">
            <el-table-column
                type="index"
                label="序号"
                width="55">
            </el-table-column>
            <el-table-column
                prop="channel"
                label="通道">
                <template slot-scope="scope">
                    <tooltip-over
                        :content="scope.row.channelName"
                        class="channel_name"
                        refName="channelName"
                    ></tooltip-over>
                </template>
            </el-table-column>
            <el-table-column
                prop="UserID"
                label="用户名">
                <template slot-scope="scope">
                    {{filterStatus(scope.row.userId, userData)}}
                </template>
            </el-table-column>
            <el-table-column
                label="文件性质">
                <template slot-scope="scope">
                    {{filterStatus(scope.row.fileType, fileTypeList)}}
                </template>
            </el-table-column>
            <el-table-column
                min-width="270px"
                label="锁定时间区间">
                <template slot-scope="scope">
                    {{'[' + scope.row.beginTime + ' , ' + scope.row.endTime + ']'}}
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                width="120">
                <template slot-scope="scope">
                    <span style="cursor: pointer;" @click="unLock(scope.row.id)">解锁</span>
                    <span style="color:green;padding-left: 20px;cursor: pointer;" @click="play(scope.row)">播放</span>
                </template>
            </el-table-column>
        </el-table>
        <play-video ref="video"></play-video>
        <dg-pagination :total="count" :currentPage="pageNum" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-dialog>
</template>
<script>
import dgPagination from '@/components/dg-pagination'
import { filterStatus } from '@/utils'
import moment from 'moment'
import { lockList, userList, unLock, getRecordChannelList } from '@/api'
import playVideo from '@/components/playVideo'
import tooltipOver from "@/components/tooltipOver"
export default {
    data () {
        return {
            dialogVisible: false,
            lockList: [],
            count: 0,
            pageSize: 20,
            pageNum: 1,
            filterStatus,
            fileTypeList: [{
                value: 0,
                label: '定时'
            },{
                value: 1,
                label: '报警'
            },{
                value: 2,
                label: '手动'
            }],
            userData: [],
            form: {
                channel: null,
                pageNum: 1,
                pageSize: 20,
            },
            channelList: []
        }
    },
    components: {
        dgPagination,
        playVideo,
        tooltipOver
    },
    methods: {
        init(channelId) {
            this.$nextTick(()=>{
                this.getUserList()
                this.getRecordChannelList()
                this.dialogVisible = true
                this.channelId = channelId
            })
        },
        // 获取用户管理列表
        getUserList(){
            userList().then(res => {
                if(res.data.code === 200000) {
                    this.userData = res.data.data.map(item=> {
                        return {
                            value: item.id,
                            label: item.userName
                        }
                    })
                }
            })
        },
        /**
         * 获取录像回放应展示的channelList
         */
        getRecordChannelList() {
            getRecordChannelList().then(res => {
                if (res.data.code === 200000) {
                    this.channelList = res.data.data.map(item => {
                        return {
                            value: item.channel,
                            label: item.channelType + item.channel + (!item.chanNameList ? '' : (item.chanNameList.length>0 ? item.chanNameList[0].channelName : ''))
                        }
                    }) || []
                    this.getLockList()
                }
            });
        },
        getLockList() {
            let params = {
                ...this.form,
                pageNum: this.pageNum,
                pageSize: this.pageSize
            }
            lockList(params).then((res) => {
                if (res.data.code === 200000) {
                    this.lockList = res.data.data.map(item => {
                        return {
                            ...item,
                            beginTime: moment(item.beginTime).format("YYYY-MM-DD HH:mm:ss"),
                            endTime: moment(item.endTime).format("YYYY-MM-DD HH:mm:ss"),
                            channelName: this.filterStatus(item.channel, this.channelList)
                        }
                    })
                    this.count = res.data.count
                }
            })
        },
        // 分页
        pagination_event(val) {
            this.pageSize = val.pageSize
            this.pageNum = val.currentPage
            this.getLockList()
        },
        unLock(id) {
            unLock(id).then(res => {
                if (res.data.code === 200000) {
                    this.getLockList()
                    this.$message.success('解锁成功！')
                }
            }).catch(err => {
                this.$message.error('解锁失败，内部处理错误')
            })
        },
        play(row) {
            let changeRow = {
                channelID: row.channel,
			    videoStartTime: row.beginTime,
			    videoEndTime: row.endTime,
                fileType: row.fileType
            }
            this.$nextTick(()=>{
                this.$refs['video'].init(changeRow,'lock')
            })
        },
        closeDialog() {
            this.dialogVisible = false
        },
    },
}
</script>
<style lang="less" scoped>
</style>
  