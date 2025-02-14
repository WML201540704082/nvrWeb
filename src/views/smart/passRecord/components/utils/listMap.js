// 检索--commonList
export const commonList = {
  time: [{
      label: 'all',
      value: 'all'
    }, {
      label: 'today',
      value: 'today'
    }, {
      label: 'threeDays',
      value: 'threeDays'
    }, {
      label: 'sevenDays',
      value: 'sevenDays'
    }, {
      label: 'auto',
      value: 'auto'
  }],
  color: [{
      value: 1,
      label: '白色',
      color: 'rgb(244, 244, 244)'
    }, {
      value: 2,
      label: '灰色',
      color: 'grey'
    }, {
      value: 3,
      label: '黑色',
      color: 'black'
    }, {
      value: 4,
      label: '绿色',
      color: 'rgb(126, 211, 33)'
    }, {
      value: 5,
      label: '蓝色',
      color: 'blue'
    }, {
      value: 6,
      label: '红色',
      color: 'red'
    }, {
      value: 7,
      label: '紫色',
      color: 'purple'
    }, {
      value: 8,
      label: '黄色',
      color: 'rgb(248, 214, 88)'
    }, {
      value: 9,
      label: '粉色',
      color: 'pink'
    }, {
      value: 10,
      label: '橙色',
      color: 'orange'
    }, {
      value: 11,
      label: '粽色',
      color: 'rgb(168, 139, 63)'
    }, {
      value: 12,
      label: '花色',
      color: 'rgb(233, 234, 236)'
    }, {
      value: 0,
      label: '未知',
      color: 'rgb(233, 234, 236)'
  }]
}
// 检索--face
export const faceList = {
  gender: [{
      label: 'all',
      value: ''
    }, {
      label: 'male',
      value: 1
    }, {
      label: 'female',
      value: 2
    }, {
      label: 'unknown',
      value: 0
  }],
  mask: [{
      label: 'all',
      value: ''
    }, {
      label: 'hasMask',
      value: 2
    }, {
      label: 'none',
      value: 1
    }, {
      label: 'unknown',
      value: 0
  }],
  glass: [{
      label: 'all',
      value: ''
    }, {
      label: 'haveGlass',
      value: 2
    }, {
      label: 'haveSunGlass',
      value: 3
    }, {
      label: 'none',
      value: 1
    }, {
      label: 'unknown',
      value: 0
  }],
  hat: [{
    label: 'all',
    value: ''
  }, {
    label: 'hasHat',
    value: 2
  }, {
    label: 'hasScarf',
    value: 3
  }, {
    label: 'none',
    value: 1
  }, {
    label: 'unknown',
    value: 0
}]
}
// 检索--行人
export const pedestrianList = {
  gender: [{
    label: 'all',
    value: ''
  }, {
    label: 'male',
    value: 2
  }, {
    label: 'female',
    value: 1
  }, {
    label: 'unknown',
    value: 0
  }],
  age: [{
    value: 1,
    label: '15岁以下',
  }, {
    value: 2,
    label: '15到30岁',
  }, {
    value: 3,
    label: '30到50岁',
  }, {
    value: 4,
    label: '50岁以上',
  }, {
    value: 0,
    label: '未知',
  }]
}
// 检索--机动车
export const vehicleList = {
  type: [{
      value: 0,
      label: '轿车',
    }, {
      value: 1,
      label: '面包车',
    }, {
      value: 2,
      label: '皮卡',
    }, {
      value: 3,
      label: '越野车/SUV',
    }, {
      value: 4,
      label: '商务车/MPV',
    }, {
      value: 5,
      label: '轻型客车',
    }, {
      value: 6,
      label: '中型客车',
    }, {
      value: 7,
      label: '大型客车',
    }, {
      value: 8,
      label: '公交车',
    }, {
      value: 9,
      label: '校车',
    }, {
      value: 10,
      label: '微型货车',
    }, {
      value: 11,
      label: '轻型货车',
    }, {
      value: 12,
      label: '中型货车',
    }, {
      value: 13,
      label: '大型货车',
    }, {
      value: 14,
      label: '重型货车',
    }, {
      value: 15,
      label: '集装箱车',
    }, {
      value: 16,
      label: '三轮车',
    }, {
      value: 20,
      label: '叉车',
    }, {
      value: 19,
      label: '其它',
  }],
  // 车身颜色
  carColor: [{
      value: 1,
      label: '黑色',
      color: 'black'
    }, {
      value: 2,
      label: '蓝色',
      color: 'blue'
    }, {
      value: 3,
      label: '棕色',
      color: 'brown'
    }, {
      value: 4,
      label: '绿色',
      color: 'green'
    }, {
      value: 5,
      label: '灰色',
      color: 'grey'
    }, {
      value: 6,
      label: '橙色',
      color: 'orange'
    }, {
      value: 7,
      label: '粉色',
      color: 'pink'
    }, {
      value: 8,
      label: '紫色',
      color: 'purple'
    }, {
      value: 9,
      label: '红色',
      color: 'red'
    }, {
      value: 10,
      label: '银色',
      color: 'rgb(192, 192, 192)'
    }, {
      value: 11,
      label: '白色',
      color: 'rgb(244, 244, 244)'
    }, {
      value: 12,
      label: '黄色',
      color: 'rgb(248, 214, 88)'
  }],
  // 车牌颜色
  plateColor: [{
      value: 1,
      label: '蓝色',
      color: 'blue'
    }, {
      value: 2,
      label: '黄色',
      color: 'rgb(248, 214, 88)'
    }, {
      value: 3,
      label: '白色',
      color: 'rgb(240, 240, 240)'
    }, {
      value: 4,
      label: '黑色',
      color: 'black'
    }, {
      value: 5,
      label: '绿色',
      color: 'green'
    }, {
      value: 6,
      label: '黄绿色',
      color: 'rgb(248, 214, 88)'
    }, {
      value: 7,
      label: '渐变绿',
      color: 'green'
    }, {
      value: -1,
      label: '未知',
      color: 'rgb(244, 244, 244)'
  }],
  pose: [{
    value: 0,
    label: '车尾',
  }, {
    value: 1,
    label: '车头',
  }, {
    value: 2,
    label: '侧面',
  }]
}
// 检索--非机动车
export const nonmotorList = {
  typeList: [{
      value: 1,
      label: '三轮车(有篷)',
    }, {
      value: 2,
      label: '三轮车(封闭驾驶舱)',
    }, {
      value: 3,
      label: '自行车',
    }, {
      value: 4,
      label: '摩托车/电瓶车',
    }, {
      value: 5,
      label: '三轮车(无篷/无封闭)',
    }, {
      value: 0,
      label: '未知',
  }],
  attitudeList: [{
      value: 1,
      label: '正面',
    }, {
      value: 2,
      label: '侧右面',
    }, {
      value: 3,
      label: '侧左面',
    }, {
      value: 4,
      label: '背面',
  }]
}
// detailMap--common
const color = new Map()
color.set(1, '白色')
     .set(2, '灰色')
     .set(3, '黑色')
     .set(4, '绿色')
     .set(5, '蓝色')
     .set(6, '红色')
     .set(7, '紫色')
     .set(8, '黄色')
     .set(9, '粉色')
     .set(10, '橙色')
     .set(11, '棕色')
     .set(12, '花色')
     .set(0, '未知')
     .set(null, '未知')

