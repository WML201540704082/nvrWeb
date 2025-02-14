const getBase64 = function (image,ext) {
  var canvas = document.createElement("canvas")
  canvas.width = image.width
  canvas.height = image.height
  var context = canvas.getContext("2d")
  context.drawImage(image,0,0,image.width,image.height)
  // 这里是不支持跨域的。注意:与人脸页面区别,默认情况转为png格式，但目前我们只支持jpeg格式
  var base64 = canvas.toDataURL("image/jpeg")
  return base64
}

// 获取图片尺寸
const getPicSize = function(src) {
  let result = new Promise((resolve,reject)=>{
    let img = new Image()
    img.src = src
    img.onload = function () { resolve(img) }
  })
  return result
}

export { getBase64, getPicSize }
