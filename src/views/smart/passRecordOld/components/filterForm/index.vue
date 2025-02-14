<!--
 * @Author: Stephen
 * @Date: 2019-11-19 10:48:56
 * @LastEditors: Stephen
 * @LastEditTime: 2020-04-09 17:52:31
 -->
<template>
  <div class="filter_main" style="min-width:1040px;">
    <!-- 人脸 -->
    <el-col :span="20" style="background:#0e5688;width:100%;padding: 5px 20px;margin-left: -50px;">
      <!-- 告警类型 -->
      <div v-if="isAlarm" class="alramType" :style="{width: size.contentWidth - 144 + 'px'}">
        <div v-for="(item, index) of alramTypeList"
             :key="index"
             class="alramFont"
             :class="{active: filterParams['alertType'] === item.index}"
             :style="{ borderRight: (item.label !== 'AbnormalWarn' && filterType === 'face') || (item.label !== 'StrangerWarn' && filterType === 'vehicle')  ? '1px solid #dbdce7' : ''}"
             @click="chooseAlarmType(item.index)"
        >
          <span>{{$t(item.label)}}</span>
          <div class="alramFontLine" :style="{width:item.width}"></div>
        </div>
      </div>
      <!-- 过滤条件 时间 -->
      <div class="mt20" style="width:85%;">
        <div v-for="(item, index) of filterList" :key="index">
          <el-col v-if="item.type === 'time'" :span="item.span" :offset="item.offset" class="filterItem">
            <el-col :span="4" class="searchTitle" v-if="!filterAuto">{{ $t(item.label) }}</el-col>
            <el-col :span="19" class="flexRowBetween spanBox" v-if="!filterAuto">
              <button class="searchButton" v-for="(obj, index) of item.list" :key="index" :class="{active: filterParams[item.label] === obj.value}" @click="filter(item.label, obj.value)">
                <span class="searchFont">{{ $t(obj.label) }}</span>
              </button>
            </el-col>
            <div v-if="filterAuto" class="filterTime">
              <button style="width: 45px;height: 25px;
                      box-shadow: rgb(3 19 29) 2px 2px 4px;background-color: aqua;border: #0e5688;border-radius: 3px; margin-right: 3px;
                      font-size: 12px;color:#ffffff" @click="dateBack">返回</button>
              <el-date-picker v-model="startTime"
                              type="datetime"
                              size="mini"
                              class="ml10"
                              :style="{width: (size.contentWidth > 1600 ? 180 : 130) + 'px'}"
                              :picker-options="pickerOptionsStart"
                              @change="filter('startTime', startTime)"
                              placeholder="选择开始时间"
              ></el-date-picker>
              <span style="margin:0 3px;">-</span>
              <el-date-picker v-model="endTime"
                              type="datetime"
                              size="mini"
                              class="ml10"
                              :style="{width: (size.contentWidth > 1600 ? 180 : 130) + 'px'}"
                              :picker-options="pickerOptionsEnd"
                              @change="filter('endTime', endTime)"
                              placeholder="选择结束时间"
              ></el-date-picker>
            </div>
          </el-col>
          <!-- 标签 -->
          <el-col v-if="item.type === 'span'"
                  :span="item.span"
                  :offset="item.offset"
                  class="filterItem"
          >
            <el-col :span="4" class="searchTitle">{{ $t(item.label) }}</el-col>
            <el-col :span="19" class="flexRowBetween spanBox">
              <button class="searchButton" v-for="(obj, index) of item.list" :key="index" :class="{active: filterParams[item.label] === obj.value}" @click="filter(item.label, obj.value)">
                <span class="searchFont">{{ $t(obj.label) }}</span>
              </button>
            </el-col>
          </el-col>
          <!-- 输入框 车牌号 -->
          <el-col v-if="item.type === 'input'"
                  :span="item.span"
                  :offset="item.offset"
                  class="filterItem"
          >
            <el-col :span="5" class="searchTitle">{{ $t(item.label) }}</el-col>
            <input class="input inputSys inputBox"
                  size="mini"
                   v-model="vehicleID"
                   @change="filter('vehicleID', vehicleID)"
                   style="margin-left:10px"
                   :style="{width: (size.contentWidth > 1600 ? 240 : 180) + 'px'}"
            >
          </el-col>
          <!-- 单选 -->
          <el-col v-else-if="item.type === 'select'" class="filterItem" :span="item.span" :offset="item.offset">
            <el-col :span="5" class="searchTitle">{{ $t(item.label) }}</el-col>
            <el-select v-model="filterParams[item.label]" size="mini"
                       @change="filter(item.label, filterParams[item.label])"
                       style="margin-left:10px"
                       :style="{width: (size.contentWidth > 1600 ? 260 : 180) + 'px'}"
                       clearable
            >
              <el-option v-for="(val, key) of item.list" :key="key" :label="val.label" :value="val.value">
                <i class="iconfont" v-if="val.color" :style="{color: val.color, marginRight:'12px'}">&#xe62d;</i>{{val.label}}
              </el-option>
            </el-select>
          </el-col>
          <!-- 多选 channel -->
          <el-col v-else-if="item.type === 'multiSelect'"
                  :span="item.span"
                  :offset="item.offset"
                  clearable
          >
            <el-col :span="3.5" class="searchTitle" style="">{{ $t(item.label) }}</el-col>
            <el-select v-model="filterParams.channelIDs" @change="filter('channelID', filterParams.channelID)"
                       size="mini"
                       :style="{width: (size.contentWidth > 1600 ? 260 : 180) + 'px'}"
                       multiple
            >
              <el-option v-for="(item, key) of channelData"
                         :key="key"
                         :label="item._name"
                         :value="item.id"
                         class="ellipsis"
              >{{item.name}}</el-option>
            </el-select>
          </el-col>
          <!-- 联级选择 车辆品牌 -->
          <el-col v-else-if="item.type === 'cascader'"
                  :span="item.span"
                  :offset="item.offset"
                  class="filterItem"
          >
            <el-col :span="5" class="searchTitle" style="">{{ $t(item.label) }}</el-col>
            <el-cascader v-if="filterType === 'vehicle'"
                         v-model="brand"
                         size="mini"
                         class="cascaderBox"
                         :options="carBrand"
                         :props="{ checkStrictly: true }"
                         filterable
                         clearable
                         style="margin-left:10px"
                         :style="{width: (size.contentWidth > 1600 ? 260 : 180) + 'px'}"
                         @change="filter('make', brand)"
            ></el-cascader>
          </el-col>
        </div>
      </div>
      <div :span="4" style="position:relative;" >
        <el-dropdown size="small" 
                    split-button 
                    type="primary" 
                    class="btnExport" 
                    @command="showExport" 
                    v-if="APPMODE_CONFIG.FilterForm.export && !isAlarm && (filterType === 'vehicle' || filterType === 'nonmotor')"
        >
          导出
          <el-dropdown-menu slot="dropdown" class="exportItem">
            <el-dropdown-item
              v-for="(item,index) of exportData"
              :key="index"
              :command="item"
              class="exportMenu"
              :class="{ active: exportType === item.name }"
            >
            {{item.name}}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <button class="button btnItem" @click="clear">
          {{$t('ClaerConditons')}}
        </button>
      </div>
    </el-col>

    <el-dialog 
      title="导出"
      :before-close="handleExportClose"
      :close-on-click-modal="false"
      width="480px"
      :visible.sync="exportVisible"
      @close="closeDialog('exportForm')"
    >
      <div style="padding:10px 0 15px 0">
        <el-col :offset="2" style="margin-bottom:15px">
          当日车流量 
        </el-col>
        <div>
          <el-col :span="3" :offset="2" class="searchTitle" style="">通道</el-col>
          <el-select v-model="exportChannelID" size="mini"
                    style="margin-left:10px"
                    :style="{width: (size.contentWidth > 1600 ? 260 : 180) + 'px'}"
                    clearable
          >
            <el-option v-for="(item, key) of channelData"
                      :key="key"
                      :label="item.name"
                      :value="item.id"
            >{{item.name}}</el-option>
          </el-select>
        </div>
        <div style="margin-top:20px">
          <button class="delButton cancelBtn" @click="exportVisible = false">{{ $t("cancel") }}</button>
          <button
            class="button save"
            :disabled="btnDisabled"
            :class="{ active: btnDisabled === true }"
            @click="exportFlow"
          >{{ $t("confirm") }}</button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import json from './config'
