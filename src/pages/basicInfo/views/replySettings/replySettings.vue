<template>
  <div class="source_warper warper">
    <Header>
      <span class="colorBlock"></span>
      <span>客服 > 工单基础配置 > 工单标准回复</span>
      <template slot = "rightWarper">
        <Button type="primary" @click="handleSearch">查询</Button>
        <Button @click="handleAdd">新增</Button>
        <!-- <Button @click="handleEdit">修改</Button> -->
        <Button @click="exportData">导出</Button>
      </template>
    </Header>
    <Section>
      <template slot="form">
        <Form inline>
          <div class="from_module">
            <FormItem label="来源名称">
              <Select v-model="formItem.dataSourceId" clearable placeholder="请选择来源名称">
                <Option v-if="nameList && nameList.length != 0" v-for="item in nameList" :value="item.dataSourceId" :key="item.dataSourceId">{{ item.dataSourceName }}</Option>
              </Select>
            </FormItem>
            <FormItem label="工单类型" prop="typeName">
              <Cascader v-model="formItem.nameList" :data="sourceTypeData" placeholder="请选择工单类型" :transfer="true"></Cascader>
            </FormItem>
          </div>
        </Form>
      </template>
      <template slot="table">
        <Table border highlight-row @on-current-change='selectRowChange' :loading="loading" :columns="columns" ref= 'table' :data="gridData" :height="tableHight" size="small">
          <template slot-scope="{ row, index }" slot="replyContents">
            <!-- <Input type="text" v-model="editAddress" v-if="editIndex === index" /> -->
            <!-- <span v-else>{{ row.address }}</span> -->
            <div v-html="setGridDefaultContent(row)"></div>
          </template>
        </Table>
      </template>
      <template slot="pages">
        <Page show-sizer :page-size='pageSize' show-total :total="gridTotalNub" :current="currentPage" @on-change = 'handleChangePage' @on-page-size-change = 'handleChangePageSize'></Page>
      </template>
    </Section>
    <!-- 新增 -->
    <Modal
      v-model="addModal.state"
      :title="addModal.title"
      width="800"
      :scrollable = 'true'
      class-name="vertical-center-modal body_scroll">
      <AddModal v-if='addModal.state' ref="addModal" @isSuccess = 'clickModalResult'></AddModal>
      <div slot="footer">
        <Button type="text" size="large" @click="addModal.state=false">取消</Button>
        <Button type="primary" size="large" @click="addSure">确定</Button>
      </div>
    </Modal>

    <!-- 修改 -->
    <Modal
      v-model="editModal.state"
      :title="editModal.title"
      width="800"
      class-name="vertical-center-modal">
      <AddModal v-if='editModal.state' ref='editModal' :isEdit="true" :detailData = 'currentDetailData' @isSuccess = 'editModalResult'></AddModal>
      <!-- <editModal v-if='editModal.state' ref='editModal' :detailData = 'currentDetailData' @isSuccess = 'editModalResult'></editModal> -->
      <div slot="footer">
        <Button type="text" size="large" @click="editModal.state=false">取消</Button>
        <Button type="primary" size="large" @click="editSure()">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Header from '@/components/header';
