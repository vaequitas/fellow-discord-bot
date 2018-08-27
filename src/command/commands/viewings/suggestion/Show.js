const Command = require('../../../Command.js');
const ViewingProvider = require('../../../../providers/Viewing.js');
const SuggestionProvider = require('../../../../providers/Suggestion.js');
const { Collection } = require('discord.js');

class Show extends Command {
  constructor(...args) {
    super(...args, {
      name: 'show',
      enabled: true,
    });
    this.parent = 'suggestion'
    this.viewingProvider = new ViewingProvider(this.client.firebase.database());
    this.suggestionProvider = new SuggestionProvider(this.client.firebase.database());
  }

  async run(message, args) {
    const viewings = await this.viewingProvider.getAllPending();
    if (!viewings)
      return message.reply('there are no scheduled viewings to suggest shows for. Sorry!');

    const viewingKeys = viewings.keyArray();
    const viewingStrings = viewingKeys.map((key, index) => {
      const viewing = viewings.get(key);
      const host = this.client.users.get(viewing.host).username;
      const date = new Date(viewing.date).toUTCString();
      return ` [${index}] ${date} (${host})`;
    });

    const m = [
      'which viewing do you want to see the suggestions for?:',
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
        const suggestions = await this.suggestionProvider.get(key);
        if (!suggestions)
          return message.reply('this viewing has no suggestions')
        const reversedSuggestions = suggestions.array().reverse();

        const suggestionStrings = reversedSuggestions.map(element => {
          console.log(element);
          return `(${element.votes}) [ ${element.name} ] ${element.url}`
        });

        return message.reply(suggestionStrings, {code: true});
      });
  }
}

module.exports = Show;
