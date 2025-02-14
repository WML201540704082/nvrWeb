<template>
  <div style="margin: -20px;">
    <!-- 设备管理 -->
    <div class="algo" :style="{ height: size.contentHeight - 105 + 'px' }">
      <div class="algo_top" style="display: flex">
      <el-form :model="algorithm" ref="algorithm-form" :inline="true">
        <el-form-item label="通道" prop="channelId" v-if="(getIndex == 0 || getIndex == 1 || getIndex == 3)">
          <el-select size="small" v-model="algorithm.channelId" @change="changeChannel(algorithm.channelId,'cut')" placeholder="请选择通道">
            <el-option
              v-for="item in channelList"
              :key="item.id"
              :label="item.chName"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="报警设备" prop="channelId" v-else-if="(getIndex == 2)">
          <el-select size="small" placeholder="本地设备" disabled>
          </el-select>
        </el-form-item>
        <el-form-item label="普通事件" prop="getIndex">
          <el-select size="small" v-model="getIndex" @change="changeAlgoList(algoList[getIndex])" placeholder="请选择智能事件">
            <el-option
              v-for="item in algoList"
              :key="item.index"
              :label="item.newLable + (item.enabled ? '已开启' : '已关闭')"
              :value="item.index">
              <span style="float: left;">{{item.name}}</span>
              <span :class="item.enabled ? 'classA' : 'classB'" style="float: right;">{{item.enabled ? '已开启' : '已关闭'}}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="gap_line"></div>
      <div class="algo_bottom" :style="{ height: size.contentHeight - 150 + 'px' }">
        <div class="algo_bottom_right">
        <el-tabs class="smart-tab" v-model="activeName" @tab-click="handleClick" type="card">
          <el-tab-pane name="first" :disabled="getIndex == 2">
            <span slot="label">
              <i class="el-icon-set-up"></i>
              参数配置
            </span>
            <div class="algo_bottom_right_bottom_title" v-if="getIndex == 0 || getIndex == 3">监测区域设置</div>
            <div class="algo_bottom_right_bottom">
              <div class="algo_bottom_right_bottom_left" v-if="picView || getIndex == 1">
                <div v-if="picView && getIndex == 0 || getIndex == 3">
                    <!-- 视频截图及操作按钮 -->
                    <div class="algo_bottom_right_bottom_left_top">
                      <img style="position: absolute;left: 0;top: 0;" :width="canvasSize.width" :height="canvasSize.height" :src="roiBase64" id="videoCapture" alt />
                      <canvas v-show="getIndex == 0"
                        id="canvas"
                        style="position:absolute;top:0;left:0;"
                        :width="canvasSize.width"
                        :height="canvasSize.height"
                        @mousedown="mousedown" @mouseup="mouseup" @mousemove="mousemove"
                        @contextmenu.prevent
                      ></canvas>
                      <canvas v-show="getIndex == 3" id="canvasMotionFg" style="position:absolute;top:0;left:0;" :width="canvasSize.width" :height="canvasSize.height" 
                        @mousedown="onDown" @mouseup="onUp" @mousemove="onMove" @contextmenu.prevent>
                      </canvas>
                    </div>
                    <div class="but_con">
                      <div class="identifyClass" id="drawArea" @click="drawCanvas">
                        <i class="el-icon-edit" ></i>识别区域
                      </div>
                      <div class="identifyClass identifyClass1" id="clearAll" @click="clearCanvas">
                          <i class="el-icon-refresh"></i>清空
                      </div>
                    </div>
                </div>
                <div class="algo_bottom_right_bottom_left_bottom" v-if="getIndex == 1">
                  <el-col :span="24" class="con">
                    <span class="total">已开通算法通道({{this.algorithmNum.length}})</span>
                    <div v-if="this.algorithmNum.length>0">
                      <div class="title">
                        <span class="title1">通道名称</span>
                        <span class="title1">IP地址</span>
                      </div>
                      <div v-for="(item,index) of this.algorithmNum" :key="index" class="channelTable">
                        <span class="ellipsis" :title="item.name">{{item.name}}</span>
                        <span class="ellipsis" :title="item.url">{{item.url}}</span>
                      </div>
                    </div>
                  </el-col>
                </div>
              </div>
              <div style="width: 60%;min-width: 650px;height: calc(100%);;line-height: 360px;text-align: center;font-size: 16px;color: #87888A;border-right: 1px solid rgb(235, 238, 245);" v-if="!picView && getIndex == 0 && getIndex == 3">
                  此通道处于关闭状态，不能进行识别操作
              </div>
              <div class="algo_bottom_right_bottom_right">
                <div style="margin:20px 20px 0">
                  <div class="enable">
                    算法开关 <el-switch v-if="getIndex == 0" class="switch" v-model="data.tamper.enable" @change="changeEnabled"></el-switch>
                    <el-switch v-else-if="getIndex == 1" class="switch" v-model="data.lose.enable" @change="changeEnabled"></el-switch>
                    <el-switch v-if="getIndex == 3" class="switch" v-model="data.motion.enable" @change="changeEnabled"></el-switch>
                  </div>
                </div>
                <div class="sensitivity_main" v-if="getIndex == 0">
                  <span class="sens-title">灵敏度</span>
                  <el-slider v-model="data.tamper.sensitivity" show-input :show-input-controls="false" input-size="mini"></el-slider>
                </div>
                <div class="sensitivity_main" v-if="getIndex == 3">
                  <span class="sens-title">灵敏度</span>
                  <el-slider v-model="data.motion.sensitivity" show-input :show-input-controls="false" input-size="mini"></el-slider>
                </div>
                <button class="button save" :disabled="btnDisabled" @click="submit">保存配置</button>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane name="second">
            <span slot="label">
              <i class="el-icon-s-operation"></i>
              布防计划设定
            </span>
            <Deployment ref="channelIdInitDef" v-if="getIndex == 0 || getIndex == 1 || getIndex == 3 && algorithm.channelId"></Deployment>
            <Exception @exenable="exenable" v-if="getIndex == 2"></Exception>
          </el-tab-pane>
        </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getChannels, getSnapshot, getChannelTamper, putChannelTamper, getChannelMotion, putChannelMotion, 
  getDefense, getVideoLose, putVideoLose, getChannelList } from '@/api/systemAPI';
