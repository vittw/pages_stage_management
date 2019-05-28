// import Vue from 'vue'
// import Vuex from 'vuex'
import { requestHttpMethods } from '@/functions/function.js'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {

		querySelected: [],
		orderType: [],
		orderSource: [],//工单来源
		handleDetail: [],//处理详情

		companyCode: '',
		employeeCode: '',
		//总部
		//		companyCode:'2155',
		//		employeeCode:'2155500478',
		//网点
		// companyCode: '311111',
		// employeeCode: '311111',

	},
	mutations: {
		//记录工单查询页面中table中的选中项
		saveQuerySelected(state, obj) {
			//		alert(JSON.stringify(obj));
			state.querySelected = obj;
		},
		//保存红单类型
		saveOrderType(state, obj) {
			state.orderType = obj;
		},
		//保存工单来源
		saveOrderSource(state, obj) {
			state.orderSource = obj;
			//		console.log('工单来源',state.orderSource)
		},
		//保存工单处理中的 详情的数据
		saveHandleDetail(state, obj) {
			state.handleDetail = obj
		},
		//获取登录信息的cookie
		setCompanyCode(state, obj) {
			state.companyCode = obj
		},
		setEmployeeCode(state, obj) {
			state.employeeCode = obj
		},

	},
	actions: {

	}
})
