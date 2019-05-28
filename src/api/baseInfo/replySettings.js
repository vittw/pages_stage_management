import { requestHttpMethods } from '@/functions/function'

//获取数据字典
export function getDictionary(params){
	const url = 'Api/Dictionary/GetNamesCache'
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
//获取工单标准回复配置
export function getReplyConfig(params) {
  const url = 'Api/Reply/GetReply'
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

//添加工单标准回复
export function addReplyConfig(params) {
  const url = 'Api/Reply/AddReply'
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

//删除工单标准回复
export function deleteReplyConfig(params) {
  const url = 'Api/Reply/DeleteReply'
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

//根据工单ID查询工单详细信息
export function getReplyConfigById(params) {
  const url = 'Api/Reply/GetReplyById'
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

//编辑工单标准回复
export function editReplyConfig(params) {
  const url = 'Api/Reply/UpdateReply'
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

//获取参数配置列表
export function getReplyConfigParams(params) {
  const url = 'Api/ReplyConfig/Get'
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

//添加参数配置
export function addReplyConfigParams(params) {
  const url = 'Api/ReplyConfig/Add'
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

//添加参数配置
export function deleteReplyConfigParams(params) {
  const url = 'Api/ReplyConfig/Delete'
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
