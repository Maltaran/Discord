const Discord = require('discord.js');
const fetch = require('node-fetch');
const bot = new Discord.Client();
const admins = ["Maltaran#6060"];

const clear = function(ch) {
  return new Promise(function(resolve, reject) {
    ch.messages.fetch().then(messages => { 
      ch.bulkDelete(messages);
      resolve();
    });
  });
}

bot.on('ready', () => {
  console.log('Logged in!');
  bot.channels.fetch('684036840088404019').then((channel) => channel.messages.fetch('853629500826320916', true));
});

bot.on("messageReactionAdd", (reaction, user) => {
  if (user.bot) return;
  if (reaction.emoji.name != "BonusBoost") return;
  if (reaction.message.id != '853629500826320916') return;
  var role = reaction.message.guild.roles.cache.find(role => role.name === "Multiplayer");
  reaction.message.guild.members.cache.get(user.id).roles.add(role);
});

bot.on("messageReactionRemove", (reaction, user) => {
  if (user.bot) return;
  if (reaction.emoji.name != "BonusBoost") return;
  if (reaction.message.id != '853629500826320916') return;
  var role = reaction.message.guild.roles.cache.find(role => role.name === "Multiplayer");
  reaction.message.guild.members.cache.get(user.id).roles.remove(role);
});

var ignores = [];
var lastpts = "";

