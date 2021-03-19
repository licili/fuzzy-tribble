// 网页授权
let request = require('request-promise');
let base = 'https://api.weixin.qq.com/sns/'
let api = {
  authorize: 'https://open.weixin.qq.com/connect/oauth2/authorize?',
  accessToken: base + 'oauth2/access_token?',
  userInfo: base + 'userinfo?',
}

module.exports = class WechatOAuth {
  constructor(opts) {
    this.appId = opts.appId;
    this.appSecret = opts.appSecret;
  }
  async request(options) {
    options = Object.assign({}, options, {
      json: true
    });
    try {
      let result = await request(options);
      return result;
    } catch (error) {
      console.log(error);
    }
  }
  // 详细信息/静默授权 snsapi_userinfo    
  // 基本信息/静默授权 snsapi_base
  getAuthorizeURL(scope = 'snsapi_base', target, state) {
    // appid 公众号唯一标识 redirect_uri 授权后重定位的回调链接地址
    // scope 授权作用域 snsapi_base snsapi_userinfo
    // state 重定向后带上的state参数
    let url = `${api.authorize}appid=${this.appId}&redirect_uri=${encodeURIComponent(target)}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`
    return url;
  }
  async fetchAccessToken(code) {
    let url = `${api.accessToken}appid=${this.appId}&secret=${this.appSecret}&code=${code}&grant_type=authorization_code`;
    let res = await this.request({
      url
    });
    return res;
  }
  async getUserInfo(access_token, openId, lang = 'zh_CN') {
    let url = `${api.userInfo}access_token=${access_token}&openid=${openId}&lang=${lang}`;
    let res = await this.request({
      url
    });
    return res;
  }
}