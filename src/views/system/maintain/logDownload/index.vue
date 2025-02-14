<template>
    <div>
        <el-form :model="form" ref="form" label-width="80px" style="display:flex;">
            <el-form-item label="起止时间:" prop="time">
                <el-date-picker v-model="form.startTime"
                              type="datetime"
                              size="mini"
                              class="ml10"
                              @change="startTimeChange"
                              :picker-options="pickerOptionsStart"
                              placeholder="选择开始时间"
              ></el-date-picker>
              <span style="margin:0 3px;">-</span>
              <el-date-picker v-model="form.endTime"
                              type="datetime"
                              size="mini"
                              class="ml10"
                              @change="endTimeChange"
                              :picker-options="pickerOptionsEnd"
                              placeholder="选择结束时间"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="类型:" prop="level">
                <el-select v-model="form.level" size="small" clearable>
                    <el-option v-for="(item,index) in levelList" :label="item.label" :value="item.value" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="position: absolute;right: 60px;">
                <el-button type="primary" icon="el-icon-search" size="small" @click="searchLogList">搜索</el-button>
                <el-button icon="el-icon-download" size="small" @click="download" v-if="!isLocal">下载</el-button>
            </el-form-item>
        </el-form>
        <el-table
            size="mini"
            :data="logList"
            tooltip-effect="dark"
            highlight-current-row
            style="width: 100%;height: calc(100vh - 230px);overflow: auto;margin-top: 5px;">
            <el-table-column
                type="index"
                label="序号"
                width="55">
            </el-table-column>
            <el-table-column
                prop="IP"
                label="IP">
                <template slot-scope="scope">
                    {{scope.row.IP == '::1' ? '127.0.0.1' : scope.row.IP}}
                </template>
            </el-table-column>
            <el-table-column
                prop="Module"
                label="模块">
            </el-table-column>
            <el-table-column
                prop="UserID"
                label="用户名">
                <template slot-scope="scope">
                    {{filterStatus(scope.row.UserID, userData)}}
                </template>
            </el-table-column>
            <el-table-column
                label="类型">
                <template slot-scope="scope">
                    {{filterStatus(scope.row.level, levelList)}}
                </template>
            </el-table-column>
            <el-table-column
                min-width="300px"
                label="时间区间">
                <template slot-scope="scope">
                    {{'[' + scope.row.startTime + ' , ' + scope.row.endTime + ']'}}
                </template>
            </el-table-column>
            <el-table-column
                prop="Content"
                label="内容">
            </el-table-column>
            <el-table-column
                prop=""
                label="通道ID">
                <template slot-scope="scope">
                    {{scope.row.ChID || ''}}
                </template>
            </el-table-column>
        </el-table>
        <dg-pagination :total="count" :currentPage="pageNum" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </div>
</template>
<script>
import { getLogList, userList, downloadLog } from '@/api';
import dgPagination from '@/components/dg-pagination'
import { filterStatus } from '@/utils'
import moment from 'moment'
export default {
    data() {
        return {
            isLocal: false, //是否是本地
            filterStatus,
            logList: [],
            count: 0,
            pageSize: 20,
            pageNum: 1,
            form: {
                startTime: new Date(moment().add(-7, 'd')),
                endTime: new Date(),
                label: null
            },
            userData: [],
            levelList: [{
                value: 1,
                label: '信息'
            },{
                value: 2,
                label: '操作'
            },{
                value: 3,
                label: '报警'
            },{
                value: 4,
                label: '报错'
            },{
                value: 5,
                label: '事件'
            }],
            pickerOptionsStart: {
                disabledDate: time => {
                    if (this.form.endTime) {
                        return time.getTime() - 86400000 > new Date(this.form.endTime).getTime() || time.getTime() > Date.now()
                    } else {
                        return time.getTime() > Date.now()
                    }
                }
            },
            pickerOptionsEnd: {
                disabledDate: time => {
                    if (this.form.startTime) {
                        return time.getTime() < new Date(this.form.startTime).getTime() - 86400000 || time.getTime() > Date.now()
                    } else {
                        return time.getTime() > Date.now()
                    }
                }
            },
        }
    },
    components: {
        dgPagination,
    },
    created() {
        this.isLocal = JSON.parse(localStorage.getItem('isLocal'))
        if (this.isLocal) {
            this.form.startTime = new Date(moment().add(-7, 'd').add(8,'hours')),
            this.form.endTime = moment(new Date()).add(8,'hours')
        }
        this.getUserList()
        this.getLogList()
    },
    methods: {
        startTimeChange() {
            let _this = this
            if (this.isLocal) {
                let _button = document.getElementsByClassName('el-picker-panel__link-btn')?.[0] || null
                if(_button) {
                    _button.onclick = function() {
                        _this.form.startTime = moment(_this.form.startTime).add(8, 'hours').format('YYYY-MM-DD HH:mm:ss')
                    }()
                }
            }
        },
        endTimeChange() {
            let _this = this
            if (this.isLocal) {
                let _button = document.getElementsByClassName('el-picker-panel__link-btn')?.[0] || null
                if(_button) {
                    _button.onclick = function() {
                        _this.form.endTime = moment(_this.form.endTime).add(8, 'hours').format('YYYY-MM-DD HH:mm:ss')
                    }()
                }
            }
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
        searchLogList() {
            this.pageNum = 1
            this.getLogList()
        },
        download() {
            let params = {
                startTime: this.form.startTime ? moment(this.form.startTime).subtract(8, "hours").format('YYYY-MM-DD HH:mm:ss') : null,
                endTime: this.form.endTime ? moment(this.form.endTime).subtract(8, "hours").format('YYYY-MM-DD HH:mm:ss') : null,
                level: this.form.level,
            }
            downloadLog(params).then((res) => {
                const blob = new Blob([res.data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.style.display = "none";
                a.download = "设备日志_"+moment(new Date()).format('YYYYMMDDHHmmss') + ".xlsx";
                const event = new MouseEvent('click');
                a.dispatchEvent(event);
            });
        },
        getLogList() {
            let params = {
                startTime: this.form.startTime ? moment(this.form.startTime).subtract(8, "hours").format('YYYY-MM-DD HH:mm:ss') : null,
                endTime: this.form.endTime ? moment(this.form.endTime).subtract(8, "hours").format('YYYY-MM-DD HH:mm:ss') : null,
                level: this.form.level,
                pageSize: this.pageSize,
                pageNum: this.pageNum,
            }
            getLogList(params).then((res) => {
                if (res.data.code === 200000) {
                    this.logList = res.data.data.map(item => {
                        return {
                            ...item,
                            startTime: moment(item.startTime).add(8, "hours").format("YYYY-MM-DD HH:mm:ss"),
                            endTime: moment(item.endTime).add(8, "hours").format("YYYY-MM-DD HH:mm:ss")
                        }
                    })
                    this.count = res.data.count
                }
            });
        },
        // 分页
        pagination_event(val) {
            this.pageSize = val.pageSize
            this.pageNum = val.currentPage
            this.getLogList()
        },
    }
}
</script>