import path from 'path';

export class Demo {
  constructor(pathDemo, options) {
    const opt = options || {};
    this.path = path.resolve(pathDemo);
    this.name = opt.name || path.basename(this.path);
    const entry = opt.entry && path.resolve(pathDemo, opt.entry) || path.join(this.path, 'index');
    this.entry = `./${path.relative('.', entry)}`;
    const template = opt.template && path.resolve(this.path, opt.template);
    this.template = template || path.resolve(__dirname, '../template/default-template.jade');
    this.relativePath = path.relative('.', this.path);
  }
}
