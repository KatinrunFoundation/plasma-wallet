<template>
  <div>
    <div class="top-bar">Plasma Burner Wallet v{{ version }}</div>
    <div class="top-bar">{{ address }}</div>
    <div class="top-bar danger">WARNING: ONLY DEPOSIT RINKEBY (TESTNET) ETH</div>
  </div>
</template>

<script>
import client from '../services/plasma-client'

export default {
  name: 'TopBar',
  data () {
    return {
      address: undefined,
      version: process.env.VERSION
    }
  },
  mounted () {
    (async () => {
      this.address = await client.waitForAddress()
    })()
  },
}
</script>
