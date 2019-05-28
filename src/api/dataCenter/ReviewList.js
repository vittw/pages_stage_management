import { requestHttpMethods } from '@/functions/function'

/**
 * 总部撤销罚款
 */
class ReviewList {
    /**
     * 查询表单，分页
     * @param {Object} param {
            PageNo: 1,
            PageSize: 20,
            Data：自定义的查询条件
        }
     */
    GetCancelFineList(param) {
        const url = 'Api/WorkOrderFine/GetReviewListByPage'
        return requestHttpMethods(
            url,
            param,
            'post'
        ).then((res) => {
            return new Promise(resolve => {
                resolve(res)
            })
        })
    }
    ReviewOk(param) {
        const url = 'Api/WorkOrderFine/ReviewOk'
        return requestHttpMethods(
            url,
            param,
            'post'
        ).then((res) => {
            return new Promise(resolve => {
                resolve(res)
            })
        })
    }
}
export { ReviewList };