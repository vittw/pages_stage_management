/* eslint-disable no-console */
import {
  requestHttpMethods
} from '@/functions/function'

/**
 * 获取所有工单类型-- 查询列表用
 * @param {} params 
 */
export function getTypesData(params) {
  //const url = 'Api/Type/GetDataType'
  const url = 'Api/Type/GetPageType'
  // eslint-disable-next-line no-console
  console.log(url, params);
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
 * 获取工单类型
 * @returns 所有的工单类型(包含禁用和启用)
 */
export function getAllType() {
  //const url = 'Api/Type/GetTypesCache'
  const url = 'Api/Type/GetAllType'
  // eslint-disable-next-line no-console
  return requestHttpMethods(
    url,
    '',
    'post'
  )
    .then((res) => {
      return new Promise(resolve => {
        resolve(res)
      })
    })
}

/**
 * 获取工单类型
 * @returns 所有启用的工单类型
 */
export function GetEnableType() {
  const url = 'Api/type/GetEnableType'
  // eslint-disable-next-line no-console
  return requestHttpMethods(
    url,
    '',
    'post'
  ).then((res) => {
    return new Promise(resolve => {
      resolve(res)
    })
  })
}

/**
 * 根据工单来源， 获取工单数据类型
 * @param {} params 
 * @returns 该来源下面的所有工单类型(详见工单业务配置界面)
 */
export function GetTypeByDataSource(params) {
  //const url = 'Api/Type/GetTypesCache'
  const url = 'Api/Type/GetTypeByDataSource'
  console.log(url, params);
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

//获取工单一级类型
export function getFirstType(params) {
  const url = 'Api/Type/GetFirstTypeCache'
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

//获取工单二级类型
export function getSecondType(params) {
  const url = 'Api/Type/GetSecondTypeCache'
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

//获取工单三级类型
export function getThirdType(params) {
  const url = 'Api/Type/GetThreeTypeCache'
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

//新增一级工单类型
export function addFirstType(params) {
  const url = 'Api/Type/AddFirstType'
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

//新增二级工单类型
export function addSecondType(params) {
  const url = 'Api/Type/AddSecondType'
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

//新增三级工单类型
export function addThirdType(params) {
  const url = 'Api/Type/AddThreeType'
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

//修改一级工单类型
export function editFirstType(params) {
  const url = 'Api/Type/EditFirstType'
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

//修改二级工单类型
export function editSecondType(params) {
  const url = 'Api/Type/EditSecondType'
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

//修改三级工单类型
export function editThirdType(params) {
  const url = 'Api/Type/EditThreeType'
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