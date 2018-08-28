const Command = require('../../../Command.js');
const ViewingProvider = require('../../../../providers/Viewing.js');
const Viewing = require('../../../../structures/Viewing.js');
const chrono = require('chrono-node');
const perms = require('../../../../../.permissions.json');

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
    const hasPerm = perms.roles.hosts.some(roleId => {
      return message.guild.member(message.author).roles.has(roleId)
    });

    if (!hasPerm)
      return await message.reply(`you don't have permission to do that. Sorry!`)

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
    const new_message = await message.channel.send({embed: {
      title: 'Viewing creation',
      description: `Are you sure you want to create the below viewing, ${message.author.username}?`,
      time: new Date(),
      fields: [
        {
          name: "Date",
          value: dateString,
        }, {
          name: "Host",
          value: message.author.username
        },
      ],
      footer: {
        text: `Viewing creation for ${message.author.username}`,
      }
    }});
    new_message.react('☑');
    new_message.react('❎');
    const filter = (reaction, user) => (reaction.emoji.name === '☑' || reaction.emoji.name === '❎') && user.id === message.author.id
    await new_message.awaitReactions(filter, {time: 30000, max: 1})
      .then(async collected => {
        if (!collected.size) {
          new_message.edit({embed: {
            title: 'Viewing creation',
            description: 'Viewing creation confirmation timed out',
            timestamp: new Date(),
            color: 16711682,
            footer: {
              text: `Viewing creation for ${message.author.username}`,
            },
          }});
          return false
        }

        if (collected.has('❎')) {
          new_message.edit({embed: {
            title: 'Viewing creation',
            description: 'Viewing creation was cancelled',
            timestamp: new Date(),
            color: 16711682,
            footer: {
              text: `Viewing creation for ${message.author.username}`,
            },
          }});
          return false;
        }

        await this.provider.save(viewing);
        new_message.edit({embed: {
          title: 'Viewing creation',
          description: `Viewing created`,
          color: 43024,
          timestamp: new Date(),
          footer: {
            text: `Viewing creation for ${message.author.username}`,
          },
        }});
      }).catch(console.error);
    new_message.clearReactions();
  }
}

module.exports = Create;
