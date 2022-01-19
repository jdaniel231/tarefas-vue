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

import axios from 'axios';
import { Model } from 'vue-api-query';
Model.$http = axios;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
