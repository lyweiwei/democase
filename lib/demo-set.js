import fs from 'fs';
import path from 'path';
import Promise from 'bluebird';
import _ from 'lodash';

import { Demo } from './demo';

const readFileAsync = Promise.promisify(fs.readFile);
const readdirAsync = Promise.promisify(fs.readdir);
const statAsync = Promise.promisify(fs.stat);

export class DemoSet {
  constructor(options) {
    this.demos = {};
    _.forEach(options.demos || [], demo => this.demos[demo.path] = demo);
  }
}

function loadDemos(rootPath, options) {
  return statAsync(rootPath).then(stats => {
    if (stats.isDirectory()) {
      return readFileAsync(path.join(rootPath, 'demo.config')).then(
        JSON.parse.bind(JSON)
      ).catch(
        () => null
      ).then(config => {
        if (config) {
          return [new Demo(_.assignIn({ path: rootPath }, config))];
        } else {
          return readdirAsync(rootPath)
            .map(name => loadDemos(path.join(rootPath, name), options))
            .then(_.flatten)
            .then(_.compact);
        }
      });
    } else {
      return null;
    }
  }, () => null);
}

export function load(rootPath, options) {
  return loadDemos(rootPath, options).then(demos => new DemoSet({ demos }));
}
