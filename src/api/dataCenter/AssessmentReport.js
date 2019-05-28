import { requestHttpMethods } from '@/functions/function'


/**
 * 工单考核报表，相关数据获取方法
 */
class AssessmentExport {
    /**
     * 获取所有的未删除的考核类型
     */
    GetAllAssessmentType(param) {
        const url = 'Api/WorkOrderFine/GetTableTitle'
        return requestHttpMethods(
            url,
            param,
            'get'
        ).then((res) => {
            return new Promise(resolve => {
                resolve(res)
            })
        })
    }
    /**
     * 分页获取工单考核报表
     * @param {Object} params 
     */
    GetAssessmentReportByPage(params) {
        const url = 'Api/WorkOrderFine/GetAssessmentReportByPage'
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
     * 获取工单考核报表详情
     * @param {Object} params 
     */
    GetFineListByPage(params) {
        const url = 'Api/WorkOrderFine/GetFineListByPage'
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
     * 申请复核
     * @param {Object} params 
     */
    ReviewWorkOrder(params) {
        const url = 'Api/WorkOrderFine/ReviewWorkOrder'
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
}

export default AssessmentExport