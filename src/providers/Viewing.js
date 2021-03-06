const ViewingDal = require('../dal/Viewing.js');
const ViewingFactory = require('../structures/ViewingFactory.js');

class ViewingProvider {
  constructor(database) {
    this.dal = new ViewingDal(database);
  }

  async save(viewing) {
    return await this.dal.save(viewing.date, viewing.host);
  }

  async getNext() {
    const viewingRaw = await this.dal.getNextViewing();
    if (!viewingRaw)
      return null;

    return await ViewingFactory.create(viewingRaw);
  }

  async getAllPending() {
    const viewings = await this.dal.getAllAfter(new Date().toISOString());
    if (!viewings)
      return;

    return viewings;
  }
}

module.exports = ViewingProvider;
