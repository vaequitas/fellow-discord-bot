const Command = require('../../Command.js');
const SpoilerProvider = require('../../../providers/Spoiler.js');

class Spoiler extends Command {
  constructor(...args) {
    super(...args, {
      name: 'spoiler',
      description: 'spoil something',
      usages: ['spoiler', 'spoiler :spoiler tag; this is a spoiler', 'spoiler this is a spoiler'],
      long_description: 'This is a PoC',
      aliases: ['spoil', 's'],
      enabled: true,
    });

    this.spoilerProvider = new SpoilerProvider(this.client.firebase.database())

    this.client.on('raw', async event => {
      if (event.t !== 'MESSAGE_REACTION_ADD')
        return;

      const user = this.client.users.get(event.d.user_id);
      if (user.bot) return;

      const messageId = event.d.message_id;
      const spoiler = await this.spoilerProvider.get(messageId);
      if (!spoiler || !spoiler.text.length)
        return

      user.send(spoiler.text);
    });
  }

  async run(message, args) {
    if (!args.length)
      return message.channel.send(this.getHelp());

    message.delete();

    const full_message = args.join(' ').trim();
    let tag = ''
    if (full_message.indexOf(':') === 0) {
      const spoiler_tag_start = 0;
      const spoiler_tag_stop  = full_message.indexOf(';')
      tag = full_message.substr(spoiler_tag_start, spoiler_tag_stop).substr(1).trim();
    }

    const spoiler = tag.length ? full_message.substr(full_message.indexOf(';')).substr(1).trim() : full_message;
    if (!spoiler.length)
      return

    tag = tag.length ? tag : 'untagged';

    const new_message = await message.channel.send(`Spoiler [${tag}] from ${message.author}. React to this message to receive it.`);
    await new_message.react('🔊');
    return await this.spoilerProvider.save(new_message.id, spoiler);
  }
}

module.exports = Spoiler;
