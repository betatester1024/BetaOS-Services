const Database = require("@replit/database")
const db = new Database()



module.exports = {
  name: 'setotc',
  description: 'Set OTC Status',
  async execute(interaction) {
    if (interaction.user.id == "842822970829439037") {
      await db.set("OTCExpiredQ", "no");
      return interaction.reply('<:active:1036760969591935056> OTC is active');      
    } 
    else
      return interaction.reply('<:error:1036760956388265984> You do not own Betatestingland');
  }
}
