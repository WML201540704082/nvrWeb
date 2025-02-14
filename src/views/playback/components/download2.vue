<template>
    <div class="rowStart" style="width:100%; height: calc(100% - 40px);margin-top: 40px;margin-left: 20px;" v-show="form.downloadVis">
        <div style="width: 350px; float: left; margin-left: -35px;margin-top: -14px;">
            <el-form size="mini" ref="ruleForm"  :model="form2"  label-width="110px">
                <el-form-item label="通道">
                    <el-select v-model="form2.channel" style="width: 180px">
                        <el-option v-for="item in channelList" :label="item.chName" :key="item.channel" :value="item.channel"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="日期">
                    <el-date-picker
                        v-model="form2.data2"
                        size="small"
                        type="date"
                        value-format="yyyy-MM-dd"
                        style="width: 180px;"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="开始时间">
                    <el-time-picker
                        :editable="false"
                        v-model="form2.start"
                        size="small"
                        value-format="HH:mm:ss"
                        style="width: 180px;"
                        placeholder="开始时间">
                    </el-time-picker>
                    </el-form-item>
                <el-form-item label="结束时间">
                    <el-time-picker
                        :editable="false"
                        v-model="form2.end"
                        size="small"
                        value-format="HH:mm:ss"
                        style="width: 180px;"
                        placeholder="结束时间">
                    </el-time-picker>
                </el-form-item>
                <el-form-item label="文件类型">
                    <el-select v-model="form2.type" style="width: 180px" multiple>
                        <el-option label="定时" :value=0></el-option>
                        <el-option label="报警" :value=1></el-option>
                        <el-option label="手动" :value=2></el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="文件切分">
                    <el-select v-model="form2.partitionType" style="width: 180px">
                        <el-option label="按时间切分" value="0"></el-option>
                        <el-option label="按大小切分" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分割时长" v-if="form2.partitionType == '0'" >
                    <el-input placeholder="分割时长" style="width: 120px;" type="number" :min="1" :max="120" onkeyup="this.value = this.value.replace(/[^A-z0-9]/, '')" v-model="form2.duration" ></el-input>
                    <span style="margin-left: 20px"> 分钟</span>
                </el-form-item>
                <el-form-item label="分割大小" v-if="form2.partitionType == '1'" >
                    <el-input placeholder="分割大小" style="width: 120px;" type="number" :min="32" :max="4096" onkeyup="this.value = this.value.replace(/[^A-z0-9]/, '')" v-model="form2.blockSize" ></el-input>
                    <span style="margin-left: 20px">MB</span>
                </el-form-item> -->
                <el-form-item label="">
                    <!-- <el-button type="primary" @click="onLoad1">{{downloadFlag ? '停止下载' : '下载'}}</el-button> -->
                    <el-button type="primary" @click="onLoad1" style="width: 120px;margin-left:-10px;margin-top: 10px;" :disabled="loading1||downloading">查询</el-button>
                </el-form-item>
            </el-form> 
        </div>
        <div id="file-list" style="width: calc(100% - 300px); height: 100%; float: left;font-size: 12px; font-weight: 400; margin-left: -40px; margin-top: -14px;">
                <el-form size="mini" :model="form3" label-position="right"  label-width="120px">
                    <el-form-item label="状态筛选" label-width="70px">
                        <el-select v-model="form3.status" style="width: 150px" @change="statusChange">
                            <el-option v-for="item in statusArr" :label="item.name" :key="item.value" :value="item.value"></el-option>
                        </el-select>
                        <div style="float: right">
                            <el-button v-if="!isLocal" @click="onStartDownload" :disabled="downloading||loading1">下载</el-button>
                            <el-button v-else @click="onStartExport" :disabled="downloading||loading1">导出</el-button>
                            <el-button type="primary" @click="onStopDownload" :disabled="!downloading">停止</el-button>
                        </div>
                    </el-form-item>
                </el-form>
                <el-table
                    ref="multipleTable"
                    v-loading="loading1"
                    element-loading-text="正在加载中"
                    :data="tableData2"
                    tooltip-effect="dark"
                    style="width: 100%;max-height: calc(100% - 53px);height:calc(100% - 69px);overflow-y: none;"
                    :row-key="get_row_key"
                    @select-all="selectAll"
                    @selection-change="downloadSelectionChange">
                    <el-table-column
                    type="selection"
                    :reserve-selection="true"
                    width="45">
                    </el-table-column>
                    <el-table-column
                    width="60"
                    label="序号">
                    <template slot-scope="scope">
                        {{scope.$index+1}}
                    </template>
                    </el-table-column>
                    <el-table-column
                    prop="fileName"
                    label="文件名称">
                    </el-table-column>
                    <el-table-column 
                    width="120"
                    prop="status"
                    label="文件状态">
                    <template slot-scope="scope">
                        <template v-if="scope.row.status">
                            <template v-if="scope.row.status == '2'">
                                <el-progress :text-inside="true" :stroke-width="24" :percentage="scope.row.progress" status="success"></el-progress>
                                <!-- <el-progress :percentage="scope.row.progress" status="success"></el-progress> -->
                            </template>
                            <template v-else>
                                <template v-if="scope.row.status == '3' && scope.row.progress>10">
                                    <el-progress :text-inside="true" :stroke-width="24" :percentage="scope.row.progress" :color="'#909399'"></el-progress>
                                    <!-- <el-progress :percentage="scope.row.progress" status="success"></el-progress> -->
                                </template>
                                <template v-else>
                                    {{statusObj[scope.row.status]}}
                                </template>
                            </template>
                        </template> 
                    </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                @current-change="downDataChange"
                style="float:right;"
                :current-page.sync="currentPage1"
                :page-size="pageSize"
                layout="total, prev, pager, next"
                :total="totalNum">
            </el-pagination>
        </div>
        <exportDlg ref="exportDlg" @closed="onExportClose"></exportDlg>
    </div>
