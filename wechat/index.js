let Wechat = require('../wechat-lib/index');
let WechatOAuth = require('../wechat-lib/oauth')
let config = require('../config/config')
let mongoose = require('mongoose');
let Token = mongoose.model('Token');



let wxConfig = {
  wechat: {
    appId: config.WX.APPID,
    appSecret: config.WX.APPSECRET,
    token: config.WX.TOKEN,
    getAccessToken: async () => {
      let res = await Token.getAccessToken();
      return res;
    },
    saveAccessToken: async (data) => {
      let res = await Token.saveAccessToken(data);
      return res;
    }
  }
}
// let client = new Wechat(wxConfig.wechat);
// module.exports = client;

exports.getWechat = () => new Wechat(wxConfig.wechat);
exports.getOAuth = () => new WechatOAuth(wxConfig.wechat)



