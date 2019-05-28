import {
	requestHttpMethods,requestFile
} from '@/functions/function'
import { Promise } from 'q';


//上传文件接获得token
export function getToken(params) {
//	'upload/getAccessToken'
	const url='api/common/GetUploadFilesToken'
	return requestHttpMethods(
		url,
		params,
		'get'
	).then((res) => {
		return new Promise(resolve => {
			resolve(res)
		})
	})
}
//上传文件
export function upFiles(params) {
	const url='upload/file'
	return requestFile(
		url,
		params,
		'post'
	).then((res) => {
		return new Promise(resolve => {
			resolve(res)
		})
	})
}

//工单标准回复模版配置
export function getReply(params) {
	const url = 'Api/Reply/GetStandardReply'
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
//获取员工的基本信息
export function getBasicInfor(params) {
	const url = 'api/Common/GetUserByOrganizes'
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

export function getBasicInfor2(params) {
	const url = 'Api/Common/GetUserByOrganize'
	return requestHttpMethods(
		url, {
			params
		},
		'get'
	)
		.then((res) => {
			return new Promise(resolve => {
				resolve(res)
			})
		})

}

//工单处理页面批量处理
export function getProcReferral(params) {
	const url = 'Api/WorkOrder/WorkOrderDealMore'
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
//确定挂起
export function sureHang(params) {
	const url = 'Api/SleepState/Add'
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
//取消挂起
export function cancelHang(params) {
	const url = 'Api/SleepState/Update'
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
//获取分页处理的数据
export function getHandlePageData(params) {
	const url = 'Api/WorkOrder/GetPageProcessData'
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

/**
 * 根据工单ID查询工单处理信息-带附件
 * @param {Object} params
 * @param {String} params.id 工单ID
 */
export function getHandleIdData({ Id }) {
	//const url = 'Api/WorkOrder/GetDataById'
	const urls = ['Api/WorkOrder/GetDataById', "Api/Common/GetFilesById?workOrderId=" + Id]
	var promises = urls.map((v) => {
		return requestHttpMethods(
			v,
			{ Id: Id },
			'post'
		).then((res) => {
			return new Promise(resolve => {
				resolve(res)
			})
		})
	});
	return Promise.all(promises).then(res => {
		if (res && res.length == 2) {
			res = {
				success: res[1].success,
				msg: res[1].msg,
				data: Object.assign({}, res[0].data, { file: res[1].data })
			};
		}
		return new Promise(resolve => {
			resolve(res);
		})
	})
}
//查询工单处理日志记录
export function getLogs(params) {
	const url = 'Api/ProcLog/GetProLogList'
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
//查询工单处理 驿站结果查看
export function getYizhan(params) {
	const url = 'Api/YiZhan/GetYiZhanHistory'
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
export function GetHistory(params) {
	//	const url = 'Api/Common/GetOrderInfo'
	const url = 'Api/WorkOrder/GetHistoryByBillCode'
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
//首跟回复
export function getFirstReply(params) {
	const url = 'Api/WorkOrder/WorkOrderDealShouGen'
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
//工单处理接口    处理完成
export function getDealReply(params) {
	const url = 'Api/WorkOrder/WorkOrderDealReply'
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
//工单标准回复处理接口  
export function getOrdReply(params) {
	const url = 'Api/WorkOrder/WorkOrderDealBZReply'
	return requestHttpMethods(
		url,
		params,
		'post'
	).then((res) => {
		return new Promise(resolve => {
			resolve(res)
		})
	})
}
//工单处理页面工单打回按钮
export function getComeBack(params) {
	const url = 'Api/WorkOrder/WorkOrderProcRepulse'
	return requestHttpMethods(
		url,
		params,
		'post'
	).then((res) => {
		return new Promise(resolve => {
			resolve(res)
		})
	})
}
//工单处理页面转交按钮
export function orderTurn(params) {
	const url = 'Api/WorkOrder/WorkOrderProcReferral'
	return requestHttpMethods(
		url,
		params,
		'post'
	).then((res) => {
		return new Promise(resolve => {
			resolve(res)
		})
	})
}


/**
 * 申请延迟
 * @param {Object} param 参数
 * @param {String} param.id ID
 * @param {String} param.ReqDescription 申请延迟原因
 * 
 */
export function delayById({ id, ReqDescription }) {
	const url = 'Api/workorder/ApplyDealy'
	return requestHttpMethods(
		url,
		{ id, ReqDescription },
		'post'
	).then((res) => {
		return new Promise(resolve => {
			resolve(res)
		})
	})
}