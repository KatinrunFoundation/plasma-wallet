<template>
  <!-- Footer -->
  <mdb-footer color="blue" class="font-small pt-4 mt-4 main">
    <div class="footer-copyright text-center py-3 inner">
      <mdb-container fluid>
        Powered by <a href="https://www.facebook.com/Katinrun/"> Katinrun, </a> Host on <a href="https://www.facebook.com/domecloud.io/">DomeCloud</a>
      </mdb-container>
    </div>
  </mdb-footer>
  <!-- Footer -->
</template>

<script>
import { mdbFooter, mdbContainer } from 'mdbvue'

export default {
  name: 'Footer',
  components: {
    mdbFooter,
    mdbContainer
  }
}
</script>

<style scoped>
.main {
  font-size: 16px;
  background-color: #2196f3;
}
.inner {
  margin-top: 20px;
  padding: 10px 0 10px 0;
  background-color: rgba(0,0,0,.2);
  color: rgba(255,255,255,.6);
}
.footer {
  font-size: 50px;
}
a {
  color: #fff;
}
</style>
