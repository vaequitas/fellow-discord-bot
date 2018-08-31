const Command = require('../../Command.js');
const ShowProvider = require('../../../providers/Show.js');
const options = require('options-parser');

class Recommend extends Command {
  constructor(...args) {
    super(...args, {
      name: 'recommend',
      description: 'recommends you an anime',
      usages: ['recommend', 'recommend -g example_genre', 'recommend -t example_tag'],
      long_description: [
        'Recommends you a show by searching AniList using the filters provided.',
        'Can be filtered by any combination of AniList genres by adding the -g option.',
        'Can be filtered by any combination of AniList tags by adding the -t option.',
        'If your tag/genre has multiple words, enclose it in double-quotes. Example: --tag "Mahou Shoujo"',
      ].join('\n'),
      aliases: ['gief'],
      enabled: true,
    });

    this.showProvider = new ShowProvider();
  }

  async run(message, args) {
    const joined_args = args.join(' ');
    let recommendation = null;
    if (args.length) {
      var result = options.parse({
          tag:   { short: 't', multi: true  },
          genre: { short: 'g', multi: true },
      }, joined_args);
      if (Object.keys(result.opt).length === 0)
        return message.reply(this.getHelp());

      let limit = 50;
      if (result.opt.tag && result.opt.tag.length)
        limit = Math.floor(result.opt.tag.length <= 1 ? limit / 1.5 : limit / 2)

      if (result.opt.genre && result.opt.genre.length)
        limit = Math.floor(result.opt.genre.length <= 1 ? limit / 1.5 : limit / 2)

      recommendation = await this.showProvider.getRandomTopGenre(limit, result.opt)
    } else {
      recommendation = await this.showProvider.getRandomTop(50);
    }

    if (!recommendation)
      return await message.channel.send({embed: {
        title: 'Suggestion Failed',
        description: `Sorry, ${message.author.username}. I couldn't find any shows to recommend.`,
        color: 16711682,
        timestamp: new Date(),
        footer: {
          text: `Recommendation for ${message.author.username}`,
        }
      }});

    return await message.channel.send({embed: {
      title: 'Recommendation',
      description: `${message.author.username}, I recommend this show!`,
      fields: [
        {
          name: "Romaji",
          value: recommendation.title.romaji || 'N/A',
          inline: true,
        }, {
          name: "English",
          value: recommendation.title.english || 'N/A',
          inline: true,
        }, {
          name: "Native",
          value: recommendation.title.native || 'N/A',
          inline: true,
        }, {
          name: "Average Score",
          value: recommendation.averageScore || 'N/A',
        }, {
          name: "URL",
          value: recommendation.siteUrl || 'N/A',
        },
      ],
      timestamp: new Date(),
      footer: {
        text: `Recommendation for ${message.author.username}`,
      },
    }})
  }
}

module.exports = Recommend;
