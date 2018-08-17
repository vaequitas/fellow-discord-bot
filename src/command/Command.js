class Command {
  constructor(client, options = {}) {
    this.client = client;
    this.name   = options.name;
    this.aliases = options.aliases || [];
    this.description = options.description || null;
  }
}

module.exports = Command;
