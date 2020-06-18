'use strict';
const chalk = require('chalk');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpackMerge = require('webpack-merge');
const path = require('path');
const {
  DEFAULT_SRC,
  DEFAULT_DIST,
  hasAdditionalConfig,
  getAdditionalConfigPath,
  getAdditionalConfiguration,
  getAdditionalWebpackConfiguration
} = require('./configurationHandler');

const createWebpackConfiguration = (options) => {
  const { config:configPath } = options;
  if (hasAdditionalConfig(configPath)) {
    const path = getAdditionalConfigPath(configPath);
    console.log(
      chalk.black.bgYellow(`Using additional config ${path}`)
    );
  }

  const additionalConfig = getAdditionalConfiguration(configPath);
  const defaultConfig = constructDefaultConfiguration(options, additionalConfig);
  const additionalWebpackConfig = getAdditionalWebpackConfiguration(configPath);

  return webpackMerge(defaultConfig, additionalWebpackConfig);
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
    test: /\.s?css$/,
    exclude: /node_modules/,
    use: [ {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: process.env.NODE_ENV === 'development'
      }
    }, {
      loader: require.resolve('css-loader')
    },{
      loader: require.resolve('sass-loader'),
      options: {
        sourceMap: true
      }
    } ]
  }, {
    test: /\.(jpe?g|png|gif|svg|mp3)$/i,
    use: [
      require.resolve('file-loader'),
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
    use: [ {
      loader: require.resolve('url-loader'),
      options: {
        limit: 30000
      }
    } ]
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
  let plugins = [
    new HtmlWebpackPlugin({
      template: path.join(DEFAULT_SRC, 'index.html')
    }),
    new MiniCssExtractPlugin({
      fileName: '[name].css',
      chunkFilename: '[id].css'
    })
  ];

  return plugins;
};

const createDevServerConfiguration = () => {
  const additionalConfig = getAdditionalWebpackConfiguration();
  const defaultConfig = {
    disableHostCheck: true,
    contentBase: path.join(DEFAULT_SRC),
    watchContentBase: true,
    clientLogLevel: 'info'
  };

  if (!additionalConfig.devServer) return defaultConfig;
  return Object.assign({}, defaultConfig, additionalConfig.devServer);
};

module.exports = {
  createDevServerConfiguration,
  createWebpackConfiguration,
  constructDefaultConfiguration
};