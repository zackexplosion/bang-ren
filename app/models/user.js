const mongoose = require('mongoose')
const MemberSchema = mongoose.Schema({
  name: String,
  guild_id: Number,
  member_id: Number,
  timesInVoiceChannel: { type: Number, default: 0 },
  secondsLeft: { type: Number, default: 0 },
  lastestTimeEnterVoiceChannel: Date,
  lastestTimeLeaveVoiceChannel: Date
})

MemberSchema.statics.getAllById = function(){
  return this.find({})
}



module.exports = mongoose.model('Member', MemberSchema)