const Discord = require('discord.js');
const config = require('../config/config');

// Metadata
module.exports = {
  name: 'ban',
  description: 'Ban a member. Admin only.',
  syntax: `${config.prefix}ban [@user] {reason}`,
  help: 'Bans the tagged user from the server permanently, to unban they need to be manually updated.',
  usage: [
    `\`${config.prefix}ban @user [reason]\` + bans the given user with reason.`,
  ],
};

module.exports.run = async (client, message, args) => {
  if(!message.member.hasPermission("BAN_MEMBERS")) return message.reply("`The Reaper denies your futile attempt to alter history.`");
  let member = message.mentions.members.first() || message.guild.members.get(args[0]);
  if(!member)
    return message.reply("The Reaper requests a valid user. `Do comply.`");
  if(!member.bannable)
    return message.reply("The Reaper informs you this user is not bannable and asks: Are they of a higher role than The Reaper? Does The reaper have permission to kick? `Check your role permissions.`");
  
  let reason = args.slice(1).join(" ");
  if(!reason) reason = "The Reaper heard no reason.";
  
  await member.ban(reason)
    .catch(error => message.reply(`The Reaper couldn't ban that user ${message.author} because of : ${error}`));
  message.reply(`The Reaper has banned ${member.user.tag} upon request of ${message.author.tag} because: ${reason}`)
  .catch((err) => {
    message.react('❌');
    message.channel.send(err.message);
  });
};