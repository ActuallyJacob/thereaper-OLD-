const Discord = require('discord.js');
module.exports.spHEmbed = function(bot, message, Discord, spCmd) {
    var embed = new Discord.RichEmbed()
      .setTitle(spCmd.command)
      .setDescription(spCmd.description)
      .setColor(0x00AE86)
    message.channel.send({embed: embed});
  }