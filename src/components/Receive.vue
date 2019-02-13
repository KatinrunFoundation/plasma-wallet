<template>
  <div>
    <div class="top-bar">{{ address }}</div>
    <div class="top-bar margin-bottom-sm danger">WARNING: ONLY DEPOSIT RINKEBY (TESTNET) ETH</div>
    <div class="mobile-sub-header">Receive</div>

    <div class="qr-container">
      <font-awesome-icon class="close-btn" icon="times" v-on:click="back()" />
      <div class="text-center">
        <qrcode v-bind:value="address" :options="{ width: 300, color: { light: '#FBFBFBff' } }"></qrcode>
      </div>
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
  },
  methods: {
    back () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.qr-container {
  position: relative;
}

.close-btn {
  position: absolute;
  right: 10px;
}
</style>
