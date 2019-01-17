const hEmbed = require('./../embeds/eHelp.js');
const eCEmbed = require('./../embeds/eCHelp.js');
module.exports.run = (client, message, args, sql, Discord) =>{
  if(message.channel.name === 'the-reaper'){
    var cAccept = {command:"accept", description:"Welcome channel only: Accepts the displayed rules."};
    var cHelp = {command:"help", description:"In this command you can see all the of the commands and you can see specific information about a command by doing ``-help rank``"};
    var cRank = {command:"rank", description:"With rank you can see what your rank in the leaderboards are. You can also see other peoples rank with ``-rank @UserName``"};
    var cLevels = {command: "levels", description: "Displays levels."}
    var cLeaderboard = {command: "leaderboard", description:"View the leaderboards for your current server and see who is top!"}
    var cKick = {command:"kick", description:"Admin only: Kicks a member."};
    var cBan = {command:"ban", description:"Admin only: Bans a user."}
    var cPurge = {command:"purge", description:"Admin only: Removes messages in a channel."}
    var cRole = {command:"role", description:"Admin only: Assigns a role."}
    var cRlevel = {command: "rlevel", decription:"Admin only: assign roles to levels"}
    var cReset = {command: "reset", description:"Admin only: Resets a user's rank."}
    var cRollcall = {command: "rollcall", description:"Admin only: Activates Roll-Call."}
    var cWarn = {command: "warn", description:"Admin only: warns a user."}
    var cWarnlevel = {command: "warnlevel", description:"Admin only: displays warning level of a user."}
    var cList = {command: "list", description:"Admin only: lists all users in a role."}
    let mHelp = args[0];
    if (mHelp == "leaderboard"){
      eCEmbed.spHEmbed(client, message, Discord, cLeaderboard)
    }else if(mHelp == "help"){
      eCEmbed.spHEmbed(client, message, Discord, cHelp)
    }else if(mHelp == "rank"){
      eCEmbed.spHEmbed(client, message, Discord, cRank)
    }else if(mHelp == "accept"){
      eCEmbed.spHEmbed(clientent, message, Discord, cAccept)
    }else if(mHelp == "kick"){
      eCEmbed.spHEmbed(client, message, Discord, cKick)
    }else if(mHelp == "ban"){
      eCEmbed.spHEmbed(client, message, Discord, cBan)
    }else if(mHelp == "purge"){
      eCEmbed.spHEmbed(client, message, Discord, cPurge)
    }else if(mHelp == "role"){
      eCEmbed.spHEmbed(client, message, Discord, cRole)
    }else if(mHelp == "reset"){
      eCEmbed.spHEmbed(client, message, Discord, cReset)
    }else if(mHelp == "levels"){
      eCEmbed.spHEmbed(client, message, Discord, cLevels)
    }else if(mHelp == "rollcall"){
      eCEmbed.spHEmbed(client, message, Discord, cRollcall)
    }else if(mHelp == "rlevel"){
      eCEmbed.spHEmbed(client, message, Discord, cRlevel)
    }else if(mHelp == "warn"){
      eCEmbed.spHEmbed(client, message, Discord, cWarn)
    }else if(mHelp == "warnlevel"){
      eCEmbed.spHEmbed(client, message, Discord, cWarnlevel)
    }else if(mHelp == "list"){
      eCEmbed.spHEmbed(client, message, Discord, cList)
    }else{
      hEmbed.helpEmbed(client, message, Discord);
    }
  }
  else{
    var channel = message.guild.channels.find("name", "the-reaper")
    message.reply(`The Reaper forbids this command from being used outside ${channel}`)
  }


}