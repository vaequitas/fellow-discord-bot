const Command = require('../../../Command.js');
const ViewingProvider = require('../../../../providers/Viewing.js');
const { Collection } = require('discord.js');

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
    const viewingKeys = viewings.keyArray();
    const viewingStrings = viewingKeys.map((key, index) => {
      const viewing = viewings.get(key);
      const host = this.client.users.get(viewing.host);
      const date = new Date(viewing.date).toUTCString();
      return ` - ${index}. ${date} (${host})`;
    });

    const m = [
      'Which viewing do you want to suggest that show for?:',
    ].concat(viewingStrings);

    const new_message = message.reply(m);
    const filter = response => {
      response.author.id === message.author.id && viewingKeys.keys.includes(response.content.trim())
    }
    new_message.channel.awaitMessages(filter, { maxMatches: 1, time: 30000 });
  }
}

module.exports = Make;
