const util = require('util')
const config = require('./config')
const Discord = require('discord.js')
const client = new Discord.Client()
const events = {
  voiceStateUpdate: require('./events/voiceStateUpdate')
}
const mongoose = require('mongoose')
const Member = require('./models/member')
mongoose.connect('mongodb://localhost/test')

function get_members_in_voice_channel(){
  var map_by_guild = new Map()
  var memeber_ids_to_search = []
  client.channels.find(c => {
    if ( c.type == 'voice' ) {
      let map_by_member = new Map()

      c.members.array().forEach( _ => {
        // let user = new User({
        //   name: _.displayName,
        //   guild_id: c.guild.id,
        //   member_id: _.id,
        //   lastestTimeEnterVoiceChannel: Date.now
        // })
        map_by_member.set(_.id, _)
        memeber_ids_to_search.push(_.id)
      })
      map_by_guild.set(c.guild.id, map_by_member)
    }
  })

  var members = await Member.find({member_id: memeber_ids_to_search})
  console.log(members)

  return map_by_guild
}

var is_ready = false
client.on('ready', () => {

  // set client as global
  global.client = client
  console.log(`Logged in as ${client.user.tag}!`)

  var mivc = get_members_in_voice_channel()
  // function logMapElements(value, key) {
  //   console.log(`m[${key}] = ${util.inspect(value, false, null)}`)
  // }

  // mivc.forEach(logMapElements)
  is_ready = true
  // console.log(mivc)
  // console.log(`${mivc.size} members in voice channel now`)
  // c.send(`安安，我上線囉 ${moment().format('x')}`)
})

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong')
  }
})

client.on('voiceStateUpdate', (oldMember, newMember) => {
  if (is_ready) {
    events.voiceStateUpdate(oldMember, newMember)
  }
})


var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  // we're connected!
  // console.log('db conncted!')
  client.login(config.TOKEN).catch(e =>{
    console.error(e)
  })
})
