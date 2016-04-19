var path = require('path');

module.exports = {
  entry: './js/index',
  output: {
    filename: 'login-form.bundle.js',
    path: path.join(__dirname, 'dist'),
    library: 'umd'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
      { test: /\.jade$/, loader: 'babel' }
    ]
  },
  babel: {
    presets: ['es2015']
  },
  externals: [
    /^[^\.]/
  ]
};
