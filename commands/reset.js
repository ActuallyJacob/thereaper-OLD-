exports.run = (message, sql) =>{
  if(!message.member.roles.some(r=>["Admin", "Lead Admin", "Co-Founder", "Founder"].includes(r.name)) ){
      return message.reply("The Reaper denies. He simply denies.");
    }else{
        const rMember = message.guild.member(message.mentions.users.first());
        if(!rMember){
            message.reply("Please choose a member by mentioning them. Example: -reset @UserName");
        }else{
            sql.run(`UPDATE userScores SET globalPoints=0, weeklyPoints=0, uLevel=1, nextPL=50 WHERE userID=${rMember.user.id} AND guildID=${message.guild.id}`);
            sql.all(`SELECT userID from userScores WHERE guildID = '${message.guild.id}' ORDER BY globalPoints DESC`).then(rColumns =>{
                const setRankUsers = rColumns.map(z => z.userID);
                let i = 0;
                while(setRankUsers[i]){
                  sql.run(`UPDATE userScores SET globalRank = ${i + 1} WHERE userID=${setRankUsers[i]} AND guildID=${message.guild.id}`);
                  i++
                }//while loop end
              })
            message.reply(`${rMember.user.username} has been reset.`);
        }
      }
    }
  