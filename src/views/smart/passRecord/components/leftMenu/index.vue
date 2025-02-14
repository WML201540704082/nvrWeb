<!--
 * @Author: Stephen
 * @Date: 2019-11-19 10:48:56
 * @LastEditors: Stephen
 * @LastEditTime: 2019-12-03 10:54:48
 -->
<template>
  <div class="leftBox" :style="{height: size.contentHeight - 100 + 'px'}">
    <div class="leftContainer" v-if="!isSys">
      <div v-for="item of menuParams"
           :key="item.index"
      >
        <div class="leftFontContainer"
             :class="{active: activeIndex === item.index}"
             @click="menuBtn(item)"
        >
          <svg-icon :icon="item.label === 'face' ? 'face' : item.label === 'pedestrian' ? 'pedestrian' : 
                    item.label === 'vehicle' ? 'vehicle' : 'nonmotor'" class="iconfont leftFont leftIcon"></svg-icon>
          <div class="leftFont">{{$t(item.label)}}</div>
        </div>
      </div>
    </div>
    <!-- 系统管理 -->
    <div class="leftContainer" v-else>
      <div v-for="item of (algoView ? json.sysMenu_nh : json.sysMenu) "
          :key="item.index"
          class="leftFontContainer"
          :class="{active: activeIndex === item.index}"
          @click="menuBtn(item)"
      >
        <i class="iconfont leftFont leftIcon" v-html="item.icon"></i>
        <span class="leftFont">{{$t(item.label)}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import json from './config'
import { getAppMode } from '../utils/appMode.js'
export default {
  props: {
    menuParams: {
      type: Array,
      required: false
    }
  },
  data() {
    return {
      size: {
        contentWidth: window.innerWidth,
        contentHeight: window.innerHeight
      },
      json,
      algoView: this.$store.getters.getAlgo ? true : false,
      isSys: location.pathname.indexOf('system') > -1,
      activeIndex: '1'
    }
  },
  mounted () {
    this.getAppMode()
    this.getSysAct()
  },
  methods: {
    async getAppMode() {
      const res = await getAppMode()
      this.algoView = res.Settings.algoView
    },
    getSysAct () {
      if (this.isSys) {
        const name = this.$route.name
        switch (name) {
          case 'Net':
            this.activeIndex = '1'
            break;
          case 'Channel':
            this.activeIndex = '2'
            break;
          // case 'Task':
          //   this.activeIndex = '3'
          //   break;
          case 'Algorithm':
            this.activeIndex = '8'
            break;
          case 'AppSet':
            this.activeIndex = '3'
            break;
          case 'Setting':
            this.activeIndex = '4'
            break;
          case 'Time':
            this.activeIndex = '5'
            break;
          case 'Maintain':
            this.activeIndex = '6'
            break;
          case 'Device':
            this.activeIndex = '7'
            break;
        }
      }
    },
    menuBtn (obj) {
      this.isSys ? this.$router.push({name: obj.path}) : this.activeIndex = obj.index
      if (!this.isSys) {
        if (obj.type === 'pass' || obj.type === 'alert') {
          this.$emit('getItem', obj)
        } else {
          // 人脸对比
          if (obj.label.indexOf("faceContrast") > -1) {
            this.$emit('getFaceMenu', obj)
          }
          this.$emit('getLibMenu', {}, obj.index)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.leftBox {
  width:124px;
  // background:#0e5688;
  position:absolute;
  top:calc(9%);
  // left:calc(12.3%);
  z-index:1;
  overflow-y: auto;
}
.leftContainer {
  margin:15px 5px 0px 5px;
}
.leftFontContainer {
  width:114px;
  height:40px;
  line-height: 40px;
  margin-bottom:3px;
  color:#626262;
  display: flex;
}
.leftFontContainer:hover {
  color:#000000;
  cursor:pointer;
}
.leftFontContainer.active {
  color:#000000;
  background:rgba(58, 116, 255, 0.2);
  border-radius: 6px;
  // box-shadow: inset 2px 2px 4px rgb(3 19 29 / 56%), inset -2px -2px 3px #83bce4 !important;
}
.leftFont {
  font-size:14px;
  font-weight:400;
  line-height:30px;
  padding: 5px 5px 0;
  // color: #626262!important;
}
.leftFont:hover {
  cursor:pointer;
  padding-top: -12px;
}
.leftIcon {
  margin:5px 1px 0 12px;
}
</style>
