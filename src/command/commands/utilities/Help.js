const Command = require('../../Command.js');

class Help extends Command {
  constructor(...args) {
    super(...args, {
      name: 'help',
      description: 'display help information for a command',
      usage: 'help [command]',
      aliases: ['h', 'halp'],
    });
  }

  async run(message, args) {
    const command = args[0];
    if (!command)
      return message.channel.send(`Available commands: ${this.getCommandsString()}`);

    if (this.client.commands.has(command))
      return message.channel.send(`${this.client.commands.get(command).getHelp()}`);

    return message.channel.send(`Could not find command named '${command}'`);
  }

  getCommandsString() {
    return `${[...this.client.commands.keys()].join(', ')}`;
  }

}

module.exports = Help;
