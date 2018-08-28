const Command = require('../../Command.js');
const CommandStore = require('../../CommandStore.js');
const path = require('path');

class ViewingCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: 'viewing',
      description: 'Schedule/manage/view hosting sessions',
      usages: ['viewing (defaults to get)', 'viewing create 10pm tomorrow', 'viewing get'],
      aliases: ['host', 'viewings', 'schedule'],
      long_description: [
        'This is very much a WIP. It is a minimal proof of concept.',
        'Future ideas:',
        '  - Allow users to vote on which show to watch.',
        '  - Allow users to opt in to being sent a DM reminder for a viewing.',
      ].join('\n'),
      enabled: true,
    });

    this.subcommands = new CommandStore(this.client, {
      dir: `${path.dirname(require.main.filename)}${path.sep}src${path.sep}command${path.sep}commands${path.sep}viewings${path.sep}viewing`,
      parent: this.name
    });
    this.subcommands.loadFiles();
  }

  async run(message, args) {
    if (args.length && this.subcommands.has(args[0])) {
      const command = args.shift().toLowerCase();
      return await this.subcommands.get(command).run(message, args)
    }

    return await this.subcommands.get('get').run(message, args);
  }
}

module.exports = ViewingCommand;
