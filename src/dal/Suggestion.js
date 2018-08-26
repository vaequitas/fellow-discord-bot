class SuggestionDal {
  constructor(database) {
    this.database = database;
  }

  async update(viewingId, userId, config) {
    return await this.database.ref(`/suggestions/${viewingId}/${userId}`).update(config)
  }

  async get(viewingId) {
    return await this.database.ref('/suggestions/' + viewingId).once('value').then(function(snapshot) {
      return snapshot.val();
    });
  }

  async getViewingUser(viewingId, userId) {
    return await this.database.ref(`/suggestions/${viewingId}/${userId}`).once('value').then(snapshot => {
      return snapshot.val();
    });
  }
}

module.exports = SuggestionDal;
