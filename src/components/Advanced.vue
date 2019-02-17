<template>
  <div>
    <top-bar></top-bar>
    <div class="mobile-sub-header">Advanced</div>

    <div class="container">
      <div class="card danger text-center">
        <font-awesome-icon icon="exclamation-triangle" /> DANGER ZONE <font-awesome-icon icon="exclamation-triangle" />
      </div>
      <div class="mobile-sub-header">Private Key</div>
      <div class="card">
        <div class="margin-bottom-sm">
          <button class="btn btn-half" v-clipboard:copy="account.privateKey" v-clipboard:success="onPkCopy">Copy Key</button>
          <router-link tag="button" class="btn btn-half" to="/burn">Burn Key</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import clientData from '../services/client-data-service'

export default {
  name: 'Advanced',
  computed: {
    account () {
      return clientData.account
    },
  },
  methods: {
    onPkCopy () {
      // Hack to prevent displaying duplicate toasts.
      if (this.toasting) return
      this.toasting = true

      this.$toasted.show('Copied to clipboard!', {
        position: 'bottom-center',
        duration: 1000,
        singleton: true,
        onComplete: () => {
          this.toasting = false
        }
      })
    },
    back () {
      this.$router.go(-1)
    }
  }
}
</script>
