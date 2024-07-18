const pako = require('pako');
/**
 * 
 * @param {string} receivedMessage 
 * @returns {object} 返回解压的数据
 * @des 传入获取压缩编码后的数据并解压
 */

export function decodeAndDecompress(receivedMessage: ArrayBuffer) {
    // 对Base64编码的字符串进行解码
    //const decodedBytes = Buffer.from(receivedMessage, 'base64');

    // 使用pako进行Gzip解压缩
    return pako.inflate(receivedMessage, {to: 'string'});
}

export function decodeAndDecompressString(receivedMessage:string) {
    // 对Base64编码的字符串进行解码
    const decodedBytes = Buffer.from(receivedMessage, 'base64');

    // 使用pako进行Gzip解压缩
    const unGzipBytes = pako.inflate(decodedBytes);

    // 转换为UTF-8字符串
    return Buffer.from(unGzipBytes).toString('utf-8');
}