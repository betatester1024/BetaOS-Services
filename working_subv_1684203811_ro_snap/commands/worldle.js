module.exports = {
  name: 'worldle',
  description: 'You can\'t spell.',
  async execute(interaction) {
    return interaction.reply('I said, *you can\'t spell.*');
  }
}