<template>
  <div>
    <div class="top-bar">{{ address }}</div>
    <div class="top-bar" style="color:lightcolor;">WARNING: ONLY DEPOSIT RINKEBY (TESTNET) ETH</div>
    <div class="top-bar margin-bottom-sm">
      <span v-if="synced !== latest">syncing... <font-awesome-icon icon="spinner" spin /></span>
      <span v-if="synced === latest">synced</span>
    </div>

    <div class="mobile-sub-header">ETH Balance</div>  
    <div class="card">
      <div class="main-info">
        ETH <div class="right">{{ ethBalance }}</div>
      </div>
    </div>

    <div class="card" v-if="!depositing && !exiting">
      <button class="btn btn-half btn-small" :disabled="ethBalance === '0'" v-on:click="startDeposit()"><font-awesome-icon icon="arrow-down" /> Deposit <font-awesome-icon icon="arrow-down" /></button>
      <button class="btn btn-half btn-small" :disabled="balances.length === 0" v-on:click="startExit()"><font-awesome-icon icon="arrow-up" /> Withdraw <font-awesome-icon icon="arrow-up" /></button>
    </div>

    <div class="card" v-if="depositing && !working">
      <input name="amount" type="text" class="send-input" v-model="amount" />
      <div class="send-btn-container">
        <button class="btn btn-half btn-small" v-on:click="deposit()"><font-awesome-icon icon="arrow-down" /> Send <font-awesome-icon icon="arrow-down" /></button>
        <button class="btn btn-half btn-small" v-on:click="cancel()">Cancel</button>
      </div>
    </div>

    <div class="card" v-if="exiting && !working">
      <input name="amount" type="text" class="send-input" v-model="amount" />
      <div class="send-btn-container">
        <button class="btn btn-half btn-small" v-on:click="exit()"><font-awesome-icon icon="arrow-up" /> Send <font-awesome-icon icon="arrow-up" /></button>
        <button class="btn btn-half btn-small" v-on:click="cancel()">Cancel</button>
      </div>
    </div>

    <div class="card text-center" v-if="working">
      sending transaction... <font-awesome-icon icon="spinner" spin />
    </div>

    <div class="mobile-sub-header">Plasma Balances</div>
    <div class="card text-center" v-if="balances.length === 0">
      You don't have any tokens!
    </div>
    <div class="balances">
      <div class="card" v-for="item in balances" :key="item.token">
        <div class="main-info">
          {{ item.token }} <div class="right">{{ item.balance }}</div>
        </div>
      </div>
    </div>

    <div class="card bottom">
      <router-link tag="button" class="btn btn-half" to="/send" :disabled="balances.length === 0">Send</router-link>
      <router-link tag="button" class="btn btn-half" to="/receive">Receive</router-link>
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
      synced: 0,
      ethBalance: '0',
      amount: '',
      depositing: false,
      exiting: false,
      working: false
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
        //await client.finalizeExits(this.address)
        this.ethBalance = await client.getEthBalance(this.address)
        this.balances = await client.getBalances(this.address)
        this.latest = await client.getCurrentBlock()
        this.synced = await client.getLastSyncedBlock()
      } finally {
        await sleep(1000)
        this.watchClient()
      }
    },
    startDeposit () {
      this.depositing = true
    },
    startExit () {
      this.exiting = true
    },
    cancel () {
      this.depositing = false
      this.exiting = false
    },
    async deposit () {
      this.working = true
      try {
        await client.deposit(this.address, 0, this.amount)
      } finally {
        this.working = false
        this.cancel()
      }
    },
    async exit () {
      this.working = true
      try {
        await client.exit(this.address, 0, this.amount)
      } finally {
        this.working = false
        this.cancel()
      }
    }
  }
}
</script>
