import _ from 'lodash';
import path from 'path';
import Promise from 'bluebird';
import webpack from 'webpack';
import express from 'express';
import webpackDevMiddleware from 'webpack-dev-middleware';
import jade from 'jade';
import { lookUp } from './util';

const renderFileAsync = Promise.promisify(jade.renderFile);

function webpackConfig(demoSet) {
  return lookUp('webpack.config.js').then(require).then(config => {
    const entryLib = path.join(demoSet.packagePath, config.entry);

    config.output = {
      filename: '[name].bundle.js',
      path: '/'
    };

    config.entry = _.chain(demoSet.demos)
      .mapValues(demo => demo.entry)
      .value();

    delete config.externals;

    return _.merge(config, {
      resolve: {
        alias: {
          [demoSet.packageName]: path.resolve(entryLib)
        }
      }
    });
  });
}

export function serve(demoSet, {
  port = 8080,
  hostname = 'localhost'
} = {}) {
  return webpackConfig(demoSet).then(config => {
    var server = express();

    server.use(webpackDevMiddleware(webpack(config), {
      publicPath: '/bundle/'
    }));

    _.forEach(demoSet.demos, demo => {
      server.get(`/${demo.relativePath}`, (req, res) => {
        // console.log(demo.template);
        renderFileAsync(demo.template, {
          title: demo.name,
          bundle: `/bundle/${demo.name}.bundle.js`
        }).then(html => {
          res.send(html);
        }).catch(() => {
          res.status(404).send(`template ${demo.template} not found`);
        });
      });
    });

    return server.listen(port, hostname);
  });
}
