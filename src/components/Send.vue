<template>
  <div>
    <div v-if="!scanning">
      <top-bar></top-bar>
      <div class="mobile-sub-header">Send to Address</div>

      <div class="container">
        <font-awesome-icon class="back-btn" icon="times" v-on:click="back()" />
        <div class="input-field">
          <label>Token to Send</label>
          <select v-model="token">
            <option v-for="item in balances" :key="item.token" :value="item.id">{{ item.token }} ({{ item.balance }})</option>
          </select>
        </div>
        <div class="input-field">
          <label>Recipient Address</label>
          <input name="address" type="text" class="scan-input" v-model="recipient" />
          <div class="scan-icon" v-on:click="startScan()">
            <font-awesome-icon icon="qrcode" />
          </div>
        </div>
        <div class="input-field">
          <label>Amount to Send</label>
          <input name="amount" type="text" v-model="amount" />
        </div>
        <button class="btn" v-on:click="sendTransaction()">send</button>
      </div>
    </div>

    <div v-if="scanning">
      <font-awesome-icon class="close-btn" icon="times" v-on:click="stopScan()" />
      <qrreader class="qr-reader" @decode="onDecode"></qrreader>
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
  name: 'Receive',
  data () {
    return {
      address: undefined,
      scanning: false,
      recipient: '',
      token: '',
      amount: '',
      balances: []
    }
  },
  beforeCreate() {
    (async () => {
      await client.start()
      this.address = await client.getAddress()
      await client.waitForContractInit()
      this.watchClient()
    })()
  },
  methods: {
    onDecode (decoded) {
      this.recipient = decoded
      this.stopScan()
    },
    startScan () {
      this.scanning = true
    },
    stopScan () {
      this.scanning = false
    },
    async watchClient () {
      try {
        this.balances = await client.getBalances(this.address)
        if (this.token === '') {
          this.token = this.balances[0].id
        }
      } finally {
        await sleep(1000)
        this.watchClient()
      }
    },
    async sendTransaction () {
      await client.sendTransaction(this.address, this.recipient, this.token, this.amount)
      this.$router.push('/')
    },
    back () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.scan-input {
  width: 90%;
}

.scan-icon {
  height: 24px;
  line-height: 24px;
  width: 5%;
  float: right;
  text-align: center;
}

.qr-reader {
  height: 100vh;
  background: black;
}

.close-btn {
  color: white;
  position: fixed;
  top: 10px;
  right: 10px;
  font-size: 25px;
}

.back-btn {
  position: absolute;
  right: 10px;
  top: 0px;
}

select {
  width: 100%;
  background-color: white;
}
</style>
