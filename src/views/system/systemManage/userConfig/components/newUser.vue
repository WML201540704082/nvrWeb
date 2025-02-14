<template>
    <el-dialog
        :title="id ? '编辑' : '新增'"
        :close-on-click-modal="false"
        :visible.sync="visible"
        @close="closeDialog"
		width="40%"
        append-to-body>
        <el-form :model="dataForm" :rules="dataRule" ref="data-form" size="mini" label-width="100px">
			<el-form-item label="用户名" prop="userName">
            	<el-input :readonly="readonly" @focus="handlerIptClick" :disabled="id ? true : false" :maxlength="16" v-model="dataForm.userName" style="width:172px" placeholder="请输入用户名"></el-input>
            </el-form-item>
			<!-- <el-form-item label="密码" prop="password" v-if="!id || (id && !editPass)"> -->
			<el-form-item label="密码" prop="password" v-if="!id">
            	<el-input :readonly="readonly" @focus="handlerIptClick" :disabled="(id && !editPass) ? true : false" type="text" autocomplete="new-password" class="no-autofill-pwd"  v-model="dataForm.password" style="width:172px" placeholder="请输入密码"></el-input>
                <!-- <span @click="changePass" style="padding-left: 10px;cursor: pointer;" v-if="id && !editPass">修改</span> -->
            </el-form-item>
            <!-- <div v-else>
                <el-form-item label="原密码" prop="oldPassword">
                	<el-input type="text" autocomplete="new-password" class="no-autofill-pwd" :maxlength="16" v-model="dataForm.oldPassword" style="width:172px" placeholder="请输入密码"></el-input>
                    <span @click="changePass" style="padding-left: 10px;cursor: pointer;">取消修改</span>
                </el-form-item>
                <el-form-item label="新密码" prop="password">
                    <el-input type="text" autocomplete="new-password" class="no-autofill-pwd" :maxlength="16" v-model="dataForm.password" style="width:172px" placeholder="请输入密码"></el-input>
                </el-form-item>
            </div> -->
            <!-- <el-form-item label="确认密码" prop="configPassword" v-if="!id || editPass"> -->
            <el-form-item label="确认密码" prop="configPassword" v-if="!id">
            	<el-input type="text" autocomplete="new-password" class="no-autofill-pwd"  v-model="dataForm.configPassword" style="width:172px" placeholder="请输入确认密码"></el-input>
            </el-form-item>
            <el-form-item label="用户组" prop="group">
                <el-select :disabled="id ? true : false" v-model="dataForm.group" @change="changeGroup" placeholder="请选择用户组">
                    <el-option
                        v-for="item in groupList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"/>
                </el-select>
            </el-form-item>
        </el-form>
        <el-button style="margin: 10px 20px 0 20px" size="mini" @click="goUserJurisdiction">用户权限</el-button>
        <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="closeDialog">取消</el-button>
            <el-button size="mini" type="primary" @click="dataFormSubmit">确定</el-button>
        </span>
        <jurisdiction ref="jurisdiction" @refRights="getRight"></jurisdiction>
    </el-dialog>
</template>

