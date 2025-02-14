<template>
   <div class="OverlayConfig">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="OSD叠加" name="first">
          <div >
            <div style="display:inline-block; width:650px;vertical-align: top">
              <el-select size="mini" @change="onChannelChange1" v-model="channel" :disabled="disabled1">
                <el-option
                v-for="item in channelList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
              </el-select>
              <div style="border: 1px solid #999;width: 600px;height: 338px;position: relative; margin-top: 20px" v-loading="loading1">
                <img :src="imgData1" id="canvasBg1" width="600" height="338" />
                <canvas id="canvasText1" width="600" height="338"  @mousedown="onDownOSD" @mouseup="onUpOSD" @mousemove="onMoveOSD"></canvas>
              </div>
              <el-button style="margin: 20px  5px" size="small" @click="reload(1)">刷新背景图片</el-button>
              <div class="ipc-time">
                <span class="ipc-title">设置时间</span>
                <el-date-picker
                  v-model="ipcTime"
                  type="datetime"
                  size="small"
                  placeholder="选择日期时间">
                </el-date-picker>
                <el-button class="ipc-button" type="primary" size="small" @click="saveIpcTime">保存</el-button>
              </div>
            </div>
            <div style="display:inline-block;vertical-align: top;margin-top: 20px;">
              <el-form :model="form1" size="mini" label-width="100px" label-position="left" class="demo-form-inline">
                <el-checkbox-group v-model="form1.chanNameList" @change="onCheckChange1">
                  <div class="checkLine">
                    <el-checkbox label="通道名称"></el-checkbox>
                    <el-input
                      size="mini"
                      :rows="1"
                      type="text"
                      show-word-limit
                      maxlength="24"
                       class="textarea1"
                      placeholder="请输入内容"
                      v-model="text1">
                    </el-input>
                  </div>
                  <div class="checkLine">
                    <el-checkbox label="叠加名称1"></el-checkbox>
                    <el-input
                       size="mini"
                      :rows="1"
                       class="textarea1"
                      placeholder="请输入内容"
                      v-model="text2">
                    </el-input>
                  </div>
                  <div class="checkLine">
                    <el-checkbox label="叠加名称2"></el-checkbox>
                    <el-input
                       size="mini"
                      :rows="1"
                       class="textarea1"
                      placeholder="请输入内容"
                      v-model="text3">
                    </el-input>
                  </div>
                  <div class="checkLine">
                    <el-checkbox label="叠加名称3"></el-checkbox>
                    <el-input
                       size="mini"
                      :rows="1"
                       class="textarea1"
                      placeholder="请输入内容"
                      v-model="text4">
                    </el-input>
                  </div>
                  <div class="checkLine">
                    <el-checkbox label="叠加名称4"></el-checkbox>
                    <el-input
                       size="mini"
                      :rows="1"
                       class="textarea1"
                      placeholder="请输入内容"
                      v-model="text5">
                    </el-input>
                  </div>
                  <div class="checkLine">
                    <el-checkbox label="叠加名称5"></el-checkbox>
                    <el-input
                       size="mini"
                      :rows="1"
                      placeholder="请输入内容"
                      class="textarea1"
                      v-model="text6">
                    </el-input>
                  </div>
                </el-checkbox-group>
                 <div class="checkLine">
                    <el-checkbox v-model="form1.showTime" @change="showTimeChange">显示时间</el-checkbox>
                  </div>
                  <div class="checkLine week-check">
                    <el-checkbox v-model="form1.showWeek"  @change="showWeekChange" disabled>显示星期</el-checkbox>
                  </div>
                <el-form-item label="日期格式">
                  <el-select v-model="form1.dateType" @change="dateTypeChange" placeholder="请选择">
                    <el-option label="年-月-日" :value="1"></el-option>
                    <el-option label="月-日-年" :value="2"></el-option>
                    <el-option label="日-月-年" :value="3"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="时间格式">
                  <el-select v-model="form1.timeType" @change="timeTypeChange" placeholder="请选择">
                    <el-option label="24小时制式" :value="24"></el-option>
                    <el-option label="12小时制式" :value="12"></el-option>
                  </el-select>
                </el-form-item>
                <div class="checkLine">
                    <el-form-item class="remove-indent" label="">
                      <label class="el-checkbox">
                        <span class="el-checkbox__label" style="margin-left: 15px">OSD字体</span>
                      </label>
                      <el-select v-model="form1.osdTypeface" @change="osdTypefaceChange" placeholder="请选择">
                        <el-option v-for="item in fontSizeList" :label="item.label" :value="item.value" :key="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                  <div class="checkLine">
                    <el-form-item class="remove-indent" label="">
                      <label class="el-checkbox">
                        <span class="el-checkbox__label" style="margin-left: 15px">OSD颜色</span>
                      </label>
                      <compact-picker v-model="colors" :disableAlpha="true" :palette="colorArr" @input="osdColorChanged" />
                    </el-form-item>
                  </div>
                <div class="checkLine">
                  <el-checkbox v-model="form1.autoAnti" style="display: none">自动反色</el-checkbox>
                </div>
                <div style="padding-bottom: 20px">
                  <el-button type="primary" size="small" @click="onSave1" :disabled="disabled1">应用</el-button>
                </div>
              </el-form>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="图像遮盖" name="second">
          <div >
            <div style="display:inline-block; width:650px;vertical-align: top">
              <el-select size="mini" v-model="channel2" @change="onChannelChange2" :disabled="disabled2">
                <el-option
                v-for="item in channelList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
              </el-select>
              <div style="border: 1px solid #999;width: 484px;height: 324px;position: relative; margin-top: 20px" v-loading="loading1">
                <img :src="imgData2" id="Bgimg" width="484" height="324" style="position: absolute;top:0;left:0;z-index:1" />
                <canvas id="canvasBg2" width="484" height="324"></canvas>
                <canvas id="canvasText2" width="484" height="324"  @mousedown="onDown" @mouseup="onUp" @mousemove="onMove" ></canvas>
              </div>
              <el-button size="small" @click="reload(2)">刷新背景图片</el-button>
              <el-button style="margin: 20px 5px" size="small" @click="onClearCanvasAll2">全部清除</el-button>
              <el-button size="small" @click="onSave2" :disabled="disabled2">保存</el-button>
            </div>
            <div style="display:inline-block;vertical-align: top;margin-top: 20px">
              <el-form size="mini" label-width="100px" label-position="left" class="demo-form-inline">
                <el-form-item label="遮盖方式">
                  <el-select v-model="way" placeholder="请选择">
                    <el-option label="不遮盖" :value="1"></el-option>
                    <el-option label="现场遮盖" :value="2"></el-option>
                    <el-option label="现场录像均遮盖" :value="3"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <!-- <el-button type="primary" @click="onSubmit">查询</el-button> -->
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="图像显示" name="third">
          <div >
            <div style="display:inline-block; width:650px;vertical-align: top">
              <el-select size="mini" v-model="channel3" @change="onChannelChange3" :disabled="disabled3">
                <el-option
                v-for="item in channelList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
              </el-select>
              <div style="border: 1px solid #999;width: 600px;height: 338px;position: relative; margin-top: 20px" v-loading="loading1">
                <img :src="imgData3" id="canvasBg1" width="600" height="338" />
              </div>
              <el-button style="margin: 20px  5px" size="small" @click="reload(3)">刷新背景图片</el-button>
            </div>
            <div style="display:inline-block;vertical-align: top;margin-top: 20px">
              <el-form size="mini" :model="form3" label-width="100px" label-position="left" class="demo-form-inline">
                <el-form-item label="亮度调节">
                  <el-slider v-model="form3.brightness" :min="brightness.min" :max="brightness.max" show-input :show-input-controls="false" input-size="mini">
                  </el-slider>
                </el-form-item>
                <el-form-item label="对比度">
                  <el-slider v-model="form3.contrast" :min="contrast.min" :max="contrast.max" show-input :show-input-controls="false" input-size="mini">
                  </el-slider>
                </el-form-item>
                <el-form-item label="饱和度">
                  <el-slider v-model="form3.colorSaturation" :min="colorSaturation.min" :max="colorSaturation.max" show-input :show-input-controls="false" input-size="mini">
                  </el-slider>
                </el-form-item>
                <!-- <el-form-item label="画面旋转">
                  <el-select v-model="form3.rotate" placeholder="请选择">
                    <el-option
                      v-for="item in rotateList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="镜像">
                  <el-select v-model="form3.mirror" placeholder="请选择">
                    <el-option
                      v-for="item in mirrorList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item> -->
              </el-form>
              <div class="btns">
                <el-button size="small" class="saveBtn" @click="onSave" :disabled="disabled3">保存配置</el-button>
                <el-button size="small" class="clearBtn" @click="reClear">恢复默认</el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
   </div>
