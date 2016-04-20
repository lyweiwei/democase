// import assert from 'assert';
var assert = require('assert');

/* global browser */

describe('demo-1', function () {
  it('should render the form', function () {
    assert(browser.element('form.form'));
  });
  describe('demo-1-1', function () {
    it('should render the form', function () {
      assert(browser.element('form.form'));
    });
  });
});
