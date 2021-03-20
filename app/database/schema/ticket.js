let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const TicketSchema = new Schema({
  name: String,
  ticket: String,
  expire_in: Date,
  meta: {
    createAt: {
      type: Date,
      default:Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

TicketSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now();
  }
  next();
})

TicketSchema.statics = {
  async getTicket () {
    this.findOne({name:''})
  },
  async saveTicket (data) {
    let result = await this.findOne({ name: 'ticket' });
    if (result) {
      result.ticket = data.ticket;
      result.expire_in = data.expire_in;
    } else {
      console.log(data,'data是个啥');
      let ticket = new Ticket({
        name: 'ticket',
        ticket: data.ticket,
        expire_in:data.expire_in
      })
      await ticket.save();
    }
    return data;
  }
}

let Ticket = mongoose.model('Ticket',TicketSchema)