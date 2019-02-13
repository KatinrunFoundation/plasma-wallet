<template>
  <div>
    <top-bar></top-bar>
    <div class="mobile-sub-header">Receive</div>

    <div class="qr-container">
      <font-awesome-icon class="close-btn" icon="times" v-on:click="back()" />
      <div class="text-center">
        <qrcode v-bind:value="account.address" :options="{ width: 300, color: { light: '#FBFBFBff' } }"></qrcode>
      </div>
    </div>
  </div>
</template>

<script>
import clientData from '../services/client-data-service'

export default {
  name: 'Receive',
  computed: {
    account () {
      return clientData.account
    }
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
