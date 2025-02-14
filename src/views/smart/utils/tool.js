/*
 * 自定义对象深拷贝方法
 * @param {Object} pt 待拷贝对象
 * @param {Object} pt 要拷贝对象
 */
const deepCloneData = (def, opt) => {
  var obj = def;
  for (var p in opt) {
    if (opt.hasOwnProperty(p) && obj.hasOwnProperty(p)) {
      if (
        Object.prototype.toString.call(opt[p]) === "[object Object]" &&
        Object.prototype.toString.call(obj[p]) === "[object Object]"
      ) {
        deepCloneData(obj[p], opt[p]);
      } else {
        obj[p] = opt[p];
      }
    } else if (opt.hasOwnProperty(p) && !obj.hasOwnProperty(p)) {
      obj[p] = opt[p];
    }
  }
  return obj;
}
// const deepClone(obj) {
//   let target = Array.isArray(obj) ? [] : {} // 判断是数组还是对象
//   for(let i in obj) {
//     if(Object.prototype.hasOwnProperty.call(obj, i)) { // 判断是否是自身属性
//       if(typeof obj[i] === 'object') { // 判断子值类型
//         deepClone(obj[i])
//       } else {
//         target[i] = obj[i]
//       }
//     }
//   }
//   return target
// }
//
/**
 * 去除数组中重复的点
 */
const proprietaryUniqueArrayHpp = (data) => {
  var res = [],
    str = "";
  for (var i = 0, l = data.length; i < l; i++) {
    if (str.indexOf(JSON.stringify(data[i])) === -1) {
      res.push(data[i]);
    }
    str = str + JSON.stringify(data[i]) + ",";
  }
  return res;
}
/**
 * 去除数组中相近的点
 * @param {Object} data
 */
const proprietaryUniqueSmileArray = (data) => {
  console.log(data)
  var res = [], i, j, len = data.length;
  for (i = 0; i < len; i++) {
    var judge = true;
    for (j = 0; j < i; j++) {
      if (
        i !== j &&
        Math.pow(data[i].x - data[j].x, 2) -
          0 +
          (Math.pow(data[i].y - data[j].y, 2) - 0) <=
          25
      ) {
        judge = false;
      }
    }
    if (res.length < 1 || !!judge) {
      res.push(data[i]);
    }
  }
  console.log(res)
  return res;
}
/**
 * 判断一个点是否在多边形里
 * @param {Object} pt 标注点
 * @param {Object} poly 多边形数组
 * @param {String} name 多边形的名字
 */
const isInsidePolygon = (pt, poly, name) => {
  for (var m = 0; m < poly.length; m++) {
    var x1 = Math.pow(pt.x - poly[m].x, 2),
      y1 = Math.pow(pt.y - poly[m].y, 2);
    if (x1 - 0 + (y1 - 0) <= 25) {
      return { result: false, name: name };
    }
  }
  for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
    ((poly[i].x <= pt.x && pt.x < poly[j].x) || (poly[j].x <= pt.x && pt.x < poly[i].x))
    && pt.y < ((poly[j].y - poly[i].y) * (pt.x - poly[i].x)) / (poly[j].x - poly[i].x) + poly[i].y
    && (c = !c)
  return { result: c, name: name }
}
/**
 * 判断一个点是否在多边形的端点上
 */
const isOnRoundCapHpp = (pt, poly, name) => {
  console.log(pt, poly, name)
  for (var m = 0; m < poly.length; m++) {
    var x1 = Math.pow(pt.x - poly[m].x, 2),
      y1 = Math.pow(pt.y - poly[m].y, 2);
    if (x1 - 0 + (y1 - 0) <= 25) {
      return { result: true, name: name, index: m };
    }
  }
  return { result: false, name: name, index: null };
}

// 初始化屏蔽区域数据，因为屏蔽区域数据复杂，所以这里拿出来单独处理
const initShieldData = function(params) {
  for (var i = 0; i < params.length; i++) {
    var obj = {},
        arr = []
    arr.push({ x: params[i].left, y: params[i].top })
    arr.push({ x: params[i].left, y: params[i].bottom })
    arr.push({ x: params[i].right, y: params[i].bottom })
    arr.push({ x: params[i].right, y: params[i].top })
    obj.shieldData = arr;
    obj.shieldText = {
      posi: { x: params[i].left, y: params[i].top },
      text: this.shiledArea,
    }
    
    this.targetObj.addShieldArr.push(obj)
  }
}
export { deepCloneData, proprietaryUniqueSmileArray, isInsidePolygon, isOnRoundCapHpp, initShieldData }