<template>
  <div>
    <top-bar></top-bar>
    <div class="mobile-sub-header">Burn</div>

    <div class="container" v-if="!burning">
      <div class="card danger text-center">
        <font-awesome-icon icon="exclamation-triangle" /> DANGER ZONE <font-awesome-icon icon="exclamation-triangle" />
      </div>
      <div class="card">
        You are about to delete your private key.
        You will lose all of the money in your account.
        Are you sure you want to do this?
      </div>
      <div class="card">
        <button class="btn btn-half btn-small btn-success" v-on:click="back()">No, take me back</button>
        <button class="btn btn-half btn-small btn-danger" v-on:click="burn()">Yes, delete it</button>
      </div>
    </div>
    <div class="card text-center" v-if="burning">
      burning everything to the ground... <font-awesome-icon icon="spinner" spin />
    </div>
  </div>
</template>

<script>
import client from '../services/client-service'
import clientData from '../services/client-data-service'

export default {
  name: 'Burn',
  data () {
    return {
      burning: false
    }
  },
  methods: {
    async burn () {
      this.burning = true
      await client.resetAccount()
      await clientData.forceRefresh()
      this.burning = false
      this.back()
    },
    back () {
      this.$router.go(-1)
    }
  }
}
</script>
