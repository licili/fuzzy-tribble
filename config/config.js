const config = {
  SERVER: {
    PORT:3000
  },
  WX: {
    // APPID: 'wxd1fc2595727b03d9', 
    // TOKEN: 'dadafdas564', 
    // APPSECRET: 'fa1e1dcd092e25cae0ac5c8deebf1310', 
    // 测试公众号
    APPID: 'wx1c388c320ea7d989', // TEST
    TOKEN: '123456adgagaqerhghyqebb',
    APPSECRET: 'beb25d732e034e9e4413adba326ff105',
    // 2
    // APPID: 'wx16fda1467aec4841', // TEST
    // TOKEN: '123456adgagaqerhghyqebb',
    // APPSECRET: 'cd02336f2242e1e43957bd9b16bc9247',
  },
  db: 'mongodb://localhost/wechat',
  baseUrl:'http://k37722444u.zicp.vip/'

}

module.exports = config;