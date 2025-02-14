<template>
  <el-dialog 
      title="标签"
      width="380px"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      style="margin-top:-25px">
    <el-form :model="form" :rules="dataRule" ref="data-form" label-width="80px">
      <el-form-item label="标签名" prop="name">
        <el-input size="mini" v-model="form.name"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="save()">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import moment from "moment";
import { tagConfig } from '@/api'
export default {
  name: 'Tag',
  data () {
    return {
      dialogVisible: false,
      form: {
        name: '',
      },
      dataRule: {
        name: [{ required: true, message: '请输入标签名', trigger: 'blur' },
              { min: 1, max: 14, message: '长度在 1 到 14 个字符', trigger: 'blur' }],
      },
    }
  },
  methods: {
    init( channelId, timestamp,fileType ) {
      this.$nextTick(()=>{
        this.dialogVisible = true
        this.channelId = channelId
        this.fileType = fileType
        this.timestamp = moment(timestamp).format("yyyy-MM-DD HH:mm:ss")
      })
    },
    // 表单提交
    save () {
      this.$refs['data-form'].validate((valid) => {
        if(valid) {
          let params = {
            channel: this.channelId,
            label: this.form.name,
            beginTime: this.timestamp,
            type: this.fileType,
          }
          tagConfig( params ).then(res => {
            this.$message.success('标签回放设置成功')
            this.dialogVisible = false
            this.form = {
              name: ''
            }
          }).catch(err => {
            this.$message.error(err.message)
          })
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
  .el-input {
    width: 70%;
    padding-right: 10px;
  }
</style>