import { getPicSize } from "@/views/smart/utils/getBase64"
import { decode } from "@/utils/packbits/decoder"
import { encode } from "@/utils/packbits/encoder"
import Deployment from '@/views/smart/deployment/index.vue';
import Exception from './exception'
import _ from 'lodash'

const WIDTH_DRAW = 640,
      CANVAS_RATIO = 720 / 1280

export default {
    name: "CommonDeployment",
    inject: ["size", "reload"],
    data() {
        return {
            formDataObj: {},
            activeName: "first",
            algorithm: {
                channelId: null
            },
            channelList: [],
            algoList: [],
            btnDisabled: false,
            browerType: "IE",
            playerStop: false,
            roiBase64: "",
            // 尺寸
            enabled: false,
            canvasSize: {
                width: 0,
                height: 0
            },
            x: 0,
            y: 0,
            dragFlag: false,
            drawFlag: false,
            canvasDom2: '',
            canvasCtx2: '',
            meshWidth: 22,
            meshHeight: 18,
            startX2: 0,
            startY2: 0,
            downFlag2: false,
            saveboxArr2: [],
            saveboxArrSplit2: [],
            data: {
              tamper: {
                sensitivity: 0,
                enable: false,
                polygon: []
              },
              motion: {
                sensitivity: 0,
                enable: false,
                columns: 22,
                rows: 18,
                minCount: 5,
                alarmOnDelay: 1000,
                alarmOffDelay: 1000,
                activeCells: "zwA="
              },
              lose: {
                enable: false,
              },
              excep: {
                enabled: false,
              }
            },
            getIndex: '',
            isOnRound: { result: false, index: null },
            algorithmNum: [],
            picView: false,
            details: {},
        };
    },
    created() {
        this.getChannelList("cut");
    },
    methods: {
      handleClick(tab, event) {
        if(tab.index == '1') {
          this.flag = true
        }
      },
        changeEnabled(e) {
            this.enabled = e;
        },
        // 通道列表
        getChannelList(param) {
            // 获取通道列表
            getChannels().then(res => {
                let channels = res.data.data
                this.channelList = channels.filter(item => {
                  return item.isBound
                })
                this.channelList && 
                getChannelList().then((res) => {
                  if (res.data.code === 200000) {
                    let arr = res.data.data
                    arr.forEach((item, index)=> {
                      let name = !item.chanNameList ? '' : (item.chanNameList.length>0 ? item.chanNameList[0].channelName : '')
                      this.channelList[index] = {...this.channelList[index], chName: ('[' + item.channelType + "" + item.channel + ']' + name)}
                    })
                    // 初始化首个通道
                    this.algorithm.channelId = this.channelList?.[0]?.id
                    this.alName = 'video'
                    this.algorithm.channelId && this.$refs.channelIdInitDef.initDef(this.algorithm.channelId, this.getIndex, this.channelList, this.alName)
                    this.changeChannel(this.algorithm.channelId, param);
                    this.getIndex = this.algorithm.channelId ? 0 : 2;
                  }
                })
            });
        },
        // 监听通道列表展示算法列表及详情
        changeChannel(e, param) {
            this.getAlgoNum();
            // 当前通道的所有算法参数
            this.algoObject = this.channelList.filter(item => item.id === e)[0];
            // 看当前通道是否在线
            this.picView = this.algoObject?.chStatus == 1 || false;
            this.$nextTick(() => {
              // 算法列表
              if (e) {
                this.algoList = this.algoList.length > 0 ? this.algoList : [
                {
                  index: 0,
                  name: "视频遮挡",
                  algorithm: "tamper",
                  enabled: this.data.tamper.enable || false,
                  newLable: '视频遮挡           '
                }, {
                  index: 1,
                  name: "视频丢失",
                  algorithm: "lose",
                  enabled: this.data.lose.enable || false,
                  newLable: '视频丢失           '
                }, {
                  index: 2,
                  name: "异常事件",
                  algorithm: "excep",
                  enabled: this.data.excep.enabled || false,
                  newLable: '异常事件           '
                }, {
                  index: 3,
                  name: "移动侦测",
                  algorithm: "motion",
                  enabled: this.data.motion.enable || false,
                  newLable: '移动侦测           '
                }];
              } else {
                this.algoList = this.algoList.length > 0 ? this.algoList : [{
                  index: 2,
                  name: "异常事件",
                  algorithm: "excep",
                  enabled: this.data.excep.enabled || false,
                  newLable: '异常事件           '
                }];
              }
            })
            // 如果在线
            if (this.picView && (this.getIndex === 0||this.getIndex === 3)) {
                // 并且不是首次默认的算法，只需获取算法详情，不许获取图片
                if (param == "second") {
                    this.getAlgoDetails();
                }
                else {
                    // 如果是切换到当前通道首次默认的算法，需获取图片
                    getSnapshot(this.algorithm.channelId).then(res => {
                        this.roiBase64 = "data:image/JPEG;base64," + res.data.data;
                        this.getRoiBase64(this.roiBase64);
                        this.getAlgoDetails();
                    }).catch(err => {
                      setTimeout(() => {
                        this.$message.error('获取图片失败')
                      }, 100)
                      this.roiBase64 = "data:image/JPEG;base64,"
                      document.getElementById('canvas').getContext('2d').clearRect(0, 0, 640, 360)
                      this.getAlgoDetails();
                    })
                  }
            }
            else {
                // 不在线只调用算法详情接口
                this.getAlgoDetails();
            }
            // 重新获取算法开关
            if (param == "cut") {
            }
            // 
            this.$nextTick(() => {
              if(this.getIndex != 2 ) {
                this.$refs.channelIdInitDef.initDef(this.algorithm.channelId, this.getIndex, this.channelList, this.alName)
              }
            })

          },
        // 获取当前算法下的算法详情
        getAlgoDetails() {
          getChannelMotion(this.algorithm.channelId).then(res => {
            this.data.motion = res.data.data
            this.algoList[3].enabled = this.data.motion.enable
            if(this.data.motion.columns && this.data.motion.rows) {
              this.initCanvasMotion(this.data.motion.columns,this.data.motion.rows,this.data.motion.activeCells)
            }
          }).catch(err => {
            if (this.getIndex == 3) {
              this.$message.error(err.message)
            }
            if(err.response.data.code === 400306) {
              this.$message.closeAll()
            } 
          })
          getChannelTamper(this.algorithm.channelId).then(res => {
            this.data.tamper = res.data.data
            this.algoList[0].enabled = this.data.tamper.enable
            if(this.data.tamper.polygon.length) {
              this.initCanvas(this.data.tamper.polygon)
            }
          }).catch(err => {
            if (this.getIndex == 0) {
              this.$message.error(err.message)
            }
            if(err.response.data.code === 400306) {
              this.$message.closeAll()
            } 
          })
          getVideoLose(this.algorithm.channelId).then(res => {
            this.data.lose = res.data.data
            this.algoList[1].enabled = this.data.lose.enable
          }).catch(err => {
            if (this.getIndex == 1) {
              this.$message.error(err.message)
            }
          })
          getDefense().then(res => {
            this.exflag = 0
            for(let item in res.data.data) {
              if(res.data.data[item].enable) {
                this.algorithm.channelId ? this.algoList[2].enabled = true : this.algoList[0].enabled = true
                return
              }
            }
          })
          if(this.getIndex == 0) {
              this.enabled = this.data.tamper.enable
          }
          if(this.getIndex == 1) {
              this.enabled = this.data.lose.enable
          }
          if(this.getIndex == 3) {
              this.enabled = this.data.motion.enable
          }
        },
        initCanvas(polygon) {
          let canvas = document.getElementById('canvas')
          if(canvas) {
            let ctx = canvas.getContext('2d')
            ctx.clearRect(0, 0, 640, 360)
            if(polygon[0]) {
              // 进行坐标变换：把原点放在左下角，东方为X轴正向，北方为Y轴正向
              ctx.save();
              ctx.translate(0, 360);
              ctx.rotate(Math.PI);
              ctx.scale(-1,1);
              ctx.fillStyle = '#00ff00';
              ctx.globalAlpha=0.3
              ctx.fillRect( polygon[0].x / 1.1, polygon[0].y / 1.6, 
              (polygon[2].x - polygon[0].x) / 1.1, (polygon[2].y - polygon[0].y) / 1.6 )
              ctx.save();
              ctx.translate(0, 360);
              ctx.rotate(Math.PI);
              ctx.scale(-1,1);
            }
          }
        },
        drawCanvas() {
          this.drawFlag = true
        },
        mousedown(e){
          this.dragFlag = true;
          this.x = e.offsetX; // 鼠标落下时的X
          this.y = e.offsetY; // 鼠标落下时的Y
        },
        mouseup(e){
          this.dragFlag = false;
          this.data.tamper.polygon[3].x = this.data.tamper.polygon[0].x = Math.round(this.x * 1.1)
          this.data.tamper.polygon[2].x = this.data.tamper.polygon[1].x = Math.round(e.offsetX * 1.1)
          this.data.tamper.polygon[1].y = this.data.tamper.polygon[0].y = Math.round((360 - this.y) * 1.6)
          this.data.tamper.polygon[3].y = this.data.tamper.polygon[2].y = Math.round((360 - e.offsetY) * 1.6)
        },
        mousemove(e){
          this.drawRect(e);
        },
        drawRect(e){
          if(this.dragFlag && this.drawFlag){
            let canvas = document.getElementById('canvas')
            var ctx = canvas.getContext("2d");
            let x = this.x;
            let y = this.y;
            ctx.beginPath();
            ctx.fillStyle = 'rgba(0,200,0,0.5)';
            ctx.clearRect(0, 0, 640, 360)
            ctx.fillRect(x, y, e.offsetX - x, e.offsetY - y);
            ctx.closePath();
          }
        },
        clearCanvas() {
          if (this.getIndex == 0) {
            let canvas = document.getElementById('canvas')
            let ctx = canvas.getContext('2d')
            ctx.clearRect(0, 0, 640, 360)
          } else if (this.getIndex == 3) {
            this.saveboxArr2 = []
            this.saveboxArrSplit2 = []
            for(let i=1;i<=this.data.motion.rows;i++) {
              for(let j=1;j<=this.data.motion.columns;j++) {
                this.saveboxArrSplit2.push(0)
              }
            }
            this.onClearCanvas2()
          }
        },
        // 移动侦测区域绘制
        initCanvasMotion(columns, rows, activeCells) {
          this.canvasDom2 = document.getElementById('canvasMotionFg');
          if(this.canvasDom2) {
            this.meshWidth = this.canvasSize.width / columns
            this.meshHeight = this.canvasSize.height / rows
            this.canvasCtx2 =  this.canvasDom2.getContext('2d');
            if (activeCells && activeCells != "") {
              let ac = decode(activeCells)
              let acs = ac.split("")
              this.saveboxArrSplit2 = []
              for (let i = 0; i < columns * rows; i++) {
                this.saveboxArrSplit2.push(acs[i] == "1" ? 1 : 0)
              }
            }
            this.onClearCanvas2()
            this._onDrawSave2()
          }
        },
        onDown(e) {
          if (this.drawFlag) {
            this.dragFlag = true;
            this.startX2 = e.offsetX
            this.startY2 = e.offsetY
          }
        },
        onMove(e) {
          if(this.dragFlag && this.drawFlag){
            this.onClearCanvas2()
            this.onDrawSave2()
            let X0 = e.offsetX > this.startX2 ? this.startX2: e.offsetX 
            let Y0 = e.offsetY > this.startY2 ? this.startY2: e.offsetY 
            let W = Math.abs(e.offsetX - this.startX2)
            let H = Math.abs(e.offsetY - this.startY2)
            this.canvasCtx2.beginPath()
            this.canvasCtx2.strokeStyle="#ff0000"
            this.canvasCtx2.lineWidth=1;
            this.canvasCtx2.strokeRect(X0,Y0,W,H);
          }
        },
        onUp(e) {
          if(this.dragFlag) {
            this.onClearCanvas2()
            let X0 = e.offsetX >= this.startX2 ? this.startX2: e.offsetX 
            let Y0 = e.offsetY >= this.startY2 ? this.startY2: e.offsetY 
            let X1 = e.offsetX < this.startX2 ? this.startX2: e.offsetX 
            let Y1 = e.offsetY < this.startY2 ? this.startY2: e.offsetY 
            let X00 = Math.floor(X0/this.meshWidth ) * this.meshWidth 
            let Y00 = Math.floor(Y0/this.meshHeight ) * this.meshHeight 
            let X11 = Math.ceil(X1/this.meshWidth ) * this.meshWidth 
            let Y11 = Math.ceil(Y1/this.meshHeight ) * this.meshHeight 
            // this.canvasCtx2.beginPath()
            // this.canvasCtx2.fillStyle="#2d8cf0"
            // this.canvasCtx2.fillRect(X00,Y00,X11-X00,Y11 - Y00);
            this.saveboxArr2.push({
              X0: X00,
              Y0: Y00,
              X1: X11,
              Y1: Y11,
            })
            this.onDrawSave2()
            this.dragFlag = false;
          }
        },
        onClearCanvas2(){
          this.canvasCtx2&&this.canvasCtx2.clearRect(0,0, this.canvasSize.width, this.canvasSize.height)
        },
        onDrawSave2(){
          this.saveboxArr2.forEach(item=> {
            this.canvasCtx2.beginPath()
            // this.canvasCtx2.fillStyle="#2d8cf0"
            // this.canvasCtx2.fillRect(item.X0,item.Y0,item.X1-item.X0,item.Y1 - item.Y0);
            // this.canvasCtx2.strokeStyle="#ff0000"
            // this.canvasCtx2.lineWidth=1;
            // this.canvasCtx2.strokeRect(item.X0,item.Y0,item.X1-item.X0,item.Y1 - item.Y0);
            let XX0 = Math.floor(item.X0/this.meshWidth)
            let XX1 = Math.floor(item.X1/this.meshWidth)
            let YY0 = Math.floor(item.Y0/this.meshHeight)
            let YY1 = Math.floor(item.Y1/this.meshHeight)
            for(let i=YY0; i<YY1;i++) {
              for(let j=XX0; j<XX1; j++){
                this.saveboxArrSplit2[i*this.data.motion.columns + j] = 1
              }
            }
          })
          
          this._onDrawSave2()
        },
        _onDrawSave2(){
          this.saveboxArrSplit2.forEach((item,index)=> {
            if(item) {
              let r = Math.floor(index/this.data.motion.columns)
              let c = index%this.data.motion.columns
              if(!this.canvasCtx2) {
                return 
              }
              this.canvasCtx2.beginPath()
              // this.canvasCtx2.fillStyle="#2d8cf0"
              // this.canvasCtx2.fillRect(this.meshWidth*c,this.meshHeight*r,this.meshWidth,this.meshHeight);
              this.canvasCtx2.strokeStyle="#ff0000"
              this.canvasCtx2.lineWidth=1;
              this.canvasCtx2.strokeRect(this.meshWidth*c,this.meshHeight*r,this.meshWidth,this.meshHeight);
            }
          })
        },
        // 监听算法列表展示
        changeAlgoList(item) {
          // this.getIndex为当前算法id
          this.getIndex = item.index;
          this.enabled = item.enabled;
          this.drawFlag = false;
          this.dragFlag = false;
            // 获取使用当前算法的通道并显示在右下角
            this.getAlgoNum();
            // 监听通道列表展示算法列表及详情，second表示当前通道非首次默认的算法
            this.changeChannel(this.algorithm.channelId, "second");
        },
        // 获取使用当前算法的通道并显示在右下角
        getAlgoNum() {
            getChannels().then(res => {
              this.tableData = res.data.data.filter(item => (item.model == "FTP" || item.model == "HTTP" || this.getIndex == 1) ? item : item.chStatus == 1);
              this.algorithmNum = [];
                this.tableData.forEach((item, index) => {
                    if ((this.getIndex == 1 && item.ssConfig?.videolose?.enable)) {
                        this.algorithmNum.push({
                            name: this.tableData[index].name,
                            url: this.tableData[index].ip
                        });
                    }
                });
            });
        },
        // 工具
        getRoiBase64(param) {
          if (!!param) {
            getPicSize(this.roiBase64).then(img => {
              this.canvasSize.width = WIDTH_DRAW;
              this.canvasSize.height = WIDTH_DRAW * CANVAS_RATIO;
            });
          }
        },
        submit() {
          this.btnDisabled = true
          // 移动侦测
          if(this.getIndex == 3) {
            if (this.algoObject.chStatus != 1) {
              this.btnDisabled = false
              this.$message.error('设备已离线')
              return
            }
            this.data.motion.activeCells = encode(this.saveboxArrSplit2)
            let params = {};
            params = this.data.motion;
            putChannelMotion(this.algorithm.channelId, params).then(res => {
              this.algoList[0].enabled = this.data.motion.enable
              this.$message.success('参数配置成功')
              this.getAlgoNum()
              setTimeout(()=> {
                this.btnDisabled = false
            },1000)
            }).catch(err => {
              this.btnDisabled = false
              this.$message.error('设置移动侦测失败')
            })
          }
          // 视频遮挡
          if(this.getIndex == 0) {
            if (this.algoObject.chStatus != 1) {
              this.btnDisabled = false
              this.$message.error('设备已离线')
              return
            }
            let params = {};
            params = this.data.tamper;
            putChannelTamper(this.algorithm.channelId, params).then(res => {
              this.algoList[0].enabled = this.data.tamper.enable
              this.$message.success('参数配置成功')
              this.getAlgoNum()
              setTimeout(()=> {
                this.btnDisabled = false
            },1000)
            }).catch(err => {
              this.btnDisabled = false
              this.$message.error('设置视频遮挡失败')
            })
          }
          if(this.getIndex == 1) {
            let params = {};
            params = this.data.lose;
            putVideoLose(this.algorithm.channelId, params).then(res => {
              this.algoList[1].enabled = this.data.lose.enable
              this.$message.success('保存成功')
              this.getAlgoNum()
              setTimeout(()=> {
                this.btnDisabled = false
            },1000)
            }).catch(err => {
              this.btnDisabled = false
              this.$message.error('设置视频丢失失败')
            })
          }
        },
        exenable(exenable) {
          this.algorithm.channelId ? this.algoList[2].enabled = exenable : this.algoList[0].enabled = exenable
        }
    },
    watch: {
        'algorithm.channelId'(val) {
          this.data = {
            tamper: {
              sensitivity: 0,
              enable: false,
              polygon: []
            },
            motion: {
              sensitivity: 0,
              enable: false,
              columns: 22,
              rows: 18,
              minCount: 5,
              alarmOnDelay: 1000,
              alarmOffDelay: 1000,
              activeCells: "zwA="
            },
            lose: {
              enable: false,
            },
            excep: {
              enabled: false,
            }
          },
          // this.getAlgoDetails()
          this.algoList[0].enabled = this.data.tamper.enable
          // this.initCanvas(this.data.tamper.polygon)
        },
        getIndex(value) {
          if( value == 2 ) {
            this.activeName = 'second'
          }
        },
    },
    components: { Deployment, Exception }
}
</script>

