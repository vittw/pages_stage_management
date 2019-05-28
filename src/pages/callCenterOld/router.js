// import Vue from 'vue'
// import Router from 'vue-router'
import CallCenter from './views/callCenter'

Vue.use(VueRouter)

export default new VueRouter({
//mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/call',
      component:CallCenter
    },
    // {
    // 	path:'/test',
    // 	name:'Test',
    // 	component:Test
    // },
  ]
})
