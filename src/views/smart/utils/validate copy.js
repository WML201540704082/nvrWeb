const validateChannelIP = function(rule, textval, callback) {
  // 示例: rtsp://172.17.0.174:80/ch0_0.264
  const urlregex = /^(?=^.{3,255}$)((rtsp)?(gb28181)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/)?(?:\/(.+)\/?$)?(\/\w+\.\w+)*([\?&]\w+=\w*|[\u4e00-\u9fa5]+)*$/

  if (urlregex.test(textval)) {
    callback()
  } else {
    callback(new Error())
  }
}
// 通道--URL
// const validateURL = function(rule, textval, callback) {
//   const urlregex = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/
//
//   if (urlregex.test(textval)) {
//     callback()
//   } else {
//     console.log("ChannelIP格式错误")
//     callback(new Error('请输入正确格式!'))
//   }
// }
// 数值范围
const validateNum = function(rule, textval, callback) {
  var max, min;
  if (rule.field === 'yaw' || rule.field === 'pitch' || rule.field === 'roll') {
    min = 1
    max = 45
  } else if (rule.field === 'blur' || rule.field === 'quality' || rule.field === 'faceQuality' || rule.field === 'confidence' || rule.field === 'faceConfidence' ||
             rule.field === 'pedestrianQuality' || rule.field === 'pedestrianConfidence' ||
             rule.field === 'vehicleQuality' || rule.field === 'vehicleConfidence' ||
             rule.field === 'nonmotorQuality' || rule.field === 'nonmotorConfidence' ||
             rule.field === 'binaryzation' || rule.field === 'person' || rule.field === 'light' ||
             rule.field === 'filter' || rule.field === 'arearatio'|| rule.field === 'cardConfidence' || rule.field === 'keyConfidence' || rule.field === 'struggleConfidence' || 
             rule.field === 'pedConfidence' || rule.field === 'phoneConfidence' || rule.field === 'screenConfidence' ||
             rule.field === 'cashConfidence' || rule.field === 'bagConfidence' || rule.field === 'moneyBoxConfidence' || rule.field === 'threshold'||
             rule.field === 'adConfidence' || rule.field === 'smokingConfidence' || rule.field === 'grabConfidence' || rule.field === 'propertime') {
                   
    min = 0
    max = 1
  } else if (rule.field === 'localPlateConfidence') { 
    min = 0.3
    max = 1
  } else if (rule.field === 'flowThreshold' || rule.field === 'detectSeconds') {
    min = 1
    max = 100
  } else if (rule.field === 'batchSecond') {
    min = 1
    max = 600
  } else if (rule.field === 'eventNum' || rule.field === 'crossLegNum') { 
    min = 1
    max = 10
  } else if (rule.field === 'RecognizeThrd' || rule.field === 'fastSpeed' || rule.field === 'sensitivity' || rule.field === 'ipcmove_threshold') {
    min = 0
    max = 100
  } else if (rule.field === 'CompNum' || rule.field === 'duration' || rule.field === 'crossLegDuration'
           || rule.field === 'sleepDuration' || rule.field === 'playPhoneDuration' || rule.field === 'time') {
    min = 0
    max = 1000
  } else if (rule.field === 'compareTimes') {
    min = 1
    max = 3
  } else if (rule.field === 'trackSeconds' || rule.field === 'skeletonInterval' || rule.field === 'remainInterval' || rule.field === 'interval') {
    min = 0
    max = 999999999
  } else if (rule.field === 'longitude') {
    min = -180
    max = 180
  } else if (rule.field === 'latitude') {
    min = -90
    max = 90
  } else if (rule.field === 'faceMinSize' || rule.field === 'faceMaxSize' || rule.field === 'faceClusteringMinSize' || rule.field === 'faceClusteringMaxSize' || rule.field === 'pedestrianMinSize' || rule.field === 'pedestrianMaxSize'
             || rule.field === 'vehicleMinSize' || rule.field === 'vehicleMaxSize'
             || rule.field === 'nonmotorMinSize' || rule.field === 'nonmotorMaxSize'
             || rule.field === 'enterAreaMinSize' || rule.field === 'enterAreaMaxSize'
             || rule.field === 'leaveAreaMinSize' || rule.field === 'leaveAreaMaxSize') {
    min = 32
    max = 1440
  } else if (rule.field === 'smogFireMinSize' || rule.field === 'smogFireMaxSize') {
    min = 20
    max = 1440
  } else if (rule.field === 'leaveNum') {
    min = 10
    max = 600
  } else if(rule.field === 'leaveAreaMinSize' || rule.field === 'leaveAreaMaxSize') {
    min = 48
    max = 1080
  } else if(rule.field === 'detectTime') {
    min = 0
    max = 10
  }

  if (textval >= min && textval <= max) {
    // if (rule.field === 'threshold') {
    //   if (/^[0-9]\d*$/.test(textval) == false) { // reid threshold判断是否为整型
    //      callback(new Error())
    //   }
    // }
    callback()
  } else {
    if (rule.field === 'longitude' && !textval) {
      callback()
    } else if (rule.field === 'latitude' && !textval) {
      callback()
    } else {
      callback(new Error())
    }
  }
}

