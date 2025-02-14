<template>
  <div class="main">
    <div>
        <div>
          <el-tabs class="common-excep" v-model="getExcName" @tab-click="changeExcList">
            <el-tab-pane
                v-for="item in excList"
                :key="item.index"
                :label="item.name"
                :name="item.algorithm"
              >
              </el-tab-pane>
              <div class="right">
                <div class="btn-enable">
                  <span class="enable_title">启动监控</span>
                  <el-switch v-model="enabled"></el-switch>
                </div>
                <div>
                  <div class="enable_title enable_title1">联动方式</div>
                  <div class="btn-enable btn-enable1">
                    <span class="enable_title">网络上传</span>
                    <el-switch v-model="linkageOutput.isNetworkUpload"></el-switch>
                  </div>
                  <div class="btn-enable btn-enable1">
                    <span class="enable_title">联动报警输出</span>
                    <!-- <el-switch v-model="enableGpOut"></el-switch> -->
                  </div>
                  <div class="checkBoxMain">
                    <el-checkbox-group v-model="linkageOutput.localAlarmOutput">
                      <el-checkbox v-for="item in GpioOutList" :label="item" :key="item">{{item}}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <button class="save" @click="saveLink">保存配置</button>
                </div>
              </div>
          </el-tabs>
          <!-- <div v-for="item in excList" :key="item.index" :class="{active:item.index===getExcIndex}" @click="changeExcList(item)" class="left_item">
            <span style="margin-left:5px">{{item.name}}</span>
          </div> -->
        </div>
      </div>
  </div>
</template>

<script>
import { getGpioOut, putDefense, getDefense } from '@/api/systemAPI';
export default {
  name: 'Exception',
  data() {
    return {
      exflag: 0,
      getExcName: 'diskFull',
      getExcIndex: 0,
      enabled: false,
      getName: 'diskFull',
      excList: [],
      data: {
        diskFull: {},
        ipConflict: {},
        cableDisconnect: {},
        cpuOverheat: {},
        fanFaliure: {},
        diskFaliure: {},
        illegalAccess: {},
      },
      event: '',
      enableGpOut: false,
      linkageOutput: {
        isNetworkUpload: false,
        localAlarmOutput: []
      },
      GpioOutList: [],
    }
  },
  mounted() {
    this.queryOutData()
    this.excList = this.excList.length > 0 ? this.excList : [{
        index: 0,
        name: "硬盘满",
        algorithm: "diskFull",
        enabled: false
      }, {
        index: 1,
        name: "IP冲突",
        algorithm: "ipConflict",
        enabled: false
      }, {
        index: 2,
        name: "网线断开",
        algorithm: "cableDisconnect",
        enabled: false
      }, {
        index: 3,
        name: "CPU温度过高",
        algorithm: "cpuOverheat",
        enabled: false
      }, {
        index: 4,
        name: "风扇故障",
        algorithm: "fanFaliure",
        enabled: false
      }, {
        index: 5,
        name: "磁盘故障",
        algorithm: "diskFaliure",
        enabled: false
      }, {
        index: 6,
        name: "非法访问",
        algorithm: "illegalAccess",
        enabled: false
    }];
    this.event = this.excList[this.getExcIndex].algorithm
    this.getLinkageOutput()
  },
  watch: {
    getExcIndex(val) {
      this.getLinkageOutput()
      this.event = this.excList[this.getExcIndex].algorithm
      this.enableGpOut = false
    },
  },
  methods: {
    changeExcList(tab) {
      this.getExcIndex = tab.index;
      this.getName = this.excList[this.getExcIndex].algorithm
      this.enabled = this.excList[this.getExcIndex].enabled
    },
    queryOutData (){
			this.GpioOutList = []
			getGpioOut().then(res=>{
				if(res.data.code==200000){
					this.GpioOutList=res.data.data
				}
			})
		},
    getLinkageOutput() {
      getDefense().then(res => {
        let Def = res.data.data
        this.data = Def
        this.enabled = this.data[this.getName].enable
        this.linkageOutput = this.data[this.getName].linkageOutput
        this.linkageOutput.isNetworkUpload = this.data[this.getName].linkageOutput.isNetworkUpload == 1 ? true : false
        this.excList.forEach(item => {
          item.enabled = this.data[item.algorithm].enable
        })
      })
    },
    saveLink() {
      this.linkageOutput.isNetworkUpload = this.data[this.getName].linkageOutput.isNetworkUpload ? 1 : 0
      let param = {
        event: this.event,
        config: {
          enable: this.enabled,
          linkageOutput: this.linkageOutput
        }
      }
      putDefense( param ).then(res => {
        this.linkageOutput.isNetworkUpload = this.data[this.getName].linkageOutput.isNetworkUpload == 1 ? true : false
        this.exflag = 0
        this.excList[this.getExcIndex].enabled = this.enabled
        this.excList.forEach(item => {
          if(item.enabled) {
            this.exflag++
          }
        })
        let exenable = this.exflag > 0
        this.$emit('exenable',exenable)
        this.$message.success('参数保存成功')
      })
    }
  }
}
</script>

<style lang="less" scoped>
#systemBox .smart-tab .main {
  .common-excep {
    /deep/ .el-tabs__item {
      width: auto;
    }
    /deep/ .el-tabs__item.is-active {
      color: #3c8cd6 !important;
    }
  }
  .right {
    margin-top: 10px;
    color: #333;
    font-size: 13px;
    .btn-enable {
      color: #333;
      font-weight: bold;
    }
    .enable_title {
      margin-top: 10px;
      margin-right: 10px;
    }
    .enable_title1 {
      font-weight: bold;
    }
    .btn-enable1 {
      margin-top: 10px;
      font-weight: normal;
    }
    .checkBoxMain {
      margin-top: 10px;
    }
    .save {
      width: 78px;
      height: 30px;
      background: #2178C8;
      margin-top: 50px;
      border-radius: 2px;
      color: #fff;
      border: none;
      font-size: 12px;
    }
  }
}
/deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: #909399 !important;
    border-color: #909399 !important;
}
</style>