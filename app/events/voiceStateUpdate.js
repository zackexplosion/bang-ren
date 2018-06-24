const moment = require('moment')
const config = require('../config')

var USERS = {

}
module.exports = (oldMember, newMember) =>{
  // variables
  var robot_log = client.channels.get(config['ROBOT_ANNOUNCE_CHANNEL_ID'])
  var member = oldMember || newMember

  // functions
  function join_voice_channel () {
    var now = moment()
    robot_log.send(`${member.displayName} join voice channel: ${newMember.voiceChannel.name} at ${now}`)
    USERS[member.id] = {
      timesInVoiceChannel: 0,
      enterVoiceChannelAt: now
    }
  }

  function leave_voice_channel(){
    if ( !USERS[member.id]) {
      USERS[member.id] = {
        timesInVoiceChannel: 0,
        enterVoiceChannelAt: moment()
      }
    }

    // console.log('id', oldMember.id)
    var tivc = moment() - USERS[member.id]['enterVoiceChannelAt']
    USERS[oldMember.id] = {
      timesInVoiceChannel: tivc
    }

    robot_log.send(`${member.displayName} leave voice channel from ${oldMember.voiceChannel.name}, and stay ${tivc}`)
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
