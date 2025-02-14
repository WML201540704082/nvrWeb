<template>
  <div class="pedestrian history-container">
    <div class="filterBox" style="min-width:1040px;">
      <el-col :span="20" style="width:100%;padding: 5px 20px;">
        <!-- 过滤条件 -->
        <div class="mt20" style="width:85%;">
          <!-- 通道 -->
          <el-col :span="4" :offset="0" class="filterItem" clearable>
            <el-col :span="4" class="searchTitle" style="">{{ $t('camera') }}</el-col>
            <el-col :span="19" class="flexRowBetween spanBox channel-select">
              <el-select v-model="filterParams.channelIDs" @change="filter('channelID', filterParams.channelID)"
                size="mini" style="margin-left:10px" :style="{ width: (size.contentWidth > 1600 ? 260 : 180) + 'px' }" multiple>
                <el-option v-for="item in channelData" :key="'channelId' + item.channel" :label="item.chName" :value="item.channel + ''"
                  class="ellipsis">{{ item.chName }}</el-option>
              </el-select>
            </el-col>
          </el-col>
          <!-- 性别 -->
          <el-col :span="4" :offset="2" class="filterItem">
            <el-col :span="8" class="searchTitle">{{ $t('gender') }}</el-col>
            <el-col :span="16" class="flexRowBetween spanBox">
              <el-select v-model="filterParams['gender']" size="mini" @change="filter('gender', filterParams['gender'])"
                style="margin-left:10px" :style="{width: (size.contentWidth > 1600 ? 260 : 180) + 'px'}" clearable>
                <el-option v-for="(obj, index) of pedestrianList.gender" :key="index" :label="$t(obj.label)" :value="obj.value">
                  {{ $t(obj.label) }}
                </el-option>
              </el-select>
            </el-col>
          </el-col>
          <!-- 时间 -->
          <el-col :span="10" :offset="2" class="filterItem">
            <el-col :span="4" class="searchTitle">{{ $t('time') }}</el-col>
            <div class="flexRowBetween spanBox">
              <el-button-group>
                <el-button size="mini" style="padding-left: 7px;padding-right: 7px;" v-for="(obj, index) of commonList.time" :key="index"
                  :class="{ active: filterParams['time'] === obj.value }" @click="filter('time', obj.value)">
                  {{ $t(obj.label) }}
                </el-button>
              </el-button-group>
              <div v-if="filterAuto" style="display: inline-flex">
                <el-date-picker v-model="startTime" type="datetime" size="mini" class="ml10"
                  :style="{ width: (size.contentWidth > 1600 ? 180 : 130) + 'px' }" :picker-options="pickerOptionsStart"
                  @change="filter('startTime', startTime)" placeholder="选择开始时间"></el-date-picker>
                <span style="margin:0 3px;">-</span>
                <el-date-picker v-model="endTime" type="datetime" size="mini" class="ml10"
                  :style="{ width: (size.contentWidth > 1600 ? 180 : 130) + 'px' }" :picker-options="pickerOptionsEnd"
                  @change="filter('endTime', endTime)" placeholder="选择结束时间"></el-date-picker>
              </div>
            </div>
          </el-col>
          <!-- 年龄 -->
          <el-col class="filterItem" :span="4" :offset="0">
            <el-col :span="4" class="searchTitle">{{ $t('age') }}</el-col>
            <el-col :span="19" class="flexRowBetween spanBox">
              <el-select v-model="filterParams['age']" size="mini" @change="filter('age', filterParams['age'])"
                style="margin-left:10px" :style="{width: (size.contentWidth > 1600 ? 260 : 180) + 'px'}" clearable>
                <el-option v-for="(val, key) of pedestrianList.age" :key="key" :label="val.label" :value="val.value">
                  <i class="iconfont" v-if="val.color" :style="{color: val.color, marginRight:'12px'}">&#xe62d;</i>{{val.label}}
                </el-option>
              </el-select>
            </el-col>
          </el-col>
          <!-- 上身颜色 -->
          <el-col class="filterItem" :span="4" :offset="2">
            <el-col :span="8" class="searchTitle">{{ $t('upperColor') }}</el-col>
            <el-col :span="16" class="flexRowBetween spanBox">
              <el-select v-model="filterParams['upperColor']" size="mini" @change="filter('upperColor', filterParams['upperColor'])"
                style="margin-left:10px" :style="{width: (size.contentWidth > 1600 ? 260 : 180) + 'px'}" clearable>
                <el-option v-for="(val, key) of commonList.color" :key="key" :label="val.label" :value="val.value">
                  <i class="iconfont" v-if="val.color" :style="{color: val.color, marginRight:'12px'}">&#xe62d;</i>{{val.label}}
                </el-option>
              </el-select>
            </el-col>
          </el-col>
          <!-- 下身颜色 -->
          <el-col class="filterItem" :span="10" :offset="2">
            <el-col :span="4" class="searchTitle">{{ $t('lowerColor') }}</el-col>
            <el-col :span="10" class="flexRowBetween spanBox">
              <el-select v-model="filterParams['lowerColor']" size="mini" @change="filter('lowerColor', filterParams['lowerColor'])"
                :style="{width: (size.contentWidth > 1600 ? 260 : 180) + 'px'}" clearable>
                <el-option v-for="(val, key) of commonList.color" :key="key" :label="val.label" :value="val.value">
                  <i class="iconfont" v-if="val.color" :style="{color: val.color, marginRight:'12px'}">&#xe62d;</i>{{val.label}}
                </el-option>
              </el-select>
            </el-col>
          </el-col>
        </div>
        <div :span="4" style="position:relative;">
          <button class="button btnItem" @click="clear">
            <i class="iconfont iconClear">&#xe62f;</i>{{ $t('ClaerConditons') }}
          </button>
        </div>
      </el-col>
    </div>
    <!-- 卡片 -->
    <div class="mainBox_2 record" :style="{width: size.contentWidth - 225 + 'px',
                    height: (size.contentHeight - 330) + 'px'}">
      <div v-if="!passData.length"
        style="color: #909399; font-size: 14px; text-align: center; width: 100%; height: 100%; line-height: 150px;">暂无数据
      </div>
      <div v-for="(item,index) of passData" :key="index"
        :class="{passBodyImgBox:true, active:selectedPassIds.indexOf(item.id) > -1}">
        <!-- v-lazy="item.cropImagePath" -->
        <img :src="item.cropImagePath" class="bodySize img_scale_down"
          :onerror="errorBodyImg"
          @click="imgChoose(item)">
    
        <div class="passTime">
          <div style="color:#ffffff" class="rowStart">
            <div class="rowColCenter ellipsis passColorInfo">{{item.upperColor}}</div>
            <div class="rowColCenter ellipsis passColorInfo ml5">{{item.lowerColor}}</div>
            <div class="rowColCenter ellipsis passColorInfo ml5">{{item.gender}}</div>
            <!-- <div class="rowColCenter ellipsis passColorInfo ml10">{{item.age}}</div> -->
          </div>
          <div class="mt5">
            <i class="el-icon-video-camera"></i>
            <span class="ellipsis" style="display:inline-block;width:160px">
              <!-- <i class="iconfont">&#xe63a;</i> -->
              D{{item.channelID}}
            </span>
          </div>
          <div class="mt5">
            <!-- <i class="iconfont">&#xe655;</i> -->
            <i class="el-icon-time"></i>
            <span class="ellipsis ml5">{{item.detectTime }}</span>
          </div>
        </div>
        <div class="passEdit">
          <div @click="showDetail(item)" class="mt10 ml30">
            <!-- <i class="iconfont ml10">&#xe628;</i> -->
            <i class="el-icon-search"></i>
            查看详情
          </div>
        </div>
      </div>
    </div>
    <div class="pagiBox rowColCenter" :style="{ width: size.contentWidth - 144 + 'px' }"
      style="height:50px;">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="filterParams.pageNum"
        :page-size="filterParams.pageSize" layout="total, prev, pager, next, jumper" :total="count"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { commonList, pedestrianList } from '../_utils/listMap'
