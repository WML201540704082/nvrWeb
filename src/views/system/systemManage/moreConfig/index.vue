<template>
	<div class="moreConfig">
		<el-form :model="form" ref="data-form" :rules="dataRule" label-width="115px">
			<el-form-item label="系统标题" prop="deviceName">
				<el-input size="small" maxlength="12" v-model="form.deviceName"></el-input>
			</el-form-item>
			<el-form-item label="屏幕保护时间:" prop="guardTime">
				<el-select v-model="form.guardTime" size="small">
					<el-option v-for="(item,index) in guardTimeList" :label="item.label" :value="item.value" :key="index"></el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button style="margin: 20px 0 20px 120px" size="small" @click="save()">保存</el-button>
		</span>
	</div>
</template>
<script>
import { setDeviceTitle,putMoreConfig } from '@/api/systemAPI';
import { getMoreConfig } from '@/api/systemAPI';
import axios from "axios"
export default { 
	name: 'moreConfig',
	data(){
		return {
			form: {
				deviceName: '',
				guardTime: null
			},
			guardTimeList: [{
				value: 1,
				label: '1分钟'
			},{
				value: 3,
				label: '3分钟'
			},{
				value: 5,
				label: '5分钟'
			},{
				value: 10,
				label: '10分钟'
			},{
				value: 30,
				label: '30分钟'
			},{
				value: 60,
				label: '1小时'
			}],
			dataRule: {
				deviceName: [{ required: true, message: '设备名称不能为空', trigger: 'blur' }],
				guardTime: [{ required: true, message: '屏幕保护时间不能为空', trigger: 'blur' }],
			},
		}
	},
	created(){
		// this.oldDeviceName = window.localStorage.getItem('title')
		// this.form.deviceName = this.oldDeviceName
		// 获取标题名称
		this.getTitle()

		// this.form.guardTime = Number(window.localStorage.getItem('timeOut'))
		// 获取锁屏时间
		this.getMoreConfig()
	},
	methods: {
		async getTitle() {
			const logoRes = await axios.get('/api/system/logo')
			if (logoRes.data?.data?.loginText) {
				this.form.deviceName = logoRes.data.data.loginText
			} else {
				this.form.deviceName = '智能视频图像分析服务器'
			}
		},
		getMoreConfig() {
			getMoreConfig().then(res => {
				if(res.data.code === 200000) {
					this.form.guardTime = res.data.data.screenSaverTime ? res.data.data.screenSaverTime : 10
                }
			})
		},
		save() {
			this.$refs['data-form'].validate((valid) => {
				if (valid) {
					// 保存屏幕保存时间
					putMoreConfig({
						screenSaverTime: this.form.guardTime
					}).then(res => {
						if(res.data.code == 200000) {
							window.localStorage.setItem('timeOut', this.form.guardTime)
							// 如果成功了保存设备名称
							this.saveDeviceName()
						} else {
							this.$message.error('保存失败')
						}
					})
				}
			})
		},
		saveDeviceName() {
			if (this.form.deviceName!==this.oldDeviceName) {
				setDeviceTitle({
					loginText: this.form.deviceName
				}).then(res => {
					if(res.data.code == 200000) {
						this.$message.success('保存成功！')
						if (window.localStorage.getItem('isLocal') != 'true') {
							this.$router.push({ name: "login" });
						}
					} else {
						this.$message.error('保存失败')
					}
				})
			} else {
				this.$message.success('保存成功！')
			}
		},
	}
}
</script>
<style lang="less" scoped>
.userConfig{
	height: 100%;
}
.el-input {
	width: 192px;
	padding-right: 10px;
}
</style>
