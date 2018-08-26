const ViewingDal = require('../dal/Viewing.js');
const ViewingFactory = require('../structures/ViewingFactory.js');
const { Collection } = require('discord.js');

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
    const viewingsRaw = await this.dal.getAllAfter(new Date().toISOString());
    if (!viewingsRaw)
      return;

    const viewings = new Collection();
    for (const viewing in viewingsRaw) {
      const viewingObj = await ViewingFactory.create(viewingsRaw[viewing]);
      viewings.set(viewing, viewingObj);
    }

    return viewings;
  }
}

module.exports = ViewingProvider;
