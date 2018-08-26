const Command = require('../../Command.js');
const CommandStore = require('../../CommandStore.js');
const path = require('path');

class ViewingCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: 'viewing',
      description: 'Schedule/manage hosts',
      aliases: ['host'],
      long_description: 'This is a proof of concept',
      enabled: false,
    });

    this.subcommands = new CommandStore(this.client, {
      dir: `${path.dirname(require.main.filename)}${path.sep}src${path.sep}command${path.sep}commands${path.sep}viewings${path.sep}vewing`,
      parent: this.name
    });
  }

  async run(message, args) {
    if (args.length && this.subcommands.has(args[0])) {
      const command = args.shift().toLowerCase();
      return await this.subcommands.get(command).run(message, args)
    }
  }
}

module.exports = ViewingCommand;
