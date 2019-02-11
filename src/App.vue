<template>
  <div id="app">
    <Wallet />
  </div>
</template>

<script>
require('@/assets/css/main.scss')

import Wallet from './components/Wallet.vue'

export default {
  name: 'app',
  components: {
    Wallet
  },
  metaInfo: {
    title: 'Plasma Burner Wallet',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ]
  },
}
</script>
