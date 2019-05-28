// import Vue from 'vue'
// import Router from 'vue-router'
import orderInput from './views/orderInput/HomeInput.vue' //工单录入
import orderQuery from './views/orderQuery/orderQuery.vue' //工单查询
import queryInter from './views/orderQuery/integrated.vue' //查询界面中的一体化查询

import orderHandle from './views/orderHandle/handle.vue' //工单处理
import orderHandleDetail from './views/orderHandle/handleTableDetail.vue' //处理详情

import Integrated from '@/components/integrated/integrated'; //一体化查询

import Newbie from './views/newbieStation/newbie.vue'; //菜鸟驿站

//测试../dataCenter/views/CancelFine/CancelFine
//import Test from './views/test.vue'

Vue.use(VueRouter)

export default new VueRouter({
	//mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/input',
			name: 'orderInput',
			component: orderInput
		},
		{
			path: '/query',
			name: 'orderQuery',
			component: orderQuery
		},
		{
			path: '/queryInter',
			name: 'queryInter',
			component: queryInter
		},
		{
			path: '/handle',
			name: 'orderHandle',
			component: orderHandle
		},
		{
			path: '/manage/handleDetail',
			name: 'orderHandleDetail',
			component: orderHandleDetail
		},
		{
			path: '/newbie',
			name: 'Newbie',
			component: Newbie
		},
		{
			path: '/basicInfo',
			//beforeEnter(to, from, next)
			beforeEnter() {
				window.location = "/basicInfo.html"
			}
		},
		{
			path: '/dataCenter',
			beforeEnter() {
				window.location = "/dataCenter.html"
			}
		},
	]
})
