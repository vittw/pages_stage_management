import { requestHttpMethods } from '@/functions/function'


//获取字典数据
export function getDictionary(params) {
  const url = 'Api/Dictionary/GetDictionary'
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

//获取父节点数据
export function getParentName(params) {
  const url = 'Api/Dictionary/GetParentNameCache'
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

//新增字典数据
export function addDictionary(params) {
  const url = 'Api/Dictionary/Add'
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

//新增字典数据
export function editDictionary(params) {
  const url = 'Api/Dictionary/Edit'
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
