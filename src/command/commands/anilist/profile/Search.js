const Command = require('../../../Command.js');
const fetch = require('node-fetch');

class Search extends Command {
  constructor(...args) {
    super(...args, {
      name: 'search',
      enabled: true,
    });
    this.parent = 'profile'
  }

  async run(message, args) {
    if (!args.length)
      return message.reply('you didn\'t give me anything to search for :c')

    const searchTerm = args.join(' ');
    const user = await this.searchUser(searchTerm);
    if (!user)
      return message.reply('sorry! I couldn\'t find any profiles for that search term.')

    return message.reply(`I found a profile belonging to ${user.name}: ${user.siteUrl}`)
  }

  async searchUser(searchTerm) {
    const queryTemplate = `
    query ($search: String) {
      User (search: $search) {
        name
        siteUrl
      }
    }
    `;

    const variables = {
        search: searchTerm
    };

    const query = await this.buildQuery(queryTemplate, variables);
    const data = await this.queryApi(query);
    if (!data)
      return

    return data.User;
  }

  async buildQuery(query, variables) {
    return JSON.stringify({
      query: query,
      variables: variables
    });
  }

  async queryApi(query) {
    var url = 'https://graphql.anilist.co',
        options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: query
        };

    const response = await fetch(url, options)

    if(!response.ok)
      return

    const responseJson = await response.json();
    return responseJson.data;
  }
}

module.exports = Search;
