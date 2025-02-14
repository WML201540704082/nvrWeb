<template>
  <div class="setting-ver">
    <el-dialog
      :title="dialogTitle"
      :before-close="handleClose"
      :show-close="false"
      :close-on-click-modal="false"
      width="500px"
      class="ver-dialog"
      :visible.sync="dialogVisible"
      @close="closeDialog('ruleForm')"
    >
      <el-form
        :inline="true"
        :model="ruleForm"
        ref="ruleForm"
        label-width="90px"
        label-position="right"
        :rules="rules"
      >
        <!-- 算法名称 -->
        <el-col  :span="24">
          <el-form-item label="算法名称" prop="alg.name" class="inputLab">
            <el-input
              autocomplete="off"
              size="small"
              v-model="ruleForm.alg.name"
              class="alg-input"
              :class="{inputDisabled: dialogTitle === '上传版本'}"
              :disabled=true
            />
          </el-form-item>
        </el-col>
        <!-- 算法类型 -->
        <el-col :span="24">
          <el-form-item label="算法类型" prop="alg.algType" class="inputLab">
            <el-input
              size="small"
              autocomplete="off"
              v-model="ruleForm.alg.algType"
              class="alg-input"
              :class="{inputDisabled: dialogTitle === '上传版本'}"
              :disabled=true
            />
          </el-form-item>
        </el-col>
        <!-- 提供厂商 -->
        <el-col :span="24">
          <el-form-item label="提供厂商" prop="alg.owner" class="inputLab">
            <el-input
              size="small"
              autocomplete="off"
              v-model="ruleForm.alg.owner"
              class="alg-input"
              :class="{inputDisabled: dialogTitle === '上传版本'}"
              :disabled=true
            />
          </el-form-item>
        </el-col>
        <!-- 版本号 -->
        <el-col :span="24">
          <el-form-item label="版本号" prop="version" class="inputLab">
            <el-input
              size="small"
              autocomplete="off"
              v-model="ruleForm.version"
              class="alg-input"
              :placeholder="$t('pleaseEnter')+'版本号'"
            />
          </el-form-item>
        </el-col>
        <!-- 版本文件 -->
        <el-col :span="24" v-if="!isLocal">
          <el-form-item label="上传文件" prop="imageFile" class="inputLab">
            <div class="file-upload" id="verImageFile"
              element-loading-text="正在导入版本信息"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(255, 255, 255, 0.6)">
              <el-upload
                  class="upload-demo"
                  ref="algver-upload"
                  drag
                  multiple
                  action="*"
                  accept=".gz"
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
              </el-upload>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-else>
          <el-form-item label="上传文件" prop="imageFile" class="inputLab">
            <el-button size="small" class="import-button" @click="fileImport" v-if="!isHavePath">导入</el-button>
            <span class="local-path" v-else>{{ localPath }}</span>
          </el-form-item>
        </el-col>
      </el-form>
      <div class="btn-list">
        <el-button size="small" :disabled="disableSubmit" @click="cancel('ruleForm')">{{$t('cancel')}}</el-button>
        <el-button size="small" :disabled="disableSubmit" type="primary" @click="submit('ruleForm')" style="margin-left:15px">上传</el-button>
      </div>
    </el-dialog>
    <exportDlg ref="exportDlg" @closed="onExportClose"></exportDlg>
  </div>
</template>

<script>
import { algApi } from "@/api/intel.js";
import exportDlg from '@/views/playback/components/export.vue';

