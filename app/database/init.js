const mongoose = require('mongoose');
const { resolve } = require('path');
let glob = require('glob')
mongoose.Promise = global.Promise;

exports.initSchemas = () => {
  glob.sync(resolve(__dirname,'./schema','**/*.js')).forEach(require)
}

exports.connect = db => {
  let maxConnectTimes = 0;
  return new Promise(resolve => {
    if (process.env.NODE_ENV !== 'production') {
      // 本地开启调试状态
      // mongoose.set('debug',true)
    }
    mongoose.connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser:true
    });
    mongoose.connection.on('disconnect', _ => {
      maxConnectTimes++;
      if (maxConnectTimes < 5) {
        mongoose.connect(db);
      } else {
        throw new Error(`数据库挂了`)
      }
    })
    mongoose.connection.on('error', err => {
       maxConnectTimes++;
      if (maxConnectTimes < 5) {
        mongoose.connect(db);
      } else {
        throw new Error(`数据库挂了${err}`)
      }
    })
    mongoose.connection.on('open', _ => {
      console.log('数据库连接成功');
      resolve()
    })
  })
}