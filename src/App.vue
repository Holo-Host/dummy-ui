<template>
  <h3>Dummy UI: {{ isAvailable ? "Available" : "Unavailable" }}</h3>
  <PassThrough  />
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import PassThrough from './components/PassThrough.vue'

export default {
  name: 'App',
  components: {
    PassThrough
  },
  async mounted () {
    console.log('process.env.INTEGRATION_TEST_MODE', process.env.INTEGRATION_TEST_MODE)
    // In integration test mode we don't initialize because the test is responsible for making web sdk calls
    if (!process.env.INTEGRATION_TEST_MODE) {
      this.init()
    }
  },
  methods: {
    ...mapActions('holo', ['init'])
  },
  computed: {
    ...mapState('holo', ['hasClient']),
    ...mapGetters('holo', ['isAvailable'])
  },
  watch: {
    isAvailable (val) {
      console.log('DUMMY UI: isAvailable changed', val)
    }
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
