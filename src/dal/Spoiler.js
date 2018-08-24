class SpoilerDal {
  constructor(database) {
    this.database = database;
  }

  async get(id) {
    return await this.database.ref('/spoilers/' + id).once('value').then(function(snapshot) {
      return snapshot.val();
    }).catch(() => {
      return;
    });
  }

  async save(id, spoiler) {
    return await this.database.ref('/spoilers/' + id).set({
      text: spoiler
    });
  }
}

module.exports = SpoilerDal;
