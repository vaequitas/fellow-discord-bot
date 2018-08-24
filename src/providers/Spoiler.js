const SpoilerDal = require('../dal/Spoiler.js');

class SpoilerProvider {
  constructor(database) {
    this.dal = new SpoilerDal(database);
  }

  async get(spoilerId) {
    return await this.dal.get(spoilerId);
  }

  async save(id, spoiler) {
    return await this.dal.save(id, spoiler);
  }
}

module.exports = SpoilerProvider;
