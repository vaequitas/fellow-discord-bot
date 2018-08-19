class UserDal {
  constructor(database) {
    this.database = database;
  }

  async getUser(userId) {
    return await this.database.ref('/users/' + userId).once('value').then(function(snapshot) {
      return snapshot.val();
    });
  }

  async createUser(userId, name) {
    return await this.database.ref('/users/' + userId).set({
      name: `${userId}`
    }).then(() => {
      return this.getUser(userId);
    });
  }

  async modifyUser(userId, config) {
    return await this.database.ref('/users/' + userId).update(config)
  }
}

module.exports = UserDal;
