import fs from 'fs';
import path from 'path';
import Promise from 'bluebird';
import _ from 'lodash';
var deasync = require('deasync');

import { serve } from './server';
import { getWdioConfig } from './wdio-config';
import { Demo } from './demo';
import { lookUp } from './util';

const readFileAsync = Promise.promisify(fs.readFile);
const readdirAsync = Promise.promisify(fs.readdir);
const statAsync = Promise.promisify(fs.stat);

export class DemoSet {
  constructor(options) {
    this.demos = {};
    _.forEach(options.demos || [], demo => this.demos[demo.name] = demo);
    this.packagePath = options.packagePath;
    this.packageName = options.packageName;
    this.webpackConfig = options.webpackConfig;
  }

  serve(options) {
    return serve(this, options);
  }

  wdioConfig(options) {
    return getWdioConfig(this, options);
  }
}

function loadDemos(pathDemo, options) {
  return statAsync(pathDemo).then(stats => {
    if (stats.isDirectory()) {
      return readFileAsync(path.join(pathDemo, 'demo.config.json')).then(
        JSON.parse.bind(JSON)
      ).catch(
        () => null
      ).then(config => {
        if (config) {
          return [new Demo(pathDemo, config)];
        } else {
          return readdirAsync(pathDemo)
            .map(name => loadDemos(path.join(pathDemo, name), options))
            .then(_.flatten)
            .then(_.compact);
        }
      });
    } else {
      return null;
    }
  }, () => null);
}

export function load(pathRoot, options) {
  return Promise.map([
    'package.json',
    'webpack.config.js'
  ], name => lookUp(name, pathRoot)).spread((pathPkg, pathWebpack) => {
    const pathPkgRoot = path.dirname(pathPkg);
    const packageConfig = require(pathPkg);
    const webpackConfig = require(pathWebpack);

    return loadDemos(pathRoot, options).then(demos => new DemoSet({
      demos,
      webpackConfig,
      packageName: packageConfig.name,
      packagePath: pathPkgRoot
    }));
  });
}

const loadSyncInternal = deasync(function (pathRoot, options, cb) {
  load(pathRoot, options).asCallback(cb);
});

export function loadSync(pathRoot, options = {}) {
  return loadSyncInternal(pathRoot, options);
}
