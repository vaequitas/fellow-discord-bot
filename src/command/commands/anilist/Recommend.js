const Command = require('../../Command.js');
const ShowProvider = require('../../../providers/Show.js');

class Recommend extends Command {
  constructor(...args) {
    super(...args, {
      name: 'recommend',
      description: 'recommends you an anime',
      usage: 'recommend',
      long_description: 'This command will recommend you an anime',
      aliases: ['gief'],
      enabled: false,
    });

    this.showProvider = new ShowProvider();
  }

  async run(message, args) {
    const recommendation = await this.showProvider.getRandomTop(25);
    if (!recommendation)
      return message.reply('i failed to find a show owo');

    const m = `I recommend ${recommendation.title.romaji}: ${recommendation.siteUrl}`;
    return message.reply(m);
  }
}

module.exports = Recommend;
