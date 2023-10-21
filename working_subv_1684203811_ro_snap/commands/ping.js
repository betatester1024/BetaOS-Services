module.exports = {
  name: 'isitdown',
  description: 'Is BetaOS down?',
  async execute(interaction) {
    return interaction.reply(':confirm: BetaOS services ONLINE!');
  }
}