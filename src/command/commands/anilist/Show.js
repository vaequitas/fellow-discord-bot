const Command = require('../../Command.js');
const ShowProvider = require('../../../providers/Show.js');

class Show extends Command {
  constructor(...args) {
    super(...args, {
      name: 'anime',
      description: 'searches for the specified show',
      usage: 'anime show_title',
      long_description: 'This command queries the AniList API to try and find the best matched anime for your show title',
      aliases: ['show'],
      enabled: true,
    });

    this.showProvider = new ShowProvider();
  }

  async run(message, args) {
    if (!args.length)
      return message.channel.send(this.getHelp());

    const searchTerm = args.join(' ');
    const media = await this.showProvider.searchSingle(searchTerm);

    if (media) {
      return await message.channel.send({embed: {
        title: 'New Suggestion',
        description: `${message.author.username}, I found this show`,
        fields: [
          {
            name: "Romaji",
            value: media.title.romaji || 'N/A',
            inline: true,
          }, {
            name: "English",
            value: media.title.english || 'N/A',
            inline: true,
          }, {
            name: "Native",
            value: media.title.native || 'N/A',
            inline: true,
          }, {
            name: "URL",
            value: media.siteUrl || 'N/A',
          },
        ],
        timestamp: new Date(),
        footer: {
          text: `Show search by ${message.author.username}`,
        },
      }})
    }

    return message.channel.send({embed: {
      title: 'Suggestion Failed',
      description: `I couldn't find shows for '${searchTerm}'`,
      color: 16711682,
      timestamp: new Date(),
      footer: {
        text: `Show search by ${message.author.username}`,
      }
    }});
  }
}

module.exports = Show;
