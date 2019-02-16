<template>
  <div>
    <div v-if="!scanning">
      <top-bar></top-bar>
      <div class="mobile-sub-header">Send to Address</div>

      <div class="container" v-if="!sending">
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
      <div class="card text-center" v-if="sending">
        making your dreams a reality... <font-awesome-icon icon="spinner" spin />
      </div>
    </div>

    <div v-if="scanning">
      <font-awesome-icon class="close-btn" icon="times" v-on:click="stopScan()" />
      <qrreader class="qr-reader" @decode="onDecode"></qrreader>
    </div>
  </div>
</template>

<script>
import client from '../services/client-service'
import clientData from '../services/client-data-service'

export default {
  name: 'Receive',
  data () {
    return {
      scanning: false,
      sending: false,
      recipient: '',
      token: '',
      amount: ''
    }
  },
  computed: {
    account () {
      return clientData.account
    },
    balances () {
      return clientData.balances
    }
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
    async sendTransaction () {
      this.sending = true
      await client.plasma.sendTransaction(this.account.address, this.recipient, this.token, this.amount)
      this.sending = false
      this.back()
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
