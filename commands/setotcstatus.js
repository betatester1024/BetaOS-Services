const Database = require("@replit/database")
const db = new Database()



module.exports = {
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
      await db.set("OTCExpiredQ", interaction.options.data[0].value);
      return interaction.reply('<:active:1036760969591935056> OTC is '+(interaction.options.data[0].value == "yes"?"expired":"active"));      
    } 
    else
      return interaction.reply('<:error:1036760956388265984> You do not own Betatestingland');
  }
}
