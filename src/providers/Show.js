const fetch = require('node-fetch');

class ShowProvider {
  async searchSingle(searchTerm) {
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
        search: searchTerm
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

    const response = await fetch(url, options);
    const responseJson = await response.json();
    if(!responseJson.ok)
      Promise.reject(responseJson);

    const media = responseJson.data.Media;
    return media;
  }
}

module.exports = ShowProvider;
