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

  async getAll(viewingId) {
    const votesRaw = await this.dal.getAll(viewingId);
    const votes = new Collection();
    if (!votesRaw) return votes;

    for (const vote in votesRaw) {
      votes.set(vote, votesRaw[vote]);
    }

    return votes;
  }
}

module.exports = VoteProvider;
