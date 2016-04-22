import path from 'path';

export class Demo {
  constructor(pathDemo, options) {
    const opt = options || {};

    this.path = path.resolve(pathDemo);
    this.relativePath = path.relative('.', this.path);
    this.name = opt.name || this.relativePath.split(path.sep).join('_');

    const entry = opt.entry && path.resolve(pathDemo, opt.entry) || path.join(this.path, 'index');
    this.entry = `./${path.relative('.', entry)}`;

    const template = opt.template && path.resolve(this.path, opt.template);
    this.template = template || path.resolve(__dirname, 'default-template.jade');

    const specs = opt.specs && path.resolve(this.path, opt.specs);
    this.specs = specs || path.resolve(this.path, 'specs/**/*.js');
  }
}
