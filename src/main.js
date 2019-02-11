import Vue from 'vue'

import Meta from 'vue-meta'
import Router from 'vue-router'

// External libraries.
import { library } from '@fortawesome/fontawesome-svg-core'

// Font Awesome icons.
import { faQrcode, faTimes } from '@fortawesome/free-solid-svg-icons'

// External components.
import VueQrcode from '@chenfengyuan/vue-qrcode'
import { QrcodeStream } from 'vue-qrcode-reader'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Internal components.
import App from './App.vue'
import Wallet from './components/Wallet'
import Receive from './components/Receive'
import Send from './components/Send'

Vue.use(Router)
Vue.use(Meta)

Vue.component('qrcode', VueQrcode)
Vue.component('qrreader', QrcodeStream)
Vue.component('font-awesome-icon', FontAwesomeIcon)

library.add(faQrcode)
library.add(faTimes)

Vue.config.productionTip = false

const routes = [
  { path: '/', component: Wallet },
  { path: '/receive', component: Receive },
  { path: '/send', component: Send }
]

const router = new Router({
  routes
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
