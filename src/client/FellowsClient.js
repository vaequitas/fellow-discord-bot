const { Client } = require('discord.js');
const CommandStore = require('../command/CommandStore.js');

class FellowsClient extends Client {
  constructor(options) {
    super(options);

    this.commands = new CommandStore();
  }

  async init() {
    const commands = await this.commands.loadFiles();
  }

  async login(token) {
    await this.init();
    return super.login(token);
  }
}

module.exports = FellowsClient;
