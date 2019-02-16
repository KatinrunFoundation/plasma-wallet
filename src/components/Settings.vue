<template>
  <div>
    <top-bar></top-bar>
    <div class="mobile-sub-header">Settings</div>

    <div class="container">
      <div class="input-field">
        <label>Plasma Chain Name</label>
        <input name="plasma-chain-name" type="text" v-model="settings.plasmaChainName" />
      </div>
      <div class="input-field">
        <label>Plasma Registry Address</label>
        <input name="plasma-registry-address" type="text" v-model="settings.registryAddress" />
      </div>
      <div class="input-field">
        <label>Ethereum Endpoint</label>
        <input name="ethereum-endpoint" type="text" v-model="settings.ethereumEndpoint" />
      </div>
      <div class="card no-margin">
        <button class="btn btn-half btn-small" v-on:click="back()">Cancel</button>
        <button class="btn btn-half btn-small" v-on:click="save()">Save</button>
      </div>
    </div>
  </div>
</template>

<script>
import settingsStore from '../services/plasma-client/settings-store'

export default {
  name: 'Settings',
  data () {
    return {
      settings: settingsStore.loadSettings()
    }
  },
  methods: {
    async save () {
      settingsStore.saveSettings(this.settings)
      this.back()
    },
    back () {
      this.$router.go(-1)
    }
  }
}
</script>
