<template>
   <div class="Commonparameter">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="高级参数" name="first">
        <el-form ref="form" label-position="left" size="mini" :model="form" label-width="150px">
          <el-form-item label="通道">
            <el-select v-model="form.channel" @change="onChannelChange" style="width: 220px" placeholder="请选择">
              <el-option
                v-for="item in channelList"
                :style="{color:item.deleteItem ? '#ff0000' : ''}"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="录像码流">
            <el-select v-model="form.recStreamList" style="width: 220px" multiple placeholder="请选择录像码流" disabled>
              <el-option label="主码流" :value="1"></el-option>
              <el-option label="子码流" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="预录">
            <el-select v-model="form.preTime" style="width: 220px" placeholder="">
              <el-option label="0秒" :value="0"></el-option>
              <el-option label="5秒" :value="5"></el-option>
              <el-option label="10秒" :value="10"></el-option>
              <el-option label="15秒" :value="15"></el-option>
              <el-option label="20秒" :value="20"></el-option>
              <el-option label="25秒" :value="25"></el-option>
              <el-option label="30秒" :value="30"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="事件延录">
            <el-select v-model="form.delayTime" style="width: 220px" placeholder="">
              <el-option label="5秒" :value="5"></el-option>
              <el-option label="10秒" :value="10"></el-option>
              <el-option label="30秒" :value="30"></el-option>
              <el-option label="60秒" :value="60"></el-option>
              <el-option label="120秒" :value="120"></el-option>
              <el-option label="240秒" :value="240"></el-option>
              <el-option label="300秒" :value="300"></el-option>
              <el-option label="360秒" :value="360"></el-option>
              <el-option label="480秒" :value="480"></el-option>
              <el-option label="600秒" :value="600"></el-option>
            </el-select>
          </el-form-item>
          <!-- 
          <el-form-item label="录像过期时间（天）">
            <el-input type="text"  style="width: 220px" v-model="form.expires"></el-input>
          </el-form-item>
          <el-form-item label="">
              <el-checkbox  v-model="form.redundantRec" label="冗余录像/抓图" ></el-checkbox>
          </el-form-item>
          -->
          <el-form-item>
            <el-button type="primary" @click="onSave">应用</el-button>
            <el-button @click="onChannelCopy">复制</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="打包模式" name="second">
        <el-form label-position="left" size="mini" :model="form2" :rules="dataRule" ref="data-form" label-width="150px">
          <el-form-item label="录像打包模式">
            <el-select v-model="form2.packageMode" style="width: 220px" placeholder="">
              <el-option label="按时间" :value="1"></el-option>
              <el-option label="按大小" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="大小（MB）" v-show="form2.packageMode == 2" prop="size">
            <el-input type="text" style="width: 220px"  v-model.number="form2.size"></el-input>
          </el-form-item>
          <el-form-item label="时长（分钟）" v-show="form2.packageMode == 1" prop="Time">
            <el-input type="text" style="width: 220px" v-model.number="form2.Time"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onBuildSave">应用</el-button>
          </el-form-item>
        </el-form>
        
      </el-tab-pane>
      
    </el-tabs>
    <el-dialog :append-to-body="true"  :close-on-click-modal="false"  title="复制到" :visible.sync="dialogVisibleChannel" @close="onChannelClose">
       <el-checkbox :indeterminate="isIndeterminateChannel" v-model="checkAllChannel" @change="checkAllChannelChange">全选</el-checkbox>
        <el-checkbox-group v-model="checkedChannel" @change="checkedChannelChange">
          <el-checkbox v-for="item in channels" :label="item" :key="item">{{channelOBJ[item]}}</el-checkbox>
        </el-checkbox-group>
        <div slot="footer" class="dialog-footer">
          <el-button @click="onChannelClose">取 消</el-button>
          <el-button type="primary" @click="onChannelSave">确 定</el-button>
        </div>
    </el-dialog>
   </div>
