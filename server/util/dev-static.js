const axios = require('axios')
const path = require('path')
const webpack = require('webpack')
const proxy = require('http-proxy-middleware')
const ReactDomServer = require('react-dom/server')
const asyncBootstrap = require('react-async-bootstrapper').default
const fs = require('fs')

const serverConfig = require('../../build/webpack.config.server')

const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/index.html')
      .then(res => {
        resolve(res.data)
      })
      .catch(reject)
  })
}

const Module = module.constructor

const serverCompiler = webpack(serverConfig)
serverCompiler.optputFileSystem = fs
let serverBundle,
  createStoreMap
serverCompiler.watch({}, (err, stats) => {
  if (err) throw error
  stats = stats.toJson()
  stats.errors.forEach(err => console.log(err))
  stats.warnings.forEach(err => console.log(err))
  const bundlePath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename
  )
  const bundle = fs.readFileSync(bundlePath, 'utf-8')
  const m = new Module()
  m._compile(bundle, 'server-entry.js')
  serverBundle = m.exports.default
  createStoreMap = m.exports.createStoreMap
})

module.exports = function (app) {
  app.use('/public', proxy({
    target: 'http://localhost:8888'
  }))
  app.get('*', function (req, res) {
    getTemplate()
      .then(template => {
        const routerContext = {}
        const stores = createStoreMap()
        const app = serverBundle(stores, routerContext, req.url)
        asyncBootstrap(app)
          .then(() => {
            if (routerContext.url) {
              res.status(302)
                .setHeader('Loation', routerContext.url)
              res.end()
              return
            }
            const content = ReactDomServer.renderToString(app)

            res.send(template.replace('<!--app-->', content))
          })
      })
  })
}
