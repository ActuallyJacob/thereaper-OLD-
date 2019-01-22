const db = require('../modules/dbcontroller.js');
const config = require('../config/config');
const _ = require('lodash');

// Metadata
module.exports = {
  name: 'disablerole',
  description: 'Disable a role.',
  syntax: `${config.prefix}disablerole [role]`,
  help: 'When a role is disabled, it is added to the database and disallows the bot from giving that role to anyone, including managers. Jacob only.',
  usage: [
    `\`${config.prefix}disablerole [role]\` + Disables the role.`,
  ],
};

module.exports.run = (client, message, args) => {
    if(!message.member.roles.some(r=>["Admin", "Lead Admin", "Co-Founder", "Founder"].includes(r.name)) ){
        return message.reply("The Reaper won't allow this.")
      }else{
  // Support for multiple roles
  const roles = args.split(',').map(arg => _.trim(arg)).filter(Boolean);

  roles.forEach((roleName) => {
    // Find the role in the guild
    const role = message.guild.roles.find(elem => elem.name.toLowerCase() === roleName.toLowerCase());

    // Return if the role doesnt exist.
    if (!role) {
      message.react('❓');
      message.channel.send(`"${roleName}" is not a valid role name, Reaper!.`).then((msg) => {
        msg.delete(5000);
      });
      return;
    }

    // Check if the role is diasbled
    if (db.roleIsDisabled(message.guild, role)) {
      message.react('❌');
      message.channel.send(`"${roleName}" is already disabled, my mans..`).then((msg) => {
        msg.delete(5000);
      });
      return;
    }

    // Disable the role
    db.disableRole(message.guild, role);
    message.react('✅');
  });
}};