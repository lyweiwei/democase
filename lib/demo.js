import path from 'path';
import _ from 'lodash';

export class Demo {
  constructor(pathDemo, options) {
    this.path = path.resolve(pathDemo);
    this.options = _.defaults({}, options, {
      name: path.basename(this.path),
      entry: `./${this.relativePath}/index`
    });
  }

  get name() {
    return this.options.name;
  }

  get entry() {
    return this.options.entry;
  }

  get relativePath() {
    return path.relative('.', this.path);
  }

}
