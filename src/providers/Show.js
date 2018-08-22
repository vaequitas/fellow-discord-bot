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
    if (!data)
      return
    const media = data[Math.floor(Math.random()*data.length)];
    return media;
  }

  async getRandomFirstTop(limit) {
    const data = await this.getSortedShows('SCORE_DESC', limit);
    if (!data)
      return;
    const firstData = this.filterSequels(data);
    const media = firstData[Math.floor(Math.random()*firstData.length)];
    return media;
  }

  filterSequels(data) {
    return data.filter(media => {
      if (!media.relations.edges.length)
        return true

      return !media.relations.edges.some(relation => {
        return (['PREQUEL', 'PARENT'].includes(relation.relationType))
      })
    });
  }

  async getRandomTopGenre(limit, genre) {
    const data = await this.getSortedShows('SCORE_DESC', limit, genre);
    if (!data)
      return;
    const media = data[Math.floor(Math.random()*data.length)];
    return media;
  }

  async getRandomFirstTopGenre(limit, opts) {
    const data = await this.getSortedShows('SCORE_DESC', limit, opts);
    if (!data)
      return;
    const firstData = this.filterSequels(data);
    const media = firstData[Math.floor(Math.random()*firstData.length)];
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
          relations {
            edges {
              relationType
            }
          }
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
