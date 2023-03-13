const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');

const environment = process.env.NODE_ENV;
const isDevelopment = environment === 'development';
const isProduction = environment === 'production';

const buildConfig = {
  mode: environment,
  entry: './src/app.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: isDevelopment ? false : 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/, 
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new CopyWebpackPlugin(
      {
        'patterns': [
          { from: "source" }
        ]
      })
  ]
};

if (isProduction) {
  buildConfig.plugins.push(
    new CleanPlugin.CleanWebpackPlugin()
  );
} else {
  buildConfig.output['publicPath'] = '/';
}

module.exports = buildConfig;
