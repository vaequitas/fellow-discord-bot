const Command = require('../../Command.js');
const UserProvider = require('../../../providers/User.js');

class UserCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: 'user',
      description: 'test command retrieve user from firebase',
      enabled: false,
    });

    this.provider = new UserProvider(this.client.firebase.database());
  }

  async run(message, args) {
    const userId = args[0] ? args[0] : message.author.id;
    const user   = await this.provider.getUser(userId);

    if (!user)
      return message.reply('I was unable to find that user!');

    return message.reply(`I found user ${user.name}`);
  }
}

module.exports = UserCommand;
