// 微信业务的后端控制器

const { reply } = require('../../wechat/reply');
const config = require('../../config/config');
let { getOAuth}= require('../../wechat/index')
const wechatMiddle = require('../../wechat-lib/middleware');

// 接入消息中间件  （通过路由来接管了）
exports.hear = async (ctx, next) => {
  let middle = wechatMiddle(config, reply)
  await middle(ctx,next)
}

exports.oauth = async (ctx, next) => {
  let oauth = getOAuth();
  const target = config.baseUrl + 'userinfo';
  const scope = 'snsapi_userinfo'; 
  // const scope = 'snsapi_base';
  const state = ctx.query.id
  let url = oauth.getAuthorizeURL(scope, target, state);
  console.log('url这里',url);
  // 调到授权页面，然后用户授权了，又会跳回来
  ctx.redirect(url);
}

exports.userinfo = async (ctx, next) => {
  let oauth = getOAuth();
  let code = ctx.query.code;
  let data = await oauth.fetchAccessToken(code);
  console.log(data,'data');
  let userData = await oauth.getUserInfo(data.access_token,data.openid);
  console.log(userData);
  ctx.body = userData;
}

