/* eslint-disable no-unused-vars */

import SearchSite from "@/api/BaseManager/SearchSite";

/**
 * 公用方法
 */
class BaseManager {
    constructor() {

    }
    /**
     * 初始化Vue实例，请在Vue-created()中传入$vue=this
     * @param {Object} vue Vue实例
     */
    useVue($vue) {
        this.$vue = $vue;
    }
    /**
     * 查询当前网店以及下属承包区
     * @param {String} query 查询内容
     */
    GetSubordinateSite(query) {
        if (!query || query.indexOf("|") > -1) {
            return;
        }
        let searchSite = new SearchSite()
        var $vue = this.$vue;
        $vue.searchSiteList.loading = true;
        searchSite.GetSubordinateSite({ key: query }).then((res) => {
            if (query !== '') {
                $vue.searchSiteList.loading = false;
                if (res && res.success) {
                    $vue.searchSiteList.options = res.data
                } else {
                    $vue.searchSiteList.options = []
                }
            } else {
                $vue.searchSiteList.options = []
            }
        })
    }
    /**
     * 表格自适应高度
     */
    tableResize() {
        var $vue = this.$vue;
        $vue.$nextTick(() => {
            $vue.Table.Hight = $vue.$el.getElementsByClassName('table')[0].clientHeight
        })
    }
    /**
     * 返回公用的分页变量
     * @return {Object} Default {
            currentPage: 1,
            pageSize: 20,
        }
     */
    get GetPage() {
        return {
            Hight: 300,
            PageNo: 1,
            PageSize: 20,
            Total: 0,
            loading: false
        }
    }
    /**
     * 返回模糊匹配网点配置
     * @returns {Object} {
                loading: false,
                options: []
        }
     */
    get GetSearchSite() {
        return {
            loading: false,
            options: []
        }
    }

    
}
export default BaseManager;