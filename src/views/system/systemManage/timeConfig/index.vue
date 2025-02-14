 <template>
    <div>
      <!-- 时间信息 -->
      <div style="overflow-y:auto;overflow-x:hidden">
        <el-col>
            <span style="font-size:14px; color: #626262;">时间设置</span>
        </el-col>
        <el-col style="margin:25px 0 0 14px" class="rowStart">
            <span class="cmFont" style="color:#909399">服务器时间</span>
            <span class="cmFont" style="margin-left:11px;">{{infoForm.deviceTime}}</span>
        </el-col>
        <el-col style="margin:20px 0 0 14px" class="rowStart sysSetting">
            <span
                class="cmFont"
                style="color:#909399;height:30px;line-height:30px"
            >同步方式</span>
            <el-select style="margin:0 20px 0 20px" size="small" v-model="infoForm.ntpStatus" @change="changeMode">
                <el-option label="NTP同步" value="ntp"></el-option>
                <el-option label="手动校时" value="local"></el-option>
            </el-select>
            <div v-if="infoForm.ntpStatus === 'local'">
                <el-date-picker
                    size="small"
                    v-model="infoForm.manualTime"
                    type="datetime"
                    :disabled="isAsyncComputer"
                    placeholder="选择日期时间">
                </el-date-picker>
                <el-switch v-if="isLocal != 'true'"
                    style="margin: 0 4px 0 10px;"
                    size="mini"
                    v-model="isAsyncComputer">
                </el-switch>
                <span style="color: #666; font-size: 14px;" v-if="isLocal != 'true'">与计算机时间同步</span>
            </div>
            <el-input
                v-model="infoForm.ntpServer"
                size="small"
                v-if="infoForm.ntpStatus === 'ntp'"
                placeholder="请输入目标服务器地址"
                style="width:160px;"
            />
        </el-col>
        <el-col style="margin:25px 0 0 14px" class="rowStart">
            <span class="cmFont" style="color:#909399">IPC校时</span>
            <el-checkbox style="margin:0 20px 0 25px" v-model="ipcCompare"></el-checkbox>
        </el-col>
        <el-col>
            <el-button size="small" style="margin:20px 0 0 82px" @click="subNtp">同步</el-button>
        </el-col>
      </div>
    </div>
</template>

<script>
import moment from "moment";
import { datetimeApi, getIpc, putIpc } from "@/api";
  
export default {
    data() {
        return {
            infoForm: {
                deviceTime: '',
                ntpStatus: 'local',
                manualTime: '',
            },
            dateTimeNow: moment(new Date()).format("YYYY/MM/DD HH:mm:ss"),
            timer: null,
            initTimer: null,
            ipcCompare: false,
            isAsyncComputer: false,
        }
    },
    created() {
        this.isLocal = window.localStorage.getItem('isLocal')
        this.getIpc()
        this.init()
        this.initTimer = setInterval(() => {
            datetimeApi.Get().then(res => {
                this.infoForm.deviceTime = res.data.data.deviceTime
            })
        }, 1000)
    },
    methods: {
        async init() {
            const res = await datetimeApi.Get()
            this.infoForm = res.data.data
            this.infoForm.manualTime = res.data.data.deviceTime
        },
        // 设置本地同步后，ntp地址会丢失
        changeMode(e) {
            if(e === 'ntp') {
                if (!this.infoForm.ntpServer) {
                    this.infoForm.ntpServer = "cn.pool.ntp.org"
                }
            }
        },
        // 时间信息
        subNtp() {
            this.putIpc()
        },
        getIpc() {
            getIpc().then(res => {
                this.ipcCompare = res.data.data.updateTime === 1 ? true : false
            })
        },
        putIpc() {
            if (this.infoForm.ntpStatus === "ntp") {
                putIpc({
                    content: {ntpStatus: "ntp",ntpServer: this.infoForm.ntpServer},
                    timeCfg: {timeZone: 'CST-8:00:00', daylightSavings: false, updateTime: this.ipcCompare ? 1 : 0}
                }).then(_ => {
                    this.$message.success('提交成功')
                });
            } else if (this.infoForm.ntpStatus === "local") {
                let time1 = moment(this.infoForm.manualTime).subtract(8, "hours").format("YYYY-MM-DD HH:mm:ss");
                let time2 = new Date()
                time2 = moment(time2).subtract(8, "hours").format("YYYY-MM-DD HH:mm:ss");
                let time = this.isAsyncComputer ? time2 : time1
                putIpc({
                    content: {ntpStatus: "local",deviceTime: time},
                    timeCfg: {timeZone: 'CST-8:00:00', daylightSavings: false, updateTime: this.ipcCompare ? 1 : 0}
                }).then(_ => {
                    this.$message.success('提交成功')
                });
            }
        },
    },
    computed: {
        systemTime() {
            if (this.$store.getters.getDatetime) {
                return moment(this.$store.getters.getDatetime).format("YYYY/MM/DD HH:mm:ss");
            }
        },
    },
    watch: {
        infoForm: {
            handler(val) {
                if(val.ntpStatus === 'local') {
                    this.dateTimeNow = moment(new Date()).format("YYYY/MM/DD HH:mm:ss")
                    this.timer = setInterval(() => {
                        this.dateTimeNow = moment(new Date()).format("YYYY/MM/DD HH:mm:ss")
                    }, 1000)
                }
            },
            deep: true
        }
    },
    beforeDestroy(){
        clearInterval(this.timer);   // 清除定时器
        this.timer = null;

        clearInterval(this.initTimer);   // 清除定时器
        this.initTimer = null;
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
</style>
  