<template>
  <div class="query_outBox" style>
    <div class="query_header" style>
      <div class="query_header_left">
        <span class="colorBlock"></span>
        <span>客服 > 工单管理 > 工单查询</span>
      </div>
      <div class="query_header_right">
        <Button type="primary" @click="handleQuery()">查询</Button>
        <Button style="margin-left: 8px" @click="handleUrge()">催办</Button>
        <!--<Button style="margin-left: 8px" @click="handleCainiao()">菜鸟驿站</Button>
		        <Button style="margin-left: 8px" @click="handleCheck()">服务质量考核</Button>
        <Button style="margin-left: 8px" @click="handlebatch()">申请介入</Button>-->
      </div>
    </div>
    <!--服务质量考核的模态框-->
    <Modal
      v-model="checkData.checkModal"
      :title="checkData.title"
      class-name="vertical-center-modal"
      @on-ok="Checkok"
      @on-cancel="Checkcancel"
    >
      <QueryCheck ref="queryCheck"></QueryCheck>
    </Modal>
    <!--申请介入的模态框-->
    <Modal
      v-model="applyData.applyModal"
      :title="applyData.title"
      @on-ok="applyOk"
      class-name="vertical-center-modal"
      @on-cancel="applyCancel"
    >
      <QueryApply ref="queryApply"></QueryApply>
    </Modal>
    <!--下面的主要内容-->
    <div class="oout">
      <div class="query_mainBox">
        <Form class="query_form" ref="formQueryItem" :model="formQueryItem" :rules="ruleValidate">
          <div class="query_mleft">
            <FormItem>
              <Select
                v-model="formQueryItem.yunOrder"
                placeholder="运单号"
                label-in-value
                @on-change="handleOrderType"
              >
                <Option value="1">运单号</Option>
                <Option value="2">工单ID</Option>
              </Select>
              <Input
                v-model="formQueryItem.yunNumber"
                type="textarea"
                :autosize="{minRows: 2,maxRows: 2}"
                placeholder="请输入运单号或工单ID,多个单号用换行符隔开"
              />
            </FormItem>
          </div>
          <div class="query_mright">
            <div class="q_mr_part">
              <!--multiple-->
              <FormItem label="工单来源">
                <Select
                  v-model="formQueryItem.orderSource"
                  multiple
                  placeholder="请选择"
                  label-in-value
                  @on-change="changeSource"
                >
                  <Option
                    v-for="(item,index) in sourceArr"
                    :value="item.dataSourceId"
                    :key="item.dataSourceId"
                  >{{item.dataSourceName}}</Option>
                </Select>
              </FormItem>
              <FormItem label="被投诉网点" class="p2">
                <Input
                  @on-keyup="handleSearch4"
                  v-model="formItem.beComplainsiteCode"
                  clearable
                  @on-clear="oooClean"
                ></Input>
                <ul v-if="loading4" style="width: 100%;" class="drop">
                  <li
                    @click="handleSelect4(option)"
                    class="drop_item"
                    v-for="(option,index) in formQueryItem.comData"
                    :key="index"
                  >{{option.Value}}</li>
                </ul>
              </FormItem>
              <FormItem label="工单状态">
                <Select
                  v-model="formQueryItem.orderstate"
                  label-in-value
                  placeholder="请选择"
                  @on-change="changeState"
                >
                  <Option value="-1">全部</Option>
                  <Option value="0">待分配</Option>
                  <Option value="1">待首跟</Option>
                  <Option value="2">待处理</Option>
                  <Option value="3">待完结</Option>
                  <Option value="4">处理完成</Option>
                </Select>
              </FormItem>
            </div>
            <div class="q_mr_part clickAdd">
              <div class="first">
                <FormItem class="creatTime">
                  <Select placeholder="创建时间" label-in-value @on-change="changeTime">
                    <Option value="create">创建时间</Option>
                    <Option value="handle">处理时间</Option>
                  </Select>
                  <div class="timeRange">
                    <DatePicker
                      type="datetime"
                      :placeholder="defaultStart"
                      v-model="formQueryItem.beginTime"
                    ></DatePicker>
                    <span class="line">-</span>
                    <DatePicker
                      type="datetime"
                      :placeholder="defaultEnd"
                      v-model="formQueryItem.endTime"
                    ></DatePicker>
                  </div>
                </FormItem>
                <FormItem label="工单类型" class="order_type">
                  <Cascader
                    :data="formQueryItem.submitorderData"
                    v-model="formQueryItem.typeName"
                    placeholder="请选择工单类型"
                    @on-change="handleChange"
                  ></Cascader>
                </FormItem>
              </div>

              <span
                style="width: 80px;"
                class="step_top_more"
                @click="advanceQuery(advanceState)"
              >{{advanceTitle}}</span>
            </div>

            <div class v-if="advanceState" style="margin-top: 15px;">
              <div class="q_mr_part">
                <!---->
                <FormItem label="所属省区" v-if="roleType===1">
                  <!--formItem.CreateSiteProvince
                  formQueryItem.sendArea-->
                  <Select
                    v-model="formItem.CreateSiteProvince"
                    label-in-value
                    clearable
                    @on-change="handleSelect5"
                    @on-clear="handleDelete"
                    style="width:200px"
                  >
                    <Option
                      v-for="(option,index) in formQueryItem.sendData"
                      :value="option.key"
                      :label="option.value"
                      :key="option.value"
                    >{{ option.value }}</Option>
                  </Select>
                </FormItem>

                <!--<FormItem label="下发次数">
									<Input type="number" v-model="formQueryItem.sendTimes" />
                </FormItem>-->
                <FormItem label="查询类型">
                  <Select
                    v-model="formItem.QueryWorkOrderType"
                    placeholder="请选择"
                    label-in-value
                    clearable
                    @on-clear="typeDelete"
                  >
                    <Option value="1">本网点提交</Option>
                    <Option value="2">本网点处理完成</Option>

                    <Option value="3">本人提交</Option>
                    <Option value="4">本人处理完成</Option>
                    <Option value="5">二次申诉</Option>
                    <Option value="6">已超时</Option>
                  </Select>
                </FormItem>
              </div>
              <div class="q_mr_part" style="margin-top: 15px;"></div>
            </div>
          </div>
        </Form>
        <div class="queryTable" style="margin-top: 15px;">
          <QueryTable
            ref="childTable"
            :tableHight="tableHight"
            :datas="data1"
            :columns1="columns"
            :pageSize="pageSize"
            :cuurPage="pageNo"
            :totalNumber="totalNumber"
            @sortFun="sortFun"
            @handleChangePageNumber="pageChangeNumber"
            @changePageSize="changePageSize"
            @handWhole="handWhole"
            @handleCui="handleCui"
            @handleOvertime="handleOvertime"
          ></QueryTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  formatDateTime,
  defaultimeStart2,
  defaultimeEnd
} from "@/functions/function.js";
import {
  getRegions,
  getSecondTypeCache,
  getThreeTypeCache
} from "@/api/orderManage/input.js";
import {
  getAllSite,
  getorderInfor,
  getorderSource
} from "@/api/orderManage/input.js";

