<template>
  <PassThrough  />
</template>

<script>
import { mapActions } from 'vuex'
import PassThrough from './components/PassThrough.vue'

export default {
  name: 'App',
  components: {
    PassThrough
  },
  async mounted () {
    console.log('import.meta.env.VITE_INTEGRATION_TEST_MODE', import.meta.env.VITE_INTEGRATION_TEST_MODE)
    // In integration test mode we don't initialize because the test is responsible for making web sdk calls
    if (!import.meta.env.VITE_INTEGRATION_TEST_MODE) {
      this.init()
    }
  },
  methods: {
    ...mapActions('holo', ['init'])
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
