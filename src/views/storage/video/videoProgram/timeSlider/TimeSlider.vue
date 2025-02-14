<template>
<div>
  <div class="timeLabel">
    {{record.label}}
  </div>
  <div class="time-slider">
    <div>
       <TimeLine ref="timeID1_" :ID="'timeID1_' + record.id" key="1" :Color="'#2178C8'" :timeArr1="time1" @updataData="onUpdata"/>
    </div>
    <div>
     <TimeLine ref="timeID2_" :ID="'timeID2_'+ record.id" key="2" :Color="'#390'" :timeArr1="time2" @updataData="onUpdata"/>
    </div>
    <div class="flex-box">
      <div class="flex-item" key="0">{{0}}</div>
      <div class="flex-item" v-for="n in 12" :key="n">{{2*n}}</div>
    </div>
   </div>
</div>

</template>
<script>
import TimeLine from './TimeLine';
export default {
  name: 'TimeSlider',
  components:{
    TimeLine
  },
  props: {
    record: {
      type: Object,
      required: true,
    },
    reloadFlag: {
      type: Boolean,
      required: true,
    },
  },
  data(){
    return {
      showTime: false,
      time1: this.record.timeObj.type1,
      time2: this.record.timeObj.type2
    }
  },
  created() {
  },
  mounted(){
    this.showTime = true
  },
  watch:{
    reloadFlag(val){
      this.onReload()
    },
  },
  methods: {
    // 获取时间值
    onUpdata(ID,arr){
      if(ID.startsWith('timeID1_')) {
        this.record.timeObj.type1 = arr
      } else if(ID.startsWith('timeID2_')) {
        this.record.timeObj.type2 = arr
      }
      this.$emit('updataTime',this.record.id,this.record)
    },
    //刷新canvas 图表
    onReload(){
      this.$refs.timeID1_.initData(this.record.timeObj.type1);
      this.$refs.timeID2_.initData(this.record.timeObj.type2);
    }
  }
}
</script>
<style scoped>
.time-slider{
  width: 936px;
  height: 60px;
  text-align: center;
  display: inline-block;
  vertical-align: top;
  margin-left: -30px;
}
.timeLabel{
  height: 60px;
  line-height: 30px;
  width: 50px;
  font-size: 12px;
  display: inline-block;
  vertical-align: top;
  color: #666666;
}
.flex-box{
  display: flex;
}
.flex-item{
 flex:1;
}
.flex-item {
  color: #666666;
  font-size: 12px;
}
</style>
