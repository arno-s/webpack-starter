'use strict';
const isFunction = require('lodash/isFunction');
const isObject = require('lodash/isObject');
const isString = require('lodash/isString');

const { 
  getAdditionalConfigPath,
  hasAdditionalConfig
} = require('./config');

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

const cleanWebpack = (webpackConfiguration) => {
  if (!webpackConfiguration) return {};

  if (webpackConfiguration.entry && isString(webpackConfiguration.entry)) {
    webpackConfiguration.entry = [ webpackConfiguration.entry ];
  }

  return webpackConfiguration;
};

module.exports = {
  getAdditionalConfiguration,
  getAdditionalWebpackConfiguration
};