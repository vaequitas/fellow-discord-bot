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
    message.delete(0);
    const suggestion = args.join(' ').trim();
    let suggestionData = null;
    if (suggestion.match(/^https?:\/\//)) {
      const suggestionMatches = suggestion.match(/^https:\/\/anilist.co\/anime\/([0-9]+)/);
      if (!suggestionMatches)
        return message.channel.send({embed: {
          title: 'Suggestion Failed',
          description: 'It looks like you tried to pass a link, but the link looks malformed.',
          color: 16711682,
          timestamp: new Date(),
          footer: {
            text: `New suggestion from ${message.author.username}`,
          }
        }});

      const showId = suggestionMatches[1];
      suggestionData = await this.showProvider.getById(showId);

      if (!suggestionData) {
        const m = {embed: {
          title: 'Suggestion Failed',
          description: `I was unable to get any information on the show at ${suggestion}\nAre you sure this is the right URL?`,
          color: 16711682,
          timestamp: new Date(),
          footer: {
            text: `New suggestion from ${message.author.username}`,
          },
        }};

        if (new_message)
          return new_message.edit(m)
        else
          return message.channel.send(m);
      }

    } else {
      suggestionData = await this.showProvider.searchSingle(suggestion);
      if (!suggestionData)
        return message.channel.send({embed: {
          title: 'Suggestion Failed',
          description: `I couldn't find shows for '${suggestion}'! You could try giving me a AniList url, or trying another search term.`,
          color: 16711682,
          timestamp: new Date(),
          footer: {
            text: `New suggestion from ${message.author.username}`,
          }
        }});

      var new_message = await message.channel.send({embed: {
        title: 'New Suggestion',
        description: `${message.author.username}, did you want to suggest this show?`,
        fields: [
          {
            name: "Romaji",
            value: suggestionData.title.romaji || 'N/A',
            inline: true,
          }, {
            name: "English",
            value: suggestionData.title.english || 'N/A',
            inline: true,
          }, {
            name: "Native",
            value: suggestionData.title.native || 'N/A',
            inline: true,
          }, {
            name: "URL",
            value: suggestionData.siteUrl || 'N/A',
          },
        ],
        timestamp: new Date(),
        footer: {
          text: `New suggestion from ${message.author.username}`,
        },
      }})
      new_message.react('☑');
      new_message.react('❎');
      const filter = (reaction, user) => (reaction.emoji.name === '☑' || reaction.emoji.name === '❎') && user.id === message.author.id
      const confirmation = await new_message.awaitReactions(filter, {time: 45000, max: 1})
        .then(async collected => {
          if (!collected.size) {
            new_message.edit({embed: {
              title: 'Suggestion Failed',
              description: 'Suggestion confirmation timed out',
              timestamp: new Date(),
              color: 16711682,
              footer: {
                text: `New suggestion from ${message.author.username}`,
              },
            }});
            return false
          }

          if (collected.has('❎')) {
            new_message.edit({embed: {
              title: 'Suggestion Failed',
              description: `Suggestion was denied by ${message.author.username}`,
              timestamp: new Date(),
              color: 16711682,
              footer: {
                text: `New suggestion from ${message.author.username}`,
              },
            }});
            return false;
          }

          return true
        });

      new_message.clearReactions();
      if (!confirmation) return
    }
    const viewings = await this.viewingProvider.getAllPending();
    if (!viewings) {
      const m = {embed: {
        title: 'Suggestion Failed',
        description: 'There are no scheduled viewings to suggest shows for!',
        color: 16711682,
        timestamp: new Date(),
        footer: {
          text: `New suggestion from ${message.author.username}`,
        },
      }};

      if (new_message)
        return new_message.edit(m)
      else
        return message.channel.send(m);
    }

    if (viewings.array().length === 1) {
      const result = await this.saveSuggestion(viewings.firstKey(), message.author.id, suggestionData);
      if (new_message) new_message.clearReactions();
      if (!result.ok) {
        const m = {embed: {
          title: 'Suggestion Failed',
          description: `${result.error}`,
          color: 16711682,
          timestamp: new Date(),
          footer: {
            text: `New suggestion from ${message.author.username}`,
          },
        }}
        if (new_message)
          return new_message.edit(m)
        else
          return message.channel.send(m);
      }
      const m = {embed: {
        title: 'New Suggestion',
        description: `${message.author.username} suggested [${suggestionData.title.romaji}](${suggestionData.siteUrl}) for the ${new Date(viewings.first().date).toUTCString()} viewing`,
        color: 43024,
        timestamp: new Date(),
        footer: {
          text: `New suggestion from ${message.author.username}`,
        },
      }}

      if (new_message)
        return new_message.edit(m)
      else
        return message.channel.send(m);
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

    const viewing_selection_m = {embed: {
      title: 'New Suggestion',
      description: `${message.author.username}, which viewing do you want to suggest that show for?`,
      fields: [
        {
          name: "Suggestion",
          value: suggestionData.title.romaji || 'N/A',
        },
        {
          name: "Viewings",
          value: viewingStrings.join('\n')
        },
      ],
      timestamp: new Date(),
      footer: {
        text: `New suggestion from ${message.author.username}`,
      },
    }}


    if (new_message)
      await new_message.edit(viewing_selection_m)
    else
      var new_message = await message.channel.send(viewing_selection_m)

    emojiKeys.map(emoji => {
      new_message.react(emoji)
    })

    const viewing_filter = (reaction, user) => user.id === message.author.id && emojiKeys.includes(reaction.emoji.name)
    new_message.awaitReactions(viewing_filter, { max: 1, time: 45000 })
      .then(async collected => {
        if (!collected.size) {
          new_message.edit({embed: {
            title: 'New Suggestion',
            description: `Viewing selection for ${message.author.username} timed out`,
            color: 16711682,
            timestamp: new Date(),
            footer: {
              text: `New suggestion from ${message.author.username}`,
            },
          }});
          new_message.clearReactions();
          return
        }

        const choice = collected.first()._emoji.name;
        const viewingId = viewingKeys[emojiKeys.indexOf(choice)];
        const userId = message.author.id;

        const result = await this.saveSuggestion(viewingId, userId, suggestionData);
        if (!result.ok) {
          new_message.edit({embed: {
            title: 'New Suggestion',
            description: `${result.error}`,
            color: 16711682,
            timestamp: new Date(),
            footer: {
              text: `New suggestion from ${message.author.username}`,
            },
          }});
          new_message.clearReactions();
          return
        }

        new_message.clearReactions();
        new_message.edit({embed: {
          title: 'New Suggestion',
          description: `${message.author.username} suggested [${suggestionData.title.romaji}](${suggestionData.siteUrl}) for the ${new Date(viewings.first().date).toUTCString()} viewing`,
          color: 43024,
          timestamp: new Date(),
          footer: {
            text: `New suggestion from ${message.author.username}`,
          },
        }});
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
