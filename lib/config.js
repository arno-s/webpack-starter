'use strict';
const path = require('path');
const fs = require('fs');
const CURRENT_PATH = process.cwd();
const DEFAULT_DIST = path.resolve(CURRENT_PATH, './dist');
const DEFAULT_SRC = path.resolve(CURRENT_PATH, './src');
const ADDITIONAL_CONFIG_PATH = path.resolve(CURRENT_PATH, './starter.config.js');
const HAS_ADDITIONAL_CONFIG = fs.existsSync(ADDITIONAL_CONFIG_PATH);

module.exports = {
  CURRENT_PATH, DEFAULT_DIST, DEFAULT_SRC,
  ADDITIONAL_CONFIG_PATH, HAS_ADDITIONAL_CONFIG
};