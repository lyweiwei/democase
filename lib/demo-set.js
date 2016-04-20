import fs from 'fs';
import path from 'path';
import Promise from 'bluebird';
import _ from 'lodash';

import { serve } from './server';
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
  }

  serve(options) {
    serve(this, options);
  }
}

function loadDemos(pathDemo, options) {
  return statAsync(pathDemo).then(stats => {
    if (stats.isDirectory()) {
      return readFileAsync(path.join(pathDemo, 'demo.config')).then(
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
  return lookUp('package.json', pathRoot).then(pathPkg => {
    const pathPkgRoot = path.dirname(pathPkg);
    const packageConfig = require(pathPkg);

    return loadDemos(pathRoot, options).then(demos => new DemoSet({
      demos,
      packageName: packageConfig.name,
      packagePath: pathPkgRoot
    }));
  });
}
