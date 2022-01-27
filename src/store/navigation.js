export default {
  namespaced: true,
  state: () => ({
    isShow: false,
    isShowRNB: false
  }),
  mutations: {
    setState(state, payload) {
      Object.keys(payload).forEach((key) => {
        state[key] = payload[key]
      })
    }
  },
  actions: {
    onNav({ commit }) {
      commit('setState', {
        isShow: true
      })
    },
    offNav({ commit }) {
      commit('setState', {
        isShow: false
      })
    },
    onNavRNB({ commit }) {
      commit('setState', {
        isShowRNB: true
      })
    },
    offNavRNB({ commit }) {
      commit('setState', {
        isShowRNB: false
      })
    }
  }
}
