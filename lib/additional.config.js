'use strict';
const isFunction = require('lodash/isFunction');
const isObject = require('lodash/isObject');
const isString = require('lodash/isString');

const { 
  ADDITIONAL_CONFIG_PATH,
  HAS_ADDITIONAL_CONFIG
} = require('./config');

const getAdditionalConfiguration = () => {
  if (!HAS_ADDITIONAL_CONFIG) return {};

  const additionalConfig = require(ADDITIONAL_CONFIG_PATH);

  if (isFunction(additionalConfig)) {
    return additionalConfig();
  } else if (isObject(additionalConfig)) {
    return additionalConfig;
  }

  throw new Error(`error@${ADDITIONAL_CONFIG_PATH}: export is not a function or object`);
};

const getAdditionalWebpackConfiguration = () => {
  const { webpack } = getAdditionalConfiguration();
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