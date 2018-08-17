const Discord = require('discord.js');
const client = new Discord.Client();

const config = require('./.config.json');

client.on('ready', () => {
  console.log(`Bot has started with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on('message', async message => {
  if (message.author.bot) return;

  if (message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === 'ping') {
    const m = await message.channel.send('Ping?');
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms.`);
  }

  if (command === 'source') {
    const m = "My source code is at https://github.com/vaequitas/fellow-discord-bot :heart:";
    message.channel.send(m);
  }
});

client.login(config.token);
