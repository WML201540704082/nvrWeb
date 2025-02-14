<template>
   <div class="partybuffalo" >
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="创建RAID" name="first">
        <el-table
            ref="multipleTable"
            size="mini"
            v-loading="loading1"
            element-loading-text="正在加载中"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%;min-height: 300px;"
            @selection-change="handleSelectionChange">
            <el-table-column
            type="selection"
            :selectable="selected"
            width="55">
            </el-table-column>
            <el-table-column
            prop="diskId"
            label="盘号">
            </el-table-column>
            <el-table-column
            prop="size"
            label="容量(GB)">
            </el-table-column>
            <el-table-column
            prop="model"
            width="180"
            label="型号">
            </el-table-column>
            <el-table-column
            prop="raidId"
            label="RAID ID">
            </el-table-column>
            <el-table-column
            prop="type"
            label="类型">
            </el-table-column>
            <el-table-column
            prop="status"
            label="状态">
            <template slot-scope="scope">
              <div class="status" :class="STATUS_MAP[scope.row.status]?.status"></div>
              <span>{{ STATUS_MAP[scope.row.status]?.label }}</span>
            </template>
            </el-table-column>
            <el-table-column
            label="热备盘">
            <template slot-scope="scope">
              <div  v-if="scope.row.raidId">
                <span
                v-if="scope.row.type == 'Spare'"
                style="color:#409EFF;cursor:pointer"
                @click="onDelete1(scope.$index, scope.row)"><i class="el-icon-delete" style="margin-right: 4px"></i>删除</span>
                <span v-else>--</span>
              </div>
              <div v-else>
                <span
              style="color:#2178C8;cursor:pointer"
                :class="{disabled: STATUS_MAP[scope.row.status]?.label == '异常'}"
                @click="onEdit1(scope.$index, scope.row)"><i class="el-icon-edit-outline" style="margin-right: 4px"></i>编辑</span>
              </div>
             
            </template>
            </el-table-column>
        </el-table>
        <div style="margin: 10px  0">
          <el-button size="small" type="primary" @click="OnCreate2">一键RAID</el-button>
          <el-button size="small" @click="OnCreate1">手动创建</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="RAID管理" widtth="500px" name="second" v-loading="loading5" element-loading-text="正在检查中">
        <el-table
            size="mini"
            :data="tableData2"
            v-loading="loading2"
            element-loading-text="正在加载中"
            tooltip-effect="dark"
            style="width: 100%;min-height: 200px;">
             <el-table-column
            prop="raidId"
            label="ID">
            </el-table-column>
            <el-table-column
            prop="name"
            label="名称">
            </el-table-column>
            <el-table-column
            prop="size"
            label="容量(GB)">
            </el-table-column>
            <el-table-column
            prop="type"
            label="类型">
            </el-table-column>
            <el-table-column
            label="硬盘组成">
             <template slot-scope="scope">
              <div>
                <span v-for="(item,index) in scope.row.workDiskList" :key="item.id">
                    <span class="raid-label" :class="{red: !scope.row.currWorkDiskList.some(it=>it == item.id)}">
                        {{item.id}}
                        <!-- {{index ? "，" + item.id : item.id }} -->
                    </span>
                </span>
              </div>
            </template>
            </el-table-column>
            <el-table-column
            label="热备盘">
            <template slot-scope="scope">
              <span v-for="(item,index) in scope.row.spareDiskList" :key="item.id">
                  <span class="raid-label" 
                    :class="{red: !scope.row.currSpareDiskList.some(it=>it == item.id)}"
                    :style="{color: scope.row.currSpareDiskList.some(it=>it == item.id) ? '' : 'red'}">
                    {{index ? "，" + item.id : item.id }}
                  </span>
              </span>
            </template>
            </el-table-column>
            <el-table-column
            prop="status"
            label="状态" :formatter="parseStatus">
              <template slot-scope="scope">
                <div class="status raid" :class="scope.row.status"></div>
                {{ parseStatus(scope.row) }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
             <template slot-scope="scope">
              <span  v-if="scope.row.status == 'DEGRADED'">
                <el-button 
                  size="mini"
                  type="text"
                  @click="onReplace(scope.$index, scope.row)">更换</el-button>
              </span>
              <span>
              <el-button
                size="mini"
                type="text"
                style="color: red"
                @click="onDelete2(scope.$index, scope.row)"><i class="el-icon-delete" style="margin-right: 4px"></i>删除</el-button>
              </span>
             </template>
            </el-table-column>
            <!-- <el-table-column
            prop="progressValue"
            label="进度">
            </el-table-column> -->
        </el-table>
        <div style="margin: 10px  0">
          <el-button size="small" type="primary" @click="onScanZfs" :disabled="loading2 || loading4 || loading5">检查RAID</el-button>
        </div>
        <div class="disk-info-box">
            <div class="disk-info-title">
                <h2 style="color: #333333;font-size: 14px;">磁盘</h2>
            </div>
            <div class="disk-container">
                <div style="margin-top:63px;width: 16px;height: 112px;background: #143959;" v-if="diskDevList.length>0"></div>
                <div class="disk-list-container">
                    <div class="trapezoid-div">
                       
                    </div>
                    <div style="border: 4px solid #021729;display:flex;width: 100%;flex-wrap: wrap;font-size: 12px;">
                        <div style="display:flex" :class="{'disk-list-item': true, 'disk-list-item-active': item.slot == diskItem.slot ? true: false}" v-for="item in diskDevList" :key="item.slot" @click="diskClick(item)">
                            <span class="dist-slot" style="color:#FFFFFF;font-size: 15px;">{{item.slot}}</span>
                            <span :class="{'state-circle':true, 
                            'normal_title':item.diskState == 1 ? true: false, 
                            'unnormal_title':item.diskState == 2? true: false, 
                            'noaccessnormal_title':item.diskState == 0? true: false}"></span>
                            <span class="state-label" style="color:#FFFFFF">状态</span>
                            <span style="border-radius: 50%" :class="{'state-circle':true, 
                            'normal_title':item.diskState == 1 ? true: false, 
                            'unnormal_title':item.diskState == 2? true: false, 
                            'noaccessnormal_title':item.diskState == 0? true: false}"></span>
                            <span class="state-label" style="color:#FFFFFF">电源</span>
                        </div>
                    </div>
                </div>
                <div style="margin-top:63px;width: 16px;height: 112px;background: #143959;" v-if="diskDevList.length>0"></div>
            </div>
            <div class="select-info">
                <div class="select-info-content" style="color: #626262">
                    <div style="float:left;">
                      <span style="margin-right: 10px">盘号：{{diskItem.slot}}</span>
                      <span style="margin-right: 10px">磁盘容量：{{diskItem.diskTotalMem}} GB</span>
                      <span style="margin-right: 10px">磁盘标识信息：{{diskItem.serialNum}}</span>
                      <span style="margin-right: 10px">磁盘温度：{{diskItem.diskTmp}} °C</span>
                    </div>
                    <div class="status-tag-box">
                      <div class="state-item">
                          <span class="state-circle normal_title"></span>
                          <span style="color: #626262">正常</span>
                      </div>
                      <div class="state-item">
                          <span class="state-circle unnormal_title"></span>
                          <span style="color: #626262">异常</span>
                      </div>
                      <div class="state-item">
                          <span class="state-circle noaccessnormal_title"></span>
                          <span style="color: #626262">未接入</span>
                      </div>
                  </div>
                </div>
            </div>
        </div>
      </el-tab-pane>

    </el-tabs>
    <el-dialog title="手动创建" :append-to-body="true"  :close-on-click-modal="false"  width="500px" :visible.sync="dialogVisible1">
      <el-form v-loading="loading0"
            element-loading-text="正在创建中" :model="form1" size="mini" label-width="120px">
         <el-form-item label="RAID名称" >
          <el-input v-model="form1.name" autocomplete="off"  style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="RAID类型" >
          <el-select v-model="form1.type" placeholder="请选择" style="width: 200px">
            <el-option label="RAID0" value="RAID0"></el-option>
            <el-option label="RAID1" value="RAID1"></el-option>
            <el-option label="RAID5" value="RAID5"></el-option>
            <el-option label="RAID6" value="RAID6"></el-option>
            <el-option label="RAID10" value="RAID10"></el-option>
            <el-option label="RAID50" value="RAID50"></el-option>
            <el-option label="RAID60" value="RAID60"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="物理硬盘" >
          <span>{{form1.diskId}}</span>
        </el-form-item>
         <el-form-item label="总容量" >
          <span>{{form1.size}}（GB）</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible1 = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="onSaveForm1">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="一键RAID" :append-to-body="true"  :close-on-click-modal="false"  width="500px" :visible.sync="dialogVisible2">
      <el-form v-loading="loading"
            element-loading-text="正在创建中" :model="form2" size="mini" label-width="120px">
         <el-form-item label="RAID类型" >
          <el-input v-model="form2.type" disabled autocomplete="off"  style="width: 200px"></el-input>
        </el-form-item>
         <el-form-item label="RAID名称" >
          <el-input v-model="form2.name" autocomplete="off"  style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="热备盘数量" >
          <el-select v-model="form2.spareDiskCount" placeholder="请选择" style="width: 200px">
            <el-option label="0" value=0></el-option>
            <el-option label="1" value=1></el-option>
            <el-option label="2" value=2></el-option>
            <el-option label="3" value=3></el-option>
            <el-option label="4" value=4></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物理硬盘" >
          <span>{{form2.diskId}}</span>
        </el-form-item>
        <el-form-item label="总容量" >
          <span>{{form2.size}}（GB）</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible2 = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="onSaveForm2">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="热备盘配置" :append-to-body="true"  :close-on-click-modal="false"  width="500px" :visible.sync="dialogVisible3">
      <el-form :model="form3" v-loading="loading3" size="mini" label-width="120px">
        <el-form-item label="RAID ID" >
          <el-select v-model="form3.id" placeholder="请选择" style="width: 200px">
            <el-option v-for="item in tableData2" :label="item.raidId" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible3 = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="onSave3">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="更换" :append-to-body="true"  :close-on-click-modal="false"  width="500px" :visible.sync="dialogVisible4">
      <el-form :model="form4" size="mini" label-width="120px">
        <!-- 损坏盘-->

        <el-form-item label="新盘" >
          <el-select v-model="form4.newIds" multiple placeholder="请选择" style="width: 200px">
            <el-option v-for="item in diskIdleList" :label="item.diskId" :value="item.diskId" :key="item.diskId"></el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible4 = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="onSave4">确 定</el-button>
      </div>
    </el-dialog>
   </div>
