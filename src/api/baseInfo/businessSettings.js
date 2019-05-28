/* eslint-disable no-unused-vars */
import {
  requestHttpMethods
} from '@/functions/function'


//获取工单业务权限配置
export function getBusinessConfig(params) {
  const url = 'Api/TypeConfig/GetTypeConfig'
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

//根据工单id获取工单业务权限详情
export function getBusinessConfigById(params) {
  const url = 'Api/TypeConfig/GetTypeConfigById'
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

//添加工单业务权限
export function addBusinessConfig(params) {
  const url = 'Api/TypeConfig/AddTypeConfig'
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

//编辑工单业务权限
export function editBusinessConfig(params) {
  const url = 'Api/TypeConfig/UpdateTypeConfig'
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
 * 
 * @param {object} option  参数
 * @param {String} option.id  要禁用的ID
 * @param {Number} option.deletionStateCode 状态
 */
export function DeleteById({ id, deletionStateCode }) {
  const url = '/api/TypeConfig/UpdateTypeConfigState'
  return requestHttpMethods(
    url, {
      id: id,
      deletionStateCode: deletionStateCode
    },
    'post'
  ).then((res) => {
    return new Promise(resolve => {
      resolve(res)
    })
  })
}
