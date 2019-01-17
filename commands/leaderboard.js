const lEmbed = require('./../embeds/eLeaderboard.js');
exports.run = (client, message, args, sql, Discord) => {
    if(message.channel.name === 'the-reaper'){
        lEmbed.leaderboardEmbed(client, message, sql, Discord);
    }
    else{
        var channel = message.guild.channels.find("name", "the-reaper")
        message.reply(`The Reaper forbids this command from being used outside ${channel}`)
    }
}
