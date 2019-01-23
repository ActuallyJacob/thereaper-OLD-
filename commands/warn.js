const Discord = require('discord.js');
const config = require('../config/config');
const fs = require('fs-extra');

// Metadata
module.exports = {
    name: 'warn',
    description: 'Warn a member. Admin only.',
    syntax: `${config.prefix}warn {'user} [reason]`,
    help: 'Documents a warning to a member of the server with reason.',
    usage: [
      `\`${config.prefix}warn {user} [reason]\` + Warn a member.`,
    ],
  };

module.exports.run = (client, message, args) => {
    var embedColor = '#ffffff' // Change this to change the color of the embeds!
    
    var missingPermissionsEmbed = new Discord.RichEmbed() // Creates the embed thats sent if the user is missing permissions
        .setColor(embedColor)
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTitle('Insufficient Permissions!')
        .setDescription('You need the `MANAGE_MESSAGES` permission to use this command!')
        .setTimestamp();
    var missingArgsEmbed = new Discord.RichEmbed() // Creates the embed thats sent if the command isnt run right
        .setColor(embedColor)
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTitle('Missing Arguments!')
        .setDescription('Usage: `warn [@User] [Reason]')
        .setTimestamp();
    if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send(missingPermissionsEmbed); // Checks if the user has the permission
    let mentioned = message.mentions.users.first(); // Gets the user mentioned!
    if(!mentioned) return message.channel.send(missingArgsEmbed); // Triggers if the user donsn't tag a user in the message
    let reason = args.slice(1).join(' ') // .slice(1) removes the user mention, .join(' ') joins all the words in the message, instead of just sending 1 word
    if(!reason) return message.channe.send(missingArgsEmbed); // Triggers if the user dosn't provide a reason for the warning
    let channel = message.guild.channels.find("name", "bot-admins");

    var warnSuccessfulEmbed = new Discord.RichEmbed() // Creates the embed thats returned to the person warning if its sent.
        .setColor(embedColor)
        .setTitle('User Successfully Warned!');
        if(channel.exists){
            message.channel.send(warnSuccessfulEmbed);
        }
        else{
            channel.send(warnSuccessfulEmbed);
        }
    message.delete(5000); // Deletes the command
}