import {
	requestHttpMethods
} from '@/functions/function'

//分页获取工单信息
export function getQueryData(params) {
	const url = 'Api/WorkOrder/GetPageQueryData'
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
//根据ID获取工单信息详情
export function getIdQueryDetail(params) {
	var urls = ["Api/WorkOrder/GetPageQueryDetails?workOrderId=" + params, "Api/Common/GetFilesById?workOrderId=" + params];
	var promises = urls.map((v) => {
		return requestHttpMethods(
			v,
			params,
			'post'
		).then((res) => {
			return new Promise(resolve => {
				resolve(res)
			})
		})
	})
	return Promise.all(promises)
		.then((results) => {
			return new Promise(resolve => {
				resolve(results)
			})
		});
}
//工单催办
export function getUrge(params) {
	const url = 'Api/WorkOrder/Urge'
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
//获取所属省区
export function getProvincial(params) {
	const url = 'Api/Common/GetArea'
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