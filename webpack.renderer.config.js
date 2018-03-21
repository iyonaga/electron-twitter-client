const webpack = require('webpack');
const path = require('path');
const { spawn } = require('child_process');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

process.env.PORT = process.env.PORT || 8080;
const port = process.env.PORT;

const config = {
  entry: {
    renderer: ['react-hot-loader/patch', './src/renderer.js']
  },

  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist'),
    // libraryTarget: 'commonjs2',
    publicPath: `http://localhost:${port}/`
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
      },

      {
        test: /\.s?css$/,
        exclude: /\.module\.s?css$/,
        use: ['css-hot-loader'].concat(
          ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  minimize: true,
                  modules: false
                }
              },
              'sass-loader'
            ]
          })
        )
      },

      {
        test: /\.module\.s?css$/,
        use: ['css-hot-loader'].concat(
          ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  minimize: true,
                  modules: true,
                  localIdentName: '[name]--[local]--[hash:base64:5]'
                }
              },
              'sass-loader'
            ]
          })
        )
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx']
  },

  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new ExtractTextPlugin('styles.css'),
    new HtmlWebpackPlugin({
      inject: false,
      template: './src/index.html',
      port
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],

  target: 'electron-renderer',

  devServer: {
    port,
    compress: true,
    hot: true,
    contentBase: path.join(__dirname, 'dist'),
    watchContentBase: true,
    before() {
      spawn('yarn', ['run', 'dev:main'], {
        shell: true,
        env: process.env,
        stdio: 'inherit'
      })
        .on('close', code => {
          process.exit(code);
        })
        .on('error', spawnError => {
          console.log(spawnError);
        });
    }
  }
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new UglifyJSPlugin({
      // parallel: true,
      uglifyOptions: {
        compress: {
          drop_console: true
        }
      }
    })
  );
}

module.exports = config;
