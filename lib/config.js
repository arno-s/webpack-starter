'use strict';
const path = require('path');
const fs = require('fs');
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

module.exports = {
  CURRENT_PATH,
  DEFAULT_DIST,
  DEFAULT_SRC,
  DEFAULT_ADDITIONAL_CONFIG_FILE,
  hasAdditionalConfig,
  getAdditionalConfigPath
};