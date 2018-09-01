const VoteDal = require('../dal/Vote.js');
const { Collection } = require('discord.js');

class VoteProvider {
  constructor(database) {
    this.dal = new VoteDal(database);
  }

  async addVote(viewingId, userId, suggestionId) {
  }
}

module.exports = VoteProvider;
