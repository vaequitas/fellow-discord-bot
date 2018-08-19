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
      return message.channel.send(this.getHelp());

    if (this.client.commands.has(command))
      return message.channel.send(`${this.client.commands.get(command).getHelp()}`);

    return message.channel.send(`Could not find command named '${command}'`);
  }

  getCommandsString() {
    return `\n - ${[...this.client.commands.keys()].join('\n - ')}`;
  }

  getHelp() {
    this.long_description = `shows help for a command - available commands: ${this.getCommandsString()}`;
    return super.getHelp();
  }
}

module.exports = Help;
