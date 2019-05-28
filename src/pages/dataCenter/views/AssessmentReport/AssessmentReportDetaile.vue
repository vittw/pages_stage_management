<template>
  <div class="source_warper warper_model" style="padding: 0">
    <Section>
      <template slot="form">
        <div class="form_warper">
          <div class="code_warper">
            <Select placeholder="请选择查询类型" v-model="SerarchFrom.CodesType">
              <Option value="BillCode">运单号</Option>
              <Option value="Id">工单号</Option>
            </Select>
            <Input
              type="textarea"
              placeholder="运单号/工单ID查询"
              :autosize="{minRows: 1.5,maxRows: 1.5}"
              v-model="SerarchFrom.Codes"
              clearable
            ></Input>
          </div>
          <div class="other_form">
            <Button type="primary" @click="handleSearch">查询</Button>
          </div>
        </div>
      </template>
      <template slot="table">
        <Table
          border
          highlight-row
          :loading="Table.loading"
          :columns="columns"
          ref="table"
          :height="Table.Hight"
          :data="Data"
          size="small"
        >
          <template slot-scope="{row,index}" slot="FineDetaile">
            <p class="orderInfor">
              <span class="inforTitle">罚款金额：</span>
              <span>{{row.punishAmount}}</span>
            </p>
            <p class="orderInfor">
              <span class="inforTitle">罚款类型：</span>
              <span>{{row.firstFineType}}/{{row.secondFineType}}</span>
            </p>
            <p class="orderInfor">
              <span class="inforTitle">罚款时间：</span>
              <span>{{row.fineTime}}</span>
            </p>
          </template>
          <template slot-scope="{row,index}" slot="FineInfo">
            <p class="orderInfor">
              <span class="inforTitle">罚款网点：</span>
              <span>{{row.fineSite}}</span>
            </p>
            <p class="orderInfor">
              <span class="inforTitle">罚款人：</span>
              <span>{{row.fineBy}}</span>
            </p>
          </template>
          <template slot-scope="{row,index}" slot="Recipient">
            <p class="orderInfor">
              <span class="inforTitle">受款网点：</span>
              <span>{{row.acceptSite}}</span>
            </p>
            <p class="orderInfor">
              <span class="inforTitle">受款金额：</span>
              <span>{{row.acceptAmount}}</span>
            </p>
            <p class="orderInfor">
              <span class="inforTitle">受款客户：</span>
              <span>{{row.acceptCustomer}}</span>
            </p>
          </template>
          <template slot-scope="{row,index}" slot="WOType">
            <p class="orderInfor">
              <span class="inforTitle">工单类型一级：</span>
              <span>{{row.firstTypeName}}</span>
            </p>
            <p class="orderInfor">
              <span class="inforTitle">工单类型二级：</span>
              <span>{{row.secondTypeName}}</span>
            </p>
            <p class="orderInfor">
              <span class="inforTitle">工单类型三级：</span>
              <span>{{row.threeTypeName}}</span>
            </p>
          </template>
          <template slot-scope="{row,index}" slot="CancelDetaile">
            <p class="orderInfor">
              <span class="inforTitle">撤销人：</span>
              <span>{{row.revokedBy}}</span>
            </p>
            <p class="orderInfor">
              <span class="inforTitle">撤销网点：</span>
              <span>{{row.revokedSite}}</span>
            </p>
            <p class="orderInfor">
              <span class="inforTitle">撤销时间：</span>
              <span>{{row.revokedTime}}</span>
            </p>
            <p class="orderInfor">
              <span class="inforTitle">撤销原因：</span>
              <span>{{row.revokedReason}}</span>
            </p>
          </template>
        </Table>
      </template>
      <template slot="pages">
        <div class="page_warper">
          <Page
            show-sizer
            show-elevator
            show-total
            @on-page-size-change="value=>{Table.PageSize=value; handleSearch();}"
            @on-change="value=>{Table.PageNo=value; handleSearch();}"
            :page-size="Table.PageSize"
            :total="Table.Total"
            :current="Table.PageNo"
          ></Page>
        </div>
      </template>
    </Section>
    <Modal v-model="Review.ReviewShow" :loading="Review.ReviewLoading" title="复核">
      <Form ref="Review" inline>
        <FormItem label="请输入申请复核原因：" style="width:100%">
          <Input
            type="textarea"
            v-model="Review.ReviewReason"
            :rows="5"
            :autofocus="true"
            clearable
          ></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="ReviewCancel()">取消</Button>
        <Button @click="ReviewOk()" type="primary">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Header from "@/components/header";
import Section from "@/components/section";
import { AssessmentReportDetaileManager } from "./AssessmentReportManager.js";
var manager = new AssessmentReportDetaileManager();
export default {
  name: "business",
  components: { Header, Section },
  props: {
    ParentSerarchFrom: {
      type: Object
    },
    SecondFineType: {
      type: String
    },
    SecondFineTypeId: {
      type: String
    },
    SiteCode: {
      type: String
    }
  },
  data() {
    return manager.data();
  },
  beforeCreate() {
    manager.useVue(this);
  },
  mounted() {
    this.tableResize();
    window.addEventListener("resize", this.tableResize, false);
    this.handleSearch();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.tableResize, false);
  },
  methods: {
    tableResize() {
      manager.tableResize();
    },
    handleSearch() {
      manager.GetListByPage();
    },
    ReviewCancel() {
      manager.ReviewCancel();
    },
    ReviewOk() {
      manager.ReviewOk();
    }
  }
};
</script>

<style lang="less" scoped>
.warper_model {
  .header {
    height: 0;
  }
  .page_warper {
    height: 52px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}

.ivu-form-item {
  margin-bottom: 0;
}
.form_warper {
  display: flex;
  flex-flow: row nowrap;
  margin-bottom: 16px;
  .code_warper {
    width: 200px;
    margin-right: 20px;
  }
  .other_form {
    flex: 1;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    align-items: flex-end;
  }
}
.list {
  span:first-child {
    margin-right: 32px;
  }
}
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
</style>
