const Discord = require('discord.js')

module.exports.run = async (message, args) => {
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
  message.reply(`The Reaper has banned ${member.user.tag} upon request of ${message.author.tag} because: ${reason}`);
}

module.exports.help = {
    name: "ban"
}