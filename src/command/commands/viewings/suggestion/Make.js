const Command = require('../../../Command.js');
const ViewingProvider = require('../../../../providers/Viewing.js');
const SuggestionProvider = require('../../../../providers/Suggestion.js');
const ShowProvider = require('../../../../providers/Show.js');
const { Collection } = require('discord.js');
const emojis = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬'];

class Make extends Command {
  constructor(...args) {
    super(...args, {
      name: 'make',
      enabled: true,
    });
    this.parent = 'suggestion'
    this.viewingProvider = new ViewingProvider(this.client.firebase.database());
    this.suggestionProvider = new SuggestionProvider(this.client.firebase.database());
    this.showProvider = new ShowProvider();
  }

  async run(message, args) {
    const suggestion = args.join(' ').trim();
    let suggestionData = null;
    if (suggestion.match(/^https?:\/\//)) {
      const suggestionMatches = suggestion.match(/^https:\/\/anilist.co\/anime\/([0-9]+)/);
      if (!suggestionMatches)
        return message.reply('it looks like you tried to pass a link, but the link looks malformed.');

      const showId = suggestionMatches[1];
      suggestionData = await this.showProvider.getById(showId);
    } else {
      suggestionData = await this.showProvider.searchSingle(suggestion);
      if (!suggestionData)
        return message.reply('I couldn\'t find shows for that search term!');

      const confirm_show_message = await message.reply(`did you want to suggest ${suggestionData.title.romaji}? ${suggestionData.siteUrl}`);
      confirm_show_message.react('☑');
      confirm_show_message.react('❎');
      const filter = (reaction, user) => (reaction.emoji.name === '☑' || reaction.emoji.name === '❎') && user.id === message.author.id
      const confirmation = await confirm_show_message.awaitReactions(filter, {time: 45000, max: 1})
        .then(async collected => {
          if (!collected.size) {
            message.reply('confirmation timed out. Cancelling suggestion.');
            return false
          }

          if (collected.has('❎')) {
            message.reply('OK. Cancelling suggestion. You could try giving me the AniList url.')
            return false;
          }

          return true
        });

      if (!confirmation) return
    }

    if (!suggestionData)
      return message.reply('I couldn\'t find any shows for your suggestion!')


    const viewings = await this.viewingProvider.getAllPending();
    if (!viewings)
      return message.reply('there are no scheduled viewings to suggest shows for. Sorry!');

    if (viewings.array().length === 1) {
      const result = await this.saveSuggestion(viewings.firstKey(), message.author.id, suggestionData);
      if (!result.ok)
        return message.channel.send(`${result.error} ${message.author}`)
      return message.reply('suggestion saved.');
    }

    const viewingKeys = viewings.keyArray();
    const emojiKeys = viewingKeys.map((key, index) => {
      return emojis[index];
    });

    const viewingStrings = viewingKeys.map((key, index) => {
      const viewing = viewings.get(key);
      const host = this.client.users.get(viewing.host).username;
      const date = new Date(viewing.date).toUTCString();
      return `${emojis[index]} ${date} (${host})`;
    });

    const new_message = await message.channel.send({embed: {
      title: `${message.author.username}, which viewing do you want to suggest that show for?`,
      fields: [
        {
          name: "Viewings",
          value: viewingStrings.join('\n')
        },
      ],
      timestamp: new Date(),
      footer: {
        text: `Viewing selection for ${message.author.username}`,
      },
    }});

    emojiKeys.map(emoji => {
      new_message.react(emoji)
    })

    const viewing_filter = (reaction, user) => user.id === message.author.id && emojiKeys.includes(reaction.emoji.name)
    new_message.awaitReactions(viewing_filter, { max: 1, time: 45000 })
      .then(async collected => {
        if (!collected.size) {
          new_message.edit({embed: {
            title: `Viewing selection for ${message.author.username} timed out`,
            color: 16711682,
            timestamp: new Date(),
            footer: {
              text: `Viewing selection for ${message.author.username}`,
            },
          }});
          new_message.clearReactions();
          return
        }

        const choice = collected.first()._emoji.name;
        const viewingId = viewingKeys[emojiKeys.indexOf(choice)];
        const userId = message.author.id;

        const result = await this.saveSuggestion(viewingId, userId, suggestionData);
        if (!result.ok)
          return message.channel.send(`${result.error} ${message.author}`)
        message.reply('suggestion saved.');
      });
  }

  async saveSuggestion(viewingId, userId, suggestion) {
    return await this.suggestionProvider.update(viewingId, userId, {
      id: suggestion.id,
      name: suggestion.title.romaji,
      url: suggestion.siteUrl,
      votes: 0,
    });
  }
}

module.exports = Make;
