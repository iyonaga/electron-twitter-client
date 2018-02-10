// const webpack = require('webpack');
const path = require('path');

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
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },

  target: 'electron-main'
};