import Section from '@/components/section';
import AddModal from './addModal.vue';
import { Button,Form,FormItem,Input,Select,Option,Icon,Table,RadioGroup,Radio,Page,Modal,Cascader } from 'iview';
import { getOrderSourceNameList } from '@/api/baseInfo/sourceSettings';
import { getAllType } from '@/api/baseInfo/typeSettings';
import { getReplyConfig, deleteReplyConfig, getReplyConfigById} from '@/api/baseInfo/replySettings'
export default {
  name: 'business',
  components: { Header, Section, AddModal, Button, Form, FormItem, Input, Select, Option, Table, RadioGroup, Radio, Page, Modal},
  data(){
    return {
      sourceTypeData: [],
      nameList: [],
      formItem: {
        dataSourceId: '', //来源名称
        nameList: [], //三级类型
      },
      // currentPane: 'firstPane',
      currentDetailData: {},
      gridData: [],
      gridTotalNub: 0,
      loading: false,
      currentSelectRow: {},
      tableHight: 100,
      currentPage: 1,
      pageSize: 20,
      addModal: {
        state: false,
        title: '新增'
      },
      editModal: {
        state: false,
        title: '修改'
      },
      deleteModal: {
        state: false,
        title: ''
      },
      columns: [
        {
          type: 'selection',
          width: 50,
          align: 'center',
        },
        {
          type: 'index',
          width: 60,
          align: 'center',
        },
        {
          title: '工单来源',
          key: 'dataSourceName',
          minWidth:160
        },
        {
          title: '工单类型（一级）',
          key: 'firstName',
          minWidth:160,
        },

        {
          title: '工单类型（二级）',
          key: 'secondName',
          minWidth:160
        },
        {
          title: '工单类型（三级）',
          key: 'threeName',
          minWidth:160
        },
        {
          title: '投诉人角色',   //0是客户 1是商家
          key: 'initRole',
          minWidth:120,
          render: (h, params) => {
            return h('span', params.row.isEditContent == 0 ? '客户': '商家');
          }
        },
        {
          title: '是否可编辑回复',
          key: 'isEditContent',
          minWidth:130,
          render: (h, params) => {
            return h('span', params.row.isEditContent == 0 ? '是': '否');
          }
        },
        {
          title: '回复模板',
          key: 'replyContents',
          minWidth:300,
          slot: 'replyContents'
          // render: (h, params) => {
          //   return h('div', this.setGridDefaultContent(params.row));
          // }
        },
        {
          title: '回复编码',
          key: 'replyCode',
          minWidth:100
        },
        {
          title: '备注',
          key: 'remark',
          minWidth:180
        },
        {
          title: '录入人',
          key: 'createBy',
          minWidth:100
        },
        {
          title: '录入时间',
          key: 'createOn',
          minWidth:180
        },
        {
          title: '录入网点',
          key: '',
          minWidth:100
        },
        {
            title: '操作',
            key: 'action',
            slot: 'action',
            width:132,
            fixed: 'right',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.handleEdit(params.row.id)
                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.handleDelete(params.row.id)
                    }
                  }
                }, '删除')
              ]);
            }
        }
      ],
    }
  },
  mounted(){
    this.handleResize()
    window.addEventListener('resize', this.handleResize, false)
    this.handleSearch()
    getOrderSourceNameList().then(res=>{
      if(res && res.success){
        this.nameList = res.data
      }
    })
    getAllType().then(res=>{
      if(res && res.success){
        this.sourceTypeData = res.data
      }
    })
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
      this.currentPage = 1
      this.loading = true
      getReplyConfig({
        data: {
          dataSourceId: this.formItem.dataSourceId,
          FirstCode: this.formItem.nameList[0],
          SecondCode: this.formItem.nameList[1],
          ThreeCode: this.formItem.nameList[2]
        },
        PageNo: this.currentPage,
        pageSize: this.pageSize,
      }).then(res=>{
        this.loading = false;
        if(res && res.success){
          this.gridData = res.data
          this.gridTotalNub = res.rowCount
        }else{
          this.gridData = []
          this.gridTotalNub = 0
        }
      });
    },
    handleChangePage(page){
      this.currentPage = page
      this.handleSearch()
    },
    handleChangePageSize(pageSize){
      this.pageSize = pageSize
      this.handleSearch()
    },
    handleAdd(){
      this.addModal.state = !this.addModal.state
    },
    handleEdit(id){
      this.currentDetailData = {}
      getReplyConfigById({
        Id: id
      }).then(res=>{
        if(res && res.success){
          this.editModal.state = !this.editModal.state
          this.currentDetailData = res.data
        }else{
          this.currentDetailData = {}
          this.$Message.error(res.msg);
        }
      })
    },
    handleDelete(id){
      this.$Modal.confirm({
        title: '提示',
        content: '<p>是否删除该条记录?</p>',
        onOk: () => {
          deleteReplyConfig({
            id: id
          }).then(res=>{
            if(res && res.success){
              this.$Message.success(res.msg);
              this.handleSearch()
            }else{
              this.currentDetailData = {}
              this.$Message.error(res.msg);
            }
          })
        }
      });
    },
    exportData () {
      this.$refs.table.exportCsv({
        filename: 'The original data'
      });
    },
    addSure(){
      //调用子组件提交
      this.$refs.addModal.handleSubmitAdd('formData')
    },
    editSure(){
      //调用子组件提交
      this.$refs.editModal.handleSubmitEdit('formData')
    },
    clickModalResult(result){
      this.handleSearch()
      this.addModal.state = !result
    },
    editModalResult(result){
      this.handleSearch()
      this.editModal.state = !result
    },
    selectRowChange(currentRow){
      this.currentSelectRow = currentRow
    },
    setGridDefaultContent(data){
      let contentStr = ''
      data.replyContents.forEach(function(item){
        item = JSON.parse(item)
        if(item.stringType==0){
          contentStr += item.name
        }else{
          contentStr += `<div class="ivu-tag" style="background:#fee7d5"><span class="ivu-tag-text" params-id="${item.id}">${item.name}</span></div>`
        }
      });
      return contentStr
    },
  }
}
</script>

<style lang="less" scoped>
.ivu-tabs-bar{
  display: none !important;
}
.ivu-tabs-bar{
  border-bottom: none
}
.body_scroll .ivu-modal-body {
  height: 100px !important;
  overflow-y: scroll;
}
</style>
