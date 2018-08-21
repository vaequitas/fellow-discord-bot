const fetch = require('node-fetch');

class ShowProvider {
  async searchSingle(searchTerm) {
    const queryTemplate = `
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

    const variables = {
        search: searchTerm
    };

    const query = await this.buildQuery(queryTemplate, variables);
    const data = await this.queryApi(query);
    return data.Media;
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

    const response = await fetch(url, options);
    const responseJson = await response.json();
    if(!responseJson.ok)
      Promise.reject(responseJson);

    console.log(responseJson);
    return responseJson.data;
  }
}

module.exports = ShowProvider;
