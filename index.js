///<reference path="database.js"/>

// const loopy = require('./commands/wordle.js')
const token =    process.env['token'];
const guildId = ['911997443179151461', '904916856010326036', '1082162409365585920', '1019943441104375839'];
const clientId = process.env['clientId'];

const { Client, Events, GatewayIntentBits, REST, Routes } = require('discord.js');
const fs = require('node:fs');
// const Database = require("@replit/database");
// const db = new Database();

// import {connectDB} from './database';
// moule.exports = 

const client = new Client({ intents: [GatewayIntentBits.Guilds, 
                                       GatewayIntentBits.GuildMessages,
                                       GatewayIntentBits.MessageContent,
                                       GatewayIntentBits.GuildMembers,] });

client.once(Events.ClientReady, c => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
  try {sendChannel("1166088249626861608", "Logged in!")} 
  catch(e){}
});


function RN(n) 
{
  let out = "";
  let origN = n;
  let thousands = Math.floor(n/1000);
  for (let i=0; i<thousands; i++) out +="M"
  n %= 1000;
  // let hundreds = Math.floor(n/100);
  // for (let i=0; i<thousands; i++) out +="C"
  // n %= 100;
  out += part("C", "D", "M", Math.floor(n/100)%10);
  out += part("X", "L", "C", Math.floor(n/10)%10);
  out += part("I", "V", "X", n%10);
  return out;
}

function part(one, five, ten, val) 
{
  let out = "";
  if (val<4) 
    for (let i=0; i<val; i++) out += one; // I, II, III, X, XX, XXX...
  else if (val == 4) out = one + five;
  else if (val >= 5) {
    out = five;
    for (let i=0; i<val-5; i++) out += one;
  }
  if (val == 9) out = one+ten;
  return out;
}

