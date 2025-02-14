<template>
    <el-dialog 
        title="锁定配置"
        width="500px"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        style="margin-top:-25px">
        <el-form :model="dataForm" :rules="dataRule" ref="data-form" size="mini" label-width="120px">
			<el-form-item label="向前截取时长" prop="front">
            	<el-input :maxlength="4" v-model.number="dataForm.front" onkeyup="value=value.replace(/\D/g,'')" onafterpaste="value=value.replace(/\D/g,'')" style="width:172px"></el-input>
                <span style="padding-left: 10px;">s</span>
            </el-form-item>
			<el-form-item label="向后截取时长" prop="after">
            	<el-input :maxlength="4" v-model.number="dataForm.after" onkeyup="value=value.replace(/\D/g,'')" onafterpaste="value=value.replace(/\D/g,'')" style="width:172px"></el-input>
                <span style="padding-left: 10px;">s</span>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="closeDialog">取消</el-button>
            <el-button size="mini" type="primary" @click="dataFormSubmit">确定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import moment from "moment";
import { lockConfig } from '@/api'
export default {
    data () {
        let limitFront = (rule, value, callback) => {
            if(isNaN(value)){
                callback(new Error('只允许输入数字'))
            } else if (rule.isInteger && !Number.isInteger(+value)) {
                callback(new Error('只允许输入整数'))
            } else if (value == 0 && this.dataForm.after == 0) {
                callback(new Error('不能同时为0'))
            } else {
                callback()
            }
        }
        let limitAfter = (rule, value, callback) => {
            if(isNaN(value)){
                callback(new Error('只允许输入数字'))
            } else if (rule.isInteger && !Number.isInteger(+value)) {
                callback(new Error('只允许输入整数'))
            } else if (value == 0 && this.dataForm.front == 0) {
                callback(new Error('不能同时为0'))
            } else {
                callback()
            }
        }
        return {
            dialogVisible: false,
            dataForm: {
                front: 15,
                after: 15
            },
            dataRule: {
                front: [{ required: true, message: '请输入向前截取时长', trigger: 'blur' },
                        { validator: limitFront, trigger: 'blur' }],
                after: [{ required: true, message: '请输入向后截取时长', trigger: 'blur' },
                        { validator: limitAfter, trigger: 'blur' }],
            }
        }
    },
    methods: {
        init(channelId,timestamp,fileType) {
            this.$nextTick(()=>{
                this.dialogVisible = true
                this.dataForm = {
                    front: 15,
                    after: 15
                }
                this.channelId = channelId
                this.fileType = fileType
                this.timestamp = moment(timestamp).format("yyyy-MM-DD HH:mm:ss")
            })
        },
        closeDialog() {
            this.dialogVisible = false
        },
        // 表单提交
        dataFormSubmit () {
            console.log(moment(new Date()).add(this.dataForm.after,'s').format("YYYY-MM-DD HH:mm:ss")>moment(new Date()).format("YYYY-MM-DD HH:mm:ss"));
            this.$refs['data-form'].validate(async (valid) => {
                if (valid) {
                    // if (moment(this.timestamp).add(this.dataForm.after,'s').format("YYYY-MM-DD HH:mm:ss")>moment(new Date()).format("YYYY-MM-DD HH:mm:ss")) {
                    //     this.$message.warning('锁定失败，超过当前时间！')
                    // } else {
                        let params = {
                            channel: this.channelId,
                            fileType: this.fileType,
                            beginTime: moment(this.timestamp).subtract(this.dataForm.front,'second').format('yyyy-MM-DD HH:mm:ss'),
                            endTime: moment(this.timestamp).add(this.dataForm.after,'second').format('yyyy-MM-DD HH:mm:ss')
                        }
                        const { data } = await lockConfig(params)
                        if (data.code === 200000) {
                            this.dialogVisible = false
                            this.$message.success('锁定成功！')
                        } else {
                            this.$message.error(data.message)
                        }
                    // }
                }
            })
        },
    },
  }
  </script>
  
<style lang="less" scoped>
</style>
  