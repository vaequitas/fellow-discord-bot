class Command {
  constructor(client, options = {}) {
    this.client = client;
    this.name   = options.name;
    this.aliases = options.aliases || [];
    this.description = options.description || null;
    this.long_description = options.long_description || null;
    this.usage = options.usage || (options.usages && options.usages.join('\n  ')) || options.name;
    this.enabled = options.enabled || false;
  }

  getHelp() {
    return `
\`\`\`
${this.name}

usage:
  ${this.usage}

${this.description.length ? `description: ${this.description}` : ''}
${this.aliases.length ?     `aliases:     ${this.aliases.join(', ')}` : ''}
${this.long_description ? `\n\n${this.long_description}` : ''}
\`\`\`
    `;
  }
}

module.exports = Command;