let words = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]
let tens = ["", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
let weirdWords = ["ERROR", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", 
                  "seventeen", "eighteen", "nineteen", "twenty"];
function wordify(origN) 
{
  let n =origN;
  if (n > 1000*1000*1000) // a billion? nope
    return "number too large"
  if (n < 0)
    return "negative "+wordify(-n);
  if (n%1!=0) // aint an integer
  { 
    let fracPart = n%1;
    let intPart = Math.floor(n);
    let out = wordify(intPart).trim();
    out += " point ";
    // console.log(out)
    while (fracPart %1 != 0) 
    {
      fracPart *=10;
      out+=words[Math.floor(fracPart)%10];
      out += " ";
    }
    return out;
  }
  // if (n == 69) return "😏";
  // sixty-five thousand
  let millions = n>=1000000?(wordify(Math.floor(n/1000000))+" million "):"";
  n = n%1000000;
  let thousandWord = n>=1000?(wordify(Math.floor(n/1000)) + " thousand "):"";
  n %= 1000; // okay now we only have 0-999
  let hIdx = Math.floor(n/100)
  let hundredWord = words[hIdx] + " hundred ";
  if (hIdx == 0) hundredWord = "";
  let tenWord = "";
  n = n%100;
  let tIdx = Math.floor(n/10)
  tenWord = tens[tIdx];
  oneWord = "-"+words[n%10]; // twenty-one
  if (n < 20 && n > 10) // eleven -> twenty
  {
    tenWord = weirdWords[n-10];
    oneWord = "";
  }
  if ((tIdx!=0||n%10!=0) && (hIdx != 0||thousandWord!="")) // hundreds / 10 = tens
    tenWord = "and "+tenWord; // two hundred AND ten, two thousand AND one
  if (n%10 != 0 && tIdx == 0)
    oneWord = words[n%10]; // two thousand and one
  // or two hundred AND two
  if (n%10==0 && origN!=0) {
    oneWord = ""
  }
  if (origN == 0) return "zero";
  else return millions+thousandWord+hundredWord+tenWord+oneWord;
}

function sendChannel(channelID, message) {
  client.channels.cache.get(channelID).send({content:message});
}

function cleanMessage(what) 
{
  // first attempt to parse as numbers
  what = what.trim().toLowerCase()
  what = what.replaceAll(/(-| )/gi, "");
  what = what.replaceAll(/^(zero|0)+/gi, "")
  what = what.replaceAll(/and/gi, "");
  what = what.replaceAll(/fucking/gi, ""); 
  console.log(what);
  // three hundred and fucking five -> three hundred five
  // while (extractWord(what)) 
  return what;
}

const baseDigits = "0123456789ABCDEF"
function toBase(n,base) {
  let digits = [];
  while (n>0) {
    digits.push(n%base);
    n = Math.floor(n/base);
  }
  let out = "";
  for (let i=digits.length-1;i>=0;i--) {
    out += baseDigits[digits[i]];
  }
  return out;
}

function extractWord(text) 
{
  let oneMatch = text.match(/^(zero|one|two|three|four|five|six|seven|eight|nine)/);
  if (oneMatch) {
    one = words.indexOf(oneMatch[1]);
  }
  // let specialMatch = text.match(/^(eleven|twelve|thirteen|fourteen|)/);
}

// client.on('messageDelete', async (message) => {
//   const logs = await message.guild.fetchAuditLogs({
//     type: AuditLogEvent.MessageDelete,
//     limit: 1,
//   });
//   // logs.entries is a collection, so grab the first one
//   const firstEntry = logs.entries.first();
//   const { executorId, target, targetId } = firstEntry;
//   // Ensure the executor is cached
//   const user = await client.users.fetch(executorId);

//   if (target) {
//     // The message object is in the cache and you can provide a detailed log here
//     message.channel.send(`A message by ${target.tag} was deleted by ${user.tag}.`);
//   } else {
//     // The message object was not cached, but you can still retrieve some information
//     message.channel.send(`A message with id ${targetId} was deleted by ${user.tag}.`);
//   }
// });

let lastToCount = "nobody";
// the mute roulete
client.on('messageCreate', async (message) => {
  // console.log("responding to message")
  // mute roulette
  if (message.author.id == process.env["clientId"]) return; // don't mute self
  if (message.author.bot) return;
  const mutePairs = [{receive:"1162397077112897648", log:"1162836582697549874"},
                     {receive:"1165438519146205244", log:"1165438540897861693"}]
  let mutePairIdx = mutePairs.findIndex((obj)=>{
    return obj.receive == message.channel.id;
  });
  if (mutePairIdx >= 0) {
    let rand = Math.random();
    let duration = 0;
    if (rand < 1/100) duration = 7*24*60*60;
    else if (rand < 1/50) duration = 24*60*60;
    else if (rand < 1/10) duration = 60*60;
    else if (rand < 2/5) duration = 10*60;
    else if (rand < 1.8/3) duration = 60;
    else duration = 0;
    // timeout author of message for DURATION
    try {
      if (duration != 0) { 
        await message.member.timeout(duration*1000, "mute roulette");
        await message.react("<:received:1166425913681002526>");
      }
      else await message.react("<:errorbutgreen:1148666149458939966>");
      // send message in channel with ID 1162836582697549874
      client.channels.cache.get(mutePairs[mutePairIdx].log)
      .send({content:"<:confirm:1036758071034269706> <@"+message.author.id+"> has been "+
            (duration == 0?"spared from the mute!":"muted for "+ formatTime(duration*1000)),
             flags: [ 4096 ]});
    } catch(e) 
    {
      try {
        await message.react("<:error:1036760956388265984>");
        client.channels.cache.get(mutePairs[mutePairIdx].log)
        .send({content:"<:error:1036760956388265984> Error occured while muting <@"+message.author.id+">",
               flags: [ 4096 ]});
      } catch(e2){}
    }
    // send messag in the channel
    // console.log("response complete");
    return;
  }
  // originality channel
  if (message.channel.id === "1163233406029676554"
     || message.channel.id === "1165438425814548480") 
  // if (false)
  {
    let originalityObj = await db.findOne({fieldName:"msgContent", content:message.content});
    let originality = originalityObj?originalityObj.count:0;
    // if (!originality) return;i
    if (message.attachments.size > 0 || message.embeds.size > 0) return;
    if (originality > 0) {
      try {
        console.log("ready to delete")
        try {await message.delete();} catch(e) {console.log(e)}// in case the other one deleted first
        console.log("ready to send")
        await message.channel
        .send("<:error:1036760956388265984> <@"+message.author.id+"> Your message of `"+
              message.content+"` was not original "+(originality>1?"- in fact it's been said "+(originality)+" times":""));
        await message.member.timeout(60000, "message was not original");
      } catch(e) 
      {  
        // console.log(e);
        // await message.channel
        // .send("<:error:1036760956388265984> <@"+message.author.id+"> Your message of `"+
              // message.content+"` was not original");
        try {
          await message.channel
          .send("<:error:1036760956388265984> Failed to mute user ")
                  // "<@"+message.user.id+">"); 
        } catch(e2) {}
      }
      await db.updateOne({fieldName:"msgContent", content:message.content},
                         {$inc:{count:1}});
    }
    else {
      try {await message.react("<:received:1166425913681002526>");}
      catch(e) {}
      await db.insertOne({fieldName:"msgContent", content:message.content, count:1});
    }
  }
  // counting
  if (message.channel.id === "1164684168924508170"
     || message.channel.id == "1165438441102786602") 
  {
    if (message.content.match(/^>/)) return;
    if (message.author.id == lastToCount) 
    {
      try {
        await message.delete();
        sendChannel(message.channel.id, 
              "<:error:1036760956388265984> <@"+message.author.id+"> Let somebody else count!");
      } catch(e) {}
      return;
    }
    // for (let i=0; i<numberEmotes.length; i++) 
    // {
      // message.content.replaceAll(numberEmotes[i], i);
    // }

    console.log(message.content);
    let currNumObj = await db.findOne({fieldName:"countingNum", cID:message.channel.id});
    let currNum = currNumObj?currNumObj.count:null;
    if (!currNum) {
      await db.insertOne({fieldName:"countingNum", cID:message.channel.id, count:1});
      currNum = 1;
    }
    let wordified = wordify(currNum);
    let romanNumeralised = RN(currNum);
    // let evalNum = eNum(message.content);
    if (cleanMessage(message.content) == 
      wordified.trim().replaceAll(/(-| |and)/gi, "")
     || (message.content== currNum)
     || (message.content.trim().toUpperCase() == romanNumeralised)
     || toBase(currNum, 2) == message.content.trim().toUpperCase()
     || toBase(currNum, 8) == message.content.trim().toUpperCase()
     || toBase(currNum, 16) == message.content.trim().toUpperCase()) {
      await db.updateOne({fieldName:"countingNum", cID:message.channel.id},
                         {$inc:{count:1}});
      try {
        await message.react("<:received:1166425913681002526>");
      } catch(e) {}
      lastToCount = message.author.id;
    }
    else {
      console.log("ready to delete")
      try {
        await message.delete();
        console.log("ready to send")
        let outFormats = [wordified, romanNumeralised, currNum];
        sendChannel(message.channel.id, "<:error:1036760956388265984> <@"+message.author.id+"> You miscounted! "+
                    "The next number is "+outFormats[Math.floor(Math.random()*3)]+"."+
                    "\n Start your message with a `>` to send comments in this channel.")
      } catch(e) {}
    }
  }
});

client.commands = {};
for (const file of fs.readdirSync('./commands').filter(file => file.endsWith('.js'))) {
  let command = require(`./commands/${file}`);
  client.commands[command.name] = command;
  client.commands["accessadmin"] = 
  {
    name: 'accessadmin',
    description: 'Enter your OTC to access administrative powers',
    options: [
      {
        type: 3,
        name: 'otc',
        description: 'Enter one-time-code here',
        required: true
      }
    ],
    async execute(interaction) {

      let code = (interaction.options.data[0].value);
      if (interaction.guild.id != '911997443179151461') 
        return interaction.reply("<:error:1036760956388265984> Error: You are not in Betatestingland.")
      if (code == process.env['OTC'] && !(await db.findOne({fieldName:"OTCExpiredQ"})).value) {
        // let member = interaction.user;
        // let guild = client.guilds.cache.get('911997443179151461');
        let member = interaction.guild.members.cache.get(interaction.user.id); 
        await db.updateOne({fieldName:"OTCExpiredQ"}, {$set:{value:true}}, {upsert:true});
        try {
          member.roles.add("911997857832247356");
        } catch (e) {}
        return interaction.reply("<:active:1036760969591935056> Role granted, <@"+member.id+">!");
      }
      else return interaction.reply("<:error:1036760956388265984> Incorrect or expired code");
    }
  };
  client.commands ["otcstatus"] = {
    name: 'otcstatus',
    description: 'Administrative access OTC status',
    async execute(interaction) {
      if ((await db.findOne({fieldName:"OTCExpiredQ"})).value) 
        return interaction.reply('<:error:1036760956388265984> OTC has expired');
      else
        return interaction.reply('<:active:1036760969591935056> OTC is active');
    }
  }
  client.commands["echo"] = {
    name: 'echo',
    description: 'Sends the same message.',
    options: [
      {
        type: 3,
        name: 'content',
        description: 'Message to send',
        required: true
      }
    ],
    async execute(interaction) {
      try {
        sendChannel(interaction.channel.id, interaction.options.data[0].value);
        return interaction.reply({content:"<:active:1036760969591935056> Sent!", ephemeral:true})
      }
      catch(e) {
        return interaction.reply({content:"<:error:1036760956388265984> Could not send message", ephemeral:true})
      }
    }
  }

  client.commands["setotcstatus"] = 
  {
    name: 'setotcstatus',
    description: 'Set OTC Status',
    options: [
      {
        type: 3,
        name: 'status',
        description: 'Set status to...',
        choices:[{name:"Expired",value:"yes"}, {name:"Active",value:"no"}],
        required: true
      }
    ],
    async execute(interaction) {
      if (interaction.user.id == "842822970829439037") {
        await db.updateOne({fieldName:"OTCExpiredQ"}, {$set:{value:interaction.options.data[0].value=="yes"}}, {upsert:true});
        return interaction.reply('<:active:1036760969591935056> OTC is '+(interaction.options.data[0].value == "yes"?"expired":"active"));      
      } 
      else
        return interaction.reply('<:error:1036760956388265984> You do not own Betatestingland');
    }
  }
  client.commands["eval"] = {
    name: 'eval',
    description: 'Evaluate JS code (Admin only)',
    options: [
      {
        type: 3,
        name: 'code',
        description: 'Code to evaluate',
        required: true
      },
      {
        type: 5,
        name: 'ephemeral',
        description: 'Evaluate quietly?',
        required: false
      }
    ],
    async execute(interaction) {
      if (process.env["branch"] != "unstable") return interaction.reply("<:error:1036760956388265984>")
      if (interaction.user.id == "842822970829439037") {
        // await db.set("OTCExpiredQ", interaction.options.data[0].value);
        let reply;
        await interaction.deferReply({ephemeral:interaction.options.getBoolean("ephemeral")??false});
        try {
          if (interaction.options.data[0].value.match("return "))
            reply = eval("(()=>{"+interaction.options.data[0].value+"})()");
          else
            reply = eval(interaction.options.data[0].value);
          interaction.editReply('<:active:1036760969591935056> Reply was ```'+reply+"```"); 
        } catch(err)
        {
          interaction.editReply('<:error:1036760956388265984> Failed to execute code: '+err.message); 
        }
      } 
      else
        return interaction.reply('<:error:1036760956388265984> You do not own Betatestingland');
    }
}
}

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands[interaction.commandName];
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});


