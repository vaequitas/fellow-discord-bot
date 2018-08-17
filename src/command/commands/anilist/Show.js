const Command = require('../../Command.js');
const fetch = require('node-fetch');

class Show extends Command {
  constructor(...args) {
    super(...args, {
      name: 'show',
      description: 'Get a link to a show on anilist',
    });
  }

  async run(message, args) {
    var query = `
    query ($search: String) {
      Media (search: $search, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        siteUrl
      }
    }
    `;

    var variables = {
        search: args.join(' ')
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
      const media = data.data.Media;
      const m = `I found the show ${media.title.romaji}: ${media.siteUrl}`;
      return message.reply(m);
    }

    function handleError(error) {
      console.error('Error searching for show', error);
    }
  }
}

module.exports = Show;