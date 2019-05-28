/* eslint-disable no-unused-vars */
import { requestHttpMethods } from '@/functions/function'
/**
 * 查询网点
 */
class SearchSite {
    constructor() {

    }
    /**
     * 查询所有网点
     * @param {Object} params 请求参数
     * 
     */
    async GetAllSite(params) {
        const url = 'Api/Common/GetAllSiteByKey';
        return requestHttpMethods(
            url,
            { params },
            'get'
        ).then((res) => {
            return new Promise(resolve => {
                resolve(res)
            })
        })
    }
    /**
     * 查询当前网点以及下属承包区
     * @param {String} param 请求参数
     */
    async GetSubordinateSite(params) {
        const url = 'Api/Common/GetAllSiteByKey';
        return requestHttpMethods(
            url,
            { params: params },
            'get'
        ).then((res) => {
            return new Promise(resolve => {
                resolve(res)
            })
        })
    }
}
export default SearchSite;
