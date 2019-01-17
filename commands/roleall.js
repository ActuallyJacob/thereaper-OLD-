const Discord = require('discord.js')

module.exports.run = async (message) => {
  if(!message.member.roles.some(r=>["Admin", "Lead Admin", "Co-Founder", "Founder"].includes(r.name)) ){
    return message.reply("The Reaper denies your request.")
  }
  else{
    let gRole = message.mentions.roles.first();
    if(!gRole) return message.reply("The Reaper could not locate the requested role. `Attempt again.`");

    if (!gRole) return message.channel.send(`**${message.author.username}**, role not found`);
    
    message.guild.members.filter(m => !m.user.bot).map(async member => await member.addRole(gRole));
    message.channel.send(`**${message.author.username}**, role **${gRole.name}** was added to all members`);
  }
}

module.exports.help = {
    name: "roleall"
}