const path = require('path');
const fs   = require('fs-nextra');
const { Collection } = require('discord.js');

class CommandStore extends Collection {
  constructor() {
    super();

    this.name = 'commands';
    this.commands = {};
    this.dir      = `${path.dirname(require.main.filename)}${path.sep}src${path.sep}command${path.sep}commands`

    this.aliases = new Collection();
  }

  set(command) {
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
      const parsedFile = {
        path: file,
        name: path.parse(filepath).name
      };
      const command = this.set(new (require(filepath))());
      delete require.cache[filepath];
      return command;
    } catch (error) {
      console.log(`Failed to load ${filepath}`);
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
