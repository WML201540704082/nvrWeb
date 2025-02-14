<template>
  <div
    class="pass-record"
    :style="{
      width: size.contentWidth - 195 + 'px',
      height: size.contentHeight - 110 + 'px',
    }"
  >
    <!-- Tab -->
    <el-tabs class="navbar" v-model="passType" @tab-click="getItem" type="card">
      <el-tab-pane :label="item.label" :name="item.label" :key="item.index" v-for="item in menuParams">
        <span slot="label" class="nav-item">
          <svg-icon class="icon iconfont" :icon="item.label"></svg-icon> 
          <div class="title">{{ $t(item.label) }}</div>
        </span>
      </el-tab-pane>
    </el-tabs>
    <face 
      ref="face"
      v-show="passType == 'face'"
      :filterParams="filterParams"
      @onFetch="getPass"
      :passData="passData"
      :selectedPassIds="selectedPassIds" 
      @onShowDetailDialog="showDetail"
      :count="count"
    />
    <pedestrian 
      ref="pedestrian"
      v-show="passType == 'pedestrian'"
      :filterParams="pedestrianParams"
      @onFetch="getPass"
      :passData="passData"
      :selectedPassIds="selectedPassIds" 
      @onShowDetailDialog="showDetail"
      :count="count"
    />
    <vehicle 
      ref="vehicle"
      v-show="passType == 'vehicle'"
      :filterParams="vehicleParams"
      @onFetch="getPass"
      :passData="passData"
      :selectedPassIds="selectedPassIds" 
      @onShowDetailDialog="showDetail"
      :count="count"
    />
    <nonmotor 
      ref="nonmotor"
      v-show="passType == 'nonmotor'"
      :filterParams="nonmotorParams"
      @onFetch="getPass"
      :passData="passData"
      :selectedPassIds="selectedPassIds" 
      @onShowDetailDialog="showDetail"
      :count="count"
    />
    <!-- 过滤条件 -->
    <!-- <filter-form
      :filterParams="filterParams"
      :filterType="passType"
      @filter="getPass"
      class="filter"
    ></filter-form> -->
    <!-- 通行记录 -->
    <!-- <record
      class="record"
      :passType="passType"
      :passData="passData"
      :selectedPassIds="selectedPassIds"
      @showInLib="showInLib"
      @showDetail="showDetail"
    ></record> -->

    <!-- 分页 -->
    <!-- <pagination
      :count="count"
      :filterParams="filterParams"
      @getPageNum="getPass"
    ></pagination> -->

    <!-- 查看详情 -->
    <detail
      ref="detail"
      :detail="detail"
      :dialogDetailVisible="dialogDetailVisible"
      :detailPage="detailPage"
      :passType="passType"
      @closeDetail="closeDetail"
      @getPre="getPre"
      @getNext="getNext"
    ></detail>
  </div>
</template>

<script>
import json from "./config";
import moment from "moment";
import Face from './views/face.vue';
import Pedestrian from './views/pedestrian.vue';
import Vehicle from './views/vehicle.vue';
import Nonmotor from './views/nonmotor.vue';
// import FilterForm from "./components/filterForm";
// import Record from "./components/record";
// import Pagination from "./components/pagination";
import Detail from "./components/checkDetail";
import { getAppMode } from "@/utils/appMode.js";
import { passApi, pedestrianApi, vehicleApi, nonmotorApi } from "@/api/pass.js";
import {
  commonList,
  faceMap,
  pedestrianMap,
  vehicleMap,
  vehicleList,
  nonmotorMap,
} from "./_utils/listMap.js";
import { getBase64 } from "./_utils";

