import 'react-app-polyfill/stable'
import 'core-js'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { Provider } from 'react-redux'
import store from './store'
import { HashRouter } from 'react-router-dom'

// ---- FIX: ResizeObserver loop error (CoreUI / Chrome) ----
const OriginalResizeObserver = window.ResizeObserver
window.ResizeObserver = class extends OriginalResizeObserver {
  constructor(callback) {
    super((entries, observer) => {
      window.requestAnimationFrame(() => {
        callback(entries, observer)
      })
    })
  }
}
// --------------------------------------------------------

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>,
  document.getElementById('root')
)

serviceWorker.register()
