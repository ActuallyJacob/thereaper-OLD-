module.exports.run = async (client, msg, args) =>{
  if(!msg.channel.name === "The-Reaper") return msg.reply(`The Reaper directs you to his channel: ${533737764605263872}`);
  else{
    var event = new Object(); // name, date, time, desc
    var forceEnd = false; // determines if the collector was forced to forceEnd
    var d = new Date();
    var time;
    var desc;
  
    msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setTitle("📅 Event Creation Wizard").setDescription("Welcome to the Event Creation Wizard!\n`What would you like to name your event?`").setFooter("Type \"exit\" to leave the creation wizard at any time."));
  
    var startTime = Date.now();
    const collector = new client.discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, {time: 1000000});
    // start collector
    collector.on("collect", m => {
      if (m.content === "exit") {
        forceEnd = true;
        collector.stop();
      }
      else {
        if (event.name === undefined) { // if the event has not been given a name
          event.name = m.content;
          msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setTitle("📅 Event Creation Wizard").addField("Event", `${event.name}`).setDescription(`\`What is the description of this event?\``).setFooter("Type \"exit\" to leave the creation wizard at any time"));
        }
        else if (event.desc === undefined && event.name !== undefined) { // if the description hasn't been defined yet
        console.log(m.content);
        var desc = m.content;
        event.desc = desc;
        console.log("event description: ", event.desc);
        msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setTitle("📅 Event Creation Wizard").addField("Event", `${event.name}`).addField("Description", `${event.desc}`).setDescription(`\`What date is the event taking place? (Use MM/DD/YYYY format)\``).setFooter("Type \"exit\" to leave the creation wizard at any time"));
        }
        else if (event.date === undefined && event.name !== undefined && event.desc !== undefined) { // if the event has not been given a date
          var split = m.content.split('/');
          split[0] = parseInt(split[0]); //month
          split[1] = parseInt(split[1]); //day
          split[2] = parseInt(split[2]); //year
          var currDate = new Date();
          // check if date has already passed
          if (split[2] < currDate.getFullYear() || (split[2] <= currDate.getFullYear() && (split[0] - 1) < currDate.getMonth()) || (split[2] <= currDate.getFullYear() && (split[0] - 1) <= currDate.getMonth() && split[1] < currDate.getDay())) {
            msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setTitle("📅 Event Creation Wizard").setDescription("That date has already passed! Please enter a different date.").setFooter("Type \"exit\" to leave the creation wizard at any time"));
          }
          if (!m.content.includes('/')){
            msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setTitle("📅 Event Creation Wizard").setDescription("Please include a '/' between the month, day and year. E.g. 01/01/2020").setFooter("Type \"exit\" to leave the creation wizard at any time"));
          }
          else {
            d.setMonth(split[0] - 1, split[1]);
            d.setYear(split[2]);
            event.date = split;
            console.log("Date: ", d.getMonth(), d.getDay(), d.getFullYear());
            msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setTitle("📅 Event Creation Wizard").addField("Event", `${event.name}`).addField("Description", `${event.desc}`).addField("Date", `${d.toDateString()}`).setDescription(`\`What time is the event taking place? (Use HH:MM AM/PM format)\``).setFooter("Type \"exit\" to leave the creation wizard at any time"));
          }
        }
        else if (event.time === undefined && event.name !== undefined && event.desc !== undefined && event.date !== undefined) { // if the time hasn't been defined yet
          time = m.content;
          event.time = time;
          console.log("Time: ", event.time);
          msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setTitle("📅 Event Creation Wizard").addField("Event", `${event.name}`).addField("Description", `${event.desc}`).addField("Date", `${d.toDateString()}`).addField("Time", `${time}`).setDescription(`\`How long do you think this will take?\``).setFooter("Type \"exit\" to leave the creation wizard at any time"));
        }
        else if (event.este === undefined && event.name !== undefined && event.desc !== undefined && event.date !== undefined && event.time !== undefined ) { // if estimate time doesnt exist
          est = m.content;
          event.este = est;
          console.log("Estimated time: ", event.este);
          msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setTitle("📅 Event Creation Wizard").addField("Event", `${event.name}`).addField("Description", `${event.desc}`).addField("Date", `${d.toDateString()}`).addField("Time", `${time}`).addField("Estimated Time:", `${event.este}`).setDescription(`\`Is this correct? Type YES to confirm.\``).setFooter("Type \"exit\" to leave the creation wizard at any time"));
          
        }
        else if (event.este !== undefined && m.content.toLowerCase() === "yes") {
          msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setTitle("📅 Event Creation Wizard").setDescription("Event Created!"))
          collector.stop();
        }
      }
    });
    //post event (collector stops)
    collector.on("end", c => {
      console.log(forceEnd);
      if (forceEnd == true) { // if the collector has been forced to end
        msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setTitle("📅 Event Creation Wizard").setDescription("Event creation has been cancelled"));
      }
      else if (Date.now() >= startTime + 1000000) { // if time ran out
        msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setTitle("📅 Event Creation Wizard").setDescription("Event creation has timed out"));
      }
      else { // if all the parameters have been given
        const grim = client.emojis.find(emoji => emoji.name === "grim");
        msg.guild.channels.find("name", "events-test").send(new client.discord.RichEmbed().setColor(client.color).setTitle("__**REAPER CLAN EVENT**__").addField("__Event:__", `${event.name}`).addField(`${event.desc}`).addField("__Date:__", `${d.toDateString()}`).addField("__Time:__", `${time}`).addField("Estimated Time:", `${event.este}`).setDescription(`${grim} | Welcome to the madhouse, Guardian! | react with 💀 to delete this event`)).then(m => {
          event.id = m.id;
          event.fullDate = d; // the full date object
          event.attending = [];
          event.cantGo = [];
          event.maybe = [];
          console.log(event);
          m.react("✅").then(console.log("check")).catch(console.error);
          m.react("❓").then(console.log("question")).catch(console.error);
          m.react("❌").then(console.log("x")).catch(console.error);
  
          client.db.get(`SELECT events FROM calendar WHERE guild = ${msg.guild.id}`, (err, row) => {
            if (err) {
              console.error("Create.js selection error: ", err);
            }
            if (!row) { // if server was just added to the table or if there's a bug?
              console.log("create.js new insertion");
              var obj = {
                list: [event]
              };
              var newEvents = JSON.stringify(obj);
              client.db.run("INSERT INTO calendar (guild, events, notifs, channel) VALUES (?, ?, ?, ?)", [msg.guild.id, newEvents, 1, "010010001110"], (err) => {
                if (err) {
                  console.error("Create.js insertion error: ", err);
                }
                console.log("Object after insertion: ", this.events);
              });
            }
            else { // if the server already exists in the table
              console.log("create.js updating existing object");
              var old = JSON.parse(row.events);
              if (old === null) {
                old.list = [event];
              }
              else {
                old.list.push(event);
              }
              console.log(old);
              var newEvent = JSON.stringify(old);
              client.db.run("UPDATE calendar SET events = ? WHERE guild = ?", [newEvent, msg.guild.id], (err) => {
                if (err) {
                  console.error("Create.js update error: ", err);
                }
                console.log("Updated object after insertion: ", this.event);
              });
            }
        });
  
        // collects reactions
        const emojis = { // stores emojis
          GOING: "✅",
          MAYBE: "❓",
          NO: "❌",
          SKULL: "💀"
        };
        const reactCollector = new client.discord.ReactionCollector(m,  (r, user) => Object.values(emojis).includes(r.emoji.name), {maxUsers: msg.guild.memberCount});
        reactCollector.on("collect", (r, coll) => {
            switch(r.emoji.name) {

              case emojis.GOING: // if the checkmark is clicked
                client.db.get(`SELECT events FROM calendar WHERE guild = ${msg.guild.id}`, (err, row) => {
                  var events = JSON.parse(row.events);
                  var index;
                  var get = events.list.filter(e => { // get the event to update
                    if (e.id === event.id) {
                      index = events.list.indexOf(e);
                      return e;
                    }
                  });
                  var userArr = coll.users.array();
                  var user = userArr[userArr.length - 1];
                  events.list.splice(index, 1);
                  let alreadyGoing = false;
                  if (get[0].attending.includes(user.id)) {
                    alreadyGoing = true;
                    events.list.push(get[0]);
                  }
                  if (user.id !== client.config.bot_id && !alreadyGoing) {
                    get[0].attending.push(user.id);
                    events.list.push(get[0]);
                    var send = JSON.stringify(events);
                    client.db.run(`UPDATE calendar SET events = ? WHERE guild = ?`, [send, msg.guild.id], (err) => {
                      if (err) {
                        console.error("create.js update error: ", err);
                      }
                      // get name of user who clicked the reaction
                      var name;
                      msg.guild.fetchMember(user.id).then(usr => {name = usr.displayName});
                      // generate list of people who are going
                      var attending = events.list[events.list.length - 1].attending;
                      var attStr = "";
                      for (var i = 0; i < attending.length; i++) {
                        var usr = client.users.get(attending[i]);
                        attStr += `${msg.guild.member(usr).displayName}, `;
                      }
  
                      // people who might go
                      var maybe = events.list[events.list.length - 1].maybe;
                      var mayStr = "";
                      for (var i = 0; i < maybe.length; i++) {
                        var usr = client.users.get(maybe[i]);
                        mayStr += `${msg.guild.member(usr).displayName}, `;
                      }
                      if (mayStr === "") {
                        mayStr = "None";
                      }
                      // people who can't go
                      var cant = events.list[events.list.length - 1].cantGo;
                      var cantStr = "";
                      for (var i = 0; i < cant.length; i++) {
                        var usr = client.users.get(cant[i]);
                        cantStr += `${msg.guild.member(usr).displayName}, `;
                      }
                      if (cantStr === "") {
                        cantStr = "None";
                      }
                      else if (user.id !== client.config.bot_id && alreadygoing) {
                        var name;
                        msg.guild.fetchMember(user.id).then(usr => {name = usr.displayName});
                        // generate list of people who are going
                        var attending = events.list[events.list.length - 1].attending;
                        var attStr = "";
                        for (var i = 0; i < attending.length; i++) {
                          var usr = client.users.get(attending[i]);
                          attStr -= `${msg.guild.member(usr).displayName}, `;
                        }
                      }
                      m.edit(new client.discord.RichEmbed().setColor(client.color).setTitle("__**REAPER CLAN EVENT**__").addField("__Event:__", `${event.name}`).addField(`${event.desc}`).addField("__Date:__", `${d.toDateString()}`).addField("__Time:__", `${time}`).addField("Estimated Time:", `${event.este}`).addField(`${emojis.GOING} Attending`, `${attStr}`).addField(`${emojis.MAYBE} Might go`, `${mayStr}`).addField(`${emojis.NO} Can't go`, `${cantStr}`).setDescription(`${grim} | Welcome to the madhouse, Guardian! | react with 💀 to delete this event`)).then(msg => {
                      }).catch(console.error);
                    });
                  }
                });
              break;
  
              case emojis.MAYBE: // if the question mark is clicked
                client.db.get(`SELECT events FROM calendar WHERE guild = ${msg.guild.id}`, (err, row) => {
                  var events = JSON.parse(row.events);
                  var index;
                  var get = events.list.filter(e => { // get the event to update
                    if (e.id === event.id) {
                      index = events.list.indexOf(e);
                      return e;
                    }
                  });
                  events.list.splice(index, 1);
                  var userArr = coll.users.array();
                  var user = userArr[userArr.length - 1];
                  let alreadyMaybe = false;
                  if (get[0].maybe.includes(user.id)) {
                    alreadyMaybe = true;
                    events.list.push(get[0]);
                  }
                  if (user.id !== client.config.bot_id && !alreadyMaybe) {
                    get[0].maybe.push(user.id);
                    events.list.push(get[0]);
                    var send = JSON.stringify(events);
                    client.db.run(`UPDATE calendar SET events = ? WHERE guild = ?`, [send, msg.guild.id], (err) => {
                      if (err) {
                        console.error("create.js update error: ", err);
                      }
                      var name;
                      msg.guild.fetchMember(user.id).then(usr => {name = usr.displayName});
                      var attending = events.list[events.list.length - 1].attending;
                      var attStr = "";
                      //attending
                      for (var i = 0; i < attending.length; i++) {
                        var usr = client.users.get(attending[i]);
                        attStr += `${msg.guild.member(usr).displayName}, `;
                      }
                      if (attStr === "") {
                        attStr = "None";
                      }
                      //maybe
                      var maybe = events.list[events.list.length - 1].maybe;
                      var mayStr = "";
                      for (var i = 0; i < maybe.length; i++) {
                        var usr = client.users.get(maybe[i]);
                        mayStr += `${msg.guild.member(usr).displayName}, `;
                      }
                      //cant
                      var cant = events.list[events.list.length - 1].cantGo;
                      var cantStr = "";
                      for (var i = 0; i < cant.length; i++) {
                        var usr = client.users.get(cant[i]);
                        cantStr += `${msg.guild.member(usr).displayName}, `;
                      }
                      if (cantStr === "") {
                        cantStr = "None";
                      }
                      m.edit(new client.discord.RichEmbed().setColor(client.color).setTitle("__**REAPER CLAN EVENT**__").addField("__Event:__", `${event.name}`).addField(`${event.desc}`).addField("__Date:__", `${d.toDateString()}`).addField("__Time:__", `${time}`).addField("Estimated Time:", `${event.este}`).addField(`${emojis.GOING} Attending`, `${attStr}`).addField(`${emojis.MAYBE} Might go`, `${mayStr}`).addField(`${emojis.NO} Can't go`, `${cantStr}`).setDescription(`${grim} | Welcome to the madhouse, Guardian! | react with 💀 to delete this event`)).then(msg => {
                      }).catch(console.error);
                    });
                  }
                });
              break;
  
              case emojis.NO: // if the x is clicked
                client.db.get(`SELECT events FROM calendar WHERE guild = ${msg.guild.id}`, (err, row) => {
                  var events = JSON.parse(row.events);
                  var index;
                  var get = events.list.filter(e => { // get the event to update
                    if (e.id === event.id) {
                      index = events.list.indexOf(e);
                      return e;
                    }
                  });
                  events.list.splice(index, 1);
                  var userArr = coll.users.array();
                  var user = userArr[userArr.length - 1];
                  let alreadyCant = false;
                  if (get[0].cantGo.includes(user.id)) {
                    alreadyCant = true;
                    events.list.push(get[0]);
                  }
                  if (user.id !== client.config.bot_id && !alreadyCant) {
                    get[0].cantGo.push(user.id);
                    events.list.push(get[0]);
                    var send = JSON.stringify(events);
                    client.db.run(`UPDATE calendar SET events = ? WHERE guild = ?`, [send, msg.guild.id], (err) => {
                      if (err) {
                        console.error("create.js update error: ", err);
                      }
                      var name;
                      // attending
                      msg.guild.fetchMember(user.id).then(usr => {name = usr.displayName});
                      var attending = events.list[events.list.length - 1].attending;
                      var attStr = "";
                      for (var i = 0; i < attending.length; i++) {
                        var usr = client.users.get(attending[i]);
                        attStr += `${msg.guild.member(usr).displayName}, `;
                      }
                      //maybe
                      var maybe = events.list[events.list.length - 1].maybe;
                      var mayStr = "";
                      for (var i = 0; i < maybe.length; i++) {
                        var usr = client.users.get(maybe[i]);
                        mayStr += `${msg.guild.member(usr).displayName}, `;
                      }
                      if (mayStr === "") {
                        mayStr = "None";
                      }
                      //cannot
                      var cant = events.list[events.list.length - 1].cantGo;
                      var cantStr = "";
                      for (var i = 0; i < cant.length; i++) {
                        var usr = client.users.get(cant[i]);
                        cantStr += `${msg.guild.member(usr).displayName}, `;
                      }
                      m.edit(new client.discord.RichEmbed().setColor(client.color).setTitle("__**REAPER CLAN EVENT**__").addField("__Event:__", `${event.name}`).addField(`${event.desc}`).addField("__Date:__", `${d.toDateString()}`).addField("__Time:__", `${time}`).addField("Estimated Time:", `${event.este}`).addField(`${emojis.GOING} Attending`, `${attStr}`).addField(`${emojis.MAYBE} Might go`, `${mayStr}`).addField(`${emojis.NO} Can't go`, `${cantStr}`).setDescription(`${grim} | Welcome to the madhouse, Guardian! | react with 💀 to delete this event`)).then(msg => {
                      }).catch(console.error);
                    });
                  }
                });
              break;

              case emojis.SKULL: //if reacted with skull
              var toDel = m.id;
              client.db.get(`SELECT events FROM calendar WHERE guild = ${msg.guild.id}`, (err, row) => {
                if (err) { // if an error occurs
                  console.log("no the error is here");
                  console.error("Delete.js selection error: ", err.message);
                  msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setDescription("❗️This server has no events to delete!"));
                }
                if (!row) { // if the server does not have any events
                  msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setDescription("❗️This server has no events to delete!"));
                }
                var json = JSON.parse(row.events);
                json.list = json.list.filter((event) => { // filter out the current array of events to exclude the array that will be deleted
                  if (event.id !== toDel) {
                    return event;
                  }
                });
                var insert = JSON.stringify(json); // updated array
                console.log(typeof insert);
                client.db.run(`UPDATE calendar SET events = ? WHERE guild = ?`, [insert, msg.guild.id], (err) => {
                  if (err) {
                    console.error("Delete.js update error: ", err.message);
                  }
                  else {
                    m.delete();
                    }
                  });
              });
            }
        });
  
      }).catch(console.error);
      }
    });
  }
}
