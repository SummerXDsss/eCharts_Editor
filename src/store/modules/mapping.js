export default {
  namespaced: true,
  state: {
    mappings: {},
    availableFields: [],
    mappingRules: {}
  },
  mutations: {
    SET_MAPPINGS(state, mappings) {
      state.mappings = mappings
    },
    SET_AVAILABLE_FIELDS(state, fields) {
      state.availableFields = fields
    },
    SET_MAPPING_RULES(state, rules) {
      state.mappingRules = rules
    },
    UPDATE_MAPPING(state, { key, value }) {
      state.mappings = { ...state.mappings, [key]: value }
    },
    CLEAR_MAPPINGS(state) {
      state.mappings = {}
    }
  },
  actions: {
    updateMapping({ commit }, { key, value }) {
      commit('UPDATE_MAPPING', { key, value })
    },
    setMappingRules({ commit }, rules) {
      commit('SET_MAPPING_RULES', rules)
    },
    clearMappings({ commit }) {
      commit('CLEAR_MAPPINGS')
    }
  }
}
