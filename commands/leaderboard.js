const lEmbed = require('./../embeds/eLeaderboard.js');

//metadata
module.exports = {
    name: 'leaderboard',
    syntax: `${config.prefix}leaderboard`,
    description: 'Displays leaderboard.',
    help: 'Displays the leaderboard for The Reaper Clan discord server!',
    usage: [
      `\`${config.prefix}leaderboard\` + displays the leaderboard.`,
    ],
  };

module.exports.run = (client, message, args, sql, Discord) => {
    if(message.channel.name === 'the-reaper'){
        lEmbed.leaderboardEmbed(client, message, sql, Discord);
    }
    else{
        var channel = message.guild.channels.find("name", "the-reaper")
        message.reply(`The Reaper forbids this command from being used outside ${channel}`)
        .catch((err) => {
            message.react('❌');
            message.channel.send(err.message);
        });
    };
};
