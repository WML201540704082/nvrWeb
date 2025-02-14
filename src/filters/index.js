import moment from 'moment';

function format(date, rule = 'YYYY/MM/DD HH:mm:ss') {
  if (date) {
    return moment(date).format(rule);
  }
  return '-';
}

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

const filters = {
  install(Vue) {
    Vue.filter('format', format);
    Vue.filter('ratioFilter', ratioFilter);
    Vue.filter('num5Filter', num5Filter);
    Vue.filter('num6Filter', num6Filter);
    Vue.filter('num8Filter', num8Filter);
    Vue.filter('num16Filter', num16Filter);
    Vue.filter('num40Filter', num40Filter);
    Vue.filter('num14Filter', num14Filter);
  },
};

export default filters;