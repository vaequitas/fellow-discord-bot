const Command = require('../../Command.js');
const SpoilerProvider = require('../../../providers/Spoiler.js');

class Spoiler extends Command {
  constructor(...args) {
    super(...args, {
      name: 'spoiler',
      description: 'spoil something',
      usages: ['spoiler', 'spoiler :spoiler tag; spoiler text', 'spoiler spoiler text'],
      long_description: 'This is a POC',
      aliases: ['spoil'],
      enabled: true,
    });

    this.spoilerProvider = new SpoilerProvider(this.client.firebase.database())

    this.client.on('raw', async event => {
      if (event.t !== 'MESSAGE_REACTION_ADD')
        return;

      const messageId = event.d.message_id;
      const spoiler = await this.spoilerProvider.get(messageId);
      if (!spoiler || !spoiler.text.length)
        return

      const user = this.client.users.get(event.d.user_id);
      user.send(spoiler.text);
    });
  }

  async run(message, args) {
    if (!args.length)
      return message.channel.send(this.getHelp());

    message.delete(1000);

    const full_message = args.join(' ')
    const spoiler_tag_start = full_message.indexOf(':');
    const spoiler_tag_stop = full_message.indexOf(';', spoiler_tag_start)
    let tag = full_message.substr(
      spoiler_tag_start,
      spoiler_tag_stop
    ).substr(1).trim();
    const spoiler = tag.length ? full_message.substr(spoiler_tag_stop).substr(1).trim() : full_message;

    tag = tag ? tag : 'untagged';

    const new_message = await message.channel.send(`Spoiler [${tag}] from ${message.author}. React to this message to receive it.`);
    await this.spoilerProvider.save(new_message.id, spoiler);
  }
}

module.exports = Spoiler;
