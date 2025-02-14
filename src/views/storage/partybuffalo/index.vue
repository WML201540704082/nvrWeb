<template>
  <div class="partybuffalo">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="磁盘管理" name="first">
        <el-table ref="multipleTable" size="mini" :data="tableData" tooltip-effect="dark"
          style="width: 100%;min-height: 300px;" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="diskId" label="盘号">
          </el-table-column>
          <el-table-column prop="size" label="容量(GB)">
          </el-table-column>
          <el-table-column prop="remainSize" label="剩余(GB)">
          </el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <div class="status" :class="STATUS_MAP[scope.row.status]?.status"></div>
              {{ STATUS_MAP[scope.row.status]?.label }}
            </template>
          </el-table-column>
          <el-table-column prop="type" label="类型">
            <template slot-scope="scope">
              {{ scope.row.type == 'LOCAL' ? '本地磁盘' : (scope.row.type == 'HDRAID' ? 'HDRAID' : "") }}
            </template>
          </el-table-column>
          <el-table-column prop="purpose" label="用途">
            <template slot-scope="scope">
              <el-select v-model="scope.row.purpose" placeholder="请选择" size="mini">
                <el-option label="录像盘" :value="2"></el-option>
                <!-- <el-option label="冗余" :value="3"></el-option>
                <el-option label="只读盘" :value="4"></el-option> -->
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="groupId" label="盘组" width="120">
            <template slot-scope="scope">
              <el-select v-if="scope.row.purpose == 2" v-model="scope.row.groupId" placeholder="请选择" size="mini">
                <el-option v-for="n in 8" :label="n" :value="n" :key="n"></el-option>
              </el-select>
              <span v-else></span>
            </template>
          </el-table-column>

          <!-- <el-table-column
            label="删除">
            <template slot-scope="scope">
              <span
              v-if="scope.row.type != 'LOCAL' && scope.row.type != 'HDRAID'"
              style="color: #ff0000;cursor:pointer"
                @click="onDelete1(scope.$index, scope.row)">删除</span>
            </template>
            </el-table-column> -->
        </el-table>
        <div style="margin: 10px  0">
          <el-button size="small" type="primary" @click="OnSave1">应用</el-button>
          <el-button size="small" @click="Onformat">格式化</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="高级配置" name="second">
        <el-form ref="form4" :rules="form4Rules" :model="form4" size="mini" label-width="200px" label-position="left">
          <el-col :span="24" style="margin-bottom: 16px;display: flex;">
            <el-col :span="2" :offset="0" style="font-size: 14px;color: #000;font-weight: 500;">盘满覆盖</el-col>
            <el-switch v-model="form4.fullWithCover"></el-switch>
          </el-col>
          <!--
          <div>
            <el-checkbox v-model="form4.dormant">启用硬盘休眠</el-checkbox>
          </div>
           <el-form-item label="eSATA盘">
            <el-select v-model="form4.esata" placeholder="请选择" style="width: 200px">
              <el-option label="备份" :value="1"></el-option>
              <el-option label="录像" :value="2"></el-option>
            </el-select>
          </el-form-item> -->

          <el-form-item prop="coverageType" label="模式选择">
            <el-select v-model="form4.coverageType" placeholder="请选择" style="width: 200px" @change="changeType">
              <el-option label="按时间进行覆盖" :value="1"></el-option>
              <el-option label="按容量进行覆盖" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="coverageFreeLimit" label="循环覆盖触发临界点(G)">
            <el-input @input="(e) => form4.coverageFreeLimit = e.replace(/^(0+)|[^\d]+/g,'')"  v-model="form4.coverageFreeLimit" style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item prop="coverageDuration" label="单次循环覆盖清理量(天)" v-if="form4.coverageType == '1'">
            <el-input @input="(e) => form4.coverageDuration = e.replace(/^(0+)|[^\d]+/g, '')"
              v-model="form4.coverageDuration" style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item prop="coverageFreeTarget" label="单次循环覆盖清理量(MB)" v-if="form4.coverageType == '2'">
            <el-input @input="(e) => form4.coverageFreeTarget = e.replace(/^(0+)|[^\d]+/g, '')"
              v-model="form4.coverageFreeTarget" style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="onSave2">应用</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="储存估算" name="third">
        <el-form label-width="120px" size="mini" :model="form3">
          <el-form-item label="估算类型">
            <el-select v-model="form3.type" placeholder="请选择" style="width: 220px">
              <el-option label="存储容量" :value="1"></el-option>
              <el-option label="存储时间" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="视频码率">
            <el-input type="text" v-model="form3.vBitrate" style="width: 220px;margin-right: 15px"></el-input>
            <span>Kbps</span>
          </el-form-item>
          <el-form-item label="通道数量">
            <el-input type="text" v-model="form3.ChanNum" style="width: 220px;margin-right: 15px"></el-input>
            <span>路</span>
          </el-form-item>
          <el-form-item label="录像计划">
            <el-input type="text" v-model="form3.RecordPlan" style="width: 220px;margin-right: 15px"></el-input>
            <span>小时 / 天</span>
          </el-form-item>
          <el-form-item label="存储时间" v-if="form3.type == 1">
            <el-input type="text" v-model="form3.StoreTime" style="width: 220px;margin-right: 15px"></el-input>
            <span>天</span>
          </el-form-item>
          <el-form-item label="硬盘容量">
            <el-input type="text" v-model="form3.Disksize" style="width: 220px;margin-right: 15px"></el-input>
            <span>TB</span>
          </el-form-item>
          <el-form-item label="硬盘数量" v-if="form3.type == 2">
            <el-input type="text" v-model="form3.Diskcnt" style="width: 220px;margin-right: 15px"></el-input>
            <span>个</span>
          </el-form-item>
          <div style="border-bottom: 1px solid rgb(222, 225, 227);margin: 10px 0;"></div>
          <el-form-item label="存储容量" v-if="form3.type == 1">
            <el-input disabled type="text" v-model="form3.StoreSize" style="width: 220px;margin-right: 15px"></el-input>
            <span>GB( 估算结果仅供参考,请以实际为准 )</span>
          </el-form-item>
          <el-form-item label="存储时间" v-if="form3.type == 2">
            <el-input disabled type="text" v-model="form3.StoreTime2" style="width: 220px;margin-right: 15px"></el-input>
            <span>天( 估算结果仅供参考,请以实际为准 )</span>
          </el-form-item>
          <el-form-item label="硬盘数量" v-if="form3.type == 1">
            <el-input disabled type="text" v-model="form3.Diskcnt2" style="width: 220px;margin-right: 15px"></el-input>
            <span>个</span>
          </el-form-item>
          <el-form-item>
            <el-button size="small" @click="onSave3">估算</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

    </el-tabs>
    <el-dialog :append-to-body="true" :close-on-click-modal="false" title="添加网络硬盘" width="500px"
      :visible.sync="networkVisible">
      <el-form :model="form" size="mini" label-width="120px">
        <el-form-item label="网络硬盘号">
          <el-select v-model="form.diskId" placeholder="请选择" style="width: 200px">
            <el-option v-for="item in diskNameList " :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.type" placeholder="请选择" style="width: 200px">
            <el-option label="NAS" :value="1"></el-option>
            <el-option label="IPSAN" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务器地址">
          <el-input v-model="form.servIp" autocomplete="off" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="文件路径">
          <el-input v-model="form.path" autocomplete="off" style="width: 200px"></el-input>
          <el-button size="mini" @click="onSearch1">搜索</el-button>
        </el-form-item>
      </el-form>
      <div style="width: 360px;margin-top: 20px" v-if="searchTableFlag">
        <el-table :data="gridData1" size="mini" width="100%">
          <el-table-column property="date" label="日期"></el-table-column>
          <el-table-column property="name" label="姓名"></el-table-column>
          <el-table-column property="address" label="地址"></el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="networkCancle1">取 消</el-button>
        <el-button size="mini" type="primary" @click="networkSave1">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :append-to-body="true" :close-on-click-modal="false" title="添加虚拟硬盘" width="500px"
      :visible.sync="virtualVisible">
      <el-form :model="form2" size="mini" label-width="120px">
        <el-form-item label="硬盘号">
          <el-select v-model="form2.region" placeholder="请选择" style="width: 200px">
            <el-option v-for="item in diskNameList2 " :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="硬盘大小">
          <el-input v-model="form2.size" autocomplete="off" style="width: 200px"></el-input>
          <span>GB</span>
        </el-form-item>
        <el-form-item label="虚拟硬盘地址">
          <el-input v-model="form2.mountPath" autocomplete="off" style="width: 200px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="virtualCancle1">取 消</el-button>
        <el-button size="mini" type="primary" @click="virtualSave1">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getDiskInfo, putDiskinfo, postFormat, getAdvanced
  , putAdvanced, DeleteDiskDir, postEstimateTime, postEstimateCapacity
} from '@/api/systemAPI';
export default {
  name: 'partybuffalo',
  data() {
    let validateFreeLimit = (rule, value, callback) => {
      if (Number(value) < 128) {
        callback(new Error('必须大于128G'));
      } else if (Number(value) > 512) {
        callback(new Error('必须小于512G'));
      } else {
        callback();
      }
    }
    let validateDuration = (rule, value, callback) => {
      if (Number(value) <= 0) {
        callback(new Error('必须大于0'));
      } else if (Number(value) > 7) {
        callback(new Error('必须小于7'));
      } else {
        callback();
      }
    }
    return {
      STATUS_MAP: {
        1: {
          label: '未格式化',
          status: 'info'
        },
        2: {
          label: '睡眠',
          status: 'info'
        },
        3: {
          label: '正常',
          status: 'success'
        },
      },
      activeName: 'first',
      tableData: [],
      tableDataOld: [],
      multipleSelection: [],
      form3: {
        type: 1,
        ChanNum: 32,
        Disksize: 4,
        RecordPlan: 24,
        StoreTime: 30,
        vBitrate: 2048,
        Diskcnt: 12,
        Diskcnt2: 0,
        StoreSize: 0,
        StoreTime2: 0,
      },
      form: {
        diskId: '',
        type: 1,
        servIp: "",
        path: "",
      },
      diskNameList: [{
        name: 'N1',
        id: 1
      }, {
        name: 'N2',
        id: 2
      }, {
        name: 'N3',
        id: 3
      },],
      diskNameList2: [{
        name: 'DIR5',
        id: 1
      }, {
        name: 'DIR6',
        id: 2
      }, {
        name: 'DIR7',
        id: 3
      },],
      searchTableFlag: false,
      form2: {
        id: '',
        size: '',
        mountPath: '',
      },
      form4: {
        fullWithCover: false,
        dormant: false,
        esata: 1,
        coverage: {
          type: 1,
          duration: 0,
          freeLimit: 0,
          freeTarget: 0,
        },
        coverageType: 1,
        coverageDuration: 0,
        coverageFreeLimit: 0,
        coverageFreeTarget: 0,
      },
      networkVisible: false,
      virtualVisible: false,
      gridData1: [],
      form4Rules: {
        coverageFreeLimit: [{
          required: false, validator: validateFreeLimit, trigger: 'blur'
        }],
        coverageDuration: [{
          required: false, validator: validateDuration, trigger: 'blur'
        }],
        coverageFreeTarget: [{
          required: false, validator: validateDuration, trigger: 'blur'
        }],
      }
    }
  },
  created() {
  },
  mounted() {
    this.queryDiskinfo()
    this.queryAdvanced()
  },
  methods: {
    changeType() {
      this.$refs.form4.clearValidate()
    },
    // 获取磁盘列表
    queryDiskinfo() {
      this.tableData = []
      this.tableDataOld = []
      getDiskInfo().then(res => {
        if (res.data.code === 200000) {
          this.tableData = res.data.data.diskStorageList
          this.tableData = this.tableData.map(item => {
            return {
              ...item,
              purpose: item.purpose === 0 ? '' : item.purpose,
              groupId: item.groupId === 0 ? '' : item.groupId
            }
          })
          this.tableDataOld = JSON.parse(JSON.stringify(this.tableData))
        }
      })
    },
    // 磁盘管理删除
    onDelete1() {
      DeleteDiskDir(ID).then(res => {
        if (res.data.code == 200000) {
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          this.queryDiskinfo()
        } else {
          this.$message({
            showClose: true,
            message: '删除失败',
            type: 'error'
          })
        }
      }).catch(() => {
        this.$message({
          showClose: true,
          message: '删除失败',
          type: 'error'
        })
      })
    },
    // 勾选磁盘
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 格式化磁盘
    Onformat() {
      if (this.multipleSelection.length) {
        this.$confirm('格式化操作会删除硬盘中现有的所有数据，请确认是否继续执行本动作？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.multipleSelection.forEach(item => {
            postFormat(item.id).then(res => {
              if (res.data.code == 200000) {
                this.$message({
                  showClose: true,
                  message: '格式化成功！',
                  type: 'success'
                })
              } else {
                this.$message({
                  showClose: true,
                  message: '格式化失败！',
                  type: 'error'
                })
              }
            }).catch(err => {
              this.$message({
                showClose: true,
                message: '格式化失败！',
                type: 'error'
              })
            })
          })

        })
      } else {
        this.$message({
          showClose: true,
          message: '请选择需要格式化的硬盘！',
          type: 'warning'
        })
      }
    },
    // 网络硬盘 搜索
    onSearch1() {
      this.searchTableFlag = true
    },
    // 网络磁盘保存
    networkSave1() {
      let obj = {
        diskId: "N1",
        path: "",
        servIp: "",
        servPort: 3620,
        type: 1
      }
      this.networkVisible = false
    },
    // 网络磁盘取消
    virtualSave1() {
      this.networkVisible = false
    },
    // 虚拟硬盘保存
    networkSave1() {
      let obj = {
        id: "DIR6",
        mountPath: "1111",
        size: 1111
      }
      this.virtualVisible = false
    },
    // 虚拟硬盘取消
    virtualCancle1() {
      this.virtualVisible = false
    },
    handleClick() {

    },
    networkCancle1() {

    },
    networkSave1() {

    },

    // 添加网络硬盘
    OnNetworkDisk() {
      this.networkVisible = true
    },
    // 添加虚拟硬盘
    OnVirtualDisk() {
      this.virtualVisible = true
    },
    // 应用
    OnSave1() {
      if (this.multipleSelection.length) {
        let arr = []
        let arr1 = []
        let arrGroup = []
        let flag = false;
        let arrID = []
        this.multipleSelection.forEach(item => {
          if (item.purpose !== 2) {
            flag = false
            return
          }
          arrID.push(item.id)
          if (item.groupId && arrGroup.indexOf(item.groupId) > -1) {
            flag = true
          } else {
            arrGroup.push(item.groupId)
          }
        })
        arr1 = this.tableDataOld.filter(obj => {
          return arrID.indexOf(obj.id) == -1
        })
        arr1.forEach(item => {
          if (item.groupId && arrGroup.indexOf(item.groupId) > -1) {
            flag = true
          }
        })

        if (flag) {
          this.$message({
            showClose: true,
            message: '盘组不能重复！',
            type: 'warning'
          })
          return
        }
        let i = 0
        this.multipleSelection.forEach(item => {
          ///
          arr.push({
            groupId: Number(item.groupId),
            diskId: item.diskId,
            purpose: Number(item.purpose),
          })

          putDiskinfo({ 'diskStorageList': arr }).then(res => {
            i++
            if (i === this.multipleSelection.length) {
              if (res.data.code == 200000) {
                this.$message({
                  showClose: true,
                  message: '修改成功！',
                  type: 'success'
                })
              } else {
                this.$message({
                  showClose: true,
                  message: '修改失败！',
                  type: 'error'
                })
              }
            }
          }).catch(() => {
            i++
            if (i === this.multipleSelection.length) {
              this.$message({
                showClose: true,
                message: '修改失败！',
                type: 'error'
              })
            }
          })
        })
      } else {
        this.$message({
          showClose: true,
          message: '请选择需要修改的硬盘！',
          type: 'warning'
        })
      }
    },
    // 高级设置
    queryAdvanced() {
      getAdvanced().then(res => {
        if (res.data.code == 200000) {
          this.form4 = {
            fullWithCover: res.data.data.fullWithCover == "1" ? true : false,
            dormant: res.data.data.dormant == "1" ? true : false,
            esata: res.data.data.esata,
            coverageType: res.data.data.coverage.type,
            coverageDuration: res.data.data.coverage.duration,
            coverageFreeLimit: res.data.data.coverage.freeLimit / 1024,
            coverageFreeTarget: res.data.data.coverage.freeTarget / 1024,
          }
        }
      })
    },
    // 保存高级设置
    onSave2() {
      let obj = {
        fullWithCover: this.form4.fullWithCover == true ? "1" : "0",
        dormant: this.form4.dormant == true ? "1" : "0",
        esata: Number(this.form4.esata),
        coverage: {
          type: Number(this.form4.coverageType),
          duration: Number(this.form4.coverageDuration),
          freeLimit: Number(this.form4.coverageFreeLimit) * 1024,
          freeTarget: Number(this.form4.coverageFreeTarget),
        }
      }
      this.$refs['form4'].validate(valid => {
        if (valid) {
          putAdvanced(obj).then(res => {
            if (res.data.code == 200000) {
              this.$message({
                showClose: true,
                message: '保存成功！',
                type: 'success'
              })
            } else {
              this.$message({
                showClose: true,
                message: '保存失败！',
                type: 'error'
              })
            }
          }).catch(() => {
            this.$message({
              showClose: true,
              message: '保存失败！',
              type: 'error'
            })
          })
        }
      })

    },
    // 存储估算
    onSave3() {
      if (this.form3.type == 1) {
        let obj = {
          channelNum: Number(this.form3.ChanNum),
          diskSize: Number(this.form3.Disksize),
          recordPlan: Number(this.form3.RecordPlan),
          storeTime: Number(this.form3.StoreTime),
          bitRate: Number(this.form3.vBitrate),
        }
        postEstimateCapacity(obj).then(res => {
          if (res.data.code == 200000) {
            this.form3.Diskcnt2 = res.data.data.diskcnt
            this.form3.StoreSize = res.data.data.storeSize
          }
        })
      } else {
        let obj = {
          channelNum: Number(this.form3.ChanNum),
          diskSize: Number(this.form3.Disksize),
          recordPlan: Number(this.form3.RecordPlan),
          diskCnt: Number(this.form3.Diskcnt),
          bitRate: Number(this.form3.vBitrate),
        }
        postEstimateTime(obj).then(res => {
          if (res.data.code == 200000) {
            this.form3.StoreTime2 = res.data.data.storeTime
          }
        })
      }
    }
  },
  directives: {
    'decimal-only': {
      bind(el) {
        console.log('decimal-only', 111111111)
        el.addEventListener('input', (e) => {
          const input = e.target
          var value = input.value
          value = value.replaceAll(/\D/g, '')
          input.value = value

        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.partybuffalo {
  color: #000000;
  height: 100%;
}

.status {
  width: 10px;
  height: 10px;
  display: inline-block;
  background: transparent;
  border: 2px solid transparent;
  border-radius: 50%;

  &.success {
    background: #67c23a;
    border-color: #c2e7b0;
  }

  &.info {
    background: #909399;
    border-color: #d3d4d6;
  }
}
</style>
