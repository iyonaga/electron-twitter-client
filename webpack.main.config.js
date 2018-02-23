const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: {
    main: './src/main.js'
  },

  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist')
  },

  node: {
    __dirname: false,
    __filename: false
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx']
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new UglifyJSPlugin({
      // parallel: true,
      uglifyOptions: {
        compress: {
          drop_console: true
        }
      }
    })
  ],

  target: 'electron-main'
};
