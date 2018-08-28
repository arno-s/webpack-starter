'use strict';
const chalk = require('chalk');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackMerge = require('webpack-merge');
const path = require('path');
const {
  DEFAULT_SRC,
  DEFAULT_DIST,
  hasAdditionalConfig
} = require('./config');
const {
  getAdditionalConfiguration,
  getAdditionalWebpackConfiguration
} = require('./additional.config');

const createWebpackConfiguration = (options) => {
  const { config:configPath } = options;
  if (hasAdditionalConfig(configPath)) {
    console.log(
      chalk.black.bgYellow(`Using additional config ${configPath}`)
    );
  }

  const additionalConfig = getAdditionalConfiguration(configPath);
  const defaultConfig = constructDefaultConfiguration(options, additionalConfig);
  const additionalWebpackConfig = getAdditionalWebpackConfiguration(configPath);

  return webpackMerge(defaultConfig, additionalWebpackConfig);
};

const constructDefaultConfiguration = (options, additionalConfig) => {
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

    plugins: constructPlugins(additionalConfig),

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

const constructPlugins = (additionalConfig) => {
  // Don't add the HTML Webpack plugin, SSR usually defines its own HTML
  if (additionalConfig.ssr) return [];

  return [
    new HtmlWebpackPlugin({
      template: path.join(DEFAULT_SRC, 'index.html')
    })
  ];
};

const createDevServerConfiguration = () => {
  const additionalConfig = getAdditionalWebpackConfiguration();
  const defaultConfig = {
    contentBase: path.join(DEFAULT_SRC),
    watchContentBase: true,
    clientLogLevel: 'info'
  };

  if (!additionalConfig.devServer) return;
  return Object.assign({}, defaultConfig, additionalConfig.devServer);
};

module.exports = {
  createDevServerConfiguration,
  createWebpackConfiguration,
  constructDefaultConfiguration
};