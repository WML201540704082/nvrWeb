<template>
  <div
    class="system-lib"
    :style="{
      width: size.contentWidth - 235 + 'px',
      height: size.contentHeight - 110 + 'px',
    }"
  >
    <el-tabs class="navbar" v-model="libType" @tab-click="getItem" type="card">
      <el-tab-pane v-for="item in menuParams" :label="item.label" :name="Number(item.index)" :key="item.index" >
        <span slot="label" class="nav-item">
          <svg-icon class="icon iconfont" :icon="item.label"></svg-icon> 
          <div class="title">{{ $t(item.label) }}</div>
        </span>
      </el-tab-pane>
    </el-tabs>
    <!-- 子目录 -->
    <div class="rowStart">
      <lib-menu
                :libMenu="libMenu"
                :libType="libType"
                :activeLibIndex="activeLibIndex"
                @getActiveLibIndex="getActiveLibIndex"
                @getLibInfo="getLibInfo"
                @getLibMenu="getItem"
      ></lib-menu>
      <div class="lib_con" v-if="libInfo.name">
        <div class="title_con">
          <div class="libManage" style="color: #333">{{libType == 1 ? $t('faceLibManage') : $t('vehicleLibManage')}}</div>
          <!-- 库信息 -->
          <div style="margin-top:20px;" class="rowStart">
            <span class="libNameFont libNameTitle">{{$t('libName')}}</span>
            <el-tooltip :content="libInfo.name" placement="top">
              <div class="libNameFont libName ellipsis">{{libInfo.name}}</div>
            </el-tooltip>
            <span class="libNameFont libTimeTitle">{{$t('createTime')}}</span>
            <span class="libNameFont libTime">{{libInfo.createdAt}}</span>
            <span class="libNameFont remarkTitle">{{$t('remark')}}</span>
            <el-tooltip :content="libInfo.description" placement="top">
              <span class="libNameFont libDes ellipsis">{{libInfo.description}}</span>
            </el-tooltip>
            <br/>
          </div>
        </div>
        <!-- 人脸列表 -->
        <record :libType="libType"
                :faceData="faceData"
                :vehicleData="vehicleData"
                :libMenu="libMenu"
                :currentLibId="currentLibId"

                :filterParams="filterParams"
                @getSearchVal="getSearchVal"
                @getFace="getFace"
                @getVehicle="getVehicle"
        ></record>

        <!-- 分页 -->
        <pagination :count="count"
                    style="margin-left: 300px;left: 0;"
                    :filterParams="filterParams"
                    @getPageNum="getRecord"
        ></pagination>
      </div>
      <div class="no-con-data" v-else>暂无数据</div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import LeftMenu from "./utils/leftMenu"
