/* eslint-disable no-unused-vars */

import BaseManager from '@/api/BaseManager/BaseManager.js'
import AssessmentExport from '@/api/dataCenter/AssessmentReport';

/**
 * 工单考核报表Manager
 * @extends BaseManager
 */
class AssessmentReportManager extends BaseManager {
    constructor() {
        super();
    }
    /**
     * 默认VueData数据
     */
    data() {
        const data = {
            searchFrom: {
                SiteName: "",
                SiteCode: "",
                FineStatus: "-1",
                SearchType: "Site",
                FineTime: [
                    `${new Date().toLocaleDateString()} 00:00:00`,
                    `${new Date().toLocaleDateString()} 23:59:59`
                ]
            },
            columns: [
                { title: "序号", key: "rn", align: 'center', width: 70, fixed: 'left' }
                , { title: "网点名称", key: "sitename", align: 'center', minWidth: 100, maxWidth: 150, fixed: 'left', }
                , { title: "总罚款数量", key: "sumcount", align: 'center', minWidth: 100, Width: 100, fixed: 'right' }
                , { title: "总罚款金额", key: "sumamount", align: 'center', minWidth: 100, Width: 100, fixed: 'right' }
            ],
            Data: [],
            Detaile: {
                State: false,
                Title: "",
                SecondFineType: "",
                SecondFineTypeId: "",
                SiteCode: "",
                searchFrom: {

                }
            },
            SelectSiteType: "All"
        };
        const result = Object.assign({}, { Table: this.GetPage }, { searchSiteList: this.GetSearchSite }, data)
        return result;
    }
    /**
     * 表单查询
     */
    GetListByPage() {
        var $this = this;
        this.$vue.Table.loading = true;
        this.$vue.Detaile.searchFrom = this.$vue.searchFrom;//每一次查询之前记录查询条件，需要后期传入详情页使用
        const params = Object.assign({}, this.$vue.Table, { Data: this.$vue.searchFrom });
        var ass = new AssessmentExport();
        ass.GetAssessmentReportByPage(params).then(res => {
            if (res.success) {
                $this.$vue.$Message.success(res.msg);
                this.$vue.Data = res.data;
                this.$vue.Table.Total = res.rowCount
            } else {
                $this.$vue.$Message.error(res.msg);
            }
            this.$vue.Table.loading = false;
        });

    }

    /**
     * 跳转详情
     * @param {Object} params 
     */
    goDetail(params) {
        this.$vue.Detaile.Title = `${params.row.sitename}-${params.column.name}`;
        this.$vue.Detaile.SecondFineType = `${params.column.name}`;
        this.$vue.Detaile.SecondFineTypeId = `${params.column.key}`.replace("数量", '').toLocaleLowerCase();
        this.$vue.Detaile.State = true;
        this.$vue.Detaile.SiteCode = params.row.sitecode;
    }

    /**
     * 增加表头
     */
    AddColums() {
        let $this = this;
        var ass = new AssessmentExport();
        ass.GetAllAssessmentType().then(res => {
            if (res.data && res.data.length > 0) {
                let tableTitle = [...res.data];
                let tableTitleFirst = tableTitle.filter(t => t.parentId == "");
                var columsPush = [];
                tableTitleFirst.forEach((v, i) => {
                    //二级插入
                    var secondTilte = tableTitle.filter(t => t.parentId == v.id);
                    const column = { title: v.name, align: 'center' };
                    if (secondTilte && secondTilte.length > 0) {
                        const columnChilren = [];
                        secondTilte.forEach((v, i) => {
                            columnChilren.push({
                                title: v.name, align: 'center'
                                , children: [
                                    {
                                        title: `数量`, name: v.name, key: `数量${v.id.toLocaleUpperCase()}`, minWidth: 80, align: 'center', render: (h, params, c, d) => {
                                            return h("div", [
                                                h(
                                                    "span",
                                                    {
                                                        class: "clickNum",
                                                        style: {
                                                            color: '#0B9AFC'
                                                        },
                                                        on: {
                                                            click: () => {
                                                                $this.goDetail(params);
                                                            }
                                                        }
                                                    },
                                                    params.row[`数量${v.id.toLocaleUpperCase()}`]
                                                )
                                            ]);
                                        }
                                    }
                                    , { title: `金额`, key: `金额${v.id.toLocaleUpperCase()}`, minWidth: 80, align: 'center' }
                                ]
                            })
                        })
                        column.children = columnChilren;
                    }
                    //一级插入
                    columsPush.push(column)
                })
                $this.$vue.columns = [$this.$vue.columns[0], $this.$vue.columns[1], ...columsPush, $this.$vue.columns[2], $this.$vue.columns[3]];
            }
        });
    }
}

