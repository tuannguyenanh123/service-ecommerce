"use strict";

const { Client, GatewayIntentBits } = require("discord.js");
const { BOT_TOKEN, SERVER_ID } = process.env;

class LoggerDiscordService {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    //add channel id
    this.channelId = SERVER_ID;
    this.client.on("ready", () => {
      console.log(`Logged in as ${this.client.user.tag}!`);
    });
    this.client.login(BOT_TOKEN);
  }

  sendToFormatCode(logData) {
    const {
      code,
      message = "This is some information about the code.",
      title = "Code example",
    } = logData;

    const codeMessage = {
      content: message,
      embeds: [
        {
          color: parseInt("00ff00", 16),
          title,
          description: "```json\n" + JSON.stringify(code, null, 2) + "\n```",
          thumbnail: {
            url: 'https://i.imgur.com/AfFp7pu.png',
          },
          image: {
            url: 'https://i.imgur.com/AfFp7pu.png',
          },
          timestamp: new Date().toISOString(),
          footer: {
            text: message,
            icon_url: 'https://i.imgur.com/AfFp7pu.png',
          },
        },
      ],
    };
    const channel = this.client.channels.cache.get(this.channelId);
    if (!channel) {
      console.error(`Couldn't find the channel...`, this.channelId);
      return;
    }
    this.sendToMessage(codeMessage)
  }

  sendToMessage(mess = "message") {
    const channel = this.client.channels.cache.get(this.channelId);
    if (!channel) {
      console.error(`Couldn't find the channel...`, this.channelId);
      return;
    }
    channel.send(mess).catch((e) => console.error(e));
  }
}
module.exports = new LoggerDiscordService();
