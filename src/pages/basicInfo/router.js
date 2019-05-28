// import Vue from 'vue'
// import Router from 'vue-router'
// import Home from './views/Home.vue'
import DictionarySettings from './views/dictionarySettings'
import BusinessSettings from './views/businessSettings'
import SourceSettings from './views/sourceSettings'
import ReplySettings from './views/replySettings'
import TypeSettings from './views/typeSettings'
import AssignSettings from './views/assignSettings'

Vue.use(VueRouter)

export default new VueRouter({
	// mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    //数据字典
    {
      path: '/dictionary',
      component: DictionarySettings
    },
    //业务配置
    {
      path: '/business',
      component: BusinessSettings
    },
    //来源配置
    {
      path: '/source',
      component: SourceSettings
    },
    //服务标准用语
    {
      path: '/reply',
      component: ReplySettings
    },
    //类型配置
    {
      path: '/type',
      component: TypeSettings
    },
    //分配配置
    {
      path: '/assign',
      component: AssignSettings
    },
    {
      path: '/index',
      beforeEnter() {
        window.location = "/"
      }
    },
    {
      path: '/dataCenter',
      beforeEnter() {
        window.location = "/dataCenter.html"
      }
    }
  ]
})
