export default {
  namespaced: true,
  state: {
    chartType: 'line',
    chartOptions: {},
    customConfig: {
      title: '',
      subTitle: '',
      showLegend: true,
      showTooltip: true,
      showGrid: true,
      colors: []
    }
  },
  mutations: {
    SET_CHART_TYPE(state, type) {
      state.chartType = type
    },
    SET_CHART_OPTIONS(state, options) {
      state.chartOptions = options
    },
    SET_CUSTOM_CONFIG(state, config) {
      state.customConfig = { ...state.customConfig, ...config }
    },
    UPDATE_CONFIG_FIELD(state, { key, value }) {
      state.customConfig[key] = value
    }
  },
  actions: {
    changeChartType({ commit }, type) {
      commit('SET_CHART_TYPE', type)
    },
    updateChartOptions({ commit }, options) {
      commit('SET_CHART_OPTIONS', options)
    },
    updateCustomConfig({ commit }, config) {
      commit('SET_CUSTOM_CONFIG', config)
    }
  }
}
