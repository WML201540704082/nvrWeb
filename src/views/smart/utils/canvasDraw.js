import { deepCloneData, isInsidePolygon, isOnRoundCapHpp, initShieldData, proprietaryUniqueSmileArray } from './tool'

/**
 * canvas构造函数
 */
function Draw(opt) {
  const { canvas, button, callBack } = opt
  
  this.default = {
    canvas,
    isDrawFace: true,
    button: {
      drawArea: button.drawArea, //绘制区域按钮
      drawArea1: button.drawArea1, //屏幕
      drawArea2: button.drawArea2, //键盘
      drawArea3: button.drawArea3, //超级柜台
      clearArea: button.clearArea, //清空区域按钮
      // addShield: button.addShield, //添加屏蔽按钮
      // clearShield: button.clearShield, //清空屏蔽按钮
      clearAll: button.clearAll, //清空全部按钮
    },
    isDrawText: false,
    color: {
      faceBorderColor: "#ff0000", //人脸框颜色
      faceCircleFillColor: "#ff0000", //人脸框端点圆颜色
      allTextColor: "#00ffc6",
      monitorLineColor: "#008000",
      screenLineColor: "#3A74FF",
      keyboardLineColor: "#ffdf3a",
      stmLineColor: "#b53b0a",
      monitorAreaColor: "rgba(32,247,37,0.5)",
      screenAreaColor: "rgb(28 167 211 / 50%)",
      keyboardAreaColor: "rgb(240 243 103 / 50%)",
      stmAreaColor: "rgb(181 59 10 / 50%)",
    },
    size: {
      lineWidth: 1, //线宽
    },
    callBack: function() {},
  }
  this.options = deepCloneData(this.default, opt)

  this.targetDom = document.getElementById(canvas); //canvas块
  this.drawArea = document.getElementById(button.drawArea); //绘制监控区域按钮
  this.drawArea1 = document.getElementById(button.drawArea1); //屏幕
  this.drawArea2 = document.getElementById(button.drawArea2); //键盘
  this.drawArea3 = document.getElementById(button.drawArea3); //超级柜台
  // this.addShield = document.getElementById(button.addShield); //添加屏蔽区域按钮
  this.clearAll = document.getElementById(button.clearAll); //添加全部清空按钮

  this.ctx = this.targetDom.getContext("2d")
}
Draw.prototype = {
  _vm: null,
  captrueArea: null, //抓拍区域
  screenArea: null, //屏幕区域
  keyboardArea: null, //键盘区域
  stmArea: null, //超级柜台
  isStartDrawRec: false, //判断是否正在绘制监控区域
  isStartScreenRec: false, //判断是否开始绘制屏幕
  isStartKeyboardRec: false, //判断是否开始绘制键盘
  isStartStmRec: false, //判断是否开始绘制超级柜台区域
  isBeginRec: false, //判断是否开始绘制区域
  targetObj: {
    capturearea: [],
    screenarea: [],
    keyboardarea: [],
    stmarea: [],
    captureAreaText: { posi: { x: 0, y: 0 }, text: "抓拍区域" },
  },
  init: function(params, vm) {
    this._vm = vm;     //把vue实例传进来
    this.captrueArea = this._vm.$t("taskmgr.captureArea"); // 捕获区
    this.screenArea = this._vm.$t("taskmgr.screenArea"); // 屏幕区
    this.keyboardArea = this._vm.$t("taskmgr.keyboardArea"); // 屏幕区
    this.stmArea = this._vm.$t("taskmgr.stmArea"); // 超级柜台区
    this.ctx.clearRect(0, 0, this.targetDom.getAttribute("width"), this.targetDom.getAttribute("height")); //先清空canvas

    this.initData(params);  //初始化数据
    this.initDraw();        //开始绘制--处理鼠标事件(拖动等)
    this.drawRec();         //绘制识别区域
    this.screenRec();       //绘制屏幕区域
    this.keyboardRec();     //绘制键盘区域
    this.stmRec();      //绘制超级柜台区域
    this.clickBind();       //绑定单击事件
    this.dbCLickBind();     //绑定双击事件
    // this.mouseleaveEvent(); //鼠标离开事件
    this.clearAllArea();    //清空所有区域
  },
  
  // 初始化数据
  initData: function(params) {
    this.targetObj = {
      capturearea: [],
      screenarea: [],
      keyboardarea: [],
      captureAreaText: {
        posi: { x: 0, y: 0 },
        text: this.captrueArea,
      },
      screenAreaText: {
        posi: { x: 0, y: 0 },
        text: this.screenArea,
      },
      keyboardAreaText: {
        posi: { x: 0, y: 0 },
        text: this.keyboardArea,
      },
      stmAreaText: {
        posi: { x: 0, y: 0 },
        text: this.stmArea,
      },
    }
    this.targetObj.capturearea = params.roi ?? []
    this.targetObj.screenarea = params.screen ?? []
    this.targetObj.keyboardarea = params.keyboard ?? []
    this.targetObj.stmarea = params.stm ?? []
    this.repeatDraw() // 开始绘制
  },
  // 初始化--处理鼠标事件
  initDraw: function() {
    this.dealPolygon([
      { data: this.targetObj.capturearea, name: this.captrueArea },
      { data: this.targetObj.screenarea, name: this.screenArea },
      { data: this.targetObj.keyboardarea, name: this.keyboardArea },
      { data: this.targetObj.stmarea, name: this.stmarea },
    ])
  },
  // 初始化--绘制监控区域
  drawRec: function() {
    try {
      var self = this;
      self.drawArea.onclick = function(e) {
        var e = e || window.event;
        e.stopPropagation()
        e.preventDefault()
        self.isStartDrawRec = true
        self.isStartScreenRec = false
        self.isStartKeyboardRec = false
        self.isStartStmRec = false
        self.isBeginRec = true
      };
    } catch {
      //   console.log("此场景暂无绘制监控区域功能!");
    }
  },
  // 初始化--绘制屏幕区域
  screenRec: function() {
    try {
      var self = this;
      self.drawArea1.onclick = function(e) {
        var e = e || window.event;
        e.stopPropagation()
        e.preventDefault()
        self.isStartDrawRec = false
        self.isStartScreenRec = true
        self.isStartKeyboardRec = false
        self.isStartStmRec = false
        self.isBeginRec = true
      };
    } catch {
      //   console.log("此场景暂无绘制监控区域功能!");
    }
  },
  // 初始化--绘制键盘区域
  keyboardRec: function() {
    try {
      var self = this;
      self.drawArea2.onclick = function(e) {
        var e = e || window.event;
        e.stopPropagation()
        e.preventDefault()
        self.isStartDrawRec = false
        self.isStartScreenRec = false
        self.isStartKeyboardRec = true
        self.isStartStmRec = false
        self.isBeginRec = true
      };
    } catch {
      //   console.log("此场景暂无绘制监控区域功能!");
    }
  },
  // 初始化--超级柜台区域
  stmRec: function() {
    try {
      var self = this;
      self.drawArea3.onclick = function(e) {
        var e = e || window.event;
        e.stopPropagation()
        e.preventDefault()
        self.isStartDrawRec = false
        self.isStartScreenRec = false
        self.isStartKeyboardRec = false
        self.isStartStmRec = true
        self.isBeginRec = true
      };
    } catch {
      //   console.log("此场景暂无绘制监控区域功能!");
    }
  },
  // 初始化--清空所有区域
  clearAllArea: function() {
    try {
      var self = this
      var _option = self.options
      self.clearAll.onclick = function() {
        self.targetObj.capturearea = []
        self.targetObj.screenarea = []
        self.targetObj.keyboardarea = []
        self.targetObj.stmarea = []
        self.repeatDraw()
        self.initDraw()
        typeof (_option.callBack === "function") && _option.callBack.call(self, self.targetObj)
      }
    } catch {
      console.warning("此场景暂无清空所有区域功能!");
    }
  },
  // 初始化--绑定单击事件
  clickBind: function() {
    var self = this
    self.targetDom.onclick = function(e) {
      var e = e || window.event
      if (!!self.isStartDrawRec) {
        if (!!self.isBeginRec) {
          self.targetObj.capturearea.push([{ x: e.offsetX, y: e.offsetY }])
          self.isBeginRec = false
        } else {
          self.targetObj.capturearea[(self.targetObj.capturearea.length)-1].push({ x: e.offsetX, y: e.offsetY })
        }
        self.repeatDraw()
        self.dragDraw()
      } else if (!!self.isStartScreenRec) {
        if (!!self.isBeginRec) {
          self.targetObj.screenarea.push([{ x: e.offsetX, y: e.offsetY }])
          self.isBeginRec = false
        } else {
          self.targetObj.screenarea[(self.targetObj.screenarea.length)-1].push({ x: e.offsetX, y: e.offsetY })
        }
        self.repeatDraw()
        self.dragDraw()
      } else if (!!self.isStartKeyboardRec) {
        if (!!self.isBeginRec) {
          self.targetObj.keyboardarea.push([{ x: e.offsetX, y: e.offsetY }])
          self.isBeginRec = false
        } else {
          self.targetObj.keyboardarea[(self.targetObj.keyboardarea.length)-1].push({ x: e.offsetX, y: e.offsetY })
        }
        self.repeatDraw()
        self.dragDraw()
      } else if (!!self.isStartStmRec) {
        if (!!self.isBeginRec) {
          self.targetObj.stmarea.push([{ x: e.offsetX, y: e.offsetY }])
          self.isBeginRec = false
        } else {
          self.targetObj.stmarea[(self.targetObj.stmarea.length)-1].push({ x: e.offsetX, y: e.offsetY })
        }
        self.repeatDraw()
        self.dragDraw()
      }
    }
  },
  // 初始化--绑定双击事件
  dbCLickBind: function() {
    var self = this;
    self.targetDom.ondblclick = function(e) {
      var e = e || window.event;
      e.stopPropagation();
      e.preventDefault();
      // 去除数组中相近的点
      self.targetObj.capturearea = proprietaryUniqueSmileArray(
        self.targetObj.capturearea
      );
      self.targetObj.screenarea = proprietaryUniqueSmileArray(
        self.targetObj.screenarea
      );
      self.targetObj.keyboardarea = proprietaryUniqueSmileArray(
        self.targetObj.keyboardarea
      );
      self.targetObj.stmarea = proprietaryUniqueSmileArray(
        self.targetObj.stmarea
      );
      self.repeatDraw(); //双击之后重绘
      self.isBeginRec = true
      self.initDraw();
    };
  },
  // 初始化--绑定移动事件
  // mouseleaveEvent: function() {
  //   var self = this;
  //   var _option = self.options;
  //   this.targetDom.onmouseleave = function() {
  //     if (!self.isStartDrawRec || !self.isStartScreenRec || !self.isStartKeyboardRec) {
  //       self.targetDom.onmousemove = null;
  //       typeof (_option.callBack === "function") && _option.callBack.call(self, self.targetObj)
  //     }
  //   };
  // },

  // ------------通用------------------重新绘制
  repeatDraw: function() {
    /**************************************************************************注意：绘制各个图层的顺序***********************/
    this.ctx.clearRect(0, 0, this.targetDom.getAttribute("width"), this.targetDom.getAttribute("height")); //先清空canvas
    this.drawMonitoringArea(this.targetObj.capturearea) //绘制监控区域
    this.screenMonitoringArea(this.targetObj.screenarea) //绘制屏幕区域
    this.keyboardMonitoringArea(this.targetObj.keyboardarea) //绘制键盘区域
    this.stmMonitoringArea(this.targetObj.stmarea) //绘制超级柜台区域
  },
  // 重绘--绘制监控区域
  drawMonitoringArea: function(param) {
    for (let t = 0; t < param.length; t++) {
      if (param[t].length < 1) return
      var { size, color } = this.options
      // this.targetObj.captureAreaText.posi = { x: param[t][0].x, y: param[t][0].y } // ????????
      this.ctx.beginPath()
      if (param[t].length) {
        for (var i = 0; i < param[t].length; i++) {
          if (i == 0) {
            this.ctx.moveTo(param[t][i].x, param[t][i].y)
          } else {
            this.ctx.lineTo(param[t][i].x, param[t][i].y)
          }
        }
        this.ctx.closePath() // 闭合
        this.ctx.lineWidth = size.lineWidth
        this.ctx.strokeStyle = color.monitorLineColor
        this.ctx.stroke()    // 描边
        this.ctx.fillStyle = color.monitorAreaColor
        this.ctx.fill()      // 填充
        this.drawRoundCap(param[t], color.monitorLineColor)
      } else {
        for (var i = 0; i < param.length; i++) {
          if (i == 0) {
            this.ctx.moveTo(param[i].x, param[i].y)
          } else {
            this.ctx.lineTo(param[i].x, param[i].y)
          }
        }
        this.ctx.closePath() // 闭合
        this.ctx.lineWidth = size.lineWidth
        this.ctx.strokeStyle = color.monitorLineColor
        this.ctx.stroke()    // 描边
        this.ctx.fillStyle = color.monitorAreaColor
        this.ctx.fill()      // 填充
        this.drawRoundCap(param, color.monitorLineColor)
      }
    }
  },
  // 重绘--绘制屏幕区域
  screenMonitoringArea: function(param) {
    for (let t = 0; t < param.length; t++) {
      if (param[t].length < 1) return
      var { size, color } = this.options
      // this.targetObj.captureAreaText.posi = { x: param[t][0].x, y: param[t][0].y } // ????????
      this.ctx.beginPath()
      if (param[t].length) {
        for (var i = 0; i < param[t].length; i++) {
          if (i == 0) {
            this.ctx.moveTo(param[t][i].x, param[t][i].y)
          } else {
            this.ctx.lineTo(param[t][i].x, param[t][i].y)
          }
        }
        this.ctx.closePath() // 闭合
        this.ctx.lineWidth = size.lineWidth
        this.ctx.strokeStyle = color.screenLineColor
        this.ctx.stroke()    // 描边
        this.ctx.fillStyle = color.screenAreaColor
        this.ctx.fill()      // 填充
        this.drawRoundCap(param[t], color.screenLineColor)
      } else {
        for (var i = 0; i < param.length; i++) {
          if (i == 0) {
            this.ctx.moveTo(param[i].x, param[i].y)
          } else {
            this.ctx.lineTo(param[i].x, param[i].y)
          }
        }
        this.ctx.closePath() // 闭合
        this.ctx.lineWidth = size.lineWidth
        this.ctx.strokeStyle = color.screenLineColor
        this.ctx.stroke()    // 描边
        this.ctx.fillStyle = color.screenAreaColor
        this.ctx.fill()      // 填充
        this.drawRoundCap(param, color.screenLineColor)
      }
    }
  },
  // 重绘--绘制键盘区域
  keyboardMonitoringArea: function(param) {
    for (let t = 0; t < param.length; t++) {
      if (param[t].length < 1) return
      var { size, color } = this.options
      // this.targetObj.captureAreaText.posi = { x: param[t][0].x, y: param[t][0].y } // ????????
      this.ctx.beginPath()
      if (param[t].length) {
        for (var i = 0; i < param[t].length; i++) {
          if (i == 0) {
            this.ctx.moveTo(param[t][i].x, param[t][i].y)
          } else {
            this.ctx.lineTo(param[t][i].x, param[t][i].y)
          }
        }
        this.ctx.closePath() // 闭合
        this.ctx.lineWidth = size.lineWidth
        this.ctx.strokeStyle = color.keyboardLineColor
        this.ctx.stroke()    // 描边
        this.ctx.fillStyle = color.keyboardAreaColor
        this.ctx.fill()      // 填充
        this.drawRoundCap(param[t], color.keyboardLineColor)
      } else {
        for (var i = 0; i < param.length; i++) {
          if (i == 0) {
            this.ctx.moveTo(param[i].x, param[i].y)
          } else {
            this.ctx.lineTo(param[i].x, param[i].y)
          }
        }
        this.ctx.closePath() // 闭合
        this.ctx.lineWidth = size.lineWidth
        this.ctx.strokeStyle = color.keyboardLineColor
        this.ctx.stroke()    // 描边
        this.ctx.fillStyle = color.keyboardAreaColor
        this.ctx.fill()      // 填充
        this.drawRoundCap(param, color.keyboardLineColor)
      }
    }
  },
  // 重绘--绘制超级柜台区域
  stmMonitoringArea: function(param) {
    for (let t = 0; t < param.length; t++) {
      if (param[t].length < 1) return
      var { size, color } = this.options
      // this.targetObj.captureAreaText.posi = { x: param[t][0].x, y: param[t][0].y } // ????????
      this.ctx.beginPath()
      if (param[t].length) {
        for (var i = 0; i < param[t].length; i++) {
          if (i == 0) {
            this.ctx.moveTo(param[t][i].x, param[t][i].y)
          } else {
            this.ctx.lineTo(param[t][i].x, param[t][i].y)
          }
        }
        this.ctx.closePath() // 闭合
        this.ctx.lineWidth = size.lineWidth
        this.ctx.strokeStyle = color.stmLineColor
        this.ctx.stroke()    // 描边
        this.ctx.fillStyle = color.stmAreaColor
        this.ctx.fill()      // 填充
        this.drawRoundCap(param[t], color.stmLineColor)
      } else {
        for (var i = 0; i < param.length; i++) {
          if (i == 0) {
            this.ctx.moveTo(param[i].x, param[i].y)
          } else {
            this.ctx.lineTo(param[i].x, param[i].y)
          }
        }
        this.ctx.closePath() // 闭合
        this.ctx.lineWidth = size.lineWidth
        this.ctx.strokeStyle = color.stmLineColor
        this.ctx.stroke()    // 描边
        this.ctx.fillStyle = color.stmAreaColor
        this.ctx.fill()      // 填充
        this.drawRoundCap(param, color.stmLineColor)
      }
    }
  },
  // 重绘--绘制端点圆
  drawRoundCap: function(param, color) {
    this.ctx.fillStyle = color
    for (var i = 0; i < param.length; i++) {
      this.ctx.beginPath()
      this.ctx.arc(param[i].x, param[i].y, 5, 0, 2 * Math.PI)
      this.ctx.closePath()
      this.ctx.fill()
    }
  },
  // 初始化--多边形鼠标事件相关处理
  dealPolygon: function(params) {
    var self = this
    self.targetDom.onmousedown = null
    self.targetDom.onmousedown = function(e) {
      var e = e || window.event
      e.stopPropagation()
      if (!self.isStartDrawRec && !self.isStartScreenRec && !self.isStartKeyboardRec ) {
        for (let i = 0; i < params.length; i++) {
          // if (params[i].name === self.shiledArea) {
          //   self.shiledArrDrage(params[i], e)
          // } else {
            /****************************************************拖动多边形*************************************************/
            var consequence = isInsidePolygon( { x: e.offsetX, y: e.offsetY }, params[i].data, params[i].name )
            // 拖动逻辑处理
            !!consequence.result && self.dragDraw( consequence.name, { x: e.offsetX, y: e.offsetY }, "drage")
            /***************************************************修改多边形尺寸*************************************************/
            var tarPoint = isOnRoundCapHpp( { x: e.offsetX, y: e.offsetY }, params[i].data, params[i].name )
            !!tarPoint.result && self.dragDraw( tarPoint.name, { x: e.offsetX, y: e.offsetY }, "modified", tarPoint.index)
          // }
        }
      }
    };
  },
  // 拖动相关的坐标计算与绘制--三种情况：1.画监控区域，2.拖动监控和屏蔽区域，3.修改监控和屏蔽顶点
  dragDraw: function(name, pt, type, index, i) {
    var self = this,
        tagetCoordinates,     // roi数据
        targetTextCoordinate, // 文字内容
        { callBack } = self.options

    switch (name) {
      case self.captrueArea:
        tagetCoordinates = self.targetObj.capturearea;
        targetTextCoordinate = self.targetObj.captureAreaText;
        break;
      case self.screenArea:
        tagetCoordinates = self.targetObj.screenarea;
        targetTextCoordinate = self.targetObj.screenAreaText;
        break;
      case self.keyboardArea:
        tagetCoordinates = self.targetObj.keyboardarea;
        targetTextCoordinate = self.targetObj.keyboardAreaText;
        break;
      case self.stmArea:
        tagetCoordinates = self.targetObj.stmarea;
        targetTextCoordinate = self.targetObj.stmAreaText;
        break;
    }
    self.targetDom.onmouseup = function() { 
      if (!self.isStartDrawRec || !self.isStartScreenRec || !self.isStartKeyboardRec || !self.isStartStmRec) self.targetDom.onmousemove = null //鼠标抬起即解绑onmouse事件
      typeof (callBack === "function") && callBack.call(self, self.targetObj) //?????? 类似与监听发布
    }
  },
  /**
   * 拖动区域坐标计算
   * @param {Number} ix x方向增量
   * @param {Number} iy y方向增量
   * @param {Number} tc 目标多边形坐标
   * @param {Number} ttc 目标文字坐标
   */
  dragCalc: function(ix, iy, tc, ttc) {
    var canMove = true
    var cw = this.targetDom.getAttribute("width"),
        ch = this.targetDom.getAttribute("height");
    for (var i = 0, l = tc.length; i < l; i++) {
      tc[i].x += ix;
      tc[i].y += iy;
      //碰撞检测
      if(tc[i].x - cw > -1 || tc[i].y - ch > -1 || tc[i].x < 1 || tc[i].y < 1 ) canMove = false
    }
    if (!canMove) {
      for (var i = 0, l = tc.length; i < l; i++) {
        tc[i].x -= ix;
        tc[i].y -= iy;
      }
    }
    this.repeatDraw()
  },
  /**
   * 修改屏蔽区域尺寸
   *  @param {Number} x x方向增量
   *  @param {Number} y y方向增量
   *  @param {Number} tc 屏蔽区域坐标
   *  @param {Number} ttc 屏蔽区域名称相关的数据
   * 	@param {Number} n 代表第n个屏蔽区域
   *  @param {Number} m 代表第n个屏蔽区域 的第m个坐标点
   */
  // 修改抓拍区域尺寸
  mCapturedeal: function(x, y, tc, ttc, m) {
    tc[m].x += x;
    tc[m].y += y;
    this.repeatDraw();
  } 
}
export default Draw
