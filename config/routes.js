
const Wechat = require('../app/controllers/wechat');

module.exports = router => {
  // JS-SDK
  router.get('/sdk',Wechat.sdk)


  // 进入微信消息中间件
  // router实例   => 去抽象控制器
  router.get('/wx-hear', Wechat.hear);
  router.post('/wx-hear', Wechat.hear);

  // 调到授权的中间服务页面
  router.get('/wx-oauth', Wechat.oauth);
  //  通过code 获取用户信息
  router.get('/userinfo',Wechat.userinfo)
}