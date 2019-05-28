
import { requestHttpMethods } from '@/functions/function'

/**
 * 
 */
class FineType {
    constructor() {

    }
    /**
     * 返回所有的罚款类型
     */
    async  GetAllFineType() {
        const url = 'Api/Common/GetAllAssessmentType';
        return requestHttpMethods(
            url,
            {},
            'get'
        ).then((res) => {
            return new Promise(resolve => {
                resolve(res)
            })
        })
    }
}
export { FineType };