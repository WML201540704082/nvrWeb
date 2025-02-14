/*
 * @Author: Stephen
 * @Date: 2019-11-27 18:46:26
 * @LastEditors: Stephen
 * @LastEditTime: 2019-11-27 18:46:35
 */
export function debounce(func, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}