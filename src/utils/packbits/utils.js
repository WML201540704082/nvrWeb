function base64ToHex(str) {
    const raw = atob(str);
    let result = '';
    for (let i = 0; i < raw.length; i++) {
      const hex = raw.charCodeAt(i).toString(16);
      result += (hex.length === 2 ? hex : '0' + hex);
    }
    return result.toUpperCase();
}

function bytesToBase64 (buffer) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
    binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}

function hexToBytes(data) {
    var len = data.length,
        result = new Uint8Array(len / 2),
        pos = 0;
  
    for (var i = 0; i < len; i+=2) {
      var byte = data.substr(i, 2);
      result[pos] = parseInt(byte, 16);
      pos++;
    }
  
    return result;
}
  
function padHex(hex) {
    return ('0' + hex).slice(-2);
}

function padBin(b) {
    let r = b.split("")
    while(r.length < 8) {
        r.unshift(0)
    }
    return r.join('')
}
  
module.exports = {
    base64ToHex,
    bytesToBase64,
    hexToBytes,
    padHex,
    padBin,
};