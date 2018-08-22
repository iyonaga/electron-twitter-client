const webpack = require('webpack');
const path = require('path');
const { spawn } = require('child_process');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = (env, argv) => {
  process.env.PORT = process.env.PORT || 8080;
  const port = process.env.PORT;
  const isProduction = argv.mode === 'production';

  return {
    entry: {
      renderer: ['react-hot-loader/patch', './src/renderer.js']
    },

    output: {
      filename: '[name].js',
      path: path.join(__dirname, 'dist'),
      // libraryTarget: 'commonjs2',
      publicPath: isProduction ? './' : `http://localhost:${port}/`
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
          use: [
            'css-hot-loader',
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: false
              }
            },
            'sass-loader'
          ]
        },

        {
          test: /\.module\.s?css$/,
          use: [
            'css-hot-loader',
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[name]--[local]--[hash:base64:5]'
              }
            },
            'sass-loader'
          ]
        },

        {
          test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/font-woff',
              name: '[path][name].[ext]'
            }
          }
        },

        {
          test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/font-woff',
              name: '[path][name].[ext]'
            }
          }
        },

        {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/octet-stream',
              name: '[path][name].[ext]'
            }
          }
        },

        {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]'
            }
          }
        },

        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'image/svg+xml',
              name: '[path][name].[ext]'
            }
          }
        }
      ]
    },

    resolve: {
      extensions: ['.js', '.jsx']
    },

    optimization: {
      namedModules: true,
      minimizer: isProduction
        ? [
            new UglifyJSPlugin({
              uglifyOptions: {
                compress: {
                  drop_console: true
                }
              }
            })
          ]
        : []
    },

    plugins: [
      new MiniCssExtractPlugin({
        filename: 'styles.css'
      }),
      new HtmlWebpackPlugin({
        inject: false,
        template: './src/index.html',
        port
      }),
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
};
