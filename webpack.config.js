const path = require('path')
const dotenv = require('dotenv')
const { DefinePlugin } = require('webpack')

module.exports = {
  mode: 'development',
  entry: {
    bundle: path.resolve(__dirname, 'src/app.js'),
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
  },
  plugins: [
    new DefinePlugin({
      'process.env': JSON.stringify(dotenv.config().parsed)
    })
]
}