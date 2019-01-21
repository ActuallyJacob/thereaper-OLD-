const Discord = require('discord.js');
const config = require('../config/config');

// Metadata
module.exports = {
    name: 'accept',
    description: 'Accept the rules.',
    syntax: `${config.prefix}accept`,
    help: 'Accepts the rules given to a new member upon arrival into the server and moves them onto the next phase of getting the Beginner role.',
    usage: [
      `\`${config.prefix}accept\` + Accepts the given rules.`,
    ],
  };
  

module.exports.run = async (client, message, args) => {
    message.delete().catch(O_o=>{});
    let rMember = message.member.user.id
    if (message.channel.name === 'code-of-conduct') {
        var guildMember = message.member;
        var role = message.guild.roles.find("name", "Sorting Room");
        guildMember.addRole(role);
        message.reply("The Reaper welcomes you to the family.")
        message.guild.channels.find("name", "sorting-room")
        .send (`<@${rMember}> Is in the sorting room! The Reaper requests you state your Xbox gamertag and Timezone. Additionally, if you have any questions for the Admin team before completing the sorting process and being removed from this channel, please let us know :smiley:`)
        .catch((err) => {
            message.react('❌');
            message.channel.send(err.message);
        });
    };
};