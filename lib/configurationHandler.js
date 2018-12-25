'use strict';
const path = require('path');
const fs = require('fs');
const isFunction = require('lodash/isFunction');
const isObject = require('lodash/isObject');
const isString = require('lodash/isString');

const CURRENT_PATH = process.cwd();
const DEFAULT_DIST = path.resolve(CURRENT_PATH, './dist');
const DEFAULT_SRC = path.resolve(CURRENT_PATH, './src');
const DEFAULT_ADDITIONAL_CONFIG_FILE = './starter.config.js';
const DEFAULT_ADDITIONAL_CONFIG_PATH = path.resolve(CURRENT_PATH, DEFAULT_ADDITIONAL_CONFIG_FILE);

const getAdditionalConfigPath = (configPath = DEFAULT_ADDITIONAL_CONFIG_PATH) => {
  if (!hasAdditionalConfig(configPath)) return;
  return path.resolve(CURRENT_PATH, configPath);
};

const hasAdditionalConfig = (configPath = DEFAULT_ADDITIONAL_CONFIG_PATH) => {
  return fs.existsSync(configPath);
};

const getAdditionalConfiguration = (configPath) => {
  if (!hasAdditionalConfig(configPath)) return {};
  const resolvedConfigPath = getAdditionalConfigPath(configPath);

  const additionalConfig = require(resolvedConfigPath);

  if (isFunction(additionalConfig)) {
    return additionalConfig();
  } else if (isObject(additionalConfig)) {
    return additionalConfig;
  }

  throw new Error(`error@${resolvedConfigPath}: export is not a function or object`);
};

const getAdditionalWebpackConfiguration = (configPath) => {
  const { webpack } = getAdditionalConfiguration(configPath);
  return cleanWebpack(webpack);
};

const cleanWebpack = (webpackConfiguration = {}) => {

  if (!webpackConfiguration.entry) {
    webpackConfiguration.entry = path.resolve(DEFAULT_SRC, 'index.js');
  }

  if (webpackConfiguration.entry && isString(webpackConfiguration.entry)) {
    webpackConfiguration.entry = [ webpackConfiguration.entry ];
  }

  return webpackConfiguration;
};

module.exports = {
  CURRENT_PATH,
  DEFAULT_DIST,
  DEFAULT_SRC,
  DEFAULT_ADDITIONAL_CONFIG_FILE,
  hasAdditionalConfig,
  getAdditionalConfigPath,
  getAdditionalConfiguration,
  getAdditionalWebpackConfiguration
};