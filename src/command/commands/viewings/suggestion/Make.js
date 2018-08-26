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
      const host = this.client.users.get(viewing.host).username;
      const date = new Date(viewing.date).toUTCString();
      return ` [${index}] ${date} (${host})`;
    });

    const m = [
      'Which viewing do you want to suggest that show for?:',
    ].concat(viewingStrings);

    const new_message = await message.reply(m);

    const filter = response => {
      const choice = Number(response.content.trim());
      return response.author.id === message.author.id
        && choice && viewingKeys.length > choice && 0 <= choice;
    }
    new_message.channel.awaitMessages(filter, { max: 1, time: 30000 })
      .then(async collected => {
        if (!collected.size)
          return message.reply('selection timed out.');

        const choice = Number(collected.first().content.trim());
        const key    = viewingKeys[choice];
        const chosen = viewings.get(key);
        message.reply(`${new Date(chosen.date).toUTCString()}: ${this.client.users.get(chosen.host).username}`);
      });
  }
}

module.exports = Make;