<style lang="less" scoped>
.algo::-webkit-scrollbar {
  // display: none;
}
#systemBox .algo{
  overflow: hidden;
  scrollbar-width: none;
  // height: calc(100vh - 128px); 
  width: calc(100vw - 215px);
  height: fit-content;
  margin-left: -20px;
  margin-right: -20px;
  font-size: 12px;
  margin-right: -20px;
  user-select: none;
  padding: 20px;
  padding-right: 0;
  &_top{
    margin-top: -3px;
    margin-bottom: -3px;
    padding-left: 20px;
  }
  .gap_line {
    margin-left: -20px;
    height: 15px;
    background: #EBEEF2;
  }
  .algo_bottom{
    overflow: auto;
  }
  &_bottom{
    display: flex;
    height: 90%;
    &_right{
      display: flex;
      flex-direction: column;
      // width: 100%;
      padding-left: 20px;
      .smart-tab {
        /deep/ .el-tabs__nav-scroll {
          padding-left: 0;
          margin-top: 25px;
        }
        /deep/ .el-tabs__item.is-disabled {
          cursor: not-allowed;
        }
        /deep/ .el-tabs--card>.el-tabs__header .el-tabs__nav {
          border: none;
        }
        /deep/ .el-tabs__item {
          font-size: 13px;
          width: 186px;
          border-left: none;
          text-align: center;
          color: #747474;
        }
        /deep/ #tab-first {
          margin-right: -25px;
          background: url('imgs/params_bg1.png');
        }
        /deep/ #tab-first.is-active {
          margin-right: -25px;
          color: #fff;
          background: url('imgs/params_bg.png');
        }
        /deep/ #tab-second {
          background: url('imgs/deploy_bg.png');
        }
        /deep/ #tab-second.is-active {
          background: url('imgs/deploy_bg1.png');
          color: #fff;
        }
      }
      &_top{
        display: flex;
        width: 100%;
        height: 41px;
        line-height: 41px;
        border-bottom: 1px solid rgb(235, 238, 245);
        background-color: #3A74FF0D;
      }
      &_bottom{
        display: flex;
        width: 100%;
        height: calc(100% - 41px);
        &_title {
          color: #333;
          font-size: 13px;
          display: inline-block;
          font-weight: 500;
        }
        &_left{
          width: 70%;
          min-width: 650px;
          height: calc(100% - 20px);;
          display: flex;
          flex-direction: column;
          border-right: 1px solid rgb(235, 238, 245);
          padding-top: 20px;
          &_top{
            width: 640px;
            height: 360px;
            position: relative;
            margin-top: 10px;
            margin:0 auto;
          }
          .but_con {
            margin: 10px;
            display: flex;
            color: #2178C8;
            font-size: 13px;
            .identifyClass {
              width: 96px;
              height: 28px;
              display: flex;
              justify-content: center;
              align-items: center;
              background: #FFFFFF;
              border-radius: 2px;
              border: 1px solid #E4E4E4;
              cursor: pointer;
            }
            .identifyClass1 {
              margin-left: 20px;
              width: 72px;
            }
            .identifyClass:hover {
              background: #EEF7FF;
            }
          }
          &_bottom{
            height: calc(100% - 380px);
            display: flex;
            margin:10px;
            font-size: 13px;
            .con {
              width:100%;
              .total {
                color: #333;
                font-weight: 500;
              }
              .title {
                margin: 10px 10px 0 0;
                width: 100%;
                height: 34px;
                line-height: 34px;
                background: #F3F5F9;
                border-radius: 2px;
                color: #333;
                display: flex;
                .title1 {
                  width: 50%;
                  margin-left: 20px;
                }
              }
              .channelTable {
                background: #FCFDFF;
                color: #666;
                width: 100%;
                display: flex;
                .ellipsis {
                  width: 50%;
                  margin-left: 20px;
                }
              }
            }
          }
        }
        &_right{
          width: 30%;
          min-width: 550px;
          height: 100%;
          .enable {
            color: #333;
            font-weight: 500;
            margin-left: 10px;
            margin-top: -10px;
            margin-bottom: -10px;
            .switch {
              margin-left: 10px;
            }
          }
        }
        .save {
          float: left;
          margin-left: 20px;
          width: 78px;
          margin-top: 300px;
          height: 30px;
          background: #2178C8;
          border-radius: 2px;
          color: #fff;
          border: none;
          font-size: 12px;
          cursor: pointer;
        }
        .sensitivity_main {
          color: #333;
          margin-left: -70px;
          margin-top: 30px;
          display:inline-block;
        }
      }
    }
  }
  .inputLab {
    margin-top: -12px;
  }
  .input {
    height: 23px;
    border-radius: 5px;
    font-size: 12px;
    border-color: white;
    width: 110px;
  }
  .el-input__icon {
    line-height: 30px;
  }
  .typeface {
    color:#909399;
    font-size:12px
  }
  .inputWidth {
    width:75px
  }
  .el-col-12 {
    width: 47%;
  }
  ::-webkit-scrollbar {
    /*隐藏滚轮*/
    // display: none;
  }
  .channelTable :hover {
    background: #D1DFFF;
  }
  .identifyClass :hover {
    background: #D1DFFF;
  }
  .identifyClass1 :hover {
    background: #4c6aaf;
  }
}
.non_channel {
  height: 32px;
  line-height: 32px;
  padding-left: 10px;
  color: #606266;
  // padding: 0 30px 0 15px;
  width: 215px;
  background: #fff;
  border-radius: 5px;
}
/deep/ .el-slider__runway {
  width: 160px;
}
/deep/ .el-input__inner {
  height: 28px;
  line-height: 28px;
  border-radius: 2px;
  border: 1px solid #EBEEF5;
}
/deep/ .el-input-number.is-without-controls .el-input__inner {
    width: 60px;
    padding-left: 10px;
    padding-right: 10px;
}
</style>
