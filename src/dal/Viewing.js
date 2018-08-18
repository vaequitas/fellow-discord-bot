class ViewingDal {
  constructor(database) {
    this.database = database;
  }

  async getViewing(viewingId) {
    return await this.database.ref('/viewings/' + viewingId).once('value').then(function(snapshot) {
      return snapshot.val();
    });
  }

  async getFirstViewingAfter(date) {
    return await this.database.ref('/viewings/').orderByChild('date').startAt(date).limitToFirst(1).once('value').then(snapshot => {
      let firstElement = null;
      snapshot.forEach(element => {
        firstElement = element.val();
      });
      return firstElement;
    });
  }

  async getNextViewing() {
    return await this.getFirstViewingAfter(new Date().toISOString());
  }
}

module.exports = ViewingDal;
