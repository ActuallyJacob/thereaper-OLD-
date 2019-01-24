const Discord = require('discord.js');
const config = require('../config/config');

//metadata
module.exports = {
    name: 'purge',
    syntax: `${config.prefix}purge [amount]`,
    description: 'Bulk deletes messages. Admin only.',
    help: 'Primarily used to clean out chats, and is only usable by Admins and above.',
    usage: [
      `\`${config.prefix}purge [amount]\` + purges the given amount of messages. If no amount is given, deletes 100 messages.`,
    ],
  };

module.exports.run = async (client, message, args) => {
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("`The Reaper denies your futile attempt to alter history.`");
    let messagecount = parseInt(args);
    message.channel.fetchMessages({limit: messagecount}).then(messages => message.channel.bulkDelete(messages));
    message.channel.send("The Reaper has purged this channel. `You may now talk`")
    .catch((err) => {
        message.react('❌');
        message.channel.send(err.message);
    });
};