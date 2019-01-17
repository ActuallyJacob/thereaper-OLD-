const Discord = require('discord.js')

module.exports.run = async (message, args) => {
    if(!message.member.roles.some(r=>["Admin", "Lead Admin", "Co-Founder", "Founder"].includes(r.name)) ){
      return message.reply("The Reaper won't allow this.")
    }else{
          let lRole = message.mentions.roles.first();
          if(!lRole){
              return message.reply ("The Reaper requests a role.")
            }
            else{
                const listEmbed = new Discord.RichEmbed()
                .setTitle(`Members with the ${lRole.name} role:`)
                .setDescription(message.guild.roles.get(lRole.id).members.map(m=>m.user.tag).join('\n'));
                message.channel.send(listEmbed);
            }
        }
    }



module.exports.help = {
    name: "list"
}