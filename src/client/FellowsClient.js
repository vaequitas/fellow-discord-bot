const { Client } = require('discord.js');

class FellowsClient extends Client {
  constructor(options) {
    super(options);
  }

  async init() {
  }

  async login(token) {
    await this.init();
    return super.login(token);
  }
}

module.exports = FellowsClient;
