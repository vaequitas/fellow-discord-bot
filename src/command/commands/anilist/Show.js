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
      const m = `I found the show ${media.title.romaji}: ${media.siteUrl}`;
      return message.reply(m);
    }

    return message.reply(`I didn't find any shows for ${searchTerm}`)
  }
}

module.exports = Show;