</template>
<script>
import { getStorageRaid, postStorageRaid,deleteStorageRaid,getDiskraidinfo,getDevinfo, setStorageRaidSpare, deleteStorageRaidSpare, scanZfs} from '@/api/systemAPI';
import { join } from 'path';
export default {
  name: 'partybuffalo',
  data(){
    return {
        STATUS_MAP: {
          1: {
            label: '正常',
            status: 'success'
          },
          2: {
            label: '异常',
            status: 'danger'
          },
        },
        activeName: 'first',
        tableData: [],
        tableData2: [],
        diskIdleList: [],
        multipleSelection:[],
        form1: {
          name: '',
          type: '',
          diskId: '',
          size: '',
        },
        form2: {
          name: '',
          type: 'RAID6',
          diskId: '',
          size: '',
          spareDiskCount: 0,
        },
        form3: {
          diskId: '',
          id: ''
        },
        form4: {
          newIds: [],
          id: ''
        },
        dialogVisible1: false,
        dialogVisible2: false,
        dialogVisible3: false,
        dialogVisible4: false,
        gridData1: [],
        diskDevList: [],
        diskItem: {},
        loading2: false,
        loading1: false,
        loading: false,
        loading0:false,
        loading3:false,
        loading4:false,
        loading5:false,
    }
  },
  created() {
  },
  mounted(){
    this.queryDiskraidinfo()
    this.queryStorageRaid()
    this.queryDevinfo()
  },
  methods: {
    // 获取raid列表
    queryDiskraidinfo(){
      this.tableData = []
      this.loading1 = true
      getDiskraidinfo().then(res => {
        this.loading1 = false
        if(res.data.code === 200000) {
          this.tableData = res.data.data.diskRaidList
        }
      }).catch(err=>{
        this.loading1 = false
      })
    },
    selected(row, index) {
      if (row.raidId != '' || this.STATUS_MAP[row.status]?.label === '异常') {
        return false //不可勾选
      } else {
        return true; //可勾选
      }
    },
    // 获取raid管理列表
    queryStorageRaid(){
      this.tableData2 = []
      this.loading2 = true
      getStorageRaid().then(res => {
        this.loading2 = false
        if(res.data.code === 200000) {
          this.tableData2 = res.data.data.raidList
        }
      }).catch(err=>{
        this.loading2 = false
      })
    },

    // 更换RAID
    onReplace(Index,row){
      this.form4.newIds = []
      this.diskIdleList = this.tableData.filter(item=>!item.raidId)
      this.tableData2.forEach(item=>{
        item.workDiskList.forEach(item2=>{
          if (!item.currWorkDiskList.some(it=>it == item2.id)) {
            this.diskIdleList.push({diskId: item2.id})
          }
        })
      })
      this.diskIdleList.sort((a,b)=>{return a.diskId-b.diskId});
      this.dialogVisible4 = true
      this.form4.id = row.id
    },
    // 删除Raid
    onDelete2(Index,row){
       this.$confirm('是否确定删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           deleteStorageRaid(row.id).then(res => {
            this.$message({
              showClose:true,
              message: '删除成功！',
              type: "success"
            })
            this.queryStorageRaid()
            this.queryDiskraidinfo()

          }).catch(error => {
            this.$message({
              showClose:true,
              message: '删除失败！',
              type: "error"
            })
          })
        })
     
    },
    handleClick(){

    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    parseStatus(row) {
      if (row.status == "ONLINE") {
        return "正常"
      } else if (row.status == "DEGRADED") {
        return "降级"
      }  else if (row.status == "SUSPENDED") {
        return "挂起"
      } else {
        return row.status ? ("异常(" + row.status + ")") : '异常'
      }
    },
    // 热备盘添加
    onEdit1(Index,row) {
      if(this.STATUS_MAP[row.status]?.label == '异常') {
        return
      }
      this.dialogVisible3 = true
      this.form3.diskId = row.diskId
    },
    // 热备盘删除
    onDelete1(Index,row) {
      let disk = {}
      disk.id = row.diskId
      let obj={
        spareDiskList: [disk]
      }
      this.$confirm('是否确定删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.loading0 = true
            deleteStorageRaidSpare(row.raidRowId, obj).then(res=> {
              this.loading0 = false
              if(res.data.code == 200000){
                this.$message({
                  showClose: true,
                  message: '保存成功！',
                  type: 'success'
                })
                this.queryDiskraidinfo()
                this.queryStorageRaid()

              } else {
                this.$message({
                  showClose: true,
                  message: '保存失败！',
                  type: 'error'
                })
              }
            }).catch(()=>{
              this.loading0 = false
              this.$message({
                  showClose: true,
                  message: '保存失败！',
                  type: 'error'
                })
            })
          }
        )},
    // 热备盘保存
    onSave3() {
      let disk = {}
      disk.id = this.form3.diskId
      let obj={
        spareDiskList: [disk]
      }
      this.loading3 = true
      setStorageRaidSpare(this.form3.id, obj).then(res=> {
        this.loading3 = false
        if(res.data.code == 200000){
          this.$message({
            showClose: true,
            message: '保存成功！',
            type: 'success'
          })
          this.queryDiskraidinfo()
          this.queryStorageRaid()

          this.dialogVisible3 = false
        } else {
           this.$message({
            showClose: true,
            message: '保存失败！',
            type: 'error'
          })
        }
      }).catch(()=>{
        this.loading0 = false
         this.$message({
            showClose: true,
            message: '保存失败！',
            type: 'error'
          })
      })
    },
    // 手动创建
    OnCreate1() {
      if(this.multipleSelection.length == 0) {
        this.$message({
          showClose:true,
          message: '请先选择硬盘',
          type: 'warning'
        })
      } else {
        let diskIdStr = ''
        let sizeNum = 0
        this.multipleSelection.forEach(item => {
          diskIdStr= diskIdStr ? diskIdStr + "," + item.diskId : item.diskId 
          sizeNum = sizeNum + Number(item.size)
        })
        // 回显数据
        this.form1 = {
          name: '',
          type: '',
          diskId: diskIdStr+"",
          size: sizeNum,
        }
        this.dialogVisible1 = true
      }
    },

    checkDiskNum(raid, diskNumber)  {
      if (raid == "RAID1") {
        if (diskNumber < 2) {
          this.$message({showClose: true,message: '除去热备盘，至少应选择2块硬盘',type: 'error'})
          return false;
        }
      } else if (raid == "RAID5") {
        if (diskNumber < 3) {
          this.$message({showClose: true,message: '除去热备盘，至少应选择3块硬盘',type: 'error'})
          return false;
        }
      } else if (raid == "RAID6") {
        if (diskNumber < 4) {
          this.$message({showClose: true,message: '除去热备盘，至少应选择4块硬盘',type: 'error'})
          return false;
        }
      } else if (raid == "RAID10") {
        if (diskNumber < 4 || (diskNumber % 2 != 0)) {
          this.$message({showClose: true,message: '除去热备盘，至少应选择4块硬盘，且数量为偶数个',type: 'error'})
          return false;
        }
      } else if (raid == "RAID50") {
        if (diskNumber < 6 || (diskNumber % 3 != 0)) {
          this.$message({showClose: true,message: '除去热备盘，至少应选择6块硬盘，且数量为3的倍数',type: 'error'})
          return false;
        }
      } else if (raid == "RAID60") {
        if (diskNumber < 8 || (diskNumber % 4 != 0)) {
          this.$message({showClose: true,message: '除去热备盘，至少应选择8块硬盘，且数量为4的倍数',type: 'error'})
          return false;
        }
      }

      return true
    },

    // 手动创建保存
    onSaveForm1() {

      let arr0 = this.form1.diskId.length == 1 ? [this.form1.diskId] : this.form1.diskId.split(",")
      let arr = arr0.map(Number)
      let arrN = []
      arr.forEach(item => {
        arrN.push({id: item})
      })

      if (!this.checkDiskNum(this.form1.type, arrN.length)) {
        return 
      }
      let obj={
        name: this.form1.name,
        type: this.form1.type,
        diskList: arrN,
        spareDiskCount: 0,
      }
      this.loading0 = true
      postStorageRaid(obj).then(res=> {
        this.loading0 = false
        if(res.data.code == 200000){
          this.$message({
            showClose: true,
            message: '保存成功！',
            type: 'success'
          })
          this.queryDiskraidinfo()
          this.queryStorageRaid()

          this.dialogVisible1 = false
        } else {
           this.$message({
            showClose: true,
            message: '保存失败！',
            type: 'error'
          })
        }
      }).catch(()=>{
        this.loading0 = false
         this.$message({
            showClose: true,
            message: '保存失败！',
            type: 'error'
          })
      })
    },
   
    // 一键RAID
    OnCreate2() {
        if(this.multipleSelection.length == 0) {
        this.$message({
          showClose:true,
          message: '请先选择硬盘',
          type: 'warning'
        })
      } else if(this.multipleSelection.length<4) {
         this.$message({
          showClose:true,
          message: '磁盘数量不足，至少选择四块硬盘',
          type: 'warning'
        })
      }else {
        let sizeArr = []
        this.multipleSelection.forEach(item => {
          if(sizeArr.indexOf(item) == -1) {
            sizeArr.push(Number(item.size))
          }
        })
        if(sizeArr.length == 1){
          this.$message({
            showClose:true,
            message: '请选择相同容量磁盘',
            type: 'warning'
          })
          return
        }
        let diskIdStr = ''
        let sizeNum = 0
        this.multipleSelection.forEach(item => {
          diskIdStr= diskIdStr ? diskIdStr + "," + item.diskId : item.diskId 
          sizeNum = sizeNum + Number(item.size)
        })
        // 回显数据
         this.form2 = {
          name: '',
          type: 'RAID6',
          spareDiskCount: 0,
          diskId: diskIdStr,
          size: sizeNum,
        }
        this.dialogVisible2 = true
      }
    }, 
    // 一键创建保存
    onSaveForm2() {
      let arr0 = this.form2.diskId.length == 1 ? [this.form2.diskId] : this.form2.diskId.split(",")
      let arr = arr0.map(Number)
      let arrN = []
      arr.forEach(item => {
        arrN.push({id: item})
      })

      if (!this.checkDiskNum(this.form2.type, arrN.length - this.form2.spareDiskCount)) {
        return 
      }

      let obj={
        name: this.form2.name,
        type: this.form2.type,
        diskList: arrN,
        spareDiskCount: Number(this.form2.spareDiskCount),
      }
      this.loading  = true
      postStorageRaid(obj).then(res=> {
        this.loading = false
        if(res.data.code == 200000){
          this.$message({
            showClose: true,
            message: '保存成功！',
            type: 'success'
          })
          this.queryDiskraidinfo()
          this.queryStorageRaid()

          this.dialogVisible2 = false
        } else {
          this.$message({
            showClose: true,
            message: '保存失败！',
            type: 'error'
          })
        }
      }).catch(err=> {
        this.loading = false
        this.$message({
            showClose: true,
            message: '保存失败！',
            type: 'error'
          })
      })
    },
    // 获取磁盘列表
    queryDevinfo() {
      this.diskDevList = []
      getDevinfo().then(res => {
        if(res.data.code == 200000) {
          this.diskDevList = res.data.data
        }
      })
    },
    //磁盘选中
    diskClick(record){
      this.diskItem = record
    },
    // 换盘
    onSave4() {
      let disks = []
      this.form4.newIds.forEach((item,index,arr)=> {
        let disk = {}
        disk.id = item
        disks.push(disk)
      })
      let obj={
        spareDiskList: disks
      }
      this.loading4 = true
      setStorageRaidSpare(this.form4.id, obj).then(res=> {
        this.loading4 = false
        if(res.data.code == 200000){
          this.$message({
            showClose: true,
            message: '保存成功！',
            type: 'success'
          })
          this.queryDiskraidinfo()
          this.queryStorageRaid()

          this.dialogVisible4 = false
        } else {
           this.$message({
            showClose: true,
            message: '保存失败！',
            type: 'error'
          })
        }
      }).catch(()=>{
        this.loading4 = false
         this.$message({
            showClose: true,
            message: '保存失败！',
            type: 'error'
          })
      })

    },
    // scan zfs
    onScanZfs() {
      this.loading5 = true
      scanZfs().then(res=> {
        this.loading5 = false
        if(res.data.code == 200000){
          this.$message({
            showClose: true,
            message: '检查成功！',
            type: 'success'
          })
          this.queryDiskraidinfo()
          this.queryStorageRaid()
          this.queryDevinfo()
        } else {
           this.$message({
            showClose: true,
            message: '检查失败！',
            type: 'error'
          })
        }
      }).catch(()=>{
        this.loading5 = false
         this.$message({
            showClose: true,
            message: '检查失败！',
            type: 'error'
          })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.partybuffalo{
    height: 100%;
    .disabled {
      cursor: not-allowed !important;
    }
}
.disk-info-box{
    padding: 10px;
    border: 1px solid #ddd;
    margin-top: 30px;
    font-size: 14px;
    display: inline-block;
    width: calc(100% - 30px);
    min-width: 750px;
    background: #EFF3FB;
}
.disk-info-title{
    height: 60px;
    justify-content: space-between;
    display: flex
}
.status-tag-box{
    display: flex;
    justify-content: space-around;
    width: 260px;
    float: right;
}
.normal_title{
    background: #0f0;
}
.state-circle{
    width: 10px;
    height: 10px;
    display: inline-block;
    border: 1px solid #ddd;
    // border-radius: 50%;
    margin-right: 6px;
    margin-top: 3px;
}
.unnormal_title{
    background: red;
}
.noaccessnormal_title{
    background: #ccc;
}
.disk-container{
    display: flex;
    justify-content: center;
}
.select-info{
    display: flex;
    justify-content: center;
}
.select-info-content{
  width: 800px;
  height: 42px;
  line-height: 42px;
  font-size: 12px;
  border-top: 1.5px solid;
  border-bottom: 1.5px solid;
  border-image: linear-gradient(45deg, #EFF3FB 0%, #2178C8 50%, #EFF3FB 100%) 2 2 2 2; 
}
.disk-list-container{
    width: 800px;
    // padding: 0 35px;
    margin: 10px 0;
    min-height: 120px;
    overflow-y: auto;
    position: relative;
    display: flex;
    flex-flow: row wrap;
    align-content: flex-start;
}
.trapezoid-div{
    width: 100%;
    height: 50px;
    border: 1px solid #797979;
    transform: perspective(20px) rotateX(2deg) scaleY(1);
    background: #5E80A0;
    transform-origin: bottom;
}
.disk-list-item{
    width: 25%;
    height: 35px;
    padding: 5px 5px;
    border-top: 2px solid #021729;
    border-left: 2px solid #021729;
    background: #18476F;
    box-sizing: border-box;
}
    
.disk-list-item span{
    vertical-align: top;
} 
.state-item span{
    vertical-align: top;
    margin-top: 15px;
}
.disk-list-item:hover{
    cursor: pointer;
    background: #2988DF;
}
.disk-list-item-active{
    background: #2988DF;
}
.dist-slot,.state-label{
    margin-right: 10px;
    width: 30px;
}
.status {
  width: 10px;
  height: 10px;
  display: inline-block;
  background: transparent;
  border: 2px solid transparent;
  border-radius: 50%;
  margin-right: 4px;
  &.raid {
    background: #f56c6c;
    border-color: #fbc4c4;
  }
  &.success {
    background: #67c23a;
    border-color: #c2e7b0;
  }

  &.danger {
    background: #f56c6c;
    border-color: #fbc4c4;
  }

  &.ONLINE {
    background: #67c23a;
    border-color: #c2e7b0;
  }
  &.DEGRADED {
    background: #909399;
    border-color: #d3d4d6;
  }
  &.SUSPENDED {
    background: #e6a23c;
    border-color: #f5dab1;
  }
}
.raid-label {
  background: #E6F7FF;
  color: #1890FF;
  border-radius: 2px;
  border: 1px solid #2178C8;
  padding: 0 4px;
  box-sizing: border-box;
  margin-right: 3px;
  margin-bottom: 3px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  word-break: normal;

  &.red {
    color: #FF4D4F;
    background: #FFF1F0;
    border: 1px solid #FFA39E;
  }
}
</style>
