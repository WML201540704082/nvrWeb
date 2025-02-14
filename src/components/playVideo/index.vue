<template>
    <el-dialog
        :title="title"
        :close-on-click-modal="false"
        :visible.sync="visible"
        width="760px"
		class="play-video"
		@close="closeDialog"
        append-to-body>
        <div v-if="type != 'tag' && type != 'lock' && type != 'timelyPlayback'" class="selectCon">
            <el-select v-model="linkId" @change="linkIdChange" placeholder="请选择" size="mini">
                <el-option
                v-for="item in linkList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                </el-option>
            </el-select>
        </div>
        <div class="video">
            <video
              ref="video"
              style="position:absolute;margin-left: 320px;width: 700px;height: 400px;"
          ></video>
        </div>
        <div style="display: flex;justify-content: center;margin-top: 20px;">
			<el-button type="primary" @click="refreshPlay">重新观看</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { getSessionId } from '@/api';
import moment from "moment";
import { HOST} from "@/utils/constant";
import FGPlayer from "@/assets/libs/fgplayer/fgplayer.min.js";
export default {
	name: 'play-video',
	data () {
		return {
			visible: false,
      title: null,
			isLoading: false,
            type: '',
            linkId: '',
            linkList: [],
		}
	},
	methods: {
        /**
         * 初始化
         * @param {Object} row 
         * @param {String} type 'lock'--锁定  'tag'--标签 'timelyPlayback'--即时回放
         */
		async init (row,type) {
            this.visible = true
            this.type = type
            this.title = type === 'lock' ? '锁定文件视频' : type === 'tag' ? '标签回放视频' : type === 'timelyPlayback' ? '即时回放视频' : '事件视频'
            let isIncludeOwn = (type != 'lock' && type != 'tag' && type != 'timelyPlayback') ? row.linkageVideos.some(item => item.chID == row.channelID) : true
            if(row.type == '报警输入') {
                isIncludeOwn = false
                this.channelID = row.linkageVideos[0].chID
            } else {
                this.channelID = isIncludeOwn ? row.channelID : row.linkageVideos[0].chID
            }
			this.videoStartTime = row.videoStartTime
			this.videoEndTime = row.videoEndTime
            this.fileType = row.fileType
            this.linkList = []
            // 事件播报的type为undefined
            if(!type) {
                row.linkageVideos.map(item => {
                    this.linkStart = item ? moment(item.start).add(8, "hours").format('YYYY-MM-DD HH:mm:ss') : null,
                    this.linkEnd = item ? moment(item.end).add(8, "hours").format('YYYY-MM-DD HH:mm:ss') : null
                    if(item.chID == this.channelID && isIncludeOwn) {
                        this.linkList.unshift({id: item.chID, name: `${item.chID} (本通道)`, start: this.linkStart, end: this.linkEnd})
                    } else {
                        this.linkList.push({id: item.chID, name: `${item.chID} (联动通道)`, start: this.linkStart, end: this.linkEnd})
                    }
                })
                this.linkId = this.linkList[0].id
            }
			this.getSessionId(this.channelID,row.videoStartTime,row.videoEndTime,row.fileType)
			// this.getSessionId('4','2022-10-31 06:05:45','2022-10-31 06:05:55')
		},
        linkIdChange() {
            if (this.player) {
                this.player.video.currentTime = 0;
                this.player.video.load();
                this.player.destroy();
                this.player = null
            }
            this.linkList.forEach(item => {
                if(item.id == this.linkId) {
                    let startTime = item.start
                    let endTime = item.end
                    this.getSessionId(this.linkId, startTime, endTime)
                    return
                }
            })
        },
		refreshPlay() {
			if (this.player) {
        this.player.video.currentTime = 0;
        this.player.video.load();
        this.player.destroy();
				this.player = null
			}
			this.getSessionId(this.channelID,this.videoStartTime,this.videoEndTime,this.fileType)
			// this.getSessionId('4','2022-10-31 06:05:45','2022-10-31 06:05:55')
		},
		closeDialog() {
			if (this.player) {
        this.player.video.currentTime = 0;
        this.player.video.load();
        this.player.destroy();
				this.player = null
			}
		},
        /**
         * 检索
         * @param {Number} id 通道id
         * @param {String} startTime 
         * @param {String} endTime 
         * @param {Number} fileType 文件类型 0--定时  1--报警 2-手动 3-锁定 4-标签回放
         */
        getSessionId(id,startTime,endTime,fileType) {
            console.log('fileType:',fileType)
            let params = {
                id: id.toString(),
                videoParam: {
                    enable: true,
                    width: 960,
                    frameRate: 15,
                    height: 540,
                    streamId: "record",
                    startTime: moment(startTime).format("YYYY-MM-DD HH:mm:ss"),
                    endTime: moment(endTime).format("YYYY-MM-DD HH:mm:ss"),
                    type: (fileType || fileType === 0) ? fileType : 1 // type 0--定时  1--报警    智能分析的事件播报界面fileType传过来是undefined,需处理成 报警--1
                },
                detectParam: {
                    enable: true,
                }
            }
            getSessionId(params).then(res => {
                this.sessionId = res.data.data
                this.$nextTick(() => {
					this.importPlayer(params.id,this.sessionId)
                })
            })
        },
        importPlayer(channelId,sessionId) {
            this.playUrl(channelId,sessionId)
        },
		// 播放视频
        playUrl(channelId,sessionId) {
            this.isLoading = true;
            this.player = new FGPlayer({ 
                video: this.$refs.video,
                onConnect: () => {
                    this.isLoading = false;
                },
            })
            const token = JSON.parse(localStorage.getItem('user')).token
            this.player.play(
                `ws://${HOST}/api/nvr/record/channel/${channelId}/${sessionId}?Authorization=${token}`,
            );
            this.$forceUpdate()
        },
	}
}
</script>
<style lang="less" scoped>
.play-video {
	.video {
        width: 400px;
        height: 400px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
}
.selectCon {
    margin-left: 10px;
    margin-bottom: 10px;
}
</style>

