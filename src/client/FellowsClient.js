const { Client } = require('discord.js');
const CommandStore = require('../command/CommandStore.js');

class FellowsClient extends Client {
  constructor(options, dev_mode, firebase) {
    super(options);

    this.dev_mode = dev_mode || false;

    this.commands = new CommandStore(this);

    this.firebase = firebase;
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
