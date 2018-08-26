const Command = require('../../Command.js');
const CommandStore = require('../../CommandStore.js');
const path = require('path');

class SuggestionCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: 'suggestion',
      description: 'Suggest a show for a viewing',
      usages: ['suggest <show name>|<show url>'],
      aliases: ['suggest'],
      long_description: [
        'This is very much a WIP. It is a minimal proof of concept.',
      ].join('\n'),
      enabled: false,
    });

    this.subcommands = new CommandStore(this.client, {
      dir: `${path.dirname(require.main.filename)}${path.sep}src${path.sep}command${path.sep}commands${path.sep}viewings${path.sep}suggestion`,
      parent: this.name
    });
    this.subcommands.loadFiles();
  }

  async run(message, args) {
    console.log('not implemented');
  }
}

module.exports = SuggestionCommand;
