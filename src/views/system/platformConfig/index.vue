<template>
    <div>
        <el-form :model="dataForm" :rules="dataRule" size="mini" label-width="80px" label-position="right">
            <el-form-item label="启用" prop="enabled">
                <el-checkbox v-model="dataForm.enabled"></el-checkbox>
            </el-form-item>
            <el-form-item label="服务器IP" prop="server">
                <el-input :disabled="!dataForm.enabled" v-model="dataForm.server" size="small" style="width:192px" placeholder="请填写"></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="userName">
                <el-input :disabled="!dataForm.enabled" v-model="dataForm.userName" size="small" style="width:192px" placeholder="请填写"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input :disabled="!dataForm.enabled" v-model="dataForm.password" size="small" style="width:192px" placeholder="请填写"></el-input>
            </el-form-item>
        </el-form>
        <div style="padding: 5px 0 20px 30px">
            <el-button size="small" @click="onSave">保存</el-button>
        </div>
    </div>
</template>
<script>
import { platformApi } from '@/api'
export default {
    data() {
        return{
            dataForm: {
                enabled: false,
                server: '',
                userName: '',
                password: ''
            },
            dataRule: {
                server: [{ required: true, message: '请输入服务器IP', trigger: 'blur' }],
                userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            }
        }
    },
    created() {
        this.getPlatformInfo()
    },
    methods:{
        getPlatformInfo() {
            platformApi.Get().then(res=>{
                this.dataForm = res.data.data
            })
        },
        onSave() {
            platformApi.Put(this.dataForm).then(res=>{
                this.$message.success('保存成功！')
            })
        },
    }
}
</script>