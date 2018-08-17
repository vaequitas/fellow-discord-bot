const Command = require('../../Command.js');
const fetch = require('node-fetch');

class Profile extends Command {
  constructor(...args) {
    super(...args, {
      name: 'profile',
      description: 'searches for an anilist user',
      usage: 'profile username',
      long_description: 'This command queries the AniList API to try and find the best matched user for the provided username',
      aliases: ['stalk']
    });
  }

  async run(message, args) {
    var query = `
    query ($search: String) {
      User (search: $search) {
        name
        siteUrl
      }
    }
    `;

    var variables = {
        search: args[0]
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
