const Discord = require('discord.js');
const config = require('../config/config');

//metadata
module.exports = {
  name: 'roleall',
  syntax: `${config.prefix}roleall [@role]`,
  description: 'Gives role to everyone. Admin only.',
  help: 'Gives the specified role to everyone in the server. Admin only.',
  usage: [
    `\`${config.prefix}roleall [@role]'\` + gives every member a role.`,
  ],
};

module.exports.run = async (client, message, args) => {
  if(!message.member.roles.some(r=>["Admin", "Lead Admin", "Co-Founder", "Founder"].includes(r.name)) ){
    return message.reply("The Reaper denies your request.")
  }
  else{
    let gRole = message.mentions.roles.first();
    if(!gRole) return message.reply("The Reaper could not locate the requested role/none was established. `Attempt again.`");

    if (!gRole) return message.channel.send(`**${message.author.username}**, role not found`);
    
    message.guild.members.filter(m => !m.user.bot).map(async member => await member.addRole(gRole));
    message.channel.send(`**${message.author.username}**, role **${gRole.name}** was added to all members`)
    .catch((err) => {
      message.react('❌');
      message.channel.send(err.message);
    });
  };
};