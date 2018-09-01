class VoteDal {
  constructor(database) {
    this.database = database;
  }

  async update(viewingId, userId, suggestionId) {
    return await this.database.ref(`/votes/${viewingId}`).update({[userId]: suggestionId})
  }

  async get(viewingId, userId) {
  }
}

module.exports = VoteDal;
