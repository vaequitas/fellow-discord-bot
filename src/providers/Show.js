const fetch = require('node-fetch');

class ShowProvider {
  async getById(id) {
    const queryTemplate = `
    query ($id: Int) {
      Media (id: $id, type: ANIME) {
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
        id: id
    };

    const query = await this.buildQuery(queryTemplate, variables);
    const data = await this.queryApi(query);
    return data.Media;
  }

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
    if (!data)
      return
    const media = data[Math.floor(Math.random()*data.length)];
    return media;
  }

  async getRandomTopGenre(limit, genre) {
    const data = await this.getSortedShows('SCORE_DESC', limit, genre);
    if (!data)
      return;
    const media = data[Math.floor(Math.random()*data.length)];
    return media;
  }

  async getSortedShows(sort, limit, opts = {}) {
    const queryTemplate = `
    query ($page: Int, $perPage: Int, $sort: [MediaSort], $genre_in: [String], $tag_in: [String]) {
      Page (page: $page, perPage: $perPage) {
        pageInfo {
          total
        }
        media (sort: $sort, genre_in: $genre_in, status: FINISHED, type: ANIME, tag_in: $tag_in) {
          averageScore
          siteUrl
          title {
            romaji
            english
            native
          }
        }
      }
    }
    `;

    let variables = {
      sort: sort,
      page: 1,
      perPage: limit,
    };

    if (opts.genre && opts.genre.length)
      variables.genre_in = opts.genre

    if (opts.tag && opts.tag.length)
      variables.tag_in = opts.tag

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
