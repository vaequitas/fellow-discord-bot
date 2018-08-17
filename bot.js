const config = require('./.config.json');

const client = new (require('./src/client/FellowsClient.js'))();

client.on('ready', () => {
  console.log(`Bot has started with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on('message', async message => {
  if (message.author.bot) return;

  if (message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (client.commands.has(command))
    return client.commands.get(command).run(message);

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

  if (command === 'wait') {
    const time = parseInt(args.shift(), 10);
    if (!time || time < 1 || time > 10)
      return message.reply('Please provide a time value in seconds between 1 and 10');

    await new Promise(resolve => setTimeout(resolve, (time * 1000)));

    return message.reply(`I waited for ${time} seconds`);
  }
});

client.login(config.token);
