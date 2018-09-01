const VoteDal = require('../dal/Vote.js');
const { Collection } = require('discord.js');

class VoteProvider {
  constructor(database) {
    this.dal = new VoteDal(database);
  }

  async addVote(viewingId, userId, suggestionId) {
    await this.dal.update(viewingId, userId, suggestionId);
    return {ok: true}
  }
}

module.exports = VoteProvider;
