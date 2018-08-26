const Command = require('../../Command.js');
const ViewingProvider = require('../../../providers/Viewing.js');

class ViewingCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: 'viewing',
      description: 'Schedule/manage hosts',
      aliases: ['host'],
      long_description: 'This is a proof of concept',
      enabled: false,
    });

    this.provider = new ViewingProvider(this.client.firebase.database());
  }

  async run(message, args) {
    if (!args.length) {
      const viewing = await this.provider.getNext();
      message.reply(`The next viewing is at ${new Date(viewing.date).toUTCString()}`);
    }
  }
}

module.exports = ViewingCommand;
