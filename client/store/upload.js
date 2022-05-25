export const state = () => ({
  showEditUploadModal: false,
  editUploadModalData: {},
  data: [],
  messages: {
    success: null,
    error: null,
    errors: {
      code: null,
    },
  },
})

export const actions = {
  async GET_DATA({ commit }) {
    const res = await this.$axios.get('/api/upload')
    commit('SET_DATA', res.data.uploads)
  },
  TOGGLE_EDIT_UPLOAD_MODAL({ state, commit }) {
    commit('SET_SHOW_EDIT_UPLOAD_MODAL', !state.showEditUploadModal)
  },
}
export const mutations = {
  SET_DATA(state, uploads) {
    return (state.data = uploads)
  },
  SET_MESSAGE_SUCCESS: (state, success) => {
    return (state.messages.success = success)
  },
  SET_MESSAGE_ERROR: (state, error) => {
    return (state.messages.error = error)
  },
  SET_MESSAGE_ERRORS_CODE: (state, message) => {
    return (state.messages.errors.code = message)
  },
  SET_SHOW_EDIT_UPLOAD_MODAL: (state, show) => {
    return (state.showEditUploadModal = show)
  },
  SET_EDIT_UPLOAD_MODAL_DATA: (state, data) => {
    return (state.editUploadModalData = data)
  },
}

export const getters = {
  DATA: (state) => {
    return state.data
  },
  MESSAGE_SUCCESS: (state) => {
    return state.messages.success
  },
  MESSAGE_ERROR: (state) => {
    return state.messages.error
  },
  MESSAGE_ERRORS: (state) => {
    return state.messages.errors
  },
}
