// IP
export const validateIP = function (rule, textval, callback) {
    const urlregex = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    if (urlregex.test(textval)) {
      callback()
    } else {
      callback(new Error())
    }
}

// DNS
export const validateDNS = function (rule, textval, callback) {
  let textvalList = []
  if(textval instanceof Array) {
    textvalList = textval
  } else {
    textvalList = textval.indexOf(',')> -1 ? textval.split(',') : [textval]
  }
  const urlregex = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
  let textCount = 0
  for(let i in textvalList) {
    if (urlregex.test(textvalList[i])) {
      textCount ++
    } else {
      callback(new Error())
    }
  }
  if(textCount == textvalList.length) {
    callback()
  }
}

export const validateServerIP = function (rule, textval, callback) {
  const urlregex = /^(([\w]+:)\/\/)(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(:[\d]+)?$/

  if (urlregex.test(textval)) {
    callback()
  } else {
    callback(new Error())
  }
}
export const validateGateway = function (rule, textval, callback) {
    const urlregex = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
  
    if (urlregex.test(textval) || !textval) {
      callback()
    } else {
      callback(new Error())
    }
}