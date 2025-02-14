<template>
  <div>
    <el-tabs v-model="activeName">
    <el-tab-pane label="S.M.A.R.T" name="first">
      <div class="mt20" style="margin-bottom:8px">
        <span class="mTitle title1">基本信息</span>
      </div>
      <el-form ref="form" label-position="left" size="mini" label-width="80px">
        <el-row>
          <el-col :span="4" class="rowStart">
            <el-form-item label="盘号"></el-form-item>
            <el-select v-model="diskForm.diskId" @change="onDiskChange" placeholder="" size="mini" style="width:160px">
              <el-option v-for="item in 12" :label="item" :value="item" :key="item"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4" class="rowStart" :offset="1">
            <el-form-item label="自检类型"></el-form-item>
            <el-select v-model="diskForm.testType" @change="startCheck" placeholder="" size="mini" style="width:160px">
              <el-option v-for="item in [{label:'short', value:1}, {label:'long', value:2}]" :label="item.label"
                :value="item.value" :key="item.value"></el-option>
            </el-select>
          </el-col>
          
        </el-row>
      
        <el-row size="mini" label-width="150px">
          <el-col :span="4" class="rowStart">
              <el-form-item label="SMART"></el-form-item>
              <span class="cmFont showDetail" @click="startCheck">开始检测</span>
            </el-col>
            <el-col :span="4" class="rowStart">
              <el-form-item label="型号"></el-form-item>
              <span class="cmFont">{{diskForm.modelName}}</span>
            </el-col>
            <el-col :span="4" class="rowStart">
              <el-form-item label="序列号"></el-form-item>
              <span class="cmFont">{{diskForm.serialNumber}}</span>
            </el-col>
            <el-col :span="4" class="rowStart">
              <el-form-item label="温度"></el-form-item>
              <span class="cmFont">{{diskForm.temperature}}</span>
          </el-col>
          <el-col :span="4" class="rowStart">
              <el-form-item label="使用时间"></el-form-item>
              <span class="cmFont">{{diskForm.numOfDay}}天</span>
          </el-col>
          <el-col :span="4" class="rowStart">
              <el-form-item label="整体评估"></el-form-item>
              <span class="cmFont"></span>
          </el-col>
        </el-row>
      </el-form>
      <div>
        <span class="title1">S.M.A.R.T检测信息</span>
      </div>
      <el-table ref="multipleTable"
          size="mini"
          v-loading="loadingFlag"
          element-loading-text="正在加载中"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%;min-height: 300px;max-height: calc(100vh - 380px);overflow: auto;">
          <el-table-column prop="id" label="ID#"></el-table-column>
          <el-table-column prop="name" min-width="125px" label="ATTRIBUTE_NAME"></el-table-column>
          <el-table-column prop="flag" label="FLAG"></el-table-column>
          <el-table-column prop="value" label="VALUE"></el-table-column>
          <el-table-column prop="worst" label="WORST"></el-table-column>
          <el-table-column prop="thresh" label="THRESH"></el-table-column>
          <el-table-column prop="type" label="TYPE"></el-table-column>
          <el-table-column prop="updatedOnline" label="UPDATED"></el-table-column>
          <el-table-column prop="whenFailed" label="WHEN_FAILD"></el-table-column>
          <el-table-column prop="rawValue" label="RAW_VALUE"></el-table-column>
      </el-table>
    </el-tab-pane>
  
  </el-tabs>
  </div>
</template>
  
<script>
  import { getDiskSmartInfo, } from '@/api/systemAPI';
  
  export default {
    data() {
      return {
        loadingFlag: false,
        activeName: 'first',
        smartInfos: {},
        diskForm: {
          diskId: 1,
          testType: 1,
          modelName: "",
          serialNumber:"",
          temperature: 0,
        },
        tableData: [],
      }
    },
    mounted () {
      this.queryDiskSmartInfo()
    },
    methods: {
      // 设备SMART信息
      queryDiskSmartInfo () {
        this.loadingFlag = true
        const res = getDiskSmartInfo().then(res => {
          this.loadingFlag = false
            if(res.data.code === 200000) {
              this.smartInfos = res.data.data
              this.getDiskSmartInfoById("1")
            } else {
              this.$message({
                showClose:true,
                message:'查询设备SMART信息失败！',
                type: 'error'
              })
            }
          })
      },
      onDiskChange (e) {
        this.getDiskSmartInfoById(this.diskForm.diskId)
      },
      startCheck () {
       
      },
      getDiskSmartInfoById (id) {
        var smartInfo = this.smartInfos[id]

        this.tableData = []
        this.diskForm = {}
        this.diskForm.diskId = id
        this.diskForm.testType = 1
        this.diskForm.modelName = smartInfo.model_name;
        this.diskForm.serialNumber = smartInfo.serial_number;
        var i = 0
        for(var item of smartInfo.smart) {
            if (item.name == "Temperature_Celsius") {
              this.diskForm.temperature = item.value
            } else if (item.name == "Power_On_Hours") {
              this.diskForm.numOfDay = item.value / 24
            } 

            var row = new Object()
            row.id = item.id;
            row.name = item.name;
            row.flag =  "0X" + item.flags.value.toString(16).padStart(4, '0');
            row.value = item.value.toString().padStart(3, '0');
            row.worst = item.worst.toString().padStart(3, '0');
            row.thresh = item.thresh.toString().padStart(3, '0');
            row.type = item.flags.prefailure == false ? "Old_age":"Pre-fail";
            row.whenFailed = item.when_failed;
            row.updatedOnline = item.flags.updated_online == true ? "Always":"Offline";
            row.rawValue = item.raw.string;

            this.tableData.push(row)
        }
      }
    },
    beforeDestroy() {
    },
  }
  </script>
  

<style lang="less" scoped>
.cmFont {
    font-size: 14px;
    font-weight: 400;
  margin-bottom: 18px;
  line-height: 28px;
}

.showDetail:hover {
  cursor: pointer;
  color: #3a74ff;
}
.title1 {
  color: #000;
  padding-bottom: 1rem;
  display: block;
}

</style>
