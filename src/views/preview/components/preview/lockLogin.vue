<template>
    <el-dialog 
        title="欢迎登录"
        width="400px"
        :visible.sync="lockDialogVisible"
        :close-on-click-modal="false"
        append-to-body>
        <el-form :model="form" ref="data-form" :rules="dataRule" label-width="80px" @keyup.enter.native="save">
            <el-form-item label="用户名" prop="name">
                <el-input disabled size="mini" maxlength="15" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input size="mini" :type="passw" maxlength="15" v-model="form.password"></el-input>
                <img v-show="!seen" src="@/assets/img/eye/close.png" @click="showPass" class="img_eye"/>
                <img v-show="seen" src="@/assets/img/eye/open.png" @click="showPass" class="img_eye"/>
            </el-form-item>
            <el-form-item style="margin-bottom: 5px;">
                <el-button
                    style="float:right"
                    type="primary" 
                    @click="save">登录</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
<script>
import md5 from 'js-md5'
export default {
    name: 'lockDialog',
    data () {
        return {
            lockDialogVisible: false,
            seen:'',
            passw: 'password', // 用于改变Input类型
            form: {
                name: '',
                pwd: '',
                password: ''
            },
            dataRule: {
                name: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
                password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
            },
        }
    },
    // watch: {
    //     "form.pwd": {
    //         handler: function (val, oldV) {
    //             //监听登录的密码输入框，将密文显示为*
    //             this.form.pwd = this.form.pwd.replace(/./g, "*");
    //             if (oldV.length > val.length) {
    //                 //进行删除操作   this.form.password就是定义在data中用来存实际密码的变量
    //                 this.form.password = this.form.password.substring(0, this.form.password.length - 1);
    //             } else {
    //                 if (oldV) {
    //                     if (val.length==1&&oldV.length==1) {
    //                         this.form.password = oldV
    //                     } else {
    //                         this.form.password += val.replace(/[*]/g, "");
    //                     }
    //                 } else {
    //                     this.form.password = val
    //                 }
    //             }
    //         },
    //         deep: true,
    //     },
    // },
    methods: {
        init() {
            this.$nextTick(()=>{
                this.lockDialogVisible = true
                this.lockPassword = localStorage.getItem('lockPassword')
                this.form = {
                    name: JSON.parse(localStorage.getItem('user')).userName,
                    pwd: '',
                    password: ''
                }
            })
        },
        // 密码的隐藏和显示
        showPass() {
            // 点击图标是密码隐藏或显示
            if (this.passw == 'text') {
                this.passw = 'password'
                this.seen = !this.seen
            } else {
                this.passw = 'text'
                this.seen = !this.seen
            }
        },
        // 表单提交
        save () {
            this.$refs['data-form'].validate((valid) => {
                if (valid && this.lockPassword === md5('Deepglint'+md5(this.form.password))) {
                    this.$emit('refLockLogin')
                    this.lockDialogVisible = false
                } else {
                    this.$message.warning('密码不正确')
                }
            })
        },
    },
}
</script>
  
<style lang="less" scoped>
.el-input {
    width: 210px;
    padding-right: 10px;
}
.img_eye {
    position: absolute;
    right: 80px;
    top: 12px;
}
.no-autofill-pwd {
    /deep/ .el-input__inner {
        text-security: disc !important;
        -webkit-text-security: disc !important;
    }
}
</style>
  