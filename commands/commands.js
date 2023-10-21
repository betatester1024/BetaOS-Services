
const STARTTIME = Date.now();
function getUptimeStr() {
  let timeElapsed = Date.now() - STARTTIME;
  let date = new Date(Date.now());
  return (
    `BetaOS SystemManager has been up since ${date.getFullYear()}-${format(date.getMonth() + 1)}-${format(date.getDate())} (It's been ${formatTime(timeElapsed)})`
  );
}


function formatTime(ms) {
  // 1- Convert to seconds:
  let seconds = ms / 1000;
  // 2- Extract hours:
  const days = Math.floor(seconds / 3600 / 24);
  seconds = seconds % (3600 * 24);
  const hours = Math.floor(seconds / 3600); // 3,600 seconds in 1 hour
  seconds = seconds % 3600; // seconds remaining after extracting hours
  // 3- Extract minutes:
  const minutes = Math.floor(seconds / 60); // 60 seconds in 1 minute
  // 4- Keep only seconds not extracted to minutes:
  seconds = Math.floor(seconds);
  seconds = seconds % 60;
  return (
    (days == 0 ? "" : days + " day"+(days==1?"":"s")+", ") +
    format(hours) +
    ":" +
    format(minutes) +
    ":" +
    format(seconds)
  );
}

function format(n) {
  return n < 10 ? "0" + n : n;
}


module.exports = {
  name: 'uptime',
  description: 'How long has BetaOS Services been up for?',
  async execute(interaction) {
    await interaction.reply("<:completeall:1036758068454768721> "+getUptimeStr());
  }
}