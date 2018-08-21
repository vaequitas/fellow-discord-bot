const Command = require('../../Command.js');
const ShowProvider = require('../../../providers/Show.js');

class Recommend extends Command {
  constructor(...args) {
    super(...args, {
      name: 'recommend',
      description: 'recommends you an anime',
      usages: ['recommend', 'recommend genre'],
      long_description: 'This command will recommend you an anime',
      aliases: ['gief'],
      enabled: false,
    });

    this.showProvider = new ShowProvider();
  }

  async run(message, args) {
    if (args.length) {
      const recommendation = await this.showProvider.getRandomTopGenre(30, args[0])
      const m = `I recommend ${recommendation.title.romaji}, with average score ${recommendation.averageScore}%: ${recommendation.siteUrl}`;
      return message.reply(m);
    }

    const recommendation = await this.showProvider.getRandomTop(50);
    if (!recommendation)
      return message.reply('i failed to find a show owo');

    const m = `I recommend ${recommendation.title.romaji}: ${recommendation.siteUrl}`;
    return message.reply(m);
  }
}

module.exports = Recommend;
