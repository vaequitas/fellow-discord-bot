const firebase = require('firebase');
const admin = require('firebase-admin');
const config = require('./.config.json');
const serviceAccount = require("./firebase.json");
const { version  } = require('./package.json');

const firebase_conn = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config.database.url
});

const client = new (require('./src/client/FellowsClient.js'))({}, config.dev, firebase_conn);

client.on('ready', () => {
  console.log(`---------- ANIFRIENDS BOT v${version} ----------`);
  console.log(`Bot has started with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds`);
  client.user.setActivity(config.activity);
});

client.on('message', async message => {
  if (message.author.bot) return;

  if (message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (client.commands.has(command))
    return client.commands.get(command).run(message, args);
});

client.login(config.token);
