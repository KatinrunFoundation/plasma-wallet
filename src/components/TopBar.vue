<template>
  <div>
    <div class="logo">
      <img src="https://ipfs.infura.io/ipfs/QmZ1ZFEPt6eQcYZSMX6umB8AzFwQt7kSaptHGMs3QNfk7f">
    </div>
    <div id="nav">
      <a href="http://krplasma.kulap.io" class="active">Wallet</a> |
      <a href="http://krplasma.kulap.io:8080">Explorer</a>
    </div>
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

<style scoped>
.logo {
  text-align: center;
  margin-top: 22px;
}
.logo img {
  height: 80px;
}
#nav {
  padding: 30px;
  text-align: center;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.active {
  color: #42b983;
}
</style>
