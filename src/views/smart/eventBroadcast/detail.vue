<template>
  <div>
    <el-dialog :title="$t('checkDetail')"
               :width="dialogWidth"
               :visible.sync="dialogDetailVisible"
               :close-on-click-modal="false"
               style="margin-top:-25px">
      <div class="rowStart">
        <!-- 背景图 -->
        <div class="faceImgBox">
          <viewer>
            <img class="faceImg cursor"
                 :src="detail.sceneImagePath ? detail.sceneImagePath : defaultImg"
                 :onerror="errorImg"
                 alt="" />
            <canvas id="canvas" ref="markCanvas" style="position: absolute; z-index: 9999 !important;"></canvas>
          </viewer>
        </div>
        <!-- 详细信息 -->
        <div class="faceImgTxtContainer" style="position:relative">
            <div class="faceImgTxtBox">
                <label class="title">{{$t('time')}}</label>
                <label class="contentDet">{{detail.detectTime}}</label>
            </div>
            <div class="faceImgTxtBox rowStart">
                <div class="title">{{$t('camera')}}</div>
                <el-tooltip :content="detail.channelID || '/'" placement="bottom">
                <div class="contentDet ellipsis" style="width:120px">{{detail.channelID || '/'}}</div>
                </el-tooltip>
            </div>
            <div class="faceImgTxtBox rowStart">
                <div class="title">通道名称</div>
                <el-tooltip :content="detail.chName" placement="bottom">
                <div class="contentDet ellipsis" style="width:120px">{{detail.chName}}</div>
                </el-tooltip>
            </div>
            <div class="faceImgTxtBox rowStart">
                <div class="title">报警类别</div>
                <el-tooltip :content="detail.type" placement="bottom">
                <div class="contentDet ellipsis" style="width:120px">{{detail.type}}</div>
                </el-tooltip>
            </div>
            <div class="faceImgTxtBox rowStart" v-if="detail.alarmOutputs && detail.alarmOutputs.length>0">
                <div class="title">报警输出端子</div>
                <el-tooltip :content="detail.type" placement="bottom">
                <div class="contentDet ellipsis" style="width:120px">{{(detail.alarmOutputs && detail.alarmOutputs.length>0) ? detail.alarmOutputs.toString() : ''}}</div>
                </el-tooltip>
            </div>
            <div class="faceImgTxtBox rowStart" 
                v-if="(detail.typeValue === 'faceAlert' && (detail.alertType === 1 || detail.alertType === 3 || detail.alertType === 4)) || 
                      (detail.typeValue === 'vehicleAlert' && detail.alertType === 1)">
                <div class="title">{{ detail.typeValue === 'faceAlert' ? '触发人脸库' : '触发机动车库' }}</div>
                <el-tooltip :content="repo" placement="bottom">
                  <div class="contentDet ellipsis" style="width:120px">{{ repo }}</div>
                </el-tooltip>
            </div>
            <div v-if="itemList">
              <div v-for="(item, index) of itemList" :key="index">
                <div class="faceImgTxtBox rowStart">
                  <div class="title">{{ $t(index) }}</div>
                  <el-tooltip :content="item" placement="bottom">
                    <div class="contentDet ellipsis" style="width:120px">{{ item }}</div>
                  </el-tooltip>
                </div>
              </div>
            </div>
        </div>
        <div>
          <!-- 上下翻页按钮 -->
          <button type="button"
                  class="button preBtn"
                  :class="{disButton: detailPage.isFirst === true}"
                  @click="getPre"
          >上一页</button>
          <button
                  :class="{disButton: detailPage.isLast === true}"
                  class="button"
                  type="button"
                  style="position:absolute;bottom:20px;right:30px;"
                  @click="getNext"
          >下一页</button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { filterStatus } from '@/utils'
