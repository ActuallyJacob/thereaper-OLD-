const Discord = require('discord.js')

module.exports.run = async (client, message, args) => {
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("`The Reaper denies your futile attempt to alter history.`");
    let messagecount = parseInt(args);
    message.channel.fetchMessages({limit: messagecount}).then(messages => message.channel.bulkDelete(messages));
    message.channel.send("The Reaper has purged this channel. `You may now talk`")
}

module.exports.help = {
    name: "purge"
}