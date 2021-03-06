import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'mobx-react'
import { AppContainer } from 'react-hot-loader' // eslint-disable-line
import App from './views/App'
import { AppState } from './store/index';

const root = document.getElementById('root')
const render = (Component) => {
  ReactDOM.hydrate(
    <div>
      <AppContainer>
        <Provider appState={new AppState()}>
          <BrowserRouter>
            <Component />
          </BrowserRouter>
        </Provider>
      </AppContainer>
    </div>,
    root,
  )
}
render(App)
if (module.hot) {
  module.hot.accept('./views/App.jsx', () => {
    const NextApp = require('./views/App.jsx').default// eslint-disable-line
    render(NextApp)
  })
}
