<template>
  <div>
    <div class="address-bar">{{ address }}</div>
    <div class="mobile-sub-header">Balances</div>
    <div class="card text-center" v-if="balances.length === 0">
      You don't have any tokens!
    </div>
    <div class="card" v-for="item in balances" :key="item.token">
      <div class="main-info">
        {{ item.token }} <div class="right">{{ item.balance }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import PlasmaClient from '../services/plasma-client'

const TOKENS = {
  '0': 'ETH'
}

const clientOptions = {
  finalityDepth: 0,
  debug: 'service:*',
  ethereumEndpoint: 'https://rinkeby.infura.io/v3/fce31f1fb2d54caa9b31ed7d28437fa5',
}
const client = new PlasmaClient(clientOptions)

export default {
  name: 'Wallet',
  data () {
    return {
      address: undefined,
      balances: []
    }
  },
  beforeCreate() {
    (async () => {
      await client.start()
      this.address = await this.getAccount()
      this.balances = await this.getBalances(this.address)
    })()
  },
  methods: {
    async getAccount() {
      const accounts = await client.core.services.wallet.getAccounts()
      if (accounts.length === 0) {
        const account = await client.core.services.wallet.createAccount()
        accounts.push(account)
      }
      return accounts[0]
    },
    async getBalances(address) {
      const balances = await client.core.services.chain.getBalances(address)
      const parsed = []
      for (const token in balances) {
        const tokenName = TOKENS[token] || token
        parsed.push({
          token: tokenName,
          balance: balances[token].toString()
        })
      }
      return parsed
    }
  }
}
</script>

<style lang="scss" scoped>
.rainbow-background {
  background: linear-gradient(to right, gold, aquamarine, crimson, orchid, blue);
  background-size: 200% 200%;

  animation: rainbow 2s ease-in-out infinite;
  transition: color .2s ease-in-out;
}

.rainbow-text {
  @extend .rainbow-background;

  color: rgba(0, 0, 0, 0);

  background-clip: text;
  -webkit-background-clip: text;
}

.address-bar {
  text-align: center;
  font-size: 12px;
  font-family: 'Roboto Mono';

  background-color: #FBFBFB;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  height: 29px;
  line-height: 29px;

  margin-bottom: 10px;
}

.mobile-sub-header {
  @extend .rainbow-text;

  font-size: 12px;
  text-transform: uppercase;

  border-top: 1px solid rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  height: 28px;
  line-height: 28px;

  padding: 0 15px;
  margin-bottom: 10px;
  margin-left: 10px;
  margin-right: 10px;
}
</style>
