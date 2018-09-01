const Command = require('../../Command.js');
const ViewingProvider = require('../../../providers/Viewing.js');
const SuggestionProvider = require('../../../providers/Suggestion.js');
const VoteProvider = require('../../../providers/Vote.js');
const { Collection } = require('discord.js');
const emojis = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬'];

class VoteCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: 'vote',
      description: 'Vote for a show to be watched at a viewing',
      usages: ['vote'],
      long_description: [
        'This is very much a WIP. It is a minimal proof of concept.',
      ].join('\n'),
      enabled: true,
    });

    this.viewingProvider = new ViewingProvider(this.client.firebase.database());
    this.suggestionProvider = new SuggestionProvider(this.client.firebase.database());
    this.voteProvider = new VoteProvider(this.client.firebase.database());
  }

  async run(message, args) {
    message.delete(0);
    const viewings = await this.viewingProvider.getAllPending();
    if (!viewings)
      return message.channel.send({embed: {
        title: 'Voting Failed',
        description: 'There are no scheduled viewings',
        color: 16711682,
        timestamp: new Date(),
        footer: {
          text: `Vote request from ${message.author.username}`,
        },
      }});

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
      description: `${message.author.username}, which viewing do you want to vote on?`,
      fields: [
        {
          name: "Viewings",
          value: viewingStrings.join('\n')
        },
      ],
      timestamp: new Date(),
      footer: {
        text: `Voting request by ${message.author.username}`,
      },
    }});

    emojiKeys.map(emoji => {
      new_message.react(emoji)
    })

    const viewing_filter = (reaction, user) => user.id === message.author.id && emojiKeys.includes(reaction.emoji.name)
    const viewingChoice = await new_message.awaitReactions(viewing_filter, { max: 1, time: 45000 })
      .then(async collected => {
        if (!collected.size) {
          new_message.edit({embed: {
            description: `Viewing selection for ${message.author.username} timed out`,
            color: 16711682,
            timestamp: new Date(),
            footer: {
              text: `Voting request by ${message.author.username}`,
            },
          }});
          new_message.clearReactions();
          return
        }

        const choice = collected.first()._emoji.name;
        return viewingKeys[emojiKeys.indexOf(choice)];
      });

    if (!viewingChoice)
      return

    const suggestions = await this.getViewingSuggestions(viewingChoice);
    const suggestionKeys = suggestions.keyArray();
    const suggestionEmojiMap = new Collection();
    const emojiSuggestionMap = new Collection();
    suggestionKeys.map((userId, index) => suggestionEmojiMap.set(userId, emojis[index]))
    suggestionKeys.map((userId, index) => emojiSuggestionMap.set(emojis[index], userId))

    const suggestionsList = this.formatViewingSuggestions(suggestions, suggestionEmojiMap);

    new_message.clearReactions();
    await new_message.edit({embed: {
      description: `Suggestions for viewing on ${new Date(viewings.get(viewingChoice).date).toUTCString()}`,
      fields: [
        {
          name: "Suggestions",
          value: suggestionsList ? suggestionsList.join('\n') : 'This viewing has no suggestions',
        },
      ],
      timestamp: new Date(),
      footer: {
        text: `Voting request by ${message.author.username}`,
      },
    }});

    suggestionEmojiMap.array().map(emoji => {
      new_message.react(emoji)
    })

    const suggestion_filter = (reaction, user) => user.id === message.author.id && suggestionEmojiMap.array().includes(reaction.emoji.name)
    const suggestionChoice = await new_message.awaitReactions(suggestion_filter, { max: 1, time: 45000 })
      .then(async collected => {
        if (!collected.size) {
          new_message.edit({embed: {
            title: 'Voting Failed',
            description: `Voting selection for ${message.author.username} timed out`,
            color: 16711682,
            timestamp: new Date(),
            footer: {
              text: `Voting request for ${message.author.username}`,
            },
          }});
          new_message.clearReactions();
          return
        }

        const choice = collected.first()._emoji.name;
        return emojiSuggestionMap.get(choice);
      });

    if (!suggestionChoice)
      return

    if (suggestionChoice === message.author.id)
      return new_message.edit({embed: {
        title: 'Voting Failed',
        description: `${message.author.username}, you can't vote for your own suggestion.`,
        color: 16711682,
        timestamp: new Date(),
        footer: {
          text: `Voting request for ${message.author.username}`,
        },
      }});

    const suggestionResult = await this.addVote(viewingChoice, message.author.id, suggestionChoice);
    if (!suggestionResult.ok)
      return

    await new_message.clearReactions();
    return await new_message.edit({embed: {
      title:  'Succesfully Voted',
      description: `${message.author.username} voted for ${suggestions.get(suggestionChoice).name}`,
      color: 43024,
      timestamp: new Date(),
      footer: {
        text: `Voting request for ${message.author.username}`,
      },
    }});
  }

  async getViewingSuggestions(key) {
    const suggestions = await this.suggestionProvider.get(key);
    if (!suggestions)
      return

    return suggestions;
  }

  formatViewingSuggestions(suggestions, l_emojis) {
    return suggestions.map((element, userId) => {
      const user = this.client.users.get(userId);
      return `${l_emojis.get(userId)} | [${element.name}](${element.url}) *suggested by ${user.username}*`
    });
  }

  async addVote(viewingId, userId, suggestionId) {
    return await this.voteProvider.addVote(viewingId, userId, suggestionId);
  }
}

module.exports = VoteCommand;
