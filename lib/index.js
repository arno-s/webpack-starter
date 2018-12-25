#!/usr/bin/env node
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const chalk = require('chalk');
const {
  DEFAULT_ADDITIONAL_CONFIG_FILE
} = require('./configurationHandler');
const {
  createDevServerConfiguration,
  createWebpackConfiguration
} = require('./webpack.config');

const options = {
  config: {
    key: 'c',
    alias: 'config',
    describe: 'pass the configuration path',
    default: DEFAULT_ADDITIONAL_CONFIG_FILE
  },
  host: {
    key: 'h',
    alias: 'host',
    default: '127.0.0.1',
    describe: 'specify the host'
  },
  mode: {
    key: 'm',
    alias: 'mode',
    default: 'development',
    describe: 'specify the compilation mode'
  },
  port: {
    key: 'p',
    alias: 'port',
    default: 9000,
    describe: 'specify the port'
  },
  watch: {
    key: 'w',
    alias: 'watch',
    default: false,
    describe: 'watch source and compile on changes'
  }
};

require('yargs')
  .usage('Usage: $0 <command> [options]')
  .demandCommand(1, 'No command specified')
  .command(
    'serve',
    'Run a live-reloading server with frontend',
    function (yargs) {
      return yargs
        .option(options.config.key, options.config)
        .option(options.mode.key, options.mode)
        .option(options.port.key, options.port)
        .option(options.host.key, options.host);
    },
    serve)
  .command(
    'build',
    'Build the application',
    function (yargs) {
      return yargs
        .option(options.config.key, options.config)
        .option(options.watch.key, options.watch);
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