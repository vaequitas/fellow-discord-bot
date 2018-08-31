const Command = require('../../Command.js');
const ViewingProvider = require('../../../providers/Viewing.js');
const SuggestionProvider = require('../../../providers/Suggestion.js');
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
  }

  async run(message, args) {
  }
}

module.exports = SuggestionCommand;
