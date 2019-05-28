import { requestHttpMethods } from '@/functions/function'

//工单处理界面接口
export function GetMonitorPageList(params) {
	const url = 'Api/WorkOrderMonitor/GetMonitorPageList'
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

//工单处理界面接口
export function GetSendSiteMonitorPageList(params) {
	const url = 'Api/WorkOrderMonitor/GetSendSiteMonitorPageList'
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

//工单处理界面接口
export function GetMonitorDetail(params) {
	const url = 'Api/WorkOrderMonitor/GetMonitorDetail'
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
