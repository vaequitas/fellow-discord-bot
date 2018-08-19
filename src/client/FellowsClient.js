const { Client } = require('discord.js');
const CommandStore = require('../command/CommandStore.js');
const firebase = require('firebase');
const admin = require('firebase-admin');
var serviceAccount = require("../../firebase.json");

class FellowsClient extends Client {
  constructor(options, dev_mode) {
    super(options);

    this.dev_mode = dev_mode || false;

    this.commands = new CommandStore(this);

    this.firebase = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://fellows-discord-bot.firebaseio.com"
    });
  }

  async init() {
    return await this.commands.loadFiles();
  }

  async login(token) {
    await this.init();
    return super.login(token);
  }
}

module.exports = FellowsClient;
