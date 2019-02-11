<template>
  <div>
    <div class="top-bar">{{ address }}</div>
    <div class="top-bar margin-bottom-sm">sync progress: {{ synced }} / {{ latest }}</div>

    <div class="mobile-sub-header">Balances</div>
    <div class="card text-center" v-if="balances.length === 0">
      You don't have any tokens!
    </div>
    <div class="card" v-for="item in balances" :key="item.token">
      <div class="main-info">
        {{ item.token }} <div class="right">{{ item.balance }}</div>
      </div>
    </div>

    <div class="card">
      <router-link class="btn btn-half" to="/send">Send</router-link>
      <router-link class="btn btn-half" to="/receive">Receive</router-link>
    </div>
  </div>
</template>

<script>
import client from '../services/plasma-client'

const sleep = async (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export default {
  name: 'Wallet',
  data () {
    return {
      address: undefined,
      balances: [],
      latest: 0,
      synced: 0
    }
  },
  beforeCreate () {
    (async () => {
      await client.start()
      this.address = await client.getAddress()
      this.watchClient()
    })()
  },
  methods: {
    async watchClient () {
      try {
        this.balances = await client.getBalances(this.address)
        this.latest = await client.getCurrentBlock()
        this.synced = await client.getLastSyncedBlock()
      } finally {
        await sleep(1000)
        this.watchClient()
      }
    }
  }
}
</script>
