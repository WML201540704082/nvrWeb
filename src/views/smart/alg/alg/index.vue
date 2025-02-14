<template>
  <div class="setting-alg">
    <el-dialog
      :title="dialogTitle"
      :before-close="handleClose"
      :show-close="false"
      :close-on-click-modal="false"
      width="500px"
      :visible.sync="dialogVisible"
      @close="closeDialog('ruleForm')"
    >
      <el-form
        :inline="true"
        :model="ruleForm"
        ref="ruleForm"
        label-width="90px"
        class="alg-dialog"
        label-position="right"
        :rules="rules"
      >
        <!-- 算法名称 -->
        <el-col :span="24">
          <el-form-item label="算法名称" prop="name" class="inputLab">
            <el-input
              autocomplete="off"
              v-model="ruleForm.name"
              class="alg-input"
              :class="{inputDisabled: dialogTitle === '修改算法'}"
              :placeholder="$t('pleaseEnter')+'算法名称'"
            />
          </el-form-item>
        </el-col>
        <!-- 算法类型 -->
        <el-col :span="24">
          <el-form-item label="算法类型" prop="type" class="inputLab">
            <el-select
              v-model="ruleForm.type"
              class="alg-input"
              :disabled="dialogTitle === '修改算法'"
            >
              <div v-for="item in algConfig.algTypes" :key="item.code">
                <el-option :label="item.name" :value="item.code"></el-option>
              </div>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 提供厂商 -->
        <el-col :span="24">
          <el-form-item label="提供厂商" prop="owner" class="inputLab">
            <el-select
              class="alg-input"
              v-model="ruleForm.owner"
            >
              <div v-for="item in algConfig.factorys" :key="item">
                <el-option :label="item" :value="item"></el-option>
              </div>
            </el-select>
          </el-form-item>
        </el-col>
        <div class="btn-list">
          <el-button size="small" @click="cancel('ruleForm')">{{$t('cancel')}}</el-button>
          <el-button size="small" type="primary" @click="submit('ruleForm')" style="margin-left:15px">{{$t('save')}}</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { algApi } from "@/api/intel.js";

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
    }
  },
  data() {
    const checkName = (rule, value, callback) => {
      value = this.ruleForm.name
      if (!value) {
        return callback(new Error('算法名称不能为空'));
      } else {
        callback()
      }
    }
    return {
      historyType: '',
      algList: [],
      factoryList: [],
      ruleForm: {},
      innerVisible: false,
      rules: {
        name: [
          {
            required: true,
            validator: checkName,
            message: "算法名称不能为空",
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,
            message: "算法类型不能为空",
            trigger: "blur"
          }
        ],
        owner: [
          {
            required: true,
            message: '厂商不能为空',
            trigger: "blur"
          }
        ],
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
  },
  methods: {
    getConfig(type) {
    },
    submit(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
            var { name, type, owner, status } = this.ruleForm
            const params = { name, type, owner }
            const paramsEdit = {name, type, owner, status}
            if (this.dialogTitle === "添加算法") {
              algApi.Post(params).then(res => {
                  this.$message.success(this.$t("addSuccess"))
                  this.$emit("getAlgTableData")
                  this.$refs.ruleForm.resetFields()
                  this.$emit("close");
              }).catch(err => {
                if(err.response.data.code === 500000) {
                  this.$message.error('创建失败，请检查名称或类型是否唯一')
                }
              })
            } else if (this.dialogTitle === "修改算法") {
              algApi.Put(this.currentAlg.id, paramsEdit).then(res => {
                  this.$message.success(this.$t("modifySuccess"));
                  this.$emit("getAlgTableData");
                  this.$refs.ruleForm.resetFields();
                  this.$emit("close");
              })
            }
        } else {
          this.$message.error(this.$t("pleaseEnterCorrectFormat"))
        }
      })
    },
    closeDialog(form) {
      this.$refs[form].resetFields(); // 将form表单重置
    },
    cancel(form) {
      this.$refs[form].resetFields();
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
#systemBox .setting-alg {
  /deep/.el-dialog .el-dialog__body .el-form-item__content .el-input__inner {
      height: 30px;
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
  /deep/.el-input__inner {
    width: 300px;
  }
  .alg-input {
    padding-left: 15px;
  }
  /deep/.el-form-item__error {
    padding-left: 20px;
  }
  .inputLab {
    margin-top: -12px;
    // margin-left:5px
  }
  .del {
    margin: 8px 12px 8px 130px;
  }
  .algConfig.active {
    cursor: not-allowed;
    background: grey;
    border: none;
  }
  .btn-list {
    margin-left: 280px;
  }
}
</style>
