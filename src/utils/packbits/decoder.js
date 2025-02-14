var { hexToBytes, padHex, base64ToHex, padBin } = require('./utils');

/*
 * This is a reimplementation of https://en.wikipedia.org/wiki/PackBits decoder
 */
function decode(base64) {
  console.log("decode1:", base64)
  var data = base64ToHex(base64)
  console.log("decode2:", data)
  if (data.indexOf(' ') >= 0) {
    data = data.split(' ').join('');
  }

  var ab = hexToBytes(data);
  var len = ab.length;
  var pos = 0;
  var output = '';
  var output2 = '';

  while (pos < len-1) {
    var byte = ab[pos];
    var nextByte = ab[pos+1];
    if (byte >= 128) {
      byte = 256 - byte;

      for (var i=0; i <= byte; i++) {
        output2 += padHex(nextByte.toString(16));
        output += padBin(nextByte.toString(2));
      }

      pos++;
    } else {
      for (var i=0; i <= byte; i++) {
        output2 += padHex(ab[pos + i + 1].toString(16));
        output += padBin(ab[pos + i + 1].toString(2));
      }

      pos += i;
    }

    pos++;
  }
  return output;
}

module.exports = {
  decode,
};