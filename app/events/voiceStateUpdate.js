const moment = require('moment')
const config = require('../config')
const Member = require('../models/member')

module.exports = async (oldMember, newMember) =>{
  // variables
  var robot_log = client.channels.get(config['ROBOT_ANNOUNCE_CHANNEL_ID'])
  var member = newMember || oldMember
  let _member = await Member.find_or_create(member)

  // functions
  function join_voice_channel () {
    robot_log.send(`${member.displayName} join voice channel: ${newMember.voiceChannel.name}`)
    _member.lastestTimeEnterVoiceChannel = Date.now()
    _member.save()
  }

  function leave_voice_channel(){
    const now = moment()
    var tivc = now - _member.lastestTimeEnterVoiceChannel
    robot_log.send(`${member.displayName} leave voice channel from ${oldMember.voiceChannel.name}, and stay ${tivc}`)
    _member.lastestTimeLeaveVoiceChannel = now
    _member.save()
  }

  // events
  if ( oldMember.voiceChannel === undefined ) {
    join_voice_channel()
  }
  else if (newMember.voiceChannel === undefined ) {
    leave_voice_channel()
  }
  else {
    if ( oldMember.voiceChannel.id !== newMember.voiceChannel.id) {
      robot_log.send(`${member.displayName} change voice channel, from ${oldMember.voiceChannel.name} to from ${newMember.voiceChannel.name}`)
    }
    else {
      // other events
    }
  }
}
