const mongoose = require('mongoose')
const MemberSchema = mongoose.Schema({
  name: String,
  guild_id: String,
  member_id: String,
  currentChannelId: String,
  secondsInVoiceChannel: { type: Number, default: 0 },
  secondsLeft: { type: Number, default: 0 },
  lastestTimeEnterVoiceChannel: { type: Date, default: Date.now},
  lastestTimeLeaveVoiceChannel: Date
})

MemberSchema.statics.update_online_members = function(members){

  return Promise.all(members.map(async _member => {
    // console.log(_member)
    let member = await this.find_or_create(_member)

    if (client.is_ready) {
      member.secondsInVoiceChannel += (global.CHECK_INTERVAL / 1000)
    }

    member.currentChannelId = _member.current_channel_id
    await member.save()

    return member
  }))
}

MemberSchema.statics.find_or_create = async function( _member){
  let gid = _member.guild.id
  let member = await this.findOne({
    member_id: _member.id,
    guild_id: gid
  })

  if(!member){
    member = await this.create({
      name: _member.displayName,
      member_id: _member.id,
      guild_id: gid,
    })
  }

  return member
}



// MemberSchema.statics.online_members = new Map()



module.exports = mongoose.model('Member', MemberSchema)