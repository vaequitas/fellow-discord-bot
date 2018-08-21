const Command = require('../../Command.js');
const ShowProvider = require('../../../providers/Show.js');
const options = require('options-parser');

class Recommend extends Command {
  constructor(...args) {
    super(...args, {
      name: 'recommend',
      description: 'recommends you an anime',
      usages: ['recommend', 'recommend [-g|--genre genre]', 'recommend [-t|--tag tag]...'],
      long_description: 'This command will recommend you an anime, optionally filtered by genre or tags. You can specify multiple tags by repeating -t',
      aliases: ['gief'],
      enabled: true,
    });

    this.showProvider = new ShowProvider();
  }

  async run(message, args) {
    let recommendation = null;
    if (args.length) {
      var result = options.parse({
          tag:   { short: 't', multi: true  },
          genre: { short: 'g'  },
      }, args);
      if (Object.keys(result.opt).length === 0)
        return message.reply(this.getHelp());

      let limit = 50;
      if (result.opt.tag && result.opt.tag.length)
        limit = 20

      recommendation = await this.showProvider.getRandomFirstTopGenre(limit, result.opt)
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