const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  // const Database = require("@replit/database");
  // const db = new Database();
  // await db.set("OTCExpiredQ", "no");
  // for (let i=0; i<guildId.length; i++) {
    try {
      console.log(`Started refreshing ${Object.keys(client.commands).length} application (/) commands.`);
      // rest.put global application commands using Routes.
      const data = await rest.put(Routes.applicationCommands(clientId), { body: Object.values(client.commands) });
      // remove all guild commands
      // console.log(`Started removing existing guild commands.`);
      // await rest.delete(Routes.applicationGuildCommands(clientId, guildId[0]), { body: [] });
      // console.log(`Successfully removed existing guild commands.`);


      // if (i==0) {
      //   // console.log(client);
      //   let person = client.members.cache.get('955140936315306036');
      //   let testRole = message.guild.roles.cache.find(role => role.id == "1006638403858735124")
      //   member.roles.add(testRole)
      // }
      console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
      console.error(error);
    }
  // }
})();

client.login(token);
// loopy();

// we have a front-end!



try {
  const express = require('express');
  const path = require('path');
  const app = express();
  const port = 4000;
  app.get('/', (req, res) => {
    res.send("We're online!");
  })
  app.listen(port, () => {
    console.log(`Success! Your application is running on port ${port}.`);
  });
} catch(e) {

}