import {
  getQueryData,
  getUrge,
  getProvincial
} from "@/api/orderManage/query.js";

import { getAllType } from "@/api/baseInfo/typeSettings";
import QueryTable from "@/pages/index/views/orderQuery/queryTable.vue";
import QueryCheck from "@/pages/index/views/orderQuery/orderQueryCheck.vue";
import QueryApply from "@/pages/index/views/orderQuery/orderQueryApply.vue";
export default {
  components: {
    QueryCheck,
    QueryApply,
    QueryTable
  },
  data() {
    return {
      advanceTitle: "+ 高级搜索",
      tableHight: window.innerHeight - 47 - 84 - 31 - 32 - 80,
      queryState: true,
      defaultStart: defaultimeStart2(),
      defaultEnd: defaultimeEnd(),
      pageSize: 20, //每一页的数据条数
      pageNo: 1, //当前页码
      totalNumber: 0, //数据总条数
      data1: [],
      data2: [],
      data11: [],
      columns: [
        {
          type: "selection",
          width: 40,
          align: "center"
        },
        {
          type: "index2",
          title: "序号",
          width: 40,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              params.index +
                (this.defaultItem.pageNo - 1) * this.defaultItem.pageSize +
                1
            );
          }
        },
        {
          title: "工单来源",
          key: "dataSource",
          width: 80
        },
        {
          title: "运单号",
          key: "billCode",
          width: 130,
          slot: "billCode"
        },
        {
          title: "工单ID",
          key: "id",
          width: 150,
          slot: "id"
        },
        {
          title: "工单类型",
          key: "workType",
          width: 160
        },
        {
          title: "工单信息",
          width: 360,
          slot: "infor"
        },
        // {
        // 	title: '处理等级',
        // 	width: 100,
        // 	key: 'dealLevel'
        // },
        {
          title: "需求描述",
          width: 200,
          key: "reqDescription"
        },

        {
          title: "工单状态",
          key: "dataStateName",
          width: 100
        },
        {
          title: "当前处理时效",
          key: "siteProcessTime",
          width: 130,
          align: "center",
          sortable: true
        },
        {
          title: "处理时间",
          key: "processTime",
          width: 80,
          align: "center"
        },
        {
          title: "当前处理网点",
          key: "processSite",
          width: 200
        },
        {
          title: "当前处理人",
          key: "processBy",
          width: 150
        },
        {
          title: "被投诉网点",
          key: "becomplainSiteName",
          width: 200
        },
        {
          title: "操作",
          key: "action",
          slot: "action",
          width: 70,
          fixed: "right"
        }
        // {
        // 	title: '录入网点',
        // 	key: 'createSite',
        // 	width: 200
        // },
        // {
        // 	title: '录入人',
        // 	key: 'createBy',
        // 	width: 200
        // }
      ],
      advanceState: false, //是否允许高级搜索
      formItem: {
        dataType: 1, //页面类型（1:全部页面，2:带催办页面）
        dateType: 1, //时间类型
        queryType: 1, //查询类型
        issuedNumber: "", //下发次数def

        CreateSiteProvince: "", //所属省区的code
        id: "", //运单号或工单ID
        beginTime: "", //开始时间
        endTime: "", //结束时间
        DataSourceList: "", //工单来源ID
        dataState: "", //工单状态 0:待分配1:待首跟回复 2:待处理 3:待申请完结 4:处理完成
        beComplainsiteCode: "", //被投诉网点的code
        firstTypeCode: "", //一级类型编码
        secondTypeCode: "", //二级类型编码
        threeTypeCode: "", //三级类型编码
        QueryWorkOrderType: "" //查询类型 （1 本网点提交,2 本网点处理完成,3 本人提交,4 本人处理完成,5 二次申诉,6 已超时）
      },
      defaultItem: {
        pageNo: 1, //页数
        pageSize: 20, //行数
        sort: "siteProcessTime", //排序字段
        direction: "desc" //排序顺序
      },
      sourceArr: [], //工单来源的数组

      formQueryItem: {
        dataType: 1, //页面类型（1:全部页面，2：待催办）
        yunOrder: "1", //运单号
        yunNumber: "", //输入的单号
        orderSource: "", //工单来源
        comData: [], //被投诉网点的数组
        beComplainsiteCode: "", //被投诉网点的code
        beginTime: "", //开始时间
        endTime: "", //结束时间
        compintedDot: "", //被投诉网点
        orderType: "", //工单类型
        orderstate: "", //工单状态
        sendTimes: "", //下发次数
        queryType: 1, //查询类型
        dateType: 1, //时间类型
        submitorderStyle: [], //工单类型
        submitorderData: [], //工单类型的数组
        sendArea: "", //所属省区
        sendData: [], //所属省区的数组
        queryState: "" //查询类型
      },
      ruleValidate: {},
      checkData: {
        checkModal: false, //质量服务考核的模态框
        title: "服务质量考核——罚款"
      },
      applyData: {
        //申请介入
        applyModal: false, //质量服务考核的模态框
        title: "工单申诉"
      },

      selectedArray: [], //表单中选中的数据
      loading4: false,
      loading5: false,
      typeValue: [],
      roleType: ""
    };
  },
  watch: {
    typeValue: function(newValue, oldValue) {
      if (newValue.length === 0) {
        this.formItem.FirstTypeCode = ""; //一级类型编码
        this.formItem.SecondTypeCode = "";
        this.formItem.ThreeTypeCode = "";
      } else {
        let code = newValue[2].__value.split(",");
        let values = newValue[2].__label.split("/");
        this.formItem.FirstTypeCode = code[0]; //一级类型编码
        this.formItem.SecondTypeCode = code[1];
        this.formItem.ThreeTypeCode = code[2];
      }
    }
  },
  mounted() {
    //全量工单类型
    getAllType().then(res => {
      if (res && res.success) {
        console.log(res);
        this.formQueryItem.submitorderData = res.data;
      }
    });
    //工单来源的数组
    getorderSource().then(res => {
      if (res && res.success) {
        this.sourceArr = res.data;
      } else {
        this.$Notice.success({
          title: "提示信息",
          desc: res.msg
        });
      }
    });
    //所属省区
    getProvincial().then(res => {
      console.log("工单查询中所属省区", res.data);
      if (res && res.success) {
        this.formQueryItem.sendData = res.data;
      } else {
        this.$Notice.success({
          title: "提示信息",
          desc: res.msg
        });
      }
    });
    this.formQueryItem.beginTime = this.defaultStart;
    this.formQueryItem.endTime = this.defaultEnd;

    this.handleResize();
    window.addEventListener("resize", this.handleResize, false);
  },
  updated() {
    if (this.loading4) {
      let inputs = document.getElementsByClassName("p2")[0];
      let div = document.getElementsByClassName("drop")[0];
      document.onclick = function(event) {
        event = event || window.event;
        div.style.display = "none";
        event.stopPropagation();
      };
      inputs.onclick = function(event) {
        event = event || window.event;
        div.style.display = "block";
        event.stopPropagation();
      };
      div.onclick = function(event) {
        event = event || window.event;
        div.style.display = "block";
        event.stopPropagation();
      };
    }
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize, false);
  },
  created() {
    if (
      this.$store.state.companyCode === "2155" ||
      this.$store.state.companyCode === "800302"
    ) {
      this.roleType = "1";
    }
  },
  computed: {},
  methods: {
    oooClean() {
      console.log(this.formItem.compintedDot, "15456");
    },
    handleResize() {
      let th = document.querySelector(".query_header").clientHeight;
      let fh = document.querySelector(".query_form").clientHeight;
      let bh = document.querySelector(".btnOptions").clientHeight;
      let ph = document.querySelector(".tab_page").clientHeight;
      this.$nextTick(() => {
        this.tableHight = window.innerHeight - th - fh - bh - ph - 80;
      });
    },

    //分页按钮中的改变页数
    pageChangeNumber(page) {
      this.defaultItem.pageNo = page;
      this.handleQuery();
      console.log(page, "单独的");
    },
    changePageSize(page) {
      this.defaultItem.pageSize = page;
      this.handleQuery();
      console.log(page, "size");
    },
    /**
     * 排序
     */
    sortFun(sort, direction) {
      this.defaultItem.sort = sort; //排序字段
      this.defaultItem.direction = direction; //排序顺序
      this.handleQuery();
    },
    //点击table上面的“全部”按钮
    handWhole() {
      console.log(this.defaultItem, "默认参数");
      console.log(this.formItem, "圈圈圈");
      this.formItem.dataType = 1;
      this.handleQuery();
    },
    //带催办按钮
    handleCui() {
      //待催办
      this.formItem.dataType = 2;
      this.handleQuery();
    },
    //已超时按钮
    handleOvertime() {
      console.log("已超时");
      this.formItem.dataType = 3;
      console.log(this.defaultItem);
      console.log(this.formItem, 13545);
      this.handleQuery();
    },
    //被投诉网点的模糊查询
    handleSearch4(values) {
      let value = this.formItem.beComplainsiteCode;
      if (value != "") {
        getAllSite({
          key: value
        }).then(res => {
          console.log("工单查询中的被投诉网点", res.data);
          if (res && res.success) {
            this.loading4 = true;
            this.formQueryItem.comData = res.data;
          } else {
            this.formQueryItem.comData = [];
            this.loading4 = false;
          }
        });
      } else {
        this.formQueryItem.comData = [];
        this.loading4 = false;
      }
    },
    handleSelect4(options) {
      this.formItem.compintedDot = options.Value;
      this.loading4 = false;
      this.formItem.beComplainsiteCode = options.Value; //被投诉网点的code
      console.log(options);
    },
    //所属省区的下拉框
    handleSelect5(options) {
      //				this.formItem.CreateSiteProvince = options.value; //被投诉网点的code
      console.log(this.formItem.CreateSiteProvince);
    },
    handleDelete() {
      this.formItem.CreateSiteProvince = "";
    },
    typeDelete() {
      this.formItem.QueryWorkOrderType = "";
    },

    //查询
    handleQuery() {
      this.formItem.id = this.formQueryItem.yunNumber;
      //	this.formItem.QueryWorkOrderType = Number(this.formItem.QueryWorkOrderType)
      let start =
        this.formQueryItem.beginTime === ""
          ? this.defaultStart
          : formatDateTime(this.formQueryItem.beginTime);
      let end =
        this.formQueryItem.endTime === ""
          ? this.defaultEnd
          : formatDateTime(this.formQueryItem.endTime);
      if (
        Date.parse(this.formItem.beginTime) >= Date.parse(this.formItem.endTime)
      ) {
        this.$Message.warning("开始时间不能晚于结束时间！");
        return false;
      }
      this.formItem.beginTime = start;
      this.formItem.endTime = end;
      var SiteNameCode = this.formItem.beComplainsiteCode;
      this.formItem.beComplainsiteCode =
        this.formItem.beComplainsiteCode === ""
          ? ""
          : this.formItem.beComplainsiteCode.split("|")[1];
      if (
        Date.parse(this.formItem.begiinTime) >=
        Date.parse(this.formItem.endTime)
      ) {
        this.$Message.warning("开始时间不能晚于结束时间");
        return false;
      }
      this.formItem.issuedNumber = this.formQueryItem.sendTimes;
      this.formItem.queryType = this.formQueryItem.yunOrder;
      let par = this.formItem;
      console.log(par, "canshu");
      this.data1 = [];
      getQueryData({
        pageNo: this.defaultItem.pageNo, //页数
        pageSize: this.defaultItem.pageSize, //行数
        sort: this.defaultItem.sort, //排序字段
        direction: this.defaultItem.direction, //排序顺序
        data: par
      }).then(res => {
        this.formItem.beComplainsiteCode = SiteNameCode;
        if (res && res.success) {
          this.data1 = res.data;
          this.totalNumber = res.rowCount;
          this.$Message.success(res.msg);
          console.log(res, "全部");
        } else {
          this.$Message.warning(res.msg);
        }
      });
    },
    //时间类型改变
    changeTime(value, label) {
      console.log(value, "时间类型");
      if (value === "create") {
        this.formItem.dateType = 1;
      } else {
        this.formItem.dateTyp = 2;
      }
    },
    //单号类型
    handleOrderType(value, label) {
      if (value == 1) {
        this.formItem.queryType = 1;
      } else {
        this.formItem.queryType = 2;
      }
    },
    //工单来源改变
    changeSource(value, label) {
      console.log(value, "工单来源");
      let str1 = [];
      for (let i = 0; i < value.length; i++) {
        let str2 = {
          DataSourceId: value[i].value
        };
        str1.push(value[i].value);
      }
      console.log(str1);
      this.formItem.DataSourceList = str1;
      console.log(this.formItem);
    },
    //工单状态的改变
    changeState(value, label) {
      console.log(value);
      if (value.value == 0) {
        this.formItem.dataState = "WaitAllot";
      } else if (value.value === "1") {
        this.formItem.dataState = "WaitSmsNotity";
      } else if (value.value === "2") {
        this.formItem.dataState = "WaitDeal";
      } else if (value.value === "3") {
        this.formItem.dataState = "WaitComplete";
      } else if (value.value === "4") {
        this.formItem.dataState = "FinallyDeal";
      } else {
        this.formItem.dataState = "";
      }
      console.log(this.formItem.dataState);
    },
    //工单类型改变
    handleChange(value, selectedData) {
      console.log(selectedData);
      this.typeValue = selectedData;
      this.formQueryItem.submitorderStyle = selectedData[2].__label;
      //菜鸟 / 菜鸟111 / 菜鸟111
      //9a7fd91a43dbc667,6baa678bd8034677,6baa678bd8034677
      let code = selectedData[2].__value.split(",");
      let values = selectedData[2].__label.split("/");
      this.formItem.firstTypeCode = code[0]; //一级类型编码
      this.formItem.secondTypeCode = code[1];
      this.formItem.threeTypeCode = code[2];
    },

    //质量服务考核
    handleCheck() {
      if (!this.checkData.checkModal) {
        this.checkData.checkModal = !this.checkData.checkModal;
        this.$refs.queryCheck.checkForm.IDnumber = this.$store.state.querySelected[0].orderID;
        this.$refs.queryCheck.checkForm.yunNumber = this.$store.state.querySelected[0].waybillNumber;
        this.$refs.queryCheck.checkForm.punishDot = this.$store.state.querySelected[0].handleDot;
      }
    },
    //质量服务考核 模态框中的确定按钮
    Checkok() {
      this.$Message.info("Clicked ok");
      console.log(this.$refs.queryCheck.checkForm);
    },
    //质量服务考核 模态框中的取消按钮
    Checkcancel() {
      this.$Message.info("Clicked cancel");
    },
    //申请介入的按钮
    handlebatch() {
      if (!this.applyData.applyModal) {
        this.applyData.applyModal = !this.applyData.applyModal;
        this.$refs.queryApply.applyForm.complainedDot = this.$store.state.querySelected[0].complainedDot;
        this.$refs.queryApply.applyForm.yunNumber = this.$store.state.querySelected[0].waybillNumber;
      }
    },
    //申请介入 模态框中的确定按钮
    applyOk() {
      console.log(this.$refs.queryApply.applyForm);
    },
    //申请介入 模态框中的取消按钮
    applyCancel() {},
    //催办
    handleUrge() {
      console.log(this.formItem.dataType);
      if (this.formItem.dataType === 2) {
        this.selectedArray = this.$refs.childTable.selectedData;
        console.log(this.selectedArray, "哈哈哈哈");
        let arr = this.selectedArray;
        let par2 = [];
        for (let i = 0; i < arr.length; i++) {
          par2.push(arr[i].id);
        }
        console.log(par2);
        if (par2.length != 0) {
          getUrge({
            ids: par2
          }).then(res => {
            if (res && res.success) {
              this.$Notice.success({
                title: "提示信息",
                desc: res.msg
              });
              this.handleQuery();
            } else {
              this.$Notice.warning({
                title: "提示信息",
                desc: res.msg
              });
            }
          });
        } else {
          this.$Notice.warning({
            title: "提示信息",
            desc: "请至少选择一条数据之后再进行催办"
          });
        }
      } else {
        this.$Notice.warning({
          title: "提示信息",
          desc: "只有待催办的表单中的数据才可以发起催办！！！"
        });
      }
    },
    //菜鸟驿站
    handleCainiao() {
      //跳转到菜鸟驿站
      //this.$router.resolve方法可以打开新的窗口
      let routeUrl = this.$router.resolve({
        name: "Newbie",
        query: {
          id: 96
        }
      });
      window.open(routeUrl.href, "_blank");
    },
    //高级搜索
    advanceQuery(info) {
      if (!info) {
        this.advanceState = true;
        let th = document.querySelector(".query_header").clientHeight;
        let fh = document.querySelector(".query_form").clientHeight;
        let bh = document.querySelector(".btnOptions").clientHeight;
        let ph = document.querySelector(".tab_page").clientHeight;
        this.$nextTick(() => {
          this.tableHight = window.innerHeight - th - fh - bh - ph - 140;
        });
        this.advanceTitle = "- 高级搜索";
      } else {
        this.advanceState = false;
        //					window.addEventListener('resize', this.handleResize, false)
        let th = document.querySelector(".query_header").clientHeight;
        let fh = document.querySelector(".query_form").clientHeight;
        let bh = document.querySelector(".btnOptions").clientHeight;
        let ph = document.querySelector(".tab_page").clientHeight;
        this.$nextTick(() => {
          this.tableHight = window.innerHeight - th - fh - bh - ph - 20;
        });
        this.advanceTitle = "+ 高级搜索";
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "./orderQuery.less";
</style>