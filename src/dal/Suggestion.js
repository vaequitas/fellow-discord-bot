class SuggestionDal {
  constructor(database) {
    this.database = database;
  }

  async update(viewingId, userId, config) {
    return await this.database.ref(`/suggestions/${viewingId}/${userId}`).update(config)
  }
}

module.exports = SuggestionDal;
