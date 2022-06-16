<template>
  <div>

    <div> Agent id: {{ agent.id }} </div>
    <div> Happ Id: {{ happId }} </div>

    <div>
      <button @click="getAppInfo">Get App Info</button>
    </div>

    <div>
      <input v-model="passThroughValue" />
    </div>

    <div>
      <button @click="passObj">Pass value through Holo</button>
    </div>

    <div>
      <input v-model="signalValue" />
      <button @click="sendSignal">Send Signal</button>
    </div>

    <div>
      <button @click="info">Log Agent Info</button>
    </div>

    <div v-if="agent.isAnonymous">
      <button @click="signIn">Sign in!</button>
    </div>

    <div v-if="agent.isAnonymous">
      <button @click="signUp">Sign up!</button>
    </div>

    <div v-if="!agent.isAnonymous">
      <button @click="signOut">Sign out!</button>
    </div>

  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  name: 'Passthrough',
  data () {
    return {
      passThroughValue: "",
      signalValue: "",
      roleId: null
    }
  },
  methods: {
    ...mapActions('holo', ['appInfo', 'signIn', 'signUp', 'signOut', 'zomeCall']),
    async getAppInfo () {
      const appInfo = await this.appInfo()
      console.log('DUMMY UI: appInfo', appInfo)
    },
    async passObj () {
      const payload = {
        value: this.passThroughValue
      }

      const result = await this.zomeCall({
        roleId: this.roleId,
        zomeName: "test",
        fnName: "create_link",
        payload: null
      })

      console.log('DUMMY UI: pass_obj zome call payload', payload, 'result', result)
    },
    async sendSignal () {
      const payload = {
        value: this.signalValue
      }

      const result = await this.zomeCall({
        roleId: this.roleId,
        zomeName: "test",
        fnName: "signal_loopback",
        payload
      })

      this.signalValue = ""

      console.log('DUMMY UI: signal_loopback zome call payload', payload, 'result', result)
    },
    info () {
      console.log('Agent Info', this.agent)
      console.log('Happ Id', this.happId)
    }
  },
  computed: {
    ...mapState('holo', ['agent', 'happId'])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
div {
  margin-bottom: 20px;
}
</style>
