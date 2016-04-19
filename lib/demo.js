export class Demo {
  constructor(options) {
    this.options = options || {};
  }

  get path() {
    return this.options.path;
  }
}
