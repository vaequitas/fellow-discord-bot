const path = require('path');
const fs   = require('fs-nextra');
const { Collection } = require('discord.js');

class CommandStore extends Collection {
  constructor(client, opts) {
    super();

    this.name     = 'commands';
    this.client   = client;
    this.commands = {};
    this.dir      = opts.dir;
    this.parent   = opts.parent || null;

    this.aliases = new Collection();
  }

  set(command) {
    if (command.parent && command.parent != this.parent)
      return

    const exists = this.get(command.name);
    if (exists) this.delete(command.name);
    super.set(command.name, command);

    if (command.aliases.length)
      command.aliases.forEach(item => {
        this.aliases.set(item, command)
      });

    return command;
  }

  has(name) {
    return super.has(name) || this.aliases.has(name);
  }

  get(name) {
    return super.get(name) || this.aliases.get(name);
  }


  load(file) {
    const filepath = path.join(this.dir, file);
    try {
      const command = new (require(filepath))(this.client);
      if (this.client.dev_mode || command.enabled)
        this.set(command);
      delete require.cache[filepath];
      return command;
    } catch (error) {
      console.log(`Failed to load ${filepath} due to ${error}`);
      return;
    }
  }

  async loadFiles() {
    await this.walkFiles();
  }

  async walkFiles() {
    return fs.scan(this.dir, { filter: (stats, filepath) => stats.isFile() && path.extname(filepath) === ".js" })
      .then(files => Promise.all([...files.keys()].map(file => this.load(path.relative(this.dir, file)))))
      .catch(error => console.log(error));
  }
}

module.exports = CommandStore;
