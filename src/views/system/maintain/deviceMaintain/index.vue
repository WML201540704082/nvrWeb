 <template>
    <div>
		<div>
			<div style="margin-bottom: 20px">
				<i style="color:#000;" class="el-icon-refresh-right"></i>
				<span style="margin-left:5px; color:#000;">重启</span>
			</div>
        	<el-form :inline="true" :model="form1" ref="form1" label-width="110px" label-position="right">
				<el-form-item label="重新启动设备:">
					<el-button type="primary" size="mini" style="margin:7px 0 0 20px;cursor: pointer;" @click="reboot">重启</el-button>
				</el-form-item>
        	</el-form>
			<el-form  :model="form2" ref="form2" label-width="110px">
				<el-form-item label="定时重启:">
					<el-checkbox v-model="form2.enabled"></el-checkbox>
				</el-form-item>
				<el-form-item label="重启类型:">
					<el-select :disabled="!form2.enabled" v-model="form2.rebootType" size="small">
					<el-option v-for="item in [{label:'每日重启', value:1}, {label:'每周重启', value:2}, {label:'每月重启', value:3}, {label:'每三月重启', value:4}]" :label="item.label" :value="item.value" :key="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="重启时间:">
					<el-time-picker :disabled="!form2.enabled"
								:editable="false"
								v-model="form2.rebootTime"
								:clearable="false"
								style="flex: 1; margin-right: 10px;"
								size="mini"
								placeholder="重启时间">
					</el-time-picker>
					<el-select :disabled="!form2.enabled" v-show="(form2.rebootType == 2)" v-model="form2.rebootWeek" size="mini">
						<el-option v-for="item in [{label:'星期一', value:1}, {label:'星期二', value:2}, {label:'星期三', value:3}, {label:'星期四', value:4}, {label:'星期五', value:5}, {label:'星期六', value:6}, {label:'星期日', value:0}]" :label="item.label" :value="item.value" :key="item.value"></el-option>
					</el-select>
					<el-select :disabled="!form2.enabled" v-show="(form2.rebootType != 2 && form2.rebootType != 1)" v-model="form2.rebootDay" size="mini">
						<el-option v-for="item in 31" :label="item" :value="item" :key="item"></el-option>
					</el-select>
				</el-form-item>
				<el-button type="primary" size="mini" style="margin:7px 0 0 30px" @click="saveRebootConfig('form2')">{{$t('save')}}</el-button>
			</el-form>
      	</div>
		<div style="margin-top:30px">
			<div style="margin-bottom: 20px">
				<i style="color:#000;" class="el-icon-refresh-left"></i>
				<span style="margin-left:5px; color:#000;">恢复出厂</span>
			</div>
			<el-form :inline="true" :model="form3" ref="form3" label-width="110px" label-position="right">
				<el-form-item label="恢复出厂参数:">
					<el-button type="primary" size="mini" style="margin:7px 0 0 20px" @click="reset()">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
     <!-- 删掉，在设备恢复重复了 -->
		<!-- <div style="margin-top:30px">
			<div style="margin-bottom: 20px">
				<i style="color:#000;" class="el-icon-refresh"></i>
				<span style="margin-left:5px; color:#000;">数据备份</span>
			</div>
			<el-form :inline="true" :model="form3" ref="form3" label-width="130px" label-position="right">
				<el-form-item label="选择数据备份:">
					<el-checkbox v-model="enable"></el-checkbox>
					<el-select v-model="disk" @change="onCheckedRaid" placeholder="请选择" v-if="enable" style="margin-left:10px" size="small">
						<el-option v-for="item in raidList" :label="item.raidId" :value="item.raidId" :key="item.id"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<el-button type="primary" size="mini" style="margin:7px 0 0 30px" @click="saveRaidConfig()">{{$t('save')}}</el-button>
		</div> -->
    </div>
</template>
  