bot.on('message', (message) => {
  if (message.author.bot) return;
  if (ignores.includes(message.author.tag)) {
    ignores.splice(ignores.indexOf(message.author.tag), 1);
    return;
  }
  if (message.content.charAt(0) == '!') {
    var args = message.content.substring(1).split(' ');
    var cmd = args[0];
    
    args = args.splice(1);
    switch(cmd) {
      case 'test':
        message.channel.send('Bot is working correctly! (At least I hope so)');
      break;
      case 'kiraa':
        message.channel.send('Kiraa96 is cool dude!');
      break;
      case 'info':
        message.channel.send('This bot was created by Maltaran for this server only.\nIf you have any ideas how to improve it, just write to him!');
      break;
      case 'debug':
        message.channel.send('ID of this channel: ' + message.channel.id + '\nLast person who refreshed points: ' + lastpts);
      break;
      case 'ignore':
        ignores.push(message.author.tag);
        return;
      break;
	    case 'clear':
        if (admins.includes(message.author.tag)) clear(message.channel);
        else message.channel.send('Access denied!');
      break;
      case 'shutdown':
        if (admins.includes(message.author.tag)) {
          message.channel.send('The bot has been turned off.').then(() => {
            try {bot.destroy();}
            catch {message.channel.send('An error occurred while shutting down...')}
          });
        }
        else message.channel.send('Access denied!');
      break;
    }
  }
  if (message.channel.id == '684473050821034017') {
    lastpts = message.author.tag;
    var names = {"xd16z069":"8 Ball","kwj3kezd":"Adrenaline","xd16z569":"Art attack","xd0le71d":"Well's Bells","o9xky21w":"Bob's leg","ewpe2qz9":"Cannon man","z98eojl9":"Kick'em all","r9grm3kw":"Sweet tooth","xd02p7j9":"Downtown any%","495yq8jw":"Downtown 100%","rw6r7v7w":"Black out","ywenv2rw":"Fast Food","rdqgm119":"Fortified race","29vj8kn9":"Stronghold","kwj3kyzd":"Gone with the Wind","5wk8mrqw":"The persuaders","rw6r7n7w":"Half pipe","gdrg0jzw":"Ice scream","69zxlrod":"Last and furious","ywenv4rw":"Life on the edge","xd4n53pw":"Mona racer","xd4n56pw":"My balloons","kwj3k31d":"My way","o9xkyl1w":"Par 5","z98eo8l9":"Penguin carnage","nwlnm6rd":"Time attack","y9mymp19":"Rock and Race","owolmkyw":"Table Royale","xd0le01d":"Sugar rush","495yqjjw":"Heavy croquet","59236jrd":"Speed racer","59236ord":"From the sky","5d7lj7v9":"Foosball","n938x0ew":"Tea time","5d7lj3v9":"Thin line","rdqgm019":"Room for dessert","rdnrm5vw":"Titanic","ewpe2pz9":"Toy Race","nwlnmgrd":"Training day","29vj8yn9":"Toygara falls","y9myme19":"Wax on","ldyjrezd":"White soccer","n938xgew":"Cold rush","rdnrmpvw":"On the rocks","owolm2yw":"Gravity zero","z27l91zd":"Full game [ANY%]","rklqzvw2":"Full game [100%]","ndx9l8od":"All Antarctic","jdz7vzrk":"All Powerups","5dw7vnnk":"All Battle Flags"};
    var tracks = {};
    var users = {"qjo0wmnj":{name:"Maltaran",points:0,maps:[]},"o86w6o5x":{name:"kiraa96",points:0,maps:[]},"zx7dqovx":{name:"jeryrep",points:0,maps:[]},"0jmrk1n8":{name:"alexinho.k",points:0,maps:[]},"pj025qw8":{name:"Ikdro",points:0,maps:[]},"pj0kz2r8":{name:"Depresivie",points:0,maps:[]},"81409038":{name:"Oleksik_PL",points:0,maps:[]},"8l0reo78":{name:"TwinTurbo122",points:0,maps:[]},"j5wre7wj":{name:"Hawk0817",points:0,maps:[]},"xz9k6w08":{name:"PlayerOne",points:0,maps:[]},"j96edknj":{name:"Raszta55",points:0,maps:[]},"8qr4erqj":{name:"xKubSon",points:0,maps:[]},"8grg39yx":{name:"uZer",points:0,maps:[]}};
    const loadmuchdata = function(todo) {
      return new Promise(function(resolve, reject) {
        fetch('https://www.speedrun.com/api/v1/runs?game=369p8x81&status=verified&max=200&offset='+(200*(todo-1))).then(r => r.json()).then(obj => {
          obj.data.forEach(i => {
            var cattmp = i.category == "z27l9wzd" ? i.level : i.category;
            var playertmp = i.players[0].rel == "user" ? i.players[0].id : i.players[0].name;
            if (typeof tracks[cattmp] == "undefined") {tracks[cattmp] = {players:[playertmp],runs:1};}
            else if (tracks[cattmp].players.includes(playertmp)) {tracks[cattmp].runs++;}
            else {tracks[cattmp].players.push(playertmp); tracks[cattmp].runs++;}
          });
          if (todo > 1) loadmuchdata(todo-1).then(() => resolve());
          else resolve();
        });
      });
    }
    loadmuchdata(2).then(() => {
      clear(message.channel).then(messages => {
        for (i in tracks) {
          if (typeof tracks[i].players == "undefined") tracks[i].prestige = 0;
          else tracks[i].prestige = 100 - 100*Math.pow(0.9551,tracks[i].players.length)*Math.pow(0.98,tracks[i].runs);
        };    
        fetch('https://www.speedrun.com/api/v1/games/369p8x81/records?top=10&max=200').then(r => r.json()).then(obj => {
          obj.data.forEach(i => {
            if (i.runs.length) {
              var base = i.category == "z27l9wzd" ? 15 : names[i.category].includes("Full game") ? 40 : 30;
              var cattmp = i.category == "z27l9wzd" ? i.level : i.category;
              if (cattmp == "kwj3kezd") base += 15; // Adrenaline
              if (cattmp == "kwj3k31d") base += 12; // My Way
              if (cattmp == "y9mymp19") base += 8;  // Rock and Race
              if (cattmp == "n938x0ew") base += 5;  // Tea time
              if (cattmp == "xd4n53pw" || cattmp == "owolm2yw" || cattmp == "rdnrmpvw") base += 3; // Mona racer, Gravity zero, On the rocks (long races)
              if (cattmp == "xd16z069" || cattmp == "xd16z569" || cattmp == "y9myme19" || cattmp == "kwj3kyzd" || cattmp == "ewpe2qz9" || cattmp == "owolmkyw" || cattmp == "z98eojl9" || cattmp == "z98eo8l9" || cattmp == "o9xkyl1w") base -= 2.5; // Bowling etc (unsure categories 2)
              if (cattmp == "nwlnmgrd") base -= 4;  // Training day
              if (cattmp == "59236ord" || cattmp == "29vj8yn9") base -= 5; // From the sky, Toygara falls (extremely random, times very close to each other)
              if (cattmp == "xd4n56pw") base -= 7; // My balloons (just unfair)
              var mul = i.category == "z27l9wzd" ? 1 : i.category == "5dw7vnnk" ? 1.6 : i.category == "z27l91zd" ? 2.1 : 2;
              i.runs.forEach(j => {
                var pts = 0;
                var playertmp = j.run.players[0].rel == "user" ? j.run.players[0].id : j.run.players[0].name;
                if (j.place == 1) pts = base + tracks[cattmp].prestige*mul;
                else if (j.place == 2) pts = (base+tracks[cattmp].prestige*mul)*Math.max(0.25,0.25+(base-20)/240,(1+(1-j.run.times.primary_t/i.runs[0].run.times.primary_t)/0.04)*0.3+0.25);
                else if (j.place == 3) pts = (Math.floor(base/10) + tracks[cattmp].prestige*mul/10) * Math.max(1,(1+(1-j.run.times.primary_t/i.runs[0].run.times.primary_t)/0.05)*3);
                if (typeof users[playertmp] == "undefined") users[playertmp] = {name:playertmp,points:0,maps:[]}
                if (j.place > 0) users[playertmp].maps.push({name:names[cattmp],place:j.place,points:pts});
                users[playertmp].points += pts;
              });
            }
          });
          for (u in users) users[u].maps.sort((a,b) => {
            if (a.points < b.points) return 1;
            if (a.points > b.points) return -1;
            if (a.place > b.place) return 1;
            if (a.place < b.place) return -1;
            return 0;
          });
          var toshow = [];
          for (u in users) toshow.push(u);
          toshow.sort((a,b) => {
            if (users[a].points < users[b].points) return 1;
            if (users[a].points > users[b].points) return -1;
            return 0;
          });  
          var s;
          toshow.forEach((u, i) => {        
            if (i < 4) s = "";
            if (users[u].points > 5) {
            s += "**\n" + users[u].name.toUpperCase() + "\n**";
              users[u].maps.forEach(m => {
                if (m.points > 0) s += m.name + " (" + m.place + "): **" + m.points.toFixed(2) + "**\n";
              });
            }
            if (i < 3) message.channel.send(s);
          });
          message.channel.send(s);
          s = "**\n ---------------------------- \n\n"
          toshow.forEach(u => {                                    
            if (users[u].points > 5) s += users[u].name + " - " + users[u].points.toFixed(0) + " points\n";
          });
          s += "**\nTo refresh write anything"
          message.channel.send(s);                            
        });                 
      });
    });
  }
});

bot.login(process.env.KEY);
