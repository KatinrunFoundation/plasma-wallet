import Vue from 'vue'

import Meta from 'vue-meta'
import Router from 'vue-router'

// External libraries.
import Toasted from 'vue-toasted';
import VueClipboard from 'vue-clipboard2'
import { library } from '@fortawesome/fontawesome-svg-core'

// Font Awesome icons.
import {
  faQrcode,
  faTimes,
  faArrowUp,
  faArrowDown,
  faSpinner,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons'

// External components.
import VueQrcode from '@chenfengyuan/vue-qrcode'
import { QrcodeStream } from 'vue-qrcode-reader'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Internal components.
import App from './App.vue'
import Wallet from './components/Wallet'
import Receive from './components/Receive'
import Send from './components/Send'
import Burn from './components/Burn'
import TopBar from './components/TopBar'
import Settings from './components/Settings'
import Advanced from './components/Advanced'

Vue.use(Router)
Vue.use(Meta)
Vue.use(VueClipboard)
Vue.use(Toasted)

Vue.component('qrcode', VueQrcode)
Vue.component('qrreader', QrcodeStream)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('top-bar', TopBar)

library.add(faQrcode)
library.add(faTimes)
library.add(faArrowUp)
library.add(faArrowDown)
library.add(faSpinner)
library.add(faExclamationTriangle)

Vue.config.productionTip = false

// Register routes.
const routes = [
  { path: '/', component: Wallet },
  { path: '/receive', component: Receive },
  { path: '/send', component: Send },
  { path: '/burn', component: Burn },
  { path: '/settings', component: Settings },
  { path: '/advanced', component: Advanced }
]
const router = new Router({
  routes
})

// Create the app.
new Vue({
  render: h => h(App),
  router
}).$mount('#app')
