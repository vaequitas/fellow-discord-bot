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
    if (!viewing)
      return message.channel.send(`There are no viewings planned at the moment, ${message.author}.`);

    const host = await this.client.users.get(viewing.host);
    message.reply(`the next viewing is on ${new Date(viewing.date).toUTCString()}. Hosted by ${host.username}.`);
  }
}

module.exports = Get;
