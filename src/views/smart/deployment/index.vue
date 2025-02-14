<template>
	<div class="deployment">
		<div class="deploy_left">
			<div>
				<div class="timeCon">
					<el-button size="small" class="copyBtn" @click="onChnnelCopy">复制</el-button>
					<Time v-if="isReloadData" ref="TImeRef" :timeArr="timeArr" style="min-width: 760px;"/>
				</div>
				<el-dialog title="复制到" :append-to-body="true"  :close-on-click-modal="false"  :visible.sync="dialogVisibleChannel" @close="onChannelClose">
					<el-checkbox :indeterminate="isIndeterminateChannel" v-model="checkAllChannel" @change="checkAllChannelChange">全选</el-checkbox>
						<el-checkbox-group v-model="checkedChannel" @change="checkedChannelChange">
							<el-checkbox v-for="item in channelList" :label="item.id" :key="item.id">{{`D${item.id}`}}</el-checkbox>
						</el-checkbox-group>
						<div slot="footer" class="dialog-footer">
							<el-button @click="onChannelClose">取 消</el-button>
							<el-button type="primary" @click="onChannelSave">确 定</el-button>
						</div>
				</el-dialog>
			</div>
			<div class="left_bottom">
				<div class="left_bottom_top">联动录像</div>
				<div class="checkGroup">
					<div class="checkBoxT checkBox1">
						<div class="checkGroupName">
							联动录像
							<button class="clearAll" @click="clearAll">清除全部</button>
						</div>
						<div class="checkGroupMain">
							<el-checkbox-group v-model="videoChecked" >
								<el-checkbox-button v-for="item in channelList" :label="item.id" :key="'video' + item.id" :disabled="item.id == channelId">{{`D${item.id}`}}</el-checkbox-button>
							</el-checkbox-group>
						</div>
					</div>
					<div class="checkBoxT checkBox2">
						<div class="checkGroupName">
							联动截图
							<button class="clearAll" @click="clearAll">清除全部</button>
						</div>
						<div class="checkGroupMain">
							<el-checkbox-group v-model="videoChecked" >
								<el-checkbox-button v-for="item in channelList" :label="item.id" :key="'screenshot' + item.id" :disabled="item.id == channelId">{{`D${item.id}`}}</el-checkbox-button>
							</el-checkbox-group>
						</div>
					</div>
				</div>
			</div>
		</div>
    <div class="deploy_right">
			<div class="btn-enable">
				<span class="enable_title">开启布防</span>
				<el-switch v-model="dfConfig.enable"></el-switch>
			</div>
      <div>
        <div class="deploy_right_top_title">常规联动</div>
				<div class="btn-enable btn-enable1">
					<span class="enable_title">网络上传</span>
					<el-switch v-model="isNetworkUpload"></el-switch>
				</div>
        <div class="checkBox">
					<div class="btn-enable btn-enable2">
						<span class="enable_title">联动报警输出</span>
						<!-- <el-switch v-model="enableGpOut"></el-switch> -->
					</div>
          <div class="checkBoxMain">
            <el-checkbox-group v-model="dfConfig.linkageOutput.localAlarmOutput">
              <el-checkbox v-for="item in GpioOutList" :label="item" :key="item">{{item}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div class="PTZ">
        <div class="deploy_right_top_title">PTZ云台联动</div>
				<el-form label-width="80px" class="ptzCon">
					<el-form-item label="通道选择" label-width="95px">
						<el-select size="mini" v-model="currentChannel" placeholder="请选择">
							<el-option
								v-for="item in channelList"
								:key="'ptz' + Number(item.id)"
								:label="item.chName"
								:value="Number(item.id)">
							</el-option>
						</el-select>
					</el-form-item>
					<br/>
					<div v-if="dfConfig.linkPTZ && dfConfig.linkPTZ[currentChannel]">
						<el-radio-group v-model="dfConfig.linkPTZ[currentChannel].type">
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
					</div>
				</el-form>
				<br/>
        <button class="save" @click="saveAll">保存配置</button>
      </div>
    </div>
  </div>
</template>
<script>
import { queryTourByChannelId, queryPatternByChannelId } from "@/api";
import { getGpioOut, getChannelDef, putChannelDef, getPresets } from '@/api/systemAPI';
import Time from './timeSlider/Time.vue';
export default {
  components: { Time },
	inject: ["reload"],
	data() {
		return{
			isReloadData: true,
			algoIndexArr: [
				'face',
				'pedestrian',
				'vehicle',
				'nonmotor',
				'shoot',
				'fall',
				'cash',
				'smogFire',
				'struggle',
				'skeleton',
				'fastMove',
				'remain',
				'specialPed',
				'stm',
				'hover',
				'bag',
				'ipcmove',
				'sleep',
				'adPost',
				'outOfBounds',
				'enterArea',
				'leaveArea',
				'playPhone',
				'grab',
				'smoking',
				'atmRemain',
				'recline',
				'faceClustering',
				'hijack',
				'flowAreasNew',
				'swapBag',
				'touchBag',
			],
			videoIndexArr: [
				'event-tamper',
				'event-videolose',
				'',
				'event-motion',
			],
			defData: {},
			dfConfig: {
				enable: false,
        defenseTime: [
					{time: [], week: 1},
					{time: [], week: 2},
					{time: [], week: 3},
					{time: [], week: 4},
					{time: [], week: 5},
					{time: [], week: 6},
					{time: [], week: 7}
				],
				linkageOutput: {
					isNetworkUpload: 0,
					localAlarmOutput: []
				},
				linkageVideo: {
					screenshots: [],
					video: []
				},
				linkPTZ: []
			},
			isGpioOut: false,
			channelList: [],
			channelChecked: [],
			algoName: '',
			channelId: '',
			algoIndex: '',
			timeArr: [
				{label: '星期一',id:1, timeObj:{type1:[]}},
				{label: '星期二',id:2, timeObj:{type1:[]}},
				{label: '星期三',id:3, timeObj:{type1:[]}},
				{label: '星期四',id:4, timeObj:{type1:[]}},
				{label: '星期五',id:5, timeObj:{type1:[]}},
				{label: '星期六',id:6, timeObj:{type1:[]}},
				{label: '星期日',id:7, timeObj:{type1:[]}}, //{end: "15:46:40",start: "12:28:20"}
			],
			GpioOutList: [],
			videoChecked: [],
			isNetworkUpload: false,
			outArr: [],//处理联动录像数据
			presetList: [],
			tourList: [],
			trackList: [],
			presetChecked: '',
			tourChecked: '',
			trackChecked: '',
			dialogVisibleChannel: false,
			checkAllChannel: false,
			checkedChannel: [],
			checkedChannelSave: [],
			isIndeterminateChannel: false,
			currentChannel: 1,
		}
	},
	created() {
	},
	mounted(){
		// this.getPreset()
		this.queryOutData()
	},
	watch:{
		algoIndex(newVal) {
			this.$refs.TImeRef?.clearCopy()
		},
		currentChannel(val) {
			this.getPreset(val)
		}
	},
	methods:{
		initDef(channelId, algoIndex, channelList, alName) {
			this.timeArr = [
				{label: '星期一',id:1, timeObj:{type1:[]}},
				{label: '星期二',id:2, timeObj:{type1:[]}},
				{label: '星期三',id:3, timeObj:{type1:[]}},
				{label: '星期四',id:4, timeObj:{type1:[]}},
				{label: '星期五',id:5, timeObj:{type1:[]}},
				{label: '星期六',id:6, timeObj:{type1:[]}},
				{label: '星期日',id:7, timeObj:{type1:[]}},
			]
			this.currentChannel = Number(channelId)
			this.channelId = channelId
			this.alName = alName
			this.algoIndex = algoIndex
			this.channelList = channelList
			this.channelDef(channelId, algoIndex)
			// this.$nextTick(() => {
			// 	this.getPreset(channelId)
			// })
		},
		channelDef(channelId, algoIndex) {
			getChannelDef( channelId ).then(res => {
				if(this.alName == 'video') {
					this.algoName = this.videoIndexArr[algoIndex]
				} else {
					this.algoName = this.algoIndexArr[algoIndex]
				}
				let dData = res.data.data
				this.defData[this.algoName] = dData[this.algoName]
				if(this.defData[this.algoName]) {
					this.dfConfig.enable = this.defData[this.algoName].enable
					// 时间
					this.dfConfig.defenseTime = this.defData[this.algoName].defenseTime
					this.formatTimeArr(this.defData[this.algoName].defenseTime)
	
					// 联动录像数据
					let videoData = this.defData[this.algoName].linkageVideo
					this.videoChecked = videoData.video
					
					// 其他联动方式
					
					let otherData = this.defData[this.algoName].linkageOutput
					this.isNetworkUpload = otherData.isNetworkUpload ? true : false
					this.dfConfig.linkageOutput.localAlarmOutput = otherData.localAlarmOutput

					// 云台联动
					this.dfConfig.linkPTZ = this.defData[this.algoName].linkPTZ || this.dfConfig.linkPTZ
					this.getPreset(channelId)

				}
			})
		},
		clearAll() {
      this.videoChecked = []
			this.videoChecked.push(this.channelId)
		},
		changeLabelCheck(val) {
			(val == this.dfConfig.linkPTZ[this.currentChannel].type) ? this.dfConfig.linkPTZ[this.currentChannel].type = 0 : this.dfConfig.linkPTZ[this.currentChannel].type = val
		},
		saveAll() {

			this.dfConfig.linkageVideo.video = this.videoChecked

			this.dfConfig.linkageOutput.isNetworkUpload = this.isNetworkUpload ? 1 : 0
			this.dfConfig.linkPTZ[this.currentChannel].preset = this.presetChecked
			this.dfConfig.linkPTZ[this.currentChannel].tour = this.tourChecked
			this.dfConfig.linkPTZ[this.currentChannel].track = this.trackChecked
			
			this.dfConfig.defenseTime = this._formatTimeArr1(this.timeArr) || []
      
			let dfConfig = {}
			dfConfig[this.algoName] = this.dfConfig
			putChannelDef(this.channelId, { dfConfig }).then(res => {
				this.$message.success('保存配置成功')
				this.isReloadData = false
				this.$nextTick(() => {
					this.isReloadData = true
				})
			})

			if(this.checkedChannelSave.length) {
				let timeConfig = this.dfConfig.defenseTime
				let dfConfig = {}
				dfConfig[this.algoName] = {defenseTime: timeConfig}
				this.checkedChannelSave.map(item => {
					putChannelDef(Number(item), { dfConfig }).then(res => {
						this.checkedChannelSave = this.checkedChannel = []
					})
				})
			}
		},
		getPreset(channelId) {
			getPresets(channelId).then(res => {
				if (res.data.code === 200000) {
					let data = res.data.data;
					this.presetList = data
					this.presetChecked = this.presetList[this.dfConfig.linkPTZ[this.currentChannel].preset - 1].index
				}
			}).catch(err => {
				console.log('通道不在线');
				this.presetList = []
				for(let i = 1; i <= 256; i++) {
					this.presetList.push({index: i, name: `预置点${i}`})
				}
				this.presetChecked = this.presetList[this.dfConfig.linkPTZ[this.currentChannel].preset - 1].index
			})
			queryTourByChannelId(channelId).then(res => {
					if (res.data.code === 200000) {
							let data = res.data.data;
							let { tours } = data;
							this.tourList = tours
							this.tourChecked = this.tourList[this.dfConfig.linkPTZ[this.currentChannel].tour - 1].index
					}
			}).catch(err => {
				console.log('通道不在线');
				this.tourList = []
				for(let i = 1; i <= 4; i++) {
					this.tourList.push({index: i, name: `巡航路径${i}`})
				}
				this.tourChecked = this.tourList[this.dfConfig.linkPTZ[this.currentChannel].tour - 1].index
			})
			queryPatternByChannelId(channelId).then(res => {
				if (res.data.code === 200000) {
					let data = res.data.data;
					let { track } = data;
					this.trackList = track
					this.trackChecked = this.trackList[this.dfConfig.linkPTZ[this.currentChannel].track - 1].index
				}
			}).catch(err => {
				console.log('通道不在线');
				this.trackList = []
				for(let i = 1; i <= 4; i++) {
					this.trackList.push({index: i, name: `轨迹${i}`})
				}
				this.trackChecked = this.trackList[this.dfConfig.linkPTZ[this.currentChannel].track - 1].index
			})
		},
		queryOutData(){
			this.GpioOutList = []
			getGpioOut().then(res=>{
				if(res.data.code==200000){
					this.GpioOutList=res.data.data
				}
			})
		},
		formatTimeArr(record){
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
				this.$refs.TImeRef && this.$refs.TImeRef.updataReloadFlag()
				return
			}
			this.timeArr.map(item=>{
				let arr =  record.filter(sub=>{return sub.week ==item.id })
				item.timeObj.type1 = arr[0]&&arr[0].time ? arr[0]&&arr[0].time : []
			})
			this.$refs.TImeRef&&this.$refs.TImeRef.updataReloadFlag()
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
		// 复制保存
		checkAllChannelChange(val) {
			this.checkedChannel = val ? this.channelList.map(item => {
				return item.id
			}) : [];
			this.isIndeterminateChannel = false;
		},
		checkedChannelChange(value) {
			let checkedCount = value.length;
			this.checkAllChannel = checkedCount === this.channelList.length;
			this.isIndeterminateChannel = checkedCount > 0 && checkedCount < this.channelList.length;
		},
		// show复制到通道
		onChnnelCopy() {
			this.dialogVisibleChannel = true
			this.checkedChannel = this.checkedChannelSave
		},
		// 复制到通道保存
		onChannelSave(){
			this.checkedChannelSave =  this.checkedChannel
			this.dialogVisibleChannel = false
		},
		// 复制到通道保存
		onChannelClose(){
			this.dialogVisibleChannel = false
			this.checkedChannel = []
		},
	}
}
</script>
<style lang="less" scoped>
.deployment {
	user-select: none;
	font-size: 13px;
	padding-right: 20px;
	padding-bottom: 50px;
}
.timeCon {
	margin-top: -20px;
	.copyBtn {
		height: 32px;
		margin-top: 23px;
		float: right;
		margin-right: 45px;
	}
}
.deploy_left {
	width: calc(100vw / 2.03);
	padding-right: 10px;
	border-right: 1px solid #ebeef5;
	// min-width: 650px;
	.left_bottom {
		margin-top: -10px;
		.left_bottom_top {
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
.deploy_right {
	float: left;
	padding-left: 30px;
	margin-left: calc(100vw / 2);
	margin-top: -735px;
	// margin-top: -450px;
	// margin-top: calc(20% - 1040px);
	.btn-enable {
		color: #333;
		font-weight: bold;
		.enable_title {
			margin-right: 10px;
		}
	}
	.btn-enable1 {
		margin-top: 10px;
		font-weight: normal;
	}
	.btn-enable2 {
		margin-top: 5px;
		margin-left: -10px;
		font-weight: normal;
	}
	.PTZ {
		margin-top: 10px;
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
	.deploy_right_top_title {
		margin-top: 10px;
		color: #333;
		font-weight: bold;
	}
	.check1 {
		margin: 0 15px;
	}
	.check2 {
		margin: 10px;
	}
	.checkBox {
		display: inline-block;
		margin: 10px;
		height: 100px;
	}
	.checkBoxMain{
		padding-top: 20px;
	}
	// .deploy_select {
	// 	display: block;
	// 	width: calc(50% - 15px);
	// 	margin: 10px 0;
	// }
	/deep/ .el-input--small .el-input__inner {
		height: 28px;
		line-height: 28px;
	}
	.save {
		width: 78px;
		height: 30px;
		bottom: 0;
		background: #2178C8;
		border-radius: 2px;
		color: #fff;
		border: none;
		font-size: 12px;
		cursor: pointer;
	}
}
</style>