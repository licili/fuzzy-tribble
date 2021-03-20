let mongoose = require('mongoose');

let Schema = mongoose.Schema;

const TokenSchema = new Schema({
  name: String,
  token: String,
  expires_in: Number,
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default:Date.now()
    }
  }
})

TokenSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  }
  else {
    this.meta.updateAt = Date.now();
  }
  next();
})

TokenSchema.statics = {
  async getAccessToken () {
    let token = await this.findOne({
      name:'access_token'
    })
    if (token && token.token) {
      token.access_token = token.token;
    }
    return token;
  },
  async saveAccessToken (data) {
    let token = await this.findOne({
      name:'access_token'
    })
    if (token ) {
      token.token = data.access_token;
      token.expires_in = data.expires_in;
    }else {
      token = new Token({
        name: 'access_token',
        token: data.access_token,
        expires_in:data.expires_in
      })
    }
    await token.save();

    return data;
  },
}


let Token = mongoose.model('Token', TokenSchema);

