#!/usr/bin/env node
const { omitBy, isNull, isUndefined } = require('lodash');
const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const constructConfig = require('./webpack.config');
const { hasAdditionalConfig, getAdditionalConfigPath } = require('./manage');

require('yargs')
  .usage('Usage: $0 <command> [options]')
  .demandCommand(1, 'No command specified')
  .command(
    'serve',
    'Run a live-reloading server with frontend',
    function (yargs) {
      return yargs
        .option('mode', {
          alias: 'mode',
          default: 'development'
        })
        .option('port', {
          default: 9000
        })
        .option('host', {
          default: '127.0.0.1'
        });
    },
    serve)
  .command(
    'build',
    'Build the application',
    build
  )
  .version()
  .alias('v', 'version')
  .strict(true)
  .argv;

function logCompilationNotices () {
  if (hasAdditionalConfig()) {
    console.log(chalk.black.bgYellow(`Using additional config ${getAdditionalConfigPath()}`));
  }  
}

function decorateArgs (args) {
  // omit the empty arguments so they don't override the additionalConfig
  const noEmptyArgs = omitBy(args, (value) => {
    return isNull(value) || isUndefined(value);
  });

  return Object.assign(noEmptyArgs);
}

function serve(args) {
  logCompilationNotices();
  let config = constructConfig(decorateArgs(args));

  const compiler = webpack(config);
  const server = new WebpackDevServer(compiler, config.devServer);

  server.listen(args.port, args.host, () => {
    console.log(`Starting server on ${args.host}:${args.port}`);
  });
}

function build(args) {  
  logCompilationNotices();

  const options = Object.assign({}, decorateArgs(args), { mode: 'production' });
  let config = constructConfig(options);
  const compiler = webpack(config);

  compiler.run((err) => {
    if (err) {
      console.log(chalk.red('Something went wrong, check the error below:'));
      console.log(err);
      return;
    }

    console.log(chalk.white.bgGreen('Built the application!'));
  });
}
