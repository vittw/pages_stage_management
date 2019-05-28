<template>
  <div class="source_warper warper">
    <Header>
      <span class="colorBlock"></span>
      <span>客服 > 数据中心 > 总部撤销罚款</span>
      <template slot="rightWarper">
        <Button type="primary" @click="Search()">查询</Button>
        <Button type="warning" @click="UpdateFineAmount()">修改考核金额</Button>
        <Button type="error" @click="ReovkedShow()">撤销</Button>
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
              <Option value="All">全部</Option>
              <Option value="ok">复核成功</Option>
              <Option value="no">复核失败</Option>
              <Option value="wait">待复核</Option>
            </Select>
          </FormItem>
          <FormItem label="罚款状态" :label-width="60">
            <Select v-model="SearchFrom.FineState" style="width:85px">
              <Option value="-1">全部</Option>
              <Option value="0">未撤销</Option>
              <Option value="1">已撤销</Option>
            </Select>
          </FormItem>
        </Form>
      </template>
      <template slot="table">
        <Table
          border
          highlight-row
          @on-page-size-change="value=>{Table.PageSize=value; Search();}"
          @on-change="value=>{Table.PageNo=value; Search();}"
          :columns="columns"
          :height="Table.Hight"
          :data="Data"
          :loading="Table.loading"
          ref="table"
          size="small"
        >
          <template slot-scope="{row,index}" slot="punishDetaile">
            <p class="orderInfor">
              <span class="inforTitle">罚款类型：</span>
              <span>{{row.firstFineType}}/{{row.secondFineType}}</span>
            </p>
            <p class="orderInfor">
              <span class="inforTitle">罚款时间：</span>
              <span>{{row.fineTime}}</span>
            </p>
          </template>
          <template slot-scope="{row,index}" slot="fine">
            <p class="orderInfor">
              <span class="inforTitle">罚款网点：</span>
              <span>{{row.fineSite}}</span>
            </p>
            <p class="orderInfor">
              <span class="inforTitle">罚款人：</span>
              <span>{{row.fineBy}}</span>
            </p>
          </template>
          <template slot-scope="{row,index}" slot="accept">
            <p class="orderInfor">
              <span class="inforTitle">受款网点：</span>
              <span>{{row.acceptSite}}</span>
            </p>
            <p class="orderInfor">
              <span class="inforTitle">受款金额：</span>
              <span>{{row.acceptAmount}}</span>
            </p>
          </template>
          <template slot-scope="{row,index}" slot="revoked">
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
          </template>
        </Table>
      </template>
      <template slot="pages">
        <Page
          show-sizer
          show-elevator
          show-total
          @on-page-size-change="value=>Table.PageSize=value"
          @on-change="value=>Table.PageNo=value"
          :total="Table.Total"
          :page-size="Table.PageSize"
          :current="Table.PageNo"
        ></Page>
      </template>
    </Section>
    <Modal
      v-model="FineAmount.state"
      title="修改考核金额"
      :loading="true"
      :mask-closable="false"
      :closable="false"
      @on-ok="UpdateFineAmountOk"
    >
      <Form>
        <FormItem label="被罚网点">
          <Input v-model="FineAmount.PunishSite" disabled></Input>
        </FormItem>
        <FormItem label="罚款类型">
          <Input v-model="FineAmount.FineType" disabled></Input>
        </FormItem>
        <FormItem label="罚款金额">
          <Input
            type="number"
            :rules="{required: true, message: '罚款金额不能为空', trigger: 'blur'}"
            v-model="FineAmount.FineAmount"
          ></Input>
        </FormItem>
        <FormItem label="修改原因">
          <Input
            type="textarea"
            rows="4"
            :rules="{required: true, message: '修改原因不能为空', trigger: 'blur'}"
            v-model="FineAmount.Remark"
          ></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="Reovked.state" title="撤销工单" :loading="true" @on-ok="ReovkedOk()">
      <Form>
        <FormItem label="撤销原因">
          <Input type="textarea" rows="4" v-model="Reovked.RevokedReason"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import Header from "@/components/header";
import Section from "@/components/section";
import CascaderFineType from "@/components/CommonComponent/CascaderFineType";
import SelectSite from "@/components/CommonComponent/SelectSite";
import { CancelFineManager } from "./CancelFineManager.js";
var manager = new CancelFineManager();
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
    UpdateFineAmount() {
      let selectedColumns = [...this.$refs.table.getSelection()];
      let punishSite = selectedColumns[0].punishSite;
      let first = selectedColumns[0].firstFineType;
      let second = selectedColumns[0].secondFineType;
      let count = selectedColumns.filter(
        t =>
          !(
            t.punishSite == punishSite &&
            t.firstFineType == first &&
            t.secondFineType == second
          )
      );
      if (count.length > 0) {
        this.$Message.warning("只能选择同类型、同网点的单子进行批量操作");
        return false;
      }
      if (selectedColumns.length > 0) {
        this.FineAmount.SelectIds = selectedColumns.map(t => t.id);
        this.FineAmount.FineType = `${first}/${second}`;
        this.FineAmount.PunishSite = punishSite;
        this.FineAmount.state = true;
      } else {
        this.$Message.warning("请勾选要操作的数据！");
        this.FineAmount.FineType = "";
        this.FineAmount.PunishSite = "";
      }
    },
    UpdateFineAmountOk() {
      manager.UpdateFineAmount();
    },
    ReovkedShow() {
      let selectedColumns = [...this.$refs.table.getSelection()];
      if (selectedColumns.length > 0) {
        this.Reovked.SelectIds = selectedColumns.map(t => t.id);
        this.Reovked.state = true;
      } else {
        this.$Message.warning("请勾选要操作的数据！");
      }
    },
    ReovkedOk() {
      manager.Reovked();
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
</style>
