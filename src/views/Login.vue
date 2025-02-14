<template>
    <div class="login-container">
        <div class="login-form-wrap">
            <div class="login-head">{{title || '智能视频图像分析服务器'}}</div>
            <el-form :model="user" :rules="formRules" ref="login-form" class="login-form">
                <el-form-item prop="userName">
                    <el-input 
                        class="name"
                        v-model="user.userName"
                        placeholder="请输入用户名"
                        prefix-icon="el-icon-user-solid"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="password" style="margin-bottom:16px">
                    <el-input 
                        class="password"
                        v-model="user.password"
                        :type="passw"
                        placeholder="请输入密码"
                        prefix-icon="el-icon-lock"
                    ></el-input>
                    <!-- <img v-show="!seen" src="@/assets/img/eye/close.png" @click="showPass" class="img_eye"/>
                    <img v-show="seen" src="@/assets/img/eye/open.png" @click="showPass" class="img_eye"/> -->
                </el-form-item>
                <!-- <el-checkbox v-model="checked" style="margin-bottom:12px">记住密码</el-checkbox> -->
                <div class="checkbox_txt_for" @click="showForget"> 忘记密码?</div>
                <el-form-item>
                    <el-button
                        class="login-btn"
                        type="primary" 
                        :loading="loginLoading"
                        @click="onLogin">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 忘记密码dialog -->
        <forget ref="forget" :dialogVisible="dialogVisible" @closeDialog="closeDialog"></forget>
    </div>
</template>
<script>
import axios from "axios"
import browserVersion from '@/utils/browserVersion';
import { login, userPermision } from '@/api';
import { getMoreConfig } from '@/api/systemAPI';
import Forget from '@/components/forget'
import md5 from 'js-md5'
export default {
    name: 'LoginIndex',
    data() {
        return {
            user: {
                userName: '',
                password: ''
            },
            title:'',
            seen:'',
            passw: 'password', // 用于改变Input类型
            checked: false,
            loginLoading: false,
            // Forget
            dialogVisible: false,
            timeOut: null,
            formRules: {
                userName: [
                    { required: true, message: '用户名不能为空', trigger: 'change' },
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'change' },
                ],
            }
        }
    },
    created() {
        // 关闭下载窗口
        let dnFormId = window.localStorage.getItem("downloadFormId")
        if (dnFormId) {
            this.$layer.close(dnFormId)
        }
        if (window.localStorage.getItem('loginOut') == 'true') {
            this.$message({type:'error',showClose:true,message:'登录失效，请重新登录...',duration:600})
        }
        let that = this;
        document.onkeypress = function(e) {
            var keycode = document.all ? event.keyCode : e.which;
            if (keycode == 13) {
                that.onLogin();// 登录方法名
                return false;
            }
        };
        this.getTitle()
        setTimeout(()=>{
            window.localStorage.setItem('loginOut',false)
        },500)
        // 获取是否处于锁屏状态和锁屏时间
        this.getMoreConfig()
    },
    mounted() {
        // 判断本地缓存是否有用户名及密码
        // let strName = localStorage.getItem('userName')
        // let strPass = localStorage.getItem('password')
        // if (strName) {
        //     this.user.userName = strName
        //     this.checked = true
        // }
        // if (strPass) {
        //     this.user.password = strPass
        //     this.checked = true
        // }
    },
    methods: {
        async getTitle() {
            const logoRes = await axios.get('/api/system/logo')
            if (logoRes.data?.data?.loginText) {
                this.title = logoRes.data.data.loginText
            } else {
                this.title = '智能视频图像分析服务器'
            }
            window.localStorage.setItem('title',this.title)
            document.title = this.title
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
        // 忘记密码
        showForget () {
            this.dialogVisible = true
            this.$refs.forget.initUserName(this.user.userName)
        },
        closeDialog () {
            this.dialogVisible = false
        },
        onLogin(){
            // validate 方法是异步的
            this.$refs['login-form'].validate(valid => {
                if (valid) {
                    // 是否记住密码
                    if (this.checked) {
                        localStorage.setItem('userName',this.user.userName)
                        localStorage.setItem('password',this.user.password)
                    } else {
                        localStorage.removeItem('userName')
                        localStorage.removeItem('password')
                    }
                    this.loginLoading = true
                    login({
                        userName: this.user.userName,
                        password: md5('Deepglint'+md5(this.user.password))
                    }).then(res => {
                        if (res.data.code == 200000) {
                            window.localStorage.setItem('user', JSON.stringify(res.data.data))
                            window.localStorage.setItem('lockPassword', md5('Deepglint'+md5(this.user.password)))
                            // 获取权限
                            this.getPermisions()
                            // 获取锁屏时间
        					localStorage.setItem('timeOut', this.timeOut)
                        } else {
                            this.$message.error(res.data.message)
                        }
                      })
                    this.loginLoading = false
                }
            })
        },
        getPermisions() {
            userPermision().then(res => {
                if(res.data.code === 200000) {
                    this.$message({type:'success',showClose:true,message:'登录成功',offset:70,duration:1200})
                    window.localStorage.setItem('isLocal', res.data.data.isLocal)
                    window.localStorage.setItem('permisions', JSON.stringify(res.data.data.isLocal ? res.data.data.rights.local.permisions : res.data.data.rights.remote.permisions))
                    window.localStorage.setItem('userIp',res.data.data.fromIp)
                    window.localStorage.setItem('userID',res.data.data.id)
                    this.$router.push({
                        name: 'preview',
                        params: {
                            browserVersion: browserVersion()
                        }
                    });
                }}
            )
        },
        /**
         * 获取锁屏时间和是否处于锁屏状态
         */
		getMoreConfig() {
			getMoreConfig().then(res => {
				if(res.data.code === 200000) {
					this.timeOut = res.data.data.screenSaverTime ? res.data.data.screenSaverTime : 10
                    // 如果此前处于锁屏状态并且是本地模式
                    if (res.data.data.isLockScreen && res.data.data.isLocal) {
                        this.$router.push({
                            name: 'preview',
                            params: {
                                type: 'lock'
                            }
                        });
                    }
                }
			})
		},
    },
    components: {
        Forget
    }
}
</script>
<style lang="less" scoped>
// .name /deep/ .el-input__inner {
//   border: none;
//   background-color: transparent;
//   color: #fff;
// }
// .password /deep/ .el-input__inner {
//   border: none;
//   background-color: transparent;
//   color: #fff;
// }
.login-container {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url("~@/assets/img/background.png") no-repeat;
    background-size: cover;
    .login-form-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin-left: calc(50vw);
        padding: 40px 50px 30px;
        color: #fff;
        .login-head {
            width: 300px;
            height: 50px;
            text-align: center;
            font-size: 20px;
        }
        .login-form {
            min-width: 300px;
            .login-btn {
                width: 100%;
            }
        }
        .img_eye {
            position: absolute;
            right: 10px;
            top: 12px;
        }
    }
}
.checkbox_txt_for {
    color: #909399;
    font-size: 14px;
    font-family: Helvetica;
    font-weight: 400;
    text-decoration: underline;
    cursor: pointer;
    margin-left:230px;
    margin-bottom:12px
}
</style>