var path = require('path');

module.exports = {
  devtool: 'eval-source-map',
  entry: {
    app: [
      './src/index.js',
    ]
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    publicPath: '/static/',
    filename: 'life.js',
  },
  module: {
    loaders: [
      { test: /\.js/, loader: 'babel' },
      { test: /\.css$/, loader: 'style!css' },
    ]
  },
  devServer: {
    contentBase: './public',
    filename: 'life.js',
    historyApiFallback: true,
  },
  resolve: {
    root: [
      path.resolve('./src'),
    ],
    extensions: [
      '', '.js', '.js',
    ]
  },
};
