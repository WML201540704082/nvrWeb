<template>
    <div>
        <el-table
            size="mini"
            :data="logList"
            tooltip-effect="dark"
            highlight-current-row
            style="width: 100%;min-height: 300px; max-height: calc(100vh - 180px);overflow: auto;margin-top: 5px;">
            <el-table-column
                type="index"
                label="序号"
                width="55">
            </el-table-column>
            <el-table-column
                prop="Module"
                label="通道名称">
            </el-table-column>
            <el-table-column
                prop="IP"
                label="IP">
            </el-table-column>
            <el-table-column
                label="录像状态">
                <template slot-scope="scope">
                    {{scope.row.startTime + ' -- ' + scope.row.endTime}}
                </template>
            </el-table-column>
            <el-table-column
                prop="UserID"
                label="主屏分辨率">
            </el-table-column>
            <el-table-column
                prop="level"
                label="子屏分辨率">
            </el-table-column>
            <el-table-column
                label="问题视频">
                <template slot-scope="scope">
                    <span @click="play(scope.row)">播放</span>
                </template>
            </el-table-column>
        </el-table>
        <dg-pagination :total="count" :currentPage="pageNum" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </div>
</template>
<script>
import { getLogList } from '@/api';
import dgPagination from '@/components/dg-pagination'
export default {
    data() {
        return {
            logList: [],
            count: 0,
            pageSize: 20,
            pageNum: 1,
            form: {
                time: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
            }
        }
    },
    components: {
        dgPagination,
    },
    created() {
        this.getLogList()
    },
    methods: {
        getLogList() {
            getLogList({
                pageSize: this.pageSize,
                pageNum: this.pageNum,
            }).then((res) => {
                if (res.data.code === 200000) {
                    this.logList = res.data.data
                    this.count = res.data.count
                }
            });
        },
        play(row) {

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