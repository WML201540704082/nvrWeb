<template>
	<div class="device-config">
		<div class="top_select">
			<el-form :model="form2" size="mini" label-width="80px" label-position="left">
					<el-form-item label="报警设备" >
							<el-select @change="onDeviceChange" v-model="form2.deviceIP" placeholder="请选择">
									<el-option v-for="item in deviceData" :label="item.deviceName" :value="item.id" :key="item.id"></el-option>
							</el-select>
					</el-form-item>
			</el-form>	
			<div class="gap_line"></div>
		</div>
		<div id="alarmTabs">
			<el-tabs type="card"  v-model="activeName" @tab-click="handleClick">
				<el-tab-pane label="报警输入" name="first">
					<div class="tab-top-center">
						<el-form :model="form3"  :inline="true" size="mini" label-width="80px" label-position="left">
							<el-form-item label="报警端子" >
								<el-select @change="onTerminalChange" v-model="form3.alarmTerminal" placeholder="请选择">
									<el-option v-for="item in GpioInList" :label="item" :value="item" :key="item"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="端子名称" style="margin: 0 20px;">
								<el-input v-model="form3.name" placeholder="请输入" type="text" ></el-input>
							</el-form-item>
							<!-- <el-form-item label="防区类型" >
								<el-select v-model="form3.protectionType" placeholder="请选择">
									<el-option label="24小时防区" value="1"></el-option>
									<el-option label="即时防区" value="2"></el-option>
									<el-option label="延时防区" value="3"></el-option>
									<el-option label="路旁" value="4"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="端子状态" style="margin-left: 20px;">
								<el-radio-group v-model="isterminal1" >
									<el-radio label="1">常开</el-radio>
									<el-radio label="0">常闭</el-radio>
								</el-radio-group>
							</el-form-item> -->
						</el-form>	
					</div>
					<div>
						<div>
							<div class="mainDiv">
								<div class="device-left">
									<div v-if="activeItem1=='1'" class="left">
										<el-button size="small" class="copyBtn" @click="onChnnelCopy">复制</el-button>
										<Time style="min-width: 760px" key="1" ref="TImeRef1" :timeArr="timeArr" :Index="1"  />
									</div>
									<div class="left-bottom">
										<div class="left-bottom-top">联动录像</div>
										<div class="checkGroup">
											<div class="checkBoxT checkBox1">
												<div class="checkGroupName">
													联动录像
													<button class="clearAll" @click="clearAll">清除全部</button>
												</div>
												<div class="checkGroupMain">
													<el-checkbox-group v-model="channelSelect1" >
														<el-checkbox-button v-for="item in channelList" :label="String(item.channel)" :key="String(item.channel)">{{item.chType}}</el-checkbox-button>
													</el-checkbox-group>
												</div>
											</div>
											<div class="checkBoxT checkBox2">
												<div class="checkGroupName">
													联动截图
													<button class="clearAll" @click="clearAll">清除全部</button>
												</div>
												<div class="checkGroupMain">
													<el-checkbox-group v-model="channelSelect1" >
														<el-checkbox-button v-for="item in channelList" :label="String(item.channel)" :key="String(item.channel)">{{item.chType}}</el-checkbox-button>
													</el-checkbox-group>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="right">
									<div class="btn-enable">
										<span class="enable_title enable_title1">开启布防</span>
										<el-switch v-model="checked1" size="mini"></el-switch>
									</div>
									<div class="right-bottom">
											<div class="checkBox3">
												<div class="top_name">常规联动</div>
												<div class="btn-enable btn-enable1">
													<span class="enable_title">网络上传</span>
													<el-switch v-model="isNetworkUpload" size="mini"></el-switch>
												</div>
											</div>
											<!-- <div class="checkBox3">
												<div class="checkBoxName">云台联动</div>
												<div class="checkBoxMain">
													<el-checkbox  label="启用" key="1"></el-checkbox>
												</div>
											</div> -->
											<div class="checkBox4">
												<div class="btn-enable btn-enable1">
													<span class="enable_title">联动报警输出</span>
												</div>
												<div class="checkBoxMain">
													<el-checkbox-group v-model="checkedGpioOut" @change="gpioOutChange">
														<el-checkbox v-for="item in GpioOutList" :label="item" :key="item">{{item}}</el-checkbox>
													</el-checkbox-group>
												</div>
											</div>
											<!-- <div class="checkBox3">
												<div class="checkBoxName">
													<el-checkbox :indeterminate="isIndeterminateIPOut" v-model="IPOutcheckAll" @change="IPOutAllChange">IP报警输出</el-checkbox>
												</div>
												<div class="checkBoxMain">
													<el-checkbox-group v-model="checkedIPOut" @change="IPOutChange">
														<el-checkbox v-for="item in IPOutList" :label="item" :key="item">{{item}}</el-checkbox>
													</el-checkbox-group>
												</div>
											</div> -->
											<!-- <div class="checkBox4">
												<div class="checkBoxName">
													<el-checkbox :indeterminate="isIndeterminateNetOut" v-model="NetOutcheckAll" @change="NetOutAllChange">网络报警输出</el-checkbox>
												</div>
												<div class="checkBoxMain">
													<el-checkbox-group v-model="checkedNetOut" @change="NetOutChange">
														<el-checkbox v-for="item in NetOutList" :label="item" :key="item">{{item}}</el-checkbox>
													</el-checkbox-group>
												</div>
											</div> -->
										</div>
										
										<div class="PTZ">
											<div class="PTZ-title">PTZ云台联动</div>
											<el-form label-width="80px" class="ptzCon" v-if="currentChannel">
												<el-form-item label="通道选择" label-width="95px">
													<el-select size="mini" v-model="currentChannel" placeholder="请选择">
														<el-option
															v-for="item in channelList"
															:key="Number(item.channel)"
															:label="item.chName"
															:value="Number(item.channel)">
														</el-option>
													</el-select>
												</el-form-item>
												<br/>
												<el-radio-group v-model="linkPTZ[currentChannel].type">
													<el-radio :label="1" @click.native.prevent="changeLabelCheck(1)">
														<el-form-item label="预置点选择">
															<el-select class="deploy_select" v-model="presetChecked" size="mini" placeholder="请选择">
																<el-option v-for="item in presetList" :label="item.name" :value="item.index" :key="'preset' + item.index">{{item.name}}</el-option>
															</el-select>
														</el-form-item>
													</el-radio>
													<br/>
													<el-radio :label="2" @click.native.prevent="changeLabelCheck(2)">
														<el-form-item label="巡航选择">
															<el-select class="deploy_select" v-model="tourChecked" size="mini" placeholder="请选择">
																<el-option v-for="item in tourList" :label="'巡航路径' + item.index" :value="item.index" :key="'tour' + item.index">{{'巡航路径' + item.index}}</el-option>
															</el-select>
														</el-form-item>
													</el-radio>
													<br/>
													<!-- <el-radio :label="3" @click.native.prevent="changeLabelCheck(3)">
														<el-form-item label="轨迹选择">
															<el-select class="deploy_select" v-model="trackChecked" size="mini" placeholder="请选择">
																<el-option v-for="item in trackList" :label="'轨迹' + item.index" :value="item.index" :key="'track' + item.index">{{'轨迹' + item.index}}</el-option>
															</el-select>
														</el-form-item>
													</el-radio> -->
												</el-radio-group>
											</el-form>
											<br/>
											<el-button size="small" type="primary" :disabled="!(enablePreset && enableTour)" @click="onSave">应用</el-button>
										</div>
								</div>
								<div class="btnList">
								</div>
								</div>
							</div>
					</div>
				</el-tab-pane>
				<el-tab-pane label="报警输出" name="second">
					<div class="tab-top-center">
						<el-form :model="form4" :rules="dataRule" ref="form4"  :inline="true" size="mini" label-width="80px" label-position="left">
							<el-form-item label="报警端子" >
								<el-select @change="onTerminalChange2" v-model="form4.alarmTerminal" placeholder="请选择">
									<el-option v-for="item in GpioInList" :label="item" :value="item" :key="item"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="端子名称" style="margin: 0 20px">
								<el-input v-model="form4.name"  type="text" placeholder="请输入"></el-input>
							</el-form-item>
							<el-form-item label="输出延时" prop="delayTime">
								<el-input v-model.number="form4.delayTime" style="width: 90%;"  type="text" ></el-input>
								<span class="second-delay">秒</span>
							</el-form-item>
							<!-- <el-form-item label="端子状态" style="margin-left: 20px;">
								<el-radio-group v-model="isterminal2" >
									<el-radio label="1">常开</el-radio>
									<el-radio label="0">常闭</el-radio>
								</el-radio-group>
							</el-form-item> -->
						</el-form>	
					</div>
					<div>
							<div class="mainDiv mainDiv1">
								<div class="btn-enable">
									<span class="enable_title enable_title1">开启布防</span>
									<el-switch v-model="checked2" size="mini"></el-switch>
								</div>
								<div v-if="activeItem2=='1'" class="left">
									<Time style="min-width: 960px" ref="TImeRef2" key="2" :timeArr="timeArr2"  :Index="2" />
								</div>
							</div>
					</div>
					<div class="btnList">
						<el-button size="small" class="copyBtn" @click="onChnnelCopy">复制</el-button>
						<el-button size="small" class="btn2" @click="onSave2">应用</el-button>
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>
		<el-dialog :append-to-body="true"  :close-on-click-modal="false"  title="" :visible.sync="dialogVisibleChannel" @close="onChannelClose">
			<div  style="padding: 10px 0">
				本地端子
			</div>
					<el-checkbox :indeterminate="isIndeterminateChannel" v-model="checkAllChannel" @change="checkAllChannelChange">全选</el-checkbox>
			<div style="border-bottom: 1px solid #ccc;margin: 10px 0"></div>
					<el-checkbox-group v-model="checkedChannel" @change="checkedChannelChange">
						<el-checkbox v-for="item in channels" :label="item" :key="item">{{item}}</el-checkbox>
					</el-checkbox-group>
			<div style="padding: 10px 0">
				IP端子
			</div>
					<el-checkbox :indeterminate="isIndeterminateChannelIP" v-model="checkAllChannelIP" @change="checkAllChannelChangeIP">全选</el-checkbox>
			<div style="border-bottom: 1px solid #ccc;margin: 10px 0"></div>
					<el-checkbox-group v-model="checkedChannelIP" @change="checkedChannelChangeIP">
						<el-checkbox v-for="item in channelsIP" :label="item" :key="item">{{item}}</el-checkbox>
					</el-checkbox-group>
					<div slot="footer" class="dialog-footer">
						<el-button @click="onChannelClose">取 消</el-button>
						<el-button type="primary" @click="onChannelSave">确 定</el-button>
					</div>
			</el-dialog>
	</div>
	
	</template>
	
	<script>
	import Time from './timeSlider/Time.vue'
	import { queryTourByChannelId, queryPatternByChannelId } from "@/api";
	import { getChannelList, getAlarmManagement, getGpioIn, getGpioOut,getAlarmInput,postAlarmInput,
		getAlarmOutput,postAlarmOutput, getPresets} from '@/api/systemAPI';
	import axios from 'axios';
	export default {
		components: {
			Time,
		},
		props: {
			clickFlag:{
				type: Boolean,
				require: true
			}
		},
		data() {
			let limitNumber = (rule, value, callback) => {
					if(isNaN(value)){
							callback(new Error('只允许输入数字'))
					} else if (rule.isInteger && !Number.isInteger(+value)) {
							callback(new Error('只允许输入整数'))
					} else if (Number(value) && value % 1 === 0 && value >= 0) {
						callback();
					} else {
						return callback(new Error("请输入正整数！"));
					}
			}
			return{
				activeName: 'first',
				enableGpOut: false,
				deviceData: [],
				form2: {
					deviceIP: '',
				},
				form3: {
					alarmTerminal:'',
					name:'',
					protectionType:'',
					isterminal:'1',
				},
				isterminal1: "",
				isterminal2: "",
				form4: {
					alarmTerminal:'',
					name:'',
					delayTime:10,
					isterminal:'1',
				},
				dataRule: {
						delayTime: [{ required: true, message: '请输入输出延时', trigger: 'blur' },
										{ validator: limitNumber, trigger: 'blur' }]
				},
				checked1: false,
							activeItem1: '2',
				checked2: false,
				defenseTime: [],
				timeArr: [
					{label: '星期一',id:1, timeObj:{type1:[]}},
					{label: '星期二',id:2, timeObj:{type1:[]}},
					{label: '星期三',id:3, timeObj:{type1:[]}},
					{label: '星期四',id:4, timeObj:{type1:[]}},
					{label: '星期五',id:5, timeObj:{type1:[]}},
					{label: '星期六',id:6, timeObj:{type1:[]}},
					{label: '星期日',id:7, timeObj:{type1:[]}}, //{end: "15:46:40",start: "12:28:20"}
				],
				timeArr2: [
					{label: '星期一',id:1, timeObj:{type1:[]}},
					{label: '星期二',id:2, timeObj:{type1:[]}},
					{label: '星期三',id:3, timeObj:{type1:[]}},
					{label: '星期四',id:4, timeObj:{type1:[]}},
					{label: '星期五',id:5, timeObj:{type1:[]}},
					{label: '星期六',id:6, timeObj:{type1:[]}},
					{label: '星期日',id:7, timeObj:{type1:[]}}, //{end: "15:46:40",start: "12:28:20"}
				],
							activeItem2: '2',
				GpioInList: [],
				GpioOutList: [],
				channelList: [],
				currentChannel: '',
				channelObj: {},
				channelSelect1: [],
				channelSelect2: [],
				isNetworkUpload: false,
							regularVal: ['1'],
							regularArr: [{name: '网络上传',id: 1}],
							checkedGpioOut: [],
				GpioOutcheckAll: false,
				isIndeterminateGpioOut: false,
							IPOutcheckAll: [],
							checkedIPOut: [],
							IPOutList: ["D1端子","D2端子","D3端子","D4端子","D5端子",],
				linkPTZ: {},
				presetList: [],
				tourList: [],
				trackList: [],
				presetChecked: '',
				tourChecked: '',
				trackChecked: '',
				IPOutcheckAll: false,
				isIndeterminateIPOut: false,
							NetOutcheckAll: [],
							checkedNetOut: [],
							NetOutList: ["A1-1端子","A1-2端子","A1-3端子","A1-4端子","A1-5端子",],
				NetOutcheckAll: false,
				isIndeterminateNetOut: false,
				dialogVisibleChannel: false,
				checkAllChannel: false,
				checkedChannel: [],
				checkedChannelSave: [],
				channels: [],
				isIndeterminateChannel: false,
				checkAllChannelIP: false,
				checkedChannelIP: [],
				checkedChannelSaveIP: [],
				channelsIP: [],
				isIndeterminateChannelIP: false,
				rowID: '',
				enablePreset : true,
				enableTour: true,
				// enableTrack: false,
			}
		},
		mounted(){
			this.queryAlarmData()
			this.queryChannelList()
			this.queryGpioIn()
			this.queryOutData()
			this.enableGpOut = false
		},
			watch:{
				clickFlag:{
						handler(val,oldVal){
				console.log(val)
				if(val) {
					this.activeItem1 = '1'
				}
						},
						deep:true,
						immediate:true,
				},
				currentChannel(val) {
					this.getPreset(val)
				},
			},
		methods:{
			 // 获取设备列表
					queryAlarmData() {
							getAlarmManagement().then(res => {
									if(res.data.code == 200000) {
											this.deviceData = res.data.data
						this.form2.deviceIP = res.data.data&&res.data.data.length ? res.data.data[0].id:''
						
									}
							})
					},
			 // 获取通道列表
					queryChannelList() {
					this.channelList = []
					getChannelList().then(res => {
							if(res.data.code == 200000) {
								this.channelList = res.data.data.map(item => {
								let name = !item.chanNameList ? '' : (item.chanNameList.length>0 ? item.chanNameList[0].channelName : '')
								return {
									...item,
									chName: '[' + item.channelType + "" + item.channel + ']' + name,
									chType: item.channelType + item.channel
								}
							})
							this.currentChannel = this.channelList[0].channel
							// this.getPreset(this.currentChannel)
							console.info(this.channelList)
							}
						})
					},
				clearAll() {
					this.channelSelect1 = []
				},
			 // 获取输入端子列表
					queryGpioIn() {
				this.checkedChannelSave=[]
				this.checkedChannelSaveIP=[]
				axios.all([getGpioIn()]).then(res => {
					let arr1 = []
					let arr2 = []
					if(res[0].data.code==200000) {
						arr1 = res[0].data.data
					}
					// if(res[1].data.code==200000) {
					// 	arr2 = res[1].data.data
					// }
					this.GpioInList = [...arr1]
					this.channels = arr1
					this.channelsIP = arr1
					if(this.GpioInList[0]){
						if(arr1.length){
							this.checkedChannelSave = [this.GpioInList[0]]
						} else {
							this.checkedChannelSaveIP = [this.GpioInList[0]]
						}
						this.form3.alarmTerminal = this.GpioInList[0]
						this.queryAlarmInput(this.GpioInList[0])
					}
					
							})
					},
				getPreset(channelId) {
					this.enablePreset = false
					this.enableTour = false
					// this.enableTrack = false
					getPresets(channelId).then(res => {
						if (res.data.code === 200000) {
							let data = res.data.data;
							this.presetList = data
							this.presetChecked = this.presetList[this.linkPTZ[channelId].preset - 1].index
							this.enablePreset = true
						}
					}).catch(err => {
						this.presetList = []
						for(let i = 1; i <= 256; i++) {
							this.presetList.push({index: i, name: `预置点${i}`})
						}
						this.presetChecked = this.presetList[this.linkPTZ[channelId].preset - 1].index
						this.enablePreset = true
					})
					queryTourByChannelId(channelId).then(res => {
							if (res.data.code === 200000) {
									let data = res.data.data;
									let { tours } = data;
									this.tourList = tours
									this.tourChecked = this.tourList[this.linkPTZ[channelId].tour - 1].index
									this.enableTour = true
							}
					}).catch(err => {
						this.tourList = []
						for(let i = 1; i <= 4; i++) {
							this.tourList.push({index: i, name: `巡航路径${i}`})
						}
						this.tourChecked = this.tourList[this.linkPTZ[channelId].tour - 1].index
						this.enableTour = true
					})
					// queryPatternByChannelId(channelId).then(res => {
					// 	if (res.data.code === 200000) {
					// 		let data = res.data.data;
					// 		let { track } = data;
					// 		this.tourList = track
					// 		this.trackChecked = this.trackList[this.linkPTZ[channelId].track - 1].index
					// 		this.enableTrack = true
					// 	}
					// }).catch(err => {
					// 	this.trackList = []
					// 	for(let i = 1; i <= 4; i++) {
					// 		this.trackList.push({index: i, name: `轨迹${i}`})
					// 	}
					// 	this.trackChecked = this.trackList[this.linkPTZ[channelId].track - 1].index
					// 	this.enableTrack = true
					// })
				},
				queryOutData(){
				this.GpioOutList = []
				this.IPOutList = []
				getGpioOut().then(res=>{
					if(res.data.code==200000){
						this.GpioOutList=res.data.data
					}
				})
			},
			 // 获取输出端子列表
					queryGpioOut() {
				this.checkedChannelSave=[]
				this.checkedChannelSaveIP=[]
				axios.all([getGpioOut()]).then(res => {
					let arr1 = []
					let arr2 = []
					if(res[0].data.code==200000) {
						arr1 = res[0].data.data
					}
					// if(res[1].data.code==200000) {
					// 	arr2 = res[1].data.data
					// }
					this.GpioInList = [...arr1]
					this.channels = arr1
					this.channelsIP = arr1
					if(this.GpioInList[0]){
						this.form4.alarmTerminal = this.GpioInList[0]
						if(arr1.length){
							this.checkedChannelSave = [this.GpioInList[0]]
						} else {
							this.checkedChannelSaveIP = [this.GpioInList[0]]
						}
						this.onTerminalChange2(this.GpioInList[0])
					}
					
							})
					},
			// 报警输入
			queryAlarmInput(ID){
				this.timeArr = [
					{label: '星期一',id:1, timeObj:{type1:[]}},
					{label: '星期二',id:2, timeObj:{type1:[]}},
					{label: '星期三',id:3, timeObj:{type1:[]}},
					{label: '星期四',id:4, timeObj:{type1:[]}},
					{label: '星期五',id:5, timeObj:{type1:[]}},
					{label: '星期六',id:6, timeObj:{type1:[]}},
					{label: '星期日',id:7, timeObj:{type1:[]}}, //{end: "15:46:40",start: "12:28:20"}
				]
				this.channelSelect1 = []
				this.channelSelect2 = []
				this.checkedGpioOut = []
				this.checked1 = true
				this.isterminal1 = ""
				this.form3.name = ""
				this.isNetworkUpload = true
				this.rowID = ''
				getAlarmInput(ID).then(res => {
					if(res.data.code == 200000){
						let data = res.data.data
						this.defenseTime = data.defenseTime
						this.channelSelect1 = data.linkageVideo.video||[]
						this.channelSelect2 = data.linkageVideo.screenshots||[]
						this.checkedGpioOut = data.linkageOutput.localAlarmOutput||[]
						this.linkPTZ = data.linkagePTZ || {}
						this.GpioOutcheckAll = this.checkedGpioOut.length == this.GpioOutList.length
						this.checked1 = data.enable == 1 ? true:false
						this.form3.protectionType = data.protectionType
						this.isterminal1 = data.isTerminal + ""
						this.form3.name = data.name
						this.rowID = data.id
						this.isNetworkUpload = data.linkageOutput.isNetworkUpload == 1 ? true:false
						this.formatTimeArr1(data.defenseTime)
					}
				})
			},
			changeLabelCheck(val) {
				(val == this.linkPTZ[this.currentChannel].type) ? this.linkPTZ[this.currentChannel].type = 0 : this.linkPTZ[this.currentChannel].type = val
			},
			// 报警输出
			queryAlarmOutput(ID){
				this.timeArr2= [
					{label: '星期一',id:1, timeObj:{type1:[]}},
					{label: '星期二',id:2, timeObj:{type1:[]}},
					{label: '星期三',id:3, timeObj:{type1:[]}},
					{label: '星期四',id:4, timeObj:{type1:[]}},
					{label: '星期五',id:5, timeObj:{type1:[]}},
					{label: '星期六',id:6, timeObj:{type1:[]}},
					{label: '星期日',id:7, timeObj:{type1:[]}}, //{end: "15:46:40",start: "12:28:20"}
				]
				this.checked2 = false
				this.isterminal2 = ""
				this.form4.name = ""
				this.rowID = ''
				getAlarmOutput(ID).then(res => {
					if(res.data.code == 200000){
						let data = res.data.data
						this.checked2 = data.enable ? true:false
						this.isterminal2 = data.isTerminal + ""
						this.form4.name = data.name
						this.rowID = data.id
						this.form4.delayTime = data.delayTime
						this.formatTimeArr2(data.defenseTime)
					}
				})
			},
			formatTimeArr1(record){
				if(!record) {
					this.timeArr = [
						{label: '星期一',id:1, timeObj:{type1:[]}},
						{label: '星期二',id:2, timeObj:{type1:[]}},
						{label: '星期三',id:3, timeObj:{type1:[]}},
						{label: '星期四',id:4, timeObj:{type1:[]}},
						{label: '星期五',id:5, timeObj:{type1:[]}},
						{label: '星期六',id:6, timeObj:{type1:[]}},
						{label: '星期日',id:7, timeObj:{type1:[]}},
					]
					this.$refs.TImeRef1&&this.$refs.TImeRef1.updataReloadFlag()
					return
				}
				this.timeArr.map(item=>{
					let arr =  record.filter(sub=>{return sub.week ==item.id })
					item.timeObj.type1 = arr[0]&&arr[0].time ? arr[0]&&arr[0].time : [{end: "00:00:00",start: "23:59:59"}]
				})
				this.$refs.TImeRef1&&this.$refs.TImeRef1.updataReloadFlag()
			},
			formatTimeArr2(record){
				if(!record){
					this.timeArr2 = [
					{label: '星期一',id:1, timeObj:{type1:[]}},
					{label: '星期二',id:2, timeObj:{type1:[]}},
					{label: '星期三',id:3, timeObj:{type1:[]}},
					{label: '星期四',id:4, timeObj:{type1:[]}},
					{label: '星期五',id:5, timeObj:{type1:[]}},
					{label: '星期六',id:6, timeObj:{type1:[]}},
					{label: '星期日',id:7, timeObj:{type1:[]}},
					]
					this.$refs.TImeRef2&&this.$refs.TImeRef2.updataReloadFlag()
					return
				}
				this.timeArr2.map(item=>{
					let arr =  record.filter(sub=>{return sub.week ==item.id })
					item.timeObj.type1 = arr[0]&&arr[0].time ? arr[0]&&arr[0].time : [{end: "00:00:00",start: "23:59:59"}]
				})
				this.$refs.TImeRef2&&this.$refs.TImeRef2.updataReloadFlag()
			},
			_formatTimeArr1(record){
				let arr = [
				]
				record.forEach(item=>{
					arr.push({
						time: item.timeObj.type1,
						week: item.id,
					})
				})
				return arr
			},
			// 报警设备chang
			onDeviceChange(e){
				// this.queryAlarmInput(e)
			},
			// 报警端子change
			onTerminalChange(e){
				this.queryAlarmInput(e)
				this.checkedChannelSave = [this.form3.alarmTerminal]
			},
			// 报警端子change
			onTerminalChange2(e){
				this.queryAlarmOutput(e)
				this.checkedChannelSave = [this.form4.alarmTerminal]
			},
			handleClick(e){
				if(e.name =="second") {
					this.activeItem2 = '1'
					this.queryGpioOut()
				} else {
					this.queryGpioIn()
				}
			},
			onClick1(e) {
							this.activeItem1 = e
					},
			onClick2(e) {
							this.activeItem2 = e
					},
			// 本地报警输出全选
			gpioOutAllChange(val) {
				this.checkedGpioOut = val ? this.GpioOutList : [];
				this.isIndeterminateGpioOut = false;
			},
			gpioOutChange(value) {
				let checkedCount = value.length;
				this.GpioOutcheckAll = checkedCount === this.GpioOutList.length;
				this.isIndeterminateGpioOut = checkedCount > 0 && checkedCount < this.GpioOutList.length;
			},
			// IP报警输出全选
			IPOutAllChange(val) {
				this.checkedIPOut = val ? this.IPOutList : [];
				this.isIndeterminateIPOut = false;
			},
			IPOutChange(value) {
				let checkedCount = value.length;
				this.IPOutcheckAll = checkedCount === this.IPOutList.length;
				this.isIndeterminateIPOut = checkedCount > 0 && checkedCount < this.IPOutList.length;
			},
			// 网络报警输出全选
			NetOutAllChange(val) {
				this.checkedNetOut = val ? this.NetOutList : [];
				this.isIndeterminateNetOut = false;
			},
			NetOutChange(value) {
				let checkedCount = value.length;
				this.NetOutcheckAll = checkedCount === this.NetOutList.length;
				this.isIndeterminateNetOut = checkedCount > 0 && checkedCount < this.NetOutList.length;
			},
			// 复制保存
			checkAllChannelChange(val) {
				this.checkedChannel = val ? this.channels : [];
				this.isIndeterminateChannel = false;
			},
			checkedChannelChange(value) {
				let checkedCount = value.length;
				this.checkAllChannel = checkedCount === this.channels.length;
				this.isIndeterminateChannel = checkedCount > 0 && checkedCount < this.channels.length;
			},
			// IP复制保存
			checkAllChannelChangeIP(val) {
				this.checkedChannelIP = val ? this.channelsIP : [];
				this.isIndeterminateChannelIP = false;
			},
			checkedChannelChangeIP(value) {
				let checkedCount = value.length;
				this.checkAllChannelIP = checkedCount === this.channelsIP.length;
				this.isIndeterminateChannelIP = checkedCount > 0 && checkedCount < this.channelsIP.length;
			},
			// show复制到通道
			onChnnelCopy() {
				this.dialogVisibleChannel = true
				this.checkedChannel = this.checkedChannelSave
				this.checkedChannelIP = this.checkedChannelSaveIP
			},
			// 复制到通道保存
			onChannelSave(){
				this.checkedChannelSave =  this.checkedChannel
				this.checkedChannelSaveIP =  this.checkedChannelIP
				this.dialogVisibleChannel = false
			},
			// 复制到通道保存
			onChannelClose(){
				this.dialogVisibleChannel = false
				this.checkedChannel = []
				this.checkedChannelIP = []
			},
			// 应用保存
			onSave() {
				if(this.currentChannel) {
					this.linkPTZ[this.currentChannel].preset = this.presetChecked
					this.linkPTZ[this.currentChannel].tour = this.tourChecked
					this.linkPTZ[this.currentChannel].track = this.trackChecked || 1
				}
				let obj ={
					"isterminal": Number(this.isterminal1),
					"linkageVideo": {
						"video": this.channelSelect1 || [],
						"screenshots": this.channelSelect2 || []
					},
					"linkageOutput": {
						"isNetworkUpload": this.isNetworkUpload ? 1 : 0,
						"localAlarmOutput": this.checkedGpioOut,
						"isSendEmail": 18,
						"networkAlarmOutput": [],
						"iPAlarmOutput": []
					},
					"linkagePTZ": this.linkPTZ || {},
					"alarmTerminal": this.form3.alarmTerminal,
					"enable": Number(this.checked1),
					"name": this.form3.name,
					"alarmDeviceID": this.form2.deviceIP,
					"defenseTime": this._formatTimeArr1(this.timeArr) || [],
					"protectionType": this.form3.protectionType
					}
				let arr = [...this.checkedChannelSave,...this.checkedChannelSaveIP]
				let i = 0
				arr.forEach(item=>{
					let params1 = {
						...obj,
						alarmTerminal: item,
					}
					let params2 = {
						defenseTime: obj.defenseTime,
						alarmTerminal: item
					}
					let params = obj.alarmTerminal === item ? params1 : params2
					postAlarmInput(params).then(res=>{
						i++
						if(i == arr.length) {
							if(res.data.code==200000){
								this.$message({
									showClose: true,
									message: '保存成功',
									type: 'success'
								})
							} else {
								this.$message({
									showClose: true,
									message: '保存失败',
									type: 'error'
								})
							}
						}
					}).catch(()=>{
						i++
						if(i == arr.length) {
							this.$message({
								showClose: true,
								message: '保存失败',
								type: 'error'
							})
						}
					})
				})
			},
			// 应用保存
			onSave2() {
				this.$refs["form4"].validate((valid) => {
					if(valid) {
						let obj ={
							"isterminal": Number(this.isterminal2),
							"enable": Number(this.checked2),
							"name": this.form4.name,
							"alarmDeviceID": this.form2.deviceIP,
							"delayTime": Number(this.form4.delayTime),
							"defenseTime": this._formatTimeArr1(this.timeArr2) || [],
							"alarmTerminal": this.form4.alarmTerminal,
							"protectionType": ""
							}
						let arr =  [...this.checkedChannelSave,...this.checkedChannelSaveIP]
						let i = 0
						arr.forEach(item=>{
							let params1 = {
								...obj,
								alarmTerminal: item,
							}
							let params2 = {
								defenseTime: obj.defenseTime,
								alarmTerminal: item
							}
							let params = obj.alarmTerminal === item ? params1 : params2
							postAlarmOutput( params ).then(res=>{
								i++
								if(i == arr.length) {
									if(res.data.code==200000){
										this.$message({
											showClose: true,
											message: '保存成功',
											type: 'success'
										})
									} else {
										this.$message({
											showClose: true,
											message: '保存失败',
											type: 'error'
										})
									}
								}
							}).catch(()=>{
								i++
								if(i == arr.length) {
									this.$message({
										showClose: true,
										message: '保存失败',
										type: 'error'
									})
								}
							})
						})
					}
				})
			}
		}
	}
	</script>
	
	<style scoped lang="less">
		#systemBox .device-config {
			background: #fff;
			.top_select {
				padding: 20px 0 20px 20px;
				.gap_line {
					margin-left: -20px;
					height: 15px;
					background: #EBEEF2;
				}
			}
			.tab-top-center {
				border-bottom: 1px solid #F1F2F4;
			}
			/deep/ .el-tabs--card>.el-tabs__header {
				border: none;
			}
			/deep/ .el-tabs__header .el-tabs__nav {
				height: 29px;
			}
			/deep/ #alarmTabs .el-tabs__header .el-tabs__item {
				width: 94px;
				height: 29px;
				line-height: 29px;
				vertical-align: middle;
				background: #fff;
				border-radius: 0px 2px 2px 0px;
				box-shadow: none;
				color: #666666;
				border: 1px solid #DCDFE6;
				margin-right: -1px;
			}
			/deep/ #alarmTabs .el-tabs__header .el-tabs__item.is-active {
				background: #E6F1FC;
				border-radius: 2px 0px 0px 2px;
				border: 1px solid #A3C5E5;
				color: #2178C8;
			}
		}
	.headDiv {
			background: #327CEC;
			color: #FFF;
			padding: 10px 20px;
			border-radius: 10px 10px 0 0 ;
	}
	.asideDiv, .mainDiv {
			display: inline-block;
	}
	.asideDiv{
			width: 120px;
			.item1{
					height: 38px;
					line-height: 38px;
					text-align: center;
					cursor: pointer;
			}
			.item1:hover {
					background: #DEE1E3;
			}
			.item1Active {
					background: #DEE1E3;
			}
	}
	.mainDiv1 {
		margin-top: 20px;
	}
	.second-delay {
		float: right;
		color: #666;
	}
	.mainDiv {
			width: calc(100%);
			height: 100%;
		overflow-y: auto;
		.device-left {
			border-right: 1px solid #ebeef5;
			padding-right: 10px;
			width: calc(100vw / 2.03);
			.left {
				margin-top: -20px;
				.copyBtn {
					height: 32px;
					margin-top: 24px;
					float: right;
					margin-right: 58px;
				}
			}
			.left-bottom {
				margin-top: -10px;
				font-size: 13px;
				.left-bottom-top {
					font-weight: 500;
					color: #333333;
				}
				.checkGroup {
					display: flex;
					justify-content: space-around;
					.checkBoxT {
						width: 45%;
						margin-top: 10px;
					}
					.checkGroupName {
						background: #F3F5F9;
						border-radius: 2px;
						color: #333;
						padding-left: 10px;
						height: 34px;
						line-height: 34px;
						display: flex;
						justify-content: space-between;
						.clearAll {
							margin-right: 10px;
							margin-top: 5px;
							width: 76px;
							height: 24px;
							background: #FFFFFF;
							color: #2178C8;
							border-radius: 2px;
							border: 1px solid #E4E4E4;
							cursor: pointer;
						}
					}
					.checkGroupMain {
						height: 200px;
						margin: 5px 10px;
						overflow: scroll;
					}
					.checkBox1 {
						margin-left: 20px;
					}
					.checkBox2 {
						margin-right: 20px;
					}
				}
				/deep/ .el-checkbox-button, .el-checkbox-button__inner {
					width: 38px;
					height: 22px;
					line-height: 22px;
					background: #FFFFFF;
					border-radius: 1px;
					border: none;
					border: 1px solid #E5E5E5;
					margin: 5px;
				}
				/deep/ .el-checkbox-button__inner {
					border: none;
					width: 38px;
					height: 22px;
					line-height: 22px;
					font-size: 12px;
					text-align: center;
					padding: 0;
					font-weight: normal;
					color: #666;
				}
				/deep/ .el-checkbox-button.is-checked .el-checkbox-button__inner {
					background: none;
					border-radius: 1px;
					border: 1px solid #2178C8;
					color: #2178C8;
				}
			}
		}
		.btn-enable {
			color: #333;
			font-size: 13px;
			.enable_title {
				margin-right: 10px;
			}
			.enable_title1 {
				font-weight: bold;
			}
		}
		.btn-enable1 {
			margin-top: 20px;
		}
		.right {
			float: left;
			padding-left: 30px;
			margin-left: calc(100vw / 2);
			margin-top: -735px;
			.right-top {
				margin-top: 20px;
				width: 100%;
			}
			.right-bottom {
				margin-top: 20px;
			}
			.top_name {
				color: #333;
				font-size: 13px;
				font-weight: bold;
			}
			.PTZ {
				margin-top: 10px;
				.PTZ-title {
					font-size: 13px;
					margin-top: 10px;
					color: #333;
					font-weight: bold;
				}
				.ptzCon {
					margin-top: 10px;
				}
				/deep/ .el-form-item {
					margin-bottom: 10px;
					display: inline-block;
				}
				/deep/ .el-radio {
					font-weight: normal;
				}
				/deep/ .el-radio__label {
					padding-left: 0;
				}
				/deep/ .el-input__inner {
					width: 160px;
				}
			}
			// .save {
			// 	width: 78px;
			// 	height: 30px;
			// 	bottom: 0;
			// 	background: #2178C8;
			// 	border-radius: 2px;
			// 	color: #fff;
			// 	border: none;
			// 	font-size: 12px;
			// 	cursor: pointer;
			// }
		}
	}
	.checkBox,.checkBox2{
		display: inline-block;
		margin-top: 20px;
		min-width: 350px;
	}
	.checkBox3,.checkBox4{
		// margin-top: 20px;
		overflow-y: auto;
	}
	.checkBoxName {
		padding-left: 10px;
		height: 36px;
		line-height: 36px;
		background: #F3F5F9;
		color: #333333;
		font-size: 13px;
	}
	.checkBoxMain{
		padding: 20px;
	}
	/deep/ .el-checkbox-button, .el-checkbox-button__inner {
		width: 38px;
		height: 22px;
		line-height: 22px;
		background: #FFFFFF;
		border-radius: 1px;
		border: none;
		border: 1px solid #E5E5E5;
		margin: 5px;
	}
	/deep/ .el-checkbox-button__inner {
		border: none;
		width: 38px;
		height: 22px;
		line-height: 22px;
		font-size: 12px;
		text-align: center;
		padding: 0;
		font-weight: normal;
		color: #666;
	}
	/deep/ .el-checkbox-button.is-checked .el-checkbox-button__inner {
		background: none;
		border-radius: 1px;
		border: 1px solid #2178C8;
		color: #2178C8;
	}
	.btnList{
		margin-bottom: 40px;
		text-align: left;
		.btn1 {
			width: 58px;
			height: 30px;
			color: #2178C8;
			background: rgba(33,120,200,0.05);
			border-radius: 2px;
			border: 1px solid #2178C8;
		}
		.btn2 {
			color: #fff;
			width: 58px;
			height: 30px;
			background: #2178C8;
			border-radius: 2px;
		}
	}
	</style>
	