const rawObj = {}
const angleObj = {}
const floatObj = {}
rawObj.get = (v) => v
angleObj.get = (v) => v.toFixed(0) + '°'
floatObj.get = (v) => v.toFixed(2)
// 人脸
const quality = floatObj
const blur = floatObj
const pitch = angleObj
const yaw = angleObj
const roll = angleObj
const age = rawObj

const glass = new Map([
  [1, '无'],
  [2, '有'],
  [3, '有太阳镜'],
  [0, '未知'],
  [null, '未知']
])

const hat = new Map()
hat.set(1, '无')
hat.set(2, '有')
hat.set(3, '有头巾')
hat.set(0, '未知')
hat.set(null, '未知')

const mask = new Map()
mask.set(1, '无')
mask.set(2, '有')
mask.set(0, '未知')
mask.set(null, '未知')

const gender = new Map()
gender.set(1, '男')
gender.set(2, '女')
gender.set(3, '其他')
gender.set(0, '未知')
gender.set(null, '未知')

// const ethnic = rawObj
// gender.set(1, '汉族')
// gender.set(2, '维吾尔族')
// gender.set(3, '哈萨克族')
// gender.set(4, '回族')
// gender.set(5, '蒙古族')
// gender.set(6, '其他')
// gender.set(null, '未知')
// 人脸Map
export const faceMap = { quality, blur, pitch, yaw, roll, age, glass, hat, mask, gender }

// 行人
const p_hat = new Map()
p_hat.set(1, '眼镜')
p_hat.set(2, '帽子')
p_hat.set(3, '头盔')
p_hat.set(4, '口罩')
p_hat.set(0, '未知')
p_hat.set(null, '未知')

