const UserDal = require('../dal/User.js');

class UserProvider {
  constructor(database) {
    this.dal = new UserDal(database);
  }

  async getUser(userId) {
    return await this.dal.getUser(userId);
  }

  async modifyUser(userId, config) {
    return await this.dal.modifyUser(userId, config);
  }
}

module.exports = UserProvider;