</template>

<script>
import moment from "moment";
import { deleteFile, getFileInfo, postFilelist, getRecordChannelList, explorerMng } from '@/api';
import { getPackParam } from '@/api/systemAPI';
import { HOST} from "@/utils/constant";
import exportDlg from './export.vue';
import elementResizeDetectorMaker from 'element-resize-detector'

export default {
    components: {
        exportDlg
    },
    name: "Download2",
    data() {
      return {
        isLocal: false,
        form: {
        },
        pageSize: 7,
        retryNum: 10,
        channelList: [],
        form2: {
            channel: '',
            data: [],
            data2: '',
            start:'00:00:00',
            end: '23:59:59',
            partitionType: '0',
            duration: '60',
            blockSize: '32',
            type: [0]
        },
        tableData2: [],
        currentPage1: 1,
        totalNum: 0,
        tableData2ALL:[],
        downloadFlag: false,
        multipleSelection: [],
        sessionID: '',
        form3: {
            status: ''
        },
        statusArr: [
            {name: '全部', value: ''},
            {name: '未下载', value: '0'},
            {name: '等待中', value: '1'},
            {name: '下载中', value: '2'},
            {name: '停止下载', value: '3'},
            {name: '下载失败', value: '4'},
            {name: '下载完成', value: '5'},
        ],
        statusObj: {
            "0":'未下载',
            "1":'等待中',
            "2":'下载中',
            "3":'停止下载',
            "4":'下载失败',
            "5":'下载完成',
        },
        loading1: false,
        downloading: false,
        downType: 1,//1-远程下载，2-本地备份
        downAbort: null,
        abortHandler: null,
        exportws: {
            token: "",
            uid: "",
            timestamp: 0,
            path: "",
            socket: null,
            connected: false
        }
      };
    },
    props: {
      info: {
        type: Object,
        default: () => {
          return {};
        }
      },
      layerid: {
        type: String,
        default: ""
      },
      lydata: {
        type: Object,
        default: () => {
          return {};
        }
      },
      lyoption: {
        type: Object,
        default: () => {
          return {};
        }
      }
    },
    created() {
        getRecordChannelList().then((res) => {
            if (res.data.code === 200000) {
                this.channelList = res.data.data.map(item=>{
                    let name = !item.chanNameList ? '' : (item.chanNameList.length>0 ? item.chanNameList[0].channelName : '')
                    return {
                        ...item,
                        chName: '[' + item.channelType + "" + item.channel + ']' + name
                    }
                }) || []
                if (this.channelList && this.channelList.length > 0) {
                    this.form2.channel = this.channelList[0].channel
                }
            }
        });
        this.form2.data2 = moment().format("yyyy-MM-DD")
        this.isLocal = JSON.parse(localStorage.getItem('isLocal'))
        let downAbortFun = null
        this.abortHandler = (res) => {
                const reader = res.body.getReader();
                const stream = new ReadableStream({
                    start(controller) {
                        let aborted = false;
                        const push = () => {
                            reader.read().then(({ value, done }) => {
                                if (done) {
                                    if (!aborted) controller.close();
                                    return;
                                }
                                controller.enqueue(value);
                                push();
                            });
                        };
                        downAbortFun = () => {
                            reader.cancel();
                            //controller.error(new Error('Fetch aborted'));
                            aborted = true;
                        };
                        push();
                    }
                });
                return new Response(stream, { headers: res.headers });
        }
        this.downAbort = function() {
            if (downAbortFun) {
                downAbortFun()
            }
        }
        this.exportws.uid = this.guid2()
        this.initExportNotify()
        // 获取打包模式
        this.queryPackParam()
    },
    mounted() {
        this.form = this.info
        this.getContainerkWidth()
    },
    beforeDestroy() {
        this.clean()
    },
    methods: {
        queryPackParam() {
            getPackParam().then((res) => {
                if (res.data.code === 200000) {
                    this.form2.partitionType = res.data.data && res.data.data.packageMode === 1 ? '0' : '1'
                    this.form2.duration = res.data.data ? res.data.data.time : 60
                    this.form2.blockSize = res.data.data ? res.data.data.size : 1024
                }
            });
        },
        getContainerkWidth () {
            const erd = elementResizeDetectorMaker()
            this.$nextTick(() => {
                erd.listenTo(document.getElementById("file-list"), element => {
                    if (element.offsetHeight > 0) {
                        this.pageSize = Math.floor((element.offsetHeight - 117) / 48)
                        this.tableData2 = this.tableData2ALL.slice(this.pageSize*(this.currentPage1-1),this.pageSize*(this.currentPage1))
                    }
                })
            })
        },
        onSubmit() {
            this.$layer.msg("提交成功", () => {
            this.lydata.info.name = this.form.name;
            this.$layer.close(this.layerid);
            });
        },
        cancel() {
            this.$layer.close(this.layerid);
        },
        clean() {
            if(this.form2.channel && this.sessionID) {
                this.downAbort()
                deleteFile(Number(this.form2.channel),this.sessionID).then(res=>{
                    if(res.data.code == 200000){
                    }
                })
            }
            this.exportws.socket.close()
        },
        // 查询文件列表
        getFileList(reqNum,obj) {
            postFilelist(obj).then((res) => {
                this.loading1 = false
                if (res.data.code === 200000) {
                    let arr = res.data.data.recfileList || []
                    arr.forEach(item=> {
                        this.tableData2ALL.push({
                            status: '0',
                            progress: 0,
                            fileSize: 0,
                            fileDownSize:0,
                            fileBuffer: '',
                            ...item
                        })
                    })
                    this.totalNum = arr.length
                    this.tableData2 = this.tableData2ALL.slice(this.pageSize*(this.currentPage1-1),this.pageSize*(this.currentPage1))
                    this.sessionID = res.data.data.sessionID
                    this.form3.status && this.statusChange(this.form3.status)
                }
            }).catch(err=> {
                if (reqNum >= this.retryNum) {
                    this.loading1 = false
                    this.$message({
                        showClose: true,
                        message: '获取下载列表失败！',
                        type: "error"
                    })
                } else {
                    this.getFileList(reqNum+1, obj)
                }
            });
        },
        queryDownList(){
            if (this.form2.channel == "") {
                this.$message({message: '请选择通道', showClose: true, type: 'warning'})
                return
            }
            if (this.form2.partitionType == "0") { 
                console.log('---',this.form2.partitionType == "0",this.form2.duration == "");
                if ( this.form2.duration == 0 ) {
                    this.$message({message: '分隔时长不能为0,请前往设置', showClose: true, type: 'warning'})
                    return
                } else {
                    let duration = parseInt(Number(this.form2.duration))
                    if (duration < 1 || duration > 120) {
                        this.$message({message: '分隔时长下载范围1~120分钟,请前往设置', showClose: true, type: 'warning'})
                        return
                    }
                }
            }
            if (this.form2.partitionType == "1") {
                if (this.form2.blockSize == 0) {
                    this.$message({message: '分隔大小不能为0,请前往设置', showClose: true, type: 'warning'})
                    return
                } else {
                    let blockSize = parseInt(Number(this.form2.blockSize))
                    if (blockSize < 32 || blockSize > 4096) {
                        this.$message({message: '分隔大小下载范围32~4096MiB,请前往设置', showClose: true, type: 'warning'})
                        return
                    }
                }
            }

            let obj = {
                channelId: this.form2.channel+"",
                // timeList: {start: "2022-05-01 00:00:00",end: "2022-10-15 23:59:59"},
                timeList: {start: this.form2.data2 +" "+ this.form2.start,end: this.form2.data2 +" "+this.form2.end},
                partitionType: Number(this.form2.partitionType),
                duration: Number(this.form2.duration) * 60,
                blockSize: Number(this.form2.blockSize) * 1024 * 1024,
                type: this.form2.type
            }
            this.loading1 = true
            this.totalNum = 0
            this.currentPage1 = 1
            this.tableData2 = []
            this.tableData2ALL = []
            this.$refs.multipleTable.clearSelection()
            this.multipleSelection = []
            this.getFileList(1, obj)
        },
        // 表格分页，支持跨页选中和全选
        get_row_key(row) {
            // 保证是唯一标识符即可
            return row.fileID
        },
        selectAll (selection) {
            //获取当前页码所显示的数据
            let a = this.tableData2
            let b = selection
            let isLeftTableAllSelectStatus = b.every(val => a.includes(val));
            if (isLeftTableAllSelectStatus == true) {  //从非全选状态切换成了全选状态
                this.againDrawTableTick(true)
            } else {  //从全选状态切换成了非全选状态
                this.againDrawTableTick(false)
            }
        },
        againDrawTableTick: function (flag) {
            //重新渲染勾选
            if (!this.multipleSelection.length || !this.multipleSelection.length > 0) return
            if (flag == true) {
                this.$nextTick(() => {
                this.tableData2ALL
                    .forEach(item => {
                    this.$refs.multipleTable.toggleRowSelection(item, true)
                    })
                })
            } else {
                this.$nextTick(() => {
                this.tableData2ALL
                    .forEach(item => {
                    this.$refs.multipleTable.clearSelection()
                    })
                })
            }
        },
        downDataChange(val){
            this.currentPage1 = val
            this.tableData2 = this.tableData2ALL.filter(item=>{return this.form3.status ? item.status==this.form3.status:item}).slice(this.pageSize*(this.currentPage1-1),this.pageSize*(this.currentPage1))
        },
        // 状态change
        statusChange(val) {
            this.tableData2 = this.tableData2ALL.filter(item=>{return val ? item.status==val:item}).slice(this.pageSize*(this.currentPage1-1),this.pageSize*(this.currentPage1))
            this.totalNum = this.tableData2ALL.filter(item=>{return  val ? item.status==val:item}).length
            this.currentPage1 = 1
        },
        //准备下载
        onLoad1(){
            // 上一个 关闭视频文件下载检索
            if(this.form2.channel && this.sessionID) {
                deleteFile(Number(this.form2.channel),this.sessionID).then(res=>{
                    if(res.data.code == 200000){
                    }
                })
            }
            this.queryDownList()
        },
        // 多选
        downloadSelectionChange(val){
            this.multipleSelection = val;
        },
        // 开始下载
        onStartDownload() {
            if (!this.multipleSelection.length || !this.multipleSelection.length > 0) {
                this.$message({showClose: true, message: '请先选择文件',type: 'warning'})
                return
            }
            this.downloading = true
            this.downType = 1
            this.multipleSelection.forEach(item=>{
                let index = this.tableData2ALL.findIndex(subItem=> {return subItem.fileID == item.fileID})
                if (index >= 0) {
                    this.tableData2ALL[index].status = '1'
                    this.tableData2ALL[index].fileDownSize = 0
                    this.tableData2ALL[index].progress = 0
                }
            })
            this.downloadNextFile()
            this.$message({showClose: true,message: '开启成功',type: 'success'})
        },
        // 下载下一个文件
        downloadNextFile(){
            let nextIndex = this.tableData2ALL.findIndex(item=> {return item.status == '1'})
            if (nextIndex < 0) {
                this.$message({showClose: true, message: this.downType == 1 ? '全部下载完成' : '全部备份完成', type: 'success'})
                this.downloading = false
                this.setTitle('')
                return
            }
            this.setTitle('等待中')
            if(this.tableData2ALL[nextIndex].filePath){
                this.startDownloadFile(nextIndex)
            } else {
                this.getFileInfoAndDownload(1, nextIndex)
            }
        },
        // 获取文件信息并下载
        getFileInfoAndDownload(reqNum, index) {
            let obj = {
                id: this.form2.channel + '',
                sessionID: this.sessionID,
                fileID: this.tableData2ALL[index].fileID,
                fileName: this.tableData2ALL[index].fileName
            }
            getFileInfo(obj).then(res=>{
                if(res.data.code == 200000) {
                    if (this.tableData2ALL[index].status == '3') {
                        console.log("已取消下载")
                    } else {
                        this.tableData2ALL[index].filePath = res.data.data.filePath
                        this.tableData2ALL[index].fileSize = res.data.data.fileSize
                        this.startDownloadFile(index)
                    }
                }
            }).catch(err => {
                console.log("getFileInfo error")
                if (this.tableData2ALL[index].status == '3') {
                    console.log("已取消下载")
                } else {
                    if (reqNum >= this.retryNum) {
                        this.tableData2ALL[index].status = '4'
                        this.downloadNextFile()
                    } else {
                        this.getFileInfoAndDownload(reqNum+1, index)
                    }
                }
            })
        },
        setTitle(progress) {
            if (progress == "") {
                //document.querySelector('#' + this.layerid + ' .lv-title').innerHTML = '录像下载'
                document.getElementsByClassName('lv-title')[0].innerHTML = '录像下载'
            } else if (document.getElementsByClassName('lv-icon-mini').length == 0 && document.getElementsByClassName('vl-notify-content')[0].clientHeight == 0) {
                document.getElementsByClassName('lv-title')[0].innerHTML = '录像下载<span style="margin-left: 85px; color: green;">' + progress + '</span>'
            } else {
                document.getElementsByClassName('lv-title')[0].innerHTML = '录像下载'
            }
        },
        // 创建文件流下载
        startDownloadFile(index){
            if(!this.tableData2ALL[index].filePath) {
                this.tableData2ALL[index].status = '4'
                return
            }
            let filePath = this.tableData2ALL[index].filePath
            let arr= filePath.split('/')
            this.tableData2ALL[index].name = arr[arr.length - 1]
            this.tableData2ALL[index].status = '2'

            //接口返回路径为 //video/xxx ,需去掉一个 /
            if (filePath.substring(0, 2) === '//') {
                filePath = filePath.substring(1);
            }

            if (this.downType == 1) {
                // 远程下载
                const logProgress = (res) => {
                    const [progressStream, returnStream] = res.body.tee();
                    const reader = progressStream.getReader();
                    const log = () => {
                        reader.read().then(({ value, done }) => {
                            if (done) {
                                if(this.tableData2ALL[index]){
                                    this.tableData2ALL[index].status = '5';
                                    let rowIndex = this.tableData2.findIndex(select => select.fileID === this.tableData2ALL[index].fileID);
                                    if (rowIndex > -1) {
                                        this.$refs.multipleTable.toggleRowSelection(this.tableData2[rowIndex])
                                    }
                                    this.downloadNextFile()
                                    return;
                                }
                            } 
                            this.tableData2ALL[index].fileDownSize += value.length
                            if(this.tableData2ALL[index].status == '2'){
                                this.tableData2ALL[index].progress = (Number((this.tableData2ALL[index].fileDownSize) / (this.tableData2ALL[index].fileSize) * 100)) <= 100 ? Number((Number((this.tableData2ALL[index].fileDownSize) / (this.tableData2ALL[index].fileSize) * 100)).toFixed(0)) : 100
                                this.setTitle(this.tableData2ALL[index].progress + "%")
                            }
                            log();
                        });
                    };
                    log();
                    return new Response(returnStream, { headers: res.headers });
                };
                fetch(filePath,{
                    method:'GET',
                    cache: 'no-cache'
                })
                .then(this.abortHandler)
                .then(logProgress)
                .then(res => res.blob())
                .then((blob) => {
                    let u = window.URL.createObjectURL(new Blob([blob], {
                        type: 'video/mp4'
                    }))
                    let a = document.createElement('a');
                    a.download = this.tableData2ALL[index].name;
                    a.href = u;
                    a.style.display = 'none'
                    document.body.appendChild(a)
                    a.click();
                    a.remove();
                })
                .catch(err => {
                    this.tableData2ALL[index].status = '4'
                    this.downloadNextFile()
                });
            } else if (this.downType == 2) {
                // 本地备份
                let obj = {"uid": this.exportws.uid, "fid": this.tableData2ALL[index].fileID, "fname": this.tableData2ALL[index].name,"srcFile": filePath, "dstFile": this.exportws.path + "/" + this.tableData2ALL[index].name}
                explorerMng("7", obj).then((res) => {
                    if (res.data.code != 200000) {
                        console.log("请求导出失败",err)
                        this.tableData2ALL[index].status = '4'
                        this.downloadNextFile()
                    }
                }).catch(err=> {
                    console.log("请求导出失败",err)
                    this.tableData2ALL[index].status = '4'
                    this.downloadNextFile()
                });
            }
        },
        //停止下载
        onStopDownload() {
            this.downloading = false
            if (this.downType == 1) {
                this.downAbort()
            } else if (this.downType == 2) {
                explorerMng("8", {"uid": this.exportws.uid})
            }
            this.tableData2ALL.forEach(item=>{
                if(item.status != '0' && item.status != '4' && item.status != '5'){
                    item.status = '3'
                }
            })
            this.$message({showClose: true,message: '停止成功',type: 'success'})
        },
        guid2() {
            function S4() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }
            return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
        },
        //备份
        initExportNotify() {
            this.exportws.token = JSON.parse(localStorage.getItem('user')).token
            this.exportws.timestamp = new Date().getTime()
			// 实例化socket
			this.exportws.socket = new WebSocket(`ws://${HOST}/api/nvr/record/export/notify?Authorization=${this.exportws.token}&uid=${this.exportws.uid}&ts=${this.exportws.timestamp}`);
			// 监听socket连接
			this.exportws.socket.onopen = this.wsOpened;
			// 监听socket消息
			this.exportws.socket.onmessage = this.wsMessage;
			// 监听socket错误信息
			this.exportws.socket.onerror = this.wsError;
			// 监听socket关闭
			this.exportws.socket.onclose = this.wsClosed;
		},
		wsOpened() {
            this.exportws.connected = true
			console.log("export socket已连接")
		},
		wsMessage(msg) {
			if (msg.code === 401000) {
				if (this.errTimeOut) {
					clearTimeout(this.errTimeOut);
				}
			} else {
                let msgData = JSON.parse(msg.data)
                let index = this.tableData2ALL.findIndex(item=> {return item.fileID == msgData.data.fileID})
                if (msgData.data.uid != this.exportws.uid) {
                    return
                }
                if (msgData.code === 200000) {
                    this.tableData2ALL[index].progress = msgData.data["progress"]
                    if (msgData.data["progress"] >= 100) {
                        this.tableData2ALL[index].status = '5';
                        let rowIndex = this.tableData2.findIndex(select => select.fileID === this.tableData2ALL[index].fileID);
                        if (rowIndex > -1) {
                            this.$refs.multipleTable.toggleRowSelection(this.tableData2[rowIndex])
                        }
                        this.downloadNextFile()
                    }
                } else {
                    this.tableData2ALL[index].status = '4'
                    this.downloadNextFile()
                }
			}
		},
		wsError(err) {
			// 连接失败
			var errTimeOut = setTimeout(() => {
				// 错误断开3s后重连
				this.initExportNotify();
			}, 3000);
			this.errTimeOut = errTimeOut;
			console.log("export socket连接错误");
		},
		wsClosed() {
			// 关闭
			console.log("export socket已经关闭");
		},
        onStartExport() {
            if (!this.multipleSelection.length || !this.multipleSelection.length > 0) {
                this.$message({showClose: true, message: '请先选择文件',type: 'warning'})
                return
            }
            this.exportVis = true
            this.$refs['exportDlg'].init(this.exportVis)
        },
        onExportClose(result) {
            if (!result.ok) {
                return
            }
            this.exportws.path = result.path
            this.downloading = true
            this.downType = 2
            this.multipleSelection.forEach(item=>{
                let index = this.tableData2ALL.findIndex(subItem=> {return subItem.fileID == item.fileID})
                if (index >= 0) {
                    this.tableData2ALL[index].status = '1'
                    this.tableData2ALL[index].fileDownSize = 0
                    this.tableData2ALL[index].progress = 0
                }
            })
            this.downloadNextFile()
            this.$message({showClose: true,message: '开启成功',type: 'success'})
        }
    }
  };
</script>