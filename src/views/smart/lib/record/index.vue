<template>
  <div>
    <div class="flexRowBetween" style="width: calc(100vw - 444px)">
      <!-- 操作 -->
      <div class="oprTop" v-if="!isBatchDelMode">
        <button class="button" @click="showAddDialog">
          <i class="el-icon-plus"></i>
          <span>{{ libType === 1 ? $t("addFace") : $t("addVehicle") }}</span>
        </button>

        <button class="button ml20" type="button" @click="showBatchImport" v-if="libType === 1">
          <i class="el-icon-download"></i>
          <span>{{ $t("batchExport") }}</span>
        </button>
        <button class="button ml20" type="button" @click="downloadTemp" v-if="libType === 2 && !isLocal">
          <i class="el-icon-folder iconR"></i>
          <span>模板下载</span>
        </button>

        <button class="button delButton btnL" @click="showBatchDel" v-if="libType === 1">
          <i class="el-icon-delete"></i>
          <span>{{ $t("batchDelete") }}</span>
        </button>
        <button class="button btnL" @click="UploadTemp" v-if="libType === 2">
          <i class="el-icon-download"></i>
          <span>批量导入</span>
        </button>
        <button class="button delButton btnL" @click="vehicleDelAll" v-if="libType === 2">
          <i class="el-icon-delete"></i>
          <span>{{ $t("batchDelete") }}</span>
        </button>
      </div>
      <!-- 批量删除-全选/确定/取消 -->
      <div class="oprTop" v-if="isBatchDelMode">
        <button class="button" @click="btnDelCancel">
          <span>{{ $t("cancel") }}</span>
        </button>
        <button class="button btnL" @click="batchDelete">
          <span>{{ $t("confirm") }}</span>
        </button>
        <button class="button btnL" @click="btnDelSelectAll">
          <span>{{ $t("chooseAll") }}</span>
        </button>
      </div>

      <!-- 搜索 -->
      <div class="searchBox" v-if="libType === 1">
        <el-input
          class="input searchInput"
          size="mini"
          prefix-icon="el-icon-search"
          v-model="searchVal"
          :placeholder="$t('PleaseEnterSearchKw')"
        />
      </div>
    </div>
    <!-- 人脸列表 -->
    <div v-show="libType === 1"
         class="faceBox"
         style="width: calc(100vw - 444px); height: calc(100vh - 350px);"
    >
      <div class="picContainer"
           v-for="(item, index) of faceData"
           :key="index"
           :class="{ active: selectedPersonIds.indexOf(item.id) > -1 }"
           @click="selectPerson(item.id)"
      >
        <img :src="item.imagePath"
             width="142"
             height="142"
             :onerror="errorImg"
        />
        <div class="picName">
          <div class="faceName ellipsis">{{ item.name }}</div>
          <div class="faceName ellipsis">{{ item.description }}</div>
        </div>
        <i class="el-icon-close picDelete" v-if="iconDel" @click="showFaceDelete(item.id)"></i>

        <img
          class="picChoose"
          src="../img/choose.png"
          v-if="iconCh && !selectedPersonIds.indexOf(item.id) > -1"
          @click="showChe"
        />
        <img
          class="picChoose"
          src="../img/check.png"
          v-if="iconCh && selectedPersonIds.indexOf(item.id) > -1"
          @click="showChe"
        />
        <span class="picEdit" @click="showEditFace(item)"> {{ $t("modify") }} </span>
      </div>
    </div>

    <div
      v-show="libType === 2"
      style="width: calc(100vw - 444px); height: calc(100vh - 280px);"
      class="faceBox"
    >
      <el-table
        :data="vehicleData"
        :header-cell-style="tableHeaderColor"
        :cell-style="cellStyle"
        size="medium"
        :fit="true"
        stripe
        style="width:100%"
        @selection-change="handleSelectionChange"
      >
        <!--第一列checkbox-->
        <el-table-column type="selection" width="80" align="center"></el-table-column>
        <el-table-column prop="vehicleID" label="车牌号码" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="name" label="车主姓名" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="description" label="备注" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click.native.prevent="tableEdit(scope.$index, vehicleData)">
              <i class="el-icon-edit" style="color:#3A74FF;font-size:12px"></i>
            </el-button>
            <el-button type="text" @click.native.prevent="tableDelete(scope.$index, vehicleData)">
              <i class="el-icon-delete" style="color:#3A74FF;font-size:12px"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- face弹框 -->
    <el-dialog
      :title="$t(dialogTitle)"
      :before-close="handleFaceClose"
      :close-on-click-modal="false"
      width="600px"
      :visible.sync="dialogFaceVisible"
      @close="closeDialog('faceForm')"
    >
      <el-form
        :inline="true"
        :model="faceForm"
        ref="faceForm"
        label-width="75px"
        label-position="right"
      >
        <el-form-item class="faceImgBox">
          <img
            ref="imgFace"
            v-if="imgShow"
            class="img faceImg"
            width="160"
            height="170"
            :src="faceImagePath"
            :onerror="errorImg"
          />
          <i class="el-icon-close iconRemove" v-if="imgShow" @click="removeImg"></i>
          <el-upload
            action
            v-if="!imgShow && !isLocal"
            :before-upload="beforeAvatarUpload"
            list-type="picture"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="changeFile"
            accept=".jpg, .jpeg, .png, .bmp"
            class="imgUp"
          >
            <div class="rowColCenter" style="width:160px;height:160px;">
              <i class="el-icon-plus" style="font-size:48px;color:#DBDCE7"></i>
            </div>
          </el-upload>
          <div v-else-if="!imgShow && isLocal">
            <button class="cancelBtn" type="button" @click="addSingleFace" style="margin-top: 100px; margin-left: 80px;">
              <span>选择文件</span>
            </button>
            <exportDlg ref="exportDlg"></exportDlg>
          </div>  
        </el-form-item>
        <el-form-item
          :label="$t('fullName')"
          prop="name"
          class="mt10"
          :rules="[
            {
              required: true,
              message: $t('LibNameCannotBeEmpty'),
              trigger: 'blur',
            },
          ]"
        >
          <input
            v-model="faceForm.name"
            class="input inputSys inputD"
            :placeholder="$t('pleaseEnterName')"
          />
        </el-form-item>
        <el-form-item
          :label="$t('subLib')"
          prop="repoID"
          style="margin-top:-12px"
          :rules="[
            {
              required: true,
              message: $t('libCannotBeEmpty'),
              trigger: 'blur',
            },
          ]"
        >
          <el-select v-model="faceForm.repoID" disabled style="width:216px;">
            <el-option
              v-for="(item, key) of libMenu"
              :key="key"
              :label="item.name"
              :value="item.id"
            >{{ item._name }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="ID" prop="faceID" style="margin-top:-12px">
          <input
            v-model="faceForm.faceID"
            v-if="dialogTitle === 'addFace'"
            class="input inputSys inputD"
            :placeholder="$t('pleaseEnterID')"
          />
          <input
            v-else
            v-model="faceForm.faceID"
            class="input inputSys inputD inputDisabled"
            placeholder
            disabled
          />
        </el-form-item>
        <el-form-item :label="$t('remark')" style="margin-top:-6px">
          <el-input
            v-model="faceForm.description"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 2 }"
            style="width:216px;"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="btnBoxBoder">
        <button class="cancelBtn" @click="dialogFaceVisible = false">{{ $t("cancel") }}</button>
        <button
          class="save"
          style="width: 80px; height: 28px; background-color: #3a74ff; border: none; color: white;"
          :disabled="btnDisabled"
          :class="{ active: btnDisabled === true }"
          @click="submit('faceForm')"
        >{{ $t("save") }}</button>
      </div>
    </el-dialog>

    <!-- 车辆弹框 -->
    <el-dialog
      title="车辆入库"
      width="420px"
      :visible.sync="dialogVehicleVisible"
      :close-on-click-modal="false"
      @close="closeDialog('vehicleForm')"
    >
      <el-form
        :inline="true"
        :model="vehicleForm"
        ref="vehicleForm"
        label-width="110px"
        label-position="right"
      >
        <el-form-item
          label="车牌号码"
          prop="vehicleID"
          class="mt10"
          :rules="[
            {
              required: true,
              message: $t('vehicleIDCannotBeEmpty'),
              trigger: 'blur',
            },
          ]"
        >
          <input
            v-model="vehicleForm.vehicleID"
            v-if="dialogTitle === 'addVehicle'"
            class="input inputSys inputD"
          />
          <input
            v-else
            v-model="vehicleForm.vehicleID"
            class="input inputSys inputD inputDisabled"
            placeholder
            disabled
          />
        </el-form-item>
        <el-form-item
          :label="$t('subLib')"
          prop="repoID"
          style="margin-top:-12px"
          :rules="[
            {
              required: true,
              message: $t('libCannotBeEmpty'),
              trigger: 'blur',
            },
          ]"
        >
          <el-select v-model="vehicleForm.repoID" style="background: none !important; box-shadow: none !important;width:216px;">
            <el-option
              v-for="(item, key) of libMenu"
              :key="key"
              :label="item.name"
              :value="item.id"
              style="width:230px"
            >{{ item._name }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车主姓名" prop="name" style="margin-top:-12px">
          <input v-model="vehicleForm.name" class="input inputSys inputD" placeholder />
        </el-form-item>
        <el-form-item label="备注" prop style="margin-top:-12px">
          <input v-model="vehicleForm.description" class="input inputSys inputD" placeholder />
        </el-form-item>
      </el-form>
      <div class="btnBoxBoder">
        <button class="cancelBtn" @click="dialogVehicleVisible = false">{{ $t("cancel") }}</button>
        <button
          class="save"
          style="width: 80px; height: 28px; background-color: #3a74ff; border: none; color: white;"
          :disabled="btnDisabled"
          :class="{ active: btnDisabled === true }"
          @click="submit('vehicleForm')"
        >{{ $t("save") }}</button>
      </div>
    </el-dialog>

    <el-dialog
      width="360px"
      title="请输入密码"
      :visible.sync="innerVisible"
      :close-on-click-modal="false"
      style="top:200px"
      append-to-body
    >
      <el-col style="padding: 30px">
        <label>密码</label>
        <input
          v-model="password"
          type="password"
          style="width:200px;height:24px;margin-left:30px"
          class="input inputSys inputLab"
        />
      </el-col>
      <button class="delButton pasDel" @click="innerVisible = false">{{ $t("cancel") }}</button>
      <button class="button" @click="pasSub" style="margin-left:15px">{{ $t("confirm") }}</button>
    </el-dialog>

    <!-- 批量导入人脸 -->
    <div class="batchBox">
      <el-dialog
        width="580px"
        :title="batchImportTitle"
        :visible.sync="batchImportVisible"
        :close-on-click-modal="false"
        :showClose="true"
        style="top:100px;z-index:2046"
        class="batchImport"
        append-to-body
      >
        <div class="input-zone rowStart" style="padding:0 0 30px 20px;" v-if="!isLocal">
          <button class="cancelBtn" type="button" style="margin-top:6px; margin-left: 0px !important;">
            <span>选择文件</span>
          </button>
          <input type="file"
                 name="file"
                 accept=".jpg, .jpeg, .png, .bmp"
                 class="delButton"
                 placeholder="请选择文件"
                 @change="batchExport"
                 multiple="multiple"
                 style="margin-left:30px;width:90px"
                 :disabled="batchImportBtn"
          />
        </div>
        <div v-else-if="isLocal && (!imgList || imgLength === 0)">
          <button class="cancelBtn" type="button" @click="fileImport" style="margin-top:6px; margin-left: 0px !important;">
            <span>选择文件</span>
          </button>
          <exportDlg ref="exportDlg"></exportDlg>
        </div>                 
        <div v-if="imgLength > 0">
          <div class="flexRowBetween" style="width:470px;padding:0 0 20px 30px">
            <span style="margin-right: 80px;">上传成功: {{ (faceImport && faceImport.successed) || 0 }}张</span>
            <span style="margin-right: 80px;">上传失败: {{ (faceImport && faceImport.failed) || 0 }}张</span>
            <span>上传总数: {{ imgLength }}张</span>
          </div>

          <div v-if="failedList.length"
               style="width:470px;height:50px;padding:0 0 10px 40px;overflow:auto;"
          >
            <div style="font-weight:600;color:#FF4500">失败详情:</div>
            <div v-for="(item, index) in failedList" :key="index">
              姓名: {{ item.name }}, faceID: {{ item.faceID }}, 备注: {{ item.description }}
            </div>
          </div>
          <div class style="width:470px;padding:10px 0 30px 40px">
            <el-progress :text-inside="true" :stroke-width="18"
                         :percentage="Math.floor((((faceImport && faceImport.successed + faceImport.failed) 
                                                    || 0) / imgList.length) * 100)"
            ></el-progress>
          </div>

          <div class="flexRowBetween" style="width:470px;padding:0 0 20px 40px">
            <button
              class="button save"
              @click="batchStart"
              :disabled="batchImportBtn"
              :class="{ active: batchImportBtn === true }"
            >开始上传</button>
            <button class="button" @click="batchEnd">结束上传</button>
          </div>
        </div>
      </el-dialog> 
    <!-- 批量导入车辆信息 -->
    <div class="vehicleBox" >
      <el-dialog width="480px"
                 :title="vehicleImportTitle"
                 :visible.sync="vehicleImportVisible"
                 :close-on-click-modal="false"
                 :showClose="false"
                 style="top:100px;z-index:2046"
                 class="batchImport"
                 append-to-body
      >
        <div class=" rowStart" v-if="!isLocal" style="padding:20px 60px;" id="vehicleBox"
          v-loading="vehicleLoading"
          element-loading-text="正在导入车辆信息"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255, 255, 255, 0.6)">
           <el-upload
              class="upload-demo"
              ref="vehicle-upload"
              drag
              action="https://jsonplaceholder.typicode.com/posts/"
              multiple
              accept=".xlsx"
              :on-exceed="exceed"
              :limit="1"
              :on-remove="remove"
              :http-request="uploadFile"
            >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">每次只能上传1个xlsx文件，且不超过500kb</div>
          </el-upload>
        </div>

        <div v-else-if="isLocal && !this.listTable.length">
          <el-button size="small" class="import-button" @click="vehicleFileImport">导入</el-button>
          <exportDlg ref="exportDlg"></exportDlg>
        </div>
        <div>
          <div v-if="listTable.length && !errorListTable.length" style="width:360px;padding:0 0 20px 60px">
            <el-progress
              :text-inside="true"
              :stroke-width="18"
              :percentage="countVal"
            ></el-progress>
          </div>
          <div
            style="width:360px;height:50px;padding:0px 0px 20px 60px;overflow:auto;"
            v-if="errorListTable.length"
          >
            <div style="font-weight:600;color:#FF4500">失败详情:</div>
            <div v-for="(item, index) in errorListTable" :key="index">
             第{{item.rowIndex}}行，{{item.msg}}；
            </div>
          </div>
          <div class="flexRowBetween" style="width:360px;padding:0 0 20px 60px" v-if="!isLocal || listTable.length > 0">
            <button
              class="button save"
              @click="vehicleStart"
              :disabled="vehicleImportBtn"
              :class="{ active: vehicleImportBtn === true }"
            >开始上传</button>
            <button class="button" @click="vehicleEnd">结束上传</button>
          </div>
        </div>
      </el-dialog>
    </div>
    </div>
  </div>
