<template>
  <div :key="testkey">
    <top-bar></top-bar>

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

    <div class="card" v-if="balances.length > 0 && !creating">
      <button class="btn btn-whole btn-small" v-on:click="startChannel()"><font-awesome-icon icon="arrow-down" /> Create Payment Channel <font-awesome-icon icon="arrow-down" /></button>
    </div>
    <div class="card channel-card" v-if="creating">
      <div class="input-field">
        <label>Channel Amount</label>
        <input name="channel-amount" type="text" v-model="channelAmount" />
      </div>
      <div class="input-field">
        <label>Other Participant</label>
        <input name="channel-address" type="text" v-model="channelAddress" />
      </div>
      <div>
        <button class="btn btn-half btn-small" v-on:click="createChannel()"><font-awesome-icon icon="arrow-down" /> Send <font-awesome-icon icon="arrow-down" /></button>
        <button class="btn btn-half btn-small" v-on:click="cancelChannel()">Cancel</button>
      </div>
    </div>

    <div v-if="channel">
      <div class="mobile-sub-header">Payment Channel</div>
      <div class="card">
        <div class="main-info">
          your balance: <div class="right">{{ channel.balance1 }} ETH</div>
        </div>
        <div class="main-info">
          their balance: <div class="right">{{ channel.balance2 }} ETH</div>
        </div>
        <div class="input-field">
          <label>Send Amount</label>
          <input name="send-amount" type="text" v-model="sendAmount" />
        </div>
        <button class="btn btn-whole chan-btn btn-small" v-on:click="sendChannelAmount()">send</button>
      </div>
    </div>

    <div v-if="exits.length > 0">
      <div class="mobile-sub-header">Pending Withdrawals</div>
      <div class="exits">
        <div class="card" v-for="exit in exits" :key="exit.id">
          <div class="main-info">
            {{ exit.end.sub(exit.start).toString(10) }} {{ exit.tokenName }} <div class="right">{{ exit.timeLeft }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="card bottom">
      <div class="margin-bottom-sm">
        <router-link tag="button" class="btn btn-half" to="/send" :disabled="balances.length === 0">Send</router-link>
        <router-link tag="button" class="btn btn-half" to="/receive">Receive</router-link>
      </div>
      <div>
        <router-link tag="button" class="btn btn-half" to="/settings">Settings</router-link>
        <router-link tag="button" class="btn btn-half" to="/advanced">Advanced</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import client from '../services/client-service'
import clientData from '../services/client-data-service'
import lightningPredicate from '../services/predicates/lightning'
import rangePredicate from '../services/predicates/range-transfer'
import operator from '../services/operator/operator'
import { setInterval } from 'timers';

export default {
  name: 'Wallet',
  data () {
    return {
      amount: '',
      sendAmount: '',
      channelAmount: '',
      channelAddress: '',
      depositing: false,
      exiting: false,
      working: false,
      toasting: false,
      creating: false,
      testkey: 1,
      refreshval: 1
    }
  },
  beforeMount () {
    setInterval(() => {
      this.refreshval = Math.random()
    }, 1000)
  },
  computed: {
    account () {
      if (this.refreshval) {
        return clientData.account
      } else {
        return clientData.account
      }
    },
    ethBalance () {
      if (this.refreshval) {
        return clientData.ethBalance.toString(10)
      } else {
        return clientData.ethBalance.toString(10)
      }
    },
    balances () {
      if (this.refreshval) {
        return clientData.balances
      } else {
        return clientData.balances
      }
    },
    exits () {
      if (this.refreshval) {
        return clientData.exits
      } else {
        return clientData.exits
      }
    },
    channel () {
      if (this.refreshval) {
        return clientData.channel
      } else {
        return clientData.channel
      }
    }
  },
  methods: {
    startDeposit () {
      this.depositing = true
    },
    startExit () {
      this.exiting = true
    },
    startChannel () {
      this.creating = true
    },
    cancelChannel () {
      this.creating = false
    },
    cancel () {
      this.depositing = false
      this.exiting = false
    },
    async sendChannelAmount () {
      await operator.sendChannelAmount(this.account.address, this.channel.recipient, this.sendAmount)
      this.$forceUpdate()
    },
    async createChannel () {
      const predicateData = lightningPredicate.getPredicateData(this.account.address, this.channelAddress)
      const transaction = rangePredicate.createTransaction(0, 1, predicateData)
      const witness = rangePredicate.createWitness(this.account, 0, 1)
      await operator.sendTransaction(transaction, witness)
      await operator.openChannel(this.account.address, this.channelAddress, 1)
      this.creating = false
      this.$forceUpdate()
    },
    async deposit () {
      this.working = true
      try {
        await client.plasma.deposit(0, this.amount, this.account.address)
      } finally {
        this.working = false
        this.cancel()
      }
    },
    async exit () {
      this.working = true
      try {
        await client.plasma.startExit(this.account.address, 0, this.amount)
      } finally {
        this.working = false
        this.cancel()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.channel-card {
  input {
    width: 100%;
    margin-bottom: 5px;
  }

  button {
  }
}

.chan-btn {
  margin: 0;
  width: 100%;
}
</style>
