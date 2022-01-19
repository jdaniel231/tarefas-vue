import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { BootstrapVue } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)

//Validate
import Vuelidate from 'vuelidate';
Vue.use(Vuelidate);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