class AssessmentReportDetaileManager extends BaseManager {
    constructor() {
        super();
    }
    data() {
        var $this = this;
        const data = {
            SerarchFrom: {
                Codes: "",
                CodesType: "BillCode"
            },
            columns: [
                {
                    title: "序号", key: "rn", align: 'center', width: 70, fixed: 'left', render: (h, params) => {
                        return h('span', params.index + ($this.$vue.Table.PageNo - 1) * $this.$vue.Table.PageSize + 1);
                    }
                }
                , { title: "运单编号", key: "billCode", align: 'center', minWidth: 150, fixed: 'left', }
                , { title: "工单ID", key: "workOrderId", align: 'center', minWidth: 200, }
                , { title: "被处罚网点", key: "punishSite", align: 'center', minWidth: 100, }
                , { title: "处罚详情", align: 'left', minWidth: 300, slot: "FineDetaile" }
                , { title: "罚款状态", key: "fineStateDisplay", align: 'center', minWidth: 100 }
                , { title: "调查经过", key: "surveyAfter", align: 'center', minWidth: 100, }
                , { title: "罚款方", align: 'left', minWidth: 150, slot: "FineInfo" }
                , { title: "受款方", align: 'left', minWidth: 150, slot: "Recipient" }
                , { title: "工单类型", align: 'center', minWidth: 250, slot: "WOType" }
                , { title: "撤销详情", align: 'center', minWidth: 250, slot: "CancelDetaile" }
                , {
                    title: "操作", align: 'center', minWidth: 80, maxWidth: 150, slot: "action", fixed: 'right', render(h, params) {
                        return h('div', [
                            h("Button", {
                                props: {
                                    type: "primary",
                                    size: "small",
                                    disabled: Boolean(!params.row.isShowReview)
                                },
                                style: {
                                    marginRight: "5px"
                                },
                                on: {
                                    click: () => {
                                        $this.ReviewShow(params.row.id);
                                    }
                                }
                            }, "复核"
                            )]
                        );
                    },
                }
            ],
            Data: [],
            Review: {
                ReviewShow: false,
                ReviewLoading: false,
                ReviewReason: "",
                id: ""

            }
        };
        const result = Object.assign({}, { Table: this.GetPage }, data)
        return result;
    }
    GetListByPage() {
        var $this = this;
        let params = Object.assign({}, this.$vue.Table,
            {
                Data: Object.assign({},
                    this.$vue.SerarchFrom,
                    this.$vue.ParentSerarchFrom,
                    { SecondFineType: this.$vue.SecondFineType },
                    { SecondFineTypeId: this.$vue.SecondFineTypeId },
                    { SiteCode: this.$vue.SiteCode }
                )
            }
        )
        let ass = new AssessmentExport();
        $this.$vue.Table.loading = true;
        ass.GetFineListByPage(params).then(res => {
            if (res.success) {
                $this.$vue.$Message.success(res.msg);
                $this.$vue.Data = res.data;
                $this.$vue.Table.Total = res.rowCount
            } else {
                $this.$vue.$Message.error(res.msg);
            }
            $this.$vue.Table.loading = false;
        })
    }
    /**
     * 复核操作
     * @param {String} workOrderId 工单ID
     */
    ReviewShow(id) {
        this.$vue.Review.id = id;
        this.$vue.Review.ReviewReason = "";
        this.$vue.Review.ReviewShow = true;
    }
    ReviewCancel() {
        this.$vue.Review.workOrderId = "";
        this.$vue.Review.ReviewReason = "";
        this.$vue.Review.ReviewShow = false;
    }
    ReviewOk() {
        var $this = this;
        let ass = new AssessmentExport();
        ass.ReviewWorkOrder(this.$vue.Review).then(res => {
            if (res.success) {
                $this.$vue.$Message.success(res.msg);
                //异步操作按钮禁用
                $this.$vue.Data.forEach((v, i, a) => {
                    if (v.id == $this.$vue.Review.id) {
                        a[i].isShowReview = false;
                    }
                })
                $this.$vue.Review.workOrderId = "";
                $this.$vue.Review.ReviewReason = "";
                $this.$vue.Review.ReviewShow = false;
            } else {
                $this.$vue.$Message.error(res.msg);
            }
        })
    }
}
export { AssessmentReportManager, AssessmentReportDetaileManager };
