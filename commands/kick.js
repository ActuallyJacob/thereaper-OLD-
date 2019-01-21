const Discord = require('discord.js');
const config = require('../config/config');

// Metadata
module.exports = {
  name: 'kick',
  syntax: `${config.prefix}kick [@user] {reason}`,
  description: 'Kick a member. Admin only.',
  help: 'When a user is kicked, they can be invited back to the server at any time by any member.',
  usage: [
    `\`${config.prefix}kick @user [reason]\` + kicks the given user with reason.`,
  ],
};

module.exports.run = async (client, message, args) => {
  if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply("`The Reaper denies your futile attempt to alter history.`");
  let member = message.mentions.members.first() || message.guild.members.get(args[0]);
  if(!member)
    return message.reply("The Reaper requests a valid user. `Do comply.`");
  if(!member.kickable)
    return message.reply("The Reaper informs you this user is not kickable and asks: Are they of a higher role than The Reaper? Does The reaper have permission to kick? `Check your role permissions.`");
  
  let reason = args.slice(1).join(" ");
  if(!reason) reason = "The Reaper heard no reason.";
  
  await member.kick(reason)
    .catch(error => message.reply(`The Reaper couldn't kick that user ${message.author} because of : ${error}`));
  message.reply(`The Reaper has kicked ${member.user.tag} upon request of ${message.author.tag} because: ${reason}`)
  .catch((err) => {
    message.react('❌');
    message.channel.send(err.message);
  });
};