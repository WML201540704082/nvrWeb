export const filterStatus = (value, arr, key = { keyLabel: 'label', keyValue: 'value' }) => {
  const filterItem = arr.filter(item => {
    return item[key.keyValue] == value
  })
  return filterItem && filterItem.length > 0 ? filterItem[0][key.keyLabel] : ''
}

export const timer = ({name, callback}, delay) => {
  let timer;
  let remain = delay;
  let startTime = 0;
  let prevSpeed = 1;
  return {
    getRemain: () => { return remain },
    getRemainingTime: () => {
      const currentTime = new Date().getTime();
      return  remain - ( currentTime - startTime )
    },
    callback: async (...rest) => {
      await callback(...rest)
    },
    start: () => {
      window.clearTimeout(timer);
      timer = null;
      startTime = new Date().getTime()
      timer = window.setTimeout(() => {
        callback();
      }, remain)
      console.log(`[${name}] [timer]::start`, remain);
    },
    pause: () => {
      window.clearTimeout(timer);
      timer = null;
      const currentTime = new Date().getTime();
      remain = remain - (currentTime - startTime);
      console.log(`[${name}] [timer]::pause`, remain);
    },
    continue: () => {
      startTime = new Date().getTime();
      timer = window.setTimeout(function () {
        callback();
      }, remain);
      console.log(`[${name}] [timer]::continue`, remain);
    },
    reset: ({ delay, speed }) => {
      window.clearTimeout(timer);
      timer = null;
      
      if (Math.ceil((delay * prevSpeed) / speed) >= 0) {
        remain = Math.ceil((delay * prevSpeed) / speed);
        prevSpeed = speed;
      }
    },
    clear: () => {
      window.clearTimeout(timer);
      console.log(`[${name}] [timer]::clear`);
      timer = null
    }
  }
}