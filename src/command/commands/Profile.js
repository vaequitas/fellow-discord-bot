const Command = require('../Command.js');

class Profile extends Command {
  constructor(...args) {
    super(...args, {
      name: 'profile',
      description: 'Get a link to a users anilist profile',
    });
  }

  async run(message) {
    const user = args.shift().toLowerCase();
    const m    = `https://anilist.co/user/${user}`
    return message.channel.send(m);
  }
}

module.exports = Profile;
