import { requestHttpMethods } from '@/functions/function'

/**
 * 总部撤销罚款
 */
class CancelFine {
    /**
     * 查询表单，分页
     * @param {Object} param {
            PageNo: 1,
            PageSize: 20,
            Data：自定义的查询条件
        }
     */
    GetCancelFineList(param) {
        const url = 'Api/WorkOrderFine/GetCancelFineList'
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
    /**
     * 撤销罚款
     * @param {Object} param  {IdList:选中的工单ID,Remark:备注,PunishAmount:修改金额}
     */
    UpdateFineAmount(param) {
        const url = 'Api/WorkOrderFine/UpdateFineAmount'
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
    /**
     * 
     * @param {Object} param  {IdList:选中的工单ID,RevokedReason:撤销原因}
     */
    Reovked(param) {
        const url = 'Api/WorkOrderFine/CancelFine'
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
export { CancelFine };