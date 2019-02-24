const Discord = require('discord.js');
const config = require('../config/config');

//metadata
module.exports = {
    name: 'rollcall',
    syntax: `${config.prefix}rollcall`,
    description: 'Activates rollcall. Admin only.',
    help: 'Gives every member the "Roll Call" role and creates the rollcall channel. Role is removed from each member when they type. Admin only.',
    usage: [
      `\`${config.prefix}rollcall\` + activates rollcall.`,
    ],
  };

module.exports.run = async (client, message, args) => {
    if(!message.member.roles.some(r=>["Admin", "Lead Admin", "Co-Founder", "Founder"].includes(r.name)) ){
        return message.reply("The Reaper denies. He simply denies.");
    }else{    
        const role = message.guild.roles.find('name', 'Roll Call');
        const aRole = message.guild.roles.find('name', 'Leadership Team')
        const uChannel = message.guild.channels.find("name", "roll-call");
        if (!role) return message.channel.send(`**${message.author.username}**, role not found`);
        message.guild.members.filter(m => !m.user.bot).map(async member => await member.addRole(role));
        message.channel.send(`**${message.author.username}**, role **${role.name}** was added to all members`);
        if (!uChannel){
            var server = message.guild;
            var name = ("roll-call");
            await server.createChannel(name, "text").then(channel => {
                channel.overwritePermissions(message.guild.id, {
                    VIEW_CHANNEL: false
                })

                channel.overwritePermissions(aRole, {
                    VIEW_CHANNEL: true
                })
    
                channel.overwritePermissions(role, {
                    VIEW_CHANNEL: true
                })
                channel.setParent('528575698567430154', { 
                    lockPermissions: false
                })
            })
            await message.channel.send(`${role}, **Roll-Call is now live! Please sign in roll-call to verify that you're still active within the clan and you'll be immediately removed!\n\nLove --The Reaper**`)
        }
        else{
            uChannel.send(`${role}, **Roll-Call is now live! Please sign here to verify that you're still active within the clanand you'll be immediately removed!\n\nLove --The Reaper**`)
        }
    }
}