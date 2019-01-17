const Discord = require('discord.js');
module.exports.helpEmbed = function(bot, message, Discord) {
        var embed = new Discord.RichEmbed()
        .setTitle("The Reaper")
        .setDescription("List of commands for The Reaper.")
        .setColor(0x00AE86)
        .setThumbnail(bot.user.displayAvatarURL)
        .addField("Commands", `**REAPER COMMANDS**
*-accept* \`\`Only usable in #welcome\`\`
*-leaderboard*
*-rank*
*-rank* \`\`@UserName\`\`
*-levels*
*-event* \`\`Create an event\`\`
*-delete* \`\`delete an event\`\`
**ADMIN COMMANDS**
*-role*
*-role* \`\`@UserName + @role\`\`
*-purge*
*-purge* \`\`Amount\`\`
*-kick*
*-kick* \`\`@UserName {reason}\`\`
*-ban*
*-ban* \`\`@UserName {reason}\`\`
*-reset*
*-reset* \`\`@UserName\`\`
*-rlevel*
*-rlevel* \`\`add/remove + level(eg:10) + role(eg:role) eg: -rlevel add 10 role\`\`
*-rollcall*
*-warn*
*-warn* \`\`@username {reason}\`\`
*-warnlevel*
*-warnlevel* \`\`@username\`\`
*-list*
*-list* \`\`@role\`\`
*-roleall*
*-roleall* \`\`@role\`\`
*-channel*
*-channel* \`\`{channel name}\`\`
*-commandlist*
*-help* \`\`Command\`\`` , true)
        .setFooter("The Reaper", `${bot.user.displayAvatarURL}`)
        message.channel.send({embed: embed});
    }
