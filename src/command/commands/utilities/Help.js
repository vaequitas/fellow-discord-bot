const Command = require('../../Command.js');

class Help extends Command {
  constructor(...args) {
    super(...args, {
      name: 'help',
      description: 'Get help on a command',
      aliases: ['h', 'halp'],
    });
  }

  async run(message) {
    return message.channel.send('HELP!');
  }
}

module.exports = Help;
