import '@builder.io/qwik/qwikloader.js'

import { render } from '@builder.io/qwik'
import { App } from './app.js'
import './index.css'

render(document.getElementById('root') as HTMLElement, <App />)
