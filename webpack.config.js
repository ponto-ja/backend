/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('node:path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  target: 'node',
  entry: slsw.lib.entries,
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  optimization: {
    minimize: true,
  },
  performance: {
    hints: false,
  },
  devtool: 'nosources-source-map',
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.ts'],
    symlinks: false,
    plugins: [new TsconfigPathsPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'src'),
        options: {
          transpileOnly: true,
          experimentalFileCaching: true,
        },
      },
    ],
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, '.webpack'),
    filename: '[name].js',
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: ['./prisma/schema.prisma'],
    }),
  ],
};
