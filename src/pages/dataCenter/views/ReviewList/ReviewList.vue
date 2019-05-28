<template>
  <div class="source_warper warper">
    <Header>
      <span class="colorBlock"></span>
      <span>客服 > 数据中心 > 总部复核清单</span>
      <template slot="rightWarper">
        <Button type="primary" @click="Search()">查询</Button>
        <Button type="success" @click="HQReview()">总部审核</Button>
      </template>
    </Header>
    <Section>
      <template slot="form">
        <Form inline label-position="left">
          <FormItem style="float: left">
            <Select v-model="SearchFrom.CodesType" placeholder="运单号" label-in-value>
              <Option value="BillCode">运单号</Option>
              <Option value="Id">工单ID</Option>
            </Select>
            <Input
              v-model="SearchFrom.Codes"
              type="textarea"
              :autosize="{minRows: 3,maxRows: 3}"
              placeholder="请输入运单号或工单ID,多个单号用换行符隔开"
            />
          </FormItem>
          <FormItem label="罚款类型" :label-width="60">
            <CascaderFineType v-model="SearchFrom.v_Model.FineType" style="width:250px"></CascaderFineType>
          </FormItem>
          <FormItem label="罚款时间" :label-width="60">
            <DatePicker
              type="datetimerange"
              placeholder="请选择时间范围"
              v-model="SearchFrom.FineTime"
              style="width: 300px"
            ></DatePicker>
          </FormItem>
          <FormItem label="网点名称" :label-width="60">
            <SelectSite v-model="SearchFrom.SiteCode" :SelectType="SelectSiteType"></SelectSite>
          </FormItem>
          <FormItem label="复核状态" :label-width="60">
            <Select v-model="SearchFrom.ReviewState" style="width:85px" clearable>
              <Option value="ok">复核成功</Option>
              <Option value="no">复核失败</Option>
              <Option value="wait">待复核</Option>
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
        >
          <template slot-scope="{row,index}" slot="punishType">
            <p class="orderInfor">
              <span class="inforTitle">罚款类型：</span>
              <span>{{row.firstFineType}}/{{row.secondFineType}}</span>
            </p>
          </template>
          <template slot-scope="{row,index}" slot="reviewDetaile">
            <p class="orderInfor">
              <span class="inforTitle">复核网点：</span>
              <span>{{row.reviewSite}}</span>
            </p>
            <p class="orderInfor">
              <span class="inforTitle">复核原因：</span>
              <span>{{row.reviewReason}}</span>
            </p>
          </template>
        </Table>
      </template>
      <template slot="pages">
        <Page
          show-sizer
          show-elevator
          show-total
          @on-page-size-change="value=>{Table.PageSize=value; Search();}"
          @on-change="value=>{Table.PageNo=value; Search();}"
          :total="Table.Total"
          :page-size="Table.PageSize"
          :current="Table.PageNo"
        ></Page>
      </template>
    </Section>
    <Modal
      v-model="Review.state"
      title="总部审核"
      :loading="true"
      :mask-closable="false"
      :closable="false"
      @on-ok="HQReviewOk"
    >
      <RadioGroup size="large" v-model="Review.ReviewState">
        <Radio label="ok">
          <Icon type="md-checkmark-circle"/>
          <span>复核成功</span>
        </Radio>
        <Radio  label="no">
          <Icon type="md-close-circle"/>
          <span>复核失败</span>
        </Radio>
      </RadioGroup>
    </Modal>
  </div>
</template>
<script>
import Header from "@/components/header";
import Section from "@/components/section";
import CascaderFineType from "@/components/CommonComponent/CascaderFineType";
import SelectSite from "@/components/CommonComponent/SelectSite";
import { ReviewListManager } from "./ReviewListManager";
var manager = new ReviewListManager();
export default {
  components: { Header, Section, CascaderFineType, SelectSite },
  data() {
    return manager.data();
  },
  created() {},
  beforeCreate() {
    manager.useVue(this);
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
    Search() {
      manager.GetListByPage();
    },
    HQReview() {
      let selectedColumns = [...this.$refs.table.getSelection()];
      if (selectedColumns.length > 0) {
        this.Review.SelectIds = selectedColumns.map(t => t.id);
        this.Review.state = true;
      } else {
        this.$Message.warning("请勾选要操作的数据！");
      }
    },
    HQReviewOk() {
      manager.ReviewOk();
    }
  },
  watch: {
    "Table.PageNo": function(newValue, OldValue) {
      manager.GetListByPage();
    },
    "Table.PageSize": function(newValue, OldValue) {
      manager.GetListByPage();
    }
  }
};
</script>
<style  lang="less" scoped>
.orderInfor {
  line-height: 21px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
  .inforTitle {
    font-weight: bold;
  }
  .second {
    margin-left: 40px !important;
  }
}
form {
  .from_module {
    height: auto;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    .ivu-form-item {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      margin-right: 20px;
      margin-bottom: 10px;
    }
  }
}
</style>
