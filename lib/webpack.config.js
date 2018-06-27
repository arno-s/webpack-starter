'use strict';
const chalk = require('chalk');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackMerge = require('webpack-merge');
const path = require('path');
const {
  DEFAULT_SRC,
  DEFAULT_DIST,
  HAS_ADDITIONAL_CONFIG,
  ADDITIONAL_CONFIG_PATH
} = require('./config');
const {
  getAdditionalWebpackConfiguration
} = require('./starter.config');

const createWebpackConfiguration = (options) => {
  if (HAS_ADDITIONAL_CONFIG) {
    console.log(
      chalk.black.bgYellow(`Using additional config ${ADDITIONAL_CONFIG_PATH}`)
    );
  }

  const defaultConfig = constructDefaultConfiguration(options);
  const additionalConfig = getAdditionalWebpackConfiguration();

  if (!additionalConfig.entry) {
    additionalConfig.entry = path.resolve(DEFAULT_SRC, 'index.js');
  }

  return webpackMerge(defaultConfig, additionalConfig);
};

const constructDefaultConfiguration = (options) => {
  const { mode } = options;

  let config = {
    entry: [],

    output: {
      filename: '[name].[hash].js',
      path: path.resolve(DEFAULT_DIST)
    },

    mode,

    module: {
      rules: constructDefaultLoaders()
    },

    plugins: constructPlugins(),

    resolve: {
      modules: [
        'node_modules',
        path.resolve(__dirname, 'node_modules')
      ],
      extensions: [ '.js', '.jsx' ],
    },

    resolveLoader: {
      modules: [
        'node_modules',
        path.resolve(__dirname, 'node_modules')
      ]
    }
  };

  if (mode === 'development') {
    config.entry.unshift('webpack-dev-server/client?/');
  }

  return config;
};

const constructDefaultLoaders = () => {
  const rules = [ {
    test: /\.html$/,
    loader: require.resolve('html-loader')
  }, {
    test: /\.scss$/,
    exclude: /node_modules/,
    use: [ {
      loader: require.resolve('style-loader')
    }, {
      loader: require.resolve('css-loader')
    }, {
      loader: require.resolve('sass-loader'),
      options: {
        outputStyle: 'compressed',
        sourceMap: true,
        sourceMapContents: true
      }
    }
    ]
  }, {
    test: /\.(jpe?g|png|gif|svg|mp3)$/i,
    loaders: [
      'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
      {
        loader: 'image-webpack-loader',
        query: {
          imagemin: {
            bypassOnDebug: true,
            optimizationLevel: 1,
            interlaced: false
          }
        }
      }
    ]
  }, {
    test: /\.(eot|woff|woff2|ttf|otf|svg)$/,
    loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]',
  } ];
  
  const jsLoader = {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    use: [ {
      loader: require.resolve('babel-loader'),
      options: {
        presets: [
          require.resolve('@babel/preset-env')
        ]
      }
    } ]
  };
  
  rules.push(jsLoader);
  
  return rules;
};

const constructPlugins = () => {
  return [
    new HtmlWebpackPlugin({
      template: path.join(DEFAULT_SRC, 'index.html')
    })
  ];
};

const createDevServerConfiguration = () => {
  return {
    contentBase: path.join(DEFAULT_SRC),
    watchContentBase: true,
    clientLogLevel: 'info'
  };
};

module.exports = {
  createDevServerConfiguration,
  createWebpackConfiguration,
  constructDefaultConfiguration
};