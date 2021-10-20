export const state = () => ({
  data: [],
})

export const actions = {
  async GET_DATA({ commit }) {
    const res = await this.$axios.get('/api/upload')
    commit('SET_DATA', res.data.uploads)
  },
}

export const mutations = {
  SET_DATA(state, uploads) {
    return (state.data = uploads)
  },
}

export const getters = {
  DATA: (state) => {
    return state.data
  },
}
