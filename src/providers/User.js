const UserDal = require('../dal/User.js');

class UserProvider {
  constructor(database) {
    this.dal = new UserDal(database);
  }

  async getUser(userId) {
    const user = await this.dal.getUser(userId);

    if (user) return user;

    return await this.dal.createUser(userId);
  }

  async modifyUser(userId, config) {
    return await this.dal.modifyUser(userId, config);
  }
}

module.exports = UserProvider;
