import Vue from 'vue'
import App from './App.vue'

import Mailbox from './components/mail/Mailbox.vue';
import Mail from './components/mail/Mail.vue';

Vue.config.productionTip = false

Vue.component('appMailbox',Mailbox)
Vue.component('appMail',Mail)





new Vue({
  render: h => h(App),
}).$mount('#app')
