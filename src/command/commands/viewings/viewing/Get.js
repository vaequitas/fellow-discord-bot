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
    message.delete(0);
    const viewings = await this.provider.getAllPending();
    if (!viewings)
      return message.channel.send({embed: {
        title: 'Viewing Schedule',
        description: 'There are no scheduled viewings',
        timestamp: new Date(),
        footer: {
          text: `Viewing schedule for ${message.author.username}`,
        },
      }});

    const viewingStrings = viewings.map(viewing => {
      const host = this.client.users.get(viewing.host).username;
      const date = new Date(viewing.date).toUTCString();
      return `${date} (${host})`;
    });

    await message.channel.send({embed: {
      title: 'Viewing schedule',
      fields: [
        {
          name: "Viewings",
          value: viewingStrings.join('\n')
        },
      ],
      timestamp: new Date(),
      footer: {
        text: `Viewing schedule for ${message.author.username}`,
      },
    }});
  }
}

module.exports = Get;
