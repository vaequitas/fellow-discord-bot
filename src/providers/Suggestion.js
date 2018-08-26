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
}

module.exports = SuggestionProvider;
