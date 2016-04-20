import _ from 'lodash';
import path from 'path';
import Promise from 'bluebird';
import webpack from 'webpack';
import express from 'express';
import webpackDevMiddleware from 'webpack-dev-middleware';
import jade from 'jade';
import chalk from 'chalk';

const renderFileAsync = Promise.promisify(jade.renderFile);

function webpackConfig(demoSet) {
  const config = demoSet.webpackConfig;
  const entryLib = path.resolve(demoSet.packagePath, config.entry);

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
}

export function serve(demoSet, {
  port = 8080,
  hostname = 'localhost'
} = {}) {
  const config = webpackConfig(demoSet);
  const server = express();

  server.use(webpackDevMiddleware(webpack(config), {
    publicPath: '/bundle/'
  }));

  _.forEach(demoSet.demos, demo => {
    server.get(`/${demo.relativePath}`, (req, res) => {
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

  const httpServer = server.listen(port, hostname);
  const urlBase = `http://${hostname}:${port}`;
  const lines = [
    chalk.bold(`${chalk.green('The server is running at')} ${chalk.cyan.underline(urlBase)}`),
    `The following example pages are available:`
  ].concat(_.map(demoSet.demos, demo => {
    const urlDemo = `http://${hostname}:${port}/${demo.relativePath}`;
    return `  ${chalk.magenta(demo.name)}: ${chalk.cyan.underline(urlDemo)}`;
  })).concat(['']);

  global.console.log(lines.join('\n'));

  return httpServer;
}
