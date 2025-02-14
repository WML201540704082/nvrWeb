var { hexToBytes, padHex, bytesToBase64 } = require('./utils');

/*
 * This is a reimplementation of https://github.com/psd-tools/packbits encoder
 */
function encode(bin) {

  let b = ''
  let data = ''
  for (let i = 0; i < bin.length; i++) {
    b += bin[i]
    if (b.length == 8) {
      data += padHex(parseInt(b, 2).toString(16))
      b = ''
    }
  }

  if (b.length > 0 && b.length < 8) {
    while(b.length != 8) {
      b += '0'
    }
    data += padHex(parseInt(b, 2).toString(16))
  }

  if (data.indexOf(' ') >= 0) {
    data = data.split(' ').join('');
  }

  var ab = hexToBytes(data.toUpperCase());
  var len = ab.length;

  if (len === 0) {
    return ab;
  }

  if (len === 1) {
    return '00' + padHex(ab.toString(16));
  }

  var output = '';
  var buf = '';
  var pos = 0;
  var repeatCount = 0;
  var MAX_LENGTH = 127;
  var state = 'CPY';

  function completeCopy() {
    var byteCount;

    if (buf.length === 0) {
      return;
    }

    byteCount = buf.length / 2; // 2 bytes per character

    output += padHex((byteCount - 1).toString(16));
    output += buf;

    buf = '';
  }

  function completeRLE() {
    output += padHex((256-(repeatCount - 1)).toString(16));
    output += padHex(ab[pos].toString(16));
  }

  while (pos < len-1) {
    var byte = ab[pos];
    var nextByte = ab[pos+1];

    if (byte === nextByte) {
      if (state === 'CPY') {
        completeCopy();
        state = 'RLE';
        repeatCount = 1;
      } else {
        if (repeatCount === MAX_LENGTH) {
          completeRLE();
          repeatCount = 0;
        }

        repeatCount += 1;
      }
    } else {
      if (state === 'CPY') {
        if (buf.length === MAX_LENGTH) {
          completeCopy();
        }

        buf += padHex(byte.toString(16));
      } else {
        repeatCount += 1;
        completeRLE();
        state = 'CPY';
        repeatCount = 0;
      }
    }

    pos++;
  }

  if (state === 'CPY') {
    buf += padHex(ab[pos].toString(16));
    completeCopy();
  } else {
    repeatCount += 1;
    completeRLE();
  }

  return bytesToBase64(hexToBytes(output));
}

module.exports = {
  encode,
};