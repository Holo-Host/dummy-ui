import WebSdk from '@holo-host/web-sdk'

let client

window.WebSdk = WebSdk

export default {
  namespaced: true,
  state: {
    hasClient: false,
    agent: {},
    happId: null,
    roleName: null
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

      const role_names = Object.keys(app_info.cell_info)
      if (role_names.length === 0 ) {
        throw new Error('No cells found in appInfo')
      }

      const role_name = role_names.sort()[0] // arbitrarily choose the alphabetically first role id (should be 'test')    

      commit('setRoleName', role_name)
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

      const { zome_name, fn_name, payload } = args
      const result = await client.callZome({
        role_name: state.roleName,
        zome_name,
        fn_name,
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
    setRoleName (state, roleName) {
      state.roleName = roleName
    }
  },
  getters: {
    isAvailable: state => state.agent.isAvailable
  }
}
