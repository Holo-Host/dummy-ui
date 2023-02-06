import WebSdk from '@holo-host/web-sdk'

let client

window.WebSdk = WebSdk

export default {
  namespaced: true,
  state: {
    hasClient: false,
    agent: {},
    happId: null,
    roleId: null
  },
  actions: {
    async init ({ dispatch, commit }) {
      try {
        client = await WebSdk.connect({
          chaperoneUrl: 'http://localhost:24274',
          authFormCustomization: {
            anonymousAllowed: true,
            publisherName: 'Holo',
            appName: 'Dummy UI',
            logoUrl:
              'https://upload.wikimedia.org/wikipedia/en/a/a0/Grogu_%28Star_Wars%29.jpg',
            infoLink: 'https://holo.host/faq-tag/elemental-chat',
            // membraneProofServer: {
            //   url: 'https://holo-registration-service.holo.host',
            //   payload: {
            //     role: 'holofuel'
            //   }
            // },
            requireRegistrationCode: true
          }
        })
      } catch (e) {
        console.log('DUMMY UI: WebSdkApi.connect threw', e.message)
        return
      }

      commit('setHasClient', true)

      commit('setAgent', client.agent)
      commit('setHappId', client.happId)

      client.on('agent-state', agent_state => {
        commit('setAgent', agent_state)
        if (agent_state.unrecoverableError) {
          dispatch(
            'handleUnrecoverableAgentState',
            agent_state.unrecoverableError
          )
        }
      })
      client.on('signal', payload => dispatch('handleSignal', payload))

      const app_info = await client.appInfo()

      const role_id = Object.keys(app_info.cell_info).sort()[0]

      if (!role_id) {
        throw new Error("No cells returned in AppInfo")
      }

      console.log('role_id', role_id)

      commit('setRoleId', role_id)
    },
    async signIn () {
      await client.signIn()
    },
    async signInUncancellable () {
      await client.signIn({ cancellable: false })
    },
    async signUp () {
      await client.signUp()
    },
    async signOut () {
      await client.signOut()
    },
    handleSignal (_, signal) {
      console.log('DUMMY UI: Got Signal', signal)
    },
    async callZome ({ state }, args) {
      console.log('DUMMY UI ZOME CALL args', args)
      const { zomeName, fnName, payload } = args
      const result = await client.callZome({
        roleId: state.roleId,
        zomeName,
        fnName,
        payload
      })

      // result may be of form { type: 'ok', data: ... } or { type 'error', data: ... }, we're letting the caller deal with that
      return result
    },
    appInfo () {
      return client.appInfo()
    },
    cellData () {
      return client.cellData
    },
    happId () {
      return client.happId
    },
    async agentInfoHappId () {
      return {
        agent: client.agent,
        happId: client.agentInfo
      }
    },
    handleUnrecoverableAgentState (_, error) {
      // handle this error in the ui
      console.error('Unrecoverable Agent State', error)
    }
  },
  mutations: {
    setHasClient (state, hasClient) {
      state.hasClient = hasClient
    },
    setAgent (state, agent) {
      state.agent = agent
    },
    setHappId (state, happId) {
      state.happId = happId
    },
    setRoleId (state, roleId) {
      state.roleId = roleId
    }
  },
  getters: {
    isAvailable: state => state.agent.isAvailable
  }
}
