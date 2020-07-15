const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: {
    main: './lib/client/index.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './lib/client/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[contenthash].[name].css',
      chunkFilename: '[contenthash].[id].css',
    }),
  ],
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['cache-loader', 'babel-loader'],
      },
      {
        test: /.scss$/,
        use: [
          //'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
}
