const sha1 = require('sha1');
let getRawBody = require('raw-body');
let util = require('./util');


module.exports = (config,reply) => {
  return async (ctx, next) => {
    let {
      APPID,
      TOKEN,
      APPSECRET
    } = config.WX;
    console.log(ctx.method);
    const {
      signature,
      timestamp,
      nonce,
      echostr
    } = ctx.query;
    let str = [TOKEN, timestamp, nonce].sort().join('');
    let sha = sha1(str);
    if (ctx.method === 'GET') {
      if (sha === signature) {
        ctx.body = echostr
      } else {
        ctx.body = 'wrong'
      }
    } else if (ctx.method === 'POST') {
      console.log('hh');
      if (sha !== signature) {
        return (ctx.body = 'FAILED')
      }
      let data = await getRawBody(ctx.req, {
        length: ctx.req.headers['content-length'],
        limit: '1mb',
        encoding: 'utf8'
      })
      console.log('data');
      let content = await util.parseXML(data);
      // 格式化了xml
      let message = await util.formatMessage(content.xml);
      console.log(message);
      ctx.weixin = message;
      // 回复的内容挂载到了ctx.body了 可以通过ctx.body获取
      await reply.apply(ctx, [ctx, next]);

      ctx.status = 200;
      ctx.set('Content-Type', 'application/xml')

      // 回复的主体内容
      let replyBody = ctx.body;
      // 微信服务器发送过来的格式化格式


      const msg = ctx.weixin;

      const xml = util.tpl(replyBody, msg);


      ctx.body = xml;
    }

  }
}

