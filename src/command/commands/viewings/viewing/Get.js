const Command = require('../../../Command.js');
const ViewingProvider = require('../../../../providers/Viewing.js');
const Viewing = require('../../../../structures/Viewing.js');

class Get extends Command {
  constructor(...args) {
    super(...args, {
      name: 'get',
      enabled: true,
    });
    this.provider = new ViewingProvider(this.client.firebase.database());
    this.parent = 'viewing'
  }

  async run(message, args) {
    const viewing = await this.provider.getNext();
    const host = await this.client.users.get(viewing.host);
    message.reply(`The next viewing is on ${new Date(viewing.date).toUTCString()}, hosted by ${host}`);
  }
}

module.exports = Get;
