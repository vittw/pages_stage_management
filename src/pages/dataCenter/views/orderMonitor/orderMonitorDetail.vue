<template>
  <div class="source_warper warper_model" style="padding: 0">
    <Section>
      <template slot="form">
        <div class="form_warper">
          <div class="code_warper">
            <Select placeholder="请选择来源名称" v-model="dataType">
              <Option :value="1">运单号</Option>
              <Option :value="2">工单号</Option>
            </Select>
            <Input v-model="ids" type="textarea" placeholder="运单号/工单ID查询" :autosize="{minRows: 1.5,maxRows: 1.5}" clearable></Input>
          </div>
          <div class="other_form">
            <Button type="primary" @click="handleSearch">查询</Button>
          </div>
        </div>
      </template>
      <template slot="table">
        <Table border highlight-row :loading="loading" :columns="columns" ref= 'table' :height="tableHight" :data="gridData" size="small">
          <template slot-scope="{ row, index }" slot="detail">
              <div class="list">
                <span>工单来源：{{row.dataSource}}</span> <span>下发次数：{{row.issuedNumber}}</span>
              </div>
              <div class="list">
                <span>投诉人角色：{{row.initRole}}</span> <span>录入网点：{{row.createSite}}</span>
              </div>
              <div class="list">
                <span>工单类型：{{row.typeCodeDisplay}}</span>
              </div>
              <div class="list">
                <span>创建时间：{{row.createOn}}</span>
              </div>
            </template>
        </Table>
      </template>
      <template slot="pages">
        <div class="page_warper">
          <Page show-sizer :page-size='pageSize' :total="gridTotalNub" show-total :current="currentPage" @on-change="handleChangePage" @on-page-size-change="handleChangePageSize"></Page>
        </div>
      </template>
    </Section>
  </div>
</template>

<script>
import Header from '@/components/header';
import Section from '@/components/section';
import { GetMonitorDetail } from "@/api/dataCenter/orderMonitor";
import { formatDateTime } from "@/functions/function";
export default {
  name: 'business',
  components: { Header, Section },
  props:{
    searchCriteria: {
      type: Object
    },
    siteCode: {
      type: String
    },
    stateType: {
      type: Number
    }
  },
  data(){
    return {
      gridTotalNub: 0,
      currentPage: 1,
      pageSize: 20,
      gridData: [],
      loading: false,
      tableHight: 100,
      dataType: 1,
      ids: '',
      addModal: {
        state: false,
        title: '新增'
      },
      editModal: {
        state: false,
        title: '修改'
      },
      columns: [
        {
          title: '序号',
          key: 'index',
          width: 70,
          align: 'center',
          render: (h, params) => {
            return h('span', this.pageSize*(this.currentPage-1) + params.index + 1);
          }
        },
        {
          title: '运单编号',
          key: 'billCode',
          minWidth:130
        },
        {
          title: '工单ID',
          key: 'id',
          minWidth:150
        },
        {
          title: '当前处理网点',
          key: 'processSite',
          minWidth:150,
        },
        {
          title: '当前处理人',
          key: 'processBy',
          minWidth:180
        },
        {
          title: '当前处理时效',
          key: 'timeLimit',
          minWidth:180
        },
        {
          title: '工单状态',
          key: 'dataState',
          minWidth:180
        },
        {
          title: '处理时间',
          key: 'processTime',
          minWidth:180
        },
        {
          title: '工单信息',
          slot: 'detail',
          minWidth:260
        },
        {
          title: '被投诉网点',
          key: 'beComplainsiteName',
          minWidth:180
        },
      ],
    }
  },
  mounted(){
    this.handleResize()
    window.addEventListener('resize', this.handleResize, false)
    this.handleSearch()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize, false)
  },
  methods: {
    handleResize(){
      this.$nextTick(() =>{
        this.tableHight = this.$el.getElementsByClassName('table')[0].clientHeight
      })
    },
    handleSearch(){
      this.loading = true;
      GetMonitorDetail({
        pageSize: this.pageSize,
        PageNo: this.currentPage,
        sort: 'CreateOn',
        direction: 'desc',
        data:{
          siteCode: this.siteCode,
          dataSourceId: this.searchCriteria.dateSourceId,
          beginTime: this.searchCriteria.time[0] ? formatDateTime(this.searchCriteria.time[0]) : '',
          endTime: this.searchCriteria.time[1]? formatDateTime(this.searchCriteria.time[1]) : '',
          dataType: this.dataType,
          ids: this.ids,
          stateType: this.stateType,
        }
      }).then(res=>{
        this.loading = false;
        if (res && res.success) {
          this.gridData = res.data;
          this.gridTotalNub = res.rowCount;
        } else {
          this.gridData = [];
          this.gridTotalNub = 0;
        }
      })
    },
    handleChangePage(page) {
      this.currentPage = page;
      this.handleSearch()
    },
    handleChangePageSize(pageSize) {
      this.pageSize = pageSize;
      this.handleSearch()
    },
  }
}
</script>

<style lang="less" scoped>
.warper_model{
  .header{
    height: 0
  }
  .page_warper{
    height: 52px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}

.ivu-form-item{
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
.list{
  span:first-child{
    margin-right: 32px
  }
}
</style>
