//import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store.js'


// import {Alert,Icon,Button,Modal,Tree,Message,Notice,AutoComplete} from 'iview';

// import iView from 'iview';
Vue.use(iview)


import 'iview/dist/styles/iview.css'
import '../../../my-theme/index.less';//覆盖的样式
import '@/assets/css/base.less';
import '@/assets/css/common.less';
import '@/assets/orderManage/orderManage.less';//工单管理-工单录入和工单查询
//新的图标的样式
import '@/assets/icon/iconfont/iconfont.css'


Vue.component('AutoComplete',iview.AutoComplete);
Vue.component('Modal',iview.Modal);
Vue.component('Tree',iview.Tree);
Vue.component('Button',iview.Button);
Vue.component('Icon',iview.Icon);
Vue.component('Alert',iview.Alert);
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
