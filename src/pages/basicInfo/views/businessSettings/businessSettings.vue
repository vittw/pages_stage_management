<template>
  <div class="source_warper warper">
    <Header>
      <span class="colorBlock"></span>
      <span>客服 > 工单基础配置 > 工单业务配置</span>
      <template slot="rightWarper">
        <Button type="primary" @click="handleSearch">查询</Button>
        <Button @click="handleAdd">新增</Button>
        <!-- <Button @click="handleEdit">修改</Button> -->
        <!-- <Button @click="exportData">导出</Button> -->
      </template>
    </Header>
    <Section>
      <template slot="form">
        <Form inline>
          <div class="from_module">
            <FormItem label="来源名称">
              <Select v-model="formItem.dataSourceId" clearable placeholder="请选择来源名称">
                <Option
                  v-if="nameList && nameList.length != 0"
                  v-for="item in nameList"
                  :value="item.dataSourceId"
                  :key="item.dataSourceId"
                >{{ item.dataSourceName }}</Option>
              </Select>
            </FormItem>
            <FormItem label="是否启用">
              <Select v-model="formItem.deletionStateCode">
                <Option value="-1">全部</Option>
                <Option value="0">启用</Option>
                <Option value="1">禁用</Option>
              </Select>
            </FormItem>
            <!-- 工单类型 -->
            <FormItem label="工单类型">
              <Cascader
                :data="sourceTypeData"
                v-model="formItem.typeCode"
                placeholder="请选择工单类型"
                style="width: 260px"
              ></Cascader>
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
          :data="gridData"
          :height="tableHight"
          size="small"
        ></Table>
      </template>
      <template slot="pages">
        <Page
          show-sizer
          :page-size="pageSize"
          show-total
          :total="gridTotalNub"
          :current="currentPage"
          @on-change="handleChangePage"
          @on-page-size-change="handleChangePageSize"
        ></Page>
      </template>
    </Section>
    <!-- 新增 -->
    <Modal
      v-model="addModal.state"
      :title="addModal.title"
      width="800"
      :scrollable="true"
      :mask-closable="false"
      class-name="vertical-center-modal body_scroll"
    >
      <AddModal
        v-if="addModal.state"
        ref="addModal"
        @changePane="changePane"
        @isSuccess="clickModalResult"
      ></AddModal>
      <div slot="footer">
        <Button type="text" size="large" @click="addModal.state=false">取消</Button>
        <Button
          type="primary"
          size="large"
          @click="addFirstStep"
          v-if="currentPane=='firstPane'"
        >下一步</Button>
        <Button
          type="text"
          size="large"
          @click="addPreviousStep"
          v-if="currentPane=='secondPane'"
        >上一步</Button>
        <Button type="primary" size="large" @click="addSure" v-if="currentPane=='secondPane'">确定</Button>
      </div>
    </Modal>

    <!-- 修改 -->
    <Modal
      v-model="editModal.state"
      :title="editModal.title"
      width="800"
      :mask-closable="false"
      class-name="vertical-center-modal"
    >
      <editModal
        v-if="editModal.state"
        ref="editModal"
        :detailData="currentDetailData"
        @isSuccess="editModalResult"
      ></editModal>
      <div slot="footer">
        <Button type="text" size="large" @click="editModal.state=false">取消</Button>
        <Button type="primary" size="large" @click="editSure()">确定</Button>
      </div>
    </Modal>
    <!-- 详情 -->
    <Modal
      v-model="detailModal.state"
      :title="detailModal.title"
      width="805"
      :footer-hide="true"
      :mask-closable="false"
      class-name="vertical-center-modal"
    >
      <DetailModal v-if="detailModal.state" :detailData="currentDetailData"></DetailModal>
    </Modal>
  </div>
</template>