export default {
  props: {
    algConfig: {
      type: Object,
      required: false
    },
    dialogVisible: {
      type: Boolean,
      required: true
    },
    dialogTitle: {
      type: String,
      required: true
    },
    formData: {
      type: Object,
      required: false
    },
    currentAlg: {
      type: Object,
      required: false
    },
    selectFileBtn: false,
  },
  components: {
    exportDlg
  },
  data() {
    const checkVersion = (rule, value, callback) => {
      value = this.ruleForm.version
      if (!value) {
        return callback(new Error('版本号不能为空'));
      } else {
        callback()
      }
    }
    const checkFile = (rule, value, callback) => {
      value = this.fileData
      if (!value && !this.isLocal) {
        return callback(new Error('版本号不能为空'));
      } else {
        callback()
      }
    }
    return {
      algList: [],
      factoryList: [],
      ruleForm: {},
      innerVisible: false,
      verImportBtn: true,
      disableSubmit: false,
      isHavePath : false,
      localPath: '',
      verImageFile: "",
      rules: {
        version: [
          {
            required: true,
            validator: checkVersion,
            message: "版本号不能为空",
            trigger: "blur"
          }
        ],
        imageFile: [
          {
            required: true,
            validator: checkFile,
            message: "文件不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    formData: {
      handler(newValue, oldValue) {
        this.ruleForm = newValue;
      },
      deep: true
    },
  },
  created() {
    this.isLocal = JSON.parse(localStorage.getItem('isLocal'))
    this.$refs['algver-upload']?.clearFiles();
    this.localPath = ''
  },
  methods: {
    //上传1个以上文件时弹窗提示错误
    exceed: function() {
      this.$message.error("最多只能上传1个文件");
    },
    //删除文件
    remove(file,fileList) {
      this.fileData = ''
      // this.verImageFile = "";
    },
    async uploadFile(params) {
      const formData = new FormData()
      formData.append('file',params.file)
      this.fileData = formData
    },
    fileImport() {
      this.exportVis = true
      this.$refs['exportDlg'].init(this.exportVis, true)
    },
    onExportClose(result) {
      if (!result.ok) {
        return
      }
      this.localPath = result.path
      this.isHavePath = true
    },
    submit(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.disableSubmit = true
          !this.isLocal && this.fileData.set('version',this.ruleForm.version)
          const formData1 = new FormData()
          formData1.append('version', this.ruleForm.version)
          formData1.append('local_path', this.localPath)
          let param = this.isLocal ? formData1 : this.fileData
          console.log('-=-=',formData1.values());
            if (this.dialogTitle === "上传版本") {
              algApi.PostVersion(this.ruleForm.alg.id, param).then(res => {
                  this.disableSubmit = false
                  this.fileData = ''
                  this.$message.success(this.$t("addSuccess"));
                  this.$emit("close");
                  if(this.isLocal) {
                    this.localPath = ''
                    this.isHavePath = false
                  } else {
                    this.$refs['algver-upload'].clearFiles();
                  }
                  this.$refs.ruleForm.resetFields();
                  this.$emit("getVerTableData", 1, this.ruleForm.alg);
              }).catch(err => {
                this.disableSubmit = false
                if(err.response.data.code === 500000) {
                  this.$message.error('创建失败，请检查版本号是否唯一')
                }
              })
            }

        } else {
          this.$message.error(this.$t("pleaseEnterCorrectFormat"))
        }
      })
    },
    closeDialog(form) {
      this.$refs[form].resetFields(); // 将form表单重置
      this.$refs['algver-upload'].clearFiles()
    },
    cancel(form) {
      this.$refs[form].resetFields();
      this.fileData = ''
      this.$emit("close");
    },
    handleClose() {
      this.$confirm(this.$t("AreYouSureToClose"))
        .then(_ => {
          this.$emit("close");
        })
        .catch(_ => {});
    }
  }
};
</script>

<style lang="less" scoped>
#systemBox .setting-ver {
  
  .inputLab {
    margin-top: -12px;
    // margin-left:5px
  }
  /deep/.el-dialog__header {
    padding-bottom: 0;
  }
  /deep/.el-dialog__title {
    font-size: 16px;
  }
  /deep/.el-form-item__label {
    font-size: 12px;
  }
  /deep/.el-form-item__error {
    padding-left: 20px;
  }
  /deep/.el-input__inner {
    width: 300px;
  }
  .alg-input {
    padding-left: 15px;
  }
  .del {
    margin: 8px 12px 8px 130px;
  }
  .btn-list {
    margin-left: 280px;
  }
  .local-path {
    padding-left: 15px;
  }
  .import-button {
    margin-left: 15px;
  }
  /deep/.el-upload-dragger {
    margin-top: 10px;
    margin-left: 15px;
    width: 300px;
  }
  /deep/ .el-upload-list__item-name {
    margin-left: 20px;
    width: 250px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  /deep/ .el-upload-list__item-name:hover {
    white-space: normal;
    word-wrap: break-word;
  }
}

</style>
