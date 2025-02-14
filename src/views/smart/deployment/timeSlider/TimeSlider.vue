<template>
<div>
  <div class="timeLabel">
    {{record.label}}
  </div>
  <div class="TimeSlider" :style="{width: clientWidth == 1600 ? `calc(100vw / 2.14)` : ''}">
    <div>
       <TimeLine ref="timeID3_" :ID="'timeID3_' + record.id" :Color="'#20a0ff'" :timeArr1="time1" @updataData="onUpdata" @cancelSelect="onCancelSelect"/>
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
    selectFlag: {
      type: Boolean,
      required: true,
    },
  },
  data(){
    return {
      showTime: false,
      time1: this.record.timeObj.type1,
      clientWidth: '',
    }
  },
  created() {
    this.clientWidth = document.body.clientWidth
  },
  mounted(){
    this.showTime = true
  },
  watch:{
    reloadFlag(val){
      this.onReload()
    },
    selectFlag(val){
      this.onSelected()
    },
  },
  methods: {
    // 获取时间值
    onUpdata(ID,arr){
      let flag = false
      if(ID.startsWith('timeID3_')) {
        this.record.timeObj.type1 = arr
        arr.forEach(item => {
          if(item.S) {
            flag = true
          }
        });
      }
      this.$emit('updataTime',this.record.id,this.record,flag)
    },
    onCancelSelect(){
      this.$emit('updataSelect')
    },
    //刷新canvas 图表
    onReload(){
      this.$refs.timeID3_.initData(this.record.timeObj.type1);
    },
    //取消选中
    onSelected(){
      this.$refs.timeID3_.onCancleSelect();
    }
  }
}
</script>
<style scoped>
.TimeSlider{
  width: calc(100vw / 2.12);
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
  font-size: 14px;
  display: inline-block;
  vertical-align: top;
  color: #626262;
}
.flex-box{
  display: flex;
}
.flex-item{
 flex:1;
 color: #000;

}
</style>
