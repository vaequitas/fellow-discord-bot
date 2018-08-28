const Command = require('../../../Command.js');
const ViewingProvider = require('../../../../providers/Viewing.js');
const SuggestionProvider = require('../../../../providers/Suggestion.js');
const { Collection } = require('discord.js');
const emojis = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬'];

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

    if (viewings.array().length === 1) {
      const suggestionsList = await this.getViewingSuggestionsList(viewings.firstKey());
      return message.channel.send({embed: {
        description: `Suggestions for viewing on ${new Date(viewings.first().date).toUTCString()}`,
        fields: [
          {
            name: "Suggestions",
            value: suggestionsList ? suggestionsList.join('\n') : 'This viewing has no suggestions',
          },
        ],
        timestamp: new Date(),
        footer: {
          text: `Requested by ${message.author.username}`,
        },
      }});
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
      description: `${message.author.username}, which viewing do you want to see the suggestions for?`,
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
            description: `Viewing selection for ${message.author.username} timed out`,
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
        const key = viewingKeys[emojiKeys.indexOf(choice)];
        const suggestionsList = await this.getViewingSuggestionsList(key);
        new_message.clearReactions();
        return new_message.edit({embed: {
          description: `Suggestions for viewing on ${new Date(viewings.get(key).date).toUTCString()}`,
          fields: [
            {
              name: "Suggestions",
              value: suggestionsList ? suggestionsList.join('\n') : 'This viewing has no suggestions',
            },
          ],
          timestamp: new Date(),
          footer: {
            text: `Requested by ${message.author.username}`,
          },
        }});
      });
  }

  async getViewingSuggestionsList(key) {
    const suggestions = await this.getViewingSuggestions(key);
    if (!suggestions)
      return

    return this.formatViewingSuggestions(suggestions);
  }

  async getViewingSuggestions(key) {
    const suggestions = await this.suggestionProvider.get(key);
    if (!suggestions)
      return
    return suggestions.array().reverse();
  }

  formatViewingSuggestions(suggestions) {
    return suggestions.map(element => {
      return `${element.votes} | [${element.name}](${element.url})`
    });
  }
}

module.exports = Show;
