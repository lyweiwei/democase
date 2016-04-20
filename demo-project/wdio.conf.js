var path = require('path');
var democase = require('..');

var demoSet = democase.loadSync(path.resolve(__dirname, 'demo'));

module.exports = {
  config: demoSet.wdioConfig()
};
