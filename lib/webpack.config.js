const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const mergeWebpack = require('webpack-merge');
const SRC = './src';
const DIST = './dist';
const PATH = process.cwd();
const { getAdditionalConfig } = require('./manage');
const additionalConfig = getAdditionalConfig();

module.exports = (options) => {
  options = decorateOptions(options);

  let config = {
    entry: [],

    output: {
      filename: '[name].[hash].js',
      path: path.join(PATH, DIST)
    },

    mode: options.mode,

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

  config = Object.assign({}, config, constructLoaders());
  config = Object.assign({}, config, constructPlugins(options));

  if (options.mode === 'development') {
    config.entry.unshift('webpack-dev-server/client?/');
    config = Object.assign({}, config, constructDevServerConfig());
  }

  const merged = mergeWebpack(config, additionalConfig.webpack);

  return setDefaultEntryFile(merged, additionalConfig);
};

function decorateOptions (options = {}) {
  options.mode = options.mode || 'development';
  return options;
}

function setDefaultEntryFile(configuration, additionalConfig) {
  const configurationCopy = Object.assign({}, configuration);
  const additionalWebpackConfig = additionalConfig.webpack;

  if (!additionalWebpackConfig || !additionalWebpackConfig.entry) {
    console.log('No entry file(s) defined, falling back to index.js');
    const sourcePath = path.resolve(SRC, 'index.js');

    configurationCopy.entry.push(sourcePath);
  }

  return configurationCopy;
}

function constructLoaders() {
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

  return {
    module: {
      rules
    }
  };
}

function constructPlugins() {
  const plugins = [
    new HtmlWebpackPlugin({
      template: path.join(PATH, SRC, 'index.html')
    })
  ];

  return { plugins };
}

function constructDevServerConfig() {
  const devServerConfig = {
    contentBase: path.join(PATH, SRC),
    watchContentBase: true,
    clientLogLevel: 'info'
  };

  return {
    devServer: devServerConfig
  };
}
