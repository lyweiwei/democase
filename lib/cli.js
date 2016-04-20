#!/usr/bin/env node
import democase from '..';

democase.load('.').then(function (demoSet) {
  demoSet.serve();
});
