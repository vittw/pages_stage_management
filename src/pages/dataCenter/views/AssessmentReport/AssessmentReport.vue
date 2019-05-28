<template>
  <div class="source_warper warper">
    <Header>
      <span class="colorBlock"></span>
      <span>客服 > 数据中心 > 工单考核报表</span>
      <template slot="rightWarper">
        <Button type="primary" @click="SearchFrom()">查询</Button>
      </template>
    </Header>
    <Section>
      <template slot="form">
        <Form inline label-position="left">
          <FormItem label="网点名称" :label-width="60">
            <SelectSite v-model="searchFrom.SiteCode" :SelectType="SelectSiteType"></SelectSite>
          </FormItem>
          <FormItem label="罚款时间" :label-width="60">
            <DatePicker
              type="datetimerange"
              placeholder="请选择时间范围"
              v-model="searchFrom.FineTime"
              style="width: 300px"
            ></DatePicker>
          </FormItem>
          <FormItem label="罚款状态" :label-width="60">
            <Select v-model="searchFrom.FineStatus">
              <Option value="-1">全部</Option>
              <Option value="0">未撤销</Option>
              <Option value="1">已撤销</Option>
            </Select>
          </FormItem>
          <FormItem label="查询类型" :label-width="60">
            <Select v-model="searchFrom.SearchType">
              <Option value="Site">网点总计</Option>
              <Option value="Contract">承包区分计</Option>
            </Select>
          </FormItem>
        </Form>
      </template>
      <template slot="table">
        <Table
          border
          highlight-row
          :columns="columns"
          :height="Table.Hight"
          :data="Data"
          :loading="Table.loading"
          ref="table"
          size="small"
        ></Table>
      </template>
      <template slot="pages">
        <Page
          show-sizer
          show-elevator
          show-total
          @on-page-size-change="value=>{Table.PageSize=value; SearchFrom();}"
          @on-change="value=>{Table.PageNo=value; SearchFrom();}"
          :total="Table.Total"
          :page-size="Table.PageSize"
          :current="Table.PageNo"
        ></Page>
      </template>
    </Section>
    <Modal v-model="Detaile.State" fullscreen footer-hide :title="Detaile.Title">
      <AssessmentReportDetaile
        v-if="Detaile.State"
        :ParentSerarchFrom="Detaile.searchFrom"
        :SecondFineType="Detaile.SecondFineType"
        :SecondFineTypeId="Detaile.SecondFineTypeId"
        :SiteCode="Detaile.SiteCode"
      ></AssessmentReportDetaile>
    </Modal>
  </div>
</template>

<script>
import { getAllSite } from "@/api/callCenter/callCenter.js";
import Header from "@/components/header";
import Section from "@/components/section";
import AssessmentReportDetaile from "./AssessmentReportDetaile.vue";
import SelectSite from "@/components/CommonComponent/SelectSite";
import { AssessmentReportManager } from "./AssessmentReportManager.js";
var manager = new AssessmentReportManager();
export default {
  components: { Header, Section, AssessmentReportDetaile, SelectSite },
  data() {
    return manager.data();
  },
  beforeCreate() {
    manager.useVue(this);
  },
  created() {
    manager.AddColums();
  },
  mounted() {
    this.tableResize();
    window.addEventListener("resize", this.tableResize, false);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.tableResize, false);
  },
  methods: {
    tableResize() {
      manager.tableResize();
    },
    SearchFrom() {
      manager.GetListByPage();
    },
    SearchSite(query) {
      manager.GetSubordinateSite(query);
    }
  }
};
</script>