const Command = require('../../Command.js');

class Whoami extends Command {
  constructor(...args) {
    super(...args, {
      name: 'whoami',
      description: 'tells you who you are',
      aliases: ['whodis']
    });
  }

  async run(message, args) {
    return message.channel.send(`You're ${message.author}, duh!`);
  }
}

module.exports = Whoami;
