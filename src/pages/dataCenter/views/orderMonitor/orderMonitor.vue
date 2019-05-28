<template>
  <div class="source_warper warper">
    <Header>
      <span class="colorBlock"></span>
      <span>客服 > 数据中心 > 工单监控</span>
      <template slot="rightWarper">
        <Button type="primary" @click="handleSearch">查询</Button>
      </template>
    </Header>
    <Section>
      <template slot="form">
        <template v-if="gridType==0">
          <Form inline label-position="left">
            <FormItem label="网点名称" :label-width="60">
              <Select
                filterable
                remote
                clearable
                placeholder="请输入网点名称"
                v-model="searchCriteria.siteCode"
                :remote-method="handleSearchSite"
                :loading="searchSite.loading"
              >
                <Option
                  v-for="(option, index) in searchSite.options"
                  :value="option.Key"
                  :key="index"
                >{{option.Value}}</Option>
              </Select>
            </FormItem>
            <FormItem label="来源名称" :label-width="60">
              <Select v-model="searchCriteria.dateSourceId" placeholder="请选择来源名称" clearable>
                <Option
                  v-if="nameList && nameList.length != 0"
                  v-for="item in nameList"
                  :value="item.dataSourceId"
                  :key="item.dataSourceId"
                >{{ item.dataSourceName }}</Option>
              </Select>
            </FormItem>
            <FormItem label="查询时间" :label-width="60">
              <DatePicker
                v-model="searchCriteria.time"
                type="datetimerange"
                placeholder="请选择查询时间"
                style="width: 300px"
              ></DatePicker>
            </FormItem>
          </Form>
        </template>
        <template v-else>
          <div class="form_warper">
            <div class="code_warper">
              <Select placeholder="请选择来源名称" v-model="searchCriteriaSend.dateType">
                <Option :value="1">运单号</Option>
                <Option :value="2">工单号</Option>
              </Select>
              <Input
                v-model="searchCriteriaSend.ids"
                type="textarea"
                placeholder="运单号/工单ID查询"
                :autosize="{minRows: 1.5,maxRows: 1.5}"
                clearable
              ></Input>
            </div>
            <div class="other_form">
              <Form inline>
                <FormItem class="creatTime">
                  <Select placeholder="创建时间" v-model="searchCriteriaSend.dataType">
                    <Option :value="1">创建时间</Option>
                    <Option :value="2">发件时间</Option>
                  </Select>
                  <div class="timeRange">
                    <DatePicker
                      v-model="searchCriteriaSend.time"
                      type="datetimerange"
                      placeholder="请选择查询时间"
                      style="width: 300px"
                    ></DatePicker>
                  </div>
                </FormItem>
                <FormItem label="来源名称">
                  <Select placeholder="请选择来源名称" clearable v-model="searchCriteriaSend.dateSourceId">
                    <Option
                      v-if="nameList && nameList.length != 0"
                      v-for="item in nameList"
                      :value="item.dataSourceId"
                      :key="item.dataSourceId"
                    >{{ item.dataSourceName }}</Option>
                  </Select>
                </FormItem>
                <FormItem label="工单状态">
                  <Select placeholder="请选择工单状态" clearable v-model="searchCriteriaSend.dataState">
                    <Option :value="1">待首跟</Option>
                    <Option :value="2">待处理</Option>
                    <Option :value="3">等待完结</Option>
                    <Option :value="4">处理完成</Option>
                  </Select>
                </FormItem>
              </Form>
              <Form inline>
                <FormItem label="工单类型">
                  <Cascader
                    :data="sourceTypeData"
                    v-model="searchCriteriaSend.typeCode"
                    placeholder="请选择工单类型"
                    style="width: 260px"
                  ></Cascader>
                </FormItem>
                <FormItem label="发件网点">
                  <Select
                    filterable
                    remote
                    clearable
                    placeholder="请输入发件网点名称"
                    v-model="searchCriteriaSend.siteCode"
                    :remote-method="handleSendSite"
                    :loading="sendSite.loading"
                  >
                    <Option
                      v-for="(option, index) in sendSite.options"
                      :value="option.Key"
                      :key="index"
                    >{{option.Value}}</Option>
                  </Select>
                </FormItem>
                <FormItem label="查询类型">
                  <Select placeholder="请选择查询类型" v-model="searchCriteriaSend.queryType" clearable>
                    <Option :value="1">网点总计</Option>
                    <Option :value="2">承包区分计</Option>
                  </Select>
                </FormItem>
              </Form>
            </div>
          </div>
        </template>
        <ButtonGroup>
          <Button
            v-for="(item,index) in gridTxt"
            :type="checkType(index)"
            @click="changeGrid(index)"
            :key="index"
          >{{item}}</Button>
        </ButtonGroup>
      </template>
      <template slot="table">
        <Table
          border
          highlight-row
          :columns="columns"
          :loading="loading"
          :data="gridData"
          :height="tableHight"
          ref="table"
          size="small"
        ></Table>
      </template>
      <template slot="pages">
        <Page
          show-sizer
          :page-size="pageSize"
          :total="gridTotalNub"
          show-total
          :current="currentPage"
          @on-change="handleChangePage"
          @on-page-size-change="handleChangePageSize"
        ></Page>
      </template>
    </Section>
    <!-- 监控详情 -->
    <Modal v-model="monitorDetailState" fullscreen footer-hide :title="monitorDetailTitle">
      <OrderMonitorDetail
        v-if="monitorDetailState"
        :searchCriteria="searchCriteria"
        :siteCode="childSiteCode"
        :stateType="stateType"
      ></OrderMonitorDetail>
    </Modal>
  </div>
