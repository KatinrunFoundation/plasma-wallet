<template>
  <div>
    <div class="top-bar">Plasma Burner Wallet v{{ version }}</div>
    <div class="top-bar">{{ account.address }}</div>
    <div class="top-bar danger">WARNING: ONLY DEPOSIT RINKEBY (TESTNET) ETH</div>
    <div class="top-bar margin-bottom-sm">
      <span v-if="syncing">syncing... <font-awesome-icon icon="spinner" spin /></span>
      <span v-if="!syncing">synced</span>
    </div>
  </div>
</template>

<script>
import clientData from '../services/client-data-service'
import versionManager from '../services/plasma-client/version-manager'

export default {
  name: 'TopBar',
  data () {
    return {
      refreshval: 1
    }
  },
  beforeMount () {
    setInterval(() => {
      this.refreshval = Math.random()
    }, 1000)
  },
  computed: {
    version () {
      if (this.refreshval) {
        return versionManager.getCurrentVersion()
      } else {
        return versionManager.getCurrentVersion()
      }
    },
    account () {
      if (this.refreshval) {
        return clientData.account
      } else {
        return clientData.account
      }
    },
    syncing () {
      if (this.refreshval) {
        return clientData.syncing
      } else {
        return clientData.syncing
      }
    }
  }
}
</script>
