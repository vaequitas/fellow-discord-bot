const Command = require('../../Command.js');
const CommandStore = require('../../CommandStore.js');
const fetch = require('node-fetch');
const UserProvider = require('../../../providers/User.js');
const path = require('path');

class Profile extends Command {
  constructor(...args) {
    super(...args, {
      name: 'profile',
      description: 'search or manage anilist profiles linked to users',
      usages: ['profile', 'profile get [@discord_username]', 'profile search [username]', 'profile set [anilist_profile_url]'],
      long_description: [
        'Manage/view AniList profiles of other discord users and yourself.',
        'Set your own profile URL using `profile set https://anilist.co/user/YOUR_USER`.',
        'View other people\'s profiles by using `profile get @test_user` (the get is optional)',
        'Search for a user on AniList via `profile search test_username`',
      ].join('\n'),
      aliases: ['stalk'],
      enabled: true,
    });

    this.user = new UserProvider(this.client.firebase.database());

    this.subcommands = new CommandStore(this.client, {
      dir: `${path.dirname(require.main.filename)}${path.sep}src${path.sep}command${path.sep}commands${path.sep}anilist${path.sep}profile`,
      parent: this.name
    });
    this.subcommands.loadFiles();
  }

  async run(message, args) {
    if (args.length && this.subcommands.has(args[0])) {
      const command = args.shift().toLowerCase();
      return await this.subcommands.get(command).run(message, args)
    }

    if (args[0] !== 'search')
      return message.channel.send(this.getHelp());

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
