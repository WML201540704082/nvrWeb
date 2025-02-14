<template>
    <!-- 设备管理 -->
    <div class="netBox">
        <el-col style="margin-bottom:15px">
            <span style="font-size:14px; color: #626262;">以太网口</span>
        </el-col>
        <el-form :inline="true" :model="ruleForm" ref="ruleForm" label-width="80px" label-position="right" :rules="json.netRules" >
            <el-col :span="24" style="margin-bottom:-8px" v-for="(item,index) of json.formParams" :key="index">
                <el-form-item :label="item.name" v-if="item.label != 'dev'" :prop="item.label">
                    <el-input v-model="ruleForm[item.label]" size="small" style="width:192px;height:18px;!important" :placeholder="'请输入'+item.name" />
                    <span v-if="item.label == 'dns'" style="color:#626262;font-size:12px;margin-left:10px">eg：如果输入多个DNS，多个DNS之间请用英文逗号(,)分割</span>
                </el-form-item>
                <el-form-item :label="item.label" v-else :prop="item.label">
                    <el-select v-model="ruleForm.dev" size="small" @change="changeDev" style="width:192px">
                        <el-option label="eth0" value="eth0"></el-option>
                        <el-option v-if="ethCount == 2" label="eth1" value="eth1"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-button style="margin: 20px 0 20px 30px" size="small" @click="onSubmit('ruleForm')">保存</el-button>
        </el-form>
    </div>
</template>
  
<script>
import { netApi, netcardApi } from '@/api'
import json from './config'
  
export default {
    data() {
        return {
            json,
            ethCount: 1,
            ruleForm: {
                ip: '',
                netmask: '',
                gateway: '',
                dns: '',
                ruleFormIp: '',
                dev: 'eth0'
            },
        }
    },
    created () {
      this.getNetcard()
      this.getNetInfo()
    },
    methods: {
        getNetcard () {
                netcardApi.Get().then(res => {
                    this.ethCount = res.data.data
                })
        },
        changeDev (e) {
            this.ruleForm.dev = e
            this.$forceUpdate()
            this.getNetInfo()
        },
        // 设备信息
        getNetInfo () {
            netApi.GetDev(this.ruleForm.dev).then(res => {
            this.ruleForm = res.data.data
            this.ruleForm.dev = res.data.data.dev || 'eth0'
            this.ruleFormIp = this.ruleForm.ip
            })
        },
        onSubmit (form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    if (!Array.isArray(this.ruleForm.dns)) {
                        // this.ruleForm.dns = [this.ruleForm.dns]
                        this.ruleForm.dns = this.ruleForm.dns.split(',')
                    }
                    netApi.Put(this.ruleForm).then(res => {
                        if (this.ruleFormIp != this.ruleForm.ip && this.ruleForm.dev == 'eth0' && window.localStorage.getItem('isLocal') != 'true') {
                            this.$message.success('保存成功，跳转至对应ip')
                            window.location.href=`http://${this.ruleForm.ip}`
                        } else {
                            this.$message.success('保存成功')
                        }
                    }).catch(err => {
                        if(err.response.data.code === 403903 && err.response.data.message == 'ip conflict'){
                            this.$message.error('IP冲突保存失败')
                        }else{
                            this.$message.error('保存失败')
                        }
                    })
                }
            })
        },
    },
}
</script>
  
<style lang="less" scoped>
.el-input__inner {
    height: 28px!important;
}
</style>
  