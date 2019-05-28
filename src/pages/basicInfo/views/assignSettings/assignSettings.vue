<template>
  <div class="source_warper warper">
    <Header>
      <span class="colorBlock"></span>
      <span>客服 > 工单基础配置 > 工单分配配置</span>
      <template slot="rightWarper">
        <Button type="info" @click="ShowHelper()">帮助说明</Button>
        <Button type="primary" @click="handleSearch">查询</Button>
        <Button @click="handleAddDefalut" v-if="this.gridType==1">默认处理人配置</Button>
        <Button @click="handleAssign" v-if="this.gridType==0||this.gridType==2">分配</Button>
        <Button @click="postalModal.state=!postalModal.state" v-if="this.roleType==1">邮政处理配置</Button>
        <!-- <Button @click="exportData" v-if="this.gridType==0||this.gridType==2">导出</Button> -->
      </template>
    </Header>
    <Section>
      <template slot="form">
        <Form inline>
          <div class="from_module">
            <FormItem label="来源名称" v-if="this.gridType==0||this.gridType==2">
              <Select v-model="formItem.dataSourceId" placeholder="请选择来源名称" clearable>
                <Option
                  v-if="nameList && nameList.length != 0"
                  v-for="item in nameList"
                  :value="item.dataSourceId"
                  :key="item.dataSourceId"
                >{{ item.dataSourceName }}</Option>
              </Select>
            </FormItem>
            <FormItem label="网点名称" v-if="this.gridType==1">
              <Select
                v-model="formItem.siteCode"
                filterable
                remote
                clearable
                :remote-method="handleRemoteDefaultForm"
                :loading="defaultAssignForm.loading"
              >
                <Option
                  v-for="(option, index) in defaultAssignForm.options"
                  :value="option.Key"
                  :key="index"
                >{{option.Value}}</Option>
              </Select>
            </FormItem>
            <FormItem label="处理人员" v-if="this.gridType==0||this.gridType==2">
              <Select
                v-model="formItem.userId"
                filterable
                remote
                clearable
                :label-in-value="true"
                :remote-method="handleRemoteDefault"
                :loading="defaultAssign.loading"
              >
                <Option
                  v-for="(option, index) in defaultAssign.options"
                  :value="option.Key"
                  :key="index"
                >{{option.Value}}</Option>
              </Select>
            </FormItem>
            <FormItem label="工单类型" v-if="this.gridType==0||this.gridType==2">
              <Cascader
                v-model="formItem.source"
                :data="sourceTypeData"
                placeholder="请选择工单类型"
                style="width: 260px"
              ></Cascader>
            </FormItem>
          </div>
          <ButtonGroup>
            <Button
              v-for="(item,index) in gridTxt"
              :key="index"
              :type="checkType(index)"
              @click="changeGrid(index)"
            >{{item}}</Button>
          </ButtonGroup>
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
    <!-- 新增默认处理人 -->
    <Modal
      v-model="addDefaultModal.state"
      :title="addDefaultModal.title"
      class-name="vertical-center-modal"
    >
      <Form label-position="left" :label-width="100">
        <Row :gutter="32">
          <Col span="32">
            <FormItem label="默认处理人" label-position="left">
              <Select
                v-model="defaultAssign.id"
                filterable
                remote
                clearable
                :label-in-value="true"
                @on-change="changeRemoteDefaultName"
                :remote-method="handleRemoteDefault"
                :loading="defaultAssign.loading"
              >
                <Option
                  v-for="(option, index) in defaultAssign.options"
                  :value="option.Key"
                  :key="index"
                >{{option.Value}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="addDefaultModal.state=false">取消</Button>
        <Button type="primary" size="large" @click="editDefaultSure()">确定</Button>
      </div>
    </Modal>
    <!-- 分配 -->
    <Modal
      v-model="addModal.state"
      :title="addModal.title"
      class-name="vertical-center-modal"
      width="800"
    >
      <AddAssignModal
        v-if="addModal.state"
        ref="addModal"
        :isRoot="roleType == 1"
        @isSuccess="clickModalResult"
      ></AddAssignModal>
      <div slot="footer">
        <Button type="text" size="large" @click="addModal.state=false">取消</Button>
        <Button type="primary" size="large" @click="addSure()">确定</Button>
      </div>
    </Modal>
    <!-- 修改 -->
    <Modal v-model="editModal.state" :title="editModal.title" class-name="vertical-center-modal">
      <EditAssignModal
        v-if="editModal.state"
        ref="editModal"
        :isExpert="gridType==2"
        :editData="currentSelectRow"
        @isSuccess="editModalResult"
      ></EditAssignModal>
      <div slot="footer">
        <Button type="text" size="large" @click="editModal.state=false">取消</Button>
        <Button type="primary" size="large" @click="editSure()">确定</Button>
      </div>
    </Modal>
    <!-- 邮政处理配置 -->
    <Modal v-model="postalModal.state" fullscreen footer-hide :title="postalModal.title">
      <PostalSettings></PostalSettings>
    </Modal>
    <Modal v-model="Helper.State" class-name="vertical-center-modal">
      <p slot="header">{{Helper.title}}</p>
      <div style="height: 400px;">
        <P style="font-size: 16px; font-weight: bold; color: rgb(70, 76, 91);">一、工单分配流程：</P>
        <P style="color: rgb(101, 113, 128);">1、系统首先判断普通处理人是否分配过工单类型，如果配置过工单类型，且普通处理人在线则此类型工单下发至普通处理人。</P>
        <P style="color: rgb(101, 113, 128);">2、如果普通处理人没有分配过任何工单类型，则判断默认处理人是否进行配置，默认处理人已配置且在线，工单下发至默认处理人处理。</P>
        <P style="color: rgb(101, 113, 128);">3、处理人均不在线（包含普通处理人、默认处理人），若网点备案则工单下发至上级省区处理；无备案则正常下发至网点。</P>
        <P style="font-size: 16px; font-weight: bold; color: rgb(70, 76, 91);">二、注意事项：</P>
        <P style="font-size: 14px; font-weight: bold; color: rgb(70, 76, 91);">1、不配置处理人情况（<span style="color:red;">处理人包含：默认处理人、普通处理人</span>）</P>
        <P style="color: rgb(101, 113, 128);">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如网点不进行任何工单处理人的配置，工单也是会正常下发，并且所有的处理人员在工单处理页面都可以看到工单，当前工单处理人会根据第一个首跟或第一个处理人员进行匹配。</P>
        <P style="font-size: 14px; font-weight: bold; color: rgb(70, 76, 91);">2、客服人员少可以不配置处理人</P>
        <P style="color: rgb(101, 113, 128);">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;【举例说明】若网点处理人只有一位，则只需进行默认处理人配置；或者不进行配置。</P>
        <P style="font-size: 14px; font-weight: bold; color: rgb(70, 76, 91);">3、网点客服人员多并且有分工，不同人员处理不同类型的工单时可以配置</P>
        <P style="font-size: 14px; font-weight: bold; color: rgb(70, 76, 91);">4、已配置处理人不在线</P>
        <P style="color: rgb(101, 113, 128);">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;网点配置过处理人但处理人不在线时工单下发到网点，该网点都能处理</P>
        <P style="color: rgb(101, 113, 128);">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;举例说明】若本网点处理人仅配置了两个员工，A员工及B员工，若A员工不在线但B员工在线则工单下发至B员工处理。</P>
        
      </div>
    </Modal>
  </div>
</template>

<script>
import Header from "@/components/header";
import Section from "@/components/section";
import AddAssignModal from "./addAssignModal.vue";
import EditAssignModal from "./editAssignModal.vue";
import PostalSettings from "../postalSettings"; //邮政处理
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
import { getOrderSourceNameList } from "@/api/baseInfo/sourceSettings";
import { getAllType } from "@/api/baseInfo/typeSettings";
import {
  getAssignDataAll,
  getAssignDataDefault,
  getAssignDataExpert,
  editAssignDefault,
  getUserByOrganize,
  getSiteByKey,
  getAssignState,
  DeleteAllotBySourcecType,
  DeleteDefaultBySourcecType,
  DeleteExpertSeatsBySourcecType
} from "@/api/baseInfo/assignSettings";
import { showDataSlice } from "@/functions/function";
export default {
  name: "business",
  components: {
    Header,
    Section,
    AddAssignModal,
    EditAssignModal,
    PostalSettings,
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
      Helper: {
        State: false,
        title: "工单分配配置菜单使用说明："
      },
      roleType: 0, //角色权限 0 - 网点和省区  1 - 总部
      gridType: 0, //表格类型 0 - 总部  1 - 默认处理人  2 -  专家坐席
      sourceTypeData: [],
      formItem: {
        dataSourceId: "", //来源名称
        source: [], //工单类型
        userId: "", //员工ID
        siteCode: "" //网点编码
      },
      nameList: [],
      gridData: [],
      loading: false,
      currentSelectRow: {},
      tableHight: 100,
      currentPage: 1,
      pageSize: 20,
      addDefaultModal: {
        state: false,
        title: "默认处理人配置"
      },
      defaultAssign: {
        id: "",
        name: "",
        loading: false,
        options: []
      },
      defaultAssignForm: {
        loading: false,
        options: []
      },
      addModal: {
        state: false,
        title: "分配"
      },
      editModal: {
        state: false,
        title: "修改"
      },
      postalModal: {
        state: false,
        title: "邮政处理配置"
      },
      columnsAll: [
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
          title: "工单类型（一级）",
          key: "typeName",
          minWidth: 150
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
          title: "处理人员",
          key: "userName",
          minWidth: 180
        },
        {
          title: "创建网点",
          key: "createSiteName",
          minWidth: 160
        },
        {
          title: "创建人",
          key: "createBy",
          minWidth: 150
        },
        {
          title: "创建时间",
          key: "createOn",
          minWidth: 180
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          fixed: "right",
          width: 140,
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
                      this.handleEdit(params);
                    }
                  }
                },
                "编辑"
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
                      this.handleDelete(params);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      columnsDefault: [
        {
          type: "selection",
          width: 50,
          align: "center"
        },
        {
          title: "网点名称",
          key: "createSiteName",
          minWidth: 200
        },
        {
          title: "默认处理人",
          key: "userName",
          minWidth: 150
        },
        {
          title: "创建时间",
          key: "createOn",
          minWidth: 150
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
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.handleDelete(params);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      columnsExpert: [
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
          title: "工单类型（一级）",
          key: "typeName",
          minWidth: 150
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
          title: "专家座席",
          key: "userName",
          minWidth: 180
        },
        {
          title: "创建网点",
          key: "createSiteName",
          minWidth: 160
        },
        {
          title: "创建人",
          key: "createBy",
          minWidth: 150
        },
        {
          title: "创建时间",
          key: "createOn",
          minWidth: 180
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          fixed: "right",
          width: 140,
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
                      this.handleEdit(params);
                    }
                  }
                },
                "编辑"
              ),
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
                      this.handleDelete(params);
                    }
                  }
                },
                "删除"
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
    },
    columns() {
      if (this.gridType == 0) {
        return this.columnsAll;
      } else if (this.gridType == 1) {
        return this.columnsDefault;
      } else if (this.gridType == 2) {
        return this.columnsExpert;
      }
    },
    gridTxt() {
      if (this.roleType == 0) {
        //省区或者网点
        return ["普通处理人", "默认处理人"];
      } else if (this.roleType == 1) {
        //总部
        return ["普通处理人", "默认处理人", "专家坐席"];
      }
    }
  },
  created() {
    if (
      this.$store.state.companyCode == "2155" ||
      this.$store.state.companyCode == "800302"
    ) {
      this.roleType = 1;
    }

    console.log(this.roleType);
    console.log(this.gridType);
  },
  watch: {
    gridType() {
      this.handleSearch();
    }
  },
  mounted() {
    this.handleResize();
    window.addEventListener("resize", this.handleResize, false);
    this.handleGetAllType();
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
    ShowHelper() {
      this.Helper.State = true;
    },
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
      this.currentPage = 1;
      this.loading = true;
      if (this.gridType == 0) {
        getAssignDataAll({
          dataSourceId: this.formItem.dataSourceId,
          userId: this.formItem.userId,
          typeCode: this.formItem.source[0],
          secondCode: this.formItem.source[1],
          threeCode: this.formItem.source[2]
        }).then(res => {
          this.loading = false;
          if (res && res.success) {
            this.gridData = res.data;
          } else {
            this.gridData = [];
          }
        });
      } else if (this.gridType == 1) {
        getAssignDataDefault({
          siteCode: this.formItem.siteCode
        }).then(res => {
          this.loading = false;
          if (res && res.success) {
            this.gridData = res.data;
          } else {
            this.gridData = [];
          }
        });
      } else if (this.gridType == 2) {
        getAssignDataExpert({
          dataSourceId: this.formItem.dataSourceId,
          userId: this.formItem.userId,
          typeCode: this.formItem.source[0],
          secondCode: this.formItem.source[1],
          threeCode: this.formItem.source[2]
        }).then(res => {
          this.loading = false;
          if (res && res.success) {
            this.gridData = res.data;
          } else {
            this.gridData = [];
          }
        });
      }
    },
    handleChangePage(page) {
      this.currentPage = page;
    },
    handleChangePageSize(pageSize) {
      this.pageSize = pageSize;
    },
    handleAssign() {
      //判断是否去后台请求验证过 - 默认 false
      console.log(this.$store.state.isRequestSetAssign);
      if (!this.$store.state.isRequestSetAssign) {
        getAssignState({
          siteCode: this.$store.state.companyCode
        }).then(res => {
          if (res && res.success) {
            this.$store.commit("setIsRequest", true);
            this.$store.commit("setIsAssigndo", res.success);
            this.handleDoAssign(this.$store.state.isDoAssign);
          } else {
            this.$store.commit("setIsRequest", false);
            this.handleDoAssign(this.$store.state.isDoAssign);
          }
        });
      } else {
        this.handleDoAssign(this.$store.state.isDoAssign);
      }
    },
    //根据store状态判断是否能否分配
    handleDoAssign(state) {
      if (state) {
        this.addModal.state = !this.addModal.state;
      } else {
        this.$Modal.warning({
          title: "操作提示",
          content:
            "未设置默认处理人不能进行分配操作,请点击右上角默认处理人设置。"
        });
        this.gridType = 1;
      }
    },
    handleAddDefalut() {
      this.addDefaultModal.state = !this.addDefaultModal.state;
    },
    handleRemoteDefault(query) {
      if (query !== "") {
        this.defaultAssign.loading = true;
        getUserByOrganize({
          key: query
        }).then(res => {
          this.defaultAssign.loading = false;
          if (res && res.success) {
            this.defaultAssign.options = res.data;
          } else {
            this.defaultAssign.options = [];
          }
        });
      } else {
        this.defaultAssign.options = [];
      }
    },
    //删除
    handleDelete(params) {
      let postParams = {
        DataSourceId: params.row.dataSourceId,
        ThreeCode: params.row.threeCode
      };
      if (this.gridType == 0) {
        DeleteAllotBySourcecType(postParams).then(res => {
          if (res.success) {
            this.$Message.success(res.msg);
          } else {
            this.$Message.error(res.msg);
          }
          this.handleSearch();
        });
      } else if (this.gridType == 1) {
        DeleteDefaultBySourcecType({
          SiteName: params.row.createSiteName,
          Id: params.row.id
        }).then(res => {
          if (res.success) {
            this.$Message.success(res.msg);
          } else {
            this.$Message.error(res.msg);
          }
          this.handleSearch();
        });
      } else if (this.gridType == 2) {
        DeleteExpertSeatsBySourcecType(postParams).then(res => {
          if (res.success) {
            this.$Message.success(res.msg);
          } else {
            this.$Message.error(res.msg);
          }
          this.handleSearch();
        });
      }
    },
    changeRemoteDefaultName(options) {
      if (options) {
        this.defaultAssign.name = options.label;
      } else {
        this.defaultAssign.id = "";
        this.defaultAssign.name = "";
      }
    },
    handleRemoteDefaultForm(query) {
      if (query !== "") {
        this.defaultAssignForm.loading = true;
        getSiteByKey({
          key: query
        }).then(res => {
          this.defaultAssignForm.loading = false;
          if (res && res.success) {
            this.defaultAssignForm.options = res.data;
          } else {
            this.defaultAssignForm.options = [];
          }
        });
      } else {
        this.defaultAssignForm.options = [];
      }
    },
    editDefaultSure() {
      editAssignDefault({
        userId: this.defaultAssign.id,
        userName: this.defaultAssign.name.split("|")[0]
      }).then(res => {
        if (res && res.success) {
          this.$Message.success(res.msg);
          this.addDefaultModal.state = false;
          this.handleSearch();
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
    handleEdit(params) {
      if (params.row.siteCode !== this.$store.state.companyCode) {
        this.$Modal.warning({
          title: "操作提示",
          content: "非本网点数据，不能进行编辑操作"
        });
      } else {
        this.currentSelectRow = params.row;
        this.editModal.state = !this.editModal.state;
      }
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
    },
    checkType(index) {
      if (index == this.gridType) {
        return "primary";
      } else {
        return;
      }
    },
    changeGrid(index) {
      this.gridType = index;
    }
  }
};
</script>

<style lang="less" scoped>
.ivu-alert-warning {
  text-align: left;
}
.ivu-btn-group-default {
  text-align: left;
  margin-bottom: 10px;
  display: flex;
  justify-content: flex-start;
}
.ivu-select-item {
  text-align: left;
}
</style>
