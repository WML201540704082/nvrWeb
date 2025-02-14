<template>
  <div>
    <el-dialog title="重置密码" :visible.sync="dialogVisible" center :before-close="resetPwdDialogCancel" :modal="false"
      :close-on-click-modal="false">
      <div style="display: flex; flex-flow: column; align-items: center;padding:20px">
        <el-steps :active="resetPwdActive" finish-status="success" style="width: 100%;">
          <el-step title="获取设备机器码" description="获取机器码, 联系并发送给软件制造商以获得修改密码所需的证书文件"></el-step>
          <el-step title="导入证书"></el-step>
        </el-steps>

        <el-button size="mini" @click="getDeviceCode" v-show="!deviceCodeVisible">点击获取设备机器码</el-button>
        <h3 style="color: #3A74FF;margin:20px" v-show="deviceCodeVisible">{{ resetPwdForm.machineCode }}</h3>

        <el-form :model="resetPwdForm" v-show="resetPwdActive === 1" :rules="resetPwdFormRules" ref="resetPwdForm"
          style="width: 100%;">
          <el-form-item label="上传证书" label-width="120px" prop="license">
            <el-upload drag :limit="1" accept=".lic" :auto-upload="false" action="" :on-change="changeFile" ref="my-upload"
            :on-remove="handleRemove">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
            <!-- <input type="file" name="file" value="" placeholder="请选择文件" @change="getDeviceCode" multiple="multiple" /> -->
          </el-form-item>
          <el-form-item label="新密码" label-width="120px" prop="password">
            <input class="input inputSys" style="width:300px;height:25px" v-model="resetPwdForm.password"
              autocomplete="off" type="password" />
          </el-form-item>
          <el-form-item label="确认密码" label-width="120px" prop="repassword">
            <input class="input inputSys" style="width:300px;height:25px" v-model="resetPwdForm.repassword"
              autocomplete="off" type="password" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="resetPwdDialogCancel">取 消</el-button>
        <el-button size="mini" type="primary" @click="resetPwdFormNext" :disabled="!deviceCodeVisible">下一步</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import md5 from 'js-md5'
import { getMachineApi, postMachineApi } from '@/api'

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    const passwordCheck = (rule, value, callback) => {
      var re = /^[^\u4e00-\u9fa5]+$/
      if (value.length < 8 || value.length > 16) {
        callback(new Error('密码长度需8-16位'))
      } else {
        let lcontinuity = 0; //用于连贯个数的计数
        for (let i = 1; i < value.length; i++) {
          if (((value[i].charCodeAt()) - (value[i - 1].charCodeAt()) == 1) || ((value[i].charCodeAt()) - (value[i - 1].charCodeAt()) == -1)) { //1正序连贯；-1倒序连贯
            lcontinuity += 1; //存在连贯：计数+1
          }
          if (value[i] === (value[i - 1])) {
            callback(new Error('密码不可以包含连续相同字符'))
          }
        }
        if (!re.test(value)) {
          callback(new Error('密码不可以包含汉字'))
        }
        if (lcontinuity > (value.length - 2)) {//连贯总数=字符串长度-2；代表全部连贯
          callback(new Error('密码不可以为全升序或降序的数字或字母'))
        } else if (this.userName && value.indexOf(this.userName) !== -1) {
          callback(new Error('密码不可以包含用户名'))
        } else if (value.substring(0, 3) === value.substring(value.length - 3, value.length) || value.substring(0, 3) === value.substring(value.length - 3, value.length).split('').reverse().join('')) {
          callback(new Error('密码不可以为前三位及后三位相同/顺序颠倒的数字或字母'))
        } else if (!(/[0-9]/.test(value) && /[a-zA-Z_]/.test(value) && /[^0-9a-zA-Z_]/.test(value))) {
          callback(new Error('密码必须为数字、字母和特殊字符的组合'))
        }else {
          callback()
        }
      }
    }
    let validateRePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (value !== this.resetPwdForm.password) {
        callback(new Error('两次密码不一致'));
      } else {
        callback();
      }
    }

    return {
      deviceCodeVisible: false,
      resetPwdActive: 0,
      getDeviceCodeText: '获取设备机器码',
      resetPwdForm: {
        machineCode: '',
        license: '',
        password: '',
      },
      resetPwdFormRules: {
        license: [{ required: true, message: '请选择证书', trigger: 'blur' }],
        password: [{ required: true, validator: passwordCheck, trigger: 'blur' }],
        repassword: [{ required: true, validator: validateRePass, trigger: 'blur' }],
      }
    }
  },
  methods: {
    handleRemove(file, fileList) {
        this.resetPwdForm.license=''
    },
    initUserName(userName) {
      this.userName = userName || 'admin'
    },
    getDeviceCode() {
      getMachineApi().then(res => {
        this.resetPwdForm.machineCode = res.data.data;
        this.deviceCodeVisible = true;
      })
    },
    changeFile(file, fileList) {
      var That = this
      var reader = new FileReader()
      reader.readAsDataURL(file.raw)
      reader.onload = function (e) {
        let _result = this.result // 这个就是base64编码了
        let imgBase64 = _result.substring(_result.indexOf(',') + 1, _result.length)
        That.resetPwdForm.license = imgBase64
      }
    },
    resetPwdFormNext() {
      if (this.resetPwdActive === 0) {
        if (this.deviceCodeVisible) {
          this.resetPwdActive++;
        } else {
          this.$Msg('请先点击获取设备机器码', 'error')
        }
        return;
      }
      if (this.resetPwdActive === 1) {
        //提交表单
        this.$refs['resetPwdForm'].validate(valid => {
          if (valid) {
            const password = md5('Deepglint' + md5(this.resetPwdForm.password))
            postMachineApi({
              machineCode: this.resetPwdForm.machineCode,
              license: this.resetPwdForm.license,
              password
            })
              .then(res => {
                this.resetPwdDialogCancel()
                this.$Msg('重置密码成功', 'success')
              })
              .catch(err => {
                if (err.response.data.code === 400000) {
                  this.$message.error('请上传正确的证书！')
                }             
              })
          }
        })     
      }
    },
    resetPwdDialogCancel() {
      this.$refs['my-upload'].clearFiles();
      this.$refs['resetPwdForm'].clearValidate();
      this.resetPwdActive = 0;
      this.resetPwdForm = {
        machineCode: '',
        license: '',
        password: '',
      };
      this.deviceCodeVisible = false;
      this.$emit('closeDialog')
      // this.dialogVisible = false;
    },
    closeDialog() {
      this.$emit('closeDialog')
    }
  }
}
</script>
