const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const ms = require('ms');
const sql = require('sqlite');
const config = require('./config.json');
const levelerCore = require('./functions/levelSystem');
const talkedRecently = new Set();

sql.open(`./db/mainDB.sqlite.example`);

fs.readdir('./events/', (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    let eventFunction = require(`./events/${file}`);
    let eventName = file.split('.')[0];

    client.on(eventName, (...args) => eventFunction.run(client, ...args, sql));
  });
});

//activity and console
client.on("ready", () => {
  console.log(client.user.username + " is online.")
  client.user.setActivity("Created by ActuallyJacob")
});

client.on("message", message => {
  if (message.author.bot) return;
  if (message.channel.type === 'dm'){
    if (!message.content.startsWith(config.prefix)){
      client.users.get(config.ownerID).send(`${message.author.id}, ${message.author.username}: ${message.content}`);
    }else{
      let command = message.content.split(' ')[0];
      command = command.slice(config.prefix.length);
  
      let args = message.content.split(' ').slice(1);
  
      try {
        let commandFile = require(`./commands/${command}.js`);
        commandFile.run(client, message, args, sql, Discord);
      } catch (err) {
        console.log(err);
        client.users.get(config.ownerID).send(`${err}`);
        return;
      }
    }
  }else{
    if (!message.content.startsWith(config.prefix)){
      sql.all(`SELECT roleName FROM bListRoles WHERE guildID=${message.guild.id}`).then(rCheck=>{
        var blRoles = rCheck.map(g=>g.roleName);
        if(message.member.roles.some(r=>blRoles.includes(r.name))) {
          return;
        }else{
          if (talkedRecently.has(message.author.id)) {
            return;
          }else{
            levelerCore.scoreSystem(client, message, sql, Discord);
            talkedRecently.add(message.author.id);
            setTimeout(() => {
            talkedRecently.delete(message.author.id);
            }, 4000);
          }
        }
      });
    }else{
      let command = message.content.split(' ')[0];
      command = command.slice(config.prefix.length);
  
      let args = message.content.split(' ').slice(1);
  
      try {
        let commandFile = require(`./commands/${command}.js`);
        commandFile.run(client, message, args, sql, Discord);
      } catch (err) {
        console.log(err);
        client.users.get(config.ownerID).send(`${err}`);
        return;
      }
    }
      if(message.channel.name === "roll-call"){
        message.delete().catch(O_o=>{});
        let rrole = message.guild.roles.find("name", "Roll Call");
        let channel = message.guild.channels.find("name", "roll-call")
        if(message.member.roles.has(rrole.id)){
          message.member.removeRole(rrole.id); 
        }
      }
      if(message.channel.name === "about-me"){
        let nRole = message.guild.roles.find("name", "About Me");
        if(!message.member.roles.has(nRole)){
          message.member.addRole(nRole);
        }
      }
    }
  });

client.on('guildMemberAdd', member => {
  var channel = member.guild.channels.find('name', 'code-of-conduct');
  var rChannel = member.guild.channels.find('name', 'new-members-welcome');
  var memberavatar = member.user.avatarURL
      if (!channel) return;
      var embed = new Discord.RichEmbed()
      .setColor('RANDOM')
      .setThumbnail(memberavatar)
      .addField(':bust_in_silhouette: | name: ', `${member}`)
      .addField(':microphone2: | Welcome!', 'Welcome to the Reaper Clan server!\nThank you for your interest in being apart of our community. **To gain full access to the server, we ask you to please read the rules below and accept them.** Once accepted, you will be taken to a sorting room, where the Admin team will be able to help and assist with any questions you may have.')
      .addField(':white_check_mark: | **Rule. 1:**', 'As a first and foremost, to be accepted into this discord you must already be in the clan. This will be verified in the sorting room. ')
      .addField(':white_check_mark: | **Rule. 2:**', 'Do not insult or harass other members of the clan, or outside of the clan. In doing so you will invoke administrative action.')
      .addField(':white_check_mark: | **Rule. 3:**', 'The Admin team has an open door policy. The leaders of Reaper Clan are always available to discuss or answer questions and/or concerns.')
      .addField(':white_check_mark: | **Rule. 4:**', 'Activity in game and in discord is required. If personal issues keep you from being active for 2+ weeks, please allow us to know. Random activity checks happen in form of a Discord roll call, please sign this if you wish to stay in the clan.')
      .addField(':white_check_mark: | **Rule. 5:**', 'There are lots of rooms to talk in this Discord, please try to indulge in them all and use them for their specified purpose. Most of all, have fun with your fellow Reapers!')
      .addField(':smiley: | **Please Note**', 'These are our rules, and need to be adhered to by all. If you have any questions about them, please ask an Admin by simply typing in this channel. If not please type **-accept** to gain full access to the Discord Server, and be put into the sorting room. Thank you!')
      .addField(':family_mwgb: | You are member number:', `${member.guild.memberCount}`)
      .setFooter(`Server: ${member.guild.name}`)
      .setTimestamp()

      channel.send(embed);

      if (!rChannel) return;
      var embed = new Discord.RichEmbed()
      .setColor('RANDOM')
      .setThumbnail(memberavatar)
      .addField(':bust_in_silhouette: | name: ', `${member}`)
      .addField(':microphone2: | Welcome!', 'Welcome to the Reaper Clan server!\nPlease feel free to tell us about yourself in the #about-me tab and contact an Admin if you do!\nTake a look around and dont forget to check out our #code-of-conduct and #clan-info tabs.\nIf your Discord name is different to yur GamerTag please change your nickname to resemble to your Xbox profile, followed by your timezone. IE: GamerTag (timezone). Enjoy The reaper clan.')
      .addField(':family_mwgb: | You are member number:', `${member.guild.memberCount}`)
      .setFooter(`Server: ${member.guild.name}`)
      .setTimestamp()

      rChannel.send(embed);
});

client.login(process.env.TOKEN);
console.log('Ready');
