const Command = require('../../../Command.js');
const ViewingProvider = require('../../../../providers/Viewing.js');
const SuggestionProvider = require('../../../../providers/Suggestion.js');
const ShowProvider = require('../../../../providers/Show.js');
const { Collection } = require('discord.js');

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
      const suggestionMatches = suggestion.match(/^https:\/\/anilist.co\/anime\/([0-8]+)/);
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
        && viewingKeys.length > choice && 0 <= choice;
    }
    new_message.channel.awaitMessages(filter, { max: 1, time: 30000 })
      .then(async collected => {
        if (!collected.size)
          return message.reply('selection timed out.');

        const choice = Number(collected.first().content.trim());
        const key    = viewingKeys[choice];
        const chosen = viewings.get(key);
        message.reply(`${new Date(chosen.date).toUTCString()}: ${this.client.users.get(chosen.host).username}`);
        await this.suggestionProvider.update(key, collected.first().author.id, {
          id: suggestionData.id,
          name: suggestionData.title.romaji,
          url: suggestionData.siteUrl,
        });
      });
  }
}

module.exports = Make;
