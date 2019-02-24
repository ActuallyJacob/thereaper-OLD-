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
        var server = message.guild;
        const role = server.roles.find(role => role.name === 'Roll Call');
        const aRole = server.roles.find(role => role.name === 'Leadership team');
        const existingCat = server.channels.find(channel => channel.name === 'reaper rooms' && channel.type == 'category');
        const existingChannel = server.channels.find(channel => channel.name === 'roll-call');
        if (!role) return message.channel.send(`**${message.author.username}**, role not found`);
        server.members.filter(m => !m.user.bot).map(async member => await member.addRole(role));
        message.channel.send(`**${message.author.username}**, role **${role.name}** was added to all members`);
        if (!existingChannel){
                var name = ("roll-call");
                let newChannel = server.createChannel(name, "text").then(m => {

                    m.overwritePermissions(server.id, {
                        VIEW_CHANNEL: false
                    })

                    m.overwritePermissions(aRole, {
                        VIEW_CHANNEL: true
                    })

                    m.overwritePermissions(role, {
                        VIEW_CHANNEL: true
                    })
                    m.setParent(existingCat, { 
                        lockPermissions: false 
                    })
                })
                await newChannel.send(`**Roll-Call is now live! Please sign in roll-call to verify that you're still active within the clan! You will be removed from this channel after you have signed.${role}\n\nLove --The Reaper**`)
            }
        };
    };