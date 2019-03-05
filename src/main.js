import Vue from 'vue';
import App from './App.vue';
import moment from 'moment'
import ip from 'ip';

Vue.config.productionTip = false
Vue.prototype.$moment = moment
Vue.prototype.$ip = ip

new Vue({
  render: h => h(App),
}).$mount('#app')
