//package constants
const Discord = require('discord.js');
const fs = require('fs-extra');
const sql = require('sqlite');
const _ = require('lodash');

//other constants
const client = new Discord.Client();
const talkedRecently = new Set();
const config = require('./config/config.json');
const reactions = require('./modules/reactions');
const levelerCore = require('./functions/levelSystem');

//databases
sql.open(`./modules/levelDB.sqlite`);
const db = require('./modules/dbcontroller');

// Read all the commands and put them into the client
fs.readdir(`${__dirname}/commands/`).then((files) => {
  const commands = [];
  files.forEach((file) => {
    if (file.endsWith('.js')) {
      const command = require(`${__dirname}/commands/${file}`);
      commands.push(command);
    }
  });
  client.commands = commands;
});

db.initDatabase();

//load events
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
  const guilds = client.guilds.array();
  guilds.forEach(async (guild) => {
    if (!db.guildExists(guild)) {
      const owner = await client.fetchUser(guild.ownerID);
      db.addGuild(guild);
      db.addManager(guild, owner);
      db.addManager(config.ownerID);
    }
  });
  console.log(client.user.username + " is online.")
  const activities_list = [
    "Created by ActuallyJacob", 
    "Use -help (command) for help", 
    "Go Reapers!"
    ];
    setInterval(() => {
      const index = Math.floor(Math.random() * (activities_list.length - 1) + 1); // generates a random number between 1 and the length of the activities array list (in this case 5).
      client.user.setActivity(activities_list[index]); // sets bot's activities to one of the phrases in the arraylist.
    }, 10000); // Runs this every 10 seconds.
});

// When a guild adds the bot, add it to the db
client.on('guildCreate', async (guild) => {
  console.log('Added to new server!');
  if (!db.guildExists(guild)) {
    const owner = await client.fetchUser(guild.ownerID);
    db.addGuild(guild);
    db.addManager(guild, owner);
  }
});

//command control and message events
client.on("message", message => {
  if (message.author.bot) return;
  if (message.channel.type === 'dm'){
    if (!message.content.startsWith(config.prefix)){
      client.users.get(config.ownerID).send(`Message Dm'd by: ${message.author.id}, ${message.author.username}, content: ${message.content}`);
    }else{
      return;
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
      const command = message.content.split(' ')[0].slice(config.prefix.length).toLowerCase();
      
      // Dont run the command if it isnt valid.
      if (!client.commands.some(elem => elem.name === command)) return;
      
      // Check perms
      if (db.commandIsDisabled(message.guild, command) && !db.userIsManager(message.guild, message.author) && !message.author.id(config.ownerID)) {
        message.react(reactions.restricted);
        message.channel.send('You do not have permission for this command.').then((msg) => {
          msg.delete(5000);
        });
        return;
      }
      
      // +1 for the space after the command
      let args = message.content.slice(config.prefix.length + command.length + 1);
      args = _.trim(args);
      
      try {
        const indexOfCommand = _.findIndex(client.commands, { name: command });
        client.commands[indexOfCommand].run(client, message, args);
      } catch (err) {
        message.react(reactions.debug);
        message.channel.send(`<@${config.ownerID}> The Reaper ran into an unexpected error. Fix this shit: ${err.message}`);
      }
    }
    if(message.channel.name === "roll-call"){
      message.delete().catch(O_o=>{});
      let rrole = message.guild.roles.find("name", "Roll Call");
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
    if(message.channel.name === "code-of-conduct"){
      if(message.content.toLowerCase() === "accept"){
        message.delete().catch(O_o=>{});
        let rMember = message.member.user.id
        var guildMember = message.member;
        var role = message.guild.roles.find("name", "Sorting Room");
        guildMember.addRole(role);
        message.reply("The Reaper welcomes you to the family.")
        message.guild.channels.find("name", "sorting-room").send (`<@${rMember}> Is in the sorting room! The Reaper requests you state your Xbox gamertag and Timezone. Additionally, if you have any questions for the Admin team before completing the sorting process and being removed from this channel, please let us know :smiley:`)
        }
      }
    }
});

//welcome message
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
