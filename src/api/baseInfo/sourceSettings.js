import { requestHttpMethods } from '@/functions/function'


//获取工单来源数据
export function getOrderSource(params) {
  const url = 'Api/DataSource/GetDataSource'
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


//获取工单来源名称下拉列表
export function getOrderSourceNameList(params) {
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


//新增工单来源
export function addSourceData(params) {
  const url = 'Api/DataSource/Add'
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


//修改工单来源
export function editSourceData(params) {
  const url = 'Api/DataSource/Edit'
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