<script>
import jurisdiction from './jurisdiction'
import { addUser, editUser, userGroupDetails, userDetails } from '@/api'
import md5 from 'js-md5'
export default {
    name: 'new-user',
    data () {
        const orderName = (rule, value, callback) => {
            var CS = /[^\u4e00-\u9fa5a-zA-Z0-9]/
            if (CS.test(value)) {
                callback(new Error('不能输入特殊字符'))
            }else{
                callback()
            }
        }
        const passwordCheck = (rule, value, callback) => {
            var re = /^[^\u4e00-\u9fa5]+$/
            if (value.length < 8 || value.length > 16) {
                callback(new Error('密码长度需8-16位'))
            } else {
                let lcontinuity=0; //用于连贯个数的计数
                for(let i=1;i<value.length;i++){
                    if(((value[i].charCodeAt())-(value[i-1].charCodeAt())==1)||((value[i].charCodeAt())-(value[i-1].charCodeAt())==-1)){ //1正序连贯；-1倒序连贯
                        lcontinuity+=1; //存在连贯：计数+1
                    }
                    if(value[i]===(value[i-1])){
                        callback(new Error('密码不可以包含连续相同字符'))
                    }
                }
                if(!re.test(value)){
                    callback(new Error('密码不可以包含汉字'))
                }
                if(lcontinuity>(value.length-2)){//连贯总数=字符串长度-2；代表全部连贯
                    callback(new Error('密码不可以为全升序或降序的数字或字母'))
                }else if (this.dataForm.userName && value.indexOf(this.dataForm.userName) !== -1) {
                    callback(new Error('密码不可以包含用户名'))
                }else if (value.substring(0,3) === value.substring(value.length-3,value.length) || value.substring(0,3) === value.substring(value.length-3,value.length).split('').reverse().join('')) {
                    callback(new Error('密码不可以为前三位及后三位相同/顺序颠倒的数字或字母'))
                } else if (!(/[0-9]/.test(value) && /[a-zA-Z]/.test(value) && /[^0-9a-zA-Z]/.test(value))) {
                    callback(new Error('密码必须为数字、字母和特殊字符的组合'))
                } else {
                    callback()
                }
            }
        }
        return {
            visible: false,
            id: null,
            editPass: false,
            readonly: true,
            dataForm: {
                userName: null,
                oldPassword: null,
                password: null,
                configPassword: null,
                group: 'ordinary'
            },
            groupList: [{
                value: 'operator',
                label: '操作员'
            },{
                value: 'ordinary',
                label: '普通用户'
            }],
            dataRule: {
                userName: [{ required: true, message: '请输入用户名', trigger: 'blur' },
                    {validator:orderName,trigger: 'blur'}],
                oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' },
                    {validator:passwordCheck,trigger: 'blur'}],
                configPassword: [{ required: true, message: '请输入确认密码', trigger: 'blur' }],
                group: [{ required: true, message: '请选择用户组', trigger: 'blur' }],
            }
        }
    },
    inject: ['reload'],
    components: {
        jurisdiction
    },
    methods: {
        async init (id,userName,group) {
            this.id = id
            this.visible = true
            this.dataForm.group = group
            this.nvrRd = Number(localStorage.getItem('nvrRd'))
            this.nvrRdList = Array.from({length:this.nvrRd}, (v,k) => k+1)
            if (id) {
                this.dataForm.userName = userName
                this.dataForm.password = 'sadsf135$&'
                this.dataForm.configPassword = 'sadsf135$&'
                userDetails(id).then(res => {
                    if(res.data.code === 200000) {
                        this.rights = res.data.data.rights
                    }}
                )
            } else {
                // this.dataForm.userName = null,
                // this.dataForm.password = null,
                this.dataForm.configPassword = null
                this.dataForm.group = group
                this.$nextTick(() => {
                    this.$refs['data-form'].clearValidate()
                })   
            }
        },
        handlerIptClick() {
            this.readonly = false
        },
        changePass() {
            this.editPass = !this.editPass
            if (this.editPass) {
                this.dataForm.password = null
                this.dataForm.configPassword = null
            } else {
                this.dataForm.password = 'sadsf135$&'
                this.dataForm.configPassword = 'sadsf135$&'
            }
        },
        changeGroup() {
            let selectAll = {
                PermChsLive: this.nvrRdList,
                PermChsMaskLive: this.nvrRdList,
                PermChsPlayback:  this.nvrRdList,
                PermChsMaskPlayback: this.nvrRdList,
            }
            if (this.dataForm.group === 'admin') {
                this.rights = {
                    local: {
                        permisions: ["PermChanMng", "PermEventMng","PermRecordMng", "PermStoreMng", "PermNetMng", "PermSysMng","PermSmart","PermSysMaintain",
                                     "PermUserMng","PermHardDiskMng","PermChsLive","PermChsMaskLive","PermChsPlayback", "PermChsMaskPlayback"],
                        chPermList: selectAll
                    },
                    remote: {
                        permisions: ["PermChanMng", "PermEventMng","PermRecordMng", "PermStoreMng", "PermNetMng", "PermSysMng","PermSmart","PermSysMaintain",
                                     "PermUserMng","PermHardDiskMng","PermChsLive","PermChsMaskLive","PermChsPlayback", "PermChsMaskPlayback"],
                        chPermList: selectAll
                    },
                }
            } else if (this.dataForm.group === 'operator') {
                this.rights = {
                    local: {
                        permisions: ["PermNetMng", "PermSmart","PermChsLive","PermChsMaskLive","PermChsPlayback", "PermChsMaskPlayback"],
                        chPermList: selectAll
                    },
                    remote: {
                        permisions: ["PermNetMng", "PermSmart","PermChsLive","PermChsMaskLive","PermChsPlayback", "PermChsMaskPlayback"],
                        chPermList: selectAll
                    },
                }
            } else {
                this.rights = {
                    local: {
                        permisions: ["PermSmart","PermChsLive","PermChsMaskLive","PermChsPlayback", "PermChsMaskPlayback"],
                        chPermList: selectAll
                    },
                    remote: {
                        permisions: ["PermSmart","PermChsLive","PermChsMaskLive","PermChsPlayback", "PermChsMaskPlayback"],
                        chPermList: selectAll
                    },
                }
            }
        },
        // 用户权限
        goUserJurisdiction() {
            if (this.dataForm.group) {
                // 获取用户组详情
                userGroupDetails(this.dataForm.group === 'admin' ? 1 : this.dataForm.group === 'operator' ? 2 : 3).then(res => {
                    if(res.data.code === 200000) {
                        this.$nextTick(() => {
                            this.$refs['jurisdiction'].init((this.id ? this.id : null),(this.id ? 'edit' : 'add'),res.data.data.rights,this.newSelect ? this.newSelect : null)
                        })
                    }
                })
            } else {
                this.$message.warning('请先选择用户组')
            }
        },
        getRight(value) {
            this.newSelect = value
            this.rights = value
        },
        closeDialog() {
            this.visible = false
            this.reload()
        },
        // 表单提交
        dataFormSubmit () {
            this.$refs['data-form'].validate(async (valid) => {
                if (valid) {
                    if (this.dataForm.password !== this.dataForm.configPassword) {
                        this.$message.warning('密码不一致')
                        return
                    } else {
                        let params = {
                            userName: this.dataForm.userName,
                            oldPassword: md5('Deepglint'+md5(String(this.dataForm.oldPassword))),
                            password: (this.id && this.dataForm.password === 'sadsf135$&') ? null : md5('Deepglint'+md5(String(this.dataForm.password))),
                            group: this.dataForm.group,
                            macList: null,
                            rights: this.rights,
                            PasswordRtsp: md5(this.dataForm.userName+':Deepglint:'+this.dataForm.password)
                        }
                        const { data } = this.id ? await editUser(this.id,params) : await addUser(params)
                        if (data.code === 200000) {
                            this.visible = false
                            this.$message.success(this.id ? '用户修改成功！' : '用户添加成功！')
                            this.$emit('refreshUserList')
                        } else {
                            this.$message.error(data.message)
                        }
                    }
                }
            })
        },
    }
}
</script>
<style lang="less" scoped>
.no-autofill-pwd {
    /deep/ .el-input__inner {
        text-security: disc !important;
        -webkit-text-security: disc !important;
    }
}
</style>

