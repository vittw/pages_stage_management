<template>
  <div class="source_warper warper_model" style="padding: 0">
    <Header>
      <template slot = "rightWarper">
        <Button type="primary" @click="handleSearch">查询</Button>
        <Button @click="handleAdd">新增</Button>
      </template>
    </Header>
    <Section>
      <template slot="table">
        <Table border highlight-row :loading="loading" :columns="columns" ref= 'table' :height="tableHight" :data="gridData" size="small"></Table>
      </template>
    </Section>
    <!-- 新增 -->
    <Modal
      v-model="addModal.state"
      :title="addModal.title"
      class-name="vertical-center-modal">
      <PostalModalAdd v-if="addModal.state" ref='addModal' @isSuccess = 'clickModalResult'></PostalModalAdd>
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
      <PostalModalEdit v-if="editModal.state" ref='editModal' :editData ='currentSelectRow' @isSuccess = 'editModalResult'></PostalModalEdit>
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
import PostalModalAdd from './postalModalAdd.vue';
import PostalModalEdit from './postalModalEdit.vue';
import { Button, Form, FormItem, Input, Select, Option, Icon, Table, RadioGroup, Radio, Page, Modal } from 'iview';
import { getOrderSource, getOrderSourceNameList } from '@/api/baseInfo/sourceSettings';
import { showDataSlice } from '@/functions/function';
import { getPostalData } from '@/api/baseInfo/postalSettings';
export default {
  name: 'business',
  components: { Header, Section, PostalModalAdd, PostalModalEdit, Button, Form, FormItem, Input, Select, Option, Table, RadioGroup, Radio, Page, Modal},
  data(){
    return {
      gridData: [],
      loading: false,
      currentSelectRow: {},
      tableHight: 100,
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
            return h('span', params.index + 1);
          }
        },
        {
          title: '省份',
          key: 'province',
          minWidth:120
        },
        {
          title: '用户编号',
          key: 'userCode',
          minWidth:150
        },
        {
          title: '用户名称',
          key: 'userName',
          minWidth:150,
        },
        {
          title: '备注',
          key: 'remark',
          minWidth:180
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
  mounted(){
    setTimeout(()=>{
      this.handleResize()
    },1000);
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
      this.loading = true,
      getPostalData().then(res=>{
        this.loading = false;
        if(res && res.success){
          this.gridData = res.data
        }else{
          this.gridData = []
        }
      });
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
      this.handleSearch()
      this.addModal.state = !result
    },
    editModalResult(result){
      this.handleSearch()
      this.editModal.state = !result
    },
  }
}
</script>

<style lang="less" scoped>
</style>
