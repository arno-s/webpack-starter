const path = require('path');
const SRC = 'src';

module.exports = {
  webpack: {
    'entry': path.resolve(SRC, 'index.jsx')
  }
};