const webpack = require('webpack')
const { version } = require('./package.json')

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          VERSION: JSON.stringify(version)
        }
      })
    ]
  }
}