</template>
<script>
import { getChannelList, getChannelParam, putChannelParam, getPackParam, putPackParam } from '@/api/systemAPI';
export default {
  name: 'Commonparameter',
  data(){
    let limitSize = (rule, value, callback) => {
      if (this.form2.packageMode == 2) {
        if(isNaN(value)){
            callback(new Error('只允许输入数字'))
            //如果某个字段要求整数+数字
        } else if (rule.isInteger && !Number.isInteger(+value)) {
            callback(new Error('只允许输入整数'))
        } else if (value < 32 || value > 2048) {
            callback(new Error('大小范围应为32~2048MB'))
        } else {
            callback()
        } 
      } else {
        callback()
      }
    }
    let limitTime = (rule, value, callback) => {
      if (this.form2.packageMode == 1) {
        if(isNaN(value)){
            callback(new Error('只允许输入数字'))
            //如果某个字段要求整数+数字
        } else if (rule.isInteger && !Number.isInteger(+value)) {
            callback(new Error('只允许输入整数'))
        } else if (value < 1 || value > 60) {
            callback(new Error('时长范围应为1~60分钟'))
        } else {
            callback()
        }
      } else {
        callback()
      }
    }
    return {
      activeName: 'first',
      form: {
          channel: '',
          recStreamList: [],
          preTime: 10,
          delayTime: 10,
          expires: 120,
          redundantRec: false,
          netAbnlRec: '',
      },
      form2: {
          packageMode: 2,
          Time: 60,
          size: 1024,
      }, 
      secondaryDevelop: {
          eventDb: ''
      },
      dialogVisibleChannel: false,
      checkAllChannel: false,
      checkedChannel: [],
      checkedChannelSave: [],
      channels: [],
      isIndeterminateChannel: false,
      dataRule: {
          size: [{ required: true, message: '请输入大小', trigger: 'blur' },
              { validator: limitSize, trigger: 'blur' }],
          Time: [{ required: true, message: '请输入时长', trigger: 'blur' },
              { validator: limitTime, trigger: 'blur' }],
      },
      channelAllList: [],
    }
  },
  created() {
    this.queryChannelList()
    this.queryPackParam()
    this.nvrRd = Number(localStorage.getItem('nvrRd'))
    for (let i = 0; i < this.nvrRd; i++) {
        this.channelAllList.push({
            name: '[' + 'D'+(i+1) + ']（未添加/不在线或已删除）',
            id: i+1,
            deleteItem: true
        })
    }
  },
  methods: {
     queryChannelList(){
      this.channelList= []
      this.channels= []
      this.channelOBJ= {}
        getChannelList().then((res) => {
          if (res.data.code === 200000) {
                let arr = res.data.data
                arr.forEach(item=> {
                  let name = !item.chanNameList ? '' : (item.chanNameList.length>0 ? item.chanNameList[0].channelName : '')
                  this.channelList.push({
                    name: '[' + item.channelType + "" + item.channel + ']' + name,
                    id: item.channel + ""
                  })
                  this.channelOBJ[item.channel + ""] = (item.channelType + "" + item.channel);
                  this.channels.push(item.channel)
                })
                for (let i = 0; i < this.channelList.length; i++) {
                  for (let j = 0; j < this.channelAllList.length; j++) {
                    if (this.channelList[i].id == this.channelAllList[j].id) {
                      this.channelAllList[j].name = this.channelList[i].name
                      this.channelAllList[j].deleteItem = false
                    }
                  }
                }
                this.channelList = this.channelAllList
                this.form.channel = this.channelList[0].id
                this.queryChannelParam(this.form.channel)
                this.checkedChannelSave = [this.form.channel]
                this.isIndeterminateChannel = true
              }
        });
    },
    queryChannelParam(ID){
      getChannelParam(ID).then((res) => {
          if (res.data.code === 200000) {
              //this.form.channel = res.data.data ? res.data.data.channel : ""
              this.form.recStreamList = res.data.data ? res.data.data.recStreamList :[]
              this.form.preTime = res.data.data ? res.data.data.preTime : 10
              this.form.delayTime = res.data.data ? res.data.data.delayTime : 10
              this.form.expires = res.data.data ? res.data.data.expires : 120
              this.form.redundantRec = res.data.data ? res.data.data.redundantRec == 1 ? true:false : false
              this.form.netAbnlRec = res.data.data ? res.data.data.netAbnlRec : 0
           
          }
      });
    },
    queryPackParam(){
      getPackParam().then((res) => {
          if (res.data.code === 200000) {
              this.form2.packageMode = res.data.data ? res.data.data.packageMode || 2 : 2
              this.form2.Time = res.data.data ? res.data.data.time : 60
              this.form2.size = res.data.data ? res.data.data.size : 1024
          }
      });
    },
     // 切换通道
    onChannelChange(e){
      this.checkedChannelSave = [this.form.channel]
      this.queryChannelParam(e)
    },
    handleClick(tab, event) {
      console.log(tab.paneName);
      if(tab.paneName == 'second') {
        
        this.queryPackParam()
      } else {
         this.queryChannelList()
      }
    },
    // show复制到通道
    onChannelCopy() {
      this.dialogVisibleChannel = true
      this.checkedChannel = [...this.checkedChannelSave]
      console.log(this.checkedChannel)
    },
    // 复制到通道保存
    onChannelSave(){
       this.checkedChannelSave =  this.checkedChannel
       this.dialogVisibleChannel = false
    },
    // 复制到通道保存
    onChannelClose(){
       this.dialogVisibleChannel = false
       this.checkedChannel = []
    },
    checkAllChannelChange(val) {
      this.checkedChannel = val ? this.channels : [];
      this.isIndeterminateChannel = false;
    },
    checkedChannelChange(value) {
      let checkedCount = value.length;
      this.checkAllChannel = checkedCount === this.channels.length;
      this.isIndeterminateChannel = checkedCount > 0 && checkedCount < this.channels.length;
    },
    // 保存高级参数
    onSave() {
      for(let i in this.checkedChannelSave) {
        this.setChannelList(String(this.checkedChannelSave[i]), {
          channel: String(this.checkedChannelSave[i]),
          delayTime: this.form.delayTime,
          expires: Number(this.form.expires),
          preTime: this.form.preTime,
          recStreamList: this.form.recStreamList,
          redundantRec: Number(this.form.redundantRec),
        }, i)
      }
    },
    setChannelList(ID,data, i){
      putChannelParam(ID,data).then((res) => {
          if (res.data.code === 200000) {
            if(i == this.checkedChannelSave.length - 1) {
              this.$message.success('保存成功！')
            }
          } else {
            this.$message.error('保存失败！')
          }
      }).catch(() => {
         this.$message.error('保存失败！')
      });
    },
    onBuildSave() {
      this.$refs['data-form'].validate((valid) => {
        console.log('valid',valid);
        if (valid) {
          let obj = {
            Time: Number(this.form2.Time),
            packageMode: this.form2.packageMode,
            size: Number(this.form2.size),
          }
          putPackParam(obj).then((res) => {
              if (res.data.code === 200000) {
                this.$message.success('保存成功！')
              } else {
                this.$message.error('保存失败！')
              }
          }).catch(() => {
            this.$message.error('保存失败！')
          }); 
        }
      })
    }
  }
}
</script>
<style scoped>
.Commonparameter{
    height: 100%;
}
</style>
