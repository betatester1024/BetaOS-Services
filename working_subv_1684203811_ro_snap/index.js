// const loopy = require('./commands/wordle.js')
const token =    process.env['token'];
const guildId = ['911997443179151461', '904916856010326036'];
const clientId = process.env['clientId'];

const { Client, Events, GatewayIntentBits, REST, Routes } = require('discord.js');
const fs = require('node:fs');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.commands = {};
for (const file of fs.readdirSync('./commands').filter(file => file.endsWith('.js'))) {
  const command = require(`./commands/${file}`);
  client.commands[command.name] = command;
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
	for (let i=0; i<guildId.length; i++) {
    try {
  		console.log(`Started refreshing ${Object.keys(client.commands).length} application (/) commands.`);
  		const data = await rest.put(Routes.applicationGuildCommands(clientId, guildId[i]), { body: Object.values(client.commands) });
  		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  	} catch (error) {
  		console.error(error);
  	}
  }
})();

client.login(token);
// loopy();

// we have a front-end!
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
