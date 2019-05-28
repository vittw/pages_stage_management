/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */

import BaseManager from '@/api/BaseManager/BaseManager'
import { ReviewList } from '@/api/dataCenter/ReviewList'

class ReviewListManager extends BaseManager {
    constructor() {
        super();
    }
    data() {
        var $this = this;
        let data = {
            SearchFrom: {
                v_Model: {
                    FineType: [{}, {}, {}]
                },
                CodesType: "BillCode",
                Codes: "",
                FineTime: [
                    `${new Date().toLocaleDateString()} 00:00:00`,
                    `${new Date().toLocaleDateString()} 23:59:59`
                ],
                SiteCode: "",
                ReviewState: "-1",
                get FirstFineTypeId() {
                    if (this.v_Model.FineType[0]) {
                        return this.v_Model.FineType[0].value;
                    }
                    return null;
                },
                get SecondFineTypeId() {
                    if (this.v_Model.FineType[1]) {
                        return this.v_Model.FineType[1].value;
                    }
                    return null;
                },
                get ThreeFineTypeId() {
                    if (this.v_Model.FineType[2]) {
                        return this.v_Model.FineType[2].value;
                    }
                    return null;
                }
            },
            columns: [
                { type: 'selection', fixed: 'left', align: 'center', width: 60 }
                , {
                    title: "序号", key: "rn", align: 'center', width: 70, fixed: 'left', render: (h, params) => {
                        return h('span', params.index + ($this.$vue.Table.PageNo - 1) * $this.$vue.Table.PageSize + 1);
                    }
                }
                , { title: "运单编号", key: "billCode", align: 'center', width: 130 }
                , { title: "工单ID", key: "workOrderId", align: 'center', width: 180 }
                , { title: "被处罚网点", key: "punishSite", align: 'center', width: 130 }
                , { title: "罚款类型", align: 'center', slot: "punishType", width: 250 }
                , { title: "罚款金额", key: "punishAmount", align: 'center', width: 100 }
                , { title: "复核状态", key: "reviewStateDisplay", align: 'center', width: 100 }
                , { title: "复核详情", align: 'center', slot: "reviewDetaile", minWidth: 150 }
                , { title: "罚款时间", key: "fineTime", align: 'center', minWidth: 150 }
            ],
            Data: [],
            SelectSiteType: "All",
            Review: {
                state: false,
                ReviewState: "ok",
                SelectIds: []
            }
        };
        const result = Object.assign({}, { Table: this.GetPage }, data)
        return result;
    }
    GetListByPage() {
        var $this = this;
        let reviewList = new ReviewList();
        let params = Object.assign({}, this.$vue.Table, { Data: this.$vue.SearchFrom });
        $this.$vue.Table.loading = true;
        reviewList.GetCancelFineList(params).then(res => {
            if (res.success) {
                $this.$vue.$Message.success(res.msg);
                $this.$vue.Data = res.data;
                $this.$vue.Table.Total = res.rowCount
            } else {
                $this.$vue.$Notice.error({
                    title: '操作失败！',
                    desc: res.msg
                })
            }
            $this.$vue.Table.loading = false;
        })
    }
    ReviewOk() {
        var $this = this;
        let reviewList = new ReviewList();
        reviewList.ReviewOk({
            IdList: $this.$vue.Review.SelectIds,
            ReviewState: $this.$vue.Review.ReviewState
        }).then(res => {
            if (res.success) {
                $this.$vue.$Message.success(res.msg);
                $this.$vue.Review.state = false;
                $this.GetListByPage();
            } else {
                $this.$vue.$Notice.error({
                    title: '操作失败！',
                    desc: res.msg
                })
            }
        })
    }
}

export { ReviewListManager };
