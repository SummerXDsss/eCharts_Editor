export default {
  namespaced: true,
  state: {
    dataSource: null,
    dataType: 'manual', // 'manual' | 'file' | 'api'
    fields: [],
    parsedData: null,
    apiConfig: {
      url: '',
      method: 'GET',
      headers: {},
      params: {}
    }
  },
  mutations: {
    SET_DATA_SOURCE(state, data) {
      state.dataSource = data
    },
    SET_DATA_TYPE(state, type) {
      state.dataType = type
    },
    SET_FIELDS(state, fields) {
      state.fields = fields
    },
    SET_PARSED_DATA(state, data) {
      state.parsedData = data
    },
    SET_API_CONFIG(state, config) {
      state.apiConfig = { ...state.apiConfig, ...config }
    }
  },
  actions: {
    updateDataSource({ commit }, { type, data, fields }) {
      commit('SET_DATA_TYPE', type)
      commit('SET_DATA_SOURCE', data)
      commit('SET_PARSED_DATA', data)
      commit('SET_FIELDS', fields)
    },
    clearData({ commit }) {
      commit('SET_DATA_SOURCE', null)
      commit('SET_PARSED_DATA', null)
      commit('SET_FIELDS', [])
    }
  }
}
