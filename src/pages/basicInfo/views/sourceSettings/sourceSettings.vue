<template>
  <div class="source_warper warper">
    <Header>
      <span class="colorBlock"></span>
      <span>客服 > 工单基础配置 > 工单来源配置</span>
      <template slot="rightWarper">
        <Button type="primary" @click="handleSearch">查询</Button>
        <Button @click="handleAdd">新增</Button>
        <Button @click="exportData">导出</Button>
      </template>
    </Header>
    <Section>
      <template slot="form">
        <Form inline>
          <div class="from_module">
            <FormItem label="来源名称">
              <Select v-model="formItem.dataSourceId" placeholder="请选择来源名称" clearable>
                <Option
                  v-if="nameList && nameList.length != 0"
                  v-for="item in nameList"
                  :value="item.dataSourceId"
                  :key="item.dataSourceId"
                >{{ item.dataSourceName }}</Option>
              </Select>
            </FormItem>
            <FormItem label="appkey">
              <Input v-model="formItem.appkey" placeholder="请输入appkey" clearable></Input>
            </FormItem>
            <FormItem label="来源类型">
              <Select v-model="formItem.dataSourceType">
                <Option value="all">全部</Option>
                <Option value="1">内部</Option>
                <Option value="2">外部</Option>
              </Select>
            </FormItem>
            <FormItem label="是否启用">
              <Select v-model="formItem.deletionStateCode">
                <Option value="all">全部</Option>
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
      <SourceModalAdd v-if="addModal.state" ref="addModal" @isSuccess="clickModalResult"></SourceModalAdd>
      <div slot="footer">
        <Button type="text" size="large" @click="addModal.state=false">取消</Button>
        <Button type="primary" size="large" @click="addSure()">确定</Button>
      </div>
    </Modal>
    <!-- 修改 -->
    <Modal v-model="editModal.state" :title="editModal.title" class-name="vertical-center-modal">
      <SourceModalEdit
        v-if="editModal.state"
        ref="editModal"
        :editData="currentSelectRow"
        @isSuccess="editModalResult"
      ></SourceModalEdit>
      <div slot="footer">
        <Button type="text" size="large" @click="editModal.state=false">取消</Button>
        <Button type="primary" size="large" @click="editSure()">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Header from "@/components/header";
import Section from "@/components/section";
import SourceModalAdd from "./sourceModalAdd.vue";
import SourceModalEdit from "./sourceModalEdit.vue";
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
  Modal
} from "iview";
import {
  getOrderSource,
  getOrderSourceNameList
} from "@/api/baseInfo/sourceSettings";
import { showDataSlice } from "@/functions/function";
export default {
  name: "business",
  components: {
    Header,
    Section,
    SourceModalAdd,
    SourceModalEdit,
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
    Modal
  },
  data() {
    return {
      formItem: {
        dataSourceId: "", //来源名称
        appkey: "", //appkey
        dataSourceType: "all", //来源类型
        deletionStateCode: "all" //是否启用
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
        title: "新增"
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
          title: "工单来源",
          key: "dataSourceName",
          minWidth: 200
        },
        {
          title: "appkey",
          key: "appkey",
          minWidth: 150
        },
        {
          title: "appsecret",
          key: "appsecret",
          minWidth: 150
        },
        {
          title: "来源类型",
          key: "dataSourceType",
          minWidth: 100,
          render: (h, params) => {
            return params.row.dataSourceType == 1 ? (
              <span>内部</span>
            ) : (
              <span>外部</span>
            );
          }
        },
        {
          title: "是否启用",
          key: "deletionStateCode",
          minWidth: 150,
          render: (h, params) => {
            return params.row.deletionStateCode == 0 ? (
              <span>启用</span>
            ) : (
              <span>禁用</span>
            );
          }
        },

        {
          title: "创建时间",
          key: "createOn",
          minWidth: 180
        },
        {
          title: "修改时间",
          key: "modifiedOn",
          minWidth: 180
        },
        {
          title: "创建人",
          key: "createBy",
          minWidth: 100
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          fixed: "right",
          width: 80,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.handleEdit(params);
                    }
                  }
                },
                "编辑"
              )
            ]);
          }
        }
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
    getOrderSourceNameList().then(res => {
      if (res && res.success) {
        this.nameList = res.data;
      }
    });
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
    handleSearch() {
      this.currentPage = 1;
      (this.loading = true),
        getOrderSource({
          dataSourceId: this.formItem.dataSourceId,
          appkey: this.formItem.appkey,
          dataSourceType:
            this.formItem.dataSourceType == "all"
              ? null
              : this.formItem.dataSourceType,
          deletionStateCode:
            this.formItem.deletionStateCode == "all"
              ? null
              : this.formItem.deletionStateCode
        }).then(res => {
          this.loading = false;
          if (res && res.success) {
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
    handleEdit(params) {
      this.currentSelectRow = params.row;
      this.editModal.state = !this.editModal.state;
      // if(JSON.stringify(this.currentSelectRow) !== "{}"){
      //   this.editModal.state = !this.editModal.state
      // } else {
      //   this.$Message.error('请先选择要修改的数据!');
      // }
    },
    exportData() {
      this.$refs.table.exportCsv({
        filename: "The original data"
      });
    },
    addSure() {
      //调用子组件提交
      this.$refs.addModal.handleSubmitAdd("formData");
    },
    editSure() {
      //调用子组件提交
      this.$refs.editModal.handleSubmitEdit("formData");
    },
    clickModalResult(result) {
      this.handleSearch();
      this.addModal.state = !result;
    },
    editModalResult(result) {
      this.handleSearch();
      this.editModal.state = !result;
    }
    // selectRowChange(currentRow){
    //   this.currentSelectRow = currentRow
    // }
  }
};
</script>

<style lang="less" scoped>
</style>
