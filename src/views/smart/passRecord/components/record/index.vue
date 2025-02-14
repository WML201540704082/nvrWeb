<!--
 * @Author: Stephen
 * @Date: 2019-11-19 11:50:25
 * @LastEditors: Stephen
 * @LastEditTime: 2019-12-03 16:08:12
 -->
<template>
  <!-- 人脸 -->
  <div class="mainBox" v-if="passType === 'face'"
       :style="{width: size.contentWidth - 450 + 'px', height: size.contentHeight - 310 + 'px'}">
    <div v-if="!passData.length" style="color: #909399; font-size: 14px; text-align: center; width: 100%; height: 100%; line-height: 150px;">暂无数据</div>   
    <div v-for="(item,index) of passData"
         :key="index"
         :class="{passFaceImgBox:true, active:selectedPassIds.indexOf(item.id) > -1}"
    >
      <img :src="item.faceImagePath" class="faceSize img_scale_down" :onerror="errorFaceImg" @click="imgChoose(item)">

      <div class="passTime">
        <div class="mt5">
          <!-- <i class="iconfont">&#xe655;</i> -->
          <i class="el-icon-time"></i>
          <span class="ellipsis ml5">{{item.detectTime}}</span>
        </div>
        <div class="mt5">
          <span class="ellipsis" style="display:inline-block;width:110px">
            <!-- <i class="iconfont">&#xe63a;</i> -->
            <i class="el-icon-video-camera"></i>
            {{item.channelName}}
          </span>
        </div>
      </div>
      <div class="passEdit">
        <div @click="showDetail(item)" class="mt5">
          <!-- <i class="iconfont ml10">&#xe628;</i> -->
          <i class="el-icon-search"></i>
          查看详情
        </div>
      </div>
    </div>
  </div>
  <!-- 人体和车辆 -->
  <div class="mainBox_2" v-else-if="passType === 'pedestrian' || passType === 'vehicle' || passType === 'nonmotor'"
       :style="{width: size.contentWidth - 450 + 'px',
                height: passType === 'vehicle' ? (size.contentHeight - 340) + 'px' : (size.contentHeight - 310) + 'px', 
                marginTop:passType === 'vehicle' ? '165px' : '125px'}"
  >
    <div v-if="!passData.length" style="color: #909399; font-size: 14px; text-align: center; width: 100%; height: 100%; line-height: 150px;">暂无数据</div>   
    <div v-for="(item,index) of passData"
         :key="index"
         :class="{passBodyImgBox:true, active:selectedPassIds.indexOf(item.id) > -1}"
    >
      <!-- v-lazy="item.cropImagePath" -->
      <img :src="item.cropImagePath"
           class="bodySize img_scale_down"
           :onerror="passType === 'pedestrian' ? errorBodyImg : (passType === 'vehicle' ? errorVehicleImg: errorNonmotorImg)"
           @click="imgChoose(item)"
      >

      <div class="passTime">
        <div style="color:#ffffff" class="rowStart" v-if="passType === 'pedestrian'">
          <div class="rowColCenter ellipsis passColorInfo">{{item.upperColor}}</div>
          <div class="rowColCenter ellipsis passColorInfo ml5">{{item.lowerColor}}</div>
          <div class="rowColCenter ellipsis passColorInfo ml5">{{item.gender}}</div>
          <!-- <div class="rowColCenter ellipsis passColorInfo ml10">{{item.age}}</div> -->
        </div>
        <div style="color:#ffffff" class="rowStart" v-else-if="passType === 'vehicle'">
          <div class="rowColCenter ellipsis">
            <span class="vehicleNo" :style="{backgroundColor: item.plateBackColor, color: (item.plateBackColor === 'rgb(240, 240, 240)' || item.plateBackColor === 'rgb(244, 244, 244)') ? '#303133' : ''}">NO. {{item.vehicleID}}</span>
          </div>
        </div>
        <div style="color:#ffffff" class="rowStart" v-else-if="passType === 'nonmotor'">
          <div class="rowColCenter ellipsis passColorInfo">{{item.transportation}}</div>
          <div class="rowColCenter ellipsis passColorInfo ml5">{{item.transportationColor}}</div>
        </div>
        <div class="mt5">
          <!-- <i class="iconfont">&#xe655;</i> -->
          <i class="el-icon-time"></i>
          <span class="ellipsis ml5">{{item.detectTime}}</span>
        </div>
        <div class="mt5">
          <span class="ellipsis" style="display:inline-block;width:160px">
            <!-- <i class="iconfont">&#xe63a;</i> -->
            <i class="el-icon-video-camera"></i>
            {{item.channelName}}
          </span>
        </div>
      </div>
      <!-- <img class="picChoose"
           src="@/assets/img/check.png"
           v-if="selectedPassIds.indexOf(item.id) > -1"
      /> -->
      <div class="passEdit">
        <div @click="showDetail(item)" class="mt10 ml30">
          <!-- <i class="iconfont ml10">&#xe628;</i> -->
          <i class="el-icon-search"></i>
          查看详情
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  inject: ["size"],
  props: {
    passData: {
      type: Array,
      required: true
    },
    passType: {
      type: String,
      required: true
    },
    selectedPassIds: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      errorFaceImg: 'this.src="' + require('@/assets/img/stranger.png') + '"',
      errorBodyImg: 'this.src="' + require('@/assets/img/alert.png') + '"',
      errorVehicleImg: 'this.src="' + require('@/assets/img/vehicle.png') + '"',
      errorNonmotorImg: 'this.src="' + require('@/assets/img/nonMotor.png') + '"'
    }
  },
  methods: {
    showDetail(item) {
      this.$emit('showDetail', item)
    },
    imgChoose(item) {
      // let index
      // if((index = this.selectedPassIds.indexOf(id)) > -1) {
      //   this.selectedPassIds.splice(index, 1)
      // } else {
      //   this.selectedPassIds.push(id)
      // }
      this.$emit('showDetail', item)
    }
  }
}
</script>

