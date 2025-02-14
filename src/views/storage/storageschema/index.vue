<template>
    <div class="storageSchema">
        <el-form label-position="left" label-width="120px" size="mini" :model="form">
            <el-form-item label="存储模式">
            <el-radio-group v-model="form.mode" style="width: 220px">
                    <el-radio :label="1">盘组</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="盘组号">
                <el-select v-model="form.groupId" @change="onGroupChange" placeholder="" style="width: 220px">
                    <el-option v-for="item in groupList" :label="item.groupId + (item.showInfo ? '(已分盘)' : null)" :value="item.groupId" :key="item.groupId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="通道分配"></el-form-item>
            <div style="margin-bottom: 15px;">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="onCheckAllChange">全选</el-checkbox>
                <span style="margin-left: 40px;">
                    <div style="width: 10px;height: 10px;background: red;display: inline-block;"></div>
                    <span style="color:#666666;font-size: 12px;margin-left: 10px;">红色表示通道未添加、不在线或已删除</span>
                </span>
            </div>
            <el-checkbox-group v-model="checkedChannel" @change="onCheckChange">
                <el-checkbox v-for="item in channelList" style="width: 40px" :label="item.id" :key="item.id" :disabled="channelsDisabled.indexOf(item.id)==-1 ? false : true">
                    <span :style="{color:item.deleteItem ? 'red' : ''}">
                        {{item.name}}
                    </span>
                </el-checkbox>
            </el-checkbox-group>
        </el-form>
        <div style="margin-top: 20px;">
            <el-button type="primary" size="small" @click="onSave">应用</el-button>
        </div>
    </div>
</template>
<script>
import { getChannelList,getDiskInfo,getStorageMode,getStorageGroup,putStorageGroup } from '@/api/systemAPI';
export default {
    name: 'storageSchema',
    components: {
    },
    data(){
        return {
            form: {
                mode: 1,
                groupId: 1,
            },
            channelList: [],
            groupList: [{groupId:1},{groupId:2},{groupId:3},{groupId:4},
                    {groupId:5},{groupId:6},{groupId:7},{groupId:8}],
            isIndeterminate: true,
            checkAll: false,
            checkedChannel: [],
            channelsDisabled: [],
            storageGroupList: {}
        }
    },
    created() {
        this.nvrRd = Number(localStorage.getItem('nvrRd'))
        for (let i = 0; i < this.nvrRd; i++) {
            this.channelList.push({
                name: 'D'+(i+1),
                id: i+1,
                deleteItem: false
            })
        }
    },
    mounted() {
        // 获取在线通道列表
        this.queryChannelList()
        // 获取盘组号
        this.queryGroupList()
        // 获取存储模型
        this.queryStorageMode()
    },
    methods: {
        // 获取通道列表
        queryChannelList(){
            getChannelList().then(res => {
                if (res.data.code === 200000) {
                    this.onlineList = res.data.data.map(item=>item.channel)
                    this.channelList.forEach((item1,index1)=>{
                        if (this.onlineList.indexOf(item1.id)==-1) {
                            this.channelList[index1].deleteItem = true
                        }
                    })
                    this.$forceUpdate()
                }
            });
        },
        // 获取盘组号
        queryGroupList() {
            getDiskInfo().then(res => {
                if(res.data.code === 200000) {
                    let diskInfoList = res.data.data.diskStorageList
                    this.groupList.forEach((item,index)=>{
                        diskInfoList.forEach(it=>{
                            if (item.groupId == it.groupId) {
                                this.groupList[index].showInfo = true
                            }
                        })
                    })
                    this.$forceUpdate()
                }
            })
        },
        // 获取存储模型
        queryStorageMode(){
            getStorageMode().then(res => {
                if(res.data.code == 200000) {
                    this.form.mode = res.data.data.mode
                    if(this.form.mode == 1) {
                        // 获取盘组数据
                        this.querytStorageGroup()
                    }
                }
            })
        },
        // 获取盘组数据
        querytStorageGroup(){
            getStorageGroup().then(res => {
                if(res.data.code == 200000) {
                    this.storageGroupList = res.data.data.storageGroupList
                    this.getDisabledChannel()
                }
            })
        },
        getDisabledChannel() {
            this.checkedChannel = this.storageGroupList[this.form.groupId] ? this.storageGroupList[this.form.groupId].map(Number) : []
            if (this.checkedChannel.length == 32) {
                this.isIndeterminate = false
                this.checkAll = true
            }
            this.channelsDisabled = []
            for(let key in this.storageGroupList) {
                if (key != this.form.groupId) {
                    console.log('key',key);
                    this.storageGroupList[key].forEach(item=>{
                        this.channelsDisabled.push(Number(item))
                    })
                }
            }
            this.channelsDisabled.sort((a, b) => a - b)
        },
        // 盘组change
        onGroupChange(e) {
            this.form.groupId = e
            this.getDisabledChannel()
        },
        // 全选
        onCheckAllChange(val) {
            this.checkedChannel = val ? this.channelList.filter(item=>this.channelsDisabled.indexOf(item.id)==-1).map(it=>it.id) : [];
            this.storageGroupList[this.form.groupId] = this.checkedChannel
            this.isIndeterminate = false;
        },
        // 单个选择
        onCheckChange(value) {
            this.storageGroupList[this.form.groupId] = value
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.channelList.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.channelList.length;
        },
        // 保存盘组数据
        onSave(){
            let list = []
            for(let k in this.storageGroupList) {
                let arr = []
                if(this.storageGroupList[k]&&this.storageGroupList[k].length) {
                    this.storageGroupList[k].forEach(item => {
                        arr.push(item + "")
                    })
                    list.push({
                        groupId: Number(k),
                        channels: arr
                    })
                }
            }
            putStorageGroup({'storageGroupList':list}).then(res => {
                if(res.data.code == 200000) {
                    this.$message.success('保存成功！')
                }else {
                    this.$message.error('保存失败！')
                }
            }).catch(()=>{
                this.$message({
                    showClose:true,
                    message:'保存失败！',
                    type: 'error'
                })
            })
        },
    }
}
</script>