<script>
import { systemReboot,systemReset,setRebootConfig,getRebootConfig,getStorageRaid,getBackupDb,postBackupDb } from '@/api/systemAPI';
import moment from 'moment'
export default {
    data() {
      	return {
			moment,
			form1: {},
			form2: {
			},
			form3: {},
			enable: false,
			raidList: [],
			disk: ''
      	}
    },
    created () {
      	this.queryRebootConfig()
		this.getStorageRaid()
		// this.getBackupDb()
    },
    methods: {
		// 设备信息
		async queryRebootConfig () {
				const res = await getRebootConfig()
				let date = moment(new Date()).format("YYYY-MM-DD");
				this.form2 = {
					...res.data.data,
					rebootDay: res.data.data.rebootDay || 1,
					rebootWeek: res.data.data.rebootWeek || 1,
					rebootTime: res.data.data.rebootTime ? new Date(`${date} ${res.data.data.rebootTime}`) : '',
				}
		},
		getBackupDb() {
			getBackupDb().then(res => {
				if(res.data.code === 200000) {
					this.enable = res.data.data.enable || false
					this.disk = res.data.data.enable ? res.data.data.disk : null
				}
			})
		},
		getStorageRaid() {
			getStorageRaid().then(res => {
				if(res.data.code === 200000) {
					this.raidList = res.data.data.raidList
				}
			})
		},
		onCheckedRaid(e) {
			this.disk = e
		},
		saveRaidConfig() {
			if ((this.enable && this.disk) || !this.enable) {
				postBackupDb({
					enable:this.enable,
					disk:this.enable ? this.disk : null
				}).then(res => {
					if(res.data.code === 200000) {
						this.$message.success('保存成功！')
					}
				})
			}
		},
		saveRebootConfig (form) {
				this.$refs[form].validate((valid) => {
				if (valid) {
					let params = {
						...this.form2,
						rebootTime: this.moment(this.form2.rebootTime).format("HH:mm:ss"),
					}
					setRebootConfig(params).then(res => {
						if(res.data.code == 200000) {
							this.$message({
								message: '保存成功！',
								type: 'success'
							})
						}else {
							this.$message({
								showClose:true,
								message: '保存失败',
								type: 'error'
							})
						}
					}).catch(err => console.log(err))
				}
			})
		},
      
		// 一键重启
		reboot() {
			this.$confirm('此操作不可撤回, 是否确认重启设备?', '重启提示', {
				confirmButtonText: '确定'
			}).then(res => {
				this.$confirm('设备正在重启中, 请稍等...', '重启提示', {
					showClose: false,
					showConfirmButton: false,
					showCancelButton: false,
					beforeClose: function() {console.log("beforeClose")}
				})
				systemReboot().then(() => {
				let interval = setInterval(() => {
					service.get('/api/system/systeminfo')
						.then(res => {
							clearInterval(interval)
							setTimeout (() => {
								this.$msgbox.close()
								if (this.APPMODE_CONFIG.Reboot.remote) { // T+L
									window.location.href=`http://${HOST}/login`
								} else {
									this.$router.push({name: 'login'})
									window.location.reload()
								}
								// this.$message.success('设备重启成功, 即将返回登录界面!')
							}, 10000)
						}).catch(err => {
							if (err.response.status === 401) { // 设备重启后, token失效
								// 直接关闭Message弹框
								this.$msgbox.close()
								clearInterval(interval)
								window.location.reload()
								// this.$message.success('设备重启成功, 即将返回登录界面!')
							}
							console.log('重启中')
						})
					}, 20*1000)
				})
			})
		},
		// 清除数据
		reset () {
			this.$confirm('此操作不可撤回, 是否确认清除用户数据?', '清除用户数据提示', {
				confirmButtonText: '确定'
			}).then(res => {
				this.$confirm('设备正在清除用户数据, 请稍等...', '清除用户数据提示', {
					showClose: false,
					showConfirmButton: false,
					showCancelButton: false,
					beforeClose: function() {console.log("beforeClose")}
				})
				systemReset().then(_ => {
					let interval = setInterval(() => {
						service.get('/api/system/systeminfo').then(res => {
							clearInterval(interval)
							setTimeout (() => {
							if (this.APPMODE_CONFIG.Reboot.remote) { // T+L
								window.location.href=`http://${HOST}/login`
							} else {
								this.$router.push({name: 'login'})
								window.location.reload()
							}
							// this.$message.success('清除数据成功, 即将返回登录界面!')
							}, 10000)
						})
						.catch(err => {
							if (err.response.status === 401) { // 设备重启后, token失效
								// 直接关闭Message弹框
								// this.$message.success('清除数据成功, 即将返回登录界面!')
								this.$msgbox.close()
								clearInterval(interval)
								window.location.reload()
							}
							console.log('清除数据中')
						})
					}, 20*1000)
				})
			})
		},
	},
}
</script>
<style lang="less" scoped>
.cmFont {
    height: 17px;
    font-size: 12px;
    font-family: PingFangSC-Regular,PingFang SC;
    font-weight: 400;
    line-height: 17px;
}
  
.showDetail:hover {
  cursor: pointer;
  color: #3a74ff;
}

.sysContent {
    height: 49px;
    line-height: 49px;
    background-color: #fff;
    white-space: nowrap;
}
/deep/ .el-form-item {
	margin-bottom: 10px;
}
/deep/ .el-form-item__label {
	color: #626262 !important;
}
</style>
