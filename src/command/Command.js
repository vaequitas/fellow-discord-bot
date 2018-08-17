class Command {
  constructor(options = {}) {
    this.name   = options.name;
    this.aliases = options.aliases || [];
    this.description = options.description || null;
  }
}

module.exports = Command;
