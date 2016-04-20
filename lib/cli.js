#!/usr/bin/env node
import { load } from '..';

load('.').then(demoSet => demoSet.serve());
