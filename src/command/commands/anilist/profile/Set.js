const Command = require('../../../Command.js');
const UserProvider = require('../../../../providers/User.js');

class Set extends Command {
  constructor(...args) {
    super(...args, {
      name: 'set',
      enabled: true,
    });
    this.user = new UserProvider(this.client.firebase.database());
    this.parent = 'profile'
  }

  async run(message, args) {
    if (!args.length)
      return message.reply('you need to give me a profile link to set!');

    const profile = args.shift().trim();
    if (!profile.match(/^https:\/\/anilist.co\/user\/[^\/]+\/?$/))
      return message.reply('that doesn\'t look like an anilist profile link.');

    const userId = message.author.id;
    const user = await this.user.modifyUser(userId, {profile: profile});
    return message.reply(`thanks! I successfuly set your profile.`);
  }
}

module.exports = Set;
