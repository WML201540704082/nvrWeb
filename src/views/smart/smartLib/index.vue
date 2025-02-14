<template>
  <div class="full_container" :libType="libType">
    <el-form label-width="80px">
      <el-form-item label="报警方式">
        <el-select size="mini" v-if="libType == 'face'" v-model="form.alertThresholdMode" placeholder="比重报警">
          <el-option
            v-for="item in alarmList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select size="mini" v-else-if="libType == 'vehicle'" v-model="form.vehicleAlertMode" placeholder="比重报警">
          <el-option
            v-for="item in alarmVehicleList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="libType == 'face'" label="关联人脸库">
        <el-checkbox-group v-model="faceIndex" class="face_box">
          <el-checkbox  v-for="item in faces" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item v-if="libType == 'vehicle'" label="关联车辆库">
        <el-checkbox-group v-model="vehicleIndex" class="face_box">
          <el-checkbox  v-for="item in vehicles" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item v-if="libType == 'face'" label="分数阈值">
        <el-slider v-model="scoreValue" range></el-slider>
      </el-form-item>
      <el-form-item label-width="90px" v-if="libType == 'face'" label="开启人脸过滤">
        <el-switch v-model="form.abnormalFilter"></el-switch>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getChannelTask } from '@/api/systemAPI'
import { faceRepoApi, vehicleRepoApi } from '@/api/lib'
export default {
  data() {
    return {
      alarmList: [
        {
          value: 255,
          label: '关'
        },
        {
          value: 0,
          label: '低比分报警'
        },
        {
          value: 1,
          label: '高比分报警'
        },
        {
          value: 2,
          label: '多类型报警'
        },
        {
          value: 3,
          label: 'VIP报警'
        },
        {
          value: 4,
          label: '异常报警'
        }
      ],
      alarmVehicleList: [
        {
          value: 255,
          label: '关'
        },
        {
          value: 0,
          label: '未比中报警'
        },
        {
          value: 1,
          label: '比中报警'
        },
        {
          value: 2,
          label: '多类型报警'
        }
      ],
      form: {
        alertThresholdMode: 255,
        vehicleAlertMode: 255,
        faceRepos: [],
        vehicleRepos: [],
        abnormalFilter: false,
        lowAlertThreshold: 79,
        highAlertThreshold: 84,
      },
      scoreValue: [79, 84],
      faces: [],
      faceIndex: [],
      vehicles: [],
      vehicleIndex: [],
    }
  },
  props: {
    libType: {
			type: String,
			required: true
		},
  },
  created() {
  },
  mounted() {
  },
  watch: {
    'scoreValue'(val) {
      this.form.lowAlertThreshold = this.scoreValue[0]
      this.form.highAlertThreshold = this.scoreValue[1]
      this.$emit('formData',this.form)
    },
    'form.abnormalFilter'(val) {
      this.$emit('formData',this.form)
    },
    'form.alarmListItem'(val) {
      console.log('this.form',this.form);
      this.$emit('formData',this.form)
    },
    'form.alarmVehicleListItem'(val) {
      this.$emit('formData',this.form)
    },
    'faceIndex'(val) {
      this.form.faceRepos = []
      this.faceIndex.map(item => {
        this.form.faceRepos.push({id: item})
      })
      this.$emit('formData',this.form)
    },
    'vehicleIndex'(val) {
      this.form.vehicleRepos = []
      this.vehicleIndex.map(item => {
        this.form.vehicleRepos.push({id: item})
      })
      this.$emit('formData',this.form)
    }
  },
  methods: {
    getTask(channelId) {
      this.$nextTick(() => {
        getChannelTask(channelId).then(res => {
        let data = res.data.data
        this.scoreValue = [data.lowAlertThreshold, data.highAlertThreshold]
        this.form.abnormalFilter = data.abnormalFilter
        this.form.alertThresholdMode = data.alertThresholdMode
        this.form.vehicleAlertMode = data.vehicleAlertMode
        this.faceIndex = []
        data.faceRepos.map(item => {
          this.faceIndex.push(item.id)
        })
        this.vehicleIndex = []
        data.vehicleRepos.map(item => {
          this.vehicleIndex.push(item.id)
        })
      })
      faceRepoApi.Get().then(res => {
        let data = res.data.data
        this.faces = []
        data.map(item => {
          this.faces.push({id: item.id, name: item.name})
        })
      })
      vehicleRepoApi.Get().then(res => {
        let data = res.data.data
        this.vehicles = []
        data.map(item => {
          this.vehicles.push({id: item.id, name: item.name})
        })
      })
      })
    },
  },
}
</script>
<style scoped>
.full_container {
  margin: 20px;
  font-size: 12px;
}
/deep/ .el-slider__runway {
  width: calc(100% - 200px);
}
</style>