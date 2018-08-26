#!/usr/bin/env node
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const chalk = require('chalk');
const {
  createDevServerConfiguration,
  createWebpackConfiguration
} = require('./webpack.config.js');

require('yargs')
  .usage('Usage: $0 <command> [options]')
  .demandCommand(1, 'No command specified')
  .command(
    'serve',
    'Run a live-reloading server with frontend',
    function (yargs) {
      return yargs
        .option('configPath', {
          alias: 'config'
        })
        .option('mode', {
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
    function (yargs) {
      return yargs
        .option('watch', {
          default: false
        });
    },
    build
  )
  .version()
  .alias('v', 'version')
  .strict(true)
  .argv;

function serve(args) {
  const config = createWebpackConfiguration(args);
  const devServerConfig = createDevServerConfiguration();

  const compiler = webpack(config);
  const server = new WebpackDevServer(compiler, devServerConfig);

  server.listen(args.port, args.host, () => {
    console.log(`Starting server on ${args.host}:${args.port}`);
  });
}

function build(args) {
  const config = createWebpackConfiguration({ mode: 'production' });
  const compiler = webpack(config);

  if (args.watch) {
    return compiler.watch({
      aggregateTimeout: 300,
      poll: undefined
    }, (error) => {
      console.log(chalk.white.bgGreen('Now compiling on changes!'));
      if (error) console.error(chalk.red(error));
    });
  }

  compiler.run((err, stats) => {
    const statsJson = stats.toJson();
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }

      return process.exit(1);
    }

    if (stats.hasErrors()) {
      console.log(statsJson);
      console.error(chalk.white.bgRed('Something went wrong, check the error(s) below:'));
      statsJson.errors.forEach(error => {
        console.error(chalk.red(error));
      });
      return process.exit(1);
    }

    console.log(chalk.white.bgGreen('Built the application!'));
  });
}