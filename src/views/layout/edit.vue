<template>
    <el-dialog
        title="修改密码"
        :close-on-click-modal="false"
        :visible.sync="visible"
        @close="closeDialog"
		width="40%"
        append-to-body>
        <el-form :model="dataForm" :rules="dataRule" ref="data-form" size="mini" label-width="100px">
            <el-form-item label="用户名" prop="userName">
            	<el-input :readonly="readonly" @focus="handlerIptClick" disabled :maxlength="16" v-model="dataForm.userName" style="width:172px" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="原始密码" prop="oldPassword">
                <el-input type="text" autocomplete="new-password" class="no-autofill-pwd" :maxlength="16" v-model="dataForm.oldPassword" style="width:172px" placeholder="请输入原始密码"></el-input>
            </el-form-item>
			<el-form-item label="新密码" prop="password">
            	<el-input :readonly="readonly" @focus="handlerIptClick" type="text" autocomplete="new-password" class="no-autofill-pwd" :maxlength="16" v-model="dataForm.password" style="width:172px" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="configPassword">
            	<el-input type="text" autocomplete="new-password" class="no-autofill-pwd" :maxlength="16" v-model="dataForm.configPassword" style="width:172px" placeholder="请输入确认密码"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="closeDialog">取消</el-button>
            <el-button size="mini" type="primary" @click="dataFormSubmit">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { editPassword } from '@/api'
import md5 from 'js-md5'
export default {
    name: 'new-user',
    data () {
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
            readonly: true,
            dataForm: {
                userName: null,
                oldPassword: null,
                password: null,
                configPassword: null,
            },
            dataRule: {
                userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' },
                    {validator:passwordCheck,trigger: 'blur'}],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' },
                    {validator:passwordCheck,trigger: 'blur'}],
                configPassword: [{ required: true, message: '请输入确认密码', trigger: 'blur' }],
            }
        }
    },
    methods: {
        async init () {
            this.visible = true
            this.dataForm.userName = JSON.parse(localStorage.getItem('user')).userName
            this.dataForm.password = null
            this.dataForm.configPassword = null
        },
        handlerIptClick() {
            this.readonly = false
        },
        closeDialog() {
            this.visible = false
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
                            oldPassword: md5('Deepglint'+md5(String(this.dataForm.oldPassword))),
                            password: md5('Deepglint'+md5(String(this.dataForm.password))),
                        }
                        const { data } = await editPassword(params)
                        if (data.code === 200000) {
                            this.visible = false
                            this.$message.success('修改密码成功！')
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