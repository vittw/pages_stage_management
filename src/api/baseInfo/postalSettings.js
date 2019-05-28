import { requestHttpMethods } from '@/functions/function'


//获取邮政处理配置数据
export function getPostalData(params) {
  const url = 'Api/PostalAppealArea/GetPostalAppealArea'
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

//邮政处理新增
export function addPostalData(params) {
  const url = 'Api/PostalAppealArea/Add'
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

//邮政处理编辑
export function editPostalData(params) {
  const url = 'Api/PostalAppealArea/Edit'
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

//获取全部省份
export function getProvince(params) {
  const url = 'Api/Common/GetProvince'
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
