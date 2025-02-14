<!--
 * @Author: Stephen
 * @Date: 2019-11-19 11:50:25
 * @LastEditors: Stephen
 * @LastEditTime: 2019-12-03 16:08:12
 -->
<template>
  <div>
    <el-dialog :title="$t('checkDetail')"
               :width="dialogWidth"
               :visible.sync="dialogDetailVisible"
               :before-close="handleDialogClose"
               :close-on-click-modal="false"
               style="margin-top:-25px"
    >
      <div class="rowStart">
        <!-- 背景图 -->
        <div class="faceImgBox">
          <viewer>
            <img class="faceImg cursor"
                 :src="detail.sceneImagePath ? detail.sceneImagePath : defaultImg"
                 :onerror="errorImg"
                 alt="" />
          <canvas id="canvas" ref="markCanvas" width="850" height="450" style="position: absolute; z-index: 9999 !important;"></canvas>
          </viewer>
        </div>
        <!-- 详细信息 -->
        <div class="faceImgTxtContainer" style="position:relative">
          <div v-if="passType === 'face'"><Face ref="face-detail" :detail="detail" :isAlarm="isAlarm" /></div>
          <div v-else-if="passType === 'pedestrian'"><Pedestrian ref="pedestrian-detail" :detail="detail" :isAlarm="isAlarm"/></div>
          <div v-else-if="passType === 'vehicle'"><Vehicle ref="vehicle-detail" :detail="detail" :isAlarm="isAlarm" /></div>
          <div v-else><Nonmotor ref="nonmotor-detail" :detail="detail" :isAlarm="isAlarm"/></div>
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
import Face from './face'
import Pedestrian from './pedestrian'
import Vehicle from './vehicle'
import Nonmotor from './nonmotor'
import { ratioFilter } from '../utils/filter.js'
export default {
  props: {
    dialogDetailVisible: {
      type: Boolean,
      required: true
    },
    detail: {
      type: Object,
      required: true
    },
    passType: {
      type: String,
      required: false
    },
    isAlarm: {
      type: Boolean,
      required: false
    },
    detailPage: {
      type: Object,
      required: true
    }
  },
  filters: {
    ratioFilter,
  },
  data () {
    return {
      dialogWidth: this.isAlarm === true ? '1250px' : '1250px',
      errorImg: 'this.src="' + require('../img/blank.png') + '"',
      defaultImg: require('../img/blank.png')
    }
  },
  methods: {
    init(detail) {
      this.$nextTick(()=>{
        this.$refs['face-detail'].initCanvas(detail)
      })
      this.$nextTick(()=>{
        this.$refs['pedestrian-detail'].initCanvas(detail)
      })
      this.$nextTick(()=>{
        this.$refs['vehicle-detail'].initCanvas(detail)
      })
      this.$nextTick(()=>{
        this.$refs['nonmotor-detail'].initCanvas(detail)
      })
    },
    handleDialogClose () {
      // this.detail.sceneImagePath = '' // 否则打开为上一次的图片
      this.$emit('closeDetail')
    },
    getPre () {
      this.$emit('getPre')
    },
    getNext () {
      this.$emit('getNext')
    }
  },
  components: {
    Face, Pedestrian, Vehicle, Nonmotor
  }
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
