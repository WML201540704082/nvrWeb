<template>
  <div>
    <div class="leftSecBox" style="height: calc(100vh - 154px)">
      <div class="flexRowBetween leftSecTitle">
        <span class="leftlib" style="color: #333">{{libType === 1 ? $t('faceRepos') : $t('vehicleRepos')}}</span>
        <i class="el-icon-menu" @click="addLib" style="color: #333; float: right; margin-right: 30px; margin-top: 5px; cursor: pointer;"></i>
      </div>
      <div class="flexRowBetween leftSecContainer"
           v-for="(item, index) of libMenu"
           :key="index"
           :class="{ active: activeLibIndex === item.id }"
      >
        <div class="leftSecSpan ellipsis" @click="getLib(item)">
          <el-tooltip :content="item.name" placement="right" v-if="item.name.length > 10">
            <div class="libNameFont libName ellipsis">{{item.name}}</div>
          </el-tooltip>
          <span v-else>{{item.name}}</span>
        </div>
        <div class="leftSecIcon">
          <i class="el-icon-edit" @click="editLib(item)"></i>
          <i class="el-icon-delete iconEdit" @click="deleteLib(item.id)"></i>
        </div>
      </div>
    </div>
    <!-- lib弹框 -->
    <el-dialog :title="$t(dialogLibTitle)"
               :before-close="handleLibClose"
               :close-on-click-modal="false"
                width='360px'
                :visible.sync="dialogLibVisible"
                @close="closeDialog('libForm')"
    >
      <el-form :inline="true"
               :model="libForm"
               ref="libForm"
               label-width="67px"
               label-position="right"
               style="padding-top:20px"
      >
        <el-form-item label="库名称"
                      prop="name"
                      :rules="[{required: true, message: $t('NameCannotBeEmpty'),trigger: 'blur'}]"
        >
          <el-input v-model="libForm.name"
                 class="input inputSys"
                 style="width:212px;height:26px;"
                 :placeholder="$t('PleaseEnterTheLibraryName')"
          />
        </el-form-item>
        <el-form-item :label="$t('remark')">
          <el-input type="textarea"
                    :autosize="{ minRows: 2, maxRows: 2}"
                    v-model="libForm.description"
                    style="width:212px;margin-top:-6px"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="btnBoxBoder">
        <button class="delButton cancelBtn" @click="dialogLibVisible = false">{{$t('cancel')}}</button>
        <button class="button" style="width: 80px; height: 28px; background-color: #3a74ff; border: none; color: white;" @click="submitLib('libForm')">{{$t('save')}}</button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { faceRepoApi, vehicleRepoApi, faceApi } from '@/api/lib'

