const Viewing = require('./Viewing.js');

class ViewingFactory {
  static async create(viewing) {
    return new Viewing(await viewing);
  }
}

module.exports = ViewingFactory;
