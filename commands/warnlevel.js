const Discord = require("discord.js");
const fs = require("fs-extra");
const config = require('../config/config');

let warns = JSON.parse(fs.readFileSync("./modules/warnings.json", "utf8"));

//metadata
module.exports = {
  name: 'warnlevel',
  syntax: `${config.prefix}warnlevel [@user]`,
  description: 'Displays warning level. Admin onyl.',
  help: 'Displays the level of warning the tagged user has. Admin only.',
  usage: [
    `\`${config.prefix}warnlevel [@user]\` + Displays warning level.`,
  ],
};

module.exports.run = async (bot, message, args) => {

  if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("The Reaper ignores you.");
  let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0])
  if(!wUser) return message.reply("The Reaper could not find them.");

  if(!warns[wUser.id]) warns[wUser.id] = {
    warns: 0
  };
  
  let warnlevel = warns[wUser.id].warns;
  message.reply(`<@${wUser.id}> has ${warnlevel} warnings.`);

}

module.exports.help = {
  name: "warnlevel"
}