const p_age = new Map()
p_age.set(1, '15岁以下')
p_age.set(2, '15到30岁')
p_age.set(3, '30到50岁')
p_age.set(4, '50岁以上')
p_age.set(0, '未知')
p_age.set(null, '未知')

const upperStyle = new Map()
upperStyle.set(1, '格子上身')
upperStyle.set(2, '花纹上身')
upperStyle.set(3, '纯色上身')
upperStyle.set(4, '条纹上身')
upperStyle.set(0, '未知')
upperStyle.set(null, '未知')

const lowerStyle = new Map()
lowerStyle.set(1, '短裤')
lowerStyle.set(2, '裙子')
lowerStyle.set(3, '长裤')
lowerStyle.set(0, '未知')
lowerStyle.set(null, '未知')

const p_gender = new Map()
p_gender.set(1, '女')
p_gender.set(2, '男')
p_gender.set(0, '未知')
p_gender.set(null, '未知')

const nation = new Map()
nation.set(1, '汉族')
nation.set(2, '其他')
nation.set(0, '未知')
nation.set(null, '未知')

const appendant = new Map()
appendant.set(1, '手拉车')
appendant.set(2, '雨伞')
appendant.set(3, '抱小孩')
appendant.set(4, '围巾')
appendant.set(0, '未知')
appendant.set(null, '未知')

const hair = new Map()
hair.set(1, '短发')
hair.set(2, '长发')
hair.set(3, '光头')
hair.set(4, '头巾')
hair.set(0, '未知')
hair.set(null, '未知')

const sleeve = new Map()
sleeve.set(1, '长袖')
sleeve.set(2, '短袖')
sleeve.set(3, '无袖')
sleeve.set(0, '未知')
sleeve.set(null, '未知')

const shoeStyle = new Map()
shoeStyle.set(1, '皮鞋')
shoeStyle.set(2, '运动鞋')
shoeStyle.set(3, '凉鞋')
shoeStyle.set(4, '其他鞋')
shoeStyle.set(0, '未知')
shoeStyle.set(null, '未知')

const shoeColor = new Map()
shoeColor.set(1, '白色')
shoeColor.set(2, '灰色')
shoeColor.set(3, '黑色')
shoeColor.set(4, '绿色')
shoeColor.set(5, '蓝色')
shoeColor.set(6, '红色')
shoeColor.set(7, '紫色')
shoeColor.set(8, '黄色')
shoeColor.set(9, '粉色')
shoeColor.set(10, '橘色')
shoeColor.set(11, '棕色')
shoeColor.set(12, '彩色')
shoeColor.set(0, '未知')
shoeColor.set(null, '未知')

const backpack = new Map()
backpack.set(1, '白色')
backpack.set(2, '灰色')
backpack.set(3, '黑色')
backpack.set(4, '绿色')
backpack.set(5, '蓝色')
backpack.set(6, '红色')
backpack.set(7, '紫色')
backpack.set(8, '黄色')
backpack.set(9, '粉色')
backpack.set(10, '橘色')
backpack.set(11, '棕色')
backpack.set(12, '彩色')
backpack.set(0, '未知')
backpack.set(null, '未知')
// 行人Map
export const pedestrianMap = { 
  hat: p_hat, age: p_age, upperStyle, lowerStyle, gender: p_gender, appendant, hair, sleeve, shoeStyle, shoeColor, backpack, upperColor: color, lowerColor: color
}

// 机动车
const pose = new Map()
pose.set(0, '车尾')
pose.set(1, '车头')
pose.set(2, '侧面')
pose.set(null, '未知')

const plateType = new Map()
plateType.set(-1, '未知')
plateType.set(1, '普通蓝牌')
plateType.set(2, '普通黑牌')
plateType.set(3, '单层黄牌')
plateType.set(4, '双层黄牌(大车尾牌,农用车)')
plateType.set(5, '警车车牌')
plateType.set(6, '武警车牌')
plateType.set(7, '个性车牌')
plateType.set(8, '单层军车')
plateType.set(9, '双层军车')
plateType.set(10, '使馆车牌')
plateType.set(11, '香港车牌')
plateType.set(12, '农用车牌(农用绿牌,农用黄牌)')
plateType.set(13, '新能源小车')
plateType.set(14, '新能源大车')
plateType.set(15, '非机动车号牌')
plateType.set(16, '临时行驶车号牌')
plateType.set(17, '挂车号牌')
plateType.set(18, '领馆号牌')
plateType.set(19, '澳门出入境号牌')
plateType.set(20, '大型汽车号牌')
plateType.set(1000, '驾校车牌')
plateType.set(0, '未知')
plateType.set(null, '未知')

