const Command = require('../../Command.js');

class Purge extends Command {
  constructor(...args) {
    super(...args, {
      name: 'purge',
      description: 'Deletes a number of messages from the channel',
      usage: 'purge delete_count',
      enabled: false,
    });
  }

  async run(message, args) {
    const deleteCount = parseInt(args[0], 10);

    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");

    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    return message.channel.bulkDelete(fetched)
      .then(messages => console.log(`Bulk deleted ${messages.size} messages from ${message.channel.name}`))
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }
}

module.exports = Purge;
