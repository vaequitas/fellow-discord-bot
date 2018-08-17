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
});

client.login(config.token);
