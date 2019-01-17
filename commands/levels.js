exports.run = (client, message, args, sql, Discord) => {
  if(message.channel.name === 'the-reaper'){
    sql.all(`SELECT roleName, level FROM levelRoles WHERE guildID = '${message.guild.id}' ORDER BY level ASC`).then(rRow =>{
      if(!rRow[0]){
        var rlOut = "None";
      }else{
        var rlName = rRow.map(z=>z.roleName);
        var rlLevel = rRow.map(x=>x.level);
        var rlOutp = rlLevel.map(function(a,b){
          return['Level: ' + `**${a}**` + '  Name: ' + `**${rlName[b]}**`];
        })
        var rlOut = rlOutp.join("\n");
      }
      var embed = new Discord.RichEmbed()
        .setTitle("The Reaper Settings")
        .setColor(0x00AE86)
        .setThumbnail(message.guild.iconURL)
        .addField(`**Roles for ${message.guild.name}**`, `${rlOut}`, false)
      message.channel.send({embed: embed});
    });
  }
  else{
    var channel = message.guild.channels.find("name", "the-reaper")
    message.reply(`The Reaper forbids this command from being used outside ${channel}`)
  }
}
