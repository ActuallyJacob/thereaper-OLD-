const Discord = require('discord.js')

module.exports.run = async (message) => {
    message.delete().catch(O_o=>{});
    let rMember = message.member.user.id
    if (message.channel.name === 'code-of-conduct') {
        var guildMember = message.member;
        var role = message.guild.roles.find("name", "Sorting Room");
        guildMember.addRole(role);
        message.reply("The Reaper welcomes you to the family.")
        message.guild.channels.find("name", "sorting-room").send (`<@${rMember}> Is in the sorting room! The Reaper requests you state your Xbox gamertag and Timezone. Additionally, if you have any questions for the Admin team before completing the sorting process and being removed from this channel, please let us know :smiley:`)
    }
}

module.exports.help = {
    name: "accept"
}