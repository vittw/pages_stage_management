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

//获取网点信息
export function getAllSiteByHqPro (params){
	const url = 'Api/Common/getAllSiteByHqPro'
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
export function GetSiteByCategoryCode (params){
	const url = 'Api/Common/GetSiteByCategoryCode'
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
export function getorderInfor(params){
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
//创建工单
export function postAddOrder(params){
	const url='api/WorkOrder/Add'
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

// //获取工单类型中的一级类型
// export function getorderType(params){
// 	const url = 'Api/Type/GetFirstTypeCache'
// 	return requestHttpMethods(
// 			url,
// 			params,
// 			'post'
// 		)
// 		.then((res) => {
// 			return new Promise(resolve => {
// 				resolve(res)
// 			})
// 		})
// }
// //根据一级类型获取二级类型
// export function getSecondTypeCache(params){
// 	const url = 'Api/Type/GetSecondTypeCache'
// 	return requestHttpMethods(
// 			url,
// 			params,
// 			'post'
// 		)
// 		.then((res) => {
// 			return new Promise(resolve => {
// 				resolve(res)
// 			})
// 		})
// }
// //根据二级类型获取三级类型
// export function getThreeTypeCache(params){
// 	const url = 'Api/Type/GetThreeTypeCache'
// 	return requestHttpMethods(
// 			url,
// 			params,
// 			'post'
// 		)
// 		.then((res) => {
// 			return new Promise(resolve => {
// 				resolve(res)
// 			})
// 		})
// }
//获取工单来源
export function getorderSource(params){
	const url = 'Api/DataSource/GetDataSourceNameCache'
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