const plateColor = new Map()
plateColor.set(-1, '未知')
plateColor.set(1, '蓝色')
plateColor.set(2, '黄色')
plateColor.set(3, '白色')
plateColor.set(4, '黑色')
plateColor.set(5, '绿色')
plateColor.set(6, '黄绿色')
plateColor.set(7, '渐变绿')
plateColor.set(0, '未知')
plateColor.set(null, '未知')

const type = new Map()
type.set(0, '轿车')
type.set(1, '面包车')
type.set(2, '皮卡')
type.set(3, '越野车/SUV')
type.set(4, '商务车/MPV')
type.set(5, '轻型客车')
type.set(6, '中型客车')
type.set(7, '大型客车')
type.set(8, '公交车')
type.set(9, '校车')
type.set(10, '微型货车')
type.set(11, '轻型货车')
type.set(12, '中型货车')
type.set(13, '大型货车')
type.set(14, '重型货车')
type.set(15, '集装箱车')
type.set(16, '三轮车')
type.set(19, '其它')
type.set(20, '叉车')
type.set(null, '未知')

const carColor = new Map()
carColor.set(1, '黑色')
carColor.set(2, '蓝色')
carColor.set(3, '棕色')
carColor.set(4, '绿色')
carColor.set(5, '灰色')
carColor.set(6, '橙色')
carColor.set(7, '粉色')
carColor.set(8, '紫色')
carColor.set(9, '红色')
carColor.set(10, '银色')
carColor.set(11, '白色')
carColor.set(12, '黄色')
carColor.set(0, '未知')
carColor.set(null, '未知')

const marker = new Map()
marker.set(1, '年检标')
marker.set(2, '摆件')
marker.set(3, '挂件')
marker.set(4, '纸巾盒')
marker.set(5, '左遮阳板')
marker.set(6, '右遮阳板')
marker.set(7, '背景')
marker.set(8, '安全带')
marker.set(9, '其他')
marker.set(0, '未知')
marker.set(null, '未知')

const other = new Map()
other.set(1, '危化品车')
other.set(2, '黄标车')
other.set(3, '渣土车')
other.set(4, '邮政车')
other.set(5, '环卫、园林车、市政工程')
other.set(6, '救护车')
other.set(7, '工程救险车')
other.set(8, '警车')
other.set(9, '安保车')
other.set(10, '消防车')
other.set(99, '其他车辆')
other.set(0, '未知')
other.set(null, '未知')

const roof = new Map()
roof.set(1, '背景')
roof.set(2, '天窗')
roof.set(3, '天线')
roof.set(4, '行李架')
roof.set(0, '未知')
roof.set(null, '未知')
// 机动车Map
export const vehicleMap = { 
  pose, plateType, plateColor, type, carColor, other
}

// 非机动车
const attitude = new Map()
attitude.set(1, '正面')
attitude.set(2, '侧右面')
attitude.set(3, '侧左面')
attitude.set(4, '背面')
attitude.set(0, '未知')
attitude.set(null, '未知')

const n_backpack = new Map()
n_backpack.set(1, '眼镜')
n_backpack.set(2, '帽子')
n_backpack.set(3, '头盔')
n_backpack.set(4, '口罩')
n_backpack.set(0, '未知')
n_backpack.set(null, '未知')

const transportation = new Map()
transportation.set(1, '三轮车(有篷)')
transportation.set(2, '三轮车(封闭驾驶舱)')
transportation.set(3, '自行车')
transportation.set(4, '摩托车/电瓶车')
transportation.set(5, '三轮车(无篷&无封闭)')
transportation.set(0, '未知')
transportation.set(null, '未知')

const upper = new Map()
upper.set(13, '格子')
upper.set(14, '花纹')
upper.set(15, '纯色')
upper.set(16, '条纹')
upper.set(17, '雨衣')
upper.set(0, '未知')
upper.set(null, '未知')

const illegal = new Map()
illegal.set(1, '自行车违法载人')
illegal.set(2, '摩托车违法载人')
illegal.set(3, '三轮车违法载人')
illegal.set(0, '未知')
illegal.set(null, '未知')
// 非机动车Map
export const nonmotorMap = { 
  attitude, backpack: n_backpack, hat: p_hat, transportation, upperColor: color, upper, transportationColor: color, illegal, gender: p_gender
}

