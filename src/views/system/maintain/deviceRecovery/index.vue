<template>
  <div style="min-width: 1000px;">
    <div class="deviceCheck_top" v-loading.fullscreen.lock="isLoading" element-loading-text="数据恢复中，请勿操作">
      <span class="left">
        <span class="device">设备ID: {{ deviceInfo.deviceID }}</span>
        <span class="device">设备类型: {{ deviceInfo.deviceModel }}</span>
      </span>
      <span class="right">
        <el-button type="success" size="small" @click="deviceCheck">刷新备份数据</el-button>
        <el-button style="margin-left: 25px;" :type="multipleSelection.length == 1 ? 'primary' : 'info'" size="small"
          @click="startRecovery(multipleSelection)">开始恢复</el-button>
        <el-button style="margin-left: 25px;" type="primary" :loading="immediateLoading" size="small"
          @click="immediateBackup()">立即备份</el-button>
        <el-button style="margin-left: 25px;" type="primary" size="small"
          @click="exportData(multipleSelection)">导出</el-button>
        <el-button style="margin-left: 25px;" type="primary" size="small"
          @click="sysDialogVisible = true">+上传数据包</el-button>
      </span>
    </div>
    <div v-loading="loading" :element-loading-text="selfTest == 'selftest' ? '刷新备份数据中' : '数据恢复中'"
      element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0)">
      <!-- <div class="contain" v-show="tableData.length != 0 && loading==false"> -->
      <div class="contain">
        <div class="contain_content">
          <div style="float: right;margin: 10px;">
            <!-- <span>
							<span>数据备份包</span>
							<el-input @keyup.enter.native="searchSys" size="small" placeholder="请输入搜索内容" v-model="input">
								<template slot="prepend">
									<i @click="searchSys" class="el-icon-search"></i>
								</template>
							</el-input>
						</span> -->
            <el-checkbox v-model="checked" style="margin-right: 20px;"
              @change="saveUserConfig('enable')">启用备份</el-checkbox>
            <span>备份路径:
              <el-select size="small" style="width:100px" v-model="pathValue" placeholder="请选择">
                <el-option v-for="item in pathOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </span>
            <span style="margin-left: 20px;">备份策略:
              <el-select size="small" style="width:150px;" v-model="strategyValue" placeholder="请选择">
                <el-option v-for="item in strategyOptions" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </span>
            <el-button :loading="saveLoading" @click="saveUserConfig('save')" style="margin-left: 20px;" size="small"
              type="primary">保存配置</el-button>
          </div>
          <div class="contain_footer">
            <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark"
              @selection-change="handleSelectionChange" :height="`${size.contentHeight - 260}`"
              style="width: 100%;min-height: 300px; max-height: calc(100vh - 260px);overflow: auto;margin-top: 10px;">
              <el-table-column type="selection"></el-table-column>
              <el-table-column prop="index" label="序号"></el-table-column>
              <el-table-column prop="app" label="应用版本号" show-overflow-tooltip></el-table-column>
              <el-table-column prop="time" label="版本生成时间" show-overflow-tooltip></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <i class="el-icon-delete"></i>
                  <el-button @click="deleteSysRow(scope.row)" type="text" size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <!-- <el-empty class="contentEmpty" v-show="tableData.length == 0 && loading == false" description="暂无内容"></el-empty> -->
    <el-dialog title="数据包上传" :visible.sync="sysDialogVisible" width="30%" :before-close="() => sysDialogVisible = false">
      <span style="display: flex;justify-content: center;align-content: center;">
        <el-upload ref="zipUpload" class="upload-demo" :auto-upload="false" drag action="" :on-change="changeFile">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sysDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sysUpload">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
    
