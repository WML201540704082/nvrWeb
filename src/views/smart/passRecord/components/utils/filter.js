const ratioFilter = function (value) {
  let realVal = ''
  if (value) { // 截取当前数据到小数点后两位
    realVal = `${parseFloat(value).toFixed(2)}%`
  } else {
    // realVal = '陌生人'
  }
  return realVal
}

const num5Filter = function (value) {
  if (!value) return ''
  if (value.length > 5) {
    return value.slice(0, 5) + '...'
  }
  return value
}

const num6Filter = function (value) {
  if (!value) return ''
  if (value.length > 6) {
    return value.slice(0, 6) + '...'
  }
  return value
}

const num8Filter = function (value) {
  if (!value) return ''
  if (value.length > 8) {
    return value.slice(0, 8) + '...'
  }
  return value
}

const num16Filter = function (value) {
  if (!value) return ''
  if (value.length > 16) {
    return value.slice(0, 16) + '...'
  }
  return value
}

const num40Filter = function (value) {
  if (!value) return ''
  if (value.length > 40) {
    return value.slice(0, 40) + '...'
  }
  return value
}
const num14Filter = function (value) {
  if (!value) return ''
  if (value.length > 14) {
    return value.slice(0, 14) + '...'
  }
  return value
}

export { ratioFilter,
         num5Filter,
         num6Filter,
         num8Filter,
         num16Filter,
         num40Filter,
         num14Filter
}
