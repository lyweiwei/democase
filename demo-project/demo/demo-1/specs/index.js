var assert = require('assert');

/* global browser */

describe('demo-1', function () {
  it('should render the form', function () {
    browser.url('http://localhost:8080/demo-1');
    assert(browser.element('form.form'));
  });
});
