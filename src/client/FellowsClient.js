const { Client } = require('discord.js');
const CommandStore = require('../command/CommandStore.js');
const path = require('path');

class FellowsClient extends Client {
  constructor(options, dev_mode, firebase) {
    super(options);

    this.dev_mode = dev_mode || false;

    this.commands = new CommandStore(this, {
      dir: `${path.dirname(require.main.filename)}${path.sep}src${path.sep}command${path.sep}commands`
    });

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
