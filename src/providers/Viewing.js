const ViewingDal = require('../dal/Viewing.js');
const ViewingFactory = require('../structures/ViewingFactory.js');

class ViewingProvider {
  constructor(database) {
    this.dal = new ViewingDal(database);
  }

  async getNext() {
    const viewingRaw = await this.dal.getNextViewing();
    if (!viewingRaw)
      return null;

    return await ViewingFactory.create(viewingRaw);
  }
}

module.exports = ViewingProvider;
