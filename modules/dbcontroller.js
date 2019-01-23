const low = require('lowdb');
const _ = require('lodash');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

const defaults = require('../config/defaults');

class DBController {
  // Initialize the database
  static initDatabase() {
    if (_.isEmpty(db.value())) {
      db.defaults({
        guilds: [],
      }).write();
    }
  }

  // Adds a guild
  static addGuild(guild) {
    db.get('guilds').push({
      guildID: guild.id,
      users: [],
      disabledCommands: defaults.disabledCommands
    }).write();
  }

  // Remove a guild
  static deleteGuild(guild) {
    db.get('guilds').remove({
      guildID: guild.id,
    }).write();
  }

  // Adds a user to a guild
  static addUserToGuild(guild, user) {
    // Check if the user already exists in the guild
    if (db.get('guilds').find({
      guildID: guild.id,
    }).get('users').find({
      userID: user.id,
    })
      .value()) {
      return;
    }

    // Add the user to the guild
    db.get('guilds').find({
      guildID: guild.id,
    }).get('users').push({
      userID: user.id,
      extraCommands: [],
      email: '',
    })
      .write();
  }

  // Returns true if the guild is already in the db
  static guildExists(guild) {
    return !!db.get('guilds').find({ guildID: guild.id }).value();
  }

  // Checks if a command is already disabled
  static commandIsDisabled(guild, command) {
    return db.get('guilds').find({
      guildID: guild.id,
    }).get('disabledCommands').includes(command)
      .value();
  }
}


module.exports = DBController;