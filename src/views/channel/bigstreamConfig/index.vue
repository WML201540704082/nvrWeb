<template>
   <div class="BitstreamConfig">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="主码流参数" name="first">
        <el-form  label-width="120px" size="mini" :model="form1">
          <el-form-item label="通道">
            <el-select v-model="form1.channel" @change="onChannel1" placeholder="请选择" :disabled="disabled1" class="select-width">
              <el-option
                v-for="item in channelList"
                :key="item.id"
                :label="item.chName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="编码标准">
            <el-select v-model="form1.vcodes" @change="onVcodes1" placeholder="请选择" class="select-width">
                <el-option v-for="item in vcodesArr" :label="item.vcodesEnum" :value="item.vcodesEnum" :disabled="item.vcodesEnum !== 'H264' && item.vcodesEnum !== 'H265'" :key="item.vcodesEnum"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分辨率">
            <el-select v-model="form1.resolution" @change="onResolution1" placeholder="请选择" class="select-width">
              <el-option v-for="item in resolutionArr" :label="item.resolutionsEnum" :value="item.resolutionsEnum" :key="item.resolutionsEnum"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="编码级别">
            <el-select v-model="form1.profilecaps" placeholder="请选择" class="select-width">
               <el-option v-for="item in profilecapsArr" :label="item.profilecaps" :disabled="item.profilecaps === 'Baseline'" :value="item.profilecaps" :key="item.profilecaps"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="视频码率">
            <el-select v-model="form1.vBitrate" v-if="!form1InputFlag" placeholder="请选择" class="select-width">
               <el-option v-for="item in vBitrateArr" :label="item" :value="item" :key="item"></el-option>
            </el-select>
            <el-input type="text" v-else v-model="form1.vBitrate" style="width: 172px"></el-input>
            <span style="padding: 0 15px;color: #000000;">kbps</span>
            <el-button @click="form1InputFlag = !form1InputFlag">自定义</el-button>
          </el-form-item>
          <el-form-item label="码率类型">
            <el-select v-model="form1.bitrateTypes" placeholder="请选择" class="select-width">
              <el-option v-for="item in bitrateTypesArr" :label="item.bitrateDesc" :value="item.bitrateTypes" :key="item.bitrateTypes"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="码流类型">
            <el-select v-model="form1.streamTypes" placeholder="请选择" class="select-width">
              <el-option v-if="showForm1StreamTypes == 0" label="无支持码流类型" :value="0" key="0"></el-option>
              <el-option v-if="showForm1StreamTypes == 1" label="音频流" :value="1" key="1"></el-option>
              <el-option v-if="showForm1StreamTypes == 2 || showForm1StreamTypes == 3" label="视频流" :value="2" key="2"></el-option>
              <el-option v-if="showForm1StreamTypes == 2 || showForm1StreamTypes == 3" label="复合流" :value="3" key="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="帧率">
            <el-select v-model="form1.vFrameRate" placeholder="请选择" class="select-width">
               <el-option v-for="item in vFrameRateArr" :label="item" :value="item" :key="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="I帧间隔">
            <el-select v-model="form1.IFrameInterval" placeholder="请选择" class="select-width">
               <el-option v-for="item in IFrameIntervalArr" :label="item" :value="item" :key="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="音频格式">
            <el-select v-model="form1.acodes" @change="onAcodes1"  placeholder="请选择" class="select-width">
               <el-option v-for="item in acodesArr" :label="item.acodesEnum" :value="item.acodesEnum" :key="item.acodesEnum"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="音频码率">
            <el-select v-model="form1.aBitrate"  placeholder="请选择" class="select-width">
              <el-option v-for="item in aBitrateArr" :label="item.bitrate" :value="item.bitrate" :key="item.bitrate"></el-option>
            </el-select>
            <span style="padding: 0 15px;color: #000000;">kbps</span>
          </el-form-item>
          <el-form-item label="音频采样率">
            <el-select v-model="form1.aSamplerate"  placeholder="请选择" class="select-width">
              <el-option v-for="item in aSamplerateArr" :label="item.samplerate" :value="item.samplerate" :key="item.samplerate"></el-option>
            </el-select>
            <span style="padding: 0 15px;color: #000000;">kHz</span>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSave1" :disabled="disabled1">应用</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="子码流参数" name="second">
         <el-form  label-width="120px" size="mini" :model="form2">
          <el-form-item label="通道">
            <el-select  @change="onChannel2" v-model="form2.channel" placeholder="请选择" :disabled="disabled1" class="select-width">
              <el-option
                v-for="item in channelList"
                :key="item.id"
                :label="item.chName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="编码标准">
            <el-select v-model="form2.vcodes" @change="onVcodes2" placeholder="请选择" class="select-width">
                <el-option v-for="item in vcodesArr2" :label="item.vcodesEnum" :disabled="item.vcodesEnum !== 'H264' && item.vcodesEnum !== 'H265'" :value="item.vcodesEnum" :key="item.vcodesEnum"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分辨率">
            <el-select v-model="form2.resolution" @change="onResolution2" placeholder="请选择" class="select-width">
              <el-option v-for="item in resolutionArr2" :label="item.resolutionsEnum" :value="item.resolutionsEnum" :key="item.resolutionsEnum"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="编码级别">
            <el-select v-model="form2.profilecaps" placeholder="请选择" class="select-width">
               <el-option v-for="item in profilecapsArr2" :disabled="item.profilecaps === 'Baseline'" :label="item.profilecaps" :value="item.profilecaps" :key="item.profilecaps"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="视频码率">
            <el-select v-model="form2.vBitrate" v-if="!form2InputFlag" placeholder="请选择" class="select-width">
               <el-option v-for="item in vBitrateArr2" :label="item" :value="item" :key="item"></el-option>
            </el-select>
            <el-input type="text" v-else v-model="form2.vBitrate" style="width: 172px"></el-input>
            <span style="padding: 0 15px;color: #000000;">Kbps</span>
            <el-button @click="form2InputFlag = !form2InputFlag">自定义</el-button>
          </el-form-item>
          <el-form-item label="码率类型">
            <el-select v-model="form2.bitrateTypes" placeholder="请选择" class="select-width">
              <el-option v-for="item in bitrateTypesArr2" :label="item.bitrateDesc" :value="item.bitrateTypes" :key="item.bitrateTypes"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="码流类型">
            <el-select v-model="form2.streamTypes" placeholder="请选择" class="select-width">
              <el-option v-if="showForm2StreamTypes == 0" label="无支持码流类型" :value="0" key="0"></el-option>
              <el-option v-if="showForm2StreamTypes == 1" label="音频流" :value="1" key="1"></el-option>
              <el-option v-if="showForm2StreamTypes == 2 || showForm2StreamTypes == 3" label="视频流" :value="2" key="2"></el-option>
              <el-option v-if="showForm2StreamTypes == 2 || showForm2StreamTypes == 3" label="复合流" :value="3" key="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="帧率">
            <el-select v-model="form2.vFrameRate" placeholder="请选择" class="select-width">
               <el-option v-for="item in vFrameRateArr2" :label="item" :value="item" :key="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="I帧间隔">
            <el-select v-model="form2.IFrameInterval" placeholder="请选择" class="select-width">
               <el-option v-for="item in IFrameIntervalArr2" :label="item" :value="item" :key="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSave2" :disabled="disabled1">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <!-- <el-tab-pane label="抓图参数" name="third">
        <el-form  label-width="120px" size="mini" :model="form3">
          <el-form-item label="通道">
            <el-select  @change="onChannel3" v-model="form3.channel" placeholder="请选择">
              <el-option
                v-for="item in channelList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="图片格式">
            <el-select v-model="form3.picRes" placeholder="请选择">
              <el-option label="主码流" :value="1"></el-option>
              <el-option label="子码流" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="图片质量">
            <el-select v-model="form3.picQuality" placeholder="请选择">
              <el-option label="一般" :value="1"></el-option>
              <el-option label="较好" :value="2"></el-option>
              <el-option label="很好" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="抓图频率">
            <el-select v-model="form3.captureFre" placeholder="请选择">
              <el-option label="0.2" :value="0.2"></el-option>
              <el-option label="0.5" :value="0.5"></el-option>
              <el-option label="1" :value="1"></el-option>
              <el-option label="2" :value="2"></el-option>
              <el-option label="3" :value="3"></el-option>
              <el-option label="4" :value="4"></el-option>
              <el-option label="5" :value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSave3">查询</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane> -->
    
    </el-tabs>
   </div>
