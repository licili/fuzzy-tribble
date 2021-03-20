const Koa = require('koa')
let Router = require('koa-router')
const moment = require('moment')
const path = require('path')

const wechat = require('./wechat-lib/middleware')
const config = require('./config/config')

const {
  reply
} = require('./wechat/reply')

const {
  initSchemas,
  connect
} = require('./app/database/init');



(async () => {

  await connect(config.db);


  await initSchemas();

  
  // server 实例
  const app = new Koa()
  // 生成路由实例
  const router = new Router()
  
  const views = require('koa-views')
  // 配置模板引擎
  console.log(__dirname);
  console.log(__filename);
  let r = path.join(__dirname, '/app/views');
  console.log();

  const render = views(__dirname + '/app/views', {
    extension: 'pug',
    options: {
      moment:moment
    }
  })
  app.use(render)




  // next 串联中间件 ctx koa上下文
  // 接入微信消息中间件  （也要对网页上某一个路由生效的）
  
  require('./config/routes')(router)


  // allowedMethods丰富response对象的header头.
  app.use(router.routes()).use(router.allowedMethods())

  app.listen(config.SERVER.PORT, _ => {
    console.log(`SERVER IS RUNNING AT ${config.SERVER.PORT}`);
  })
})()