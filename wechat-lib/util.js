let xml2js = require('xml2js');
let crypto = require('crypto')
const template = require('./tpl');
exports.parseXML = xml => {

  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, { trim: true }, (err, result) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(result)
      }
    })
  })
  
}




  // 获取随机字符串
  const createNonce = function () {
    return Math.random().toString(36).substr(2,15)
  }
  // 创建时间戳
  const createTimestamp = function () {
    return parseInt(new Date().getTime()/1000,10) + ''
  }


    // 获取js-sdk签名需要的参数 nonce timestamp url ticket
  function sign (ticket, url) {
    let noncestr = createNonce();
    let timestamp = createTimestamp();
    let signature = _sign(noncestr, ticket, timestamp, url);
    return {noncestr,timestamp,signature}
  }
  function _sign (noncestr, ticket, timestamp, url) {
    let params = [
      'noncestr=' + noncestr,
      'jsapi_ticket=' + ticket,
      'timestamp=' + timestamp,
      'url=' + url
    ]
    let str = params.sort().join('&');
    let sha1 = crypto.createHash('sha1');
    sha1.update(str);
    let result = sha1.digest('hex')
    console.log('result ===>',result);
    return result
}
  
exports.sign = sign;








let formatMessage = result => {
  let content = {};
  // 判断是否为对象
  if (typeof result === 'object') {
    // 获取所有的key
    let keys = Object.keys(result);
    for (let i = 0; i < keys.length; i++) {
      // 获取单个key
      let key = keys[i];
      let item = result[key];
      if (!(item instanceof Array) || item.length == 0) {
        continue;
      }
      if (item.length === 1) {
        let val = item[0];
        if (typeof val === 'object') {
          content[key] = formatMessage(val);
        } else {
          content[key] = (val || '').trim();
        }
      } else {
        content[key] = [];
        for (let j = 0; j < item.length; j++) {
          content[key].push(formatMessage(item[j]))
        }
      }
    }
  }
  return content;
}

let tpl = (content, message) => {
  console.log('conetnt =>',content);
  let type = 'text';
  if (Array.isArray(content)) {
    type = 'news'
  }
  if (!content) content = 'Empty news';
  if (content && content.type) {
    // 视频
    type = content.type;
  }

  let info = Object.assign({}, {
    content: content,
    msgType: type,
    createTime: new Date().getTime(),
    toUserName: message.FromUserName,
    fromUserName:message.ToUserName
  })


  return template(info);
}


exports.tpl = tpl;

exports.formatMessage = formatMessage;

