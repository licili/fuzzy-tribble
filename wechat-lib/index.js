// 微信获取token的入口文件
let request = require('request-promise');
let fs = require('fs');

let base = `https://api.weixin.qq.com/cgi-bin/`;
let mpBase = `https://mp.weixin.qq.com/cgi-bin/`
let  semanticUrl = `https://api.weixin.qq.com/semantic/semproxy/search?`
let api = {
  // 智能语义接口
  semanticUrl,
  accessToken: base + 'token?grant_type=client_credential',
  ticket: base + 'ticket/getticket?type=jsapi',
  // 临时素材接口
  temporary: {
    upload: base + 'media/upload?', // 上传
    fetch:base + 'media/get?' //获取
  },
  // 永久素材接口
  permanent: {
    upload: base + 'material/add_material?', // 
    uploadNews: base + 'material/add_news?', //上传图文素材
    uploadNewsPic: base + 'media/uploadimg?', //上传图文消息内的图片 获取URL
    fetch: base,
    del: base,
    update: base,
    count: base,
    batch:base
  },
  // 用户标签
  tag: {
    fetch: base,
    remark: base,
    info:base,
    fetchUser: base,
    batchTag: base,
    batchUnTag: base,
    getUserTags:base
  },

  user: {
    fetch: '',
    remark: '',
    info: '',
    batch:''
  },
  // 二维码
  qrcode: {
    //创建二维码ticket
    create: `${base}qrcode/create?`,
    //通过ticket换取二维码
    show:`${mpBase}showqrcode?`
  },
  // 长连接转短连接接口
  shortUrl: {
    create:`${base}shorturl?`
  },
  // AI开放接口
  ai: {
    translate:`${base}media/voice/translatecontent?`
  },
  //菜单
  menu: {
    create: base + 'menu/create?', // 创建菜单
    del: base + 'menu/delete?', // 删除菜单
    fetch:base + 'get_current_selfmenu_info?', // 查询菜单
    custom: base + 'menu/addconditional?', // 创建个性化菜单 
    delCustom: base + 'menu/delconditional?' // 删除个性化菜单
  }

}
class Weixin {
  constructor(opts) {
    this.opts = Object.assign({}, opts);
    this.appId = opts.appId;
    this.appSecret = opts.appSecret
    this.getAccessToken = opts.getAccessToken;
    this.saveAccessToken = opts.saveAccessToken;
    this.getTicket = opts.getTicket;
    this.saveTicket = opts.saveTicket;
    // 获取accessToken
    this.fetchAccessToken();
  }
  async request (options) {
    options = Object.assign({}, options, {
      json:true
    })

    console.log(options,'==============>');
    try {
      let result = await request(options);
      return result;
    }
    catch (err) {
      console.log('有错');
      console.log(err + '..');
    }
  }

  // 获取 ticket
  async fetchTicket (access_token) {
    let data = await this.getTicket()
    if (!this.isValid(data)) {
      data = await this.updateTicket(access_token)
      await this.saveTicket(data)
    }
    return data;
  }
  async updateTicket (access_token) {
    let url = `${api.ticket}&access_token=${access_token}`
    let ticket = await this.request({ url })
    let now = new Date().getTime()
    ticket.expires_in = now + (ticket.expires_in - 20) * 1000
    return ticket
  }

  // 1. 检查数据中的token是否过期
  // 2. 过期就刷新
  // 3. token入库
  async fetchAccessToken () {
    let data = await this.getAccessToken();


    if (!this.isValid(data)) {
      data = await this.updateAccessToken();
    }


    await this.saveAccessToken(data);
    return data;
  }

  // 获取token
  async updateAccessToken () {
    let url = `${api.accessToken}&appid=${this.appId}&secret=${this.appSecret}`

    let data = await this.request({ url });
    let now = new Date().getTime();
    data.expires_in = now + (data.expires_in - 20) * 1000;
    return data;
  }
  isValid (data) {
    if (!data || !data.expires_in) {
      return false
    }
    let expireIn = data.expires_in;
    let now = new Date().getTime();
    if (now < expireIn) {
      return true;
    } else {
      return false;
    }
  }

