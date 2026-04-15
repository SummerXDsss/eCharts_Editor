import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import TDesign from 'tdesign-vue'
import 'tdesign-vue/es/style/index.css'

Vue.config.productionTip = false
Vue.use(TDesign)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
