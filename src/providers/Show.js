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

  async getRandomTop(limit) {
    const data = await this.getSortedShows('SCORE_DESC', limit);
    const media = data[Math.floor(Math.random()*data.length)];
    return media;
  }

  async getRandomTopGenre(limit, genre) {
    const data = await this.getSortedShows('SCORE_DESC', limit, genre);
    const media = data[Math.floor(Math.random()*data.length)];
    return media;
  }

  async getSortedShows(sort, limit, genre) {
    const queryTemplate = `
    query ($page: Int, $perPage: Int, $sort: [MediaSort], $genre: String) {
      Page (page: $page, perPage: $perPage) {
        pageInfo {
          total
        }
        media (sort: $sort, genre: $genre) {
          averageScore
          siteUrl
          title {
            romaji
          }
        }
      }
    }
    `;

    let variables = {
      sort: sort,
      page: 1,
      perPage: limit
    };

    if (genre && genre.length)
      variables.genre = genre

    const query = await this.buildQuery(queryTemplate, variables);
    const data = await this.queryApi(query);
    if (!data.Page || !data.Page.media.length)
      return

    return data.Page.media;
  }

  async searchMultiple(searchTerm, limit) {
    const queryTemplate = `
    query ($id: Int, $page: Int, $perPage: Int, $search: String) {
      Page (page: $page, perPage: $perPage) {
        pageInfo {
          total
        }
        media (id: $id, search: $search) {
          averageScore
          siteUrl
          title {
            romaji
          }
        }
      }
    }
    `;

    const variables = {
      search: searchTerm,
      page: 1,
      perPage: limit
    };

    const query = await this.buildQuery(queryTemplate, variables);
    const data = await this.queryApi(query);
    if (!data.Page || !data.Page.media.length)
      return

    return data.Page.media;
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
    if(!response.ok)
      Promise.reject(response);

    const responseJson = await response.json();
    return responseJson.data;
  }
}

module.exports = ShowProvider;
