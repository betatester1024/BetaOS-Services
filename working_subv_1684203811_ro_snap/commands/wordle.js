const fs = require('node:fs')
let todayWordID = 0;
let FILEDATA;
let todayLeetCODE = [];
let charSet = "0123456789abcdefghijklmnopqrstuvwxyz";
let allWords = [];
let validWords = [];
let prevWordID =0;
let wordChangedQ = false;

fs.readFile(__dirname + '/wordfile.txt', (err, data) => {
  if (err) throw err;
  FILEDATA = data;
  refreshCodes()
})

function refreshCodes() {
  
  validWords = FILEDATA.toString().split("\n");
  let DATE = new Date(Date.now());
  const str = DATE.getHours()+"/"+"/"+Math.floor(DATE.getMinutes()/5)+DATE.toLocaleDateString();
  todayWordID = Math.abs(hashCode(str))%validWords.length;
  if (todayWordID != prevWordID) {
    wordChangedQ = true;
    prevWordID = todayWordID;
  }
  for (let i=0; i<5; i++) {
    todayLeetCODE[i] = charSet[Math.floor((Math.abs(hashCode(str))%Math.pow(10, 5))/Math.pow(10, i))%charSet.length];
  } // for(i)
  console.log(validWords[todayWordID]);
}

fs.readFile(__dirname + '/allwords.txt', (err, data) => {
    if (err) throw err;
 
  allWords = data.toString().split("\n");
})



function hashCode(s) {
  var hash = 0,
    i, chr;
  if (s.length === 0) return hash;
  for (i = 0; i < s.length; i++) {
    chr = s.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

function loopy() {
  setTimeout(loopy, 10000);
  if (FILEDATA) refreshCodes()
} 

wordleCt = 1;
function wordleValidate(msg) {
  if (allWords.indexOf(msg)>=0) {
    let correctWord = validWords[todayWordID].split("");
    let out = "";
    if (msg == validWords[todayWordID]) {
      setTimeout(()=>{wordleCt = 1;}, 200);
      return "Correct word! You won in: "+wordleCt+" moves!";
    }
    for (let i=0; i<5; i++) {
      if (msg.charAt(i) == correctWord[i]) out += "🟩";
      else if (correctWord.indexOf(msg.charAt(i))>=0) out += "🟨";
      else out += "🟥"
    }
    wordleCt++;
    return out;
  }
  else return "That's not a word!";
}

// const { SlashCommandBuilder } = require('discord.js');

// module.exports = {
// 	data: new SlashCommandBuilder()
// 		.setName('wordle')
// 		.setDescription('Play wordle!'),
// 	async execute(interaction) {
// 		return interaction.reply(wordleValidate(interaction));
// 	},
// };

module.exports = {
  name: 'wordle',
  description: 'Play wordle!',
  options: [
    {
      type: 3,
      name: 'word',
      description: 'Guess a word!',
      required: true
    }
  ],
  async execute(interaction) {
    let msg = (interaction.options.data[0].value);
    let nextResetTime = 5*60 - (Date.now()/1000)%(5*60) // how many seconds until next reset.
    let wordChangeStr = wordChangedQ?"[Word reset!] ":"[Word resetting in "+formatTime(nextResetTime)+"] ";
    if (wordChangedQ) wordChangedQ = false;
    return interaction.reply(msg.length==5?wordChangeStr+msg+": "+wordleValidate(msg.toLowerCase()):"FIVE LETTERS, PLEASE!");
  }
}
console.log("LOOPY");
loopy()



function formatTime(seconds) {
  // 1- Convert to seconds:
  seconds = Math.floor(seconds);
  const minutes = Math.floor(seconds / 60); // 60 seconds in 1 minuteseconds
  seconds = Math.floor(seconds%60);
  // 4- Keep only seconds not extracted to minutes:
  return (
    format(minutes) +
    ":" +
    format(seconds)
  );
}

function format(n) {
  return n < 10 ? "0" + n : n;
  }