// import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// import {Alert,Icon,Button,Modal,Tree,Message,Notice} from 'iview';
// import iview from 'iview';
Vue.use(iview)

import 'iview/dist/styles/iview.css'
import '../../../my-theme/index.less';//覆盖的样式

import '@/assets/css/base.less';
import '@/assets/css/common.less';

Vue.prototype.$Message = iview.Message
Vue.prototype.$Notice = iview.Notice
Vue.prototype.$store = store


if (process.env.NODE_ENV == 'development') {
  Vue.config.devtools = true;
} else {
  Vue.config.devtools = false;
}
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