import carBrand from '../utils/carBrand'
import moment from 'moment'
import { channelApi } from '@/api/pass.js'
import { debounce } from '../utils/debounce.js'
import { getAppMode } from '../utils/appMode.js'

export default {
  props: {
    filterParams: {
      type: Object,
      required: true
    },
    filterType: {
      type: String,
      required: false
    },
    isAlarm: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      size: {
        contentWidth: window.innerWidth,
        contentHeight: window.innerHeight
      },
      APPMODE_CONFIG: {
        FilterForm: {
          export: false,
        }
      },
      json,
      carBrand,
      // 按时间查询
      filterAuto: false,
      startTime: '',
      endTime: '',
      pickerOptionsStart: {
        disabledDate: time => {
          if (this.filterParams.endTime) {
            return time.getTime() > new Date(this.filterParams.endTime).getTime()
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          if (this.filterParams.startTime) {
            return time.getTime() < new Date(this.filterParams.startTime).getTime()
          }
        }
      },
      // chanel/车辆品牌查询
      channelData: [],
      brand: [],
      // 按input框查询
      vehicleID: '',
      exportVisible: false,
      exportChannelID: 0,
      btnDisabled: false,
      exportType: '报表',
      exportData: [{
        name: '报表',
        id: 1
      }, {
        name: '图片',
        id: 2
      }]
    }
  },
  created () {
    this.getAppMode()
    this.getChannel()
    // 搜索500ms延时
    this.$watch('vehicleID', debounce((newQuery) => {
      this.filter('vehicleID', this.vehicleID)
    }, 500))
  },
  computed: {
    filterList() {
      switch (this.filterType) {
        case 'face':
          return json.faceList
        case 'pedestrian':
          return json.pedestrianList
        case 'vehicle':
          return json.vehicleList
        case 'nonmotor':
          return json.nonmotorList
      }
    },
    alramTypeList() {
      switch (this.filterType) {
        case 'face':
          return json.faceTypeList
        case 'vehicle':
          return json.vehicleTypeList
      }
    }
  },
  methods: {
    async getAppMode() {
      const res = await getAppMode()
      this.APPMODE_CONFIG = res
    },
    getChannel () {
      const params = { pageSize: 99 }
      channelApi.Get(params)
       .then(res => {
         this.channelData = res.data.data
         this.channelData.forEach(item => {
           if (item.name.length > 6) {
             item._name = item.name.substring(0, 6) + '...'
           } else {
             item._name = item.name
           }
         })
       })
    },
    chooseAlarmType (val) {
      this.filterParams['alertType'] = val
      this.filterParams['pageNum'] = 1
      this.$emit('filter', this.filterParams)
    },
    filter (type, val) {
      // 点击后高亮
      this.filterParams[type] = val

      if (type === 'make') {
        this.filterParams.make = val[0] ? val[0] : ""
        this.filterParams.model = val[1] ? val[1] : ""
        // this.filterParams.year = val[2]
        delete this.filterParams.brand
      } else if (type === 'time') {
        const time = new Date()
        if (val === 'all') {
          this.filterParams.startTime = ''
          this.filterParams.endTime = ''
        } else if (val === 'today') {
          this.filterParams.startTime = moment(time).subtract(1, 'days').format('YYYY-MM-DD 16:00:00')
          this.filterParams.endTime = moment(time).format('YYYY-MM-DD 16:00:00')
          // this.filterParams.endTime = this.formatTime(time)
        } else if (val === 'threeDays') {
          // const startTime = new Date(time.getTime() - 10/3*24*60*60*1000)
          this.filterParams.startTime = moment(time).subtract(3, 'days').format('YYYY-MM-DD 16:00:00')
          this.filterParams.endTime = moment(time).format('YYYY-MM-DD 16:00:00')
          // this.filterParams.endTime = this.formatTime(time)
        } else if (val === 'sevenDays') {
          // const startTime = new Date(time.getTime() - 22/3*24*60*60*1000)
          this.filterParams.startTime = moment(time).subtract(7, 'days').format('YYYY-MM-DD 16:00:00')
          this.filterParams.endTime = moment(time).format('YYYY-MM-DD 16:00:00')
          // this.filterParams.endTime = this.formatTime(time)
        } else if (val === 'auto') {
          this.filterAuto = true
          this.filterParams.startTime = ''
          this.filterParams.endTime = ''
        } else {
        }
      } else if (type === 'startTime' || type === 'endTime') {
        if (this.filterParams.startTime) {
          this.filterParams.startTime = moment(this.startTime).subtract(8, 'hours').format('YYYY-MM-DD HH:mm:ss')
        }

        if (this.filterParams.endTime) {
          this.filterParams.endTime = moment(this.endTime).subtract(8, 'hours').format('YYYY-MM-DD HH:mm:ss')
        }
      }
      this.filterParams['pageNum'] = 1
      this.$emit('filter', this.filterParams)
    },
    formatTime (d) {
      function pad(n) {
          return n < 10 ? "0" + n : n;
      }
      return d.getFullYear() + "-" +
              pad(d.getMonth() + 1) + "-" +
              pad(d.getDate()) + " " +
              pad(d.getHours()) + ":" +
              pad(d.getMinutes()) + ":" +
              pad(d.getSeconds())
    },
    dateBack () {
      this.filterAuto = false
      this.startTime = ''
      this.endTime = ''
    },
    // 导出
    showExport(item) {
      this.exportType = item.name

      if (this.filterType === 'vehicle') {
        const { startTime, endTime, channelIDs, vehicleID, type, make, model, carColor, plateColor, marker, pose} = this.filterParams
        const token = localStorage.getItem('token')
        const a = document.createElement('a')
        if (item.name === '报表') {
          a.setAttribute('href', `/api/gasStation/vehicle/export/report?Authorization=${token}&startTime=${startTime}&endTime=${endTime}&channelIDs=${channelIDs}&`+
          `vehicleID=${vehicleID}&type=${type}&make=${make}&model=${model}&carColor=${carColor}&plateColor=${plateColor}&marker=${marker}&pose=${pose}`)
        } else {
          a.setAttribute('href', `/api/gasStation/vehicle/export/image?Authorization=${token}&startTime=${startTime}&endTime=${endTime}&channelIDs=${channelIDs}&`+
          `vehicleID=${vehicleID}&type=${type}&make=${make}&model=${model}&carColor=${carColor}&plateColor=${plateColor}&marker=${marker}&pose=${pose}`)
        }
        a.click()
      } else if (this.filterType === 'nonmotor') {
        const { startTime, endTime, channelIDs, transportation, transportationColor, attitude} = this.filterParams
        const token = localStorage.getItem('token')
        const a = document.createElement('a')
        if (item.name === '报表') {
          a.setAttribute('href', `/api/gasStation/nonmotor/export/report?Authorization=${token}&startTime=${startTime}&endTime=${endTime}&channelIDs=${channelIDs}&transportation=${transportation}&transportationColor=${transportationColor}&attitude=${attitude}`)
        } else {
          a.setAttribute('href', `/api/gasStation/nonmotor/export/image?Authorization=${token}&startTime=${startTime}&endTime=${endTime}&channelIDs=${channelIDs}&transportation=${transportation}&transportationColor=${transportationColor}&attitude=${attitude}`)
        }
        a.click()
      }
    },
    exportFlow() {
      const year = new Date().getFullYear()
      const month = new Date().getMonth() + 1
      const day = new Date().getDate()
      var startDate = `${year}-${month}-${day-1} 16:00:00`
      var endDate = `${year}-${month}-${day} 16:00:00`

      const token = localStorage.getItem('token')
      const a = document.createElement('a')
      a.setAttribute('href', `/api/history/gasStation/export?Authorization=${token}&startTime=${startDate}&endTime=${endDate}&channelIDs=${this.exportChannelID}`)
      a.click()
    },
    handleExportClose() {
      this.exportVisible = false
    },
    closeDialog() {

    },
    // 清除条件
    clear () {
      if (this.isAlarm) {
        this.filterParams['alertType'] = ''
      }
      this.filterAuto = false
      this.brand = []
      for (let i in this.filterParams) {
        if (i === 'time') {
          this.filterParams[i] = 'all'
        } else if (i === 'pageNum') {
          this.filterParams[i] = 1
        } else if (i === 'pageSize') {
          if (this.isAlarm) {
            this.filterParams[i] = 28
          } else {
            this.filterParams[i] = 60
          }
        } else {
          this.filterParams[i] = ''
        }
      }
      this.vehicleID = ''
      this.$emit('filter', this.filterParams)
    }
  }
}
</script>


