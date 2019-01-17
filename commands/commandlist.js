const hEmbed = require('./../embeds/eHelp.js');

module.exports.run = (client, message, args, sql, Discord) =>{
  if(message.channel.name === 'the-reaper'){
    hEmbed.helpEmbed(client, message, Discord);
    }
  
  else{
    var channel = message.guild.channels.find("name", "the-reaper")
    message.reply(`The Reaper forbids this command from being used outside ${channel}`)
  }


}