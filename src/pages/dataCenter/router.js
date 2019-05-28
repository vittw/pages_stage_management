// import Vue from 'vue'
// import Router from 'vue-router'
import OrderMonitor from './views/orderMonitor'
import AssessmentReport from "./views/AssessmentReport";
import CancelFine from './views/CancelFine/CancelFine';
import ReviewList from './views/ReviewList/ReviewList';

Vue.use(VueRouter)

export default new VueRouter({
  //mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/orderMonitor',
      component: OrderMonitor
    },
    {
      path: "/AssessmentReport",
      component: AssessmentReport
    },
		{
			path: '/cancelFine',
			name: 'CancelFine',
			component: CancelFine
    },
    {
      path: '/reviewList',
      name: 'ReviewList',
      component: ReviewList
    },
    {
      path: '/index',
      beforeEnter() {
        window.location = "/"
      }
    },
    {
      path: '/basicInfo',
      beforeEnter() {
        window.location = "/basicInfo.html"
      }
    }
  ]
})