<script>
import Header from "@/components/header";
import Section from "@/components/section";
import AddModal from "./addModal.vue";
import EditModal from "./editModal.vue";
import DetailModal from "./detailModal.vue";
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
import { getOrderSourceNameList } from "@/api/baseInfo/sourceSettings";
import {
  getBusinessConfig,
  getBusinessConfigById,
  DeleteById,
  getAllType
} from "@/api/baseInfo/businessSettings";
export default {
  name: "business",
  components: {
    Header,
    Section,
    AddModal,
    DetailModal,
    EditModal,
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
        dataSourceId: "", //来源名称,
        deletionStateCode: "0", // 是否禁用状态：0 未禁用，1 已禁用
        typeCode:""
      },
      nameList: [],
      sourceTypeData:[],
      currentPane: "firstPane",
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
        title: "新增"
      },
      editModal: {
        state: false,
        title: "修改"
      },
      detailModal: {
        state: false,
        title: "详情"
      },
      columns: [
        {
          type: "selection",
          width: 50,
          align: "center"
        },
        {
          type: "index1",
          width: 60,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              params.index + (this.currentPage - 1) * this.pageSize + 1
            );
          }
        },
        {
          title: "工单来源",
          key: "dataSourceName",
          minWidth: 160
        },
        {
          title: "工单编号（外部）",
          key: "code",
          minWidth: 160
        },
        {
          title: "工单大类（外部）",
          key: "bigType",
          minWidth: 160
        },
        {
          title: "工单小类（外部）",
          key: "smallType",
          minWidth: 160
        },
        {
          title: "工单类型（一级）",
          key: "firstName",
          minWidth: 160
        },

        {
          title: "工单类型（二级）",
          key: "secondName",
          minWidth: 160
        },
        {
          title: "工单类型（三级）",
          key: "threeName",
          minWidth: 160
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
          title: "创建时间",
          key: "createOn",
          minWidth: 180
        },
        {
          title: "创建人",
          key: "createBy",
          minWidth: 100
        },
        {
          title: "修改时间",
          key: "modifiedOn",
          minWidth: 180
        },
        {
          title: "修改人",
          key: "modifiedBy",
          minWidth: 100
        },
        {
          title: "操作",
          key: "action",
          slot: "action",
          width: 170,
          fixed: "right",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.handleDetail(params.row.id);
                    }
                  }
                },
                "详情"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.handleEdit(params.row.id);
                    }
                  }
                },
                "修改"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  style: {
                    "background-color": params.row.deletionStateCode
                      ? "green"
                      : "red",
                    "border-color": params.row.deletionStateCode
                      ? "green"
                      : "red"
                  },
                  on: {
                    click: () => {
                      this.handleDelete(params);
                    }
                  }
                },
                params.row.deletionStateCode ? "启用" : "禁用"
              )
            ]);
          }
        }
      ]
    };
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
    this.handleGetAllType();
  },
  watch: {
    "addModal.state": {
      deep: true,
      handler: function(newVal, oldVal) {
        if (!newVal) {
          this.currentPane = "firstPane";
        }
      }
    }
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
      this.loading = true;
      getBusinessConfig({
        data: {
          dataSourceId: this.formItem.dataSourceId,
          DeletionStateCode: this.formItem.deletionStateCode,
          typeCode:this.formItem.typeCode[2]
        },
        PageNo: this.currentPage,
        pageSize: this.pageSize
      }).then(res => {
        this.loading = false;
        if (res && res.success) {
          this.gridData = res.data;
          this.gridTotalNub = res.rowCount;
        } else {
          this.gridData = [];
          this.gridTotalNub = 0;
        }
      });
    },
    handleChangePage(page) {
      this.currentPage = page;
      this.handleSearch();
    },
    handleChangePageSize(pageSize) {
      this.pageSize = pageSize;
      this.handleSearch();
    },
    handleAdd() {
      this.addModal.state = !this.addModal.state;
    },
    handleEdit(id) {
      this.currentDetailData = {};
      getBusinessConfigById({
        Id: id
      }).then(res => {
        if (res && res.success) {
          this.editModal.state = !this.editModal.state;
          this.currentDetailData = res.data;
          console.log(res);
        } else {
          this.currentDetailData = {};
          this.$Message.error(res.msg);
        }
      });
    },
    handleDetail(id) {
      this.currentDetailData = {};
      getBusinessConfigById({
        Id: id
      }).then(res => {
        if (res && res.success) {
          console.log(res);
          this.detailModal.state = !this.detailModal.state;
          this.currentDetailData = res.data;
        } else {
          this.currentDetailData = {};
          this.$Message.error(res.msg);
        }
      });
    },
    handleDelete(params) {
      let type = params.row.deletionStateCode ? "启用" : "禁用";
      this.$Modal.confirm({
        title: `操作确认`,
        content: `是否 ${type} 该条目`,
        cancelText: `取消`,
        okText: `确定`,
        loading: true,
        onOk: () => {
          DeleteById({
            id: params.row.id,
            deletionStateCode: Number(!params.row.deletionStateCode)
          }).then(res => {
            if (res.success) {
              this.$Message.success(res.msg);
              params.row.deletionStateCode = Number(
                !params.row.deletionStateCode
              );
            } else {
              this.$Message.error(res.msg);
            }
            this.$Modal.remove();
            console.log(res);
          });
        }
      });
    },
    addFirstStep() {
      //调用子组件第一步提交
      this.$refs.addModal.handleFirstStep("firstFormData");
    },
    addPreviousStep() {
      this.currentPane = "firstPane";
    },
    addSure() {
      //调用子组件提交
      this.$refs.addModal.handleSubmitAdd();
    },
    editSure() {
      //调用子组件提交
      this.$refs.editModal.handleSubmitEdit();
    },
    clickModalResult(result) {
      this.handleSearch();
      this.currentPane = "firstPane";
      this.addModal.state = !result;
    },
    editModalResult(result) {
      this.handleSearch();
      this.editModal.state = !result;
    },
    selectRowChange(currentRow) {
      this.currentSelectRow = currentRow;
    },
    changePane(pane) {
      this.currentPane = pane;
    }
  }
};
</script>

<style lang="less" scoped>
.ivu-tabs-bar {
  display: none !important;
}
.ivu-tabs-bar {
  border-bottom: none;
}
.body_scroll .ivu-modal-body {
  height: 100px !important;
  overflow-y: scroll;
}
</style>
