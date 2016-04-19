import _ from 'lodash';
import webpack from 'webpack';
import express from 'express';
import webpackDevMiddleware from 'webpack-dev-middleware';
import { lookUp } from './util';

function webpackConfig(demoSet) {
  return lookUp('webpack.config.js').then(require).then(config => _.omit(config, [
    'entry',
    'output',
    'externals'
  ])).then(config => _.merge(config, {
    entry: _.chain(demoSet.demos)
      .mapKeys(demo => demo.relativePath.replace(/\//g, '_'))
      .mapValues(demo => demo.entry)
      .value(),
    output: {
      filename: '[name].bundle.js',
      path: '/'
    },
    resolve: {
      alias: {
        [demoSet.packageName]: demoSet.packagePath
      }
    }
  }));
}

export function serve(demoSet) {
  return webpackConfig(demoSet).then(config => {
    var server = express();
    server.use(webpackDevMiddleware(webpack(config), {
      publicPath: '/bundle/'
    }));
    server.listen(8080, 'localhost');
    return server;
  });

}
