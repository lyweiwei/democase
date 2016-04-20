import _ from 'lodash';
import minimatch from 'minimatch';
import url from 'url';

export function getWdioConfig(demoSet, options) {
  var server = null;
  var demoCur = null;
  var port = process.env.DEMOCASE_HTTP_PORT || 8001;
  var hostname = `localhost`;
  var baseUrl = url.format({
    protocol: 'http',
    hostname,
    port
  });

  return _.defaults({
    specs: _.map(demoSet.demos, demo => demo.specs),
    baseUrl,

    onPrepare: function (/* config, capabilities */) {
      if (!server) {
        server = demoSet.serve({ hostname, port });
      }
    },
    //
    // Gets executed before test execution begins. At this point you can access all global
    // variables, such as `browser`. It is the perfect place to define custom commands.
    // before: function (capabilities, specs) {
    // },
    //
    // Hook that gets executed before the suite starts
    beforeSuite: function (suite) {
      demoCur = _.find(demoSet.demos, demo => minimatch(suite.file, demo.specs));
    },
    //
    // Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
    // beforeEach in Mocha)
    // beforeHook: function () {
    // },
    //
    // Hook that gets executed _after_ a hook within the suite starts (e.g. runs after calling
    // afterEach in Mocha)
    // afterHook: function () {
    // },
    //
    // Function to be executed before a test (in Mocha/Jasmine) or a step (in Cucumber) starts.
    beforeTest: function (/* test */) {
      global.browser.url(`${baseUrl}/${demoCur.relativePath}`);
    },
    //
    // Runs before a WebdriverIO command gets executed.
    // beforeCommand: function (commandName, args) {
    // },
    //
    // Runs after a WebdriverIO command gets executed
    // afterCommand: function (commandName, args, result, error) {
    // },
    //
    // Function to be executed after a test (in Mocha/Jasmine) or a step (in Cucumber) starts.
    // afterTest: function (test) {
    // },
    //
    // Hook that gets executed after the suite has ended
    // afterSuite: function (suite) {
    // },
    //
    // Gets executed after all tests are done. You still have access to all global variables from
    // the test.
    // after: function (capabilities, specs) {
    // },
    //
    // Gets executed after all workers got shut down and the process is about to exit. It is not
    // possible to defer the end of the process using a promise.
    onComplete: function (/* exitCode */) {
      if (server) {
        server.close();
        server = null;
      }
    }
  }, options, {
    capabilities: [{
      browserName: 'phantomjs'
    }],
    sync: true,
    logLevel: 'silent',
    coloredLogs: true,
    screenshotPath: './errorShots/',
    waitforTimeout: 10000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    framework: 'mocha',
    mochaOpts: {
      ui: 'bdd'
    }
  });
}
