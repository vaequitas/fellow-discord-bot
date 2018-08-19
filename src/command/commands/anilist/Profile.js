const Command = require('../../Command.js');
const fetch = require('node-fetch');
const UserProvider = require('../../../providers/User.js');

class Profile extends Command {
  constructor(...args) {
    super(...args, {
      name: 'profile',
      description: 'search or manage anilist profiles linked to users',
      usages: ['profile', 'profile search username', 'profile @discord_username', 'profile set anilist_profile_url'],
      long_description: 'This command queries the AniList API to try and find the best matched user for the provided username',
      aliases: ['stalk'],
      enabled: true,
    });
    this.user = new UserProvider(this.client.firebase.database());
  }

  async run(message, args) {
    let userId = null;
    if (!args.length) {
      userId = message.author.id;
    } else if (args[0] === 'get') {
      userId = args[1].match(/<@(\d+)>/)[1];
    } else if (args[0] && args[0].match(/<@(\d+)>/) && args[0].match(/<@(\d+)>/).length) {
      userId = args[0].match(/<@(\d+)>/)[1];
    }

    if (userId) {
      const profile = await this.getProfile(userId);
      if (!profile)
        return message.reply(`Couldn't find a profile for <@${userId}>`);
      return message.channel.send(`Found the following profile for <@${userId}>: ${profile}`);
    }

    if (args[0] == 'set') {
      if (!args[1].match(/https:\/\/anilist.co\/user\/.*/))
        return message.reply('Sorry, that doesn\'t look like an anilist profile.');
      const user = await this.user.modifyUser(message.author.id, {profile: args[1]});
      return message.reply(`set your profile.`);
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

  async getProfile(userId) {
    const user = await this.user.getUser(userId);
    const profile = user.profile;
    return profile;
  }
}

module.exports = Profile;
