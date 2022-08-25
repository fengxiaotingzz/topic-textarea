const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './example/test.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]_[chunkhash:8].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            include: [path.resolve('./src/'), path.resolve('./example/')],
            presets: ['@babel/env', '@babel/preset-react'],
          },
        },
      },
      { test: /\.css$/i, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
      },
    ],
  },
  performance: {
    hints: false,
    maxEntrypointSize: 50000000000,
    maxAssetSize: 4000000000000,
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({ extractComments: false }),
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './example/index.html',
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css',
      ignoreOrder: false,
    }),
  ],
  stats: 'errors-only',
};
