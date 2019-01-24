const Discord = require('discord.js');
const config = require('../config/config');

//metadata
module.exports = {
  name: 'role',
  syntax: `${config.prefix}role [@user] {@role}`,
  description: 'Adds or removes a role. Admin only.',
  help: 'Adds specified role to specified user if they do not have it, removes it if they do. Admin only.',
  usage: [
    `\`${config.prefix}\` + `,
  ],
};

module.exports.run = async (client, message, args) => {
  if(!message.member.roles.some(r=>["Admin", "Lead Admin", "Co-Founder", "Founder"].includes(r.name)) ){
    return message.reply("The Reaper denies your request for an upgrade. Try again?")
  }
  else{
      let rMember = message.guild.member(message.mentions.users.first()) 
      message.guild.members.get(args[0]);
      if(!rMember) return message.reply("The Reaper could not find that user. `Attempt again.`");
      let gRole = message.mentions.roles.first();
      if(!gRole) return message.reply("The Reaper could not locate the requested role/one was not established. `Attempt again.`");
      let fRole = message.guild.roles.find("name", "Sorting Room");
      
      if(rMember.roles.has(fRole.id)){
        await(rMember.removeRole(fRole.id));
      }
      
      if(rMember.roles.has(gRole.id)){
        await(rMember.removeRole(gRole.id));
        return message.channel.send(`<@${rMember.id}> The Reaper has been sent to tell you that you no longer have the role of ${gRole.name} Contact an admin if you wish to enquire.`)
      }
      
      else{
        await(rMember.addRole(gRole.id));
        var channel = message.guild.channels.find("name", "the-reaper")
        return channel.send(`<@${rMember.id}> The Reaper has been sent to tell you that you now have the role of ${gRole.name}. Do not abuse your newfound power.`)
        .catch((err) => {
          message.react('❌');
          message.channel.send(err.message);
      });
    };
  };
};