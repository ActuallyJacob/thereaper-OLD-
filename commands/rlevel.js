const config = require('../config/config');

//metadata
module.exports = {
  name: 'rlevel',
  syntax: `${config.prefix}rlevel [add/remove] {level} (role)`,
  description: 'Adds or removes a role to a level. Admin only',
  help: 'Adds or removes the specified role to the specified level, example: -rlevel add 10 Reaper. Admin only.',
  usage: [
    `\`${config.prefix}rlevel [add/remove] {level} (role)\` + Creates or removes a role for a level.`,
  ],
};
exports.run = (client, message, args, sql) =>{
  if(!message.member.roles.some(r=>["Admin", "Lead Admin", "Co-Founder", "Founder"].includes(r.name)) ){
    return message.reply("The Reaper requests somebody of proper position, Guardian.")
  }else{
      let condition = args[0];
      if (condition == "add"){
        let alvl = args[1];
        let pRole = args.splice(2);
        let nRole = message.guild.roles.find("name", pRole.join(" "));

        if (!nRole){
          message.reply(`There is no role named ${pRole.join(" ")}`);
        }else{
          sql.get(`SELECT * FROM levelRoles WHERE guildID = ${message.guild.id} AND roleID = ${nRole.id}`).then(oRole =>{
            if (!oRole){
              sql.run(`INSERT INTO levelRoles (guildID, roleID, roleName, level) VALUES (?,?,?,?)`,[message.guild.id, nRole.id, pRole.join(" "), alvl]);
              message.reply(`${pRole} has been set for level ${alvl}.`)
            }else{
              sql.run(`UPDATE levelRoles SET guildID = ${message.guild.id} AND roleID = ${nRole.id} AND roleName = ${pRole.join(" ")} AND level = ${alvl} WHERE guildID='${message.guild.id}' AND level='${alvl}'`);
              message.reply(`${pRole} has been updated for level ${alvl}.`)
            }
          }).catch(() =>{
            message.reply("need to create table");
          })
        }
      }else if(condition == "remove"){
        let pRole = args.splice(1);
        let nRole = message.guild.roles.find("name", pRole.join(" "));
        if(!nRole){
          message.reply(`There is no role named ${pRole.join(" ")}.`);
        }else{
          sql.run(`DELETE FROM levelRoles WHERE guildID = ${message.guild.id} AND roleID = ${nRole.id}`);
          message.reply(`${pRole.join(" ")} has been removed from rlevel.`);
        }
      }else{
        message.reply("Please use the rlevel add or remove to remove or add a role.")
        .catch((err) => {
          message.react('❌');
          message.channel.send(err.message);
      });
    };
  };
};