</template>

<script>
import { getAllSite } from "@/api/callCenter/callCenter.js";
import { getOrderSourceNameList } from "@/api/baseInfo/sourceSettings";
import { getAllType } from "@/api/baseInfo/typeSettings";
import {
  GetMonitorPageList,
  GetSendSiteMonitorPageList
} from "@/api/dataCenter/orderMonitor";
import { formatDateTime } from "@/functions/function";
import OrderMonitorDetail from "./orderMonitorDetail.vue";
import Header from "@/components/header";
import Section from "@/components/section";
export default {
  components: { Header, Section, OrderMonitorDetail },
  data() {
    return {
      sourceTypeData: [],
      nameList: [],
      gridTxt: ["处理监控", "发件监控"],
      gridType: 0,
      tableHight: 200,
      currentPage: 1,
      pageSize: 20,
      gridData: [],
      gridTotalNub: 0,
      loading: false,
      childSiteCode: "",
      stateType: 1,
      searchSite: {
        loading: false,
        options: []
      },
      sendSite: {
        loading: false,
        options: []
      },
      searchCriteria: {
        siteCode: "",
        dateSourceId: "",
        time: ""
      },
      searchCriteriaSend: {
        dateType: 1,
        ids: "",
        dataType: 1,
        time: "",
        dateSourceId: "",
        dataState: "",
        siteCode: "",
        typeCode: [],
        queryType: ""
      },
      monitorDetailState: false,
      columnsDefault: [
        {
          title: "序号",
          key: "index",
          width: 70,
          align: "center",
          fixed: "left",
          render: (h, params) => {
            return h(
              "span",
              this.pageSize * (this.currentPage - 1) + params.index + 1
            );
          }
        },
        {
          title: "网点名称",
          key: "siteName",
          align: "center",
          minWidth: 200,
          fixed: "left"
        },
        {
          title: "首跟超时",
          align: "center",
          children: [
            {
              title: "数量",
              key: "smsNotityOverTimeNumber",
              align: "center",
              minWidth: 100,
              render: (h, params) => {
                return h("div", [
                  h(
                    "span",
                    {
                      class: "clickNum",
                      style: {
                        color: "#0B9AFC"
                      },
                      on: {
                        click: () => {
                          this.goDetail(params, 1);
                        }
                      }
                    },
                    params.row.smsNotityOverTimeNumber
                  )
                ]);
              }
            },
            {
              title: "超时率",
              key: "smsNotityOverTimeRate",
              align: "center",
              minWidth: 100
            }
          ]
        },
        {
          title: "处理超时",
          align: "center",
          children: [
            {
              title: "数量",
              key: "processOverTimeNumber",
              align: "center",
              minWidth: 100,
              render: (h, params) => {
                return h("div", [
                  h(
                    "span",
                    {
                      class: "clickNum",
                      style: {
                        color: "#0B9AFC"
                      },
                      on: {
                        click: () => {
                          this.goDetail(params, 2);
                        }
                      }
                    },
                    params.row.processOverTimeNumber
                  )
                ]);
              }
            },
            {
              title: "超时率",
              key: "processOverTimeRate",
              align: "center",
              minWidth: 100
            }
          ]
        },
        {
          title: "升级协助申请",
          align: "center",
          children: [
            {
              title: "数量",
              key: "helpNumber",
              align: "center",
              minWidth: 100,
              render: (h, params) => {
                return h("div", [
                  h(
                    "span",
                    {
                      class: "clickNum",
                      style: {
                        color: "#0B9AFC"
                      },
                      on: {
                        click: () => {
                          this.goDetail(params, 3);
                        }
                      }
                    },
                    params.row.helpNumber
                  )
                ]);
              }
            },
            {
              title: "超时率",
              key: "helpRate",
              align: "center",
              minWidth: 100
            }
          ]
        },
        {
          title: "延迟申请",
          align: "center",
          children: [
            {
              title: "数量",
              key: "delayNumber",
              align: "center",
              minWidth: 100,
              render: (h, params) => {
                return h("div", [
                  h(
                    "span",
                    {
                      class: "clickNum",
                      style: {
                        color: "#0B9AFC"
                      },
                      on: {
                        click: () => {
                          this.goDetail(params, 4);
                        }
                      }
                    },
                    params.row.delayNumber
                  )
                ]);
              }
            },
            {
              title: "申请率",
              key: "delayRate",
              align: "center",
              minWidth: 100
            }
          ]
        },
        {
          title: "业务员APP参与工单反馈",
          align: "center",
          children: [
            {
              title: "数量",
              key: "appFeedbackNumber",
              align: "center",
              minWidth: 100,
              render: (h, params) => {
                return h("div", [
                  h(
                    "span",
                    {
                      class: "clickNum",
                      style: {
                        color: "#0B9AFC"
                      },
                      on: {
                        click: () => {
                          this.goDetail(params, 5);
                        }
                      }
                    },
                    params.row.appFeedbackNumber
                  )
                ]);
              }
            },
            {
              title: "反馈率",
              key: "appFeedbackRate",
              align: "center",
              minWidth: 100
            }
          ]
        },
        {
          title: "催办发起",
          align: "center",
          children: [
            {
              title: "数量",
              key: "urgenumber",
              align: "center",
              minWidth: 100,
              render: (h, params) => {
                return h("div", [
                  h(
                    "span",
                    {
                      class: "clickNum",
                      style: {
                        color: "#0B9AFC"
                      },
                      on: {
                        click: () => {
                          this.goDetail(params, 6);
                        }
                      }
                    },
                    params.row.urgenumber
                  )
                ]);
              }
            },
            {
              title: "发起率",
              key: "urgeRate",
              align: "center",
              minWidth: 100
            }
          ]
        },
        {
          title: "完结质量不满意（推送反馈）",
          align: "center",
          children: [
            {
              title: "数量",
              key: "waitCompleteNumber",
              align: "center",
              minWidth: 100,
              render: (h, params) => {
                return h("div", [
                  h(
                    "span",
                    {
                      class: "clickNum",
                      style: {
                        color: "#0B9AFC"
                      },
                      on: {
                        click: () => {
                          this.goDetail(params, 7);
                        }
                      }
                    },
                    params.row.waitCompleteNumber
                  )
                ]);
              }
            },
            {
              title: "不满意率",
              key: "waitCompleteRate",
              align: "center",
              minWidth: 100
            }
          ]
        },
        {
          title: "工单下发次数预警统计",
          align: "center",
          children: [
            {
              title: "数量",
              key: "issuedNumberWarn",
              align: "center",
              minWidth: 200,
              render: (h, params) => {
                return h("div", [
                  h(
                    "span",
                    {
                      class: "clickNum",
                      style: {
                        color: "#0B9AFC"
                      },
                      on: {
                        click: () => {
                          this.goDetail(params, 8);
                        }
                      }
                    },
                    params.row.issuedNumberWarn
                  )
                ]);
              }
            }
          ]
        }
      ],
      columnsSend: [
        {
          title: "序号",
          key: "index",
          width: 70,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              this.pageSize * (this.currentPage - 1) + params.index + 1
            );
          }
        },
        {
          title: "工单ID",
          key: "id",
          minWidth: 170
        },
        {
          title: "运单号",
          key: "billCode",
          minWidth: 150
        },
        {
          title: "投诉人角色",
          key: "initRole",
          minWidth: 120
        },
        {
          title: "工单创建时间",
          key: "createOn",
          minWidth: 150
        },
        {
          title: "工单类型",
          key: "typeCodeDisplay",
          minWidth: 280
        },
        {
          title: "发件网点",
          key: "sendSite",
          minWidth: 150
        },
        {
          title: "实际发件网点",
          key: "sendSite",
          minWidth: 120
        },
        {
          title: "工单状态",
          key: "dataState",
          minWidth: 120
        },
        {
          title: "工单来源",
          key: "dataSource",
          minWidth: 180
        }
      ]
    };
  },
  computed: {
    columns() {
      if (this.gridType == 0) {
        return this.columnsDefault;
      } else if (this.gridType == 1) {
        return this.columnsSend;
      }
    },
    monitorDetailTitle() {
      let titleList = [
        "首跟超时统计",
        "处理超时统计",
        "升级协助申请统计",
        "延迟申请统计",
        "业务员APP参与工单反馈统计",
        "催办发起统计",
        "完结质量不满意（推送反馈）统计",
        "工单下发次数预警统计"
      ];
      return titleList[this.stateType - 1];
    }
  },
  watch: {
    gridType() {
      this.currentPage = 1;
      this.gridTotalNub = 0;
      this.handleSearch();
    }
  },
  mounted() {
    this.handleResize();
    window.addEventListener("resize", this.handleResize, false);
    getOrderSourceNameList().then(res => {
      if (res && res.success) {
        this.nameList = res.data;
      }
    }),
      this.handleGetAllType();
    this.handleSearch();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize, false);
  },
  methods: {
    handleResize() {
      this.$nextTick(() => {
        this.tableHight = this.$el.getElementsByClassName(
          "table"
        )[0].clientHeight;
      });
    },
    handleSearchSite(query) {
      if (query !== "") {
        this.searchSite.loading = true;
        getAllSite({
          key: query
        }).then(res => {
          this.searchSite.loading = false;
          if (res && res.success) {
            this.searchSite.options = res.data;
          } else {
            this.searchSite.options = [];
          }
        });
      } else {
        this.searchSite.options = [];
      }
    },
    handleSendSite(query) {
      if (query !== "") {
        this.sendSite.loading = true;
        getAllSite({
          key: query
        }).then(res => {
          this.sendSite.loading = false;
          if (res && res.success) {
            this.sendSite.options = res.data;
          } else {
            this.sendSite.options = [];
          }
        });
      } else {
        this.sendSite.options = [];
      }
    },
    handleGetAllType() {
      getAllType().then(res => {
        if (res && res.success) {
          this.sourceTypeData = res.data;
        }
      });
    },
    checkType(index) {
      if (index == this.gridType) {
        return "primary";
      } else {
        return;
      }
    },
    changeGrid(index) {
      this.gridType = index;
      this.handleResize();
    },
    handleSearch() {
      this.gridData = [];
      if (this.gridType == 0) {
        this.handleSearchMonitor();
      } else if (this.gridType == 1) {
        this.handleSearchSend();
      }
    },
    handleSearchMonitor() {
      this.loading = true;
      GetMonitorPageList({
        pageSize: this.pageSize,
        PageNo: this.currentPage,
        sort: "CreateOn",
        direction: "desc",
        data: {
          siteCode: this.searchCriteria.siteCode,
          dataSourceId: this.searchCriteria.dateSourceId,
          beginTime: this.searchCriteria.time[0]
            ? formatDateTime(this.searchCriteria.time[0])
            : "",
          endTime: this.searchCriteria.time[1]
            ? formatDateTime(this.searchCriteria.time[1])
            : ""
        }
      }).then(res => {
        this.loading = false;
        if (res && res.success) {
          this.gridData = res.data;
          this.gridTotalNub = res.rowCount;
        } else {
          this.gridData = [];
          this.gridTotalNub = 0;
        }
      });
    },
    handleSearchSend() {
      this.loading = true;
      GetSendSiteMonitorPageList({
        pageSize: this.pageSize,
        PageNo: this.currentPage,
        sort: "CreateOn",
        direction: "desc",
        data: {
          dateType: this.searchCriteriaSend.dateType,
          ids: this.searchCriteriaSend.ids,
          dataType: this.searchCriteriaSend.dataType,
          beginTime: this.searchCriteriaSend.time[0]
            ? formatDateTime(this.searchCriteriaSend.time[0])
            : "",
          endTime: this.searchCriteriaSend.time[1]
            ? formatDateTime(this.searchCriteriaSend.time[1])
            : "",
          dataSourceId: this.searchCriteriaSend.dateSourceId,
          dataState: this.searchCriteriaSend.dataState,
          siteCode: this.searchCriteriaSend.siteCode,
          typeCode:
            this.searchCriteriaSend.typeCode.length != 0
              ? this.searchCriteriaSend.typeCode[2]
              : "",
          queryType: this.searchCriteriaSend.queryType
        }
      }).then(res => {
        this.loading = false;
        if (res && res.success) {
          this.gridData = res.data;
          this.gridTotalNub = res.rowCount;
        } else {
          this.gridData = [];
          this.gridTotalNub = 0;
        }
      });
    },
    handleChangePage(page) {
      this.currentPage = page;
      this.handleSearch();
    },
    handleChangePageSize(pageSize) {
      this.pageSize = pageSize;
      this.handleSearch();
    },
    goDetail(params, index) {
      this.stateType = index;
      this.childSiteCode = params.row.siteCode;
      this.monitorDetailState = !this.monitorDetailState;
    }
  }
};
</script>

<style lang="less" scoped>
.ivu-btn-group-default {
  text-align: left;
  margin-bottom: 10px;
  display: flex;
  justify-content: flex-start;
}
.ivu-form-item {
  margin-bottom: 0;
}
.form_warper {
  display: flex;
  flex-flow: row nowrap;
  .code_warper {
    width: 200px;
    margin-right: 20px;
  }
  .other_form {
    flex: 1;
    .ivu-form-inline {
      margin-bottom: 10px;
      .ivu-form-item {
        display: inline-flex;
        align-items: flex-start;
        justify-content: flex-start;
      }
    }
  }
}
.creatTime {
  width: auto;
  .ivu-form-item-content {
    display: inline-flex;
    justify-content: flex-start;
    align-items: flex-start;
    .ivu-select {
      width: 100px;
      .ivu-select-selection {
        border: 1px solid #ffffff;
      }
    }
    .timeRange {
      display: inline-flex;
      justify-content: flex-start;
      align-items: flex-start;
    }
  }
}
.ivu-table-tbody {
  .ivu-table-cell {
    .clickNum {
      color: red !important;
    }
    .clickNum:hover {
      cursor: pointer;
    }
  }
}
</style>
