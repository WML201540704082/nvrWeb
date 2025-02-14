<template>
    <div class="alg">
        <div class="alg-left">
            <div class="alg-left-top">
                <div class="alg-left-top-left">
                    <el-input
                        size="small"
                        placeholder="算法名称/类型"
                        prefix-icon="el-icon-search"
                        v-model="searchVal"
                        @keyup.enter.native = "getAlgDataList">
                    </el-input>
                </div>
                <div class="alg-left-top-right">
                    <el-button type="primary" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="数据恢复中，请勿操作" :disabled="disableReset" size="small" icon="el-icon-refresh-right" @click="resetAlg">恢复默认</el-button>
                    <el-button type="primary" size="small" icon="el-icon-plus" @click="showAddAlg">新增算法</el-button>
                </div>
            </div>

            <el-table
                ref="algTable"
                :data="algTableData"
                :header-cell-style="tableHeaderColor"
                :cell-style="cellStyle"
                @current-change="handleCurrentChange"
                size="medium"
                stripe
                highlight-current-row
                @click.stop
                class="alg-left-table">
                <el-table-column type="index" prop="index" width="50" label="序号">
                    <template slot-scope="scope">
                        <span>{{scope.$index + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="算法名称" align="center" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="owner" label="提供厂商" align="center" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="algType" label="类型" align="center" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="version" label="版本号" align="center" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="status" label="状态" align="center" :show-overflow-tooltip="true">
                     <template slot-scope="scope">
                        <div v-if="scope.row.status == '0'">
                            <i class="iconfont" style="margin-right:3px;color:#00ffc6">&#xe7c2;</i>正常
                        </div>
                        <div v-else-if="scope.row.status == '1'">
                            <i class="iconfont" style="margin-right:3px;color:#939695">&#xe7c2;</i>停用
                        </div>
                        <div v-else>
                            <i class="iconfont" style="margin-right:3px;color:#b3161c">&#xe7c2;</i>异常
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120" align="center">
                    <template slot-scope="scope">
                        <el-tooltip class="ml10" content="编辑" placement="top" :hide-after="hideAfter">
                        <el-button type="text" @click="algTableEdit(scope.row)">
                            <i class="iconfont" style="color:#3A74FF;font-size:12px">&#xe610;</i></el-button>
                        </el-tooltip>
                        <el-tooltip class="ml10" content="删除" placement="top" :hide-after="hideAfter">
                        <el-button type="text" @click="algTableDelete(scope.$index, scope.row)">
                            <i class="iconfont" style="color:#ff3a4a;font-size:12px">&#xe62c;</i></el-button>
                        </el-tooltip>
                        <el-switch @change="switchEnable(scope.row)"
                            active-value="0"
                            inactive-value="1"
                            size="mini"
                            :disabled="!scope.row.version"
                            :value="scope.row.status"
                            active-color="#3A74FF"
                            inactive-color="#909399"
                        ></el-switch>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="alg-right">
            <div class="alg-right-top">
                <div style="float: right">
                    <el-button type="primary" size="small" icon="el-icon-plus" @click="showAddVer">上传版本</el-button>
                </div>
            </div>

            <el-table
                :data="verTableData"
                :header-cell-style="tableHeaderColor"
                :cell-style="cellStyleVer"
                size="medium"
                stripe
                highlight-current-row
                @current-change="handleCurrentVerChange"
                class="alg-right-table">
                <el-table-column prop="index" width="50" label="序号">
                    <template slot-scope="scope">
                        <span>{{scope.$index + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="version" label="版本号" align="center" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="createdAt" label="上传时间" align="center" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="status" label="操作" align="center" :show-overflow-tooltip="true">
                     <template slot-scope="scope">
                        <div v-if="scope.row.status == '0'">
                            当前版本
                        </div>
                        <div v-else>
                            <el-tooltip class="ml10" content="切换" placement="top" :hide-after="hideAfter">
                            <el-button type="text" @click="verTableChange(scope.$index, scope.row)" style="height: 23px; padding-top: 0px;">
                                <svg-icon icon="update-alg" class="update-alg"></svg-icon>
                            </el-button>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div v-if="isShowModels" class="alg-right-ver-details">
                <div class="alg-right-ver-details-title">模型列表</div>
                <span v-for="item in verModelList" :key="item" class="alg-right-ver-details-item">{{ item }}</span>
            </div>
            <!-- <dg-pagination :total="count" :currentPage="pageNum" :pageSize="pageSize"/> -->
        </div>
        <!-- 弹框表单 -->
        <dialogs
            :algConfig="algConfig"
            :dialogVisible="dialogVisible"
            :dialogTitle="dialogTitle"
            :formData="formData"
            :currentAlg="selectedAlgData"
            @close="handleClose"
            @getAlgTableData="getAlgDataList"
        >
        </dialogs>
        <ver-dialog
            :algConfig="algConfig"
            :dialogVisible="verDialogVisible"
            :dialogTitle="verDialogTitle"
            :formData="verFormData"
            @close="handleVerClose"
            @getVerTableData="getVerDataList"
        >
        </ver-dialog>
    </div>
</template>
<script>

import Dialogs from "./alg";
import VerDialog from "./algver";
import { algApi } from '@/api/intel.js'
import moment from 'moment'
import { debounce } from "@/utils/debounce.js";
import { getChannels } from '@/api/systemAPI';

export default {
    name: 'Alg',
    data() {
        return {
            hideAfter: 500,
            searchVal: "",
            selectedAlgData: null,
            algConfig: {},
            algTableData: [],
            verTableData: [],
            // 弹框-算法
            dialogVisible: false,
            dialogTitle: "新增算法",
            formData: {},
            currentName: "",
            size: {
                contentWidth: window.innerWidth,
                contentHeight: window.innerHeight
            },
            // 弹框-版本
            verDialogVisible: false,
            verDialogTitle: "上传版本",
            verFormData: {},
            verModelList: [],
            isShowModels: false,
            disableReset: false,
            fullscreenLoading: false,
        }
    },
    components: {
        Dialogs,
        VerDialog
    },
    created () {
        this.getAlgConfig();
        // 搜索500ms延时
        this.$watch(
        "searchVal",
        debounce(newQuery => {
            this.getAlgDataList();
        }, 500)
        );
    },
    methods: {
        // 表头颜色
        tableHeaderColor ({row, column, rowIndex, columnIndex}) {
            if (rowIndex === 0) {
                return  'background-color:rgba(58,116,255,0.05);' +
                        'box-shadow:0px -1px 0px 0px rgba(235,238,245,1);' +
                        'color:rgba(0,0,0,0.85);' +
                        'font-weight:500;' +
                        'font-size:12px;' +
                        'border:0;' +
                        'border-bottom: 1px solid #ebeef5;' +
                        'height:22px;' +
                        'line-height:22px'
            }
        },
        // 表格颜色
        cellStyle (row, column, rowIndex, columnIndex) {
            return 'font-size:12px;' +
            'border: none;' +
            'border-bottom: 1px solid #ebeef5;' +
            'padding: 0 7px;'
        },
        cellStyleVer (row, column, rowIndex, columnIndex) {
            return 'font-size:12px;' +
            'border: none;' +
            'border-bottom: 1px solid #ebeef5;' +
            'padding: 7px;'
        },
        setAlgCurrent(row) {
            console.log('*************************setAlgCurrent:', row);
            this.$refs.algTable.setCurrentRow(row);
        },
        handleCurrentChange(val) {
            console.log('*************************handleRow:', val);
            this.selectedAlgData = val;
            this.getVerDataList(1, val);
        },
        handleCurrentVerChange(val) {
            this.isShowModels = false
            console.log('*************************handleVerRow:', val);
            this.getVerModelList(val.id);
        },
        async getVerModelList(id) {
            const { data } = await algApi.getVerModels(id)
            if (data.code == 200000) {
                this.isShowModels = true
                this.verModelList = data.data
            } else {
                this.$message.error(data.message)
            }
        },
        async getAlgConfig() {
            const params = {}
            const { data } = await algApi.Config(params)
            if (data.code == 200000) {
                this.algConfig = data.data
                this.algTypeMap = new Map()
                this.algConfig.algTypes.map(item => {
                    this.algTypeMap.set(item.code, item.name)
                })
            } else {
                this.$message.error(data.message)
            }
            this.getAlgDataList();
        },
        resetAlg() {
            this.$confirm('恢复默认操作，将会清空除当前版本外所有过往上传的算法包，是否继续?<br/>恢复时间约3min过程中不建议终止操作', '恢复默认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                dangerouslyUseHTMLString: true,
                type: 'warning'
            }).then(() => {
                this.disableReset = true
                this.fullscreenLoading = true;
                algApi.Reset().then(res => {
                    if(res.data.code === 200000) {
                        this.fullscreenLoading = false;
                        this.disableReset = false
                        this.$message.success('恢复默认成功')
                        location.reload()
                    }
                }).catch(err => {
                    this.disableReset = false
                    this.$message.error('恢复默认失败')
                })
            })
        },
        async getAlgDataList() {
            const { data } = await algApi.Get('')
            if (data.code == 200000) {
                this.algTableData = data.data.map(item => {
                    return {
                        ...item,
                        algType: this.algTypeMap ? this.algTypeMap.get(item.type) : item.type
                    }
                })
                if(this.searchVal) {
                    this.algTableData = this.algTableData.filter(item => {
                        return item.name.includes(this.searchVal) || item.algType.includes(this.searchVal)
                    })
                }
                console.log('*************************this.algTableData:', this.algTableData)
                if (data.data.length > 0 ) {
                    this.getVerDataList(0, this.algTableData[0]);
                }
            } else {
                this.$message.error(data.message)
            }
        },
        async getVerDataList(rowIndex, algRow) {
            console.log('*************************this.getVerDataList0:', algRow, rowIndex)
            const { data } = algRow ? await algApi.GetVersion(algRow.id) : {}
            if (data) {
                if (data.code == 200000) {
                    this.verTableData = data.data.map(item => {
                        return {
                            ...item,
                            createdAt: moment(item.createdAt).add(8, "hours").format('YYYY-MM-DD HH:mm:ss')
                        }
                    })
                    console.log('*************************this.verTableData:', this.verTableData)
                    if (rowIndex == 0 ) {
                        this.setAlgCurrent(algRow);
                    }
                } else {
                    this.$message.error(data.message)
                }
            } else {
                this.verTableData = []
            }
        },
        algTableEdit(row) {
            this.dialogVisible = true;
            this.dialogTitle = "修改算法";
            this.formData = { id: row.id, name: row.name, owner: row.owner, type: row.type, status: row.status };
            this.$set(this.formData);
        },
        algTableDelete(index, row) {
            this.switchEnable(row, true)
        },
        nonChannelDelete(row) {
            this.$confirm(
                "是否确认删除算法",
                "算法删除",
                {
                    confirmButtonText: this.$t("confirm")
                }
            ).then(() => {
                algApi.Delete(row.id).then(res => {
                    this.$message.success("删除算法成功!");
                    this.getAlgDataList();
                });
            });
        },
        // algTableStop(index, row) {
        //     this.$confirm(
        //         "是否确认停用算法",
        //         "算法停用",
        //         {
        //             confirmButtonText: this.$t("confirm")
        //         }
        //     ).then(() => {
        //         var params = {id:row.id, type:row.type, name:row.name}
        //         algApi.Put(row.id, params).then(res => {
        //         this.getAlgDataList();
        //         this.$message.success("停用算法成功!");
        //         });
        //     });
        // },
        deleteAlg(row) {
            algApi.Delete(row.id).then(res => {
                this.$message.success("删除算法成功!");
                this.getAlgDataList();
            });
        },
        changeStatus(row) {
            row.status = row.status == '0' ? '1' : '0'
            var msg = ""
            if (row.status === "1") {
                msg = "算法已停用!"
            } else {
                msg = "算法已启用!"
            }
            var params = {id:row.id, type:row.type, name:row.name, owner: row.owner, status: row.status}
            algApi.Put(row.id, params).then(res => {
                this.$message.success(msg);
                // this.getAlgDataList();
            }).catch(err => {
                row.status = err.response.data.data.status
                this.$message.warning(err.response.data.data.msg)
            })
        },
        confirmChange(row, isDeleteAlg) {
            let text = isDeleteAlg ? '删除' : '关闭'
            this.$confirm('当前已有通道开启了该算法，确定要' + text + '吗？', '警告', {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                isDeleteAlg ? this.deleteAlg(row) : this.changeStatus(row)
            }).catch(()=>{
            }).catch(() => {
            
            });
        },
        switchEnable (row, isDelete = false) {
            // 判断当前算法是否有通道已开启，有的话增加提示
            getChannels().then(res => {
                let channels = res.data.data
                channels = channels.filter(item => {
                    return item.isBound
                })
                this.isAlgHaveChannel = false
                channels.map(item => {
                    let channelAlgEnabled = item.config[row.type].enabled
                    if( channelAlgEnabled == true) {
                        this.isAlgHaveChannel = true
                    }
                })
                if(isDelete) {
                    this.isAlgHaveChannel && row.status == '0' ? this.confirmChange(row, isDelete) : this.nonChannelDelete(row)
                } else {
                    this.isAlgHaveChannel && row.status == '0' ? this.confirmChange(row, isDelete) : this.changeStatus(row)
                }
            })
            console.log('*************************this.switchEnable:', row)
            
        },
        showAddAlg() {
            this.dialogVisible = true;
            this.dialogTitle = "添加算法";
            this.formData = { name:"", owner:"格灵深瞳", type:"face" };
            this.$set(this.formData);
        },
        showAddVer() {
            this.verDialogVisible = true;
            this.verDialogTitle = "上传版本";
            this.verFormData = { 
                alg: {
                    id: this.selectedAlgData.id,
                    name: this.selectedAlgData.name,
                    algType: this.algTypeMap ? this.algTypeMap.get(this.selectedAlgData.type) : this.selectedAlgData.type,
                    type: this.selectedAlgData.type,
                    owner: this.selectedAlgData.owner
                },
                version: ""
            };
            console.log('*************************this.showAddVer:', this.verFormData)
            this.$set(this.verFormData);
        },
        verTableChange(index, row) {
           console.log('*************************this.switchEnable:', index, row)
            algApi.ChgVersion(row.algId, row.id).then(res => {
                row.status = res.data.data.status
                this.verTableData.forEach(item => {
                    if(item.id !== row.id) {
                        item.status = '1'
                    }
                })
                this.algTableData.map(item => {
                    if(item.id === row.algId) {
                        item.version = row.version
                    }
                })
                this.$message.success("版本切换成功");
            }).catch(err => {
                this.$message.warning(err.response.data.data)
            })
        },
        handleClose() {
            this.dialogVisible = false;
        },
        handleVerClose() {
            this.verDialogVisible = false;
        },
    },
}
</script>
<style lang="less" scoped>
/deep/.el-switch__core {
    margin-top: -2px;
    margin-left: 10px;
    width: 20px !important;
    height: 10px !important;
    border-radius: 5px !important;
}

/deep/.el-switch.is-checked .el-switch__core::after {
    background: rgba(255, 255, 255, 1) !important;
    margin-left: -6px !important;
}

/deep/.el-switch__core::after {
    width: 6px !important;
    height: 6px !important;
}
.alg {
    width: 98%;
    height: 95%;
    margin-top: 5px;
    margin-left: 15px;
    &-left {
        height: 100%;
        width: 60%;
        float: left;
        margin-right: 10px;
        &-top {
            margin-bottom:10px;
            overflow:hidden;
            &-left {
                float: left;
            }
            &-right {
                float: right;
            }
        }
        &-table {
            overflow: auto;
            width: 100%;
            height: 100%;
        }
    }
    &-right {
        margin-left: 30px;
        height: 100%;
        width: 35%;
        float: left;
        .update-alg {
            color: rgb(58, 116, 255);
            font-size: 10px;
        }
        &-top {
            margin-bottom:10px;
            overflow:hidden;
        }
        &-table {
            overflow: auto;
            width: 100%;
            height: 60%;
        }
        &-ver-details {
            margin-top: 30px;
            max-height: 300px;
            overflow: auto;
            color: #606266;
            background-color: #FAFAFA;
            border-radius: 3px;
            padding-bottom: 10px;
            padding-top: 15px;
            &-title {
                color: #707070;
                font-weight: 400;
                margin-left: 15px;
                font-size: 15px;
            }
            &-item {
                font-weight: 300;
                display: block;
                font-size: 13px;
                padding: 10px 5px 0px 20px;
            }
        }
    }
    &-top {
        height: 98%;
        width: 100%;
        float: top;
        &-table {
            overflow: auto;
            width: 100%;
            height: 98%;
        }
    }
    &-bottom {
        height: 10%;
        width: 100%;
        float: bottom;
    }
    .title-part {
        color: #707070;
        font-size: 14px;
    }
    .el-table::before {
        left: 0;
        bottom: 0;
        width: 100%;
        height: 0px;
    }
}
</style>