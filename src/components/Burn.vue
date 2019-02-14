<template>
  <div>
    <top-bar></top-bar>
    <div class="mobile-sub-header">Burn</div>

    <div class="container">
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
  </div>
</template>

<script>
import client from '../services/client-service'

export default {
  name: 'Burn',
  methods: {
    async burn () {
      await client.resetAccount()
      this.back()
    },
    back () {
      this.$router.go(-1)
    }
  }
}
</script>
