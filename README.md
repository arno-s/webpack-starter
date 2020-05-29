# webpack-starter-cli [![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Farnoschutijzer%2Fwebpack-starter-cli.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Farnoschutijzer%2Fwebpack-starter-cli?ref=badge_shield) ![CI](https://github.com/arnoschutijzer/webpack-starter-cli/workflows/CI/badge.svg)

```bash
npm install -g @vleesbrood/webpack-starter-cli
```

> extensible webpack starter kit cli tool

## pre-requisites

- Node & NPM

## usage

```bash
# start a hot-reloading server
$ starter serve

Run a live-reloading server with frontend

Options:
  --help         Show help                                             [boolean]
  -c, --config   pass the configuration path    [default: "./starter.config.js"]
  -m, --mode     specify the compilation mode           [default: "development"]
  -p, --port     specify the port                                [default: 9000]
  -h, --host     specify the host                         [default: "127.0.0.1"]
  -v, --version  Show version number                                   [boolean]

# build the project
$ starter build

Build the application

Options:
  --help         Show help                                             [boolean]
  -c, --config   pass the configuration path    [default: "./starter.config.js"]
  -w, --watch    watch source and compile on changes            [default: false]
  -v, --version  Show version number                                   [boolean]
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
  entry: 'index.jsx',

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