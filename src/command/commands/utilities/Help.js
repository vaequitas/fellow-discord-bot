const Command = require('../../Command.js');

class Help extends Command {
  constructor(...args) {
    super(...args, {
      name: 'help',
      description: 'Get help on a command',
      aliases: ['h', 'halp'],
    });
  }

  async run(message, args) {
    const command = args[0];
    if (this.client.commands.has(command))
      return message.channel.send(`${this.client.commands.get(command).description}`);

    return message.channel.send(`Could not find command named '${command}'`);
  }
}

module.exports = Help;