</template>

<script>
import md5 from "js-md5";
import { debounce } from "../utils/debounce";
import { faceApi, vehicleApi } from "@/api/lib";
import * as XLSX from 'xlsx/xlsx.mjs'
import { getAppMode } from '../utils/appMode'
import exportDlg from '@/views/playback/components/export.vue';
import bus from '@/utils/eventBus'
const { export_json_to_excel } = require('../utils/excel/Export2Excel');
export default {
  props: {
    faceData: {
      type: Array,
      required: true
    },
    vehicleData: {
      type: Array,
      required: false
    },
    libMenu: {
      type: Array,
      required: true
    },
    filterParams: {
      type: Object,
      required: true
    },
    currentLibId: {
      type: Number,
      required: false
    },
    libType: {
      type: Number,
      required: false
    }
  },
  inject: [ "reload"],
  data() {
    return {
      size: {
        contentWidth: window.innerWidth,
        contentHeight: window.innerHeight
      },
      isLocal: false,
      // 右config
      searchVal: "",
      // 右face
      errorImg: 'this.src="' + require("@/assets/img/stranger.png") + '"',
      dialogTitle: "addFace",
      dialogFaceVisible: false,
      dialogVehicleVisible: false,
      faceForm: {},
      vehicleForm: {},
      imgShow: false,
      faceImagePath: "",
      isImgChange: false,
      iconDel: true,
      iconCh: false,
      selectedPersonIds: [], // 选中的人员id
      isBatchDelMode: false,
      isChannelMode: false,
      btnDisabled: false,
      innerVisible: false,
      password: "",
      deleteFaceId: "",
      editFaceItem: {},
      oprType: "",
      batchImportVisible: false,
      vehicleImportVisible: false,

      imgList: [],
      failedList: [],
      imgLength: 0,
      batchImportTitle: "批量导入",
      vehicleImportTitle: "批量导入",
      batchImportBtn: false,
      vehicleImportBtn: true,
      vehicleFile: null,
      listTable: [],
      errorListTable: [
      ],
      vehicleLoading: false,
      multipleSelection: [],
      count: 0,
      countArrLen: 1,
      countDataArr: [],
      faceList: [],
      // imgListLength: 0,
      // faceImport: {}
    };
  },
  created() {
    // 搜索500ms延时
    this.$watch(
      "searchVal",
      debounce(newQuery => {
        this.search();
      }, 500)
    );
    this.isLocal = JSON.parse(localStorage.getItem('isLocal'))
    this.localPath = ''
    bus.$on('closed', (result) => {
      if (!result.ok) {
        return
      }
      this.localPath = result.path
      if(result.file) {
        this.file = result.file
        this.changeFile(this.file)
      } else if (result.excelFile) {
        this.excelFile = result.excelFile
        this.uploadFile(this.excelFile)
      } else {
        this.faceList = result.list
        this.localBatchExport(this.faceList)
      }
    })
  },
  methods: {
    addSingleFace() {
      this.exportVis = true
      this.fileType = 'image'
      this.singleImage = true
      this.$refs['exportDlg'].init(this.exportVis, true, this.fileType, this.singleImage)
    },
    vehicleFileImport() {
      this.exportVis = true
      this.fileType = 'excel'
      this.$refs['exportDlg'].init(this.exportVis, true, this.fileType)
    },
    fileImport() {
      this.exportVis = true
      this.fileType = 'image'
      this.$refs['exportDlg'].init(this.exportVis, true, this.fileType)
    },
    // 车辆 模板下载
    downloadTemp() {
      require.ensure([], () => {
        // 设置Excel的表格第一行的标题
        const tHeader = ['车牌号码','车主姓名', '备注'];
        const excelName = "车辆批量上传模板";
        export_json_to_excel(tHeader, [], excelName);
      });
    },
    // 车辆 批量上传
    UploadTemp() {
      this.vehicleImportVisible = true
    },
    // 解析文件
    async uploadFile(params) { 
      const _file = params.file;
      const fileReader = new FileReader();
      let thiz = this;
      fileReader.onload = (ev) => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: 'binary'
          });
          for (let sheet in workbook.Sheets) {
            //循环读取每个文件
            const sheetArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
            //若当前sheet没有数据，则continue
            if(sheetArray.length == 0){
              continue;
            }
            // console.log("读取文件");
            // console.log(sheetArray);
            for(let item in sheetArray){
              let rowTable = {};
              //这里的rowTable的属性名注意要与上面表格的prop一致
              //sheetArray的属性名与上传的表格的列名一致
              /*  this.vehicleForm = {
                vehicleID: "",
                repoID: this.currentLibId,
                name: "",
                description: ""
              }; */
              rowTable.vehicleID = sheetArray[item].车牌号码;
              rowTable.repoID = thiz.currentLibId;
              rowTable.name = sheetArray[item].车主姓名 ?? '';
              rowTable.name = String(rowTable.name)
              rowTable.description = sheetArray[item].备注 ?? '';
              rowTable.description = String(rowTable.description)
              console.log(rowTable.description)
              if(!thiz.isVehicleNumber(rowTable.vehicleID)) {
                thiz.errorListTable.push(
                  {
                    rowIndex: Number(item) + 1,
                    msg: "车牌格式不正确"
                  }
                )
              }
            
              this.listTable.push(rowTable)
            }
          }
          if(!this.errorListTable.length) {
            this.vehicleImportBtn = false
          }
          if(this.listTable.length == 0 && this.errorListTable.length == 0) {
             this.$message({
              showClose: true,
              type: 'warning',
              message: '上传文件为空文件！'
            });
            this.vehicleImportBtn = true
          }
        } catch (e) {
          this.$message.warning('文件类型不正确！');
        }
      };
      fileReader.readAsBinaryString(_file);
    },
    //车牌号验证方法
    isVehicleNumber(vehicleNumber) {
      var xreg=/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
      var creg=/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
      if(vehicleNumber.length == 7){
        return creg.test(vehicleNumber);
      } else if(vehicleNumber.length == 8){
        return xreg.test(vehicleNumber);
      } else{
        return false;
      }
    },
    //上传1个以上文件时弹窗提示错误
    exceed: function() {
      this.$message.error("最多只能上传1个xls文件");
    },
    //删除文件
    remove() {
      this.listTable = [];
      this.errorListTable = [];
    },
    // 开始上传文件
    async vehicleStart() {
      this.vehicleImportBtn = true

      this.count= 0;
      this.countArrLen = this.listTable.length
      this.vehicleImportTitle = "批量导入车辆中...";
      let limit = 1;
      for (let i in this.listTable) {
        limit -= 1;
        try {
          while (limit < 0) {
            await new Promise(resolve => setTimeout(resolve, 0));
          }
          let post = p => {
            vehicleApi.Post(p).then(_ => {
              limit += 1
              this.count++
            }).catch(async err => {
              // if (err.response.data.code === 429601) {
                await new Promise(resolve => setTimeout(resolve, 100));
                post(p)
              // }
            })
          }
          const params = this.listTable[i]
          post(params)
        } catch (err) {
          console.log("err is ->", err);
        }
      }
    },
    // 关闭上传文件
    vehicleEnd() {
      this.$confirm("是否结束批量导入车辆, 此操作不可撤回!", "", {
        type: "warning"
      }).then(_ => {
        // 全局关闭小弹框
        if(!this.fileType) {
          this.$refs['vehicle-upload'].clearFiles()
        }
        this.$store.commit("changeIsImportShow", "false");
        this.errorListTable = [];
        this.count = 0
        this.countArrLen = 1
        this.countDataArr = []
        this.listTable = [];
        this.vehicleImportBtn = false
        this.vehicleImportVisible = false
        this.vehicleLoading = false
        this.$emit("getVehicle")
        window.location.reload()
      });
    },
    // 勾选
    handleSelectionChange(val) {
      let ids = []
      val.forEach(item => {
        ids.push(item.id)
      })
      this.multipleSelection = ids;
    },
    // 批量删除车辆信息
    vehicleDelAll() {
      if(this.multipleSelection.length) {
          this.$confirm("是否确定删除车辆信息?", "车辆批量删除", {
          confirmButtonText: "确定",
          type: "warning"
        }).then(res => {
          vehicleApi.BatchDelete({ids: this.multipleSelection}).then(res => {
            if(res.data.code == 200000) {
              this.$emit("getVehicle");
              this.$message({
                type: 'success',
                showClose: true,
                message: '删除成功！'
              })
            }
          })
        });
      } else {
        this.$message({
          type: 'warning',
          showClose: true,
          message: '请先选择需要删除的车辆信息！'
        })
      }
    },
    // 批量删除--全选/确定/取消
    async showBatchDel() {
      this.oprType = "batchDelete";
      const res = await getAppMode()
      if (res.Lib.operation) {
        this.password = "";
        this.innerVisible = true;
      } else {
        this.batchDel();
      }
    },
    batchDel() {
      this.selectedPersonIds = [];
      this.isBatchDelMode = true;
      this.iconCh = true;
      this.iconDel = false;
    },
    btnDelSelectAll() {
      this.faceData.forEach(item => {
        this.selectedPersonIds.push(item.id);
      });
    },
    btnDelCancel() {
      this.isBatchDelMode = false;
      this.iconCh = false;
      this.iconDel = true;
      this.selectedPersonIds = [];
    },
    batchDelete() {
      if (this.selectedPersonIds.length === 0) {
        this.$message.error("请至少选择一条数据!");
      } else {
        faceApi.BatchDelete({ids: this.selectedPersonIds}).then(res => {
          this.$message.success("批量删除人脸成功");
          this.$emit("getFace");
          this.isBatchDelMode = false;
          this.iconCh = false;
          this.iconDel = true;
        });
      }
    },
    async showBatchImport() {
      this.oprType = "batchImport";
      const res = await getAppMode()
      if (res.Lib.operation) {
        this.password = "";
        this.innerVisible = true;
      } else {
        this.batchImport();
      }
    },
    batchImport() {
      this.batchImportBtn = false;
      if (this.faceImport) {
        this.faceImport.successed = 0;
        this.faceImport.failed = 0;
      }
      this.failedList = [];

      this.batchImportTitle = "批量导入";
      this.batchImportVisible = true;
    },
    async batchStart() {
      this.batchImportTitle = "批量导入人脸中...";
      this.batchImportBtn = true;

      const res1 = await faceApi.VideoDelete();
      const That = this;
      let limit = 3;
      for (let i in this.imgList) {
        limit -= 1;
        try {
          while (limit < 0) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          // 定义上传图片方法
          let post = img => faceApi.BatchPost(img).then(_ => {
              limit += 1;
            }).catch(async err => {
              if (err.response.data.code === 429601) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                post(img);
              }
            })
          // 图片转base64编码, 并上传
          let file = this.imgList[i];
          let fileName = file.name;
          let name, faceID, description;
          if (fileName) {
            if (fileName.indexOf("_") > -1) {
              name = fileName.substring(0, fileName.indexOf("_"));
              if (fileName.indexOf("_") === fileName.lastIndexOf("_")) {
                // 只传name，faceID
                faceID = fileName.substring(
                  fileName.indexOf("_") + 1,
                  fileName.indexOf(".")
                );
                description = "";
              } else {
                // 传name，faceID，description
                faceID = fileName.substring(
                  fileName.indexOf("_") + 1,
                  fileName.lastIndexOf("_")
                );
                description = fileName.substring(
                  fileName.lastIndexOf("_") + 1,
                  fileName.indexOf(".")
                );
              }
            } else {
              // 只传name
              name = fileName.substring(0, fileName.indexOf("."));
              faceID = "";
              description = "";
            }
          }
          if (this.fileType === 'image') {
            let faceImage = file.faceImage
            const params = {
              name,
              repoID: That.currentLibId,
              imageData:  faceImage.substring(faceImage.indexOf(",") + 1, faceImage.length),
              faceID,
              description
            };
            post(params);
          } else {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function() {
              const _result = this.result;
              const params = {
                name,
                repoID: That.currentLibId,
                imageData: _result.substring(_result.indexOf(",") + 1, _result.length),
                faceID,
                description
              };
              post(params);
            }
          }
        } catch (err) {
          console.log("err is ->", err);
        }
      }
    },
    batchEnd() {
      this.$confirm(this.$t("AreYouSureToStopBatchImport"), "", {
        type: "warning"
      }).then(_ => {
        // 全局关闭小弹框
        this.$store.commit("changeIsImportShow", "false");
        faceApi.VideoPost({ frameRate: 6 });
        this.imgList = [];
        this.imgLength = 0;
        this.batchImportVisible = false;
        if (this.faceImport) {
          this.faceImport.successed = 0;
          this.faceImport.failed = 0;
        }
        // 刷新浏览器
        // this.$emit('getFace') // 传统一文件报错
        window.location.reload();
      });
    },
    async batchExport(e) {
      this.imgList = e.target.files;
      for (let i in this.imgList) {
        let file = this.imgList[i]
        let size = file.size / 1024
        if (size > 500) {
          this.$message.error("确保所选人脸图片小于500KB, 请重新选择!")
          return
        }
      }

      this.imgLength = e.target.files.length;

      if (this.batchImportBtn === true) {
        const res1 = await faceApi.VideoPost({ frameRate: 6 });
        const res2 = await faceApi.VideoDelete();
        this.imgList = [];
        if (this.faceImport) {
          this.faceImport.successed = 0;
          this.faceImport.failed = 0;
        }
      }
      this.batchImportBtn = false;
    },
    async localBatchExport(e) {
      this.imgList = e
      for (let i in this.imgList) {
        let size = this.imgList[i].size / 1024
        if (size > 500) {
          this.$message.error("确保所选人脸图片小于500KB, 请重新选择!")
          return
        }
      }

      this.imgLength = e.length;

      if (this.batchImportBtn === true) {
        const res1 = await faceApi.VideoPost({ frameRate: 6 });
        const res2 = await faceApi.VideoDelete();
        this.imgList = [];
        if (this.faceImport) {
          this.faceImport.successed = 0;
          this.faceImport.failed = 0;
        }
      }
      this.batchImportBtn = false;
    },
    // 查询
    search() {
      this.filterParams.pageNum = 1;
      this.$emit("getSearchVal", this.searchVal);
    },
    // 人脸管理
    async showAddDialog() {
      this.oprType = "add";
      const res = await getAppMode()
      if (res.Lib.operation) {
        this.password = "";
        this.innerVisible = true;
      } else {
        this.addFace();
      }
    },
    addFace() {
      if (this.libType === 1) {
        // faceApi.VideoPost({'frameRate': 3}) // 调videoProcess
        this.dialogTitle = "addFace";
        this.dialogFaceVisible = true;
        this.imgShow = false;
        this.faceForm = {
          faceID: "",
          repoID: this.currentLibId,
          name: "",
          imageData: "",
          description: ""
        };
      } else {
        this.dialogTitle = "addVehicle";
        this.dialogVehicleVisible = true;
        this.vehicleForm = {
          vehicleID: "",
          repoID: this.currentLibId,
          name: "",
          description: ""
        };
      }
    },
    async showEditFace(item) {
      this.oprType = "edit";
      this.editFaceItem = item;
      const res = await getAppMode()
      if (res.Lib.operation) {
        this.password = "";
        this.innerVisible = true;
      } else {
        this.editFace();
      }
    },
    editFace() {
      this.dialogTitle = "editFace";
      this.dialogFaceVisible = true;
      this.isImgChange = false;
      const {
        id,
        faceID,
        name,
        description,
        imageData,
        repoID
      } = this.editFaceItem;
      this.faceForm = { id, faceID, name, description, imageData, repoID };

      this.imgShow = true;
      this.faceImagePath = this.editFaceItem.imagePath;

      const That = this;
      var image = new Image();
      image.src = this.faceImagePath;
      image.onload = function() {
        // 目前限制能为保存为jpg格式的base64--注:jpg会默认为png,所以选用jpeg
        var base64 = That.getBase64Image(image, "jpeg");
        That.faceForm.imageData = base64.substring(23);
      };
    },
    tableEdit(index, row) {
      this.dialogTitle = "editVehicle";
      this.dialogVehicleVisible = true;
      const { id, vehicleID, repoID, name, description } = row[index];
      this.vehicleForm = { id, vehicleID, repoID, name, description };
    },
    tableDelete(index, row) {
      this.$confirm(
        this.$t("AreYouSureToDeleteVehichle"),
        this.$t("deleteVehicle"),
        {
          confirmButtonText: this.$t("confirm")
        }
      ).then(() => {
        const id = row[index].id;
        vehicleApi.Delete(id).then(res => {
          this.$emit("getVehicle");
          this.$message.success("删除车辆信息成功！");
        });
        // .catch(err => this.$message.error(this.$t('deleteChannelFailed')))
      });
    },
    getBase64Image(image, ext) {
      var canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      var context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, image.width, image.height);
      // 这里是不支持跨域的
      var base64 = canvas.toDataURL("image/" + ext);
      return base64;
    },
    submit(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if (this.libType === 1) {
            if (this.dialogTitle === "addFace") {
              this.btnDisabled = true;
              faceApi
                .Post(this.faceForm)
                .then(res => {
                  this.btnDisabled = false;
                  this.dialogFaceVisible = false;
                  this.$emit("getFace");
                  this.$message.success(this.$t("AddFaceSuccessfully"));
                })
                .catch(_ => {
                  this.btnDisabled = false;
                });
            } else {
              console.log(this.faceForm.imageData)
              if (this.faceForm.imageData) {
                const id = this.faceForm.id;
                this.faceForm.imageData = this.isImgChange
                  ? this.faceForm.imageData
                  : null;
                faceApi.Put(id, this.faceForm).then(res => {
                  this.dialogFaceVisible = false;
                  this.$emit("getFace");
                  this.$message.success(this.$t("ModifyFaceSuccessfully"));
                });
              } else {
                this.$message.error("上传图片不能为空!");
              }
            }
          } else if (this.libType === 2) {
            // 车辆提交
            if (this.dialogTitle === "addVehicle") {
              this.btnDisabled = true;
              vehicleApi
                .Post(this.vehicleForm)
                .then(res => {
                  this.btnDisabled = false;
                  this.dialogVehicleVisible = false;
                  this.$emit("getVehicle");
                  this.$message.success(this.$t("AddVehicleSuccessfully"));
                })
                .catch(_ => {
                  this.btnDisabled = false;
                });
            } else {
              const id = this.vehicleForm.id;
              vehicleApi.Put(id, this.vehicleForm).then(res => {
                this.dialogVehicleVisible = false;
                this.$emit("getVehicle");
                this.$message.success(this.$t("ModifyVehicleSuccessfully"));
              });
            }
          }
        }
      });
    },
    pasSub() {
      if (md5(this.password) === "6b7bd8bf29911fde11e71cee314d99f2") {
        sessionStorage.setItem("forget", this.password);
        this.innerVisible = false;
        if (this.oprType === "add") {
          this.addFace();
        } else if (this.oprType === "edit") {
          this.editFace();
        } else if (this.oprType === "delete") {
          this.showFaceDel();
        } else if (this.oprType === "batchImport") {
          this.batchImport();
        } else if (this.oprType === "batchDelete") {
          this.batchDel();
        }
      } else {
        this.$message.error("请输入正确的密码!");
      }
    },
    async showFaceDelete(id) {
      this.oprType = "delete";
      this.deleteFaceId = id;
      const res = await getAppMode()
      if (res.Lib.operation) {
        this.password = "";
        this.innerVisible = true;
      } else {
        this.showFaceDel();
      }
    },
    showFaceDel() {
      const That = this;
      this.$confirm("是否确定删除人员照片?", "人脸删除", {
        confirmButtonText: "确定",
        type: "warning"
      }).then(res => {
        That.faceDelete(That.deleteFaceId);
      });
    },
    faceDelete(id) {
      faceApi.Delete(id).then(res => {
        this.$message.success("删除人脸成功!");
        this.$emit("getFace");
      });
    },
    // 图标显示
    selectPerson(id) {
      // 如果不是选中界面，不执行
      if (!this.isBatchDelMode && !this.isChannelMode) return;

      let index;
      if ((index = this.selectedPersonIds.indexOf(id)) > -1) {
        this.selectedPersonIds.splice(index, 1);
      } else {
        this.selectedPersonIds.push(id);
      }
    },
    // icon选择显示
    showChe() {
      this.iconCh = true;
      this.iconDel = false;
    },
    beforeAvatarUpload(file) {
      // 未使用
    },
    removeImg() {
      this.imgShow = false;
      this.faceForm.imageData = null;
      this.faceImagePath = "";
    },
    changeFile(file, fileList) {
      this.isImgChange = true;
      if(!this.file) {
        const size = file.size / 1024;
        if (size > 500) {
          this.$message.error("人脸图片目前支持文件大小最大500KB, 请重新选择!");
          return;
        }
      }

      // 支持三种命名格式
      if (this.dialogTitle === "addFace") {
        let fileName = file.name;
        if (fileName) {
          if (fileName.indexOf("_") > -1) {
            this.faceForm.name = fileName.substring(0, fileName.indexOf("_"));
            if (fileName.indexOf("_") === fileName.lastIndexOf("_")) {
              // 只传name，faceID
              this.faceForm.faceID = fileName.substring(
                fileName.indexOf("_") + 1,
                fileName.indexOf(".")
              );
              this.faceForm.description = "";
            } else {
              // 传name，faceID，description
              this.faceForm.faceID = fileName.substring(
                fileName.indexOf("_") + 1,
                fileName.lastIndexOf("_")
              );
              this.faceForm.description = fileName.substring(
                fileName.lastIndexOf("_") + 1,
                fileName.indexOf(".")
              );
            }
          } else {
            // 只传name
            this.faceForm.name = fileName.substring(0, fileName.indexOf("."));
            this.faceForm.faceID = "";
            this.faceForm.description = "";
          }
        }
      }
      // const type = file.raw.type
      // if (type === 'image/jpg' ||
      //     type === 'image/jpeg' ||
      //     type === 'image/png' ||
      //     type === 'image/bmp') {
      if(!this.file) {
        var That = this;
        var reader = new FileReader();
        reader.readAsDataURL(file.raw);
        reader.onload = function(e) {
          let _result = this.result; // 这个就是base64编码了
          let imgBase64 = _result.substring(
            _result.indexOf(",") + 1,
            _result.length
          );
          That.imgShow = true;
          That.faceForm.imageData = imgBase64;
          That.faceImagePath = "data:image/jpeg;base64," + imgBase64;
        };
      } else {
        this.imgShow = true
        this.faceImagePath = this.file.raw
        this.faceForm.imageData = this.file.raw.split(',')[1]
      }
      // } else {
      //   this.$Msg('人脸图片目前仅支持jpg,jpeg,png,bmp四种格式', 'error')
      // }
    },
    closeDialog(form) {
      this.$refs[form].resetFields(); // 将form表单重置
    },
    handleFaceClose() {
      this.$confirm("确认关闭?", "", {
        type: "warning"
      })
        .then(_ => {
          this.dialogFaceVisible = false;
        })
        .catch(_ => {});
    },
    // 表头颜色
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return (
          "background-color:rgba(58,116,255,0.05);" +
          "box-shadow:0px -1px 0px 0px rgba(235,238,245,1);" +
          "color:rgba(0,0,0,0.85);" +
          "font-weight:500;" +
          "font-size:12px;" +
          "border:0;" +
          "border-bottom: 1px solid #ebeef5;" +
          "height:22px;" +
          "line-height:22px"
        );
      }
    },
    // 表格颜色
    cellStyle(row, column, rowIndex, columnIndex) {
      // if (rowIndex === 1) {
      //   return  '<button>123</button>'
      // } else {
      return (
        "background: white;" +
        "font-size:12px;" +
        "border: none;" +
        "border-bottom: 1px solid #ebeef5;" +
        "padding: 7px;" +
        "color: rgba(48,49,51,1);"
      );
      // }

      // 'font-size:12px;' +
      // 'height:48px;'
    }
  },
  computed: {
    faceImport() {
      if (this.$store.getters.getFaceImport) {
        const data = this.$store.getters.getFaceImport;
        console.log('dattttttttttttttttta',data);
        if (data.type === "failed") {
          this.failedList.push(data.face);
        }
        return data;
      }
    },
    countVal() {
      return Math.floor((this.count / this.countArrLen) * 100)
    }
  },
  components: {
    exportDlg
  },
}
</script>

