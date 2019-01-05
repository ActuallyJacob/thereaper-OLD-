const Discord = require('discord.js')

module.exports.run = async (client, message, args) => {
    if(!message.member.roles.some(r=>["Admin", "Lead Admin", "Co-Founder", "Founder"].includes(r.name)) ){
      return message.reply("The Reaper denies. He simply denies.");
    }else{    
        const role = message.guild.roles.find('name', 'Roll Call');
        const uChannel = message.guild.channels.find("name", "roll-call");
        if (!role) return message.channel.send(`**${message.author.username}**, role not found`);
        message.guild.members.filter(m => !m.user.bot).map(async member => await member.addRole(role));
        message.channel.send(`**${message.author.username}**, role **${role.name}** was added to all members`);
        if (!uChannel){
                var server = message.guild;
                var name = ("roll-call");
                let channel = await server.createChannel(name, "text").then(m => {
                    m.overwritePermissions(message.guild.id, {
                        VIEW_CHANNEL: false
                    })
                
                    m.overwritePermissions(role, {
                        VIEW_CHANNEL: true
                    })
                    m.setParent('528575698567430154', { 
                        lockPermissions: false 
                    })
                })
                await message.channel.send(`${role}, **Roll-Call is now live! Please sign in roll-call to verify that you're still active within the clan!\n\nLove --The Reaper**`)
            }
            else{
                uChannel.send(`${role}, **Roll-Call is now live! Please sign here to verify that you're still active within the clan!\n\nLove --The Reaper**`)
            }
        }
    }

module.exports.help = {
    name: "rollcall"
}