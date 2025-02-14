<template>
 <div class="device-manage">
    <!-- <div style="text-align: right">
        <el-button size="mini" @click="onAdd">添加</el-button>
        <el-button size="mini" @click="onEdit">修改</el-button>
        <el-button size="mini" @click="onDelete">删除</el-button>
    </div> -->
    <div>
    <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%;min-height: 300px;"
        @selection-change="handleSelectionChange">
        <!-- <el-table-column
        type="selection"
        :selectable="selected"
        width="55">
        </el-table-column> -->
        <el-table-column
        label="设备名称"
        prop="deviceName">
        </el-table-column>
        <el-table-column
        prop="ipAddr"
        label="IP地址">
        </el-table-column>
        <el-table-column
        prop="port"
        label="控制端口">
        </el-table-column>
        <el-table-column
        prop="deviceType"
        label="设备类型">
            <template slot-scope="scope">
               <span>{{scope.row.deviceType == 1 ? "内部设备" : "外部设备" }}</span>
            </template>
        </el-table-column>
        <el-table-column
        prop="status"
        label="状态">
        </el-table-column>
    </el-table>
    </div>
    <el-dialog :append-to-body="true"  :close-on-click-modal="false"  :title="addFlag ? '添加报警设备': '修改报警设备'" width="500px" :visible.sync="form1Visible">
        <el-form :model="form" ref="ruleForm" :rules="rules" size="mini">
            <el-form-item label="设备名称"  prop="deviceName" :label-width="formLabelWidth">
            <el-input style="width: 220px" v-model="form.deviceName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="IP地址"  prop="ipAddr" :label-width="formLabelWidth">
            <el-input style="width: 220px" v-model="form.ipAddr" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="控制端口"  prop="port" :label-width="formLabelWidth">
            <el-input style="width: 220px" v-model="form.port" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="用户名"  prop="user" :label-width="formLabelWidth">
            <el-input style="width: 220px" v-model="form.user" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码"  prop="password" :label-width="formLabelWidth">
            <el-input style="width: 220px" v-model="form.password" show-password autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="生产厂家" :label-width="formLabelWidth">
                 <el-input style="width: 220px" v-model="form.manufacturer" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="设备类型" :label-width="formLabelWidth">
                <el-select style="width: 220px" v-model="form.deviceType" placeholder="请选择">
                    <el-option label="外部设备" value="2"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="resetForm('ruleForm')">取 消</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        </div>
    </el-dialog>
 </div>
</template>

<script>
import {  getAlarmManagement, postAlarmManagement, putAlarmManagement,deleteAlarmManagement} from '@/api/systemAPI';

export default {
	components: {
       
	},
	props: {},
	data() {
		return{
            multipleSelection: [],
            tableData: [],
            form: {
                deviceName: '',
                ipAddr: '',
                port: '',
                user: '',
                password: '',
                manufacturer: '',
                deviceType: '',
                id: '',
            },
            rules: {
                deviceName: [
                    { required: true, message: '请输入设备名称', trigger: 'blur' }
                ],
                ipAddr: [
                    { required: true, message: '请输入IP地址', trigger: 'change' }
                ],
                port: [
                    { required: true, message: '请输入控制端口', trigger: 'change' }
                ],
                user: [
                    { required: true, message: '请输入用户名', trigger: 'change' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'change' }
                ],
            },
            formLabelWidth: '120px',
            form1Visible:false,
            addFlag: true,
            regularVal: ['1'],
            regularArr: [{name: '网络上传',id: '1'}],
		}
	},
    mounted(){
        this.queryAlarmData()
    },
    methods: {
        // 获取设备列表
        queryAlarmData() {
            getAlarmManagement().then(res => {
                if(res.data.code == 200000) {
                    this.tableData = res.data.data
                }
            })
        },
        selected(row, index) {
            if (row.deviceType == 1) {
                return false //不可勾选
            } else {
                return true; //可勾选
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        onAdd() {
            this.addFlag = true
            this.form1Visible = true
        },
        onEdit() {
            if(this.multipleSelection.length == 1) {
                this.addFlag = false
                this.form1Visible = true
                this.form = {
                    deviceName: this.multipleSelection[0].deviceName,
                    ipAddr: this.multipleSelection[0].ipAddr,
                    port: this.multipleSelection[0].port,
                    user: this.multipleSelection[0].user,
                    password: this.multipleSelection[0].password,
                    manufacturer: this.multipleSelection[0].manufacturer,
                    deviceType: this.multipleSelection[0].deviceType,
                    id: this.multipleSelection[0].id,
                }
            } else if(this.multipleSelection.length == 0) {
                this.$message({
                    showClose:true,
                    message: '请选择要修改的设备！',
                    type: 'warning'
                })
            } else {
                this.$message({
                    showClose:true,
                    message: '只能选择一个设备！',
                    type: 'warning'
                })
            }
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let obj = {
                        deviceName: this.form.deviceName,
                        ipAddr: this.form.ipAddr,
                        port: this.form.port,
                        user: this.form.user,
                        password: this.form.password,
                        manufacturer: this.form.manufacturer,
                        deviceType: Number(this.form.deviceType),
                    }
                    if(this.addFlag) {
                        postAlarmManagement(obj).then(res => {
                            if(res.data.code==200000) {
                                this.$message({
                                    showClose: true,
                                    message: '添加成功！',
                                    type: 'success'
                                })
                                this.queryAlarmData()
                                this.form1Visible=false
                            } else {
                                this.$message({
                                    showClose: true,
                                    message: '添加失败！',
                                    type: 'error'
                                })
                            }

                        }).catch(err => {
                            this.$message({
                                showClose: true,
                                message: '添加失败！',
                                type: 'error'
                            })
                        })
                    } else {
                        putAlarmManagement({
                            ...obj,
                            id: this.form.id,
                        }).then(res => {
                            if(res.data.code==200000) {
                                this.$message({
                                    showClose: true,
                                    message: '修改成功！',
                                    type: 'success'
                                })
                                this.queryAlarmData()
                                this.form1Visible=false
                            } else {
                                this.$message({
                                    showClose: true,
                                    message: '修改失败！',
                                    type: 'error'
                                })
                            }

                        }).catch(err => {
                            this.$message({
                                showClose: true,
                                message: '修改失败！',
                                type: 'error'
                            })
                        })
                    }
                } else {
                return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.form1Visible=false
            this.form = {
                deviceName: '',
                ipAddr: '',
                port: '',
                user: '',
                password: '',
                manufacturer: '',
                deviceType: '',
                id: '',
            }
        },
        onDelete() {
            if(this.multipleSelection.length == 0) {
                this.$message({
                    showClose:true,
                    message: '请选择要删除的设备！',
                    type: 'warning'
                })
            } else {
                let arr = []
                this.multipleSelection.forEach(item=> {
                    arr.push(Number(item.id))
                })
                deleteAlarmManagement(arr).then(res => {
                    if(res.data.code==200000) {
                        this.$message({
                            showClose: true,
                            message: '删除成功！',
                            type: 'success'
                        })
                        this.queryAlarmData()
                    } else {
                        this.$message({
                            showClose: true,
                            message: '删除失败！',
                            type: 'error'
                        })
                    }
                }).catch(()=>{
                    this.$message({
                        showClose: true,
                        message: '删除失败！',
                        type: 'error'
                    })
                })
            }
        }
    }
}
</script>

<style scoped lang="less">
#systemBox .device-manage {
   /deep/ .el-table {
       padding: 20px 20px 0 20px;
   }
   /deep/ .el-table::before {
       height: 0px;
   }
}
</style>