<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="业务平台" name="first">
        <el-form ref="firstForm" :model="firstForm" :rules="firstRule" size="mini" label-width="110px" label-position="right">
            <el-form-item label="平台开关" prop="enabled">
                <el-checkbox v-model="firstForm.enabled"></el-checkbox>
            </el-form-item>
            <el-form-item label="平台接入方式" prop="accWay">
                <el-input :disabled="!firstForm.enabled" v-model="firstForm.accWay" size="small" style="width:192px" placeholder="请填写"></el-input>
            </el-form-item>
            <el-form-item label="服务器IP" prop="server">
                <el-input :disabled="!firstForm.enabled" v-model="firstForm.server" size="small" style="width:192px" placeholder="请填写"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="small" @click="onSave">保存并使用</el-button>
            </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="IOT平台" name="second">
        <el-form ref="secondForm" :model="secondForm" :rules="secondRule" size="mini" label-width="110px" label-position="right">
            <el-form-item label="平台开关" prop="enabled">
                <el-checkbox v-model="secondForm.enabled"></el-checkbox>
            </el-form-item>
            <el-form-item label="平台接入方式" prop="accWay">
                <el-input :disabled="!secondForm.enabled" v-model="secondForm.accWay" size="small" style="width:192px" placeholder="请填写"></el-input>
            </el-form-item>
            <el-form-item label="IP地址" prop="server">
                <el-input :disabled="!secondForm.enabled" v-model="secondForm.server" size="small" style="width:192px" placeholder="请填写"></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="user">
                <el-input :disabled="!secondForm.enabled" v-model="secondForm.user" size="small" style="width:192px" placeholder="请填写"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="passwd">
              <el-input v-if="passwordVisible.iotPwd" type="password" :disabled="!secondForm.enabled" v-model="secondForm.passwd" size="small" style="width:192px" placeholder="请填写" autocomplete="off" ref="iotPwd">
                <i slot="suffix" @click="changePass('iotPwd','show')">
                    <svg-icon icon="eye_close" style="margin-top: 5px;color:black;"></svg-icon>
                  </i>
              </el-input>
              <el-input v-else type="text" :disabled="!secondForm.enabled" v-model="secondForm.passwd" size="small" style="width:192px" placeholder="请填写" autocomplete="off" ref="iotPwd">
                <i slot="suffix" @click="changePass('iotPwd','hide')">
                  <svg-icon icon="eye_show" style="margin-top: 5px;color:black;"></svg-icon>
                </i>
              </el-input>
            </el-form-item>
            <el-form-item label="主题" prop="topic">
                <el-input :disabled="!secondForm.enabled" v-model="secondForm.topic" size="small" style="width:192px" placeholder="请填写"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="small" @click="onSaveIOT">保存并使用</el-button>
            </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="金砖平台" name="third">
        <el-form ref="thirdForm" :model="thirdForm" :rules="thirdRule" size="mini" label-width="110px" label-position="right">
            <el-form-item label="平台开关" prop="enabled">
                <el-checkbox v-model="thirdForm.enabled"></el-checkbox>
            </el-form-item>
            <el-form-item label="服务器IP" prop="server">
                <el-input :disabled="!thirdForm.enabled" v-model="thirdForm.server" size="small" style="width:192px" placeholder="请填写"></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="user">
                <el-input :disabled="!thirdForm.enabled" v-model="thirdForm.user" size="small" style="width:192px" placeholder="请填写"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="passwd">
                <el-input v-if="passwordVisible.eventServerPwd" type="password" :disabled="!thirdForm.enabled" v-model="thirdForm.passwd" size="small" style="width:192px" placeholder="请填写" autocomplete="off" ref="eventServerPwd">
                  <i slot="suffix" @click="changePass('eventServerPwd','show')">
                    <svg-icon icon="eye_close" style="margin-top: 5px;color:black;"></svg-icon>
                  </i>
                </el-input>
                <el-input v-else type="text" :disabled="!thirdForm.enabled" v-model="thirdForm.passwd" size="small" style="width:192px" placeholder="请填写" autocomplete="off" ref="eventServerPwd">
                  <i slot="suffix" @click="changePass('eventServerPwd','hide')">
                    <svg-icon icon="eye_show" style="margin-top: 5px;color:black;"></svg-icon>
                  </i>
                </el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="small" @click="onSaveEventserver">保存并使用</el-button>
            </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { validateServerIP } from '@/utils/validate.js'
import { platformApi, platformIOTApi, platformEventServerApi } from '@/api'

export default {
  name: 'TopConfig',
  data() {
    return {
      activeName: 'first',
      firstForm: {
        enabled: false,
        accWay: '设备平台',
        server: ''
      },
      secondForm: {
        enabled: false,
        accWay: '设备平台',
        server: '',
        user: '',
        passwd: '',
        topic: ''
      },
      thirdForm: {
        enabled: false,
        server: '',
        user: '',
        passwd: '',
      },
      firstRule: {
        // accWay: [{ required: true, message: '请输入接入方式', trigger: 'blur' }],
        server: [{ required: true, message: '请输入服务器IP', trigger: 'blur' },
        {validator: validateServerIP, message: '请输入正确的格式!', trigger: 'blur' }]
      },
      secondRule: {
        accWay: [{ required: true, message: '请输入接入方式', trigger: 'blur' }],
        server: [{ required: true, message: '请输入服务器IP', trigger: 'blur' },
        { validator: validateServerIP, message: '请输入正确的格式!', trigger: 'blur' }],
        user: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        passwd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        topic: [{ required: true, message: '请输入主题', trigger: 'blur' }],
      },
      thirdRule: {
        server: [{ required: true, message: '请输入服务器IP', trigger: 'blur' },
        { validator: validateServerIP, message: '请输入正确的格式!', trigger: 'blur' }],
        user: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        passwd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      },
      platData: {},
      iotData: {},
      passwordVisible: {
        "iotPwd": true,
        "eventServerPwd": true
      }
    }
  },
  created() {
    this.getNetTopInfo()
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    changePass(refName,value){
        this.passwordVisible[refName] = !(value === 'show');
        this.$nextTick(function() {
          this.$refs[refName].focus()
        })
    },
    getNetTopInfo() {
      platformApi.Get().then(res => {
        this.firstForm = res.data.data;
        this.$set(this.firstForm, 'accWay', '设备平台');
      })
      platformIOTApi.Get().then(res => {
        this.secondForm.userName = res.data.data.user
        this.secondForm.password = res.data.data.passwd
        this.secondForm = res.data.data;
        this.$set(this.secondForm, 'accWay', '设备平台');
      })
      platformEventServerApi.Get().then(res => {
        this.thirdForm = res.data.data
        this.thirdForm.userName = res.data.data.user
        this.thirdForm.password = res.data.data.passwd
        this.thirdForm.server = res.data.data.server
      })
    },
    onSave() {
      this.$refs['firstForm'].validate(valid => {
        valid && platformApi.Put(this.firstForm).then(res => {
          this.$message.success('保存成功！')
        })
      })
    },
    onSaveIOT() {
      this.$refs['secondForm'].validate(valid => {
        valid && platformIOTApi.Put(this.secondForm).then(res => {
          this.$message.success('保存成功！')
        })
      })
    },
    onSaveEventserver() {
      this.$refs['thirdForm'].validate(valid => { 
        valid && platformEventServerApi.Put(this.thirdForm).then(res => {
          this.$message.success('保存成功！')
        })
      })
    },
  }
}
</script>

<style scoped>

</style>
