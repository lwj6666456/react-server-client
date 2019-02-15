const webpackMerge = require('webpack-merge')
const path = require('path')
const baseConfig = require('./webpack.base')
const config = webpackMerge(baseConfig, {
  target: 'node',
  entry: {
    app: path.join(__dirname, '../client/server-entry.js')
  },
  externals: Object.keys(require('../package.json').dependencies), // 不包含外部类库代码
  output: {
    filename: 'server-entry.js',
    libraryTarget: 'commonjs2'
  }
})

module.exports = config
