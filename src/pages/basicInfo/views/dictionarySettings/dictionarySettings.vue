<template>
  <div class="source_warper warper">
    <Header>
      <span class="colorBlock"></span>
      <span>客服 > 工单基础配置 > 数据字典</span>
      <template slot = "rightWarper">
        <Button type="primary" @click="handleSearch">查询</Button>
        <Button @click="handleAdd">新增</Button>
        <Button @click="exportData">导出</Button>
      </template>
    </Header>
    <Section>
      <template slot="form">
        <Form inline>
          <div class="from_module">
            <FormItem label="父节点">
              <Select v-model="formItem.parentId" placeholder="请选择父节点" clearable>
                <Option v-if="parentList && parentList.length != 0" v-for="item in parentList" :value="item.parentId" :key="item.parentId">{{ item.parentName }}</Option>
              </Select>
            </FormItem>
            <FormItem label="字典值">
              <Input v-model="formItem.name" placeholder="请输入字典值" clearable ></Input>
            </FormItem>
            <FormItem label="字值code">
              <Input v-model="formItem.code" placeholder="请输入字值code" clearable ></Input>
            </FormItem>
          </div>
        </Form>
      </template>
      <template slot="table">
        <Table border highlight-row :loading="loading" :columns="columns" ref= 'table' :data="currentPageData" :height="tableHight" size="small"></Table>
      </template>
      <template slot="pages">
        <Page show-sizer :page-size='20' show-total :total="gridData.length" :current="1" @on-change = 'handleChangePage' @on-page-size-change = 'handleChangePageSize'></Page>
      </template>
    </Section>
    <!-- 新增 -->
    <Modal
      v-model="addModal.state"
      :title="addModal.title"
      class-name="vertical-center-modal">
      <DictionaryModalAdd v-if="addModal.state" ref='addModal' @isSuccess = 'clickModalResult'></DictionaryModalAdd>
      <div slot="footer">
        <Button type="text" size="large" @click="addModal.state=false">取消</Button>
        <Button type="primary" size="large" @click="addSure()">确定</Button>
      </div>
    </Modal>
    <!-- 修改 -->
    <Modal
      v-model="editModal.state"
      :title="editModal.title"
      class-name="vertical-center-modal">
      <DictionaryModalEdit v-if="editModal.state" ref='editModal' :editData ='currentSelectRow' @isSuccess = 'editModalResult'></DictionaryModalEdit>
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
import DictionaryModalAdd from './dictionaryModalAdd.vue';
import DictionaryModalEdit from './dictionaryModalEdit.vue';
import { Button,Form,FormItem,Input,Select,Option,Icon,Table,RadioGroup,Radio,Page,Modal } from 'iview';
import { getDictionary, getParentName } from '@/api/baseInfo/dictionarySettings';

import { showDataSlice } from '@/functions/function'
export default {
  name: 'business',
  components: { Header, Section, DictionaryModalAdd, DictionaryModalEdit, Button, Form, FormItem, Input, Select, Option, Table, RadioGroup, Radio, Page, Modal},
  data(){
    return {
      formItem: {
        parentId: '',
        name: '',
        code: '',
      },
      parentList: [],
      gridData: [],
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
      columns: [
        {
          type: 'selection',
          width: 50,
          align: 'center',
        },
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
          title: '父节点',
          key: 'parentName',
          minWidth:200
        },
        {
          title: '字值code',
          key: 'code',
          minWidth:150
        },
        {
          title: '字典值',
          key: 'name',
          minWidth:150,
        },
        {
          title: '是否启用',
          key: 'deletionStateCode',
          minWidth:150,
          render: (h,params) => {
            return params.row.deletionStateCode == 0 ? <span>启用</span>: <span>禁用</span>
          }
        },
        {
          title: '修改人',
          key: 'modifiedBy',
          minWidth:150,
        },
        {
          title: '修改时间',
          key: 'modifiedOn',
          minWidth:150,
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          width: 80,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                  props: {
                      type: 'primary',
                      size: 'small'
                  },
                  on: {
                    click: () => {
                      this.handleEdit(params)
                    }
                  }
              }, '编辑'),
            ]);
          }
        }
      ],
    }
  },
  computed:{
    currentPageData(){
      return showDataSlice(this.gridData, this.pageSize, this.currentPage)
    }
  },
  mounted(){
    this.handleResize()
    window.addEventListener('resize', this.handleResize, false)
    this.handleSearch()
    getParentName().then(res=>{
      if(res && res.success){
        this.parentList = res.data
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
      this.loading = true,
      getDictionary({
        parentId: this.formItem.parentId,
        name: this.formItem.name,
        code: this.formItem.code
      }).then(res=>{
        this.loading = false;
        if(res && res.success){
          this.gridData = res.data
        }else{
          this.gridData = []
        }
      });
    },
    handleChangePage(page){
      this.currentPage = page
    },
    handleChangePageSize(pageSize){
      this.pageSize = pageSize
    },
    handleAdd(){
      this.addModal.state = !this.addModal.state
    },
    handleEdit(params){
      this.currentSelectRow = params.row
      this.editModal.state = !this.editModal.state
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
      this.addModal.state = !result
      this.handleSearch()
      getParentName().then(res=>{
        if(res && res.success){
          this.parentList = res.data
        }
      })
    },
    editModalResult(result){
      this.handleSearch()
      this.editModal.state = !result
    },
    // selectRowChange(currentRow){
    //   this.currentSelectRow = currentRow
    // }
  }
}
</script>

<style lang="less" scoped>
</style>
