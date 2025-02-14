<template>
    <el-dialog 
        title="轮巡"
        width="590px"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        style="margin-top:-25px">
        <el-form :model="form" :rules="dataRule" ref="data-form" label-width="100px">
            <el-form-item label="轮巡通道" prop="roundChannel">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <el-checkbox-group v-model="form.roundChannel" @change="handleCheckedCitiesChange">
                    <el-checkbox v-for="(item,index) in channelList" :label="item" :key="index">{{item.channelName}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="轮巡画面数" prop="frameNum">
                <el-select size="mini" v-model="form.frameNum" placeholder="请选择" style="width:210px">
                    <el-option v-for="item in frameNumList" :key="item.index" :label="item.name" :value="item.index"></el-option>
                </el-select>
                <span style="color: red;margin: 0 5px 0 10px;">*</span>
                <span style="color: #c5c8d0;font-size: 13px;">轮巡画面数需小于勾选通道数</span>
            </el-form-item>
            <el-form-item label="时间间隔" prop="long">
                <el-input size="mini" maxlength="6" v-model.number="form.long"></el-input>
                <span>s</span>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="mini" type="primary" @click="save()">开启轮巡</el-button>
        </span>
    </el-dialog>
</template>
<script>
export default {
    name: 'Tag',
    data () {
        let validateFrameNum = (rule, value, callback) => {
            if (value >= this.form.roundChannel.length) {
                callback(new Error('轮巡画面数需小于勾选通道数'));
            } else {
                callback();
            }
        }
        let limitNumber = (rule, value, callback) => {
            if(isNaN(value)){
                callback(new Error('只允许输入数字'))
                //如果某个字段要求整数+数字
            } else if (rule.isInteger && !Number.isInteger(+value)) {
                callback(new Error('只允许输入整数'))
            } else if (value < 10) {
                callback(new Error('时间间隔最小10s'))
            } else {
                callback()
            }
        }
        return {
            dialogVisible: false,
            isIndeterminate: true,
            checkAll: false,
            form: {
                roundChannel: [],
                frameNum: 1,
                long: 10
            },
            channelList: [],
            frameNumList: [{
                name: '1',
                index: 1
            },{
                name: '2',
                index: 2
            },{
                name: '4',
                index: 4
            },{
                name: '6',
                index: 6
            },{
                name: '8',
                index: 8
            },{
                name: '9',
                index: 9
            },{
                name: '10',
                index: 10
            },{
                name: '16',
                index: 16
            }],
            dataRule: {
                roundChannel: [{ required: true, message: '请选择轮巡通道', trigger: 'blur' }],
                frameNum: [{ required: true, message: '请选择轮巡画面数', trigger: 'blur' },
                        { validator: validateFrameNum, trigger: 'blur' }],
                long: [{ required: true, message: '请输入时间间隔', trigger: 'blur' },
                    { validator: limitNumber, trigger: 'blur' }],
            },
        }
    },
    methods: {
        init() {
            this.$nextTick(()=>{
                this.dialogVisible = true
                this.form = {
                    roundChannel: [],
                    frameNum: 1,
                    long: 10
                }
                this.isIndeterminate = true
                this.checkAll = false
                let channelList = this.$store.getters.getChannelList
                this.channelList = channelList.filter(item=>item.status===1).map((item,index)=>{
                    return{
                        index,
                        channel:item.channel,
                        channelName: item.channelType + item.channel
                    }
                })
            })
        },
        handleCheckAllChange(val) {
            this.form.roundChannel = val ? this.channelList : [];
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.channelList.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.channelList.length;
        },
        // 表单提交
        save () {
            console.log('this.form',this.form)
            this.$refs['data-form'].validate((valid) => {
                if (valid) {
                    this.$emit('refRound',this.form)
                    this.dialogVisible = false   
                }
            })
        },
    },
}
</script>
  
<style lang="less" scoped>
    .el-input {
        width: 210px;
        padding-right: 10px;
    }
</style>
  