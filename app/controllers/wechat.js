// 微信业务的后端控制器

const { reply } = require('../../wechat/reply');
const config = require('../../config/config');
let { getOAuth}= require('../../wechat/index')
const wechatMiddle = require('../../wechat-lib/middleware');
let Api = require('../api')
let { UrlJoin } = require('../util/index')


exports.sdk = async (ctx, next) => {
  let url = UrlJoin(config.baseUrl, ctx.originalUrl)
  let params = await Api.wechat.getSignature(url)
  console.log(params);
  // 这个render方法是koa-views已经实现了的
  await ctx.render('wechat/sdk', {params})

} 
// 接入消息中间件  （通过路由来接管了）
exports.hear = async (ctx, next) => {
  let middle = wechatMiddle(config, reply)
  await middle(ctx,next)
}

exports.oauth = async (ctx, next) => {

  const target = config.baseUrl + 'userinfo';
  const scope = 'snsapi_userinfo'; 
  // const scope = 'snsapi_base';
  const state = ctx.query.id
  let url = Api.wechat.getAuthorizeURL(scope, target, state)
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