<style lang="less" scoped>
.algo::-webkit-scrollbar {
  display: none;
}
.filter_main {
  scrollbar-width: none;
  
}
// 告警类型
.alramType {
  width:70px;
  height:20px;
  font-size:12px;
  font-weight:400;
  color:rgba(96,98,102,1);
  line-height:20px;
  margin-top: 20px
}
.alramFont {
  display: inline-block;
  
  padding-right: 10px;
  height: 15px;
  line-height: 15px;
  margin-right:10px
}
.alramFont:hover {
  color:black;
  font-weight:500;
  cursor:pointer;
}
.alramFontLine {
  opacity: 0;
  height:2px;
  background:blue;
  box-shadow:1px 0px 4px 0px blue;
  margin:3.5px 0 0 1px;
}
.alramFont:hover > .alramFontLine {
  opacity:1
}
.alramFont.active{
  color:black;
  font-weight:500;
}
.alramFont.active .alramFontLine {
  opacity:1
}
// 过滤查询
.searchTitle {
  height:30px;
  font-size:14px;
  font-weight:400;
  color:#ffffff;
  line-height:30px;
}
.searchFont {
  height:17px;
  font-size:12px;
  font-weight:400;
  color:#ffffff;
  line-height:17px;
}
// .searchFont:hover {
//   cursor:pointer;
//   color:blue
// }
// .searchFont.active {
//   color:blue
// }
// 图标
.iconClear {
  font-size:12px;
  height:11px
}