<style lang="less" scoped>
// config
.oprTop {
  margin: 20px 0;
}
.button {
  width: 96px;
  height: 28px;
  cursor: pointer;
  color: white;
  border: none;
  background: #2178C8;
  border-radius: 2px;
  margin-right: 20px;
}
.button i {
  padding-right: 5px;
}
.delButton {
  background: rgba(33,120,200,0.05);
  border-radius: 2px;
  border: 1px solid #2178C8;
  color: #2178C8;
}
.searchBox {
  width: 246px;
  height: 30px;
  float: right;
  margin-top: -52px;
}
/deep/ .el-input__inner {
  border-radius: 2px;
  border: 1px solid #EBEEF5;
  height: 30px;
}
.searchIcon {
  width: 13px;
  height: 30px;
  line-height: 30px;
  margin-left: 10px;
  color: #909399;
}
.searchInput {
  margin-left: 11px;
  color: #909399;
  width: 200px;
}
.faceBox::-webkit-scrollbar {
  // display: none;
}
// face
.faceBox {
  margin: 14px 0 0 0;
  overflow: scroll;
  scrollbar-width: none;
}
.faceImgBox {
  float: left;
  width: 232px;
  height: 246px;
  border-right: 1px solid rgba(219, 220, 231, 1);
}
.faceImg {
  width: 160px;
  height: 160px;
  margin: 17px 36px 97px 36px;
  position: absolute;
}
.iconRemove {
  font-size: 14px;
  color: red;
  float: right;
  margin-left: 190px;
  position: absolute;
  z-index: 1;
  cursor: pointer;
}
.imgUp {
  width: 160px;
  height: 160px;
  margin: 17px 36px 97px 36px;
  border: 1px solid rgba(219, 220, 231, 1);
}
.inputD {
  width: 212px;
  height: 26px;
}
.picContainer {
  float: left;
  width: 142px;
  height: 200px;
  position: relative;
  margin: 5px 12px 12px 5px;
  background: #FFFFFF;
  border-radius: 2px;
  border: 1px solid #E7EEF3;
  .picName {
    width:142px;
    background: #FFFFFF;
    border-radius: 0px 0px 2px 2px;
    opacity: 0.95;
  }
  .faceName {
    margin: 0 0 2px 9px;
    height: 17px;
    width: 120px;
    font-size: 12px;
    font-family: regular;
    font-weight: 400;
    color: rgba(48, 49, 51, 1);
    line-height: 17px;
  }
  .picDelete {
    font-size: 12px;
    font-weight: 500;
    color: blue;
    cursor: pointer;
    transition-delay: 0.5s;
    display: none;
    position: absolute;
    top: 2px;
    right: 2px;
    z-index: 2;
  }
  .picEdit {
    float: left;
    margin: 10px 0 0 56px;
    font-size: 12px;
    color: blue;
    cursor: pointer;

    display: none;
  }
  &:hover {
    border: 1px solid blue;
    .picName {
      display: none;
    }
    .picDelete {
      display: block;
    }
    .picEdit {
      display: block;
    }
  }
}
// 固定右上角选择位置
.picContainer .picChoose {
  display: block;
  position: absolute;
  width: 16px;
  height: 16px;
  top: 0;
  right: 0;
  z-index: 0;
  cursor: pointer;
}
.picContainer.active {
  border: 1px solid #3a74ff;
}
.cancelBtn {
  width: 80px;
  height: 28px;
  margin: 8px 12px 8px 116px;
}
.save.active {
  cursor: not-allowed;
  background: grey;
  border: none;
}

.pasDel {
  margin: 0 12px 20px 90px;
}

.input-zone {
  width: 500px;
  color: rgb(153, 153, 153);
  font-size: 14px;
  position: relative;
}
.input-zone input[type="file"] {
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
}

.logoFont {
  font-size: 12px;
  height: 24px;
}
.logoDes {
  color: grey;
  margin-left: 20px;
}

.batchBox {
  position: absolute;
  z-index: 2666 !important;
}
.vehicleBox {
  position: absolute;
  z-index: 2666 !important;
}
/deep/ .el-form-item__label {
  font-size: 13px;
  width: 67px;
  color: #9e9e9e !important;
}
</style>
<style >
#vehicleBox .el-upload-list {
  display: block !important;
}
#vehicleBox .el-upload-dragger {
  height: 100px;
}
#vehicleBox .el-upload-dragger .el-icon-upload {
  margin: 5px 0 16px;
}
.el-form-item .el-form-item__label {
  width: 75px;
}
</style>
