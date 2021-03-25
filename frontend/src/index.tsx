import './index.css'
import './fonts.css'

import App from './App'
import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8000'
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN'
axios.defaults.xsrfCookieName = 'csrftoken'

ReactDOM.render(<App />, document.getElementById('root'))