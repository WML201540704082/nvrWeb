import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    event: false,
    router: '',
    faceImport: '',
    syncPlayMode: false,
    channelList: [],
  },
  mutations: {
    changeEvent (state, event) {
      state.event = event
    },
    changeRouter (state, router) {
      state.router = router
    },
    changeFaceImport (state, faceImport) {
      state.faceImport = faceImport
    },
    changeSyncPlayMode (state, syncPlayMode) {
      state.syncPlayMode = syncPlayMode
    },
    changeChannelList (state, channelList) {
      state.channelList = channelList
    },
  },
  actions: {
    changeEvent ({commit}, event) {
      commit('changeEvent', event)
    },
    changeRouter ({commit}, router) {
      commit('changeRouter', router)
    },
    changeFaceImport ({commit}, faceImport) {
      commit('changeFaceImport', faceImport)
    },
    changeSyncPlayMode ({commit}, syncPlayMode) {
      commit('changeSyncPlayMode', syncPlayMode)
    },
    changeChannelList ({commit}, channelList) {
      commit('changeChannelList', channelList)
    },
  },
  getters: {
    getEvent (state) {
      return state.event
    },
    getRouter (state) {
      return state.router
    },
    getFaceImport (state) {
      return state.faceImport
    },
    getSyncPlayMode(state) {
      return state.syncPlayMode
    },
    getChannelList(state) {
      return state.channelList
    },
  },
  modules: {
  }
})
