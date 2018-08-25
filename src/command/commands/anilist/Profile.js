const Command = require('../../Command.js');
const CommandStore = require('../../CommandStore.js');
const path = require('path');

class Profile extends Command {
  constructor(...args) {
    super(...args, {
      name: 'profile',
      description: 'search or manage anilist profiles linked to users',
      usages: ['profile', 'profile get [@discord_username]', 'profile search [username]', 'profile set [anilist_profile_url]'],
      long_description: [
        'Manage/view AniList profiles of other discord users and yourself.',
        'Set your own profile URL using `profile set https://anilist.co/user/YOUR_USER`.',
        'View other people\'s profiles by using `profile get @test_user` (the get is optional)',
        'Search for a user on AniList via `profile search test_username`',
      ].join('\n'),
      aliases: ['stalk'],
      enabled: true,
    });

    this.subcommands = new CommandStore(this.client, {
      dir: `${path.dirname(require.main.filename)}${path.sep}src${path.sep}command${path.sep}commands${path.sep}anilist${path.sep}profile`,
      parent: this.name
    });
    this.subcommands.loadFiles();
  }

  async run(message, args) {
    if (args.length && this.subcommands.has(args[0])) {
      const command = args.shift().toLowerCase();
      return await this.subcommands.get(command).run(message, args)
    }

    return await this.subcommands.get('get').run(message, args);
  }
}

module.exports = Profile;
