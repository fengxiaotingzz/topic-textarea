// @noflow
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: 'production',
  context: __dirname,
  entry: './src/index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
    library: {
      type: 'umd',
    },
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin({
        test: /\.css$/,
        minify: CssMinimizerPlugin.cleanCssMinify,
      }),
    ],
  },
  externals: {
    react: {
      root: 'react',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
    'react-dom': {
      root: 'react-dom',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
    },
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          presets: ['@babel/env', '@babel/preset-react', '@babel/preset-flow'],
        },
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new UglifyJsPlugin({ test: /\.js$/g, uglifyOptions: { comment: false } }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new MiniCssExtractPlugin({
      filename: 'bundle.css',
      ignoreOrder: false,
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