export default {
  props: {
    libMenu: {
      type: Array,
      required: false
    },
    libType: {
      type: Number,
      required: false
    },
    activeLibIndex: {
      type: Number,
      required: false
    }
  },
  data() {
    return {
      size: {
        contentWidth: window.innerWidth,
        contentHeight: window.innerHeight
      },
      // activeLibIndex: 1,
      dialogLibTitle: 'addFaceLib',
      dialogLibVisible: false,
      libForm: {
        name: '',
        description: '',
      }
    }
  },
  methods: {
    getLib (item) {
      this.$emit('getActiveLibIndex', item.id)
      this.$emit('getLibInfo', item)
    },
    addLib () {
      this.libType === 1 ? this.dialogLibTitle = 'addFaceLib' : this.dialogLibTitle = 'addVehicleLib'
      this.dialogLibVisible = true
      this.initLibForm()
    },
    editLib (item) {
      this.libType === 1 ? this.dialogLibTitle = 'editFaceLib' : this.dialogLibTitle = 'editVehicleLib'
      this.dialogLibVisible = true
      this.$emit('getActiveLibIndex', item.id)
      this.$emit('getLibInfo', item, 1)
      this.initLibForm(item)
    },
    initLibForm (item) {
      if (this.dialogLibTitle === 'addFaceLib' || this.dialogLibTitle === 'addVehicleLib') {
        var { id, name, description } = {}
      } else {
        var { id, name, description } = item
      }
      this.libForm = { id, name, description }
    },
    submitLib (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.libType === 1) {
            if (this.dialogLibTitle === 'addFaceLib') {
                faceRepoApi.Post(this.libForm)
                 .then(res => {
                   this.$emit('getLibMenu', {}, 1)
                   this.dialogLibVisible = false
                   this.$Msg(this.$t('AddFaceDatabaseSuccessfully'), 'success')
                 })
            } else {
              const id = this.libForm.id
              faceRepoApi.Put(id, this.libForm)
               .then(res => {
                 this.$emit('getActiveLibIndex', id)
                 this.$emit('getLibMenu', res.data.data, 1)
                 this.dialogLibVisible = false
                 this.$Msg(this.$t('ModifyFaceDatabaseSuccessfully'), 'success')
               })
            }
          } else {
            if (this.dialogLibTitle === 'addVehicleLib') {
                vehicleRepoApi.Post(this.libForm)
                 .then(res => {
                   this.$emit('getLibMenu', {}, 2)
                   this.dialogLibVisible = false
                   this.$Msg(this.$t('AddVehicleDatabaseSuccessfully'), 'success')
                 })
            } else {
              const id = this.libForm.id
              vehicleRepoApi.Put(id, this.libForm)
               .then(res => {
                 this.$emit('getActiveLibIndex', id)
                 this.$emit('getLibMenu', res.data.data, 2)
                 this.dialogLibVisible = false
                 this.$Msg(this.$t('ModifyVehicleDatabaseSuccessfully'), 'success')
               })
            }
          }
        }
      })
    },
    deleteLib (id) {
      if (this.libType === 1) {
        this.$confirm(this.$t('AreYouSureToDeleteFaceDatabase'), this.$t('deleteFaceLib'), {
          confirmButtonText: this.$t('confirm'),
          type: 'warning'
        }).then(() => {
          faceRepoApi.Delete(id).then(res => {
            this.$emit('getLibMenu', {}, 1)
            this.$Msg(this.$t('DeleteFaceDatabaseSuccessfully'), 'success')
            this.$emit('getActiveLibIndex', this.libMenu[0].id)
          })
        })
      } else {
        this.$confirm(this.$t('AreYouSureToDeleteVehicleDatabase'), this.$t('deleteVehicleLib'), {
          confirmButtonText: this.$t('confirm'),
          type: 'warning'
        }).then(() => {
          vehicleRepoApi.Delete(id).then(res => {
            this.$emit('getLibMenu', {}, 2)
            this.$Msg(this.$t('DeleteVehicleDatabaseSuccessfully'), 'success')
            this.$emit('getActiveLibIndex', this.libMenu[0].id)
          })
        })
      }
    },
    closeDialog (form) {
      this.$refs[form].resetFields() // 将form表单重置
    },
    handleLibClose () {
      this.$confirm(this.$t('AreYouSureToClose'), '', {
        type: 'warning'
      }).then(_ => { this.dialogLibVisible = false })
    }
  }
}
</script>

<style lang="less" scoped>
.leftSecBox {
  overflow: auto;
  // margin: 0 0 0 15px;
  display: inline-block;
  width: 208px;
  top: 100px;
  border-right: 1px solid #eee;
}

.leftSecTitle {
  padding-top: 6px;
  width: 208px;
  height: 40px;
  .leftlib {
    margin-left: 15px;
    width:42px;
    height:20px;
    font-size:14px;
    font-family:medium;
    color:black;
    line-height:20px;
  }
  .iconAdd {
    font-size: 14px;
    margin:0 10px 0 18px;
    color:blue;
    cursor: pointer;
  }
}

.leftSecContainer {
  width: 190px;
  height: 36px;
  .leftSecSpan {
    width: 130px;
    height: 17px;
    font-size: 12px;
    font-family: regular;
    font-weight: 400;
    color: #626262;
    line-height: 17px;
    margin: 0 0 0 15px;
    cursor: pointer;
  }
  .leftSecIcon {
    font-size: 14px;
    color: #626262;
    float: right;
    margin-top: -20px;
    font-weight: 500;
    display: none;
  }
  .iconEdit {
    margin:0 10px 0 18px
  }
  &:hover {
    background: #ecf5ff;
    .leftSecIcon {
      cursor: pointer;
      display: block;
      color: rgb(158, 189, 235);
    }
  }
}
.leftSecContainer.active {
  background: #ecf5ff;
}
.leftSecContainer .ellipsis {
  padding: 6px;
}
.cancelBtn {
  margin:8px 12px 8px 127px;
  width: 80px;
  height: 28px;
}
.el-dialog__title {
  font-size: 14px;
}
/deep/ .el-form-item__label {
  font-size: 13px;
  width: 67px;
  color: #9e9e9e !important;
}
</style>
