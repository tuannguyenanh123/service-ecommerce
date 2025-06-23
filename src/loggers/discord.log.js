"use strict";

import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!");
  }
});
const token = "MTM4NDkyNzA2MTgyMjU0MTk5NA.GFWTH3.bJOnigzy-52HAFMJ_EOpi3wpnw3wLy12mrI5uE"
client.login(token);

client.on("messageCreate", msg => {
    if(msg.author.bot) return;
    if(msg.content === "hello") {
        msg.reply("Hello! How can i help you today!")
    }
})