<script>
import { saveConfig, deleteList, getBackUpsConfig, getConfigSelected, getBackUpsList, recovery, restore, exportDeviceData, upLoadData, getSysteminfo } from '@/api/systemAPI'
export default {
  inject: ["size"],
  data() {
    return {
      deviceInfo: {},
      pathOptions: [],
      strategyOptions: [
        {
          value: 0,
          label: '不启用定时备份'
        },
        {
          value: 1,
          label: '每天'
        }, {
          value: 2,
          label: '每周'
        },
        {
          value: 3,
          label: '每月'
        }],
      pathValue: '',
      strategyValue: 1,
      uploadfileList: [],
      fileBinary: '',
      selfTest: '',
      loading: false,
      sysDialogVisible: false,
      input: '',
      appIsShow: false,
      tableData: [
      ],
      multipleSelection: [],
      checked: false,
      immediateLoading: false,
      saveLoading: false,
      isLoading: false,
    }
  },
  mounted() {
    //设备信息
    getSysteminfo().then(res => {
      if (res.data.code == 200000) {
        this.deviceInfo = res.data.data
      }
    })
    getBackUpsConfig().then(res => {
      if (res.data.code == 200000) {
        this.pathValue = res.data.data.disk
        this.disk = res.data.data.disk
        this.strategyValue = res.data.data.period
        this.checked = res.data.data.enabled || false
      }
    })
    this.getList()
    //获取备份路径
    getConfigSelected().then(res => {
      if (res.data.code == 200000) {
        this.pathOptions = res.data.data.raidList ? res.data.data.raidList.filter(item => item.status == 'ONLINE').map(item => {
          return {
            value: item.raidId,
            label: item.raidId
          }
        }) : []
      }
    })
  },
  methods: {
    //保存用户配置
    async saveUserConfig(type) {
      if (this.disk != this.pathValue) {
        this.saveLoading = true
      }
      let param = {
        enabled: this.checked,
        period: this.strategyValue,
        disk: this.pathValue
      }
      // saveConfig(param).then(res => {
      //   if (res.data.code == 200000) {
      //     this.$message.success(type == 'enable' ? (this.checked ? '启用成功' : '关闭成功') : '保存成功')
      //   } else {
      //     this.$message.error('操作失败')
      //   }
      //   this.saveLoading = false
      // })
      try {
        var res = await saveConfig(param)
        if (res.data.code == 200000) {
          this.$message.success(type == 'enable' ? (this.checked ? '启用成功' : '关闭成功') : '保存成功')
        } else {
          this.$message.error('操作失败')
        }
      } catch (error) {
        if (error.response.data.data === 'disk not exist') {
          this.$message.warning('请选择备份路径')
        } else {
          this.$message.error('操作失败')
        }
      }
      this.saveLoading = false
    },
    async getList() {
      await getBackUpsList().then(e => {
        //时间戳转时间
        function timestampToTime(timestamp) {
          timestamp = timestamp ? timestamp : null;
          let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
          let Y = date.getFullYear() + '-';
          let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
          let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
          let HH = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
          let mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
          let ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()) + '';
          return Y + M + D + HH + mm + ss;
        }
        if (e?.data?.code == 200000) {
          this.tableData = (e?.data?.data || []).map((e, i) => {
            var temp = e.path.split('/')
            var time = timestampToTime(temp[temp.length - 1] * 1000)
            return {
              index: i + 1,
              app: e.app,
              time,
              value: e.path
            }
          })
        } else {
          return
        }
      }, error => {
        this.$message.error('获取备份数据失败')
      })
      return true
    },
    //上传文件
    changeFile(file, fileList) {
      if (fileList.length > 1) fileList.shift()
      if (file.name.slice(-3) != 'zip') {
        this.$message.warning('上传的文件必须是.zip类型')
        this.$refs.zipUpload.clearFiles();
        return
      }
      var blob = new Blob([file.raw])
      this.fileBinary = blob
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //search系统
    searchSys() {
      this.tableData = this.tableData.filter(e => {
        var list = Object.values(e)
        list.pop()
        for (var i of list) {
          if (String(i).includes(this.input)) return true
        }
      })
    },
    //删除Sys
    deleteSysRow(info) {
      deleteList(info.value).then(res => {
        if (res.data.code == 200000) {
          this.$message.success('删除成功')
          this.getList()
        }
      })
    },
    //Sys 上传
    sysUpload() {
      if(this.fileBinary==''){
        this.sysDialogVisible = false
        return 
      }
      upLoadData(this.fileBinary).then(res => {
        if (res.data.code == 200000) {
          this.$message.success('上传成功')
        } else {
          this.$message.error('上传失败')
        }
      })
      this.getList()
      this.$refs.zipUpload.clearFiles();
      this.sysDialogVisible = false
    },
    //导出功能
    exportData(data) {
      if (this.multipleSelection.length == 0) {
        this.$message.warning('请至少选择一条数据')
        return
      }
      var str = ''
      for (let i of data) {
        str += i.value + ','
      }
      str = str.slice(0, -1)
      exportDeviceData(str).then(e => {
        var blob = new Blob([e.data], { type: 'application/zip' });
        var downloadElement = document.createElement('a');
        var href = window.URL.createObjectURL(blob); //创建下载的链接
        downloadElement.href = href;
        downloadElement.download = name; //定义文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        window.URL.revokeObjectURL(href); //释放掉blob对象
      }, error => {
        this.$message.error('导出失败')
      })
    },
    // 立即备份
    async immediateBackup() {
      if (!this.checked) {
        this.$message.warning('请勾选启用备份')
        return
      }
      this.immediateLoading = true
      // recovery().then(res => {
      // 	if (res.data.code == 200000) {
      // 		this.immediateLoading = false
      // 		this.$message.success('备份成功！')
      // 		this.getList()
      // 	} else {
      // 		this.immediateLoading = false
      // 	}
      // })
      try {
        var res = await recovery()
        if (res.data.code == 200000) {
          this.immediateLoading = false
          this.$message.success('备份成功！')
          this.getList()
        } else this.$message.error('备份失败')
      } catch (error) {
        this.$message.error('备份失败')
      }
      this.immediateLoading = false
    },
    //刷新备份数据
    async deviceCheck() {
      this.selfTest = 'selftest'
      this.tableData = [],
        this.loading = true
      try {
        var res = await this.getList()
      } catch (error) {
        this.$message.error('刷新失败')
      }
      this.loading = false
    },
    //开始恢复
    async startRecovery(data) {
      if (this.multipleSelection.length == 1) {
        this.selfTest = 'recovery'
        this.loading = true
        this.isLoading = true
        try {
          var res = await restore(data[0].value)
        } catch (error) {
          this.$message.error('恢复失败')
        }
        if (res?.status == 200) {
          this.$message.success('恢复成功')
        } else {
          this.$message.error('恢复失败')
        }
        this.loading = false
        this.isLoading = false
      }
    }
  }
}
</script>
<style lang="less">
.deviceCheck_top {
  color: rgb(58, 131, 199);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  background-color: rgb(243, 245, 249);
  font-size: 12px;

  .device {
    padding: 20px;
  }

  .right {
    padding-right: 40px;
  }
}

.contain {
  margin-top: 10px;
  color: rgb(58, 131, 199);
  padding: 0px 0 20px 20px;
  display: flex;
  border: 1px solid rgb(243, 245, 249);
  font-size: 12px;

  .contain_content {
    width: 90vw;

    .contain_footer {
      margin-top: 10px;
    }
  }
}

.contentEmpty {
  padding-top: 18%;
}

.el-loading-spinner {
  padding-top: 20%;
  color: #409EFF;
  font-size: 50px;
}

.el-loading-mask .el-loading-spinner .el-loading-text {
  font-size: 18px;
}

.pathValue .el-input__inner {
  width: 100px;
}

.pathValue .el-input__suffix {
  right: 185px;
}
</style>
