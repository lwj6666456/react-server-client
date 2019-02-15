const axios = require('axios')
const path = require('path')
const webpack = require('webpack')
const proxy = require('http-proxy-middleware')
const ReactDomServer = require('react-dom/server')
const asyncBootstrap = require('react-async-bootstrapper')
const serialize = require('serialize-javascript')
const fs = require('fs')
const ejs = require('ejs')

const serverConfig = require('../../build/webpack.config.server')

const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/server.ejs')
      .then(res => {
        resolve(res.data)
      })
      .catch(reject)
  })
}

const NativeModule = require('module')
const vm = require('vm')

const getModuleFromString = (bundle, filename) => {
  const m = { exports: {} }
  const wrapper = NativeModule.wrap(bundle)
  const script = new vm.Script(wrapper, {
    filename: filename,
    displayErrors: true
  })
  const result = script.runInThisContext()
  result.call(m.exports, m.exports, require, m)
  return m
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
  const m = getModuleFromString(bundle, 'server-entry.js')
  serverBundle = m.exports.default
  createStoreMap = m.exports.createStoreMap
})

const getStoreState = (stores) => {
  return Object.keys(stores)
    .reduce((result, storeName) => {
      result[storeName] = stores[storeName].toJson()
      return result
    }, {})
}

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
            const state = getStoreState(stores)
            console.log(state)
            const content = ReactDomServer.renderToString(app)
            const html = ejs.render(template, {
              appString: content,
              initialState: serialize(state)
            })
            res.send(html)
          })
      })
  })
}
