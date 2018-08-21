const Command = require('../../Command.js');
const ShowProvider = require('../../../providers/Show.js');

class Recommend extends Command {
  constructor(...args) {
    super(...args, {
      name: 'recommend',
      description: 'recommends you an anime',
      usages: ['recommend', 'recommend genre'],
      long_description: 'This command will recommend you an anime, optionally filtered by genre',
      aliases: ['gief'],
      enabled: true,
    });

    this.showProvider = new ShowProvider();
  }

  async run(message, args) {
    let recommendation = null;
    if (args.length) {
      recommendation = await this.showProvider.getRandomFirstTopGenre(50, args[0])
    } else {
      recommendation = await this.showProvider.getRandomFirstTop(50);
    }

    if (!recommendation)
      return message.reply('i failed to find a show owo');

    const m = `I recommend ${recommendation.title.romaji}, with average score ${recommendation.averageScore}%: ${recommendation.siteUrl}`;
    return message.reply(m);
  }
}

module.exports = Recommend;