.spanBox {
  height:30px;
  line-height:30px;
}
.inputBox {
  height:24px;
}
.cascaderBox {
  margin-top:-5px;
  width:260px;
}
.filterItem {
  height:30px;
  white-space:nowrap;
  margin-bottom:10px
}
.btnExport {
  position:absolute;
  top:20px;
  right:115px
}
.btnItem {
  position:absolute;
  top:20px;
  right: 12px;
  cursor: pointer;
  background:#83bce4;
  border:rgb(0, 136, 255);
  color:#ffffff;
  padding: 4px;
  border-radius: 3px;
}
.btnItem:hover {
  background: rgb(0, 136, 255);
}
.cancelBtn {
  margin: 8px 12px 0px 116px;
}
.save.active {
  cursor: not-allowed;
  background: grey;
  border: none;
}
.exportMenu.active {
  color: blue;
}
.searchButton {
  width: 45px;
  height: 25px;
  box-shadow: rgb(3 19 29) 2px 2px 4px;
  background-color: #83bce4;
  border: #0e5688;
  border-radius: 3px;
  margin-right: 3px;
}
.searchButton:hover {
  cursor:pointer;
  background-color:rgb(0, 136, 255)
}
.searchButton.active {
  background-color:rgb(0, 136, 255)
}
</style>
