import { requestHttpMethods } from '@/functions/function'

//根据关键字请求省市区
export function getRegions(params) {
	const url = 'Api/Common/GetFullArea'
	return requestHttpMethods(
			url,
			{params},
			'get'
		)
		.then((res) => {
			return new Promise(resolve => {
				resolve(res)
			})
		})
}
//获取网点信息
export function getAllSite (params){
	const url = 'Api/Common/GetAllSiteByKey'
	return requestHttpMethods(
		url,
		{params},
		'get'
	)
	.then((res) => {
		return new Promise(resolve => {
			resolve(res)
		})
	})
}

//获取有工单业务权限的网点信息
export function GetPowerSiteByEs (params){
	const url = 'Api/Common/GetPowerSiteByEs'
	return requestHttpMethods(
			url,
			{params},
			'get'
		)
		.then((res) => {
			return new Promise(resolve => {
				resolve(res)
			})
		})
}


//根据单号获取运单信息
export function getOrderInforByBillCode(params){
	const url = 'Api/Common/GetOrderInfo'
	return requestHttpMethods(
			url,
			params,
			'post'
		)
		.then((res) => {
			return new Promise(resolve => {
				resolve(res)
			})
		})
}

//根据手机号获取运单信息
export function GetOrderInfoByPhone(params){
	const url = 'Api/Common/GetOrderInfoByPhone'
	return requestHttpMethods(
			url,
			params,
			'post'
		)
		.then((res) => {
			return new Promise(resolve => {
				resolve(res)
			})
		})
}
//查询工单物流轨迹记录
export function getTrail(params) {
	const url = 'Api/Common/GetTrackMessageByBillCode'
	return requestHttpMethods(
			url,
			params,
			'post'
		)
		.then((res) => {
			return new Promise(resolve => {
				resolve(res)
			})
		})
}
//创建工单
export function addCallCenterOrder(params){
	const url='api/WorkOrder/CallCenterAdd'
	return requestHttpMethods(
			url,
			params,
			'post'
		)
		.then((res) => {
			return new Promise(resolve => {
				resolve(res)
			})
		})
}

//获取三地信息
export function getSdCallInfo(params){
	const url='api/CallCenter/GetSdUserInfo'
	return requestHttpMethods(
			url,
			params,
			'post'
		)
		.then((res) => {
			return new Promise(resolve => {
				resolve(res)
			})
		})
}

//查询工单处理 留言信息记录
export function getMessages(params) {
	const url = 'Api/Common/GetMessageByBillCode'
	return requestHttpMethods(
			url,
			params,
			'post'
		)
		.then((res) => {
			return new Promise(resolve => {
				resolve(res)
			})
		})
}

//获取工单的历史处理记录
export function getInfor(params) {
	const url='Api/WorkOrder/GetHistoryByBillCode'
	return requestHttpMethods(
			url,
			params,
			'post'
		)
		.then((res) => {
			return new Promise(resolve => {
				resolve(res)
			})
		})
}
