const SuggestionDal = require('../dal/Suggestion.js');
const { Collection } = require('discord.js');

class SuggestionProvider {
  constructor(database) {
    this.dal = new SuggestionDal(database);
  }

  async update(viewingId, userId, suggestion) {
    const existingSuggestion = await this.getUserSuggestion(viewingId, userId);
    if (existingSuggestion && existingSuggestion.votes && existingSuggestion.votes > 0)
      return this.errorReturn('Your existing suggestion already has votes, therefore can\'t be changed.')

    const viewingHasShow = await this.getShowSuggestion(viewingId, suggestion.id);
    if (viewingHasShow)
      return this.errorReturn('That show has already been suggested for this viewing.')

    await this.dal.update(viewingId, userId, suggestion);
    return { ok: true };
  }

  errorReturn(message) {
    return {
      ok: false,
      error: message
    }
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
