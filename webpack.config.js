const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const PATHS = {
  entryPoint: path.resolve(__dirname, 'src/index.ts'),
  bundles: path.resolve(__dirname, 'lib-umd'),
};

const config = {
  entry: {
    jwebt: [PATHS.entryPoint],
    'jwebt.min': [PATHS.entryPoint],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.min\.js$/i,
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    path: PATHS.bundles,
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'jwebt',
    umdNamedDefine: true,
  },
};

module.exports = config;
