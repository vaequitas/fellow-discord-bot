const Command = require('../../../Command.js');

class Make extends Command {
  constructor(...args) {
    super(...args, {
      name: 'make',
      enabled: true,
    });
    this.parent = 'suggestion'
  }

  async run(message, args) {
    console.log('not implemented');
  }
}

module.exports = Make;
