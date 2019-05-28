import { requestHttpMethods } from '@/functions/function'


//获取所有人处理数据
export function getAssignDataAll(params) {
  const url = 'Api/Allot/GetAllot'
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

//获取专家坐席处理数据
export function getAssignDataExpert(params) {
  const url = 'Api/Allot/GetExpertSeats'
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

//获取默认处理人处理数据
export function getAssignDataDefault(params) {
  const url = 'Api/Allot/GetDefault'
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

//修改网点默认处理人数据
export function editAssignDefault(params) {
  const url = 'Api/Allot/EditDefault'
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

//获取员工信息
export function getUserByOrganize(params) {
  const url = 'Api/Common/GetUserByOrganize'
  return requestHttpMethods(
    url,
    { params },
    'get'
  )
    .then((res) => {
      return new Promise(resolve => {
        resolve(res)
      })
    })
}


//获取网点信息
export function getSiteByKey(params) {
  const url = 'Api/Common/GetAllSiteByKey'
  return requestHttpMethods(
    url,
    { params },
    'get'
  )
    .then((res) => {
      return new Promise(resolve => {
        resolve(res)
      })
    })
}

//新增普通处理人OR专家坐席
export function addAssignOrExpert(params) {
  const url = 'Api/Allot/AddAllotOrExpertSeats'
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

//修改普通处理人数据
export function editAssignAllot(params) {
  const url = 'Api/Allot/EditAllot'
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

//修改专家座席数据
export function editAssignExpert(params) {
  const url = 'Api/Allot/EditExpertSeats'
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

//判断是否可以分配
export function getAssignState(params) {
  const url = 'Api/Allot/AllotState'
  return requestHttpMethods(
    url,
    { params },
    'get'
  )
    .then((res) => {
      return new Promise(resolve => {
        resolve(res)
      })
    })
}

/**
 * 根据工单来源和工单类型，删除普通处理人
 */
export function DeleteAllotBySourcecType(params) {
  const url = 'Api/Allot/DeleteAllot'
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
 * 根据工单来源和工单类型，删除默认处理人
 */
export function DeleteDefaultBySourcecType(params) {
  const url = 'Api/Allot/DeleteDefault'
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
 * 根据工单来源和工单类型，删除默认处理人
 */
export function DeleteExpertSeatsBySourcecType(params) {
  const url = 'Api/Allot/DeleteExpertSeats'
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


