<template>
  <div class="timeline-container">
    <canvas id="timeline" width="1500" height="62" class="timeline-canvas" ondragstart="return false;"></canvas>
    <!-- <button @click="startTime">Lol</button> -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import moment from 'moment';

export default Vue.extend({
  name: 'Timeline',
  inject: ["size"],
  data: function () {
    return {
      canvas: null,
      ctx: null,
      canvasW: null,
      canvasH: null,
      minutes_per_step: [0.1, 1, 2, 5, 10, 15, 20, 30, 60, 120, 180, 240, 360, 720, 1440, 2880],
      graduation_step: 20,
      hours_per_ruler: 6, // 时间轴时间变换24-12-6
      start_timestamp: new Date().getTime() - 12*60*60*1000,
      distance_between_gtitle: 80,
      zoom: 6, // 时间轴时间变换24-12-6
      g_isMousedown: false,
      g_isMousemove: false, 
      g_mousedownCursor: null,
      returnTime: null,
      isNewSession: false,
      timecell: new Array
    }
  },
  props: {
    videoRef: {
      type: Object,
      required: false,
    },
    greenDateList: {
      type: Array,
      required: true,
    },
    timestampInit: {
      type: Object,
      required: true
    },
    timestamp: {
      type: Number,
      required: true
    },
    widthAxis: {
      type: Number,
      required: true
    },
    isSwitching: {
      type: Boolean,
      required: true
    },
    isBackRun: {
      type: Boolean,
      required: true,
      default: false,
    },
    isDraggable: {
      type: Boolean,
      required: true,
    }
  },
  watch:{
      greenDateList: {
        handler(n, o) {
          if (n) {
            this.updateTimeLine()
          }
        },
        deep: true,
        immediate: true,
      },
      timestampInit:{
          handler(n,o){
              this.startTime(this.timestampInit.start_timestamp)
          },
          deep:true,
          immediate:true,
      },
      timestamp:{
          handler(n,o){
              this.updateTime(this.timestamp)
              // console.log('[timeline] update time', moment(this.timestamp).format('YYYY-MM-DD HH:mm:ss'));
          },
          deep:true,
          immediate:true,
      },
      widthAxis:{
          handler(n,o){
              var curTime = this.start_timestamp + (this.hours_per_ruler * 60 * 60 * 1000)/2
              this.hours_per_ruler = n
              this.zoom = n
              this.mousemoveFunc()
              this.renderDom()
              this.set_time_to_middle(curTime)
          },
          deep:true,
          immediate:true,
      }
  },
  mounted() {
    this.renderDom()
  },
  methods: {
    renderDom() {
      this.canvas = document.getElementById('timeline');

      if (document.body.clientWidth < 1320) {
        this.canvas.style.width = '800px'
      } else {
        this.canvas.style.width = (document.body.clientWidth - 534) + 'px'
      }

      window.onresize = () => {
        return (() => {
          if (document.body.clientWidth < 1320) {
            this.canvas.style.width = '800px'
          } else {
            this.canvas.style.width = (document.body.clientWidth - 534) + 'px'
          }
        })()
      }
      this.timecell = []
      for (let i = 0; i < this.greenDateList.length; i++) {
        this.timecell.push({
          "beginTime": new Date(this.greenDateList[i].start).getTime(),
          "endTime": new Date(this.greenDateList[i].end).getTime(),
          "style": {
            "background":"rgba(132, 244, 180, 1)"
          }
        })
      }

      this.canvas = document.getElementById("timeline")
      this.ctx = this.canvas.getContext("2d");
      this.canvasW = this.canvas.width;
      this.canvasH = this.canvas.height;
      this.init()
    },
    updateTimeLine() { 
      this.renderDom()
      this.isNewSession = true
    },
    init: function() {
      this.drawCellBg();
      this.drawLine(0, this.canvasH, this.canvasW, this.canvasH, "rgb(151, 158, 167)", 1); 
      this.add_events()
      this.add_cells(this.timecell)
      
      let time = this.start_timestamp + (this.hours_per_ruler*3600*1000)/2;
      if (this.ctx) {
        this.ctx.fillStyle = "#ffffff";
        this.ctx.font = "12px bold 黑体";
        this.ctx.fillText(this.changeTime(time), this.canvasW/2-60, 50); 
      }
      this.add_graduations(this.start_timestamp);
      this.drawLine(this.canvasW/2, 0, this.canvasW/2, 12, "#f78930", 13); 
      this.drawLine(this.canvasW/2, 12, this.canvasW/2, 13, "#f78930", 12); 
      this.drawLine(this.canvasW/2, 13, this.canvasW/2, 14, "#f78930", 11); 
      this.drawLine(this.canvasW/2, 14, this.canvasW/2, 15, "#f78930", 10); 
      this.drawLine(this.canvasW/2, 15, this.canvasW/2, 16, "#f78930", 8);
      this.drawLine(this.canvasW/2, 16, this.canvasW/2, 17, "#f78930", 6); 
      this.drawLine(this.canvasW/2, 17, this.canvasW/2, 18, "#f78930", 4); 
      this.drawLine(this.canvasW/2, 18, this.canvasW/2, 35, "#f78930", 2); 
    },
    add_events: function() {
      if (this.canvas) {
        // this.canvas.addEventListener('mousewheel', this.mousewheelFunc);
        this.canvas.addEventListener('mousedown', this.mousedownFunc);
        // this.canvas.addEventListener('mousemove', this.mousemoveFunc);
        // this.canvas.addEventListener('mouseup', this.mouseupFunc);
        this.canvas.addEventListener('mouseout', this.mouseoutFunc); 
        document.addEventListener("mousemove", this.mousemoveFunc);
        document.addEventListener('mouseup', this.mouseupFunc);
      }
    },
    add_cells: function(cells) {
      cells.forEach(cell => {
        this.draw_cell(cell)
      });
    },
    draw_cell: function(cell) {
      let px_per_ms = this.canvasW / (this.hours_per_ruler * 60 * 60 * 1000); // px/ms
      var beginX = (cell.beginTime - this.start_timestamp) * px_per_ms;
      var cell_width = (cell.endTime - cell.beginTime) * px_per_ms;
      if (this.ctx) {
        this.ctx.fillStyle = cell.style.background;
        this.ctx.fillRect(beginX,0,cell_width,18);
      }
    },
    drawCellBg: function() {
      if (this.ctx) {
        this.ctx.fillStyle = "#a9b0bc";
        this.ctx.fillRect(0, 0, this.canvasW, 18);
      }
    },
    drawLine: function(beginX, beginY, endX, endY, color, width) {
      if (this.ctx) {
        this.ctx.beginPath();
        this.ctx.moveTo(beginX,beginY);
        this.ctx.lineTo(endX,endY);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.stroke();
      }
    },
    ms_to_next_step: function(timestamp, step) {
      let remainder = timestamp % step;
      return remainder ? step - remainder : 0;
    },
    graduation_title: function (datetime) {
      if (this.widthAxis == 0.0166666667) {
        if (moment(datetime).format('HH:mm:ss') === '00:00:00') { 
          return moment(datetime).format('MM.DD.YYYY')
        }
        return moment(datetime).format('HH:mm:ss')
      }
      if (datetime.getHours() == 0 && datetime.getMinutes() == 0 && datetime.getMilliseconds() == 0) {
        return ('0' + datetime.getDate().toString()).substr(-2) + '.' +
              ('0' + (datetime.getMonth() + 1).toString()).substr(-2) + '.' +
              datetime.getFullYear();
      }
        return datetime.getHours() + ':' + ('0' + datetime.getMinutes().toString()).substr(-2);
    },
    add_graduations: function(start_timestamp) {
      let 
        px_per_min = this.canvasW / (this.hours_per_ruler * 60), // px/min
        px_per_ms = this.canvasW / (this.hours_per_ruler * 60 * 60 * 1000), // px/ms
        px_per_step = this.graduation_step,
        min_per_step = px_per_step / px_per_min; // min

      for (let i = 0; i < this.minutes_per_step.length; i++) { 
          if (min_per_step <= this.minutes_per_step[i]) { 
              min_per_step = this.minutes_per_step[i]; 
              px_per_step = px_per_min * min_per_step;
              break
          }
      }

      let medium_step = 30;

      for (let i = 0; i < this.minutes_per_step.length; i++) {
          if (this.distance_between_gtitle / px_per_min <= this.minutes_per_step[i]) {
              medium_step = this.minutes_per_step[i];
              break;
          }
      }

      let 
        num_steps = this.canvasW / px_per_step,
        graduation_left,
        graduation_time,
        caret_class,
        lineH,
        ms_offset = this.ms_to_next_step(start_timestamp,min_per_step*60*1000),
        px_offset = ms_offset * px_per_ms,
        ms_per_step = px_per_step / px_per_ms;

      for (let i = 0; i < num_steps; i++){
        graduation_left = px_offset + i * px_per_step; 
        graduation_time = start_timestamp + ms_offset + i * ms_per_step; 
        let date = new Date(graduation_time);

        if (date.getUTCHours() == 0 && date.getUTCMinutes() == 0) {
          caret_class = 'big';
          lineH = 25;
          let big_date = this.graduation_title(date);
          if (this.ctx) {
            this.ctx.font = "12px bold 黑体";
            this.ctx.fillText(big_date, graduation_left-20, 30);
            this.ctx.fillStyle = "#ffffff";
          }
        } else if (graduation_time / (60 * 1000) % medium_step == 0) {
          caret_class = 'middle';
          lineH = 15;
          let middle_date = this.graduation_title(date);
          if (this.ctx) {
            this.ctx.font = "12px bold 黑体";
            this.ctx.fillText(middle_date, graduation_left-20, 30);
            this.ctx.fillStyle = "#ffffff";
          }
        } else{
          lineH = 10;
          if (this.widthAxis == 0.0166666667) {
            if (this.ctx) {
              this.ctx.font = "12px bold 黑体";
              let _date = this.graduation_title(date);
              this.ctx.fillText(_date, graduation_left - 20, 30);
              this.ctx.fillStyle = "#ffffff";
            }
          }
        }
        this.drawLine(graduation_left,0,graduation_left,lineH,"#ffffff",1);
      }
    },
    get_cursor_x_position: function(e) {
      let posx = 0;

      if (!e) {
        e = window.event;
      }
      
      if (e && (e.pageX || e.pageY)) {
        posx = e.pageX;
      } else if (e && (e.clientX || e.clientY)) {
        posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      }
      
      return posx;
    },
    mousewheelFunc: function() {
      if (event && event.preventDefault){
        event.preventDefault()
      } else {
          window.event.returnValue = false;
          return false;
      }	

      var e = window.event || event;
      var delta = Math.max(-1,Math.min(1,(e.wheelDelta || -e.detail)));
      var middle_time = this.start_timestamp + (this.hours_per_ruler*3600*1000)/2; //ms
      if (delta < 0) {
          this.zoom = this.zoom + 4;
      if (this.zoom >= 24) {
        
          }
          this.hours_per_ruler = this.zoom;
      } else if (delta > 0) {
          this.zoom = this.zoom - 4;
      if (this.zoom <= 1) {
        this.zoom = 0.1;
          }
          this.hours_per_ruler = this.zoom;
      }	

      this.clearCanvas();
      this.start_timestamp = middle_time - (this.hours_per_ruler*3600*1000)/2; 
      this.init()
    },
    mousedownFunc: function(e) {
      if (!this.isDraggable) {
        return
      }
      if (!this.isSwitching) {
        this.$emit('refChangeFlag',true)
        this.g_isMousedown = true;
        this.g_mousedownCursor = this.get_cursor_x_position(e);
      }
    },
    mousemoveFunc: function (e) {
      if (!this.g_isMousedown) {
        return
      }
      let pos_x = this.get_cursor_x_position(e)
      let px_per_ms = this.canvasW / (this.hours_per_ruler * 60 * 60 * 1000); // px/ms
      this.clearCanvas();
      if (this.g_isMousedown) {
          let diff_x = pos_x - this.g_mousedownCursor;
          this.start_timestamp = this.start_timestamp - Math.round(diff_x / px_per_ms);
          this.init();
          this.g_isMousemove = true;
          this.g_mousedownCursor = pos_x;
      } else {
          let time = this.start_timestamp + pos_x/px_per_ms;
          this.init();
          // this.drawLine(pos_x,0,pos_x,50,"rgb(194, 202, 215)",1);
          if (this.ctx) {
            this.ctx.fillStyle = "#ffffff";
            this.ctx.font = "12px bold 黑体";
          }
          // this.ctx.fillText(this.changeTime(time),pos_x-50,60);
      }
    },
    mouseupFunc: function(e) {
      if (this.g_isMousemove) { 
        this.returnTime = this.start_timestamp + (this.hours_per_ruler * 3600 * 1000) / 2;
        console.log('[timeline] 切换时间', moment(this.returnTime).format('YYYY-MM-DD HH:mm:ss'));
        this.$emit('refSwitchTime',this.changeTime(this.returnTime))
        //this.set_time_to_middle(new Date(this.returnTime).getTime());
      }
      this.g_isMousemove = false;
      this.g_isMousedown = false;
      this.$emit('refChangeFlag',false)
    },
    mouseoutFunc: function (e) {
      return
    },
    
    clearCanvas: function() {
      if (this.ctx) {
        this.ctx.clearRect(0,0,1500,150);
      }
    },
    changeTime: function(time) {
      let newTime = new Date(time),
          year = newTime.getFullYear(),
          month = (newTime.getMonth() + 1) < 10 ? '0' + (newTime.getMonth() + 1) : (newTime.getMonth() + 1),
          date = newTime.getDate() < 10 ? '0' + newTime.getDate() : newTime.getDate(),
          hour = newTime.getHours() < 10 ? '0' + newTime.getHours() : newTime.getHours(),
          minute = newTime.getMinutes() < 10 ? '0' + newTime.getMinutes() : newTime.getMinutes(),
          second = newTime.getSeconds() < 10 ? '0' + newTime.getSeconds() : newTime.getSeconds();

      return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
    },
    set_time_to_middle: function(time) {
      this.clearCanvas();
      this.start_timestamp = time - (this.hours_per_ruler * 60 * 60 * 1000)/2;
      this.init()
    },
    startTime: function(timestamp) {
      console.log("startTime:", this.changeTime(timestamp),'++++++')
      let self = this
      self.set_time_to_middle(new Date(timestamp).getTime());
    },
    updateTime: function(timestamp) {      
      var cts = new Date(timestamp).getTime() - (this.hours_per_ruler * 60 * 60 * 1000)/2;
      // console.log('+', "updateTime:", this.changeTime(timestamp), this.isNewSession)

      if (!this.isNewSession) {
        if (((cts - this.start_timestamp > 1500000 || cts - this.start_timestamp < 0) && !this.isBackRun) || ((cts - this.start_timestamp < -1500000 || cts - this.start_timestamp > 0) && this.isBackRun)) {
          // if (this.greenDateList.some(item=>(this.returnTime >= item.start && this.returnTime <= item.end))) {
          //   return; 
          // } else {
          //   this.isNewSession = false
          // }
          console.log("drop timestamp", moment(timestamp).format('YYYY-MM-DD HH:mm:ss'))
          return
        }
      } else {
        this.isNewSession = false
      }
      // this.isNewSession = false
      
      let self = this
      // let timeMoving = setInterval(function(){
        self.set_time_to_middle(new Date(timestamp).getTime());
      // },100)
    }
  }
});
</script>


<style scoped lang="less">
.timeline-container {
  margin: 0;
  padding: 0;
}
.timeline-canvas {
  cursor: pointer;
  background: #092F55;
}
</style>
