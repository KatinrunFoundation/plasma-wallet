<template>
  <div>
    <div class="top-bar">Plasma Burner Wallet v{{ version }}</div>
    <div class="top-bar">{{ account.address }}</div>
    <div class="top-bar danger">WARNING: ONLY DEPOSIT RINKEBY (TESTNET) ETH</div>
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
    }
  }
}
</script>
