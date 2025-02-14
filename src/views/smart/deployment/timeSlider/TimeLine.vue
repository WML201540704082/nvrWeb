<template>
   <div class="TimeLine">
      <!-- <el-tooltip :disabled="!showLeft" :offset="offsetLeft" :content="contentLeft" placement="top" >
        <el-tooltip :disabled="!showRight" :offset="offsetRight"  :content="contentRight" placement="top" >
        </el-tooltip>
      </el-tooltip> -->
      <span  onselectstart="return false" v-show="showLeft" class="tooltip" :style="{'left': offsetLeft +'px' }">{{contentLeft}}</span>
      <span onselectstart="return false" v-show="showRight" class="tooltip" :style="{'left': offsetRight + 'px'}">{{contentRight}}</span>
      <canvas v-if="canvasShow" :id="ID+'_Bg'" class="scene1bg" :width="canvasW" height="12" @mousedown="onDown" @mouseup="onUp" @mouseleave="onLeave" @mousemove="onMove"></canvas>
      <canvas :id="ID+'_Line'" class="scene1Line" :width="canvasW" height="6"></canvas>
   </div>
</template>
<script>
export default {
  name: 'TimeLine',
  props: {
    ID: {
      type: String,
      required: true,
    },
    Color: {
      type: String,
      required: true,
    },
    timeArr1: {
      type: Array,
      required: false,
    },
  },
  data(){
    return {
        canvasDom: null,
        canvasCtx: null,
        canvasDomX: 0,
        canvasDomY: 0,
        canvasW: 835,
        StartX: 0,
        DownFlag: false,
        DrawFlag: false,
        MoveFlag: false,
        ScaleFlag: false,
        ScaleRight: false,
        moveItem: null,
        leaveX: 0,
        DrawArr: [],
        drawColor: this.Color,
        showLeft: false,
        showRight: false,
        offsetLeft: 0,
        offsetRight: 0,
        contentLeft: '',
        contentRight: '',
        canvasShow: true,
        selectColor: '#217EBD'
    }
  },
  created() {
    this.canvasW = document.body.clientWidth / 2.3
  },
  mounted() {
    this.canvasDom = document.getElementById(this.ID+"_Bg");
    this.canvasCtx = this.canvasDom.getContext("2d")
    this.canvasDomX = this.canvasW
    this.canvasDomY = 12
    this.canvasDom.style.cursor="default"
    this.drawLine()
    this.initData()
  },
  methods: {
    // 取消选中
    onCancleSelect(){
      this.DrawArr.map((item)=>{
        delete item.S
      })
      this.drawSaveRect()
    },
    // 绘制默认值
    initData(data){
      let arr1 = JSON.parse(JSON.stringify(this.timeArr1))
      if(data) {
          arr1 = JSON.parse(JSON.stringify(data));
      }
      this.clearCanvas()
      let arr= []
      if(arr1.length) {
        arr1.forEach(item => {
          let x0 = this.timeToPx(item.start)
          let x1 = this.timeToPx(item.end)
          let w = x1-x0;
          arr.push({
            X: x0,
            W: w,
          })
        })
      }
      this.DrawArr = arr;
      this.drawSaveRect()
    },
    drawLine(){
      let canvasCtx2 = document.getElementById(this.ID+"_Line").getContext("2d")
      let Num = this.canvasDomX/24
      canvasCtx2.beginPath();
      canvasCtx2.strokeStyle="#999"
      canvasCtx2.lineWidth=1;
      for(let i=0; i<=24;i++){
        if(i==0 || i%2==0) {
          canvasCtx2.moveTo(i*Num,0)
          canvasCtx2.lineTo(i*Num,6)
        } else{
          canvasCtx2.moveTo(i*Num,0)
          canvasCtx2.lineTo(i*Num,3)
        }
      }
      canvasCtx2.closePath();
      canvasCtx2.stroke();
      
    },
    onDown(e){
      // 鼠标点击的时候判断是否在已绘制的图形上
      this.$emit('cancelSelect')
      let Index = this.DrawArr.findIndex(item =>{
        return e.offsetX>=item.X && e.offsetX<=item.X+item.W;
      })
      this.DownFlag = true
      this.StartX = e.offsetX
      if(Index>-1){
        // 移动 物体
        this.MoveFlag = true
        this.moveItem = this.DrawArr[Index]
        this.moveItem.S = true // 选中
        this.DrawArr.splice(Index, 1)
        this.clearCanvas()
        this.drawSaveRect()
        this.canvasCtx.beginPath();
        this.canvasCtx.rect(this.moveItem.X,0,this.moveItem.W,this.canvasDomY);
        this.canvasCtx.fillStyle = this.selectColor || this.drawColor;//默认strokeStyle='black', lineWidth=1, 此处可省略
        this.canvasCtx.closePath();
        this.canvasCtx.fill();

        // 如果鼠标处于右侧边，则为缩放
        if(this.moveItem.X + this.moveItem.W - e.offsetX <= 3){
          this.ScaleFlag = true
          this.ScaleRight = true
        }
        // 如果鼠标处于左侧边，则为缩放
        if(e.offsetX - this.moveItem.X <= 3){
          this.ScaleFlag = true
          this.ScaleRight = false
        }
      }
    },
    onUp(e){
      // 新增绘制
      if(this.DrawFlag && !this.MoveFlag) {
        let x0 = this.StartX>e.offsetX ? e.offsetX : this.StartX;
        let w0 = Math.abs(this.StartX-e.offsetX);
        this.DrawArr.push({
          X: x0,
          W: w0,
          S: true
        })
        this.DrawFlag = false
      }
      //移动
      if(this.MoveFlag && !this.DrawFlag) {
        // 改变大小
        if(this.ScaleFlag) {
          // 右边
          if(this.ScaleRight) {
            let x0 =  this.moveItem.X >= e.offsetX ? 0:this.moveItem.X// 右移：左移
            let w0 = this.moveItem.X >= e.offsetX ? 0:e.offsetX - x0
            if(w0) {
              this.DrawArr.push({
                X: x0,
                W: w0,
                S: true
              })
            }
          } else {
            // 左边
            let x0 = e.offsetX >= this.moveItem.X + this.moveItem.W? 0: e.offsetX// 右移：左移
            let w0 = e.offsetX >= this.moveItem.X + this.moveItem.W ? 0: this.moveItem.X + this.moveItem.W- x0
            if(w0) {
              this.DrawArr.push({
                X: x0,
                W: w0,
                S: true
              })
            }
          }
          

        } else{
          let leftNum = this.moveItem.X - ( this.StartX - e.offsetX) <=0 ? 0 : this.moveItem.X - ( this.StartX - e.offsetX);
          let rightNum = this.moveItem.X + (e.offsetX - this.StartX) >= this.canvasDomX-this.moveItem.W? this.canvasDomX-this.moveItem.W : this.moveItem.X + (e.offsetX - this.StartX);
          let x0 = e.offsetX - this.StartX>0 ? rightNum: leftNum // 右移：左移
          let w0 = this.moveItem.W
          this.DrawArr.push({
            X: x0,
            W: w0,
            S: true
          })
        }
        this.ScaleFlag = false
        this.ScaleRight = false
        this.MoveFlag = false
        this.moveItem = null
      
      }
      this.DrawArr = this.mergeData(this.DrawArr)
      //格式化数据
      let arrEmit = []
      if(this.DrawArr.length) {
        this.DrawArr.forEach(item=>{
          arrEmit.push({
            start: this.pxToTime(item.X),
            end: this.pxToTime(item.X+ item.W),
            S: item.S
          })
        })
      }
      this.$emit('updataData', this.ID, arrEmit )
      // 重绘
      this.drawSaveRect()
      this.DownFlag = false
      this.StartX = 0
      this.showLeft = false
      this.showRight = false
    },
    onLeave(e){
      
      if(this.DownFlag && (e.offsetY<0 || e.offsetY>=11)){
         this.onUp(e)
      }
      if((e.offsetY<0 || e.offsetY>=11)) {
        this.showLeft = false
        this.showRight = false
      }
    },
    onMove(e){
      if(!this.DownFlag) {
        // 鼠标点击的时候判断是否在已绘制的图形上
        let Index = this.DrawArr.findIndex(item =>{
          return e.offsetX>=item.X && e.offsetX<=item.X+item.W;
        })
        if(Index>-1){
          this.canvasDom.style.cursor="pointer"
          // 如果鼠标处于左右侧边，则为缩放
          if((this.DrawArr[Index].X + this.DrawArr[Index].W - e.offsetX <= 3) || (e.offsetX - this.DrawArr[Index].X <= 3)){
            this.canvasDom.style.cursor="e-resize"
          }else {
            this.offsetLeft = this.DrawArr[Index].X;
            this.offsetRight = this.DrawArr[Index].X + this.DrawArr[Index].W;
            this.contentLeft = this.pxToTime(this.offsetLeft)
            this.contentRight = this.pxToTime(this.offsetRight)
            this.showLeft = true
            this.showRight = true
       
          }
        } else {
          this.canvasDom.style.cursor="default"
          this.showLeft = false
          this.showRight = false
        }
      }
      if(this.DownFlag) {
        //移动
        if(this.MoveFlag) {
          // 改变大小
          if(this.ScaleFlag) {
            // 右边
          if(this.ScaleRight) {
            let x0,y0=0,w0,h0=this.canvasDomY;
              x0 =  this.moveItem.X >= e.offsetX ? 0:this.moveItem.X// 右移：左移
              w0 = this.moveItem.X >= e.offsetX ? 0:e.offsetX - x0
            this.clearCanvas()
            this.drawSaveRect()
            this.canvasCtx.beginPath();
            this.canvasCtx.rect(x0,y0,w0,h0);
            this.canvasCtx.fillStyle = this.selectColor || this.drawColor;//默认strokeStyle='black', lineWidth=1, 此处可省略
            this.canvasCtx.closePath();
            this.canvasCtx.fill();
            this.showTooltip(x0, w0)
          } else {
            let x0,y0=0,w0,h0=this.canvasDomY;
              x0 = e.offsetX >= this.moveItem.X + this.moveItem.W? 0: e.offsetX// 右移：左移
              w0 = e.offsetX >= this.moveItem.X + this.moveItem.W ? 0: this.moveItem.X + this.moveItem.W- x0
            this.clearCanvas()
            this.drawSaveRect()
            this.canvasCtx.beginPath();
            this.canvasCtx.rect(x0,y0,w0,h0);
            this.canvasCtx.fillStyle = this.selectColor || this.drawColor;//默认strokeStyle='black', lineWidth=1, 此处可省略
            this.canvasCtx.closePath();
            this.canvasCtx.fill();

            this.showTooltip(x0, w0)
          }
            
          } else {
            let x0,y0=0,w0,h0=this.canvasDomY;
            let leftNum = this.moveItem.X - ( this.StartX - e.offsetX) <=0 ? 0 : this.moveItem.X - ( this.StartX - e.offsetX);
            let rightNum = this.moveItem.X + (e.offsetX - this.StartX) >= this.canvasDomX-this.moveItem.W? this.canvasDomX-this.moveItem.W : this.moveItem.X + (e.offsetX - this.StartX);
              x0 = e.offsetX - this.StartX>0 ? rightNum: leftNum // 右移：左移
              w0 = this.moveItem.W
           
            this.clearCanvas()
            this.drawSaveRect()
            this.canvasCtx.beginPath();
            this.canvasCtx.rect(x0,y0,w0,h0);
            this.canvasCtx.fillStyle = this.selectColor || this.drawColor;//默认strokeStyle='black', lineWidth=1, 此处可省略
            this.canvasCtx.closePath();
            this.canvasCtx.fill();
            this.showTooltip(x0, w0)
          }
            
         
        } else {
          // 新增
          if(Math.abs(e.offsetX - this.StartX) > 3) {
            // 摁下鼠标并移动3像素
            this.DrawFlag=true
          }
          if(this.DrawFlag){
            let x0,y0=0,w0,h0=this.canvasDomY;
              x0 = e.offsetX - this.StartX>0 ? this.StartX:e.offsetX
              w0 = Math.abs(e.offsetX - this.StartX)
            this.clearCanvas()
            this.drawSaveRect()
            this.canvasCtx.beginPath();
            this.canvasCtx.rect(x0,y0,w0,h0);
            this.canvasCtx.fillStyle = this.selectColor || this.drawColor;//默认strokeStyle='black', lineWidth=1, 此处可省略
            this.canvasCtx.closePath();
            this.canvasCtx.fill();
          }
        }
        
      }
     
    },
    // 合并数据
    mergeData(data){
        let intervals = [];
        data.forEach((item) => {
          intervals.push([item.X,item.X+item.W])
        })
        let res = [];
        let resN = []
        let len = intervals.length;
        if (len == 0) return [];
        intervals.sort((a, b) => a[0] - b[0]);
        for(let i = 0;i < len;i++){
            let left = intervals[i][0];
            let right = intervals[i][1];
            while (i < len - 1 && right >= intervals[i + 1][0]) {
                i++;
                right = Math.max(right, intervals[i][1]);
            }
            res.push([left, right]);
        }
        res.forEach(item => {
          resN.push({
            X: item[0],
            W: item[1] - item[0]
          })
        })
        return data.length == resN.length ? data : resN;
      },
    // 绘制已经存储的矩形
    drawSaveRect(data){
      if(data) {
          data.forEach(item => {
          this.canvasCtx.beginPath();
          this.canvasCtx.rect(item.X,0,item.W,this.canvasDomY);
          this.canvasCtx.fillStyle = this.drawColor;//默认strokeStyle='black', lineWidth=1, 此处可省略
          this.canvasCtx.closePath();
          this.canvasCtx.fill();
        })
      } else {
        this.DrawArr.forEach(item => {
          this.canvasCtx.beginPath();
          this.canvasCtx.rect(item.X,0,item.W,this.canvasDomY);
          this.canvasCtx.fillStyle = item.S ? this.selectColor : this.drawColor;//默认strokeStyle='black', lineWidth=1, 此处可省略
          this.canvasCtx.closePath();
          this.canvasCtx.fill();
        })
      }
    },
    // 清除画布
    clearCanvas(){
        this.canvasCtx.clearRect(0,0, this.canvasDomX, this.canvasDomY)
        this.canvasCtx.beginPath();
        this.canvasCtx.rect(0,0, this.canvasDomX, this.canvasDomY);
        this.canvasCtx.fillStyle = '#e2eaf4';//默认strokeStyle='black', lineWidth=1, 此处可省略
        this.canvasCtx.closePath();
        this.canvasCtx.fill();
    },
    // 时间转像素
    showTooltip(x0,w0){
      this.offsetLeft =  x0;
      this.offsetRight = x0 + w0;
      this.contentLeft = this.pxToTime(this.offsetLeft)
      this.contentRight = this.pxToTime(this.offsetRight)
      this.showLeft = true
      this.showRight = w0 <60 ? false:true
     
    },
    // 时间转像素
    timeToPx(during){
      let arr= during.split(':')
      let num = arr[0]*60*60 + arr[1]*60 + arr[2]
      return num / 10000 / (864 / this.canvasW)
    },
    //该方法用于给日期、时间补零
    addZero(num){
        if (parseInt(num) < 10) {
            num = "0" + num
        }
        return num
    },
    // 像素转时间
    pxToTime(during){
      if(during == this.canvasW) {
        return "23:59:59"
      }
      // during = during * 100 *  (864 / this.canvasW)
      // let s = Math.floor(during / 1) % 60;
      // during = Math.floor(during / 60);
      // let i = during % 60;
      // during = Math.floor(during / 60);
      // let h = during % 24;
      // return  this.addZero(h) + ':' + this.addZero(i) + ':' + this.addZero(s) ;
      let minPx = 0.6; //1min占0.6，不论什么屏幕
      during = during.toFixed(5) * (864 / this.canvasW)
      if(String(during).includes('.9999')) {
        during = Math.ceil(during)
      }
      let s = Number(String(during.toFixed(4)).slice(-2)) % 60;
      console.log('during',during,during / minPx,during / minPx%60,during / minPx/60);
      let m = Math.floor(during / minPx % 60)
      let h = Math.floor(during / minPx / 60)
      return  this.addZero(h) + ':' + this.addZero(m) + ':' + this.addZero(s) ;
    }
  }
}
</script>
<style scoped>
.TimeLine{
  width: calc(100vw / 2.3 - 72px);
  height: 18px;
  position: relative;
}
.scene1bg{
  position: absolute;
  top: 0;
  left: 36px;
}
.scene1Line{
  position: absolute;
  top: 12px;
  left: 36px;
}
.tooltip{
  background: #000;
  color: #FFF;
  position: absolute;
  top: -20px;
  z-index: 9;
}
</style>
