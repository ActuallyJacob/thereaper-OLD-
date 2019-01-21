const Discord = require('discord.js')

//metadata
module.exports = {
    name: 'list',
    syntax: `${config.prefix}list [@role]`,
    description: 'List every member in a role. Admin Only.',
    help: 'List every user in a given role. Admin only.',
    usage: [
      `\`${config.prefix}list [@role]\` + lists everyone in the given role.`,
    ],
  };

module.exports.run = async (client, message, args) => {
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
                message.channel.send(listEmbed)
                .catch((err) => {
                    message.react('❌');
                    message.channel.send(err.message);
                });        
            };
        };
    };
