const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const CURRENT_PATH = process.cwd();
const ADDITIONAL_CONFIG_PATH = path.resolve(CURRENT_PATH, './starter.config.js');

function hasAdditionalConfig() {
  return fs.existsSync(ADDITIONAL_CONFIG_PATH);
}

function remapAdditionalConfig(config) {
  const copy = Object.assign({}, config);
  if (copy.webpack) {
    copy.webpack = remapWebpack(copy.webpack);
  }

  return copy;
}

function remapWebpack(webpackConfig) {
  if (_.isString(webpackConfig.entry)) {
    webpackConfig.entry = [ webpackConfig.entry ];
  }

  return webpackConfig;
}

function getAdditionalConfig() {
  if (!hasAdditionalConfig()) {
    return {};
  }

  const additionalConfig = require(ADDITIONAL_CONFIG_PATH);

  if (_.isFunction(additionalConfig)) {
    return additionalConfig();
  }

  return remapAdditionalConfig(additionalConfig);
}

function getAdditionalConfigPath() {
  return ADDITIONAL_CONFIG_PATH;
}

module.exports = {
  getAdditionalConfig: getAdditionalConfig,
  getAdditionalConfigPath: getAdditionalConfigPath,
  hasAdditionalConfig: hasAdditionalConfig
};