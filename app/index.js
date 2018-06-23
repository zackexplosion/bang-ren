const moment = require('moment')
const config = require('./config')
const Discord = require('discord.js')
const client = new Discord.Client()
const events = {
  voiceStateUpdate: require('./events/voiceStateUpdate')
}
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/test')
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  // we're connected!
  console.log('db conncted!')
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)

  var c = client.channels.get(config['ROBOT_ANNOUNCE_CHANNEL_ID'])
  c.send(`安安，我上線囉 ${moment().format('x')}`)
})

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong')
  }
})

client.on('voiceStateUpdate', (oldMember, newMember) => {
  events.voiceStateUpdate(client, oldMember, newMember)
})

client.login(config.TOKEN).catch(e =>{
  console.error(e)
})
