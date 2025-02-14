<template>
  <div class="video-program">
    <el-col :span="24" class="checkedBox" style="margin-bottom: 32px">
      <el-col :span="2" :offset="0" class="label1">通道</el-col>
      <el-form-item label="通道"></el-form-item>
      <el-select v-model="channelID" @change="onChannelChange" size="small" placeholder="请选择">
        <el-option
          v-for="item in channelList"
          :style="{color:item.deleteItem ? '#ff0000' : ''}"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="24" class="checkedBox" style="display: flex;">
      <el-col :span="2" :offset="0" class="label1" style="color: #000;font-weight: 500;">录像计划</el-col>
      <el-switch v-model="videoChecked"></el-switch>
    </el-col>
    <div>
      <div class="boxList">
        <div class="boxDiv">
          <span class=" box1"></span>
          <span class="boxName">定时</span>
        </div>
        <div class="boxDiv">
          <span class=" box2"></span>
          <span class="boxName">事件</span>
        </div>
        <div class="boxDiv">
          <span class=" box3"></span>
          <span class="boxName">无</span>
        </div>
      </div>
      
      <div class="btnList">
        <el-button size="small" style="margin-right:20px" @click="onEdit">编辑</el-button>
        <el-popconfirm
          @confirm="onDeleteAll"
          title="确认删除所有时间段？">
          <el-button  slot="reference" style="margin-right:20px" size="small">全部删除</el-button>
        </el-popconfirm>
        <el-button size="small" style="margin-right:20px" @click="onChnnelCopy">复制</el-button>
      </div>
    </div>
    <div v-for="item in timeArr" :key="item.id" class="time-slider-box">
      <TimeSlider :record="item" :reloadFlag="reloadFlag" @updataTime="onUpdataTime" />
    </div>
    <div>
       <el-button size="small" type="primary" style="margin-right:20px" @click="onSave">应用</el-button>
    </div>
    <el-dialog title="复制到" :append-to-body="true"  :close-on-click-modal="false"  :visible.sync="dialogVisibleChannel" @close="onChannelClose">
      <div style="margin: -20px 0 10px;">
        <div style="width: 10px;height: 10px;background: red;display: inline-block;"></div>
        <span style="color:#666666;font-size: 12px;margin-left: 10px;">红色表示通道未添加、不在线或已删除</span>
      </div>
       <el-checkbox :indeterminate="isIndeterminateChannel" v-model="checkAllChannel" @change="checkAllChannelChange">全选</el-checkbox>
        <el-checkbox-group v-model="checkedChannel" @change="checkedChannelChange">
          <el-checkbox style="width: 40px" :style="{color: item.deleteItem ? 'red' : ''}" v-for="item in channels" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
        </el-checkbox-group>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="onChannelClose">取 消</el-button>
          <el-button size="small" type="primary" @click="onChannelSave">确 定</el-button>
        </div>
    </el-dialog>
    <el-dialog title="编辑" :append-to-body="true"  :close-on-click-modal="false"  @close="onClose" :visible.sync="dialogVisible">
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
            is-range
            :editable="false"
            style="margin-right:20px"
            size="mini"
            v-model="item.timeArr"
            value-format="HH:mm:ss"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围">
          </el-time-picker>
            <el-checkbox v-model="item.timing">定时</el-checkbox>
            <el-checkbox v-model="item.event">事件</el-checkbox>
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
        <el-button type="primary" @click="onEditSave">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import TimeSlider from './timeSlider/TimeSlider.vue';
