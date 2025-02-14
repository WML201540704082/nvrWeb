 <template>
    <div
      style="background:#0e5688;"
      :style="{width: size.contentWidth - 300 + 'px', height: size.contentHeight - 110 + 'px'}"
    >
      <!-- 左侧目录 -->
      <left-menu :menuParams="menuParams" @getItem="getItem"></left-menu>
      <!-- 过滤条件 -->
      <filter-form
        :filterParams="filterParams"
        :filterType="passType"
        @filter="getPass"
        class="filter"
      ></filter-form>
      <!-- 通行记录 -->
      <record
        class="record"
        :passType="passType"
        :passData="passData"
        :selectedPassIds="selectedPassIds"
        @showInLib="showInLib"
        @showDetail="showDetail"
      ></record>
  
      <!-- 分页 -->
      <pagination :count="count" :filterParams="filterParams" @getPageNum="getPass"></pagination>
  
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
  import moment from "moment"
  import LeftMenu from "./components/leftMenu";
  import FilterForm from "./components/filterForm";
  import Record from "./components/record"; 
  import Detail from "./components/checkDetail";
  import Pagination from "./components/pagination";
  import { getAppMode } from './components/utils/appMode.js'
  import { passApi, pedestrianApi, vehicleApi, nonmotorApi } from "@/api/pass.js";
  import {
    commonList,
    faceMap,
    pedestrianMap,
    vehicleMap,
    vehicleList,
    nonmotorMap,
  } from "./components/utils/listMap.js";
  import { getBase64 } from "./components/utils/getBase64.js";
  
  export default {
    data() {
      return {
        size: {
          contentWidth: window.innerWidth,
          contentHeight: window.innerHeight
        },
        json,
        passData: [],
        menuParams: [],
        // 分页
        count: 0,
        APPMODE_CONFIG: {
          APP_MODE: '',
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
          hat: '',
          startTime: "",
          endTime: ""
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
          endTime: ""
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
          endTime: ""
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
          endTime: ""
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
          isLast: false
        },
        currentTotalNum: 0,
        // deviceModel: '',
      };
    },
    created() {
      getAppMode().then(res=>{
        this.APPMODE_CONFIG = res
        this.APPMODE_CONFIG.APP_MODE = res.APP_MODE
        this.APPMODE_CONFIG.APP_MODE == 'gs' ? this.passType = "vehicle" : ''
        this.$nextTick(()=>{
          this.getPass()
        })
      })
      this.menuParams = this.json.menuFullParams;
    },
    mounted() {
      
    },
    methods: {
      getPass(params = this.filterParams) {
        const _params = JSON.parse(JSON.stringify(params)); // 深拷贝
        _params.channelIDs = _params.channelIDs.toString();
        if (_params.signal) {
          _params.signal = _params.signal.toString();
        }
        if (this.passType === "face") {
          this.filterParams.pageNum = params.pageNum;
          passApi.Get(_params)
            .then(res => {
              this.passData = [];
                this.passData = res.data.data;
                this.currentTotalNum = this.passData.length;
                this.passData.forEach(item => {
                  item.detectTime = moment(item.detectTime).add(8, "hours").format("MM/DD HH:mm:ss")
                })
                this.count = res.data.count
            })
            .catch(err => console.log(err))
        } else if (this.passType === "pedestrian") {
          this.pedestrianParams.pageNum = params.pageNum;
          pedestrianApi.Get(_params)
            .then(res => {
              this.passData = [];
              this.$nextTick(() => {
                this.passData = res.data.data;
                this.currentTotalNum = this.passData.length;
                this.passData.forEach(item => {
                  item.detectTime = moment(item.detectTime).add(8, "hours").format("MM/DD HH:mm:ss");
  
                  if (item.upperColor === null) {
                    item.upperColor = '未知上身'
                  } else {
                    commonList.color.forEach(obj => {
                      if (item.upperColor[0] === obj.value) {
                        item.upperColor = `${obj.label}上身`
                      }
                    })
                  }
                  if (item.lowerColor === null) {
                    item.lowerColor = '未知下身'
                  } else {
                    commonList.color.forEach(obj => {
                      if (item.lowerColor[0] === obj.value) {
                        item.lowerColor = `${obj.label}下身`
                      }
                    })
                  }
  
                  item.gender = pedestrianMap.gender.get(item.gender)
                  item.age = pedestrianMap.age.get(item.age)
                });
                this.count = res.data.count;
              });
            })
            .catch(err => {
              console.log(err);
            });
        } else if (this.passType === "vehicle") {
          this.vehicleParams.pageNum = params.pageNum;
          vehicleApi.Get(_params).then(res => {
            this.passData = res.data.data;
            this.currentTotalNum = this.passData.length;
            this.passData.forEach(item => {
              vehicleList.plateColor.forEach(obj => {
                if (item.plateColor === obj.value) {
                  item.plateBackColor = obj.color
                }
              })
              item.vehicleID = item.vehicleID ? item.vehicleID : this.$t("unknown")
              item.detectTime = moment(item.detectTime).add(8, "hours").format("MM/DD HH:mm:ss")
            })
            this.count = res.data.count;
          })
          .catch(err => { console.log(err) })
        } else if (this.passType === "nonmotor") {
          this.nonmotorParams.pageNum = params.pageNum;
          nonmotorApi
            .Get(_params)
            .then(res => {
              this.passData = res.data.data;
              this.currentTotalNum = this.passData.length;
              this.passData.forEach(item => {
                item.detectTime = moment(item.detectTime)
                  .add(8, "hours")
                  .format("MM/DD HH:mm:ss");
  
                item.transportation = nonmotorMap.transportation.get(item.transportation)
                item.transportationColor = nonmotorMap.transportationColor.get(item.transportationColor)
              });
              this.count = res.data.count;
            })
            .catch(err => {
              console.log(err);
            });
        }
      },
      getItem(obj) {
        this.selectedPassIds = [];
        if(this.APPMODE_CONFIG.APP_MODE != 'gs') {
          if (obj.index == 1) {
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
            hat: '',
            startTime: "",
            endTime: ""
          };
          this.getPass();
          } else if (obj.index == 2) {
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
              endTime: ""
            };
            this.getPass();
          } else if (obj.index == 3) {
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
          } else if (obj.index == 4) {
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
              endTime: ""
            };
            this.getPass();
          }
        } else {
          if (obj.index == 1) {
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
          } else if (obj.index == 2) {
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
              endTime: ""
            };
            this.getPass();
          }
        }
      },
      // 入库
      showInLib(item) {
        this.faceForm.faceImagePath = item.faceImagePath; // 显示照片
        this.dialogInLibVisible = true;
  
        const That = this;
        var image = new Image();
        image.src = item.faceImagePath;
        image.onload = function() {
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
      // 查看详情
      showDetail(item) {
        this.detail = {};
        if (this.passType === "face") {
          passApi.GetDet(item.id).then(res => {
            this.detail = res.data.data;
            this.$refs['detail'].init(this.detail)
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
            Object.keys(faceMap).forEach(item => {
              if (this.detail[item] instanceof Array) { // 数组字段
                this.detail[item].forEach((v, index) => this.detail[item][index] = faceMap[item].get(v))
              } else {
                this.detail[item] = faceMap[item].get(this.detail[item]) // 单值字段
              }
            })
            // 关联
            if (this.detail.refType === 1) {
              pedestrianApi.GetDet(item.id).then(res => {
                this.detail.ralatedPath = res.data.data.cropImagePath;
              });
            }
            this.detail.carouselList = [];
            if (this.detail.refPedestrians) {
              this.detail.refPedestrians.forEach(item => {
                this.detail.carouselList.push(item.cropImagePath);
              });
            }
            if (this.detail.refVehicles) {
              this.detail.refVehicles.forEach(item => {
                this.detail.carouselList.push(item.cropImagePath);
              });
            }
            if (this.detail.refNonmotors) {
              this.detail.refNonmotors.forEach(item => {
                this.detail.carouselList.push(item.cropImagePath);
              });
            }
          });
        } else if (this.passType === "pedestrian") {
          pedestrianApi.GetDet(item.id).then(res => {
            this.detail = res.data.data;
            this.$refs['detail'].init(this.detail)
            this.detail.detectTime = moment(this.detail.detectTime).add(8, "hours").format("YYYY-MM-DD HH:mm:ss");
            this.dialogDetailVisible = true;
            this.passData.forEach((item, index) => {
              if (item.id === this.detail.id) {
                this.currentIndex = index;
                this.checkPage();
              }
            });
            // 全属性
            Object.keys(pedestrianMap).forEach(item => {
              if (this.detail[item] instanceof Array) { // 数组字段
                this.detail[item].forEach((v, index) => this.detail[item][index] = pedestrianMap[item].get(v))
              } else {
                this.detail[item] = pedestrianMap[item].get(this.detail[item]) // 单值字段
              }
            })
            // 关联
            this.detail.carouselList = [];
            if (this.detail.refPassed) {
              this.detail.refPassed.forEach(item => {
                this.detail.carouselList.push(item.faceImagePath);
              });
            }
          });
        } else if (this.passType === "vehicle") {
          vehicleApi.GetDet(item.id).then(res => {
            this.detail = res.data.data;
            this.$refs['detail'].init(this.detail)
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
            Object.keys(vehicleMap).forEach(item => {
              if (this.detail[item] instanceof Array) { // 数组字段
                this.detail[item].forEach((v, index) => this.detail[item][index] = vehicleMap[item].get(v))
              } else {
                this.detail[item] = vehicleMap[item].get(this.detail[item]) // 单值字段
              }
            })
            // 关联
            this.detail.carouselList = [];
            if (this.detail.refPassed) {
              this.detail.refPassed.forEach(item => {
                this.detail.carouselList.push(item.faceImagePath);
              });
            }
          });
        } else if (this.passType === "nonmotor") {
          nonmotorApi.GetDet(item.id).then(res => {
            this.detail = res.data.data;
            this.$refs['detail'].init(this.detail)
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
            Object.keys(nonmotorMap).forEach(item => {
              if (this.detail[item] instanceof Array) { // 数组字段
                this.detail[item].forEach((v, index) => this.detail[item][index] = nonmotorMap[item].get(v))
              } else {
                this.detail[item] = nonmotorMap[item].get(this.detail[item]) // 单值字段
              }
            })
            // 关联
            this.detail.carouselList = [];
            if (this.detail.refPassed) {
              this.detail.refPassed.forEach(item => {
                this.detail.carouselList.push(item.faceImagePath);
              });
            }
          });
        }
      },
      // 查看详情上下翻页
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
      }
    },
    components: {
      LeftMenu,
      FilterForm,
      Record,
      Detail,
      Pagination
    }
  };
  </script>
  
  <style lang="less" scoped>
  .mainBox {
    position: absolute;
    z-index: 0;
    min-width: 1056px;
    background: #ffffff;
    // height: calc(100vh - 235px)!important;
  }
  .mainBox_2 {
    position: absolute;
    z-index: 0;
    min-width: 1056px;
    background: #ffffff;
    // height: calc(100vh - 280px)!important;
  }
  .filter {
    margin: 3px 20px 0 144px;
    background: #0e5688;
  }
  .export {
    margin: 120px 0 0 144px;
  }
  .record {
    margin: 100px 0 50px 85px;
    background: #0e5688;
    overflow: auto;
    padding: 15px;
  }
  </style>
  