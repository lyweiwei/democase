#!/usr/bin/env node
import path from 'path';
import _ from 'lodash';
import yargs from 'yargs';
import resolve from 'resolve';
import childProcess from 'child_process';
import { load } from '..';

const argv = yargs.usage('Usage: $0 <command>')

  // The Serve Command
  .command('serve', 'serve the demo pages via a local http server', yargsCmd => {
    return yargsCmd.option('p', {
      alias: 'port',
      describe: 'the port of the http server',
      default: 8080
    });
  }, argvCmd => {
    load('.').then(demoSet => demoSet.serve({ port: argvCmd.port }));
  })

  // The Test Command
  .command('test', 'run selenium test against the demo pages', yargsCmd => {
    return yargsCmd.option('p', {
      alias: 'port',
      describe: 'the port of the http server for testing',
      default: 8081
    });
  }, argvCmd => {
    const pathCli = path.resolve(path.dirname(resolve.sync('webdriverio', {
      basedir: '.'
    })), 'lib/cli');

    childProcess.fork(pathCli, argvCmd._.slice(1), {
      env: { DEMOCASE_HTTP_PORT: argvCmd.port }
    }).on('close', code => process.exit(code));
  })

  // Other Configurations
  .help('h')
  .alias('h', 'help')
  .argv;

if (!_.includes(['serve', 'test'], argv._[0])) {
  yargs.showHelp();
}
