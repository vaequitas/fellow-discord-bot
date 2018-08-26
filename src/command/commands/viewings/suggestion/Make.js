const Command = require('../../../Command.js');
const ViewingProvider = require('../../../../providers/Viewing.js');

class Make extends Command {
  constructor(...args) {
    super(...args, {
      name: 'make',
      enabled: true,
    });
    this.parent = 'suggestion'
    this.viewingProvider = new ViewingProvider(this.client.firebase.database());
  }

  async run(message, args) {
    const viewings = await this.viewingProvider.getAllPending();
  }
}

module.exports = Make;