  async handle (type, ...args) {
    let { token } = await this.fetchAccessToken();
    let config;
    args.length > 0 ? config = await this[type].apply(this, [token, ...args]) : config = await this[type](token);


    let result = await this.request({ ...config });
    return result;
  }

  // 新增临时素材
  temporaryUpload (token,type,media) {
    let url = `${api.temporary.upload}access_token=${token}&type=${type}`;

    let rs = fs.createReadStream(media)
    return { method:'POST',url,formData:{media:rs}}
  }

  // 获取临时素材
  temporaryGet (token,mediaId) {
    let url = `${api.temporary.fetch}access_token=${token}&media_id=${mediaId}`
    return url;
  };

  // 新增（临时）永久素材  
  permanentUpload (token, type,material, permanment) { // 如果permanment有值 说明为永久素材
    let form = Object.assign({},permanment);
    let url;
    if (permanment) {
      url = `${api.permanent.upload}access_token=${token}&type=${type}`;
    } else {
      // 临时素材
      url = `${api.temporary.upload}access_token=${token}&type=${type}`;
    }
    if (type === 'pic') { //图文中的图片
      url = api.permanent.uploadNewsPic + 'access_token=' + token;
    }
    //如果是图文 material就是图文数据（一个数组），如果不是图文,是图片或者视频，他就是一个路径
    if (type === 'news') { // 图文
      url = api.permanent.uploadNews + 'access_token=' + token;
      form = material;
    } else {
      form.media = fs.createReadStream(material);
    }
    console.log('==================');
    console.log({ method: 'POST', url, formData:form });
    return { method: 'POST', url, formData:form };
  }

  // 创建 二维码 ticket 
  createQrcode (token,qr) {
    let url = `${api.qrcode.create}access_token=${token}`;
    let body = qr; //{"expire_seconds": 604800, "action_name": "QR_SCENE", "action_info": {"scene": {"scene_id": 123}}} 
    return { method: 'POST', url, body };
  }
  // 通过ticket 换取二维码
  showQrcode (ticket) {
    let url = `${api.qrcode.show}ticket=${encodeURI(ticket)}`;
    return url ;
  }
  // 长连接 转为短连接
  createShortUrl (token, action, longurl) {
    let url = `${api.shortUrl.create}access_token=${token}`;
    let body = {
      action,
      long_url:longurl
    }
    return {method:'POST',url,body};
  }

  // 语义理解 查询特定语句进行分析
  semantic (token, semanticData) {
    let url = `${api.semanticUrl}access_token=${token}`;
    semanticData.appid = this.appId;
    return { method: 'POST', url, body: semanticData };
  }
  // AI 翻译
  aiTranslate (token,content,lfrom,lto) {
    let url = `${api.ai.translate}access_token=${token}&lfrom=${lfrom}&lto=${lto}`;
    return {method:'POST',url,body:content}
  }
  // 创建菜单 （个性化菜单） custom 有值为个性化菜单
  createMenu (token, menu,custom) {
    let url = api.menu.create + 'access_token=' + token;
    if (custom) {
      url = api.menu.custom + 'access_token=' + token;
      menu.matchrule = custom; //matchrule规则
    }
    return { url, method: 'POST', body: menu };
  }
  // 删除菜单（个性化） custom 有值，删除个性化菜单
  delMenu (token, custom) {
    let url = api.menu.del + 'access_token=' + token;
    if (custom) {
      url = api.menu.delCustom + 'access_token=' + token;
    }
   
    return {url}
  }
  // 查询菜单
  fetchMenu (token) {
    let url = api.menu.fetch + 'access_token=' + token;
    return {url};
  }


}

module.exports = Weixin