<template>
  <div>
    <div class="cmpImgBox" v-if="isAlarm" style="width:290px;">
      <span class="score" v-if="detail.alertType === 1">{{ detail.score | ratioFilter}}</span>
      <span class="score" v-else-if="detail.alertType === 2">陌生人</span>
      <span class="score" v-else-if="detail.alertType === 3">非准入</span>
      <span class="score" v-else-if="detail.alertType === 4" style="margin-left:136px">疑似</span>
      <span class="score" v-else-if="detail.alertType === 5" style="margin-left:136px">异常</span>

      <div class="trapezoid"></div>
      <viewer class="rowStart">
        <img :src="detail.faceImagePath" :onerror="errorImg" style="width:140px;height:140px" class="img_scale_down cursor">
        <img style="margin-left:10px;width:140px;height:140px" class="img_scale_down cursor"
             :src="(detail.alertType === 2 || detail.alertType === 5) ? strangerImg : ((detail.face === null || detail.face === undefined) ? strangerImg : detail.face.imagePath)"
             :onerror="errorImg"
        >
        <canvas id="canvas" ref="markCanvas1" style="position: absolute; z-index: 9999 !important;"></canvas>
      </viewer>
    </div>

    <div v-else class="rowStart" style="width:320px">
      <div class="cmpImgBox rowColCenter">
        <viewer>
          <img :src="detail.faceImagePath" :onerror="errorImg" style="width:140px;height:140px" class="img_scale_down passImg cursor mt3">
          <canvas id="canvas" ref="markCanvas" style="position: absolute; z-index: 9999 !important;"></canvas>
        </viewer>
      </div>

      <div v-if="!isAlarm && detail.carouselList.length" class="rowStart">
        <div class="relatedTxt">关联</div>
        <el-carousel id="carousel_face"
                     indicator-position="outside"
                     height="140px"
                     style="margin-top:20px;width:140px"
        >
          <el-carousel-item v-for="(item, key) in detail.carouselList" :key="key">
            <viewer :images="detail.carouselList">
              <img :src="item" style="height:140px;width:140px;cursor:pointer" class="img_scale_down" />
            </viewer>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>

    <div :style="{width: (isAlarm ? 345 : 345) + 'px', height: (isAlarm ? 440 : 420) + 'px'}" style="overflow-y:auto">
      <div class="faceImgTxtBox">
        <label class="title">{{$t('time')}}</label>
        <label class="contentDet">{{detail.detectTime}}</label>
      </div>
      <div class="faceImgTxtBox rowStart">
        <div class="title">{{$t('camera')}}</div>
        <!-- <el-tooltip :content="detail.channelName" placement="bottom"> -->
          <div class="contentDet ellipsis" style="width:120px">{{detail.channelID}}</div>
        <!-- </el-tooltip> -->
      </div>
      <div class="faceImgTxtBox rowStart" v-if="isAlarm">
        <div class="title">{{$t('fullName')}}</div>
        <div v-if="(detail.alertType === 2 || detail.alertType === 5)" class="contentDet ellipsis">{{$t('none')}}</div>
        <el-tooltip v-else :content="detail.faceName" placement="bottom">
          <div class="contentDet ellipsis">{{detail.faceName || $t('none')}}</div>
        </el-tooltip>
      </div>
      <div class="faceImgTxtBox" v-if="isAlarm">
        <label class="title">{{$t('ID')}}</label>
        <label class="contentDet ellipsis">{{detail.faceID ? detail.faceID : $t('none')}}</label>
      </div>
      <!-- listMap -->
      <div v-for="(item, index) of faceMap" :key="index" class="faceImgTxtBox">
        <label class="title">{{ $t(index) }}</label>
        <label class="contentDet" v-if="(detail[index] instanceof Array)">
          <span v-for="(v, i) of detail[index]" :key="i">{{v}}</span>
        </label>
        <label class="contentDet" v-else> 
          <span>{{detail[index]}}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import 'viewerjs/dist/viewer.css'
import { faceMap } from "../../utils/listMap.js"

export default {
  props: {
    detail: {
      type: Object,
      required: true
    },
    isAlarm: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      faceMap,
      width: '',
      height: '',
      strangerImg: require('@/assets/img/stranger.png'),
      errorImg:  'this.src="' + require('@/assets/img/stranger.png') + '"',
    }
  },
  methods: {
    initCanvas (detail) {
      this.$nextTick(()=>{
        const markCanvas = this.$refs.markCanvas
        markCanvas.width = 850
        markCanvas.height = 480
        markCanvas.style.marginLeft = -1031 + 'px'
        markCanvas.style.marginTop = -16 + 'px'
        let ctx = markCanvas.getContext('2d')
        let newImage = new Image()
        newImage.src = detail.sceneImagePath
        newImage.onload = () => {
          let bbox = detail.bbox
          this.width = newImage.width
          this.height = newImage.height
            if(bbox.x && detail.sceneImagePath) {
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
      this.$nextTick(()=>{
        const markCanvas1 = this.$refs.markCanvas1
        markCanvas1.width = 850
        markCanvas1.height = 480
        markCanvas1.style.marginLeft = -890 + 'px'
        markCanvas1.style.marginTop = -2 + 'px'
        let ctx = markCanvas1.getContext('2d')
        let newImage = new Image()
        newImage.src = detail.sceneImagePath
        newImage.onload = () => {
          let bbox = detail.bbox
          this.width = newImage.width
          this.height = newImage.height
            if(bbox.x && detail.sceneImagePath) {
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
  }
}
</script>
<style lang="less" scoped>
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
</style>
