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
  computed: {
    version () {
      return versionManager.getCurrentVersion()
    },
    account () {
      return clientData.account
    },
    syncing () {
      return clientData.syncing
    }
  }
}
</script>
