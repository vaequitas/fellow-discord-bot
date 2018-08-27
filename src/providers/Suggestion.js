const SuggestionDal = require('../dal/Suggestion.js');
const { Collection } = require('discord.js');

class SuggestionProvider {
  constructor(database) {
    this.dal = new SuggestionDal(database);
  }

  async update(viewingId, userId, config) {
    return await this.dal.update(viewingId, userId, config);
  }

  async get(viewingId) {
    const suggestionsRaw = await this.dal.get(viewingId);
    if (!suggestionsRaw) return

    const suggestions = new Collection();
    for (const suggestion in suggestionsRaw) {
      suggestions.set(suggestion, suggestionsRaw[suggestion]);
    }

    return suggestions;
  }

  async getUserSuggestion(viewingId, userId) {
    return await this.dal.getViewingUser(viewingId, userId);
  }

  async getShowSuggestion(viewingId, showId) {
    const viewing = await this.get(viewingId);
    if (!viewing)
      return

    return viewing.find(element => element.id === showId);
  }
}

module.exports = SuggestionProvider;