</template>
<script>
import { getChannelList, getOsdoverly,putOsdoverly
,getImagemask,putImagemask,getSnapshot,
 getImageopt, getImagecfg, putImagecfg, putChannelIpcTime } from '@/api/systemAPI';
import {Compact} from "vue-color";
import moment from "moment";

var dayjs = require('dayjs')
export default {
  components: {
        "compact-picker": Compact,
  },
  name: 'OverlayConfig',
  data(){
    return {
      colorArr: [
        '#4D4D4D', '#999999', '#FFFFFF', '#FF0000', '#FE9200', '#ffff00', '#DBDF00', '#A4DD00', '#68CCCA', '#73D8FF', '#AEA1FF', '#FDA1FF',
        '#333333', '#808080', '#CCCCCC', '#D33115', '#E27300', '#FCC400', '#B0BC00', '#68BC00', '#16A5A5', '#0000ff', '#7B64FF', '#FA28FF', 
        '#000000', '#666666', '#B3B3B3', '#a52a2a', '#C45100', '#ffa500', '#808900', '#00ff00', '#0C797D', '#00008b', '#653294', '#800080'
      ],
      colors: {
        hex: "#000000",
      },
      ipcTime: new Date(),
      activeName: 'first',
      channelList: [],
      channel: '',
      channel2: '',
      channel3: '',
      form1: {
        chanNameCount:0,
        chanNameList: [],
        showTime: false,
        timeType: false,
        dateType: 1,
        timeType: 24,
        osdTypeface: "16",
        osdColor: "#000000",
        autoAnti: false,
        imageAlpha: 0,
        osdPic: 0,
        picHeight: 0,
        picPerX: 0,
        picPerY: 0,
        picStatus: 0,
        picWidth: 0,
        scale: 1,
        showWeek: 0,
        timePerX: 0,
        timePerY: 0,
      },
      form3: {
        brightness: 50,
        contrast: 50,
        colorSaturation: 50,
        mirror: 0,
        rotate: 0
      },
      brightness: {
        min: 0,
        max: 100
      },
      contrast: {
        min: 0,
        max: 100
      },
      colorSaturation: {
        min: 0,
        max: 100
      },
      mirrorList: [
        {
          value: 0,
          label: '关'
        },
        {
          value: 1,
          label: '左右镜像'
        },
        {
          value: 2,
          label: '上下镜像'
        },
        {
          value: 3,
          label: '中心镜像'
        }
      ],
      rotateList: [
      {
          value: 0,
          label: '0度'
        },
        {
          value: 90,
          label: '90度'
        },
        {
          value: 180,
          label: '180度'
        },
        {
          value: 270,
          label: '270度'
        }
      ],
      text1: '',
      text2: '',
      text3: '',
      text4: '',
      text5: '',
      text6: '',
      checkList: [],
      canvasDom1: '',
      canvasCtx1: '',
      downOSDFlag: false,
      DownOSDItem: '',
      DownOSDItemIndex: -1,
      startX1: 0,
      startY1: 0,
      DX: 0,
      DY: 0,
      timeNow: '',
      weekNow: '',
      DateTimeformata: '',
      timeId: null,
      saveTextArr: [
        {id: 1, channelName: '', enable: 0, perX: 0, perY: 0, rgbaBG: '#00ffff', rgbaFont: '#000000'},
        {id: 2, channelName: '', enable: 0, perX: 0, perY: 0, rgbaBG: '#00ffff', rgbaFont: '#000000'},
        {id: 3, channelName: '', enable: 0, perX: 0, perY: 0, rgbaBG: '#00ffff', rgbaFont: '#000000'},
        {id: 4, channelName: '', enable: 0, perX: 0, perY: 0, rgbaBG: '#00ffff', rgbaFont: '#000000'},
        {id: 5, channelName: '', enable: 0, perX: 0, perY: 0, rgbaBG: '#00ffff', rgbaFont: '#000000'},
        {id: 6, channelName: '', enable: 0, perX: 0, perY: 0, rgbaBG: '#00ffff', rgbaFont: '#000000'},
        {id: 7, channelName: '', enable: 0, perX: 0, perY: 0, rgbaBG: '#00ffff', rgbaFont: '#000000'},
      ],
      fontSizeList: [
        {value: "16", label: "16x16"},
        {value: "32", label: "32x32"},
        {value: "48", label: "48x48"},
        {value: "64", label: "64x64"},
      ],
      fontSizeRates: {
        "16": 0.9,
        "32": 0.7,
        "48": 0.5,
        "64": 0.4
      },
      meshHeight: 18,
      meshWidth: 22,
      canvasDom2: '',
      canvasCtx2: '',
      startX2: 0,
      startY2: 0,
      downFlag2: false,
      saveboxArr2: [],
      saveboxArrSplit2: [],
      way: 1,
      imgData1: '',
      imgData2: '',
      imgData3: '',
      loading1: false,
      loading2: false,
      loading3: false,
      disabled1: false,
      disabled2: false,
      disabled3: false
    }
  },
  created() {
  },
  watch: {
      text1(newName, oldName) {
        this.onCheckChange1(this.form1.chanNameList)
      },
      text2(newName, oldName) {
        this.onCheckChange1(this.form1.chanNameList)
      },
      text3(newName, oldName) {
        this.onCheckChange1(this.form1.chanNameList)
      },
      text4(newName, oldName) {
        this.onCheckChange1(this.form1.chanNameList)
      },
      text5(newName, oldName) {
        this.onCheckChange1(this.form1.chanNameList)
      },
      text6(newName, oldName) {
        this.onCheckChange1(this.form1.chanNameList)
      },
      timeNow(newName, oldName) {
        this.onCheckChange1(this.form1.chanNameList)
      },
  },
  mounted(){ 
    this.queryChannel()
    this.canvasDom = document.getElementById("canvasText1");
    this.canvasCtx = this.canvasDom.getContext("2d")
    this.canvasDom.style.cursor="default"

  },
  beforeDestroy(){
    clearInterval(this.timeId)
  },
  methods: {
    osdColorChanged(value) {
      this.form1.osdColor = value.hex
      this.onCheckChange1(this.form1.chanNameList);
    },
    // 获取背景图片
    querySnapshot(record, ID){
      this.loading1 = true
      getSnapshot(ID).then(res => {
        if(res.data.code == 200000) {
          if(record == 1 && ID == this.channel) {
            this.imgData1 = 'data:image/png;base64,' + res.data.data
          }
          if(record == 2 && ID == this.channel2) {
            this.imgData2 = 'data:image/png;base64,' + res.data.data
          }
          if(record == 3 && ID == this.channel3) {
            this.imgData3 = 'data:image/png;base64,' + res.data.data
          }
        }
        this.loading1 = false
      }).catch( err => {
        //this.$message.error('通道不在线')
        if(record == 1 && ID == this.channel) {
          this.imgData1 = ""
        }
        if(record == 2 && ID == this.channel2) {
          this.imgData2 = ""
        }
        if(record == 3 && ID == this.channel3) {
          this.imgData3 = ""
        }
        this.loading1 = false
      })
    },
    // 刷新背景图片
    reload(record){
      if(record==1){
        this.querySnapshot(1, this.channel)
      }
      if(record==2) {
         this.querySnapshot(2, this.channel2)
      }
      if(record==3) {
         this.querySnapshot(3, this.channel3)
      }
    },
    handleClick(tab, event) {
      if(tab.name == 'first') {
        this.querySnapshot(1, this.channel)
        this.queryOsdoverly(this.channel)
      }
      if(tab.name == 'second') {
        this.drawMesh()
        this.querySnapshot(2, this.channel2)
        this.queryImageMask(this.channel2)
      }
      if(tab.name == 'third') {
        this.querySnapshot(3, this.channel3)
        this.queryFormData(this.channel3)
      }
    },
    // 通道名change
    onCheckChange1(e){
      this.saveTextArr.forEach(item => {
        item.enable = 0
      })
      e.forEach(item => {
        let num = this.toInputNum(item)
        let text = this['text' + num]
        let colorI = item.endsWith('1') || item.endsWith('2') ? "#000000": this.form1.osdColor;
        this.saveTextArr[num -1].channelName = text
        this.saveTextArr[num -1].rgbaFont = this.form1.osdColor
        this.saveTextArr[num -1].enable = 1
      })
      if(this.timeNow) {
         this.saveTextArr[6].channelName = this.timeNow
         this.saveTextArr[6].rgbaFont = this.form1.osdColor
         this.saveTextArr[6].enable = 1
      }
      // clearInterval(this.timeId)
      this.drawTextSave()
    
    },
    // 通道名change
    drawTextSave(){
      this.clearCanvas()
      this.saveTextArr.forEach(item => {
        if(item.enable == 1 && item.channelName) {
          this.drawText(item)
        }
      })
    },
    queryChannel() {
      this.channelList = []
      getChannelList().then(res => {
        if(res.data.code === 200000){
          let arr = res.data.data
          arr.forEach(item=> {
            let name = !item.chanNameList ? '' : (item.chanNameList.length>0 ? item.chanNameList[0].channelName : '')
            this.channelList.push({
              name: '[' + item.channelType + "" + item.channel + ']' + name,
              id: item.channel
            })
          })
          if(this.channelList.length) {
            this.channel = this.channelList[0].id
            this.channel2 = this.channelList[0].id
            this.channel3 = this.channelList[0].id
            this.querySnapshot(1, this.channelList[0].id)
            this.queryOsdoverly(this.channelList[0].id)
            //this.queryImageMask(this.channelList[0].id)
          }
        }
      })
      // 
    },
    onChannelChange1(e) {
      if(this.timeId) {
        clearInterval(this.timeId)
      }
      this.querySnapshot(1, e)
      this.queryOsdoverly(e)
    },
    onChannelChange2(e) {
      this.querySnapshot(2, e)
      this.queryImageMask(e)
    },
    onChannelChange3(e) {
      this.querySnapshot(3, e)
      this.queryFormData(e)
    },
    saveIpcTime() {
      let updateTime = moment(this.ipcTime).subtract(8, 'hours').format("YYYY-MM-DD HH:mm:ss")
      putChannelIpcTime(this.channel, {updateTime}).then(res => {
        if(res.data.code === 200000) {
          this.$message.success('时间设置成功')
        }
      }).catch(err => {
        this.$message.error('时间设置失败')
      })
    },
    onSave() {
      this.disabled3 = true
      putImagecfg(this.channel3, this.form3).then(res => {
        this.disabled3 = false
        if(res.data.code == 200000) {
          this.$message.success('保存成功')
        } else {
          this.$message.error('保存失败')
        }
      }).catch((err)=>{
        this.disabled3 = false
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
      this.querySnapshot(3, this.channel3)
      setTimeout(() => {
        this.querySnapshot(3, this.channel3)
      }, 1000)
    },
    reClear() {
      this.form3.brightness = 50
      this.form3.contrast = 50
      this.form3.colorSaturation = 50
    },
    queryFormData(ID) {
      this.disabled3 = true
      getImagecfg(ID).then(res => {
        if (ID == this.channel3) {
          this.form3 = res.data.data
        }
        this.disabled3 = false
      }).catch((err)=>{
        this.disabled3 = false
        if(err.response.data.code === 400306) {
          this.$message.closeAll()
        } 
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
      this.disabled3 = true
      getImageopt(ID).then(res => {
        if (ID == this.channel3) {
          this.brightness = res.data.data.brightness
          this.contrast = res.data.data.contrast
          this.colorSaturation = res.data.data.colorSaturation
        }
        this.disabled3 = false
      })
    },
    // 获取osd 数据
    queryOsdoverly(ID) {
      // 清空数据
       this.form1 = {
        chanNameCount:0,
        chanNameList: [],
        showTime: false,
        timeType: false,
        dateType: 1,
        timeType: 24,
        osdTypeface: "16",
        osdColor: "#000000",
        autoAnti: false,
        imageAlpha: 0,
        osdPic: 0,
        picHeight: 0,
        picPerX: 0,
        picPerY: 0,
        picStatus: 0,
        picWidth: 0,
        scale: 1,
        showWeek: 0,
        timePerX: 0,
        timePerY: 0,
      }
      this.text1 = ''
      this.text2 = ''
      this.text3 = ''
      this.text4 = ''
      this.text5 = ''
      this.text6 = ''
      this.saveTextArr = [
        {id: 1, channelName: '', enable: 0, perX: 0, perY: 0, rgbaBG: '#00ffff', rgbaFont: '#000000'},
        {id: 2, channelName: '', enable: 0, perX: 0, perY: 0, rgbaBG: '#00ffff', rgbaFont: '#000000'},
        {id: 3, channelName: '', enable: 0, perX: 0, perY: 0, rgbaBG: '#00ffff', rgbaFont: '#000000'},
        {id: 4, channelName: '', enable: 0, perX: 0, perY: 0, rgbaBG: '#00ffff', rgbaFont: '#000000'},
        {id: 5, channelName: '', enable: 0, perX: 0, perY: 0, rgbaBG: '#00ffff', rgbaFont: '#000000'},
        {id: 6, channelName: '', enable: 0, perX: 0, perY: 0, rgbaBG: '#00ffff', rgbaFont: '#000000'},
        {id: 7, channelName: '', enable: 0, perX: 0, perY: 0, rgbaBG: '#00ffff', rgbaFont: '#000000'},
      ]
      this.clearCanvas()
      this.disabled1 = true
      getOsdoverly(ID).then(res => {
        if(res.data.code == 200000 && ID == this.channel) {
          let data = res.data.data
          let arr = []
          this.saveTextArr = []
          data.chanNameList.forEach((item,index)=> {
            if(item.enable) {
              index == 0 ? arr.push('通道名称') : arr.push('叠加名称' + index)
            }
            this['text' + (index + 1)] = item.channelName
          })
          this.form1 =  {
            chanNameList: arr,
            showTime:  data.showTime ? true : false,
            timeType:  data.timeType,
            dateType:  data.dateType,
            timeType:  data.timeType,
            osdTypeface: data.osdTypeface.split("x")[0],
            osdColor:  data.osdColor.slice(0,7),
            autoAnti:  data.autoAnti? true: false,
            imageAlpha:  data.imageAlpha,
            osdPic:  data.osdPic,
            picHeight:  data.picHeight,
            picPerX:  data.picPerX,
            picPerY:  data.picPerY,
            picStatus:  data.picStatus,
            picWidth:  data.picWidth,
            scale:  data.scale,
            showWeek:  data.showWeek ? true:false,
            timePerX:  Math.floor(this.cameraToCanvasX(data.timePerX)),
            timePerY:  Math.floor(this.cameraToCanvasY(data.timePerY)),
          }
          var clrIsExist = false;
          this.colorArr.forEach(item => {
            if (item.toUpperCase() == this.form1.osdColor.toUpperCase()) {
              clrIsExist = true;
            } 
          });
          if (!clrIsExist) {
            this.colorArr[0] = this.form1.osdColor;
          }
          this.colors = {
            hex: this.form1.osdColor,
          }
          let selectArr = []
          data.chanNameList.forEach((item,index) => {
            selectArr.push({
              id: index+1,
              channelName: item.channelName,
              enable: item.enable,
              perX: Math.floor(this.cameraToCanvasX(item.perX)),
              perY: Math.floor(this.cameraToCanvasY(item.perY)),
              rgbaBG: item.rgbaBG.slice(0,7),
              rgbaFont: item.rgbaFont.slice(0,7),
            })
          })
           this.saveTextArr = [...selectArr, {id: 7, channelName: '', enable: data.showTime, perX: Math.floor(this.cameraToCanvasX(data.timePerX)), perY: Math.floor(this.cameraToCanvasY(data.timePerY)), rgbaBG: '#00ffff', rgbaFont: '#000000'}]
          // 回显数据
          this.drawTextSave()
          this.showTimeChange(this.form1.showTime)
          this.showWeekChange(this.form1.showWeek)
          // 字体列表
          let osdTypeface = parseInt(this.form1.osdTypeface)
          if (isNaN(osdTypeface)) {
            this.form1.osdTypeface = "16"
            osdTypeface = 16
          }
          if (!this.fontSizeRates.hasOwnProperty(this.form1.osdTypeface)) {
            for (let i = this.fontSizeList.length - 1; i >= 0; i--) {
              if (parseInt(this.fontSizeList[i].value) < osdTypeface) {
                this.fontSizeList.splice(i+1, 0, {label: this.form1.osdTypeface + "x" + this.form1.osdTypeface, value: this.form1.osdTypeface})
                this.fontSizeRates[this.form1.osdTypeface] = this.fontSizeRates[this.fontSizeList[i].value] - 0.05
                break
              }
              if ( i == 0 ) {
                this.fontSizeList.unshift({label: this.form1.osdTypeface + "x" + this.form1.osdTypeface, value: this.form1.osdTypeface})
                this.fontSizeRates[this.form1.osdTypeface] = this.fontSizeRates[this.fontSizeList[i].value] + 0.05
                break
              }
            }
          }
        }
        this.disabled1 = false
      }).catch(err => {
        this.disabled1 = false
        if(err.response.data.code === 400306) {
          this.$message.closeAll()
        } 
        this.$message({
          showClose: true,
          message: err.message?err.message:'获取叠加参数据错误！',
          type: 'error'
        })
      })
    },
    // 保存数据
    onSave1() {
      let arr = []
      this.saveTextArr.forEach((item,index) => {
        if(index == 6){
          return
        }
        arr.push({
          channelName: item.channelName,
          enable: item.enable,
          perX: Math.floor(item.perX*10000/600),
          perY: Math.floor((item.perY > 338 / 2 ? item.perY + Number(this.form1.osdTypeface*this.fontSizeRates[this.form1.osdTypeface]) + 2 : item.perY)*10000/338),
          rgbaBG: item.rgbaBG + '00',
          rgbaFont: item.rgbaFont + '00',
        })
      })
      let obj = {
        chanNameCount: this.form1.chanNameList.length,
        chanNameList: arr,
        showTime:  Number(this.form1.showTime),
        timeType:  this.form1.timeType,
        dateType:  Number(this.form1.dateType),
        timeType:  this.form1.timeType,
        osdTypeface: this.form1.osdTypeface + "x" +this.form1.osdTypeface,
        osdColor:  this.form1.osdColor+'00',
        autoAnti:  Number(this.form1.autoAnti),
        imageAlpha: this.form1.imageAlpha,
        osdPic: this.form1.osdPic,
        picHeight: this.form1.picHeight,
        picPerX: this.form1.picPerX,
        picPerY: this.form1.picPerY,
        picStatus: this.form1.picStatus,
        picWidth: this.form1.picWidth,
        scale: this.form1.scale,
        showWeek: Number(this.form1.showWeek),
        timePerX: Math.floor(this.saveTextArr[6].perX*10000/600),
        timePerY: Math.floor(this.saveTextArr[6].perY*10000/338),
      }
      this.disabled1 = true
      putOsdoverly(this.channel, obj).then(res => {
        if(res.data.code == 200000) {
          this.$message.success("保存成功!")
        }
        this.disabled1 = false
      }).catch(err=>{
        this.disabled1 = false
          this.$message({
            showClose: true,
            message: err.message?err.message:'保存失败',
            type:'error'
          })
      })
    },
    // 时间change
    showTimeChange(e){
      if(e) {
        let format = this.form1.dateType == '1'?"YYYY-MM-DD" : (this.form1.dateType == '2' ? "MM-DD-YYYY" : "DD-MM-YYYY")
        let timeF= this.form1.timeType == '12' ?  'hh:mm:ss': 'HH:mm:ss'
        this.DateTimeformata = format + ' ' + timeF
        let arr = localStorage.getItem('isLocal') == 'false' ? dayjs().format(this.DateTimeformata).split(" ") : dayjs().add(8,'hours').format(this.DateTimeformata).split(" ")
        this.timeNow = arr[0] + " " + this.weekNow + " " + arr[1]
        this.timeId = setInterval(() => {
          this.timeNow = ""
          let arr = localStorage.getItem('isLocal') == 'false' ? dayjs().format(this.DateTimeformata).split(" ") : dayjs().add(8,'hours').format(this.DateTimeformata).split(" ")
          this.timeNow = arr[0] + " " + this.weekNow + " " + arr[1]
        }, 1000)
      } else {
        clearInterval(this.timeId)
        this.timeNow = ''
      }
    },
    // 日期格式change
    dateTypeChange(e){
       let format = this.form1.dateType == '1'?"YYYY-MM-DD" : (this.form1.dateType == '2' ? "MM-DD-YYYY" : "DD-MM-YYYY")
      let timeF= this.form1.timeType == '12' ?  'hh:mm:ss': 'HH:mm:ss'
      this.DateTimeformata = format + ' ' + timeF
    },
    // 时间格式change
    timeTypeChange(e){
      let format = this.form1.dateType == '1'?"YYYY-MM-DD" : (this.form1.dateType == '2' ? "MM-DD-YYYY" : "DD-MM-YYYY")
      let timeF= this.form1.timeType == '12' ?  'hh:mm:ss': 'HH:mm:ss'
      this.DateTimeformata = format + ' ' + timeF
    },
     // 星期change
    showWeekChange(e){
      if(e) {
        let indexDay = dayjs().day();
        switch(indexDay){
          case 0 :
            this.weekNow = '星期日'
            break;
          case 1 : 
            this.weekNow = '星期一'
            break;
          case 2 : 
            this.weekNow = '星期二'
            break;
          case 3 : 
            this.weekNow = '星期三'
            break;
          case 4 : 
            this.weekNow = '星期四'
            break;
          case 5 : 
            this.weekNow = '星期五'
            break;
          case 6 : 
            this.weekNow = '星期六'
            break;
          default:
               this.weekNow = ''
        }

      } else {
        this.weekNow = ''
      }
    },
    toInputNum(text){
      if (text === "通道名称") {
        return 1
      }
      return Number(text.charAt(text.length - 1)) + 1
    },
    drawText(item) {
      item.perY = item.perY + Number(this.form1.osdTypeface*this.fontSizeRates[this.form1.osdTypeface]) > 338 ? 338 - Number((this.form1.osdTypeface-2)*this.fontSizeRates[this.form1.osdTypeface]) : item.perY
      this.canvasCtx.beginPath();
      this.canvasCtx.fillStyle="#999999";
      this.canvasCtx.font = Number(this.form1.osdTypeface * this.fontSizeRates[this.form1.osdTypeface]) + "px" + ' ' + "Microsoft YaHei"
      const { width } = this.canvasCtx.measureText(item.channelName);
      this.canvasCtx.fillRect(item.perX, item.perY, width, Number((this.form1.osdTypeface - 2) * this.fontSizeRates[this.form1.osdTypeface]));
      this.canvasCtx.fillStyle = item.rgbaFont;               //设置填充颜色为紫色
      this.canvasCtx.textBaseline = "top";            //设置字体底线对齐绘制基线
      this.canvasCtx.textAlign = "start";   
      this.canvasCtx.fillText(item.channelName,item.perX, item.perY);   
    },
    clearCanvas(){
       this.canvasCtx.clearRect(0,0, 600, 338)
    },
    osdTypefaceChange() {
       this.onCheckChange1(this.form1.chanNameList)
    },
    osdColorChange() {
       this.onCheckChange1(this.form1.chanNameList)
    },
    //osd 拖拽
    onDownOSD(e){
      this.startX1 = e.offsetX
      this.startY1 = e.offsetY
    
      let arr = this.selectText(e.offsetX, e.offsetY)
      if(arr.length) {
        // 选中了文字
        this.downOSDFlag = true
        console.info(arr)
        this.DownOSDItem = arr[0]
        this.DownOSDItemIndex = this.saveTextArr.findIndex(item => {
          return item.id == this.DownOSDItem.id
        })
        this.DX = this.DownOSDItem.perX - this.startX1;
        this.DY = this.DownOSDItem.perY - this.startY1;
      }
    },
    onMoveOSD(e){
      if(this.selectText(e.offsetX, e.offsetY).length){
         this.canvasDom.style.cursor="pointer"
      } else {
         this.canvasDom.style.cursor="default"
      }
      if(this.downOSDFlag){
        this.saveTextArr[this.DownOSDItemIndex].perX = e.offsetX + this.DX < 0 ? 0 : e.offsetX + this.DX
        this.saveTextArr[this.DownOSDItemIndex].perY = e.offsetY + this.DY < 0 ? 0 : e.offsetY + this.DY + Number(this.form1.osdTypeface * this.fontSizeRates[this.form1.osdTypeface]) > 338 ? 338 - Number((this.form1.osdTypeface - 2) * this.fontSizeRates[this.form1.osdTypeface]) : e.offsetY + this.DY
        this.drawTextSave()
      }
    },
    onUpOSD(){
      this.startX1 = 0
      this.startY1 = 0
      this.downOSDFlag = false
    },
    cameraToCanvasX(perX) {
      return Math.floor(perX*600/10000)
    },
    cameraToCanvasY(perY) {
      return Math.floor(perY >= 10000 ? (perY*338/10000) - Number(this.form1.osdTypeface*this.fontSizeRates[this.form1.osdTypeface]) + 2: perY*338/10000 - 2)
    },
    selectText(X0,Y0){
      let arr = []
      this.saveTextArr.forEach(item => {
        this.canvasCtx.beginPath();
        this.canvasCtx.font = Number(this.form1.osdTypeface*this.fontSizeRates[this.form1.osdTypeface]) + "px" + ' ' + "Microsoft YaHei"
        const { width } = this.canvasCtx.measureText(item.channelName);
        let X1 = item.perX
        let Y1 = item.perY
        let X2 = X1 + width
        let Y2 = Y1 + Number((this.form1.osdTypeface-2)*this.fontSizeRates[this.form1.osdTypeface]-2)
        if(X0>=X1 && X0<= X2 && Y0 >= Y1 && Y0 <=Y2) {
          arr.push(item)
        }
      })
      return arr
    },
    queryImageMask(ID){
      this.meshHeight = 18
      this.meshWidth = 22
      this.onClearCanvasAll2()
      this.way = 1
      this.disabled2 = true
      getImagemask(ID).then(res => {
        if(res.data.code == 200000 && ID == this.channel2) {
            let data = res.data.data
            this.meshHeight = data.grids.meshHeight
            this.meshWidth = data.grids.meshWidth
            this.saveboxArrSplit2 = data.grids.value
            this.way = data.way
            this._onDrawSave2()
        }
        this.disabled2 = false
      }).catch((err)=>{
        this.disabled2 = false
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    // 绘制背景网格
    drawMesh() {
      let dom = document.getElementById('canvasBg2')
      let domCtx = dom.getContext('2d');
      dom.width= this.meshWidth * this.meshWidth
      dom.height=this. meshHeight * this.meshHeight
      this.canvasDom2 = document.getElementById('canvasText2');
      this.canvasCtx2 =  this.canvasDom2.getContext('2d');
      this.canvasDom2.width= this.meshWidth * this.meshWidth
      this.canvasDom2.height=this. meshHeight * this.meshHeight
      domCtx.beginPath();
      domCtx.strokeStyle="#E4E7ED"
      domCtx.lineWidth=1;
      for(let i=1;i<this.meshWidth;i++) {
        domCtx.moveTo(this.meshWidth*i,0)
        domCtx.lineTo(this.meshWidth*i,this.meshHeight * this.meshHeight)
      }
      for(let i=1;i<this.meshHeight;i++) {
        domCtx.moveTo(0, this.meshHeight*i)
        domCtx.lineTo(this.meshWidth*this.meshWidth, this.meshHeight*i)
      }
      // for(let i=1;i<=this.meshHeight;i++) {
      //   for(let i=1;i<=this.meshWidth;i++) {
      //     this.saveboxArrSplit2.push(0)
      //   }
      // }
      console.log(this.saveboxArrSplit2)
      domCtx.closePath();
      domCtx.stroke();
    },
    onDown(e) {
      this.startX2 = e.offsetX
      this.startY2 = e.offsetY
      this.downFlag2 = true

    },
    onMove(e) {
      if(this.downFlag2){
        this.onClearCanvas2()
        this.onDrawSave2()
        let X0 = e.offsetX > this.startX2 ? this.startX2: e.offsetX 
        let Y0 = e.offsetY > this.startY2 ? this.startY2: e.offsetY 
        let W = Math.abs(e.offsetX - this.startX2)
        let H = Math.abs(e.offsetY - this.startY2)
        this.canvasCtx2.beginPath()
        this.canvasCtx2.strokeStyle="#2d8cf0"
        this.canvasCtx2.lineWidth=1;
        this.canvasCtx2.strokeRect(X0,Y0,W,H);
      }
    },
    onUp(e) {
      if(this.downFlag2) {
        this.onClearCanvas2()
        this.onDrawSave2()
        // if(this.saveboxArr2.length<4){
          let X0 = e.offsetX >= this.startX2 ? this.startX2: e.offsetX 
          let Y0 = e.offsetY >= this.startY2 ? this.startY2: e.offsetY 
          let X1 = e.offsetX < this.startX2 ? this.startX2: e.offsetX 
          let Y1 = e.offsetY < this.startY2 ? this.startY2: e.offsetY 
          let X00 = Math.floor(X0/this.meshWidth ) * this.meshWidth 
          let Y00 = Math.floor(Y0/this.meshHeight ) * this.meshHeight 
          let X11 = Math.ceil(X1/this.meshWidth ) * this.meshWidth 
          let Y11 = Math.ceil(Y1/this.meshHeight ) * this.meshHeight 
          this.canvasCtx2.beginPath()
          this.canvasCtx2.fillStyle="#2d8cf0"
          this.canvasCtx2.fillRect(X00,Y00,X11-X00,Y11 - Y00);
           this.saveboxArr2.push({
            X0: X00,
            Y0: Y00,
            X1: X11,
            Y1: Y11,
          })
        // } else {
        //   this.$message({
        //     message: '最多只能添加4个图像遮盖!',
        //     type: 'warning'
        //   })
        // }
        this.downFlag2 = false
       
      }
      
    },
    onClearCanvas2(){
      this.canvasCtx2&&this.canvasCtx2.clearRect(0,0, this.meshWidth * this.meshWidth, this. meshHeight * this.meshHeight)
    },
    onClearCanvasAll2(){
      this.saveboxArr2 = []
      this.saveboxArrSplit2 = []
      for(let i=1;i<=this.meshHeight;i++) {
        for(let i=1;i<=this.meshWidth;i++) {
          this.saveboxArrSplit2.push(0)
        }
      }
      this.onClearCanvas2()
    },
    onDrawSave2(){
      // this.canvasCtx2.beginPath()
      // this.canvasCtx2.fillStyle="#2d8cf0"
      this.saveboxArr2.forEach(item=> {
        this.canvasCtx2.beginPath()
        this.canvasCtx2.fillStyle="#2d8cf0"
        this.canvasCtx2.fillRect(item.X0,item.Y0,item.X1-item.X0,item.Y1 - item.Y0);
      })
       this._onDrawSave2()
    },
    _onDrawSave2(){
      // this.canvasCtx2.beginPath()
      // this.canvasCtx2.fillStyle="#FF0000"
      this.saveboxArrSplit2.forEach((item,index)=> {
        if(item) {
          let I = Math.floor(index/this.meshWidth)
          let J = index%this.meshWidth
          if(!this.canvasCtx2) {
            return 
          }
          this.canvasCtx2.beginPath()
          this.canvasCtx2.fillStyle="#2d8cf0"
          this.canvasCtx2.fillRect(this.meshWidth*J,this.meshHeight*I,this.meshWidth,this.meshHeight);
        }
      })
       
    },
    onSave2() {
      // this.saveboxArrSplit2.length = 0
      // for(let i=1;i<=this.meshHeight;i++) {
      //   for(let i=1;i<=this.meshWidth;i++) {
      //     this.saveboxArrSplit2.push(0)
      //   }
      // }
      this.saveboxArr2.forEach(item => {
        let XX0 = Math.floor(item.X0/this.meshWidth)
        let XX1 = Math.floor(item.X1/this.meshWidth)
        let YY0 = Math.floor(item.Y0/this.meshHeight)
        let YY1 = Math.floor(item.Y1/this.meshHeight)
        for(let i=YY0; i<YY1;i++) {
          for(let j=XX0; j<XX1; j++){
            this.saveboxArrSplit2[i*this.meshWidth + j] = 1
          }
        }
      })
      console.log(this.saveboxArrSplit2)
      this.onClearCanvas2()
      this._onDrawSave2()
      let obj = {
        channel:this.channel2,
        way:this.way,
        grids:{
          meshHeight: this.meshHeight,
          meshWidth: this.meshWidth,
          rectNum: 4,
          value: this.saveboxArrSplit2,
        },
      }
      console.info(obj)
      this.disabled2 = true
      putImagemask(this.channel2,obj).then(res => {
        this.disabled2 = false
        if(res.data.code == 200000) 
        {
          this.$message({
            showClose: true,
            message: '保存成功',
            type: 'success'
          })
          // 刷新背景图，重新获取imgMask 数据
          this.reload(2)
          this.queryImageMask(this.channel2)
        }
      }).catch((err)=>{
        this.disabled2 = false
        this.$message({
          showClose: true,
          message: err.message?err.message:'保存失败',
          type: 'error'
        })
      })
    }
  }
}
</script>
<style scoped lang="less">
.OverlayConfig{
    height: 100%;
    // overflow-y: hidden;
    .item-label {
      color: #000;
      font-weight: bold;
    }
    /deep/ .el-checkbox__label {
      color: #606266;
      font-weight: normal;
    }
    .ipc-time {
      float: right;
      margin-right: 48px;
      margin-top: 20px;
      .ipc-title {
        color: #666;
        font-size: 14px;
        margin: 0 10px;
      }
      .ipc-button {
        margin: 0 0 0 10px;
      }
    }
}
.textarea1 {
  display: inline-block;
  width: 220px;
  /deep/ .el-input__count-inner {
    position: absolute;
  }
}
.OverlayConfig .el-checkbox{
  display: inline-block;
  height: 30px;
  line-height: 30px;
  width: 100px;
  text-align: left;
}
#systemBox .week-check /deep/ .el-checkbox{
  color: #666;
  cursor: not-allowed;
}
.checkLine {
  margin: 10px 0;
  .remove-indent {
    /deep/ .el-form-item__content {
      margin-left: 0 !important;
    }
    .vc-compact {
      display: inline-flex;
    }
  }
}
#canvasText1{
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9;
}
#canvasBg2{
  position: absolute;
  top: 0;
  left: 0;
  z-index: 6;
}
#canvasText2{
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9;
}
.btns {
  padding: 60px;
}
.saveBtn {
  border-color: #2178C8;
  color: #fff;
  width: 78px;
  height: 30px;
  background: #2178C8;
  border-radius: 2px;
}
.clearBtn {
  width: 78px;
  height: 30px;
  background: rgba(33,120,200,0.05);
  border-radius: 2px;
  border: 1px solid #2178C8;
  color: #2178C8;
}
/deep/ .el-slider__runway {
  width: 160px;
}
/deep/ .el-input-number.is-without-controls .el-input__inner {
    width: 60px;
    padding-left: 10px;
    padding-right: 10px;
}
/deep/ .el-button--primary {
  border-color: #2178C8;
  width: 58px;
  height: 30px;
  background: #2178C8;
  border-radius: 2px;
}
</style>