import moment from 'moment'
import { channelApi } from '@/api/pass.js'
import { getChannelList, getChannel } from '@/api/systemAPI';
import { debounce } from '@/utils/debounce.js'
import { getAppMode } from '@/utils/appMode.js'
export default {
  inject: ["size"],
  props: {
    count: {
      type: Number,
      required: true
    },
    filterParams: {
      type: Object,
      required: true
    },
    passData: {
      type: Array,
      required: true
    },
    selectedPassIds: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      errorBodyImg: `this.src='${require('@/assets/img/alert.png')}'`,
      commonList,
      pedestrianList,
      // 按时间查询
      filterAuto: false,
      startTime: '',
      endTime: '',
      pickerOptionsStart: {
        disabledDate: time => {
          if (this.filterParams.endTime) {
            return time.getTime() > new Date(this.filterParams.endTime).getTime()
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          if (this.filterParams.startTime && moment(time).isBefore(moment(this.filterParams.startTime).add(8,'hours'), 'day')) {
            return true
          }
        }
      },
      // chanel/车辆品牌查询
      channelData: [],
      brand: [],
      // 按input框查询
      vehicleID: '',
    }
  },
  created() {
    this.getAppMode()
    this.getChannel()
    // 搜索500ms延时
    this.$watch('vehicleID', debounce((newQuery) => {
      this.filter('vehicleID', this.vehicleID)
    }, 500))
  },
  computed: {},
  methods: {
    async getAppMode() {
      const res = await getAppMode()
      this.APPMODE_CONFIG = res
    },
    getChannel() {
      // const params = { pageSize: 99 }
      // channelApi.Get(params)
      //   .then(res => {
      //     this.channelData = res.data.data
      //     this.channelData.forEach(item => {
      //       item._name = item.chConfig.channelType + item.chConfig.channel
      //       item.detectTime = moment(item.detectTime).format('MM/DD HH:mm:ss')
      //     })
      //   })
      getChannelList().then(res => {
        if(res.data.code === 200000) {
          this.channelData = res.data.data
          this.channelData.forEach((item,index)=> {
            let name = !item.chanNameList ? '' : (item.chanNameList.length>0 ? item.chanNameList[0].channelName : '')
            this.channelData[index] = {...this.channelData[index], chName: ('[' + item.channelType + "" + item.channel + ']' + name)}
          })
        }
      })
      getChannel().then(res => {
        if (res.data.code === 200000) {
          res.data.data.unboundList.forEach(item => {
            this.channelData[item.id - 1] = { chName: '[' + item.name + ']', channel: item.id }
          })
        }
      })
    },
    
    filter(type, val) {
      // 点击后高亮
      this.filterParams[type] = val

      if (type === 'make') {
        this.filterParams.make = val[0] ? val[0] : ""
        this.filterParams.model = val[1] ? val[1] : ""
        // this.filterParams.year = val[2]
        delete this.filterParams.brand
      } else if (type === 'time') {
        if (val != 'auto') {
          const time = new Date()
          if (val !== 'auto') {
            this.filterAuto = false
            this.filterParams.startTime = ''
            this.filterParams.endTime = ''
          }
          if (val === 'all') {
            this.filterParams.startTime = ''
            this.filterParams.endTime = ''
          } else if (val === 'today') {
            this.filterParams.startTime = moment(time).subtract(1, 'days').format('YYYY-MM-DD 16:00:00')
            this.filterParams.endTime = moment(time).format('YYYY-MM-DD 16:00:00')
          } else if (val === 'threeDays') {
            // const startTime = new Date(time.getTime() - 10/3*24*60*60*1000)
            this.filterParams.startTime = moment(time).subtract(3, 'days').format('YYYY-MM-DD 16:00:00')
            this.filterParams.endTime = moment(time).format('YYYY-MM-DD 16:00:00')
          } else if (val === 'sevenDays') {
            // const startTime = new Date(time.getTime() - 22/3*24*60*60*1000)
            this.filterParams.startTime = moment(time).subtract(7, 'days').format('YYYY-MM-DD 16:00:00')
            this.filterParams.endTime = moment(time).format('YYYY-MM-DD 16:00:00')
          }
        } else if (val === 'auto') {
          this.filterAuto = !this.filterAuto
          this.filterParams.startTime = ''
          this.filterParams.endTime = ''
          if (this.filterAuto) {
            this.startTime = ''
            this.endTime = ''
          }
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
      this.$emit('onFetch', this.filterParams)
    },
    dateBack() {
      this.filterAuto = false
      this.startTime = ''
      this.endTime = ''
    },
    // 清除条件
    clearFilter() {
      this.filterAuto = false
      this.brand = []
      for (let i in this.filterParams) {
        if (i === 'time') {
          this.filterParams[i] = 'all'
        } else if (i === 'pageNum') {
          this.filterParams[i] = 1
        } else if (i === 'pageSize') {
          this.filterParams[i] = 60
        } else {
          this.filterParams[i] = ''
        }
      }
      this.vehicleID = '';
    },
    clear() {
      this.clearFilter()
      this.$emit('onFetch', this.filterParams)
    },
    showDetail(item) {
      this.$emit('onShowDetailDialog', item)
    },
    imgChoose(item) {
      this.$emit('onShowDetailDialog', item)
    },
    handleCurrentChange(val) {
      this.filterParams.pageNum = val
      this.$emit('onFetch', this.filterParams)
    }
  }
}
</script>

<style>

</style>