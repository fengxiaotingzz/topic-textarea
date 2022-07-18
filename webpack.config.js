const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    // library: {
    //   type: 'commonjs',
    // },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            include: [path.resolve('./src/')],
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
    new MiniCssExtractPlugin({
      filename: 'bundle.css',
      ignoreOrder: false,
    }),
  ],
  stats: 'errors-only',
};
