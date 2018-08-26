const SuggestionDal = require('../dal/Suggestion.js');

class SuggestionProvider {
  constructor(database) {
    this.dal = new SuggestionDal(database);
  }

  async update(viewingId, userId, config) {
    return await this.dal.update(viewingId, userId, config);
  }
}

module.exports = SuggestionProvider;
