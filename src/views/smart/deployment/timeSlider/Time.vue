<template>
  <div class="TimeDiv" v-if="isReloadData">
    <div class="btnList">
        <div class="title">布防时间表</div>
        <div class="btnCon">
          <el-button size="small" class="timeBut" @click="onEdit">编辑</el-button>
          <el-button size="small" class="timeBut" :disabled="deleteFlag" @click="onDelete">删除</el-button>
          <el-popconfirm
            @confirm="onDeleteAll"
            title="确认删除所有时间段？">
            <el-button  slot="reference" class="timeBut" size="small">全部删除</el-button>
          </el-popconfirm>
        </div>
    </div>
    <div v-for="item in timeArr" :key="item.id">
      <TimeSlider :record="item" :reloadFlag="reloadFlag" :selectFlag="selectFlag" @updataSelect="onUpdataSelect"  @updataTime="onUpdataTime" />
    </div>
    <el-dialog :append-to-body="true"  :close-on-click-modal="false"  title="编辑" @close="onClose" :visible.sync="dialogVisible">
      <div>
        <div style="margin-bottom:10px">
          <span class="label2">星期选择</span> 
          <el-select v-model="dayValue" @change="onDayChange" size="mini" placeholder="请选择活动区域">
            <el-option label="星期一" :value="1"></el-option>
            <el-option label="星期二" :value="2"></el-option>
            <el-option label="星期三" :value="3"></el-option>
            <el-option label="星期四" :value="4"></el-option>
            <el-option label="星期五" :value="5"></el-option>
            <el-option label="星期六" :value="6"></el-option>
            <el-option label="星期日" :value="7"></el-option>
          </el-select>
        </div>
        <div v-for="(item,index) in (dayValue === 1 ? time1 : dayValue === 2 ? time2 : dayValue === 3 ? time3 :
                                     dayValue === 4 ? time4 : dayValue === 5 ? time5 : dayValue === 6 ? time6 : time7)" style="margin-bottom:10px" :key="index">
          <span class="label2">时间段{{index+1}}</span>
          <el-time-picker
            :editable="false"
            is-range
            style="margin-right:20px"
            size="mini"
            v-model="item.timeArr"
            value-format="HH:mm:ss"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间">
          </el-time-picker>
        </div>
        <div>
          <span>复制到</span>
        </div>
       <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
        <el-checkbox v-for="item in cities" :label="item" :disabled="dayValue == item" :key="item">{{dayObjFormat[item]}}</el-checkbox>
      </el-checkbox-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button :disabled="!this.isReloadData" type="primary" @click="onEditSave">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import TimeSlider from './TimeSlider.vue';
