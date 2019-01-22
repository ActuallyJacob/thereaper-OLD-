const db = require('../modules/dbcontroller.js');
const config = require('../config/config');
const _ = require('lodash');

// Metadata
module.exports = {
  name: 'enablecommand',
  syntax: `${config.prefix}enablecommand [command]`,
  description: 'Enable a command.',
  help: 'Primarily used to undo the `disablecommand` command. This opens up the command to be able to be used by the general user. Do not enable commands that only an Admin/Manager should have access to. Admin only.',
  usage: [
    `\`${config.prefix}enablecommand [command]\` + Removes restrictions on a specific command.`,
  ],
};

module.exports.run = (client, message, args) => {
    if(!message.member.roles.some(r=>["Admin", "Lead Admin", "Co-Founder", "Founder"].includes(r.name)) ){
        return message.reply("The Reaper won't allow this.")
      }else{
  // Support for multiple commands, filter on Boolean removes empty strings.
  const commands = args.split(',').map(arg => _.trim(arg)).filter(Boolean);

  commands.forEach((commandName) => {
    // Return if the command doesnt exist.
    if (!clientcommands.some(elem => elem.name === commandName)) {
      message.react('❓');
      message.channel.send(`"${commandName}" is not a valid command, Reaper!.`).then((msg) => {
        msg.delete(5000); // Delete the message five seconds
      });
      return;
    }

    // Check if the command is diasbled
    if (!db.commandIsDisabled(message.guild, commandName)) {
      message.react('❌');
      message.channel.send(`"${commandName}" is already enabled, my mans..`).then((msg) => {
        msg.delete(5000); // Delete message after five seconds
      });
      return;
    }

    // Enable the role
    db.removeDisabledCommand(message.guild, commandName);
    message.react('✅');
  });
}};