const Command = require('../Command.js');

class Source extends Command {
  constructor(...args) {
    super(...args, {
      name: 'source',
      description: 'Provides a link to the bot source code',
    });
  }

  async run(message) {
    const m = "My source code is at https://github.com/vaequitas/fellow-discord-bot :heart:";
    return message.channel.send(m);
  }
}

module.exports = Source;
