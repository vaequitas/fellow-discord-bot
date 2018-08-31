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
      const mentions = message.mentions.members;
      if (!mentions.size)
        return

      member = mentions.first().user;
    }

    const profile = await this.getProfile(member.id);
    if (!profile)
      return message.channel.send({embed: {
        title: 'Profile Request',
        description: `${member.username} has not linked their profile`,
        color: 16711682,
        timestamp: new Date(),
        footer: {
          text: `Profile request from ${message.author.username}`
        }
      }})

    return message.channel.send({embed: {
      title: 'Profile Request',
      description: `Found the following profile for ${member.username}`,
      color: 43024,
      timestamp: new Date(),
      fields: [
        {
          name: 'Profile URL',
          value: profile,
        },
      ],
      footer: {
        text: `Profile request from ${message.author.username}`
      }
    }})
  }

  async getProfile(userId) {
    const user = await this.user.getUser(userId);
    if (!user || !user.profile.length) return;

    return user.profile;
  }
}

module.exports = Get;