import { pedestrianMap, vehicleMap, faceMap } from "../passRecord/_utils/listMap";
export default {
  data () {
    return {
        dialogDetailVisible: false,
        filterStatus,
        dialogWidth: this.isAlarm === true ? '1250px' : '1250px',
        errorImg: 'this.src="' + require('@/assets/img/blank.png') + '"',
        defaultImg: require('@/assets/img/blank.png'),
        detail: {},
        detailPage: {
            isFirst: false,
            isLast: false
        },
        repo: '',
        itemList: {},
    }
  },
  methods: {
    init(details,index) {
        this.$nextTick(()=>{
            this.index = index
            // 组件传值默认是浅拷贝
            this.details = JSON.parse(JSON.stringify(details))
            this.dialogDetailVisible = true
            this.handleDetails(index)
			      this.getRedBox()
        })
    },
	getRedBox() {
		this.$nextTick(()=>{
			const markCanvas = this.$refs.markCanvas
			markCanvas.width = 850
			markCanvas.height = 480
			markCanvas.style.marginLeft = 30 + 'px'
			markCanvas.style.marginTop = 17 + 'px'
			let ctx = markCanvas.getContext('2d')
			let newImage = new Image()
			newImage.src = this.detail.sceneImagePath
			newImage.onload = () => {
				let bbox = this.detail.bboxes[0]
				this.width = newImage.width
				this.height = newImage.height
				if(bbox.x && this.detail.sceneImagePath) {
					let vvw = 850 / this.width
					let vvh = 480 / this.height
					let x = Math.round(vvw * bbox.x)
					let y = Math.round(vvh * bbox.y)
					let w = Math.round(vvw * bbox.width)
					let h = Math.round(vvh * bbox.height)
					ctx.rect(x, y, w, h)
					ctx.strokeStyle  = 'red'
					ctx.stroke()
				}
			}
		})
	},
    handleDialogClose () {
      this.dialogDetailVisible = false
    },
    handleDetails(index) {
      this.detailPage.isFirst = index === 0 ? true : false
      this.detailPage.isLast = index === this.details.length-1 ? true : false
      this.detail = this.details[index]
      this.detail.chName = this.detail.chName.split(']')[1] || '/'
      this.repo = this.detail.typeValue === 'faceAlert' ? 
                  this.detail?.details?.data?.face?.faceRepo.name : 
                  this.detail?.details?.data?.vehicle?.vehicleRepo.name
      this.itemList = {}
      if(this.detail.typeValue === 'enterArea' || this.detail.typeValue === 'leaveArea' || this.detail.typeValue === 'outOfBounds') {
        for(let index in this.detail.details.types) {
          let data = this.detail.details.data[index]
          if (this.detail.details?.types[index] === 1) {
            // 人体
            let pedestrianItemList = {}
            let pedestrianList = []
            Object.keys(pedestrianMap).forEach((item) => {
              pedestrianList.push(item)
            })
            for(let i in data) {
              if(pedestrianList.includes(i)) {
                pedestrianItemList = {...JSON.parse(JSON.stringify(pedestrianItemList)), [i]: data[i] || '未知'}
              }
            }
            Object.keys(pedestrianMap).forEach((item) => {
              if(data[item]) {
                if (data[item] instanceof Array) {
                  // 数组字段
                  data[item].forEach(
                    (v, c) => 
                      (pedestrianItemList[item][c] = pedestrianMap[item].get(v))
                  );
                  pedestrianItemList[item] = pedestrianItemList[item].join(', ')
                } else {
                  pedestrianItemList[item] = pedestrianMap[item].get(data[item]); // 单值字段
                }
              } else {
                pedestrianItemList[item] = '未知'
              }
            });
            this.itemList = pedestrianItemList
          } else if (this.detail.details?.types[index] === 2) {
            // 机动车 数据处理存在vehicleItemList
            let vehicleItemList = {
              vehicleID: data.vehicleID || '未知',
              brand: `${data.make}-${data.model}`,
              year: data.year || '未知',
            }
            Object.keys(vehicleMap).forEach((item) => {
              if (data[item] instanceof Array) {
                // 数组字段
                data[item].forEach(
                  (v, c) =>
                    (vehicleItemList[item][c] = vehicleMap[item].get(v))
                );
              } else {
                vehicleItemList[item] = vehicleMap[item].get(data[item]); // 单值字段
              }
            });
            this.itemList = vehicleItemList
          }
        }
      }
      let data = this.detail?.details?.data
      if(this.detail.typeValue === 'faceAlert') {
        for(let item in data) {
          let faceItemList = {
            ID: this.detail.alertType == 1 ? (data.faceID || '未知') : '无',
            姓名: this.detail.alertType == 1 ? (data.faceName || '未知') : '无'
          }
          Object.keys(faceMap).forEach((item) => {
            if (data[item] instanceof Array) {
              // 数组字段
              data[item].forEach(
                (v, c) =>
                  (faceItemList[item][c] = faceMap[item].get(v))
              );
            } else {
              faceItemList[item] = faceMap[item].get(data[item]); // 单值字段
            }
          });
          this.itemList = faceItemList
        }
      } else if(this.detail.typeValue === 'vehicleAlert') {
        for(let item in data) {
          let vehicleItemList = {
            vehicleID: data.vehicleID || '未知',
            brand: `${data.make}-${data.model}`,
            year: data.year || '未知',
          }
          Object.keys(vehicleMap).forEach((item) => {
            if (data[item] instanceof Array) {
              // 数组字段
              data[item].forEach(
                (v, c) =>
                  (vehicleItemList[item][c] = vehicleMap[item].get(v))
              );
            } else {
              vehicleItemList[item] = vehicleMap[item].get(data[item]); // 单值字段
            }
          });
          this.itemList = vehicleItemList
        }
      }
    },
    getPre () {
      if (this.index !== 0) {
        this.index -= 1
        this.handleDetails(this.index)
		    this.getRedBox()
      }
    },
    getNext () {
      if (this.index !== this.details.length-1) {
        this.index += 1
        this.handleDetails(this.index)
		    this.getRedBox()
      }
    }
  },
}
</script>

