const Command = require('../../Command.js');
const fetch = require('node-fetch');
const UserProvider = require('../../../providers/User.js');

class Profile extends Command {
  constructor(...args) {
    super(...args, {
      name: 'profile',
      description: 'searches for an anilist user',
      usages: ['profile', 'profile search username', 'profile @discord_username', 'profile set anilist_profile_url'],
      long_description: 'This command queries the AniList API to try and find the best matched user for the provided username',
      aliases: ['stalk']
    });
    this.user = new UserProvider(this.client.firebase.database());
  }

  async run(message, args) {
    if (!args.length) {
      const user = await this.user.getUser('188385961200189441');
      const profile = user.profile;
      //const profile = await this.user.getUser(message.author.id).profile;

      return message.reply(`Your profile is ${profile}`);
    }

    if (args[0] == 'set') {
      if (!args[1].match(/https:\/\/anilist.co\/user\/.*/))
        return message.reply('Sorry, that doesn\'t look like an anilist profile.');
      const user = await this.user.modifyUser(message.author.id, {profile: args[1]});
      return message.reply(`set your profile.`);
    }

    const match = args[0].match(/<@(\d+)>/);
    if (match) {
      const userId = match[1];
      const user = await this.user.getUser(userId);
      const profile = user.profile;
      const m = `<@${userId}>'s profile is ${profile}`;
      return message.channel.send(m);
    }

    if (args[0] == 'get') {
      const userId = args[1].match(/<@(\d+)>/)
      const user = await this.user.getUser(userId[1]);
      const profile = user.profile;
      //const profile = await this.user.getUser(message.author.id).profile;

      return message.channel.send(`<@${userId[1]}>'s profile is ${profile}`);
    }

    if (args[0] !== 'search')
      return message.reply(this.getHelp());

    var query = `
    query ($search: String) {
      User (search: $search) {
        name
        siteUrl
      }
    }
    `;

    var variables = {
        search: args[1]
    };

    var url = 'https://graphql.anilist.co',
        options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        };

    fetch(url, options).then(handleResponse)
                       .then(handleData)
                       .catch(handleError);

    function handleResponse(response) {
      return response.json().then(json => {
        return response.ok ? json : Promise.reject(json);
      });
    }

    function handleData(data) {
      const user = data.data.User;
      const m = `I found the user ${user.name}: ${user.siteUrl}`;
      return message.reply(m);
    }

    function handleError(error) {
      console.error('Error searching for user', error);
    }
  }
}

module.exports = Profile;
