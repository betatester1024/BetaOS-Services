const Database = require("@replit/database")
const db = new Database()



module.exports = {
  name: 'otcstatus',
  description: 'Administrative access OTC status',
  async execute(interaction) {
    if (await db.get("OTCExpiredQ") == "yes") 
      return interaction.reply('<:error:1036760956388265984> OTC has expired');
    else if (await db.get("OTCExpiredQ") == "no") 
      return interaction.reply('<:active:1036760969591935056> OTC is active');
    else
      return interaction.reply('<:error:1036760956388265984> OTC status error');
  }
}
