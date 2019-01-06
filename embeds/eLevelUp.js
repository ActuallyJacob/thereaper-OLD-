module.exports.levelUpEmbed = function(bot, message, Discord, level) {
    var embed = new Discord.RichEmbed()
        .setTitle(message.author.username)
        .setDescription(`**CONGRATS**\nThe Reaper announces that you have made it to level: **${level}**!!!\nWe wish to thank you for being a part of the Reaper Clan`)
        .setColor(0x00AE86)
        .setThumbnail(message.author.displayAvatarURL);

    let channel = message.guild.channels.find("name", "the-reaper");
    channel.send({embed: embed});

}