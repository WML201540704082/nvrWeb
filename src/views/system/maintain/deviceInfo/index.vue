 <template>
    <div>
      <!-- 设备管理 -->
      <div>
        <span class="mTitle title1">{{$t('basicInfo')}}</span>
        <el-form :inline="true" :model="ruleForm" ref="ruleForm" label-width="80px" label-position="right" :rules="json.deviceRules">
          <el-col :span="24" style="margin:15px 0 -8px 0 " v-for="(item,index) of json.formParams" :key="index">
            <el-form-item :label="$t(item.label)" :prop="item.label" >
              <el-input class="cmFont" size="mini" v-model="ruleForm[item.label]" :placeholder="$t('pleaseEnter')+$t(item.label)"></el-input>
            </el-form-item>
            <el-button type="primary" size="mini" style="margin:7px 0 0 20px" @click="onSubmit('ruleForm')">{{$t('save')}}</el-button>
          </el-col>
        </el-form>

        <!-- 设备信息 -->
        <div class="mt20">
          <span class="mTitle title1">{{$t('deviceInfo')}}</span>
        </div>
        <el-col class="rowStart" style="margin:25px 0 0 14px">
            <span class="cmFont">{{$t('deviceId')}}:</span>
            <span class="cmFont" style="margin-left:11px;">{{infoForm.deviceID}}</span>
        </el-col>

        <el-col class="rowStart" style="margin:11px 0 0 14px"> 
            <span class="cmFont">{{$t('deviceModel')}}:</span>
            <span class="cmFont" style="margin-left:11px;">{{infoForm.deviceModel}}</span>
        </el-col>
        <el-col class="rowStart" style="margin:11px 0 0 14px">
            <span class="cmFont">{{$t('osName')}}:</span>
            <span class="cmFont" style="margin-left:11px;">{{infoForm.osName}}</span>
        </el-col>
        <el-col class="rowStart" style="margin:11px 0 0 14px">
            <span class="cmFont">{{$t('osVersion')}}:</span>
            <span class="cmFont" style="margin-left:11px;">{{infoForm.osVersion}}</span>
        </el-col>

        <el-col class="rowStart" style="margin:11px 0 0 14px">
            <span class="cmFont">{{$t('algVer')}}:</span>
            <span class="cmFont" style="margin-left:11px;">{{infoForm.algVersion}}</span>
            <span class="cmFont showDetail" style="margin-left:11px;" @click="showAlgoDetail">{{$t('detail')}}</span>
        </el-col>
        <el-col class="rowStart" style="margin:11px 0 0 14px">
            <span class="cmFont">{{$t('appVer')}}:</span>
            <span class="cmFont" style="margin-left:11px;">{{infoForm.appVersion}}</span>
            <span class="cmFont showDetail" style="margin-left:11px;" @click="showDetail">{{$t('detail')}}</span>
        </el-col>
        
        <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" width="800px" class="version">
          <template slot="title">
            <span class="el-dialog__body">版本详情</span>
            <span style="font-size:12px;color:rgba(48, 49, 51, 0.4);margin-left:5px"></span>
          </template>
          <div class="sysContent" v-for="(item,index) of infoForm.apps" :key="index">
            <el-col :span="12" class="sysText">应用名称: {{item.name}}</el-col>
            <el-col :span="8" class="sysText">应用版本: {{item.version}}</el-col>
          </div>
        </el-dialog>
  
        <el-dialog :visible.sync="dialogAlgoVisible" :close-on-click-modal="false" width="800px" class="version">
          <template slot="title">
            <span class="el-dialog__body">版本详情</span>
          </template>
          <div class="sysContent"  v-for="(item,index) of infoForm.modelsVersion" :key="index">
            <el-col :span="12" class="sysText">模型名称: {{item.name}}</el-col>
            <el-col :span="8" class="sysText">模型版本: {{item.version}}</el-col>
          </div>
        </el-dialog>

        <!-- NVR设备信息 -->
        <el-col class="rowStart" style="margin:25px 0 0 14px">
            <span class="cmFont">{{$t('channelNumber')}}:</span>
            <span class="cmFont" style="margin-left:11px;">{{nvrInfoForm.channelNumber}}</span>
        </el-col>
        <el-col class="rowStart" style="margin:11px 0 0 14px">
            <span class="cmFont">{{$t('diskNumber')}}:</span>
            <span class="cmFont" style="margin-left:11px;">{{nvrInfoForm.diskNumber}}</span>
        </el-col>
        <el-col class="rowStart" style="margin:11px 0 0 14px">
            <span class="cmFont">{{$t('alarmInNumber')}}:</span>
            <span class="cmFont" style="margin-left:11px;">{{nvrInfoForm.alarmInNumber}}</span>
        </el-col>
        <el-col class="rowStart" style="margin:11px 0 25px 14px">
            <span class="cmFont">{{$t('alarmOutNumber')}}:</span>
            <span class="cmFont" style="margin-left:11px;">{{nvrInfoForm.alarmOutNumber}}</span>
        </el-col>

      </div>
      <!-- 算力消耗 -->
      <div class="npu-con">
          <span class="mTitle title1">算力消耗</span>
        <el-button type="primary" size="mini" class="npu-button" @click="getNpuInfo">刷新</el-button>
        <el-tabs v-model="editableTabsValue" type="card" class="npu-tab">
          <el-tab-pane
            v-for="item in editableTabs"
            :key="item.name"
            :label="item.title"
            :name="item.name"
          >
            <el-col class="rowStart" style="margin:25px 0 0 14px">
                <span class="cmFont">品牌：</span>
                <span class="cmFont" style="margin-left:11px;">{{item.npuInfoList.productName}}</span>
            </el-col>
            <el-col class="rowStart" style="margin:11px 0 0 14px">
                <span class="cmFont">型号：</span>
                <span class="cmFont" style="margin-left:11px;">{{item.npuInfoList.chip[0].productType}}</span>
            </el-col>
            <el-col class="rowStart" style="margin:11px 0 0 14px">
                <span class="cmFont">算力：</span>
                <span class="cmFont" style="margin-left:11px;">{{tops}}T</span>
            </el-col>
            <el-col class="rowStart" style="margin:11px 0 0 14px">
                <span class="cmFont">温度：</span>
                <span class="cmFont" style="margin-left:11px;">{{item.npuInfoList.chip[0].temperature}}℃</span>
            </el-col>
            <el-col class="rowStart" style="margin:11px 0 0 14px">
                <span class="cmFont">内存使用率：</span>
                <span class="cmFont" style="margin-left:11px;">{{item.npuInfoList.chip[0].memoryUsageRate}}%</span>
            </el-col>
            <div class="cmFont ai-title">运算能力：</div>
            <el-col style="margin:14px 0 0 14px">
              <div>
                <span class="cmFont" style="color:#909399;">{{item.aiForm.usage + '/' + item.aiForm.tops + 'T'}}</span>
              </div>
              <div class="ai-con">
                <div class="ai-con1"
                    :style="{ width: (800 * (1 - item.aiForm.usage / item.aiForm.tops)) + 'px' }"
                ></div>
              </div>
            </el-col>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </template>
  
  <script>
  import { getDeviceInfo, getSysteminfo, getNVRDeviceInfo, setDeviceInfo } from '@/api/systemAPI';
  import { getNpuInfo } from '@/api'
  import json from './config';
  
  export default {
    data() {
      return {
        json,
        ruleForm: {
          deviceName: '',
        },
        editableTabs: [],
        editableTabsValue: '1',
        infoForm: {},
        appVer: "",
        dialogVisible: false,
        dialogAlgoVisible: false,
        tops: null,
        nvrInfoForm: {},
      }
    },
    created () {
      this.getDeviceInfo1()
      this.getNpuInfo()
    },
    methods: {
      // 设备信息
      async getDeviceInfo1 () {
        const res = await getDeviceInfo()
        this.ruleForm = res.data.data
        // this.ruleForm.deviceName = window.localStorage.getItem('title')

        let infoData = await getSysteminfo();
        this.infoForm = infoData.data.data;

        let nvrInfoData = await getNVRDeviceInfo();
        this.nvrInfoForm = nvrInfoData.data.data;
      },
      async getNpuInfo() {
        const { data } = await getNpuInfo()
        if (data.code == 200000) {
            this.npuInfoList = data.data.npus
            this.tops = data.data.tops
            for(let i in this.npuInfoList) {
              this.editableTabs[i] = {
                name: String(Number(i) + 1),
                title: '计算卡' + (Number(i) + 1),
                npuInfoList: this.npuInfoList[i],
                aiForm: {
                  tops: this.tops,
                  usage: Number(this.tops * this.npuInfoList[i].chip[0].aicoreUsageRate / 100).toFixed(2)
                }
              }
            }
            this.$forceUpdate()//消耗性能
        } else {
            this.$message.error(data.message)
        }
      },
      showDetail() {
        this.dialogVisible = true;
      },
      showAlgoDetail() {
        this.dialogAlgoVisible = true;
      },
      onSubmit (form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            let param = {
              deviceName: this.ruleForm.deviceName
            }
            setDeviceInfo(param).then(res => {
              if(res.data.code == 200000) {
                this.$message.success('保存成功！')
                // this.$router.push({ name: "login" });
              }
              else {
                this.$message.error('保存失败')
              }
            }).catch(err => console.log(err))
          }
        })
      },
    },
    beforeDestroy() {
    },
  }
  </script>
  

  <style lang="less" scoped>
.cmFont {
    height: 17px;
    font-size: 14px;
    margin-bottom: 5px;
    font-family: PingFangSC-Regular,PingFang SC;
    font-weight: 400;
    line-height: 17px;
    color: #909399
}
#systemBox .showDetail {
  cursor: pointer;
  color: #3a74ff !important;
}

.sysContent {
    height: 49px;
    line-height: 49px;
    background-color: #fff;
    white-space: nowrap;
}
.title1 {
  color: #626262;
}
.npu-con {
  .title1 {
    display: inline-block;
  }
  .npu-button {
    display: inline-block;
    margin-left: 100px;
  }
  .npu-tab {
    margin-top: 10px;
  }
  .ai-title {
    color: #909399;
    margin-left: 12px;
  }
  .ai-con {
    width: 800px;
    height:30px;
    background:linear-gradient(90deg, #01B28A 0%, #F9E01A 34%, #F6812B 71%, #F54336 100%);
    margin-top:5px;
  }
  .ai-con1 {
    height:30px;
    background:#E1E1E1;
    float:right;
    transition:width 0.4s ease-in-out;
  }
}
</style>