</template>
<script>
import { getChannelList, getBitstreamParam,getStreamparaParam
,putStreamparaParam,getPicpara,putPicpara} from '@/api/systemAPI';
export default {
  name: 'BitstreamConfig',
  data(){
    return {
       activeName: 'first',
       channelList:[],
       form1: {
        channel: '',
        resolution: '',
        vcodes: '',
        profilecaps: '',
        vBitrate: '',
        bitrateTypes: '',
        streamTypes: '',
        vFrameRate: '',
        IFrameInterval: '',
        acodes: '',
        aBitrate: '',
       },
       form2: {
        channel: '',
        resolution: '',
        vcodes: '',
        profilecaps: '',
        vBitrate: '',
        bitrateTypes: '',
        streamTypes: '',
        vFrameRate: '',
        IFrameInterval: '',
       },
       form3: {
        channel: '',
        picRes: '',
        picQuality: '',
        captureFre: '',
       },
       form4: {

       },
       resolutionArr2: [],
       vcodesArr2: [],
       showForm2StreamTypes: 3,
       profilecapsArr2: [],
       vBitrateArr2: [],
       bitrateTypesArr2: [],
       vFrameRateArr2: [],
       IFrameIntervalArr2Def: [25,30,50,60,100,120,150,200],
       IFrameIntervalArr2: [25,30,50,60,100,120,150,200],
       resolutionArr: [],
       vcodesArr: [],
       showForm1StreamTypes: 3,
       profilecapsArr: [],
       vBitrateArr: [],
       bitrateTypesArr: [],
       vFrameRateArr: [],
       IFrameIntervalArrDef: [25,30,50,60,100,120,150,200],
       IFrameIntervalArr: [25,30,50,60,100,120,150,200],
       acodesArr: [],
       aBitrateArr: [],
       aSamplerateArr: [],
       form1InputFlag: false,
       form2InputFlag: false,
       form4InputFlag: false,
       disabled1: false
    }
  },
  created() {
    this.queryChannel()
  },
  methods: {
    queryChannel() {
      this.channelList = []
      getChannelList().then(res => {
        if(res.data.code === 200000){
          let arr = res.data.data
          arr.forEach(item=> {
            this.channelList.push({
              name: item.channelType + "" + item.channel,
              id: item.channel
            })
          })
          arr.forEach((item,index)=> {
            let name = !item.chanNameList ? '' : (item.chanNameList.length>0 ? item.chanNameList[0].channelName : '')
            this.channelList[index] = {...this.channelList[index], chName: ('[' + item.channelType + "" + item.channel + ']' + name)}
          })
          // 默认选中第一个通道
          if(this.channelList.length) {
            this.form1.channel = this.channelList[0].id
            this.form2.channel = this.channelList[0].id
            this.form3.channel = this.channelList[0].id
            this.queryBitstreamParam(this.channelList[0].id, 1)
          }
        }
      })
    },
    queryform1(channelID,bitrateID){
     this.disabled1 = true
      getStreamparaParam(channelID,bitrateID).then(res => {
        this.disabled1 = false
        if(res.data.code === 200000) {
          let data = res.data.data
          this.form1 = {
            channel: channelID,
            resolution: data.resolution,
            vcodes: data.vcodes,
            profilecaps: data.profilecaps,
            vBitrate: data.vBitrate,
            bitrateTypes: data.bitrateTypes,
            streamTypes: data.streamTypes,
            vFrameRate: data.vFrameRate,
            IFrameInterval: data.IFrameInterval,
            acodes: data.acodes,
            aBitrate: data.aBitrate,
            aSamplerate: data.aSamplerate,
          }
          this.onVcodes1(data.vcodes)
          this.onAcodes1(data.acodes)
        }
      }).catch(err => {
        this.disabled1 = false
        this.$message({
          showClose: true,
          message: err.message?err.message:'获取码流参数据错误！',
          type: 'error'
        })
      })
    },
    queryform2(channelID,bitrateID){
      this.disabled1 = true
      getStreamparaParam(channelID,bitrateID).then(res => {
        if(res.data.code === 200000) {
          let data = res.data.data
          this.form2 = {
            channel: channelID,
            resolution: data.resolution,
            vcodes: data.vcodes,
            profilecaps: data.profilecaps,
            vBitrate: data.vBitrate,
            bitrateTypes: data.bitrateTypes,
            streamTypes: data.streamTypes,
            vFrameRate: data.vFrameRate,
            IFrameInterval: data.IFrameInterval,
          }
          this.onVcodes2(data.vcodes)
        }
        this.disabled1 = false
      }).catch(err => {
        this.disabled1 = false
        this.$message({
          showClose: true,
          message: err.message?err.message:'获取码流参数据错误！',
          type: 'error'
        })
      })
    },
    queryform3(id){
      getPicpara(id).then(res=>{
        if(res.data.code == 200000) {
          this.form3 = {
            channel: id,
            picRes: res.data.data.picRes,
            picQuality: res.data.data.picQuality,
            captureFre: res.data.data.captureFre,
          }
        }
      })
    },
    //主编码
    onChannel1(e) {
      this.queryBitstreamParam(e,1)
    },
    //子编码
    onChannel2(e) {
      this.queryBitstreamParam(e,2)
    },
    //子编码
    onChannel3(e) {
      this.queryform3(e)
    },
    queryBitstreamParam(channelID,bitrateID) {
    // 音频格式
    this.acodesArr = []
    // 编码标准
    this.vcodesArr = []
    this.form1 = {
        channel: channelID,
        resolution: '',
        vcodes: '',
        profilecaps: '',
        vBitrate: '',
        bitrateTypes: '',
        streamTypes: '',
        vFrameRate: '',
        IFrameInterval: '',
        acodes: '',
        aBitrate: '',
        aSamplerate: '',
       }
       this.form2 = {
        channel: channelID,
        resolution: '',
        vcodes: '',
        profilecaps: '',
        vBitrate: '',
        bitrateTypes: '',
        streamTypes: '',
        vFrameRate: '',
        IFrameInterval: '',
       }
       this.disabled1 = true
    getBitstreamParam(channelID,bitrateID).then(res => {
      this.disabled1 = false  
      if(res.data.code === 200000){
          let arr = res.data.data || []
          
          if (arr != null && arr.length > 0) { 
            if(bitrateID == 1 && channelID == this.form1.channel) {
              this.acodesArr = arr[0].audioCodec
              // 编码标准
              this.vcodesArr = arr[0].videCodec
              this.showForm1StreamTypes = arr[0].streamTypes
              this.queryform1(channelID,1)
            } else if(bitrateID == 2 && channelID == this.form2.channel) {
              this.queryform2(channelID,2)
              this.acodesArr2 = arr[0].audioCodec
              // 编码标准
              this.vcodesArr2 = arr[0].videCodec
              this.showForm2StreamTypes = arr[0].streamTypes
            }
          }
        }
      }).catch(err => {
        this.disabled1 = false
        this.$message({
          showClose: true,
          message: err.message?err.message:'获取码流参数错误！',
          type: 'error'
        })
      })
    },
    // 音频格式切换 修改音频码率
    onAcodes1(e) {
      if (!this.acodesArr) {
        this.aBitrateArr = []
        this.aSamplerateArr = []
        return
      }
      let arr =  this.acodesArr.filter(item=> {
        return item.acodesEnum == e
      })
      this.aBitrateArr = arr[0].bitrateArr
      this.aSamplerateArr = arr[0].samplerateArr
      let index1 = this.aBitrateArr.findIndex(item =>{
        return this.form1.aBitrate == item.bitrate;
      })
      if (index1<0) {
        this.form1.aBitrate = this.aBitrateArr.length > 0 ? this.aBitrateArr[0].bitrate : "";
      }
      let index2 = this.aSamplerateArr.findIndex(item =>{
        return this.form1.aSamplerate == item.samplerate;
      })
      if (index2<0) {
        this.form1.aSamplerate = this.aSamplerateArr.length > 0 ? this.aSamplerateArr[0].samplerate : "";
      }
    },
    // 编码标准切换 编码等级 分辨率
    onVcodes1(e) {
      let arr =  this.vcodesArr.filter(item=> {
        return item.vcodesEnum == e
      })
      // 编码等级
      this.profilecapsArr = arr[0].profilecapsEnumArr
      // 分辨率
      this.resolutionArr = arr[0].resolutionPrmArr
      if(arr[0].resolutionPrmArr[0]) {
        this.onResolution1(arr[0].resolutionPrmArr[0].resolutionsEnum)
      }
      // 码率类型
      this.bitrateTypesArr = arr[0].bitrateTypesEnumArr
      // 码率数组
      let bitArr = []
      let bitMax = Math.floor(arr[0].bitrateRangeMax/1024)
      let bitMin = Math.floor(arr[0].bitrateRangeMin/1024)
       for(let i=bitMin; i<= bitMax; i++) {
        i == 0 ? bitArr.push(arr[0].bitrateRangeMin):bitArr.push(1024*i)
        if (i == bitMax && 1024*i < arr[0].bitrateRangeMax) {
          bitArr.push(arr[0].bitrateRangeMax)
        }
      }
      this.vBitrateArr = bitArr
      // I帧间隔数组
      this.IFrameIntervalArr = this.IFrameIntervalArrDef.slice()
      if (this.IFrameIntervalArr.length > 0 && arr[0].IFrameIntervalRangeMin > 0 && arr[0].IFrameIntervalRangeMin < this.IFrameIntervalArr[0]) {
        this.IFrameIntervalArr.unshift(arr[0].IFrameIntervalRangeMin)
      }
      if (this.IFrameIntervalArr.length > 0 && arr[0].IFrameIntervalRangeMax > 0 && arr[0].IFrameIntervalRangeMax > this.IFrameIntervalArr[this.IFrameIntervalArr.length-1]) {
        this.IFrameIntervalArr.push(arr[0].IFrameIntervalRangeMax)
      }
     
    },
    // 分辨率切换 修改 帧率
    onResolution1(e) {
      let arr =  this.resolutionArr.filter(item=> {
        return item.resolutionsEnum == e
      })
      // 编码等级
      this.vFrameRateArr = arr[0].framerateArr
    },
    // 编码标准切换 编码等级 分辨率
    onVcodes2(e) {
      let arr =  this.vcodesArr2.filter(item=> {
        return item.vcodesEnum == e
      })
      // 编码等级
      this.profilecapsArr2 = arr[0].profilecapsEnumArr
      // 分辨率
      this.resolutionArr2 = arr[0].resolutionPrmArr

      if(arr[0].resolutionPrmArr[0]) {
        this.onResolution2(arr[0].resolutionPrmArr[0].resolutionsEnum)
      }
       this.bitrateTypesArr2 = arr[0].bitrateTypesEnumArr
      // 码率数组
      let bitArr = []
      let bitMax = Math.floor(arr[0].bitrateRangeMax/1024)
      let bitMin = Math.floor(arr[0].bitrateRangeMin/1024)
       for(let i=bitMin; i<= bitMax; i++) {
        i == 0 ? bitArr.push(arr[0].bitrateRangeMin):bitArr.push(1024*i)
        if (i == bitMax && 1024*i < arr[0].bitrateRangeMax) {
          bitArr.push(arr[0].bitrateRangeMax)
        }
      }
      this.vBitrateArr2 = bitArr
      // I帧间隔数组
      this.IFrameIntervalArr2 = this.IFrameIntervalArr2Def.slice()
      if (this.IFrameIntervalArr2.length > 0 && arr[0].IFrameIntervalRangeMin > 0 && arr[0].IFrameIntervalRangeMin < this.IFrameIntervalArr2[0]) {
        this.IFrameIntervalArr2.unshift(arr[0].IFrameIntervalRangeMin)
      }
      if (this.IFrameIntervalArr2.length > 0 && arr[0].IFrameIntervalRangeMax > 0 && arr[0].IFrameIntervalRangeMax > this.IFrameIntervalArr2[this.IFrameIntervalArr2.length-1]) {
        this.IFrameIntervalArr2.push(arr[0].IFrameIntervalRangeMax)
      }
     
    },
    // 分辨率切换 修改 帧率
    onResolution2(e) {
      let arr =  this.resolutionArr2.filter(item=> {
        return item.resolutionsEnum == e
      })
      // 编码等级
      this.vFrameRateArr2 = arr[0].framerateArr
    },
    handleClick(tab) {
      console.log(tab.name);
      if(tab.name == 'first') {
        this.queryBitstreamParam(this.form1.channel,1)
      } else if(tab.name == 'second') {
        this.queryBitstreamParam(this.form2.channel,2)
      } else if(tab.name == 'third') {
        this.queryform3(this.form3.channel)
      }
    },
    onSave1() {
      let obj =  {
            bitstream: 1,
            resolution: this.form1.resolution,
            vcodes: this.form1.vcodes,
            profilecaps: this.form1.profilecaps,
            vBitrate: Number(this.form1.vBitrate),
            bitrateTypes: this.form1.bitrateTypes,
            streamTypes:  Number(this.form1.streamTypes),
            vFrameRate:  Number(this.form1.vFrameRate),
            IFrameInterval:  Number(this.form1.IFrameInterval),
            acodes: this.form1.acodes,
            aBitrate: Number(this.form1.aBitrate),
            aSamplerate: Number(this.form1.aSamplerate),
      }
      if(this.form1.profilecaps === 'Baseline') {
        this.$message.warning('编码级别不能为Baseline')
        return
      }
      if(this.form1.vcodes !== 'H264' && this.form1.vcodes !== 'H265') {
        this.$message.warning('不支持当前选择的编码标准')
        return
      }
      putStreamparaParam(this.form1.channel,1,obj).then(res => {
        if(res.data.code == 200000) {
          this.$message({
            message: '保存成功！',
            type: 'success'
          })
        }
      })
    },
    onSave2() {
        let obj =  {
            bitstream: 2,
            resolution: this.form2.resolution,
            vcodes: this.form2.vcodes,
            profilecaps: this.form2.profilecaps,
            vBitrate: Number(this.form2.vBitrate),
            bitrateTypes: this.form2.bitrateTypes,
            streamTypes:  Number(this.form2.streamTypes),
            vFrameRate:  Number(this.form2.vFrameRate),
            IFrameInterval:  Number(this.form2.IFrameInterval),
            acodes: this.form2.acodes,
            aBitrate: Number(this.form2.aBitrate),
            aSamplerate: Number(this.form2.aSamplerate),
          }
      if(this.form2.profilecaps === 'Baseline') {
        this.$message.warning('编码级别不能为Baseline')
        return
      }
      if(this.form2.vcodes !== 'H264' && this.form2.vcodes !== 'H265') {
        this.$message.warning('不支持当前选择的编码标准')
        return
      }
      putStreamparaParam(this.form2.channel,2,obj).then(res => {
        if(res.data.code == 200000) {
          this.$message({
            message: '保存成功！',
            type: 'success'
          })
        }
      })
    },
    onSave3() {
      let obj =  {
            channel: Number(this.form3.channel),
            picRes: Number(this.form3.picRes),
            picQuality: Number(this.form3.picQuality),
            captureFre: Number(this.form3.captureFre),
          }
      putPicpara(1, obj).then(res => {
        if(res.data.code == 200000) {
          this.$message({
            message: '保存成功！',
            type: 'success'
          })
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>
.BitstreamConfig{
    height: 100%;
}
.select-width{
  width: 172px;
}
/deep/ .el-button--primary {
  border-color: #2178C8;
  width: 58px;
  height: 30px;
  background: #2178C8;
  border-radius: 2px;
}
</style>
