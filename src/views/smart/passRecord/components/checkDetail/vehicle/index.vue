<template>
  <div>
    <!-- <div class="cmpImgBox rowColCenter" :class="{passImg:!isAlarm, alertImg:isAlarm}">
      <viewer>
        <img
          :src="detail.cropImagePath"
          :class="{passImg:!isAlarm, alertImg:isAlarm}"
          class="img_scale_down cursor mt3"
          :onerror="errorImg"
        />
      </viewer>
    </div> -->

    <div class="rowStart" style="width:320px;">
      <div class="cmpImgBox rowColCenter">
        <viewer>
          <img style="height:140px;width:140px;cursor:pointer"
               :src="detail.cropImagePath" :onerror="errorImg" :class="{passImg:!isAlarm, alertImg:isAlarm}" class="img_scale_down passImg cursor mt3">
          <canvas id="canvas" ref="markCanvas" style="position: absolute; z-index: 9999 !important;"></canvas>
        </viewer>
      </div>

      <div v-if="!isAlarm && detail.carouselList.length" class="rowStart">
        <div class="relatedTxt">关联</div>
        <el-carousel id="carousel_vehicle"
                     indicator-position="outside"
                     height="140px"
                     style="margin:20px 0 0 10px;width:140px"
        >
          <el-carousel-item v-for="(item, key) in detail.carouselList" :key="key">
            <viewer :images="detail.carouselList">
              <img :src="item" style="height:140px;width:140px;cursor:pointer" class="img_scale_down" />
          <canvas id="canvas" ref="markCanvas" style="position: absolute; z-index: 9999 !important;"></canvas>
            </viewer>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>

    <!-- 全属性 -->
    <div :style="{width: (isAlarm ? 345 : 345) + 'px', height: (isAlarm ? 440 : 420) + 'px'}" style="overflow-y:auto">
      <div class="faceImgTxtBox" style="margin-top:8px">
        <label class="title">{{$t('time')}}</label>
        <label class="contentDet">{{detail.detectTime}}</label>
      </div>
      <div class="faceImgTxtBox rowStart">
        <label class="title">{{$t('camera')}}</label>
        <!-- <el-tooltip :content="detail.channelID" placement="bottom"> -->
          <label class="contentDet ellipsis" style="width:120px">{{detail.channelID}}</label>
        <!-- </el-tooltip> -->
      </div>
      <div class="faceImgTxtBox">
        <label class="title">车牌号</label>
        <label class="contentDet">{{detail.vehicleID ? detail.vehicleID : '未知'}}</label>
      </div>
      <div class="faceImgTxtBox">
        <label class="title">品牌</label>
        <label class="contentDet">{{`${detail.make}-${detail.model}`}}</label>
      </div>
      <div class="faceImgTxtBox">
        <label class="title">年份</label>
        <label class="contentDet">{{detail.year ? detail.year : '未知'}}</label>
      </div>
      <!-- listMap -->
      <div v-for="(item, index) of vehicleMap" :key="index" class="faceImgTxtBox">
        <label class="title">{{$t(index)}}</label>
        <label class="contentDet" v-if="(detail[index] instanceof Array)"> 
          <span v-for="(v, i) of detail[index]" :key="i">{{v}}</span>
        </label>
        <label class="contentDet" v-else> 
          <span>{{detail[index]}}</span>
        </label>
      </div>
    </div>

    <!-- <div v-if="!isAlarm">
      <div
        class="faceImgTxtBox"
        style="margin:15px 0 0 18px"
        v-if="detail.carouselList && detail.carouselList.length"
      >
        <label class="title" style="color:black">关联目标</label>
      </div>
      <el-carousel
        id="carousel_vehicle"
        indicator-position="outside"
        height="180px"
        style="margin:5px 0 0 10px"
      >
        <el-carousel-item v-for="(item, key) in detail.carouselList" :key="key">
          <viewer :images="detail.carouselList">
            <img :src="item" style="height:180px;width:180px;cursor:pointer" class="img_scale_down" />
          </viewer>
        </el-carousel-item>
      </el-carousel>
    </div> -->
  </div>
</template>

<script>
import "viewerjs/dist/viewer.css";
import { vehicleMap } from "../../utils/listMap.js"

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
  mounted() {
  },
  data() {
    return {
      vehicleMap,
      width: '',
      height: '',
      errorImg: 'this.src="' + require("@/assets/img/vehicle.png") + '"'
    };
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
    },
  }
};
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