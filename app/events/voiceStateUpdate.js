module.exports = (client, oldMember, newMember) =>{
  if (oldMember.voiceChannel === undefined ) {
    console.log(`user ${newMember.displayName} join voice channel: ${newMember.voiceChannel.name}`)
  }
  else if (newMember.voiceChannel === undefined ) {
    console.log(`user ${oldMember.displayName} leave voice channel from ${oldMember.voiceChannel.name}`)
  } else {
    if ( oldMember.voiceChannel.id !== newMember.voiceChannel.id) {
      console.log(`user ${newMember.displayName} change voice channel, from ${oldMember.voiceChannel.name} to from ${newMember.voiceChannel.name}`)
    }
  }
}
