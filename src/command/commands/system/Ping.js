const Command = require('../../Command.js');

class Ping extends Command {
  constructor(...args) {
    super(...args, {
      name: 'ping',
      description: 'Check the bot\'s ping',
      aliases: ['pong']
    });
  }

  async run(message) {
    const m = await message.channel.send('Ping?');
    return m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms.`);
  }
}

module.exports = Ping;
