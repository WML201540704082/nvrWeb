<template>
  <div class="storageschema">
    <el-form label-position="left" label-width="120px" size="mini" :model="form1">
        <el-form-item label="存储模式">
           <el-radio-group v-model="form1.mode" @change="onModeChange" style="width: 220px">
                <el-radio :label="1">盘组</el-radio>
                <!-- <el-radio  :label="2">配额</el-radio> -->
            </el-radio-group>
        </el-form-item>
        <el-form-item label="盘组号" v-if="form1.mode == 1">
            <el-select v-model="form1.groupId" @change="onGroupChange" placeholder="" style="width: 220px">
                <el-option v-for="item in groupList" :label="item.groupId + (item.showInfo ? '(已分盘)' : null)" :value="item.groupId" :key="item.groupId"></el-option>
            </el-select>
        </el-form-item>
        <!-- <el-form-item label="工作盘符" v-if="form1.mode == 1">
            <el-input v-model="form1.name" style="width: 220px"></el-input>
        </el-form-item> -->

        <!-- <el-form-item label="通道号" v-if="form1.mode == 2">
            <el-select v-model="form1.channel" @change="onChannelChange" placeholder="活动区域" style="width: 220px">
                <el-option v-for="item in channelList" :label="item.name" :value="item.id" :key="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="录像佩额（GB）"  v-if="form1.mode == 2">
            <el-input v-model="form1.pic" style="width: 220px"></el-input>
        </el-form-item>
        <el-form-item label="图片佩额（GB）"  v-if="form1.mode == 2">
            <el-input v-model="form1.rec" style="width: 220px"></el-input>
        </el-form-item>
        <el-form-item label="磁盘总容量"  v-if="form1.mode == 2">
            <span style="width: 220px">{{form1.diskFreeSize}}</span>
        </el-form-item>
        <el-form-item label="剩余配额总容量"  v-if="form1.mode == 2">
            <span style="width: 220px">{{form1.diskTotalSize}}</span>
        </el-form-item> -->
        <div  v-if="form1.mode == 1" style="padding: 10px 0 20px 0;width:60%">
            <el-form-item label="通道分配"></el-form-item>
            <el-checkbox :indeterminate="isIndeterminate1" v-model="checkAll1" @change="onCheckAllChange1">全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="checkedChannel1" @change="onCheckChange1">
                <el-checkbox v-for="item in channels1" style="width: 40px" :label="item" :key="item" :disabled="channelsSel.indexOf(item)==-1 ? false : true">{{channelOBJ[item]}}</el-checkbox>
            </el-checkbox-group>
        </div>
        <div  v-if="form1.mode == 1">
            <el-button type="primary" size="small" @click="onSave1">应用</el-button>
        </div>
        <div  v-if="form1.mode == 2">
            <el-button type="primary" size="small" @click="onSave2">应用</el-button>
            <el-button size="small" @click="onChnnelCopy">复制</el-button>
        </div>
    </el-form>
    
     <el-dialog :append-to-body="true"  :close-on-click-modal="false"  title="复制到" width="500px" :visible.sync="dialogVisibleChannel" @close="onChannelClose">
       <el-checkbox :indeterminate="isIndeterminateChannel" v-model="checkAllChannel" @change="checkAllChannelChange">全选</el-checkbox>
        <el-checkbox-group v-model="checkedChannel" @change="checkedChannelChange">
          <el-checkbox v-for="item in channels" :label="item" :key="item">{{channelOBJ[item]}}</el-checkbox>
        </el-checkbox-group>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="onChannelClose">取 消</el-button>
          <el-button size="mini" type="primary" @click="onChannelSave">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import { getChannelList, getStorageMode, putStorageMode,
getStorageGroup, putStorageGroup,getStorageQuota,putStorageQuota, getDiskInfo } from '@/api/systemAPI';
export default {
  name: 'storageschema',
  components: {
  },
  data(){
    return {
       form1: {
        mode: 1,
        channel: '',
        groupId: 1,
        name: '',
        pic: 0,
        rec: 0,
        diskFreeSize: 0,
        diskTotalSize: 0,
       },
        checkAll1: false,
        checkedChannel1: [],
        channels1: [],
        groupList: [{groupId:1},{groupId:2},{groupId:3},{groupId:4},
                    {groupId:5},{groupId:6},{groupId:7},{groupId:8}],
        isIndeterminate1: true,
        dialogVisibleChannel: false,
        checkAllChannel: false,
        checkedChannel: [],
        checkedChannelSave: [],
        channels: [],
        channelsSel: [],
        isIndeterminateChannel: false,
        quotaList:[],
        storageGroupList: {}
    }
  },
  mounted() {
  },
  mounted() {
    this.queryGroupList()
    this.queryChannelList()
    this.queryStorageMode()
  },  
  watch:{
    checkedChannel1:{
          handler(n,o){
            this.updatasStorageGroup(n)
          },
          deep:true,
          immediate:true,
      }
  },
  methods: {
    // 获取盘组号
    queryGroupList() {
      getDiskInfo().then(res => {
        if(res.data.code === 200000) {
          let diskInfoList = res.data.data.diskStorageList
          this.groupList.forEach((item,index)=>{
            diskInfoList.forEach(it=>{
              if (item.groupId == it.groupId) {
                this.groupList[index].showInfo = true
              }
            })
          })
        }
      })
    },
    // 获取通道列表
     queryChannelList(){
        this.channelList= []
        this.channelOBJ = {}
        this.channels = []
        //请求录像计划
        getChannelList().then((res) => {
            if (res.data.code === 200000) {
                let arr = res.data.data
                arr.forEach(item=> {
                  this.channelList.push({
                    name: item.channelType + "" + item.channel,
                    id: item.channel
                  })
                  this.channelOBJ[item.channel] = item.channelType + "" + item.channel;
                  this.channels.push(item.channel)
                  this.channels1.push(item.channel)
                })
                this.form1.channel = this.channelList[0] ? this.channelList[0].id :''
                console.log(this.form1.channel)
                this.checkedChannelSave = [this.form1.channel]
                this.isIndeterminateChannel = true
            }
        });
    },
    // 获取存储模型
    queryStorageMode(){
      getStorageMode().then(res => {
        if(res.data.code == 200000) {
          this.form1.mode = res.data.data.mode
          if(this.form1.mode == 2) {
            this.queryStorageQuota()
          } else {
            this.querytStorageGroup()
          }
        }
      })
    },
    saveStorageMode(){
      putStorageMode({mode: this.form1.mode}).then(res => {
        if(res.data.code == 200000) {
          this.$message({
            showClose:true,
            message:'保存成功！',
            type: 'success'
          })
        } else {
           this.$message({
            showClose:true,
            message:'保存失败！',
            type: 'error'
          })
        }
      }).catch(()=>{
        this.$message({
            showClose:true,
            message:'保存失败！',
            type: 'error'
          })
      })
    },
    onModeChange(e) {
       this.$confirm('修改存储模式需重启后生效，请确认是否立即进行重启？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.saveStorageMode()
          if(this.form1.mode == 2) {
            this.queryStorageQuota()
          } else {
            this.querytStorageGroup()
          }
        }).catch(() => {
          if(this.form1.mode == 1){
            this.form1.mode = 2
          } else if(this.form1.mode == 2) {
            this.form1.mode = 1
          }
        });
    },
    onCheckAllChange1(val) {
        this.checkedChannel1 = val ? this.channels1.filter(item=>this.channelsSel.indexOf(item)==-1) : [];
        this.isIndeterminate1 = false;
    },
    onCheckChange1(value) {
        let checkedCount = value.length;
        this.checkAll1 = checkedCount === this.channels1.length;
        this.isIndeterminate1 = checkedCount > 0 && checkedCount < this.channels1.length;
        // this.storageGroupList[this.form1.groupId] ? this.storageGroupList[this.form1.groupId] = value : ''
    },
    
    checkAllChannelChange(val) {
      this.checkedChannel = val ? this.channels : [];
      this.isIndeterminateChannel = false;
    },
    checkedChannelChange(value) {
      let checkedCount = value.length;
      this.checkAllChannel = checkedCount === this.channels.length;
      this.isIndeterminateChannel = checkedCount > 0 && checkedCount < this.channels.length;
      // 跟新保存数据
      // this.updatasStorageGroup()
    },
    // show复制到通道
    onChnnelCopy() {
      this.dialogVisibleChannel = true
      this.checkedChannel = this.checkedChannelSave
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
    // 获取盘组数据
    querytStorageGroup(){
      this.storageGroupList = {}
      this.channelsSel = []
      this.checkedChannel1 = []
      getStorageGroup().then(res => {
        if(res.data.code == 200000) {
          let obj = res.data.data.storageGroupList
          this.storageGroupList = res.data.data.storageGroupList
          // 初始化多选框不disabled，后期要修改掉
          // for(let key in obj) {
          //   this.form1.groupId = key
          //   this.checkedChannel1 = obj[key].map(Number)
          //   this.channelsSel = [...this.checkedChannel1]
          //   this.updatasStorageGroup(this.checkedChannel1)
          //   // break;
          // }
          for(let key in obj) {
            this.checkedChannel1 = obj[this.form1.groupId].map(Number)
            this.channelsSel = [...this.checkedChannel1]
            this.updatasStorageGroup(this.checkedChannel1)
            break;
          }
          // 记录总的已选择通道
         
        }
      })
    },
    // 盘组change
    onGroupChange(e) {
        // 赋值新通道
        this.checkedChannel1 = this.storageGroupList[e] ? this.storageGroupList[e].map(Number) : []
        this.updatasStorageGroup(this.checkedChannel1)

    },
    updatasStorageGroup(val){
      
      this.storageGroupList[Number(this.form1.groupId)] = val
      // 记录总的已选择通道
      let arr1 = []
      for(let k in this.storageGroupList) {
        if(Number(this.form1.groupId) != k) {
          arr1 = [...arr1, ...this.storageGroupList[k]]
        }
      }
      this.channelsSel = [...new Set(arr1)]
    },
    // 保存盘组数据
    onSave1(){
      let list = []
      for(let k in this.storageGroupList) {
        let arr = []
        if(this.storageGroupList[k]&&this.storageGroupList[k].length) {
          this.storageGroupList[k].forEach(item => {
            arr.push(item + "")
          })
          list.push({
            groupId: Number(k),
            channels: arr
          })
        }

      }
      putStorageGroup({'storageGroupList':list}).then(res => {
        if(res.data.code == 200000) {
          this.$message({
            showClose:true,
            message: '保存成功！',
            type: 'success'
          })
        }else {
          this.$message({
            showClose:true,
            message:'保存失败！',
            type: 'error'
          })
        }
      }).catch(()=>{
        this.$message({
            showClose:true,
            message:'保存失败！',
            type: 'error'
          })
      })
    },
    // 获取配额储存数据
    queryStorageQuota(){
      getStorageQuota().then(res => {
        if(res.data.code == 200000) {
          this.quotaList = res.data.data.quotaList
          this.form1.diskFreeSize = res.data.data.diskFreeSize
          this.form1.diskTotalSize = res.data.data.diskTotalSize
          if(this.quotaList.length) {
            this.onChannelChange(Number(this.quotaList[0].channel))
          }
        }
      })
    },
    // 通道change
    onChannelChange(e) {
      this.form1.pic = 0
      this.form1.rec = 0
      this.checkedChannelSave = [e]
      let obj = this.quotaList.filter(item => { return item.channel == e})
      this.form1.pic = obj[0] ?  obj[0].pic : 0
      this.form1.rec = obj[0] ?  obj[0].rec : 0
    },
    // 配额存储保存
    onSave2() {
      let arr = []
      this.checkedChannelSave.forEach(item => {
        arr.push({
          channel: item +"",
          pic: Number(this.form1.pic),
          rec: Number(this.form1.rec),
        })
      })
      let obj={
        quotaList: arr,
        diskFreeSize: this.form1.diskFreeSize,
        diskTotalSize: this.form1.diskTotalSize,
      }
      putStorageQuota(obj).then(res => {
        if(res.data.code == 200000) {
          this.$message({
            showClose:true,
            message: '保存成功！',
            type: 'success'
          })
        }else {
          this.$message({
            showClose:true,
            message:'保存失败！',
            type: 'error'
          })
        }
      }).catch(()=>{
        this.$message({
            showClose:true,
            message:'保存失败！',
            type: 'error'
          })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.storageschema{
    height: 100%;
    .el-form-item__label {
      font-weight: 500;
      color: #333333;
    }
}
</style>