<style lang="less" scoped>
.preBtn {
  position:absolute;
  bottom:20px;
  left:30px
}
.button {
  width: 90px;
  height: 30px;
  line-height: 30px;
  background: rgba(58, 116, 255, 1);
  /* box-shadow: 0px 2px 10px 0px rgba(58, 116, 255, 0.4); */
  color: rgba(255, 255, 255, 1);
  font-size: 12px;
  font-weight: 400;
  padding: 0;
  border: 1px solid rgba(58, 116, 255, 1);
}

.button:hover {
  background: rgba(58, 116, 255, 0.75);
  cursor: pointer;
}

.button:active {
  background: rgba(58, 116, 255, 0.75);
  border: 0;
  outline: 0;
}

.button:focus {
  background: rgba(58, 116, 255, 0.75);
  outline: 0;
}
.disButton {
  background: #c9d8ef;
  box-shadow: none;
  border: 0;
}
.disButton:hover {
  background: #c9d8ef;
  cursor: not-allowed;
}
.disButton:active {
  background: #c9d8ef;
}
.disButton:focus {
  background: #c9d8ef;
}
.faceImgBox {
  position: relative;
  width: 900px;
  height: 560px;
  margin-left: -35px;
  margin-top: -14px;
  // border-right: 1px solid rgba(219,220,231,1)
}

.faceImg {
  width: 850px;
  height: 480px;
  margin: 18px 0 0 30px;
  position: absolute;
}
.faceImgTxtContainer {
  float: left;
  font-size: 12px;
  font-weight: 400;
}
.faceImgTxtBox {
  height: 17px;
  line-height: 17px;
  margin: 12px 0 0 0px;
}
.title {
  display: inline-block;
  width: 80px;
  text-align: right;
  font-size:12px;
  font-weight:400;
  color: #909399
}
.contentDet {
  color: #303133;
  margin-left: 12px;
  max-width: 220px;
}

.cmpImgBox {
  margin: 20px 0 10px 20px;
  width: 140px;
  height: 140px;
  background-color: white;
  box-shadow: 0px 0px 10px 0px rgba(58, 116, 255, 0.4)
}
.trapezoid {
  position: absolute;
  z-index: 1;
  width: 76px;
  border: 22px solid transparent;
  border-bottom-color: red;
  margin: 96px 0 0 86px;
}
.score {
  position: absolute;
  z-index: 2;
  height: 20px;
  margin: 120px 0 0 126px;
  color: white;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
}
.w120 {
  width: 120px
}
.w255 {
  width: 255px
}

.passImg {
  width: 140px;
  height: 140px;
}
.alertImg {
  width: 280px;
  height: 280px
}
.cursor {
  cursor: pointer;
}

.relatedTxt {
  width: 30px;
  height: 140px;
  line-height: 140px;
  margin: 20px 0 0 10px;
  font-weight: 600;
}
</style>
