# webpack-starter-cli [![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Farnoschutijzer%2Fwebpack-starter-cli.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Farnoschutijzer%2Fwebpack-starter-cli?ref=badge_shield) [![Build Status](https://travis-ci.org/arnoschutijzer/webpack-starter-cli.svg?branch=master)](https://travis-ci.org/arnoschutijzer/webpack-starter-cli)

```bash
npm install -g @vleesbrood/webpack-starter-cli
```

> a webpack config in a cli

## pre-requisites

- Node & NPM

## commands

```bash
# start a hot-reloading server
$ starter serve

# build the project
$ starter build
```

## features

### extend the configuration

Use .babelrc to add babel presets!

```json
{
  "presets": [
    "@babel/preset-react"
  ]
}
```

Add in custom webpack configuration using `starter.config.js`:

```javascript
const path = require('path');
const SRC = './src';

const webpack = {
  // IMPORTANT: this must be an array!
  entry: [
    'index.jsx'
  ],

  resolve: {
      assets: path.join(__dirname, SRC, 'assets'),
      components: path.join(__dirname, SRC, 'components'),
      src: path.join(__dirname, SRC),
      state: path.join(__dirname, SRC, 'state'),
      views: path.join(__dirname, SRC, 'views')
  }
};

module.exports = () => {
  return {
    webpack
  };
}
```

The custom configuration will be merged together with the default configuration.

## gotcha's

The cli assumes a folder layout like this:

```dir
 |- src/
 |- package.json
 |- .babelrc
 |- starter.config.json
```

If you installed the cli globally, you have to add `@babel/core` to your `package.json` if you want to customize the `babel-loader`.

```bash
# installing @babel/core is required if you need a custom preset
$ npm install --save @babel/core @babel/preset-react
```

```json
{
  "presets": [ "@babel/preset-react" ]
}
```

The `entry` property MUST be an array!