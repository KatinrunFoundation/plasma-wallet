<template>
  <div>
    <div class="top-bar margin-bottom-sm">{{ address }}</div>
    <div class="mobile-sub-header">Receive</div>

    <div class="text-center">
      <qrcode v-bind:value="address" :options="{ width: 300, color: { light: '#FBFBFBff' } }"></qrcode>
    </div>
  </div>
</template>

<script>
import client from '../services/plasma-client'

export default {
  name: 'Receive',
  data () {
    return {
      address: undefined
    }
  },
  beforeCreate() {
    (async () => {
      await client.start()
      this.address = await client.getAddress()
    })()
  }
}
</script>
