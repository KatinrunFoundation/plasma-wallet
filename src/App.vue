<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
require('@/assets/css/main.scss')

export default {
  name: 'app',
  metaInfo: {
    title: 'Plasma Burner Wallet',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ]
  },
}
</script>
