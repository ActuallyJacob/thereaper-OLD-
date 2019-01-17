const Discord = require('discord.js')

module.exports.run = async (message, args) => {
  if(!message.member.roles.some(r=>["Admin", "Lead Admin", "Co-Founder", "Founder"].includes(r.name)) ){
    return message.reply("The Reaper denies your request for an upgrade. Try again?")
  }
  else{
      let rMember = message.guild.member(message.mentions.users.first()) 
      message.guild.members.get(args[0]);
      if(!rMember) return message.reply("The Reaper could not find that user. `Attempt again.`");
      let role = args.join(" ").slice(22);
      if(!role) return message.reply("The Reaper wishes for a role to be established. `Attempt again.`");
      let gRole = message.mentions.roles.first();
      if(!gRole) return message.reply("The Reaper could not locate the requested role. `Attempt again.`");
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
      }
    }
  }

  
module.exports.help = {
  name: "role"
}