import LibMenu from "./libMenu"
import Record from "./record"
import Pagination from './utils/index.vue'
import { faceRepoApi, vehicleRepoApi, faceApi, vehicleApi } from '@/api/lib'
import json from './config'
export default {
  name: 'Lib',
  data() {
    return {
      size: {
        contentWidth: window.innerWidth,
        contentHeight: window.innerHeight
      },
      json,
      libType: 1,
      menuParams: [],
      // lib库
      libMenu: [],
      activeLibIndex: 1,
      // 右lib
      libInfo: {},
      currentLibId: null,
      // 右face
      searchVal: '',
      filterParams: {
        pageSize: 28,
        pageNum: 1
      },
      faceData: [],
      vehicleData: [],
      count: 0,
      // deviceModel: '',
      // APPMODE_CONFIG: {
      //   APP_MODE: '',
      // },
    }
  },
  created() {
    this.menuParams = this.json.menuFullParams;
  },
  mounted () {
    // this.getLibMenu({}, 1)
    this.libType = 1
    this.getItem({})
  },
  watch: {
    libType(val) {
      this.getRecord()
    }
  },
  methods: {
    getItem(item = {}) {
      this.libInfo = {}
      this.faceData = []
      this.vehicleData = []
      if(this.libType == 1) {
        this.libType = 1
        faceRepoApi.Get().then(res => {
          this.libMenu = res.data.data
          this.libMenu.forEach(item => {
            item._name = item.name.length > 25 ? (item.name.substring(0, 25) + '...') : item.name
          })
          this.getLibInfo(item)
        })
      } else if(this.libType == 2) {
        this.libType = 2
        vehicleRepoApi.Get().then(res => {
          this.libMenu = res.data.data
          this.libMenu.forEach(item => {
            item._name = item.name.length > 25 ? (item.name.substring(0, 25) + '...') : item.name
          })
          this.getLibInfo(item)
        })
      }
    },
    // 库信息
    getLibInfo (item) {
      if (!item.createdAt) {
        item = this.libMenu[0]
        this.activeLibIndex = this.libMenu[0].id
      }
      if (this.libMenu.length > 0) {
        this.libInfo = item.id ? JSON.parse(JSON.stringify(item)) : JSON.parse(JSON.stringify(this.libMenu[0]))
        this.libInfo.createdAt = moment(item.createdAt).add(8, 'hours').format('YYYY-MM-DD HH:mm:ss')
        this.currentLibId = this.libInfo.id
        this.getRecord()
      }
    },
    getRecord () {
      if (this.libType == 1) {
        this.getFace()
      } else {
        this.getVehicle()
      }
    },
    getActiveLibIndex(val) {
      this.activeLibIndex = val
    },
    getSearchVal (val) {
      this.searchVal = val
      this.getFace()
    },
    // Face
    getFace () {
      const date = new Date().getTime()
      const params = {
        pageNum: this.filterParams.pageNum,
        pageSize: this.filterParams.pageSize,
        repoID: this.libInfo.id,
        search: this.searchVal
      }
      faceApi.Get(params)
        .then(res => {
          this.faceData = res.data.data
          this.faceData.forEach(item => {
            item.imagePath = `${item.imagePath}?t=${date}`
          })
          this.count = res.data.count
        })
    },
    // Vehicle
    getVehicle () {
      const params = {
        pageNum: this.filterParams.pageNum,
        pageSize: this.filterParams.pageSize,
        repoID: this.libInfo.id,
        search: this.searchVal
      }
      vehicleApi.Get(params)
        .then(res => {
          this.vehicleData = res.data.data
          this.count = res.data.count
        })
    }
  },
  components: {
    LeftMenu, LibMenu, Record, Pagination
  }
  
}
</script>

<style lang="less" scoped>
body {
  margin: -20px;
  margin-top: 0px;
  background: rgb(235, 238, 242);
  min-width: 1200px;
  #systemBox .system-lib .navbar {
    background: white;
    // padding-left: 20px;
    /deep/ .el-tabs__item.is-active {
      background: #409EFF;
      color: #fff;
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
  .lib_con {
    margin:16px 0 0 20px; 
    height: calc(100vh - 170px); 
    width: calc(100vw - 603px);
    .title_con  {
      border-bottom: 1px solid #eee;
      .libManage {
        width:70px;
        height:20px;
        font-size:14px;
        font-family:medium;
        color:black;
        line-height:20px;
      }
      .libNameFont {
        font-size:12px;
        font-family:medium;
        height:17px;
        width:60px;
        line-height:17px;
        font-weight:400;
      }
      .libNameTitle {
        width:65px;
        color:rgba(144,147,153,1);
      }
      .libName {
        width: 200px;
        margin-left:16px;
        color:#333;
      }
      .libDes {
        width:300px;
        margin-left:16px;
        color:#333;
      }
      .libTimeTitle {
        color:rgba(144,147,153,1);
        width: 85px;
      }
      .libTime {
        margin-left:16px;
        width:200px;
        color: #333;
      }
      .remarkTitle {
        margin-left:16px;
        width:66px;
        color:rgba(144,147,153,1);
      }
    }
  }
  .no-con-data {
    width: 100%;
    color: #999;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>