<style lang="less" scoped>
.passFaceImgBox {
  position: relative;
  width:120px;
  height:160px;
  background:white;
  box-shadow:0px 0px 10px 0px rgba(58,116,255,0.4);
  float:left;
  margin: 4px 10px 10px 5px;
  border:2px solid white;
  .passTime {
    height:17px;
    font-size:12px;
    font-weight:400;
    color:grey;
    line-height:17px;
    margin:15px 0 0 10px
  }
  .passEdit {
    float:left;
    margin:15px 0 0 15px;
    font-size:12px;
    color:#3a74ff;
    cursor:pointer;
    display:none;
  }
  &:hover {
    border:2px solid #3a74ff;
    .passTime {
      display: none;
    }
    .passEdit {
      display: block;
    }
  }
}
.passFaceImgBox.active {
  border: 2px solid #3a74ff;
}
// .passFaceImgBox .picChoose {
//   display: block;
//   position: absolute;
//   width:16px;
//   height:16px;
//   top: 0;
//   left: 0;
//   z-index: 0;
//   cursor: pointer;
// }
.passImgContainer {
  width:100px;
  height:100px;
  margin:0 auto
}

.passBodyImgBox {
  position: relative;
  width:180px;
  height:260px;
  background:white;
  box-shadow:0px 0px 10px 0px rgba(58,116,255,0.2);;
  float:left;
  margin: 4px 10px 10px 5px;
  border:2px solid #ebeef5;
  .passTime {
    height:17px;
    font-size:12px;
    font-weight:400;
    color:#303133;
    line-height:17px;
    margin:5px 0 0 8px
  }
  .passEdit {
    float:left;
    margin:15px 0 0 15px;
    font-size:12px;
    color:#3a74ff;
    cursor:pointer;
    display:none;
  }
  &:hover {
    border:2px solid #3a74ff;
    .passTime {
      display: none;
    }
    .passEdit {
      display: block;
    }
  }
}
.passBodyImgBox.active {
  border: 2px solid #3a74ff;
}
// .passBodyImgBox .picChoose {
//   display: block;
//   position: absolute;
//   width:16px;
//   height:16px;
//   top: 0;
//   left: 0;
//   z-index: 0;
//   cursor: pointer;
// }
.faceSize {
  width: 120px;
  height: 95px;
  cursor:pointer;
}
.bodySize {
  width: 180px;
  height: 180px;
  cursor:pointer;
}

.passColorInfo {
  background: #bbcffd;
  border-radius:4px;
  padding:1px 3px;
  margin-right: 3px;
}

.vehicleNo {
  height:12px;
  line-height:12px;
  color:white;
  padding-left:2px;
  border-radius:2px;
  background:rgb(78, 120, 186)
}
</style>
