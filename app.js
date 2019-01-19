//package constants
const Discord = require('discord.js');
const fs = require('fs');
const sql = require('sqlite');
const sqlite3 = require('sqlite3').verbose();
//other constants
const client = new Discord.Client();
const talkedRecently = new Set();
const config = require('./config.json');
const levelerCore = require('./functions/levelSystem');

// time constants
const WEEK = 604800000;
const DAY = 86400000;
const HOUR = 3600000;
const MIN = 60000;
const TIMEOUT = 15000;

//open the databases
sql.open(`./db/mainDB.sqlite.example`);
var dbFile = './db/events.db';
var db = new sqlite3.Database(dbFile);

// initialize client variables
const color = 0x6ad6ff;
client.color = color;
client.config = config;
client.db = db;
client.discord = Discord;

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
  console.log(client.user.username + " is online.")
  const activities_list = [
    "Created by ActuallyJacob", 
    "Discord.js",
    "Use -help (command) for help", 
    "Use - commandlist for commands",
    "Go Reapers!"
    ];
    setInterval(() => {
      const index = Math.floor(Math.random() * (activities_list.length - 1) + 1); // generates a random number between 1 and the length of the activities array list (in this case 5).
      client.user.setActivity(activities_list[index]); // sets bot's activities to one of the phrases in the arraylist.
    }, 10000); // Runs this every 10 seconds.
});

//command control and message events
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

// database configuration
client.db.run("CREATE TABLE IF NOT EXISTS calendar (guild TEXT, events TEXT, notifs INTEGER, channel TEXT)");
setInterval(function() { // goes through each server and its events to check if reminders should be sent
  client.db.all(`SELECT guild, events, notifs, channel FROM calendar`, (err, rows) => {
    if (err) {
      console.error("App.js selection error: ", err);
    }
    rows.forEach((row) => { // for each server, check if they should be notified about an event
      var channel;
      var guild = client.guilds.get(row.guild);

      if (guild.available) { // if the server is available
        if (row.channel === "010010001110" || row.channel === null || row.channel === undefined) { // if a notification channel is not set
          function isTxtChannel(ch) { // checks if a channel is a text channel
            return ch.type === "text";
          }
          var chList = guild.channels.filter(isTxtChannel).array();
          var i = 0;
          while (channel === undefined) { // if the channel variable is still undefined, meaning a channel has not been found yet
            if (chList[i].permissionsFor(guild.me).has("SEND_MESSAGES")) {
              channel = chList[i];
            }
            i++;
          }
        }
        else { // if a notification channel is set
          channel = guild.channels.get(row.channel);
        }
        var events = JSON.parse(row.events);
        events.list.forEach((event) => { // for each event in the list of events of the server
          var eventDate = Date.parse(event.fullDate); // date of event
          var eventEnd = Date.parse(event.fullEndDate);
          var curr = Date.now(); // current time
          if (row.notifs === 1) { // if notifications are on
            var diff = eventDate - curr; // difference between event date and current time
            var endDiff = eventEnd - curr; // difference between event end and current time
            var timeMsg; // initialize time message
            if (diff >= WEEK && diff <= WEEK + TIMEOUT) { // week + timeout >= diff >= week
              console.log("week remind");
              timeMsg =  "in 1 week";
              channel.send(new Discord.RichEmbed()
              .setColor(color)
              .setTitle("🔔 Event Reminder")
              .setDescription(`Your event, \`${event.name}\`, is happening \`${timeMsg}.\``)
              .setFooter(`Event ID #${event.id} | Use -delete [ID] to cancel this event.`));
            }
            else if (diff >= (DAY * 3) && diff <= (DAY * 3) + TIMEOUT) { // happening in 3 days
              console.log("3 day remind");
              timeMsg = "in 3 days";
              channel.send(new Discord.RichEmbed()
              .setColor(color)
              .setTitle("🔔 Event Reminder")
              .setDescription(`Your event, \`${event.name}\`, is happening \`${timeMsg}.\``)
              .setFooter(`Event ID #${event.id} | Use -delete [ID] to cancel this event.`));
            }
            else if (diff >= DAY && diff <= DAY + TIMEOUT) { // happening in 1 day
              console.log("1 day remind");
              timeMsg = "in 1 day";
              channel.send(new Discord.RichEmbed()
              .setColor(color)
              .setTitle("🔔 Event Reminder")
              .setDescription(`Your event, \`${event.name}\`, is happening \`${timeMsg}.\``)
              .setFooter(`Event ID #${event.id} | Use -delete [ID] to cancel this event.`));
            }
            else if (diff >= HOUR && diff <= HOUR + TIMEOUT) { // 1 hour
              console.log("1 hour remind");
              timeMsg = "in 1 hour";
              channel.send(new Discord.RichEmbed()
              .setColor(color)
              .setTitle("🔔 Event Reminder")
              .setDescription(`Your event, \`${event.name}\`, is happening \`${timeMsg}.\``)
              .setFooter(`Event ID #${event.id} | Use -delete [ID] to cancel this event.`));
            }
            else if (diff >= (MIN * 30) && diff <= (MIN * 30) + TIMEOUT) { // 30 minutes
              console.log("30 min remind");
              timeMsg = "in 30 minutes";
              channel.send(new Discord.RichEmbed()
              .setColor(color)
              .setTitle("🔔 Event Reminder")
              .setDescription(`Your event, \`${event.name}\`, is happening \`${timeMsg}.\``)
              .setFooter(`Event ID #${event.id} | Use -delete [ID] to cancel this event.`));
            }
            else if (diff >= (MIN * 5) && diff <= (MIN * 5) + TIMEOUT) { // 5 mintues
              console.log("5 min remind");
              timeMsg = "in 5 minutes";
              channel.send(new Discord.RichEmbed()
              .setColor(color)
              .setTitle("🔔 Event Reminder")
              .setDescription(`Your event, \`${event.name}\`, is happening \`${timeMsg}.\``)
              .setFooter(`Event ID #${event.id} | Use -delete [ID] to cancel this event.`));
            }
            else if (diff >= 0 && diff <= TIMEOUT) { // now
              console.log("now remind");
              timeMsg = "now";
              channel.send(new Discord.RichEmbed()
              .setColor(color)
              .setTitle("🔔 Event Reminder")
              .setDescription(`Your event, \`${event.name}\`, is happening \`${timeMsg}.\``)
              .setFooter(`Event ID #${event.id} | Use -delete [ID] to cancel this event.`));
            }
            else if (endDiff >= 0 && endDiff <= TIMEOUT) {
              console.log("end remind");
              channel.send(new Discord.RichEmbed()
              .setColor(color)
              .setTitle("🔕 Event Reminder")
              .setDescription(`Your event, \`${event.name}\`, has ended.`)).then(m => {
                var i = events.list.indexOf(event);
                events.list.splice(i, 1);
                var send = JSON.stringify(events);
                client.db.run(`UPDATE calendar SET events = ? WHERE guild = ?`, [send, guild.id], (err) => {
                  if (err) {
                    console.error("error deleting past event: ", err.message);
                  }
                });
              }).catch(err => {
                console.error(err.message);
              });
            }
          }
        });
      }
    });
  });
}, TIMEOUT);

client.login(process.env.TOKEN);
console.log('Ready');
