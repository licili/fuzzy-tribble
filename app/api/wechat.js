let WechatOAuth = require('../../wechat/index').getOAuth()
let Wechat = require('../../wechat/index').getWechat()
let { sign } = require('../../wechat-lib/util')

exports.getSignature = async (url) => {
  let { token } = await Wechat.fetchAccessToken()
  let { ticket } = await Wechat.fetchTicket(token)
  let params = sign(ticket, url);
  params.appId = Wechat.appId;
  return params
}

exports.getAuthorizeUrl = function (scope,target,state) {
  let url = WechatOAuth.getAuthorizeURL(scope, target, stete)
  return url
}