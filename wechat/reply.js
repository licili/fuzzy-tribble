let path = require('path');
// 回复的业务代码
exports.reply = async (ctx, next) => {
  const message = ctx.weixin;


  // 获取Wechat实例
  let { getWechat } = require('./index')
  let client = getWechat()

  let reply = '';
  if (message.MsgType === 'event') {
    if (message.Event === 'LOCATION') { // 地理位置
      reply = `你上报的位置为
      ${message.Latitude}-${message.Longitude}-${message.Precision}`
    } else if (message.Event === 'subscribe') { //关注 事件 用户未关注时，进行关注后的事件推送
      reply = `谢谢你关注了我 扫码参数 ${message.EventKey} _ ${message.Ticket}`
    } else if (message.Event === 'unsubscribe') { //取关
      console.log(`取关了`);
    } else if (message.Event === 'SCAN') { //用户已关注时的事件推送
      reply = 'SCAN' + message.EventKey + message.Ticket
    } else if (message.Event === 'CLICK') { // 自定义菜单 CLICK 事件推送
      console.log(message);
      reply = `CLICK事件 ${message.EventKey}`
    } else if (message.Event === 'VIEW') { // VIEW 事件推送
      reply = `菜单链接 ${message.EventKey} ${message.MenuID}`
    } else if (message.Event === 'scancode_push') { // 扫码推事件(弹出东西)
      reply = `扫码推事件 ${message.ScanResult}`
    } else if (message.Event === 'scancode_waitmsg') { // 扫码推事件
      reply = `扫码推事件 ${message.ScanResult}`
    } else if (message.Event === 'pic_sysphoto') { // 弹出系统拍照发图
      reply = `弹出系统拍照发图 ${message.SendPicsInfo.Count}`
    } else if (message.Event === 'pic_photo_or_album') { // 弹出拍照或者相册发图
      reply = `弹出拍照或者相册发图 ${message.SendPicsInfo.Count}`
    } else if (message.Event === 'pic_weixin') { // 弹出微信相册发图器
      reply = `弹出微信相册发图器 ${message.SendPicsInfo.Count}`
    } else if (message.Event === 'location_select') { // 弹出地理位置选择器
      reply = `弹出地理位置选择器 ${message.Label}`
    }
  } else if (message.MsgType === 'location') { //地理位置
    reply = `你上报的位置为
      ${message.Label}-${message.Location_X}`
  } else if (message.MsgType === 'text') { // 文本
    let content = message.Content;

    if (content === '1') {
      reply = '天下第一帅气';
    } else if (content === '2') {
      reply = '第二'
    } else if (content === '3') { // 回复图文
      reply = [{
        title: '东华山靓仔',
        description: '大家好！',
        picUrl: 'http://db.szmt2015.top/QQ%E5%9B%BE%E7%89%8720210216133959.jpg',
        url: 'http://db.szmt2015.top/QQ%E5%9B%BE%E7%89%8720210216133959.jpg'
      }]
    } else if (content === '4') { // 上传临时数据


      // let templaryData = await client.handle('temporaryUpload', 'image', path.resolve(__dirname, './materias/wx2.png'));
      // // 回复图片
      // reply = {
      //   type: 'image',
      //   media_id:templaryData.media_id
      // }

      // let templaryData = await client.handle('temporaryUpload', 'video', path.resolve(__dirname, './materias/1.mp4'));

      // console.log('视频回复');
      // 回复视频   为什么上传临时视频素材的响应这么慢

      // reply = {
      //   type: 'video',
      //   title: '回复视频',
      //   description:'playBaseball',
      //   media_id: 'HawJXOe5AwWLAZkL3q1a81RYgGwHxoTALkoDdwdp1Szbnzdlk5WY10pLrAcws7RG',
      // }

      // let templaryData = await client.handle('temporaryUpload', 'voice', path.resolve(__dirname, './materias/1.mp3'));
      // let templaryData = await client.handle('temporaryUpload', 'thumb', path.resolve(__dirname, './materias/1.jpg'));

      // 回复音乐

      // let templaryData = await client.handle('temporaryUpload', 'image', path.resolve(__dirname, './materias/wx2.png'));
      // reply = {
      //   type: 'music',
      //   title:'好运来',
      //   description: '放松一下',
      //   musicUrl: 'http://db.szmt2015.top/1.mp3',
      //   hqMusicUrl: 'http://db.szmt2015.top/1.mp3',
      //   media_id: templaryData.media_id,
      // }
    } else if (content === '5') { //获取临时数据
      let mediaId = `8x9haS2-9zAPwSIZu3tHlTA6Vg1Zc6wPx7QmP68o9BpT0eoCvkn0Pem0Kw_dTOjq`;
      let getData = await client.handle('temporaryGet', mediaId);
      reply = getData;
    } else if (content === '6') { // 上传永久素材

      // 第一类 图片 和 视频  Dn-otP5rlfJ7Jw4qo1NmBnJZN0EzWFo7IAT5a50e99Y
      // let permanentData = await client.handle('permanentUpload', 'image', path.resolve(__dirname, './materias/1.jpg'), {type:'image'});
      // console.log(permanentData,'===========>');
      // reply = {
      //   type: 'image',
      //   media_id:permanentData.media_id
      // }

      // let permanentData = await client.handle('permanentUpload', 'video', path.resolve(__dirname, './materias/1.mp4'), {
      //   type: 'video',
      //   description:'{"title":"lici","introduction":"NEVER GIVE UP HALF WAY"}'
      // });
      // console.log(permanentData, '===========>');
      // reply = {
      //   type: 'video',
      //   media_id: 'Dn-otP5rlfJ7Jw4qo1NmBipty2sBmRattnAnfkpm2mM'
      // }

      // 第二类 图文素材
      let news = {
        articles: [{
          title: '春天的希望',
          thumb_media_id: 'Dn-otP5rlfJ7Jw4qo1NmBnJZN0EzWFo7IAT5a50e99Y',
          author: 'lici',
          digest: 'DIGEST',
          show_cover_pic: 1,
          content: '风华正茂',
          content_source_url: 'http://mmbiz.qpic.cn/mmbiz_jpg/8xVszyGcHeNialCQHyP56CPUQQ2TIpSg4wj6FWyPzVPYibAxADNEVTubd8XWaicNiazcdK4MNlEx0fjFWyp9pgvWyg/0?wx_fmt=jpeg',
        }, {
          title: '繁华盛世',
          thumb_media_id: 'Dn-otP5rlfJ7Jw4qo1NmBnJZN0EzWFo7IAT5a50e99Y',
          author: 'lici',
          digest: 'DIGEST',
          show_cover_pic: 1,
          content: '风华正茂',
          content_source_url: 'http://mmbiz.qpic.cn/mmbiz_jpg/8xVszyGcHeNialCQHyP56CPUQQ2TIpSg4wj6FWyPzVPYibAxADNEVTubd8XWaicNiazcdK4MNlEx0fjFWyp9pgvWyg/0?wx_fmt=jpeg',
        }]
      }
      let permanentData = await client.handle('permanentUpload', 'news', news, {});
      // reply = {
      //   type: 'news',
      //   media_id:permanentData.media_id
      // }
      reply = '6'
    } else if (content === '15') { // 临时二维码ticekt
      let tempQrData = {
        "expire_seconds": 400000,
        "action_name": "QR_SCENE",
        "action_info": {
          "scene": {
            "scene_id": 101
          }
        }
      }
      let tempTicketData = await client.handle('createQrcode', tempQrData)
      let tempQr = client.showQrcode(tempTicketData.ticket)
      console.log(tempQr);
      reply = '临时二维码链接' + tempQr;
    } else if (content === '16') { // 永久票据
      let qrData = {
        "action_name": "QR_LIMIT_SCENE",
        "action_info": {
          "scene": {
            "scene_id": 99
          }
        }
      }
      let ticketData = await client.handle('createQrcode', qrData)
      console.log(ticketData, 'ticketData');
      let qr = client.showQrcode(ticketData.ticket)
      console.log(qr);
      reply = '永久二维码链接' + qr
    } else if (content === '17') { // 长连接转短链接
      let longurl = 'https://www.baidu.com/'
      let shortData = await client.handle('createShortUrl', 'long2short', longurl);

      console.log(shortData);
      reply = '短链接' + shortData.short_url
    } else if (content === '18') { //智能接口- 语义理解
      let semanticData = {
        query: '电影票',
        city: '广州',
        category: 'flight,hotel',
        uid: message.FromUserName
      }
      let searchData = await client.handle('semantic', semanticData);
      console.log(JSON.stringify(searchData));
      reply = JSON.stringify(searchData);
    } else if (content === '19') { // AI 翻译
      let content = '你真的帅气啊!';

      let aiData = await client.handle('aiTranslate', content, 'zh_CN', 'en_US');
      console.log(aiData);
      reply = aiData.from_content + '-' + aiData.to_content;
    } else if (content === '20') { // 创建菜单

      try {
        // let delResult = await client.handle('delMenu');
        let menu = {
          button: [
            {
              name: 'scan_photo',
              sub_button: [{
                  name: '系统拍照',
                  type: 'pic_sysphoto',
                  key: 'no_1'
                },
                {
                  name: '拍照或者发图',
                  type: 'pic_photo_or_album',
                  key: 'no_2'
                },
                {
                  name: '微信相册发图',
                  type: 'pic_weixin',
                  key: 'no_3'
                },
                {
                  name: '扫码',
                  type: 'scancode_push',
                  key: 'no_4'
                },
                {
                  name: '提示消息扫码',
                  type: 'scancode_waitmsg',
                  key: 'no_5'
                }
              ]
            },
            {
              name: '跳新链接',
              type: 'view',
              url: 'http://www.baidu.com'
            },
            {
              name: '其他',
              sub_button: [
                {
                  name: '点击',
                  type:'click',
                  key: 'no_11',
                },
                {
                  name: '地理位置',
                  type: 'location_select',
                  key:'no_12'
                }
              ]
            }
          ]
        };
        let custom = {
          // tag_id: "2", 
          // sex: "1", 
          // country: "中国", 
          // province: "广东", 
          // city: "广州", 
          // client_platform_type: "2", 
          language: "en"
        }
        await client.handle('createMenu', menu); // 创建默认菜单
        let menuData = await client.handle('createMenu', menu,custom) // 创建个性化菜单
        // let result = await client.handle('fetchMenu');
        console.log(menuData);

      } catch (err) {
        console.log(err);
      }

      reply = '创建菜单成功，要看取关，在重新关注！'
    }
  } else if (message.MsgType === 'image') { // 图片
    reply = '你发送了一个图片'
  } else if (message.MsgType === 'voice') { // 声音
    console.log('到我这');
    reply = 'voice'
  } else if (message.MsgType === 'video') { // 视频
    reply = 'video'
  } else if (message.MsgType === 'shortvideo') { // 短视频
    reply = 'shortVideo'
  } else if (message.MsgType === 'link') { //链接
    reply = 'link'
  }
  ctx.body = reply;
  await next();
}