export default {
  inject: ["size"],
  data() {
    return {
      json,
      passData: [],
      menuParams: [],
      // 分页
      count: 0,
      APPMODE_CONFIG: {
        APP_MODE: "",
      },
      // Type face/pedestrian/vehicle/nonmotor
      filterParams: {
        pageSize: 60,
        pageNum: 1,
        time: "all",
        channelIDs: [],
        mask: "",
        gender: "",
        glass: "",
        hat: "",
        startTime: "",
        endTime: "",
      },
      pedestrianParams: {
        pageSize: 60,
        pageNum: 1,
        time: "all",
        channelIDs: [],
        gender: "",
        age: "",
        upperColor: "",
        lowerColor: "",
        startTime: "",
        endTime: "",
      },
      vehicleParams: {
        pageSize: 60,
        pageNum: 1,
        time: "all",
        channelIDs: [],
        type: "",
        // 品牌 make-model-year
        make: "",
        model: "",
        // year: '',
        carColor: "",
        plateColor: "",
        marker: "",
        pose: "",
        startTime: "",
        endTime: "",
      },
      nonmotorParams: {
        pageSize: 60,
        pageNum: 1,
        time: "all",
        channelIDs: [],
        transportation: "",
        transportationColor: "",
        attitude: "",
        startTime: "",
        endTime: "",
      },
      passType: "face",
      // 快速入库
      selectedPassIds: [],
      dialogInLibVisible: false,
      faceForm: {},
      // 查看详情
      dialogDetailVisible: false,
      detail: {},
      currentIndex: null,
      detailPage: {
        isFirst: false,
        isLast: false,
      },
      currentTotalNum: 0,
      // deviceModel: '',
    };
  },
  created() {
    getAppMode().then((res) => {
      this.APPMODE_CONFIG = res;
      this.APPMODE_CONFIG.APP_MODE = res.APP_MODE;
      this.APPMODE_CONFIG.APP_MODE == "gs" ? (this.passType = "vehicle") : "";
      this.$nextTick(() => {
        this.getPass();
      });
    });
    this.menuParams = this.json.menuFullParams;
  },
  mounted() {},
  methods: {
    /** 获取通行记录 */
    getPass(params = this.filterParams) {
      const _params = JSON.parse(JSON.stringify(params)); // 深拷贝
      _params.channelIDs = _params.channelIDs.toString();
      if (_params.signal) {
        _params.signal = _params.signal.toString();
      }
      if (this.passType === "face") {
        this.filterParams.pageNum = params.pageNum;
        passApi
          .Get(_params)
          .then((res) => {
            this.passData = [];
            this.passData = res.data.data;
            this.currentTotalNum = this.passData.length;
            this.passData.forEach((item) => {
              item.detectTime = moment(item.detectTime)
                .add(8, "hours")
                .format("MM/DD HH:mm:ss");
            });
            this.count = res.data.count;
          })
          .catch((err) => console.log(err));
      } else if (this.passType === "pedestrian") {
        this.pedestrianParams.pageNum = params.pageNum;
        pedestrianApi
          .Get(_params)
          .then((res) => {
            this.passData = [];
            this.$nextTick(() => {
              this.passData = res.data.data;
              this.currentTotalNum = this.passData.length;
              this.passData.forEach((item) => {
                item.detectTime = moment(item.detectTime)
                  .add(8, "hours")
                  .format("MM/DD HH:mm:ss");

                if (item.upperColor === null) {
                  item.upperColor = "未知上身";
                } else {
                  commonList.color.forEach((obj) => {
                    if (item.upperColor[0] === obj.value) {
                      item.upperColor = `${obj.label}上身`;
                    }
                  });
                }
                if (item.lowerColor === null) {
                  item.lowerColor = "未知下身";
                } else {
                  commonList.color.forEach((obj) => {
                    if (item.lowerColor[0] === obj.value) {
                      item.lowerColor = `${obj.label}下身`;
                    }
                  });
                }

                item.gender = pedestrianMap.gender.get(item.gender);
                item.age = pedestrianMap.age.get(item.age);
              });
              this.count = res.data.count;
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (this.passType === "vehicle") {
        this.vehicleParams.pageNum = params.pageNum;
        vehicleApi
          .Get(_params)
          .then((res) => {
            this.passData = res.data.data;
            this.currentTotalNum = this.passData.length;
            this.passData.forEach((item) => {
              vehicleList.plateColor.forEach((obj) => {
                if (item.plateColor === obj.value) {
                  item.plateBackColor = obj.color;
                }
              });
              item.vehicleID = item.vehicleID
                ? item.vehicleID
                : this.$t("unknown");
              item.detectTime = moment(item.detectTime)
                .add(8, "hours")
                .format("MM/DD HH:mm:ss");
            });
            this.count = res.data.count;
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (this.passType === "nonmotor") {
        this.nonmotorParams.pageNum = params.pageNum;
        nonmotorApi
          .Get(_params)
          .then((res) => {
            this.passData = res.data.data;
            this.currentTotalNum = this.passData.length;
            this.passData.forEach((item) => {
              item.detectTime = moment(item.detectTime)
                .add(8, "hours")
                .format("MM/DD HH:mm:ss");

              item.transportation = nonmotorMap.transportation.get(
                item.transportation
              );
              item.transportationColor = nonmotorMap.transportationColor.get(
                item.transportationColor
              );
            });
            this.count = res.data.count;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    /** 初始化所选Tab页筛选条件 */
    getItem(obj) {
      this.selectedPassIds = [];
      if (this.APPMODE_CONFIG.APP_MODE != "gs") {
        if (obj.name == "face") {
          this.passData = [];
          this.passType = "face";
          this.filterParams = {
            pageSize: 60,
            pageNum: 1,
            time: "all",
            channelIDs: [],
            mask: "",
            gender: "",
            glass: "",
            hat: "",
            startTime: "",
            endTime: "",
          };
          this.getPass();
        } else if (obj.name == "pedestrian") {
          this.passData = [];
          this.passType = "pedestrian";
          this.filterParams = {
            pageSize: 60,
            pageNum: 1,
            time: "all",
            channelIDs: [],
            gender: "",
            age: "",
            upperColor: "",
            lowerColor: "",
            startTime: "",
            endTime: "",
          };
          this.getPass();
        } else if (obj.name == "vehicle") {
          this.passData = [];
          this.passType = "vehicle";
          this.filterParams = {
            pageSize: 60,
            pageNum: 1,
            time: "all",
            channelIDs: [],
            vehicleID: "",
            type: "",
            // 品牌 make-model-year
            make: "",
            model: "",
            // year: '',
            carColor: "",
            plateColor: "",
            marker: "",
            pose: "",
            startTime: "",
            endTime: "",
            // 未上传的
            // uploaded: 0
          };

          this.getPass();
        } else if (obj.name == "nonmotor") {
          this.passData = [];
          this.passType = "nonmotor";
          this.filterParams = {
            pageSize: 60,
            pageNum: 1,
            time: "all",
            channelIDs: [],
            transportation: "",
            transportationColor: "",
            attitude: "",
            startTime: "",
            endTime: "",
          };
          this.getPass();
        }
      } else {
        if (obj.name == "vehicle") {
          this.passData = [];
          this.passType = "vehicle";
          this.filterParams = {
            pageSize: 60,
            pageNum: 1,
            time: "all",
            channelIDs: [],
            vehicleID: "",
            type: "",
            // 品牌 make-model-year
            make: "",
            model: "",
            // year: '',
            carColor: "",
            plateColor: "",
            marker: "",
            pose: "",
            startTime: "",
            endTime: "",
            // 未上传的
            // uploaded: 0
          };
          this.getPass();
        } else if (obj.name == "nonmotor") {
          this.passData = [];
          this.passType = "nonmotor";
          this.filterParams = {
            pageSize: 60,
            pageNum: 1,
            time: "all",
            channelIDs: [],
            transportation: "",
            transportationColor: "",
            attitude: "",
            startTime: "",
            endTime: "",
          };
          this.getPass();
        }
      }
      this.$refs.face.clearFilter();
      this.$refs.pedestrian.clearFilter();
      this.$refs.nonmotor.clearFilter();
      this.$refs.vehicle.clearFilter();
    },
    /** 入库 */
    showInLib(item) {
      this.faceForm.faceImagePath = item.faceImagePath; // 显示照片
      this.dialogInLibVisible = true;

      const That = this;
      var image = new Image();
      image.src = item.faceImagePath;
      image.onload = function () {
        var ext = item.faceImagePath.substring(
          item.faceImagePath.lastIndexOf(".") + 1
        );
        var base64 = getBase64(image, ext);
        That.faceForm.imageData = base64.substring(23);
      };
    },
    closeDialog() {
      this.dialogInLibVisible = false;
    },
    /** 查看详情 */
    showDetail(item) {
      this.detail = {};
      if (this.passType === "face") {
        passApi.GetDet(item.id).then((res) => {
          this.detail = res.data.data;
          this.$refs["detail"].init(this.detail);
          this.detail.detectTime = moment(this.detail.detectTime)
            .add(8, "hours")
            .format("YYYY-MM-DD HH:mm:ss");
          this.dialogDetailVisible = true;
          this.passData.forEach((item, index) => {
            if (item.id === this.detail.id) {
              this.currentIndex = index;
              this.checkPage();
            }
          });
          // 全属性
          Object.keys(faceMap).forEach((item) => {
            if (this.detail[item] instanceof Array) {
              // 数组字段
              this.detail[item].forEach(
                (v, index) => (this.detail[item][index] = faceMap[item].get(v))
              );
            } else {
              this.detail[item] = faceMap[item].get(this.detail[item]); // 单值字段
            }
          });
          // 关联
          if (this.detail.refType === 1) {
            pedestrianApi.GetDet(item.id).then((res) => {
              this.detail.ralatedPath = res.data.data.cropImagePath;
            });
          }
          this.detail.carouselList = [];
          if (this.detail.refPedestrians) {
            this.detail.refPedestrians.forEach((item) => {
              this.detail.carouselList.push(item.cropImagePath);
            });
          }
          if (this.detail.refVehicles) {
            this.detail.refVehicles.forEach((item) => {
              this.detail.carouselList.push(item.cropImagePath);
            });
          }
          if (this.detail.refNonmotors) {
            this.detail.refNonmotors.forEach((item) => {
              this.detail.carouselList.push(item.cropImagePath);
            });
          }
        });
      } else if (this.passType === "pedestrian") {
        pedestrianApi.GetDet(item.id).then((res) => {
          this.detail = res.data.data;
          this.$refs["detail"].init(this.detail);
          this.detail.detectTime = moment(this.detail.detectTime)
            .add(8, "hours")
            .format("YYYY-MM-DD HH:mm:ss");
          this.dialogDetailVisible = true;
          this.passData.forEach((item, index) => {
            if (item.id === this.detail.id) {
              this.currentIndex = index;
              this.checkPage();
            }
          });
          // 全属性
          Object.keys(pedestrianMap).forEach((item) => {
            if (this.detail[item] instanceof Array) {
              // 数组字段
              this.detail[item].forEach(
                (v, index) =>
                  (this.detail[item][index] = pedestrianMap[item].get(v))
              );
            } else {
              this.detail[item] = pedestrianMap[item].get(this.detail[item]); // 单值字段
            }
          });
          // 关联
          this.detail.carouselList = [];
          if (this.detail.refPassed) {
            this.detail.refPassed.forEach((item) => {
              this.detail.carouselList.push(item.faceImagePath);
            });
          }
        });
      } else if (this.passType === "vehicle") {
        vehicleApi.GetDet(item.id).then((res) => {
          this.detail = res.data.data;
          this.$refs["detail"].init(this.detail);
          this.detail.detectTime = moment(this.detail.detectTime)
            .add(8, "hours")
            .format("YYYY-MM-DD HH:mm:ss");
          this.detail.vehicleID = this.detail.vehicleID
            ? this.detail.vehicleID
            : this.$t("unknown");
          this.dialogDetailVisible = true;
          this.passData.forEach((item, index) => {
            if (item.id === this.detail.id) {
              this.currentIndex = index;
              this.checkPage();
            }
          });
          // 全属性
          Object.keys(vehicleMap).forEach((item) => {
            if (this.detail[item] instanceof Array) {
              // 数组字段
              this.detail[item].forEach(
                (v, index) =>
                  (this.detail[item][index] = vehicleMap[item].get(v))
              );
            } else {
              this.detail[item] = vehicleMap[item].get(this.detail[item]); // 单值字段
            }
          });
          // 关联
          this.detail.carouselList = [];
          if (this.detail.refPassed) {
            this.detail.refPassed.forEach((item) => {
              this.detail.carouselList.push(item.faceImagePath);
            });
          }
        });
      } else if (this.passType === "nonmotor") {
        nonmotorApi.GetDet(item.id).then((res) => {
          this.detail = res.data.data;
          this.$refs["detail"].init(this.detail);
          this.detail.detectTime = moment(this.detail.detectTime)
            .add(8, "hours")
            .format("YYYY-MM-DD HH:mm:ss");
          this.dialogDetailVisible = true;
          this.passData.forEach((item, index) => {
            if (item.id === this.detail.id) {
              this.currentIndex = index;
              this.checkPage();
            }
          });

          // 全属性
          Object.keys(nonmotorMap).forEach((item) => {
            if (this.detail[item] instanceof Array) {
              // 数组字段
              this.detail[item].forEach(
                (v, index) =>
                  (this.detail[item][index] = nonmotorMap[item].get(v))
              );
            } else {
              this.detail[item] = nonmotorMap[item].get(this.detail[item]); // 单值字段
            }
          });
          // 关联
          this.detail.carouselList = [];
          if (this.detail.refPassed) {
            this.detail.refPassed.forEach((item) => {
              this.detail.carouselList.push(item.faceImagePath);
            });
          }
        });
      }
    },
    /** 查看详情上下翻页*/
    getPre() {
      if (this.currentIndex !== 0) {
        this.currentIndex = this.currentIndex - 1;
        this.showDetail(this.passData[this.currentIndex]);
        // this.detail = this.passData[this.currentIndex]
      }
      this.checkPage();
    },
    getNext() {
      if (this.currentIndex !== this.currentTotalNum - 1) {
        this.currentIndex = this.currentIndex + 1;
        this.showDetail(this.passData[this.currentIndex]);
        // this.detail = this.passData[this.currentIndex]
      }
      this.checkPage();
    },
    checkPage() {
      this.detailPage.isFirst = this.currentIndex === 0 ? true : false;
      this.detailPage.isLast =
        this.currentIndex === this.currentTotalNum - 1 ? true : false;
    },
    closeDetail() {
      this.dialogDetailVisible = false;
    },
  },
  components: {
    Detail,
    // FilterForm,
    // Record,
    // Pagination,
    Face,
    Pedestrian,
    Vehicle,
    Nonmotor
  },
};
</script>

<style lang="less">
#systemBox .pass-record {
  margin: -20px;
  margin-top: 0px;
  background: rgb(235, 238, 242);
  min-width: 1200px;
  .mainBox {
    position: absolute;
    z-index: 0;
    min-width: 720px;
    background: #ffffff;
    // height: calc(100vh - 235px)!important;
  }

  .mainBox_2 {
    position: absolute;
    z-index: 0;
    min-width: 720px;
    background: #ffffff;
    // height: calc(100vh - 280px)!important;
  }

  .navbar {
    background: white;
    padding-left: 20px;
    .el-tabs__item.is-active {
      background: #2178C8;
      color: #606266;
      .nav-item {
        color: white;
      }
    }

    .nav-item {
      font-size: 14px;
      font-weight: 400;
      line-height: 30px;
      padding: 5px 5px 0;
      display: flex;
      align-items: center;
      .icon {
        width: 16px;
        height: 16px;
      }
      .title {
        padding: 0 5px;
      }
    }
  }

  // face 
  .algo::-webkit-scrollbar {
    display: none;
  }

  .filterBox {
    scrollbar-width: none;
    color: #000;
    .el-col {
      background: white;
    }
  }

  // 过滤查询
  .searchTitle {
    height: 30px;
    font-size: 14px;
    font-weight: 400;
    color: #909399;
    line-height: 30px;
  }

  .searchFont {
    height: 17px;
    font-size: 12px;
    font-weight: 400;
    color: #ffffff;
    line-height: 17px;
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
    font-size: 12px;
    margin-right: 4px;
    height: 11px
  }

  .spanBox {
    height: 30px;
    line-height: 30px;
  }

  .inputBox {
    height: 24px;
  }

  .cascaderBox {
    margin-top: -5px;
    width: 260px;
  }

  .filterItem {
    height: 30px;
    white-space: nowrap;
    margin-bottom: 10px
  }

  .btnExport {
    position: absolute;
    top: 20px;
    right: 115px
  }

  .btnItem {
    position: absolute;
    top: 20px;
    right: 12px;
    cursor: pointer;
    background: transparent;
    border: 1px solid #409eff;
    color: #409eff;
    width: 90px;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
  }

  .btnItem:hover {
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
  }

  .cancelBtn {
    margin: 8px 12px 0px 116px;
  }

  .save.active {
    cursor: not-allowed;
    background: grey;
    border: none;
  }

  .searchButton {
    width: 45px;
    height: 25px;
    box-shadow: rgb(3, 19, 29) 2px 2px 4px;
    background-color: #83bce4;
    border: #0e5688;
    border-radius: 3px;
    margin-right: 3px;
  }

  .searchButton:hover {
    cursor: pointer;
    background-color: rgb(0, 136, 255)
  }

  .searchButton.active {
    background-color: rgb(0, 136, 255)
  }

  //卡片部分
  .passFaceImgBox {
    position: relative;
    width: 150px;
    height: 200px;
    background: white;
    box-shadow: 0px 0px 10px 0px rgba(58, 116, 255, 0.4);
    float: left;
    margin: 4px 10px 10px 5px;
    border: 2px solid white;

    .passTime {
      height: 17px;
      font-size: 12px;
      font-weight: 400;
      color: grey;
      line-height: 17px;
      margin: 5px 0 0 10px
      
    }
    .mt5 {
      display: flex;
      align-items: center;
      span {
        margin-left: 4px;
      }
    }

    .passEdit {
      float: left;
      margin: 5px 0 0 15px;
      font-size: 12px;
      color: #3a74ff;
      cursor: pointer;
      display: none;

      height: 35px;
      width: 100%;
      margin: 0;
      padding: 0;
      align-items: center;
      justify-content: center
    }

    &:hover {
      border: 2px solid #3a74ff;

      .passTime {
        display: none;
      }

      .passEdit {
        display: flex;
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
    width: 100px;
    height: 100px;
    margin: 0 auto
  }

  .passBodyImgBox {
    position: relative;
    width: 180px;
    height: 260px;
    background: white;
    box-shadow: 0px 0px 10px 0px rgba(58, 116, 255, 0.2);
    ;
    float: left;
    margin: 4px 10px 10px 5px;
    border: 2px solid #ebeef5;

    .passTime {
      height: 17px;
      font-size: 12px;
      font-weight: 400;
      color: grey;
      line-height: 17px;
      margin: 5px 0 0 8px
    }

    .mt5 {
      display: flex;
      align-items: center;
      span {
        margin-left: 4px;
      }
    }

    .passEdit {
      float: left;
      margin: 15px 0 0 15px;
      font-size: 12px;
      color: #3a74ff;
      cursor: pointer;
      display: none;
      width: 100%;
      height: 60px;
      margin: 0;
      padding: 0;
      align-items: center;
      justify-content: center;
    }

    &:hover {
      border: 2px solid #3a74ff;

      .passTime {
        display: none;
      }

      .passEdit {
        display: flex;
      }
    }
  }

  .passBodyImgBox.active {
    border: 2px solid #3a74ff;
  }

  .faceSize {
    width: 150px;
    height: 150px;
    cursor: pointer;
  }

  .bodySize {
    width: 180px;
    height: 180px;
    cursor: pointer;
  }

  .passColorInfo {
    padding: 1px 3px;
    margin-right: 5px;
    margin-bottom: 5px;
    color: #409eff;
    background: #ecf5ff;
  }

  .vehicleNo {
    height: 12px;
    line-height: 12px;
    color: white;
    padding-left: 2px;
    border-radius: 2px;
    background: rgb(78, 120, 186)
  }

  .filter {
    margin: 3px 20px 0 50px;
    background: #0e5688;
  }

  .record {
    margin: 110px 0 50px 0px;
    // background: #0e5688;
    overflow: auto;
    padding: 15px;
  }

  .pagiBox {
    position: fixed;
    bottom: 0;
    height: 12px;
    background: white;
    // color: #ffffff
  }

  .channel-select {
    .el-select__tags {
      white-space: nowrap !important;
      overflow: hidden !important;
      -ms-flex-wrap: unset !important;
      flex-wrap: unset !important;
    }
  }
}
</style>