import { getChannelList, getVideoPlan, putVideoPlan } from '@/api/systemAPI';
export default {
  name: 'Videoprogram',
  components: {
    TimeSlider
  },
  data(){
    return {
        channelAllList: [],
        channelList: [],
        channelOBJ: {},
        channelID: '',
        videoChecked: true,
        dialogVisible: false,
        dayValue: 1,
        timeArr: [
          {label: '星期一',id:1, timeObj:{type1:[],type2:[]}},
          {label: '星期二',id:2, timeObj:{type1:[],type2:[]}},
          {label: '星期三',id:3, timeObj:{type1:[],type2:[]}},
          {label: '星期四',id:4, timeObj:{type1:[],type2:[]}},
          {label: '星期五',id:5, timeObj:{type1:[],type2:[]}},
          {label: '星期六',id:6, timeObj:{type1:[],type2:[]}},
          {label: '星期日',id:7, timeObj:{type1:[],type2:[]}}, //{end: "15:46:40",start: "12:28:20"}
        ],
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
    }
  },
  created() {
    this.nvrRd = Number(localStorage.getItem('nvrRd'))
    for (let i = 0; i < this.nvrRd; i++) {
        this.channelAllList.push({
            name: '[' + 'D'+(i+1) + ']（未添加/不在线或已删除）',
            id: i+1,
            deleteItem: true
        })
    }
  },
  mounted() {
    this.queryChannelList()
  },
  methods: {
    queryChannelList(){
        this.channelList= []
        this.channelOBJ = {}
        this.channels = []
        //请求录像计划
        getChannelList().then((res) => {
            if (res.data.code === 200000) {
                let arr = res.data.data
                arr.forEach(item=> {
                  let name = !item.chanNameList ? '' : (item.chanNameList.length>0 ? item.chanNameList[0].channelName : '')
                  this.channelList.push({
                    name: '[' + item.channelType + "" + item.channel + ']' + name,
                    id: item.channel
                  })
                  // this.channelOBJ[item.channel] = item.channelType + "" + item.channel;
                  // this.channels.push(item.channel)
                })
                for (let i = 0; i < this.channelList.length; i++) {
                  for (let j = 0; j < this.channelAllList.length; j++) {
                    if (this.channelList[i].id === this.channelAllList[j].id) {
                      this.channelAllList[j].name = this.channelList[i].name
                      this.channelAllList[j].deleteItem = false
                    }
                  }
                }
                this.channelList = this.channelAllList
                this.channels = this.channelList.map(item=>{
                  return {
                    id: item.id,
                    name: '[D' + item.id + ']',
                    deleteItem: item.deleteItem
                  }
                })
                this.channelID = this.channelList[0].id
                console.log(this.channelID)
                this.queryVideoPlan(this.channelID)
                this.checkedChannelSave = [this.channelID]
                this.isIndeterminateChannel = true
            }
        });
    },
    queryVideoPlan(channelID) {
        this.defenseTime = []
        //  this.defenseTime
         getVideoPlan(channelID).then((res) => {
              if (res.data.code === 200000) {
                this.defenseTime = res.data.data && res.data.data.defenseTime ?  res.data.data.defenseTime : []
                this.videoChecked = res.data.data && res.data.data.enable == "1" ? true:false
                this.defenseTime.forEach(item=>{
                    let arr1 = []
                    let arr2 = []
                    item.time.forEach(sub => {
                      if(sub.timing == 1){
                        arr1.push({
                          start: sub.start,
                          end: sub.end
                        })
                      }
                      if(sub.event == 1){
                        arr2.push({
                          start: sub.start,
                          end: sub.end
                        })
                      }
                    })
                    let weekIndex = item.week==0 ? 6 : item.week -1;
                    this.timeArr[weekIndex].timeObj = {type1: arr1,type2: arr2}
                })
              this.reloadFlag = !this.reloadFlag
              }
          });
    },
    // 切换通道
    onChannelChange(e){
      this.onDeleteAll()
      this.queryVideoPlan(e) 
      this.checkedChannelSave = [this.channelID]
    },
    onUpdataTime(id,record){
      this.timeArr[id-1] = record;
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
      let arr2 = record.type2
      let arr4 = []
      arr1.forEach(item => {
        let subIt = arr2.filter(subItem => {
          return subItem.start == item.start && subItem.end == item.end
        });
        if(subIt.length){
          arr4.push(
            flag ?{start: item.start, end: item.end, timing: 1, event: 1} : {start: item.start, end: item.end, timing: true, event: true, timeArr: [item.start,item.end]}
          )
        } else{
          arr4.push(
            flag ?{start: item.start, end: item.end, timing: 1, event: 0} : {start: item.start, end: item.end, timing: true, event: false, timeArr: [item.start,item.end]}
          )
        }
      });
      arr2.forEach(item => {
        let subIt = arr1.filter(subItem => {
          return subItem.start == item.start && subItem.end == item.end
        });
        if(!subIt.length){
          arr4.push(
            flag ?{start: item.start, end: item.end, timing: 0, event: 1} : {start: item.start, end: item.end, timing: false, event: true, timeArr: [item.start,item.end]}
          )
        }
      });
      arr4.sort((a,b)=>{return this.timeToPx(a.start) - this.timeToPx(b.start)})
      if(arr4.length<8 && !flag){
        let num = 8-arr4.length
        for(let i=1;i<=num;i++){
          arr4.push( {start: "", end: "", timing: false, event: false, timeArr: ['','']})
        }
      }
      return arr4
    },
    timeToPx(during){
      let arr= during.split(':')
      let num = arr[0]*60*60 + arr[1]*60 + arr[2]
      return num / 10000
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
    // 全部删除
    onDeleteAll(){
       this.timeArr = [
          {label: '星期一',id:1, timeObj:{type1:[],type2:[]}},
          {label: '星期二',id:2, timeObj:{type1:[],type2:[]}},
          {label: '星期三',id:3, timeObj:{type1:[],type2:[]}},
          {label: '星期四',id:4, timeObj:{type1:[],type2:[]}},
          {label: '星期五',id:5, timeObj:{type1:[],type2:[]}},
          {label: '星期六',id:6, timeObj:{type1:[],type2:[]}},
          {label: '星期日',id:7, timeObj:{type1:[],type2:[]}},
        ]
         this.reloadFlag = !this.reloadFlag
        console.log(this.timeArr)
    },
    formatDate2(record){
      //timeObj:{type1:[{end: "12:56:40",start: "10:16:40"}],type2:[]}}
      //  {start: "", end: "", timing: 0, event: 0, timeArr: ['','']},
      let arr1 = []
      let arr2 = []
      let arr11 = []
      let arr22 = []
      let arr111 = []
      let arr222 = []
      record.forEach(item=> {
        if(item.timing) {
          arr1.push({
            X: this.timeToPx(item.timeArr[0]),
            W: this.timeToPx(item.timeArr[1]) - this.timeToPx(item.timeArr[0]),
          })
        }
        if(item.event) {
          arr2.push({
            X: this.timeToPx(item.timeArr[0]) ,
            W: this.timeToPx(item.timeArr[1]) - this.timeToPx(item.timeArr[0]),
          })
        }
      })
      arr11 = this.mergeData(arr1)
      arr22 = this.mergeData(arr2)
      arr111 
      arr11.forEach(item => {
        arr111.push({
          start: this.pxToTime(item.X),
          end: this.pxToTime(item.X+item.W),
        })
      })
      arr22.forEach(item => {
        arr222.push({
          start: this.pxToTime(item.X),
          end: this.pxToTime(item.X+item.W),
        })
      })
      return {
        type1: arr111,
        type2: arr222,
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
        // during = during*100
        // let s = Math.floor(during / 1) % 60;
        // during = Math.floor(during / 60);
        // let i = during % 60;
        // during = Math.floor(during / 60);
        // let h = during % 24;
        // return  this.addZero(h) + ':' + this.addZero(i) + ':' + this.addZero(s) ;
        let minPx = 0.6; //1min占0.6，不论什么屏幕
        let s = Number(String(during.toFixed(4)).slice(-2)) % 60;
        let m = Math.floor(during / minPx % 60)
        let h = Math.floor(during / minPx / 60)
        return  this.addZero(h) + ':' + this.addZero(m) + ':' + this.addZero(s) ;
      },
    //删除时间段
    onDelete(){

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
      this.checkedChannel = val ? this.channels.map(item=>item.id) : [];
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
      console.log('this.checkedChannel',this.checkedChannel);
      debugger
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
            "week": item.id == 7 ? 0 : item.id,
            "time": arr2
          })
        })
        this.i = 0
        this.checkedChannelSave.forEach(item => {
          this.setChannelList(item, {
            channel: item + "",
            defenseTime: arr,
            enable: this.videoChecked ? "1" : "0"
          })
        })
    },
    setChannelList(ID,data){
      putVideoPlan(ID,data).then((res) => {
        this.i++
        if(this.i == this.checkedChannelSave.length) {
          if (res.data.code === 200000) {
             this.$message.success('保存成功！')
          } else {
            this.$message.error('保存失败！')
          }
        }
      }).catch(() => {
        this.i++
        if(this.i == this.checkedChannelSave.length) {
          this.$message.error('保存失败！')
        }
      });
    }
  }
}
</script>
<style lang="less" scoped>
.video-program{
    /* height: 100%; */
    background-color: #FFF;
    user-select:none;
    overflow-y: auto;
    // padding: 10px 20px;
    color: #000;
}
.label1{
  display: inline-block;
  width: 100px;
  color: #666666;
  font-size: 14px;
}
.checkedBox{
  padding-bottom: 16px;
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
  background: #2178C8;
  width: 14px;
  height: 14px;
  margin-right: 8px;
  display: inline-block;
}
.box2{
  background: rgb(51, 153, 0);
  width: 14px;
  height: 14px;
  margin-right: 8px;
  display: inline-block;
}
.box3{
  background: rgb(226, 234, 244);
  width: 14px;
  height: 14px;
  margin-right: 8px;
  display: inline-block;
}
.boxName{
  display: inline-block;
  height: 20px;
  line-height: 20px;
  vertical-align: top;
  color: #666666;
  font-size: 12px;
}
.btnList{
  display: inline-block;
  margin-left: 440px;
  margin-bottom: 10px;
  /* float: right; */
}
.time-slider-box{
  margin-bottom: 16px;
  .timeLabel, .flex-item {
    color: #666666;
  }
}

.label2{
  display: inline-block;
  width: 68px;
}
</style>
