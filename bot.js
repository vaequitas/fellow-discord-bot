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
    return m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms.`);
  }

  if (command === 'source') {
    const m = "My source code is at https://github.com/vaequitas/fellow-discord-bot :heart:";
    return message.channel.send(m);
  }

  if (command === 'purge') {
    const deleteCount = parseInt(args[0], 10);

    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");

    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    return message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }

  if (command === 'whoami') {
    const m = `You are ${message.author}, duh!`;
    return message.channel.send(m);
  }
});

client.login(config.token);
