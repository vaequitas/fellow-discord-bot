const path = require('path');
const fs   = require('fs-nextra');

class CommandStore {
  constructor() {
    this.commands = {};
    this.dir      = `${path.dirname(require.main.filename)}${path.sep}src${path.sep}command${path.sep}commands`
  }

  set(command) {
    this.commands[command.name.toLowerCase()] = command;
  }

  has(name) {
    return this.commands[name];
  }

  get(name) {
    return this.commands[name];
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
