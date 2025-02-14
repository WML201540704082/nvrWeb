<template>
    <div class="basic">
        <div style="margin-bottom:10px">
            <!-- <el-radio-group v-model="filter" @change="handleFilterChange">
                <el-radio label="all" @click.native="handleFilterChange('all')" class="filter-radio">全部</el-radio>
                <el-radio label="behavior" @click.native="handleFilterChange('behavior')" class="filter-radio">行为</el-radio>
                <el-radio label="environment" @click.native="handleFilterChange('environment')" class="filter-radio">环境</el-radio>
                <el-radio label="allTargets" @click.native="handleFilterChange('allTargets')" class="filter-radio">全目标</el-radio>
                <el-radio label="perimeter" @click.native="handleFilterChange('perimeter')" class="filter-radio">周界</el-radio>
                <el-radio label="finance" @click.native="handleFilterChange('finance')" class="filter-radio">金融</el-radio>
            </el-radio-group>
            <el-button @click="clearFilter">清除所有过滤器</el-button> -->
            <el-button @click="algoSwitch">批量开关算法</el-button>
        </div>
        <el-table
            :data="tableData"
            :header-cell-style="tableHeaderColor"
            :cell-style="getCellStyle"
            size="medium"
            stripe
            :border="true"
            :height="tableHeight"
            v-horizontal-scroll="'always'"
            @cell-click="tableClick"
            :style="{cursor: switchFlag ? 'pointer' : ''}">
            <el-table-column
                prop="index"
                min-width="120"
                label=""
                align="center">
                <template slot-scope="scope">
                    <span>通道{{scope.row.channel + (scope.row.status === 0 ? '(不在线)' : '')}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="人脸"
                min-width="120"
                align="center">
            </el-table-column>
            <el-table-column
                label="行人"
                min-width="120"
                align="center">
            </el-table-column>
            <el-table-column
                label="机动车"
                min-width="120"
                align="center">
            </el-table-column>
            <el-table-column
                label="非机动车"
                min-width="120"
                align="center">
            </el-table-column>
            <el-table-column
                label="拍屏"
                min-width="120"
                align="center">
            </el-table-column>
            <el-table-column
                label="倒地"
                min-width="120"
                align="center">
            </el-table-column>
            <el-table-column
                label="临时离柜"
                min-width="120"
                align="center">
            </el-table-column>
            <el-table-column
                label="烟雾火苗"
                min-width="120"
                align="center">
            </el-table-column>
            <el-table-column
                label="打斗"
                min-width="120"
                align="center">
            </el-table-column>
            <el-table-column
                label="数人"
                min-width="120"
                align="center">
            </el-table-column>
            <el-table-column
                label="快速移动"
                min-width="120"
                align="center">
            </el-table-column>
            <el-table-column
                label="遗留物"
                min-width="120"
                align="center">
            </el-table-column>
            <el-table-column
                label="徘徊"
                min-width="120"
                align="center">
            </el-table-column>
            <el-table-column
                label="箱包"
                min-width="120"
                align="center">
            </el-table-column>
            <el-table-column
                label="摄像头移动"
                min-width="120"
                align="center">
            </el-table-column>
            <el-table-column
                label="睡岗"
                min-width="120"
                align="center">
            </el-table-column>
            <el-table-column
                label="越界侦测"
                min-width="120"
                align="center">
            </el-table-column>
            <el-table-column
                label="进入区域侦测"
                min-width="120"
                align="center">
            </el-table-column>
            <el-table-column
                label="离开区域侦测"
                min-width="120"
                align="center">
            </el-table-column>
            <el-table-column
                label="玩手机"
                min-width="120"
                align="center">
            </el-table-column>
            <!-- <el-table-column
                label="客流"
                min-width="120"
                align="center">
            </el-table-column> -->
        </el-table>
    </div>
</template>
<script>
import { getChannel, putChannels } from '@/api/systemAPI.js';

export default {
    data() {
        return {
            tableData: [],
            filter: 'all',
            tableHeight: '', //表格高度
            buttonType: '',
            switchFlag: false,
            algoList: [{
                    index: 0,
                    name: "人脸",
                    algorithm: "face",
                }, {
                    index: 1,
                    name: "行人",
                    algorithm: "pedestrian",
                }, {
                    index: 2,
                    name: "机动车",
                    algorithm: "vehicle",
                }, {
                    index: 3,
                    name: "非机动车",
                    algorithm: "nonmotor",
                }, {
                    index: 4,
                    name: "拍屏",
                    algorithm: "shoot",
                }, {
                    index: 5,
                    name: "倒地",
                    algorithm: "fall",
                }, {
                    index: 6,
                    name: "临时离柜",
                    algorithm: "cash",
                }, {
                    index: 7,
                    name: "烟雾火苗",
                    algorithm: "smogFire",
                }, {
                    index: 8,
                    name: "打斗",
                    algorithm: "struggle",
                }, {
                    index: 9,
                    name: "数人",
                    algorithm: "skeleton",
                }, {
                    index: 10,
                    name: "快速移动",
                    algorithm: "fastMove",
                }, {
                    index: 11,
                    name: "遗留物",
                    algorithm: "remain",
                }, {
                    index: 12,
                    name: "徘徊",
                    algorithm: "hover",
                }, {
                    index: 13,
                    name: "箱包",
                    algorithm: "bag",
                }, {
                    index: 14,
                    name: "摄像头移动",
                    algorithm: "ipcmove",
                }, {
                    index: 15,
                    name: "睡岗",
                    algorithm: "sleep",
                }, {
                  index: 16,
                  name: '越界侦测',
                  algorithm: 'outOfBounds',
                }, {
                  index: 17,
                  name: '进入区域侦测',
                  algorithm: 'enterArea',
                }, {
                  index: 18,
                  name: '离开区域侦测',
                  algorithm: 'leaveArea',
                }, {
                    index: 19,
                    name: "玩手机",
                    algorithm: "playPhone",
                }, {
                  index: 20,
                  name: "客流",
                  algorithm: "flowAreas",
                }]
        }
    },
    mounted() {
        let _this = this;
        window.onresize = () => {
            if (_this.resizeFlag) {
                clearTimeout(_this.resizeFlag);
            }
            _this.resizeFlag = setTimeout(() => {
                _this.getTableHeight()
                _this.resizeFlag = null
            },100)
        }
    },
    created () {
        this.getTableHeight()
        this.getDataList()
    },
    methods: {
        getTableHeight() {
            let tableH = 160;
            let tableHeightDetail = window.innerHeight - tableH;
            if (tableHeightDetail <= 300) {
                this.tableHeight = 300
            } else {
                this.tableHeight = window.innerHeight - tableH
            }
        },
        algoSwitch() {
            this.switchFlag = !this.switchFlag
            this.buttonType = this.switchFlag ? 'primary' : ''
        },
        handleFilterChange(value) {
            // 根据 value 过滤表格数据
        },
        // 表头颜色
        tableHeaderColor ({row, column, rowIndex, columnIndex}) {
            if (rowIndex === 0) {
                return  'background-color:rgba(58,116,255,0.05);' +
                        'box-shadow:0px -1px 0px 0px rgba(235,238,245,1);' +
                        'color:rgba(0,0,0,0.85);' +
                        'font-weight:500;' +
                        'font-size:12px;' +
                        'border:0;' +
                        'border-bottom: 1px solid #ebeef5;' +
                        'height:22px;' +
                        'line-height:22px'
            }
        },
        getCellStyle({ row, column, rowIndex, columnIndex }) {
            // 人脸 行人 机动车 非机动车 拍屏 倒地 临时离柜 烟雾火苗 打斗 数人 快速移动 遗留物 徘徊 箱包 摄像头移动 睡岗 越界侦测 进入区域侦测 离开区域侦测 玩手机 客流
            let { face,pedestrian,vehicle,nonmotor,shoot,fall,cash,smogFire,struggle,skeleton,fastMove,remain,hover,bag,ipcmove,sleep,outOfBounds,enterArea,leaveArea,playPhone,flowAreas } = {...row.config}
            let result = {
                face,pedestrian,vehicle,nonmotor,shoot,fall,cash,smogFire,struggle,skeleton,fastMove,remain,hover,bag,ipcmove,sleep,outOfBounds,enterArea,leaveArea,playPhone,flowAreas
            }
            // 获取当前单元格的配置
            const cellConfig = Object.values(result)[columnIndex-1];
            // 如果当前单元格的配置存在并且启用，则更改背景颜色
            if (cellConfig && cellConfig.enabled) {
                return { backgroundColor: '#00ff2a' };
            } else {
                return {};
            }
        },
        tableClick(row, column) {
            // if (row.status === 0) {
            //     return
            // }
            let algoColumn = Number(column.id.substring(18))-1 // 第几列算法
            console.log('algoColumn',algoColumn);
            let algoColumnName = this.algoList.find(item=>item.index === algoColumn - 1)?.algorithm // 当列算法的名称
            let algoEnabled = this.tableData.find(item=>item.channel === row.channel).config[algoColumnName].enabled // 点击的这个方格的算法是否处于打开状态
            if (this.switchFlag) {
                let params = {
                    config: {}
                }
                params.config[algoColumnName] = {}
                params.config[algoColumnName].enabled = !algoEnabled
                putChannels(row.channel, params).then(res => {
                    if (res.data.code == 200000) {
                        this.getDataList()
                        this.$message.success('修改成功！')
                    }
                })
            } else {
                // this.$router.push({
				// 	path: '/smart/params',
				// 	query: {
				// 		channel: row.channel,
                //         algo: algoColumnName
				// 	}
				// });
            }
        },
        async getDataList() {
            const { data } = await getChannel()
            if (data.code == 200000) {
                this.tableData = data.data.boundList.filter(item=>item.enabled)
            } else {
                this.$message.error(data.message)
            }
        }
    },
}
</script>
<style lang="less" scoped>
.basic {
    width: 98%;
    margin-left: 15px;
}
</style>