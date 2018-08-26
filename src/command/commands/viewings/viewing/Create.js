const Command = require('../../../Command.js');
const ViewingProvider = require('../../../../providers/Viewing.js');
const Viewing = require('../../../../structures/Viewing.js');
const chrono = require('chrono-node');

class Create extends Command {
  constructor(...args) {
    super(...args, {
      name: 'create',
      enabled: true,
    });
    this.provider = new ViewingProvider(this.client.firebase.database());
    this.parent = 'viewing'
  }

  async run(message, args) {
    const full_message = args.join(' ');
    const results      = await chrono.parse(full_message);
    if (!results.length)
      return

    const result = results.shift();
    const timezoneOffset = result.start.get('timezoneOffset');
    if (!timezoneOffset)
      result.start.assign('timezoneOffset', 0);

    if (!result.start.isCertain('hour'))
      result.start.assign('hour', 20);

    if (new Date(result.start.date()) < new Date()) {
      if (result.start.isCertain('weekday'))
        result.start.assign('day', result.start.get('day') + 7);
      else if (result.start.isCertain('day'))
        return message.reply('you can\'t host for a day in the past');
      else if (result.start.isCertain('hour'))
        result.start.assign('day', result.start.get('day') + 1);
    }

    let date = new Date(result.start.date());
    if (!date) return

    const viewing = new Viewing({
      date: date.toISOString(),
      host: message.author.id,
    });
    const dateString = date.toUTCString();
    const new_message = await message.reply(`are you sure you want to host a viewing on ${dateString}? React to this message to confirm`);
    await new_message.react('☑');

    const filter = (reaction, user) => reaction.emoji.name === '☑' && user.id === message.author.id
    new_message.awaitReactions(filter, {time: 15000, max: 1})
      .then(async collected => {
        if (!collected.size)
          return message.reply('confirmation timed out. Cancelling creation.');

        const viewingKey = await this.provider.save(viewing);
        return await message.reply(`succesfully created viewing ${viewingKey}`);
      }).catch(console.error);
  }
}

module.exports = Create;
