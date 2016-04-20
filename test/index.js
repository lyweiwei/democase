import assert from 'assert';
import { load } from '../lib';

describe('load', function () {
  it('should be a function', function () {
    assert(load instanceof Function);
  });
});
