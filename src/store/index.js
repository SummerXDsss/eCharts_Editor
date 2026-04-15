import Vue from 'vue'
import Vuex from 'vuex'
import data from './modules/data'
import chart from './modules/chart'
import mapping from './modules/mapping'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    data,
    chart,
    mapping
  },
  getters: {
    isReadyToGenerate: (state) => {
      return state.data.parsedData &&
             state.data.parsedData.length > 0 &&
             state.mapping.mappings &&
             Object.keys(state.mapping.mappings).length > 0
    }
  }
})
