const { Collection } = require('discord.js');

class ViewingDal {
  constructor(database) {
    this.database = database;
  }

  async save(date, host) {
    const viewingsRef = await this.database.ref('/viewings');
    const newViewingRef = await viewingsRef.push();
    await newViewingRef.set({
      date: date,
      host: host,
    });

    return newViewingRef.key
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

  async getAllAfter(date) {
    return await this.database.ref('/viewings/').orderByChild('date').startAt(date).once('value').then(snapshot => {
      if (!snapshot.val())
        return

      const viewings = new Collection();
      snapshot.forEach((element) => {
        viewings.set(element.key, element.val());
      });

      return viewings;
    });
  }

  async getNextViewing() {
    return await this.getFirstViewingAfter(new Date().toISOString());
  }
}

module.exports = ViewingDal;
