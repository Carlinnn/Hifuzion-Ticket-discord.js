const Discord = require("discord.js");
const Io = require("socket.io-client");

const { readdirSync } = require("fs");

const config = require("./config.json");

const { Client, Collection, Intents } = Discord;
const { clear } = console;

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS
  ]
});

const socket = Io.connect("http://localhost:3333");

client.config = config;
client.discord = Discord;
client.commands = new Collection();
client.io = socket;

clear();
console.log("Ticket Bot Iniciou!\n");

readdirSync("./commands").forEach((file) => {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
});

readdirSync("./events").forEach((file) => {
  const event = require(`./events/${file}`);
  client.on(event.name, (...args) => event.execute(...args, client));
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client, config);
  } catch (error) {
    console.error(error);
    return interaction.reply({
      content: "Ocorreu um erro ao executar este comando!",
      ephemeral: true
    });
  }
});

client.login(require("./token.json").token);