import bus from '@/utils/eventBus'
import { getVideoPlan, putVideoPlan } from '@/api/systemAPI';
export default {
  name: 'TimeDiv',
  components: {
    TimeSlider
  },
  props: {
    timeArr: {
      type: Array,
      required: true,
    },
  },
  data(){
    return {
			  isReloadData: true,
        channelOBJ: {},
        channelID: '',
        dialogVisible: false,
        dayValue: 1,
        defenseTime: [],
        defenseTimeOBJ: {},
        time1:[
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
        ],
        time2:[
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
        ],
        time3:[
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
        ],
        time4:[
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
        ],
        time5:[
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
        ],
        time6:[
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
        ],
        time7:[
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
          {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
        ],
        checkAll: false,
        checkedCities: [],
        cities: [1,2,3,4,5,6,7],
        dayObjFormat: {
          1: '星期一',
          2: '星期二',
          3: '星期三',
          4: '星期四',
          5: '星期五',
          6: '星期六',
          7: '星期日'
        },
        isIndeterminate: false,
        dialogVisibleChannel: false,
        checkAllChannel: false,
        checkedChannel: [],
        checkedChannelSave: [],
        channels: [],
        isIndeterminateChannel: false,
        reloadFlag: false,
        selectFlag: false,
        deleteFlag: true
    }
  },
  created() {
    this.canvasW = document.body.clientWidth / 2.3
  },
  mounted() {
    this.isReloadData = false
    this.$nextTick(() => {
      this.isReloadData = true
    })
  },
  methods: {
    clearCopy() {
      this.checkAll = false
      this.checkedCities = []
      this.isReloadData = false
			this.$nextTick(() => {
				this.isReloadData = true
			})
    },
    updataReloadFlag() {
        this.reloadFlag = !this.reloadFlag
    },
    onUpdataTime(id,record,flag){
      this.timeArr[id-1] = record;
      if(flag) {
        this.deleteFlag = false
      } else {
         this.deleteFlag = true
      }
    },
    onUpdataSelect(){
       this.timeArr.map(item=> {
        item.timeObj.type1.map(subItem=> {
           delete subItem.S
        })
      })
      this.selectFlag = !this.selectFlag
    },
    // 编辑事件
    onEdit() {
      this.dialogVisible = true
      let obj = this.timeArr.filter(item=>{
        return item.id == this.dayValue
      })
      if(obj&&obj[0]){
        this[this.dayValue === 1 ? 'time1' : this.dayValue === 2 ? 'time2' : this.dayValue === 3 ? 'time3' :
             this.dayValue === 4 ? 'time4' : this.dayValue === 5 ? 'time5' : this.dayValue === 6 ? 'time6' : 'time7'] = this.formatDate1(obj[0].timeObj)
      }
    },
    // 编辑事件
    onClose() {
      // 清除复制
      this.isIndeterminate = false;
      this.checkedCities = []
    },
    formatDate1(record,flag){
      let arr1 = record.type1
      let arr4 = []
      arr1.forEach(item => {
         arr4.push(
            flag ?{start: item.start, end: item.end} : {start: item.start, end: item.end, timeArr: [item.start,item.end]}
          )
      });
      arr4.sort((a,b)=>{return this.timeToPx(a.start) - this.timeToPx(b.start)})
      if(arr4.length<8 && !flag){
        let num = 8-arr4.length
        for(let i=1;i<=num;i++){
          arr4.push( {start: "", end: "", timeArr: ['','']})
        }
      }
      return arr4
    },
    timeToPx(during){
      let arr= during.split(':')
      let num = arr[0]*60*60 + arr[1]*60 + arr[2]
      // return num / 10000
      return num / 10000 / (864 / this.canvasW)
    },
    // 修改后的时间段保存
    onEditSave(){
      for (let i = 1; i < 8; i++) {
        if (this['time'+i][0].timeArr[0]) {
          let obj=this.formatDate2(this['time'+i])
          this.timeArr[i-1].timeObj = Object.assign(this.timeArr[i-1].timeObj, obj)
          this.checkedCities.forEach(item=>{
            this.timeArr[item-1].timeObj = Object.assign(this.timeArr[item-1].timeObj, obj)
          })
        } 
      }
      this.reloadFlag = !this.reloadFlag
      this.dialogVisible = false
    },
    //删除时间段
    onDelete(){
      this.timeArr.map(item=> {
        item.timeObj.type1 = item.timeObj.type1.filter(subItem=> {
          return !subItem.S
        })
      })
      this.reloadFlag = !this.reloadFlag
    },
    // 全部删除
    onDeleteAll(){
      this.timeArr.map(item=> {
        item.timeObj.type1 = []
      })
        this.reloadFlag = !this.reloadFlag
    },
    formatDate2(record){
      let arr1 = []
      let arr11 = []
      let arr111 = []
      console.log(record)
      record.forEach(item=> {
        if(item.timeArr && item.timeArr[0] && item.timeArr[1]){
            arr1.push({
              X: this.timeToPx(item.timeArr[0]),
              W: this.timeToPx(item.timeArr[1]) - this.timeToPx(item.timeArr[0]),
            })
        }

      })
      arr11 = this.mergeData(arr1)
      arr11.forEach(item => {
        arr111.push({
          start: this.pxToTime(item.X),
          end: this.pxToTime(item.X+item.W),
        })
      })
      return {
        type1: arr111,
      }
    },
     // 合并有交叉时间点的数据
    mergeData(data){
        let intervals = [];
        data.forEach((item) => {
          intervals.push([item.X,item.X+item.W])
        })
        let res = [];
        let resN = []
        let len = intervals.length;
        if (len == 0) return [];
        intervals.sort((a, b) => a[0] - b[0]);
        for(let i = 0;i < len;i++){
            let left = intervals[i][0];
            let right = intervals[i][1];
            while (i < len - 1 && right >= intervals[i + 1][0]) {
                i++;
                right = Math.max(right, intervals[i][1]);
            }
            res.push([left, right]);
        }
        res.forEach(item => {
          resN.push({
            X: item[0],
            W: item[1] - item[0]
          })
        })
        return resN;
      },
      //该方法用于给日期、时间补零
      addZero(num){
          if (parseInt(num) < 10) {
              num = "0" + num
          }
          return num
      },
      // 像素转时间
      pxToTime(during){
        if(during == 864) {
          return "23:59:59"
        }
        // during *= 100
        // let s = Math.floor(during / 1) % 60;
        // during = Math.floor(during / 60);
        // console.log('during',during);
        // debugger
        // let i = during % 60;
        // during = Math.floor(during / 60);
        // let h = during % 24;
        let minPx = 0.6; //1min占0.6，不论什么屏幕
        during = during.toFixed(5) * (864 / this.canvasW)
        if(String(during).includes('.9999')) {
          during = Math.ceil(during)
        }
        let s = Number(String(during.toFixed(4)).slice(-2)) % 60;
        let m = Math.floor(during / minPx % 60)
        let h = Math.floor(during / minPx / 60)
        return  this.addZero(h) + ':' + this.addZero(m) + ':' + this.addZero(s) ;
      },
    // 切换星期
    onDayChange(e){
      // if (this.dayValue === 1  && this.time1[0].timeArr[0]) {
      //   this.time1 = this.time1
      // } else if (this.dayValue === 2  && this.time2[0].timeArr[0]) {
      //   this.time2 = this.time2
      // } else if (this.dayValue === 3 && this.time3[0].timeArr[0]) {
      //   this.time3 = this.time3
      // } else if (this.dayValue === 4 && this.time4[0].timeArr[0]) {
      //   this.time4 = this.time4
      // } else if (this.dayValue === 5 && this.time5[0].timeArr[0]) {
      //   this.time5 = this.time5
      // } else if (this.dayValue === 6 && this.time6[0].timeArr[0]) {
      //   this.time6 = this.time6
      // } else if (this.dayValue === 7 && this.time7[0].timeArr[0]) {
      //   this.time7 = this.time7
      // } else {
      //   let obj = this.timeArr.filter(item=>{
      //     return item.id == e
      //   })
      //   if(obj&&obj[0]){
      //     this[this.dayValue === 1 ? 'time1' : this.dayValue === 2 ? 'time2' : this.dayValue === 3 ? 'time3' :
      //         this.dayValue === 4 ? 'time4' : this.dayValue === 5 ? 'time5' : this.dayValue === 6 ? 'time6' : 'time7'] = this.formatDate1(obj[0].timeObj)
      //   }
      // }

      let obj = this.timeArr.filter(item=>{
        return item.id == e
      })
      if(obj&&obj[0]){
        for(let i = 1; i < 8; i++) {
          if(this.dayValue === i) {
            this['time' + i] = this.formatDate1(obj[0].timeObj)
          } else {
            this['time' + i][0].timeArr = []
          }
        }
      }
      // 清除复制
      this.isIndeterminate = false;
      this.checkedCities = []
    },
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.cities.filter(item => {
        return item != this.dayValue
      }) : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length-1;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length-1;
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
    // 应用保存
    onSave() {
        let arr = []
        this.timeArr.forEach(item => {

          let arr2 = this.formatDate1(item.timeObj, true) || []
          arr.push({
            "week": item.id,
            "time": arr2
          })
        })
        this.timeArr = arr
    }
  }
}
</script>
<style lang="less" scoped>
.TimeDiv{
    height: 100%;
    padding: 20px;
    padding-left: 0;
    user-select:none;
}
.label1{
  display: inline-block;
  width: 100px;
}
.checkedBox{
  padding: 15px 0;
}
.inlineBlock{
  display: inline-block;
}
.boxList{
  padding-left: 60px;
  padding-top: 0px;
  display: inline-block;
}
.boxDiv{
  display: inline-block;
  margin: 0 20px 0 0;
}
.box1{
  background: rgb(32, 160, 255);
  width: 30px;
  height: 16px;
  border: 1px solid #666;
  margin-right: 8px;
  display: inline-block;
}
.box2{
  background: rgb(51, 153, 0);
  width: 30px;
  height: 16px;
  border: 1px solid #666;
  margin-right: 8px;
  display: inline-block;
}
.box3{
  background: rgb(226, 234, 244);
  width: 30px;
  height: 16px;
  border: 1px solid #666;
  margin-right: 8px;
  display: inline-block;
}
.boxName{
  display: inline-block;
  height: 20px;
  line-height: 20px;
  vertical-align: top;
}
.label2{
  display: inline-block;
  width: 80px;
}
.btnList{
  margin-bottom: 10px;
  width: calc(100vw / 2.12 - 60px);
  .btnCon {
    text-align: right;
    margin-top: -25px;
    /deep/ .el-button+.el-button, .el-checkbox.is-bordered+.el-checkbox.is-bordered {
      margin-left: 0;
    }
    .timeBut {
      margin-right: 20px;
    }
  }
  .title {
    display: inline-block;
    font-size: 13px;
    color: #333333;
    margin-top: 10px;
		font-weight: bold;
  }
}
</style>