function formatTime(ms, inclMs = false) {
  let day = Math.floor(ms / 1e3 / 60 / 60 / 24);
  ms = ms % (1e3 * 60 * 60 * 24);
  let hr = Math.floor(ms / 1e3 / 60 / 60);
  ms = ms % (1e3 * 60 * 60);
  let min = Math.floor(ms / 1e3 / 60);
  ms = ms % (1e3 * 60);
  let sec = Math.floor(ms / 1e3);
  if (ms < 0)
    return "00:00:00";
  return (day > 0 ? day + "d " : "") + padWithZero(hr) + ":" + padWithZero(min) + ":" + padWithZero(sec) + (inclMs ? "." + padWithThreeZeroes(ms % 1e3) : "");
}
function padWithThreeZeroes(n) {
  if (n < 10)
    return "00" + n;
  if (n < 100)
    return "0" + n;
  return n;
}
function padWithZero(n) {
  return n < 10 ? "0" + n : n;
}



const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.
const uri = 
  `mongodb+srv://DiscordLogin:${process.env['DiscordLogin']}@betaos-datacluster00.d8o7x8n.mongodb.net/?retryWrites=true&w=majority`
  // "mongodb://SystemLogin:"+process.env['dbPwd']+"@ac-rz8jdrl-shard-00-00.d8o7x8n.mongodb.net:27017,ac-rz8jdrl-shard-00-01.d8o7x8n.mongodb.net:27017,ac-rz8jdrl-shard-00-02.d8o7x8n.mongodb.net:27017/?ssl=true&replicaSet=atlas-3yyxq8-shard-0&authSource=admin&retryWrites=true&w=majority";
  // "mongodb+srv://SystemLogin:"+process.env['dbPwd']+"@betaos-datacluster00.d8o7x8n.mongodb.net/?retryWrites=true&w=majority";

// import {DBConnectFailure} from './index';
const mClient = new MongoClient(uri)//, { useNewUrlParser: true, useUnifiedTopology: true });
// const client = cli.connect();
const db = mClient.db('SystemManager').collection("MainStorage");
async function connectDB() {
  try {
    await mClient.connect();  
    console.log("Success! Connected to your database.")
    // console.log(db.updateOne)
    // clearTimeout(DBConnectFailure)
    return null;
  }
  catch(e) {
    console.log(e);
    return e;

  }
}

connectDB();1