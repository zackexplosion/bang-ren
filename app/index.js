// const moment = require('moment')
// const util = require('util')
const config = require('./config')
const Discord = require('discord.js')
const client = new Discord.Client()
client.is_ready = false
// set client as global
global.client = client
const events = {
  voiceStateUpdate: require('./events/voiceStateUpdate')
}
const mongoose = require('mongoose')
const Member = require('./models/member')
// mongoose.set('debug', true)

const pjson = require('../package.json')
mongoose.connect(`mongodb://localhost/${pjson.name}`)

async function update_online_members(){
  var members_to_update = []
  client.channels.find(c => {
    if ( c.type == 'voice' ) {
      c.members.array().forEach( _ => {
        _.current_channel_id = c.id
        members_to_update.push(_)
      })
    }
  })
  Member.onlines = await Member.update_online_members(members_to_update)
  // return Member.onlines
  // console.log('now', moment())
  // console.log('Member.onlines', Member.onlines.length)
}


global.CHECK_INTERVAL = 5000

client.on('ready', async ()  => {

  // const now = Date.now()
  await update_online_members()

  setInterval(function(){
    update_online_members()
  }, global.CHECK_INTERVAL )

  // console.log('online members', Member.onlines)

  client.is_ready = true


  console.log(`Logged in as ${client.user.tag}!, server ready`)
})

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong')
  }
})

client.on('voiceStateUpdate', (oldMember, newMember) => {
  if (client.is_ready) {
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