// 1-65535之间的整数
const validatePortNum = (rule, value, callback) => {
  var CS = /^[1-9]\d*$/
  if (!CS.test(value) || (CS.test(value) && (Number(value) < 1 || Number(value) > 65535))) {
    callback(new Error('请输入1-65535之间的数字'))
  }else{
    callback()
  }
}
// 1-4之间的整数
const validateOneToFourNum = (rule, value, callback) => {
  var CS = /^[1-9]\d*$/
  if (!CS.test(value) || (CS.test(value) && (Number(value) < 1 || Number(value) > 4))) {
    callback(new Error('请输入1-4之间的数字'))
  }else{
    callback()
  }
}

const validateDeviceCode = function (rule, textval, callback) { //设备码只允许数字加字母-->修改都可以
  // const urlregex = /^[0-9a-zA-Z]*$/g
  //
  // if (urlregex.test(textval)) {
    callback()
  // } else {
  //   callback(new Error())
  // }
}

// IP
const validateIP = function (rule, textval, callback) {
  const urlregex = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/

  if (urlregex.test(textval)) {
    callback()
  } else {
    callback(new Error())
  }
}

const validateGateway = function (rule, textval, callback) {
  const urlregex = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/

  if (urlregex.test(textval) || !textval) {
    callback()
  } else {
    callback(new Error())
  }
}

// IoT Server
const validateIotURL = function(rule, textval, callback) {
  const urlregex = /^(?=^.{3,255}$)(ssl|tcp)(:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*([\?&]\w+=\w*)*$/

  if (urlregex.test(textval)) {
    callback()
  } else {
    callback(new Error())
  }
}
// Event Server
const validateEventURL = function(rule, textval, callback) {
  const urlregex = /^(?=^.{3,255}$)(http)(:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*([\?&]\w+=\w*)*$/

  if (urlregex.test(textval)) {
    callback()
  } else {
    callback(new Error())
  }
}
// Upload Server
const validateUploadURL = function(rule, textval, callback) { // 头以http和https开头，结尾不能为/
  const urlregex = /^(?=^.{3,255}$)(http|https)(:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*((\/)[0-9a-zA-Z?.=&]+)*$/

  if (urlregex.test(textval)) {
    callback()
  } else {
    callback(new Error())
  }
}

export {
  validateChannelIP,
  validateNum,
  validatePortNum,
  validateOneToFourNum,
  validateDeviceCode,
  validateIotURL,
  validateEventURL,
  validateUploadURL,
  // validateWolfURL,
  validateIP,
  validateGateway
}
