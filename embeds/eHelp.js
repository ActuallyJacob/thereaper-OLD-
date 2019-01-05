module.exports.helpEmbed = function(bot, message, Discord) {
        var embed = new Discord.RichEmbed()
        .setTitle("The Reaper")
        .setDescription("List of commands for The Reaper.")
        .setColor(0x00AE86)
        .setThumbnail(bot.user.displayAvatarURL)
        .addField("Commands", `**-accept** \`\`Only usable in #welcome\`\`
**-leaderboard**
**-rank**
**-rank** \`\`@UserName\`\`
**-levels**
**-role**
**-role** \`\`@UserName + @role\`\`
**-purge**
**-purge** \`\`Amount\`\`
**-kick**
**-kick** \`\`@UserName {reason}\`\`
**-ban**
**-ban** \`\`@UserName {reason}\`\`
**-reset**
**-reset** \`\`@UserName\`\`
**-rlevel**
**-rlevel** \`\`add/remove + level(eg:10) + role(eg:role) eg: -rlevel add 10 role\`\`
**-rollcall**
**-warn**
**-warn** \`\`@username {reason}\`\`
**-warnlevel**
**-warnlevel** \`\`@username\`\`
**-list**
**-list** \`\`@role\`\`
**-help**
**-help** \`\`Command\`\`` , true)
        .setFooter("The Reaper", `${bot.user.displayAvatarURL}`)
        message.channel.send({embed: embed});
    }
