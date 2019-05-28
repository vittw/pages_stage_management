<template>
  <div class="source_warper warper">
    <Header>
      <span class="colorBlock"></span>
      <span>客服 > 工单基础配置 > 工单类型配置</span>
      <template slot="rightWarper">
        <Button type="primary" @click="handleSearch">查询</Button>
        <Button @click="handleAdd">新增内部工单</Button>
        <Button @click="handleEdit">编辑</Button>
        <Button @click="exportData">导出</Button>
      </template>
    </Header>
    <Section>
      <template slot="form">
        <Form inline>
          <div class="from_module">
            <FormItem label="工单类型">
              <Cascader
                :data="sourceTypeData"
                v-model="formItem.typeName"
                placeholder="请选择工单类型"
                style="width: 260px"
              ></Cascader>
            </FormItem>
            <FormItem label="是否启用">
              <Select v-model="formItem.deletionStateCode">
                <Option value="-1">全部</Option>
                <Option value="0">启用</Option>
                <Option value="1">禁用</Option>
              </Select>
            </FormItem>
          </div>
        </Form>
      </template>
      <template slot="table">
        <Table
          border
          highlight-row
          @on-current-change="selectRowChange"
          :loading="loading"
          :columns="columns"
          ref="table"
          :data="currentPageData"
          :height="tableHight"
          size="small"
        ></Table>
      </template>
      <template slot="pages">
        <Page
          show-sizer
          :page-size="20"
          show-total
          :total="gridData.length"
          :current="1"
          @on-change="handleChangePage"
          @on-page-size-change="handleChangePageSize"
        ></Page>
      </template>
    </Section>
    <!-- 新增 -->
    <Modal v-model="addModal.state" :title="addModal.title" class-name="vertical-center-modal">
      <TypeModalAdd ref="addModal" v-if="addModal.state" @isSuccess="clickModalResult"></TypeModalAdd>
      <div slot="footer">
        <Button type="text" size="large" @click="addModal.state=false">取消</Button>
        <Button type="primary" size="large" @click="addSure()">确定</Button>
      </div>
    </Modal>
    <!-- 修改 -->
    <Modal
      v-model="editModal.state"
      :title="editModal.title"
      class-name="vertical-center-modal"
      width="800"
    >
      <TypeModalEdit v-if="editModal.state" ref="editModal" @isSuccess="editModalResult"></TypeModalEdit>
      <div slot="footer">
        <Button type="text" size="large" @click="editModal.state=false">取消</Button>
        <Button type="primary" size="large" @click="editSure()">更新</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Header from "@/components/header";
import Section from "@/components/section";
import TypeModalAdd from "./typeModalAdd.vue";
import TypeModalEdit from "./typeModalEdit.vue";
import {
  Button,
  Form,
  FormItem,
  Input,
  Select,
  Option,
  Icon,
  Table,
  RadioGroup,
  Radio,
  Page,
  Modal,
  Cascader
} from "iview";
import {
  getTypesData,
  getAllType,
  getFirstType,
  getSecondType,
  getThirdType
} from "@/api/baseInfo/typeSettings";
import { showDataSlice } from "@/functions/function";
export default {
  name: "business",
  components: {
    Header,
    Section,
    TypeModalAdd,
    TypeModalEdit,
    Button,
    Form,
    FormItem,
    Input,
    Select,
    Option,
    Table,
    RadioGroup,
    Radio,
    Page,
    Modal,
    Cascader
  },
  data() {
    return {
      sourceTypeData: [],
      formItem: {
        typeName: [], //来源名称，
        deletionStateCode: "0"
      },
      nameList: [],
      gridData: [],
      loading: false,
      currentSelectRow: {},
      tableHight: 100,
      currentPage: 1,
      pageSize: 20,
      addModal: {
        state: false,
        title: "新增内部工单"
      },
      editModal: {
        state: false,
        title: "修改"
      },
      columns: [
        {
          type: "selection",
          width: 50,
          align: "center"
        },
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
          title: "工单类型（一级）",
          key: "typeName",
          minWidth: 200
        },
        {
          title: "工单类型（二级）",
          key: "secondName",
          minWidth: 150
        },
        {
          title: "工单类型（三级）",
          key: "threeName",
          minWidth: 150
        },
        {
          title: "是否启用",
          key: "deletionStateCode",
          minWidth: 150,
          render: (h, params) => {
            return params.row.deletionStateCode == 0 ? (
              <span style="color:green">启用</span>
            ) : (
              <span style="color:red">禁用</span>
            );
          }
        },
        {
          title: "录入时间",
          key: "createOn",
          minWidth: 150
        },
        {
          title: "修改时间",
          key: "modifiedOn",
          minWidth: 150
        },
        {
          title: "录入人",
          key: "createBy",
          minWidth: 150
        }
        // {
        //   title: '录入网点',
        //   key: 'createSite',
        //   minWidth:180
        // }
      ]
    };
  },
  computed: {
    currentPageData() {
      return showDataSlice(this.gridData, this.pageSize, this.currentPage);
    }
  },
  mounted() {
    this.handleResize();
    window.addEventListener("resize", this.handleResize, false);
    this.handleSearch();
    this.handleGetAllType();
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
    handleGetAllType() {
      getAllType().then(res => {
        if (res && res.success) {
          this.sourceTypeData = res.data;
        }
      });
    },
    handleSearch() {
      (this.loading = true),
        getTypesData({
          typeCode: this.formItem.typeName[0],
          secondCode: this.formItem.typeName[1],
          threeCode: this.formItem.typeName[2],
          DeletionStateCode: this.formItem.deletionStateCode
        }).then(res => {
          this.loading = false;
          if (res && res.success) {
            console.log(res.data);
            this.gridData = res.data;
          } else {
            this.gridData = [];
          }
        });
    },
    handleChangePage(page) {
      this.currentPage = page;
    },
    handleChangePageSize(pageSize) {
      this.pageSize = pageSize;
    },
    handleAdd() {
      this.addModal.state = !this.addModal.state;
    },
    handleEdit() {
      this.editModal.state = !this.editModal.state;
    },
    exportData() {
      this.$refs.table.exportCsv({
        filename: "The original data"
      });
    },
    addSure() {
      //调用子组件提交
      this.$refs.addModal.handleSubmitAdd("thirdTypeFormData");
    },
    editSure() {
      //调用子组件提交
      this.$refs.editModal.handleSubmitEdit("formData");
    },
    clickModalResult(result) {
      this.handleSearch();
      this.handleGetAllType();
      this.addModal.state = !result;
    },
    editModalResult(result) {
      this.handleSearch();
      this.handleGetAllType();
      this.editModal.state = !result;
    },
    selectRowChange(currentRow) {
      this.currentSelectRow = currentRow;
    }
  }
};
</script>

<style lang="less" scoped>
</style>
