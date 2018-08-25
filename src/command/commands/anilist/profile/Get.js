const Command = require('../../../Command.js');
const UserProvider = require('../../../../providers/User.js');

class Get extends Command {
  constructor(...args) {
    super(...args, {
      name: 'get',
      enabled: true,
    });
    this.user = new UserProvider(this.client.firebase.database());
    this.parent = 'profile'
  }

  async run(message, args) {
    let member = null
    if (!args.length) {
      member = message.author
    } else {
      member = message.mentions.members.first();
    }

    const profile = await this.getProfile(member.id);
    if (!profile)
      return message.channel.send(`${member} has not linked their profile`);
    return message.channel.send(`Found the following profile for ${member}: ${profile}`);
  }

  async getProfile(userId) {
    const user = await this.user.getUser(userId);
    if (!user || !user.profile.length) return;

    return user.profile;
  }
}

module.exports = Get;
