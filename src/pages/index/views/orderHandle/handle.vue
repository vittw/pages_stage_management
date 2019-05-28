<template>
  <div class="query_outBox">
    <div class="query_header">
      <div class="query_header_left">
        <span class="colorBlock"></span>
        <span>客服 > 工单管理 > 工单处理</span>
      </div>
      <div class="query_header_right">
        <Button type="primary" @click="handleQuery('formHandleItem')" :disabled="isDisable">查询</Button>
        <!-- <Button style="margin-left: 8px" @click="handleBatch()">批量处理</Button> -->
        <Button style="margin-left: 8px" @click="orderTurns()">工单转交</Button>
        <!--总部权限-->
        <Button style="margin-left: 8px" v-if="this.roleType==='1'" @click="hangUp()">挂起</Button>
      </div>
    </div>

    <!--批量处理     的模态框-->
    <Modal v-model="batch.modal" title="批量处理">
      <Form class="batchForm" ref="batch" :model="batch.item" :rules="batch.rule" inline>
        <FormItem label="处理内容" prop="handleContent">
          <Input v-model="batch.item.handleContent" clearable></Input>
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input v-model="batch.item.remark" clearable></Input>
        </FormItem>
        <FormItem class="batchFiles" label="标准回复" prop="standard">
          <Input type="textarea" v-model="batch.item.standard" clearable></Input>
        </FormItem>
        <!--<FormItem class="batchFiles" label="附件（上传图片、语音压缩包、最多5个附件，单个最大500K）">
					<Upload
						ref="upload"
				        multiple
				        type="drag"
				        :max-size="500"
				        :before-upload="handleBeforeUpload"
				        action="//jsonplaceholder.typicode.com/posts/">
				        <div style="padding: 10px">
				            <p>拖拽文件至此或者点击这里上传</p>
				        </div>
				    </Upload>
        </FormItem>-->
      </Form>
      <div slot="footer">
        <Button @click="batchCancel">取消</Button>
        <Button @click="batchOk" type="primary">提交</Button>
      </div>
    </Modal>
    <!--工单转交   模态框-->
    <Modal v-model="turn.modal" title="工单转交">
      <Form class="batchForm" ref="batch" :model="batch.item" inline>
        <FormItem label="网点名称" class="p2">
          <!--<Input @on-keyup="handleSearch4"   v-model="turn.itemValue.processSite" clearable placeholder="请输入"></Input>
					<ul v-if="turn.itemValue.loading4" style="width: 100%;" class="drop">
						<li @click="handleSelect4(option)" class="drop_item" v-for="(option,index) in dotData" :key="index">{{option.Value}}</li>
          </ul>-->

          <Select
            v-model="turn.itemValue.processSite"
            placeholder="请输入网点名称"
            filterable
            clearable
            label-in-value
            remote
            :remote-method="handleSearch4"
            @on-change="handleSelect4"
          >
            <Option
              v-for="(item,index) in dotData"
              :label="item.value"
              :value="item.key"
              :key="item.key"
            >{{ item.value }}</Option>
          </Select>
        </FormItem>
        <FormItem label="员工名称" class="p2">
          <!--<Input @on-keyup="handleSearch5"  v-model="turn.itemValue.ProcessBy" clearable placeholder="请输入"></Input>
					<ul v-if="turn.itemValue.loading5" style="width: 100%;" class="drop">
						<li @click="handleSelect5(option)" class="drop_item" v-for="(option,index) in turn.itemValue.proData" :key="index">{{option.Value}}</li>
          </ul>-->

          <Select
            v-model="turn.itemValue.ProcessBy"
            placeholder="请输入员工名称"
            filterable
            clearable
            label-in-value
            remote
            :remote-method="handleSearch5"
            @on-change="handleSelect5"
          >
            <Option
              v-for="(item,index) in turn.itemValue.proData"
              :label="item.Value"
              :value="item.Key"
              :key="item.Key"
            >{{ item.Value }}</Option>
          </Select>
        </FormItem>
        <p style="color: red;">注：输入关键字进行搜索，选择匹配结果 独立网点可以将工单转交给下属承包区和员工</p>
      </Form>
      <div slot="footer">
        <!--<Button @click="batchCancel">取消</Button>-->
        <Button @click="turnOk" type="primary">提交</Button>
      </div>
    </Modal>
    <!--挂起-->
    <Modal v-model="applyData.applyModal" title="挂起">
      <p>是否确定将此单号挂起</p>
      <div class slot="footer">
        <Button @click="hangCanael">取消</Button>
        <Button @click="hangOk" type="primary">确定</Button>
      </div>
    </Modal>

    <!--下面的主要内容-->
    <div class="oout">
      <div class="query_mainBox">
        <Form class="query_form" ref="formHandleItem" :model="formHandleItem" :rules="ruleValidate">
          <div class="query_mleft">
            <FormItem>
              <Select
                v-model="formHandleItem.yunOrder"
                placeholder="运单号"
                label-in-value
                @on-change="changeIdSource"
              >
                <Option value="billCode">运单号</Option>
                <Option value="orderId">工单ID</Option>
              </Select>
              <Input
                v-model="formHandleItem.yunNumber"
                type="textarea"
                :autosize="{minRows: 2,maxRows: 2}"
                placeholder="请输入运单号或工单ID,多个单号用换行符隔开"
              />
            </FormItem>
          </div>
          <div class="query_mright">
            <div class="q_mr_part">
              <FormItem label="工单来源">
                <Select
                  v-model="formHandleItem.orderSource"
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
              <FormItem label="工单状态">
                <Select
                  v-model="formHandleItem.orderstate"
                  label-in-value
                  placeholder="请选择"
                  @on-change="changeState"
                >
                  <Option value="0">全部</Option>
                  <Option value="待首跟">待首跟</Option>
                  <Option value="待处理">待处理</Option>
                  <!--<Option value="待申请完结">待申请完结</Option>
                  <Option value="处理完成">处理完成</Option>-->
                </Select>
              </FormItem>
              <FormItem label="工单类型" class="levelForm">
                <Cascader
                  :value="typeValue"
                  :data="formHandleItem.submitorderData"
                  v-model="formHandleItem.typeName"
                  placeholder="请选择工单类型"
                  @on-change="handleChange"
                ></Cascader>
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
                      v-model="formHandleItem.beginTime"
                    ></DatePicker>
                    <span class="line">-</span>
                    <DatePicker
                      type="datetime"
                      :placeholder="defaultEnd"
                      v-model="formHandleItem.endTime"
                    ></DatePicker>
                  </div>
                </FormItem>
                <FormItem label="自动刷新">
                  <i-switch v-model="RefreshQuery.state" size="large">
                    <span slot="open">开启</span>
                    <span slot="close">关闭</span>
                  </i-switch>
                  <Select v-model="RefreshQuery.time" style="width:100px">
                    <Option value="300">5分钟</Option>
                    <Option value="600">10分钟</Option>
                    <Option value="900">15分钟</Option>
                    <Option value="1200">20分钟</Option>
                  </Select>
                </FormItem>
              </div>
            </div>
          </div>
        </Form>
        <div class="queryTable" style="margin-top: 15px;">
          <HandleTable
            ref="handleTable"
            :tableHight="tableHight"
            :data1="data1"
            :columns1="columns"
            :pageSize="pageSize"
            :cuurPage="pageNo"
            :totalNumber="totalNumber"
            @sortFun="sortFun"
            @handleChangeNumber="pageChangeNumber"
            @changePageSize="changePageSize"
            @handleWait="handleWait"
            @handleHelp="handleHelp"
            @shouReply="shouReply"
          ></HandleTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HandleTable from "@/pages/index/views/orderHandle/handleTable.vue"; //处理表单
import QueryCheck from "@/pages/index/views/orderQuery/orderQueryCheck.vue";
import QueryApply from "@/pages/index/views/orderQuery/orderQueryApply.vue";

import {
  getAllSite,
  getorderSource,
  GetSiteByCategoryCode
} from "@/api/orderManage/input.js";
import { getAllType } from "@/api/baseInfo/typeSettings";
import {
  orderTurn,
  getBasicInfor,
  getFirstReply,
  getHandlePageData,
  getProcReferral,
  sureHang,
  cancelHang
} from "@/api/orderManage/handle.js";
import {
  formatDateTime,
  defaultimeStart,
  defaultimeEnd,
  getCookie
} from "@/functions/function.js";
export default {
  components: { QueryCheck, QueryApply, HandleTable },
  data() {
    return {
      tableHight: 0,
      roleType: "", //权限类型，1--总部权限  2--网点
      isDisable: false,
      defaultStart: defaultimeStart(),
      defaultEnd: defaultimeEnd(),
      queryState: true,
      pageSize: 20, //每一页的数据条数
      pageNo: 1, //当前页码
      sort: "siteProcessTime", //排序字段
      direction: "desc", //排序顺序
      totalNumber: 0, //数据总条数
      data1: [],
      arr: "",
      arr1: [],
      columns: [
        {
          type: "selection",
          width: 40,
          align: "center"
          //                      fixed: 'left'
        },
        {
          type: "index2",
          title: "序号",
          width: 40,
          //                      slot:'orderNumber',
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              params.index + (this.pageNo - 1) * this.pageSize + 1
            );
          }
        },
        {
          title: "工单来源",
          key: "dataSource",
          width: 80
        },

        {
          title: "运单编号",
          key: "billCode",
          width: 120,
          slot: "billCode"
          //                      fixed: 'left'
        },
        {
          title: "工单ID",
          key: "id",
          slot: "id",
          width: 150
        },
        {
          title: "工单类型",
          key: "dataTypeDisplay",
          width: 200
        },
        {
          title: "工单信息",
          width: 360,
          slot: "info"
        },
        {
          title: "需求描述",
          width: 250,
          key: "reqDescription",
          slot: "desc"
        },
        {
          title: "工单状态",
          key: "dataStateName",
          width: 80
        },
        {
          title: "处理时效",
          key: "siteProcessTime",
          width: 80,
          align: "center",
          sortable: true
        },
        {
          title: "当前处理网点",
          key: "processSite",
          width: 100
        },
        {
          title: "当前处理人",
          key: "processBy",
          width: 100
        },
        {
          title: "下发次数",
          key: "issuedNumber",
          width: 200
        },
        {
          title: "操作",
          key: "action",
          slot: "action",
          width: 100,
          fixed: "right"
        }
      ],
      typeValue: [],
      params: {
        DataSourceList: "", //工单来源的ID
        DataState: "", //工单状态
        FirstTypeCode: "", //一级类型code
        SecondTypeCode: "",
        ThreeTypeCode: "",

        dateType: 1, //时间类型
        beginTime: "", //开始时间
        endTime: "", //结束时间
        queryType: 1, //单号类型(默认为运单编号 是1 工单id'是2)
        Id: "" //查询的运单号或工单号
      },
      sourceArr: [], //工单来源的数组
      RefreshQuery: {
        state: false,
        time: "600",
        setInterval: ""
      },
      formHandleItem: {
        yunOrder: "billCode", //运单号
        yunNumber: "", //输入的单号

        orderSource: "", //工单来源

        orderState: "0", //工单状态
        orderType: "", //工单类型

        beginTime: "", //开始时间时间
        endTime: "", //结束时间

        //Cascader中的v-model必须是数组
        submitorderStyle: [], //被提交网点的工单类型
        submitorderData: []
      },
      ruleValidate: {},
      //批量处理
      batch: {
        modal: false,
        uploadList: [],
        item: {
          //处理内容
          handleContent: "",
          remark: "", //备注
          standard: "" //标准回复
        },
        rule: {
          handleContent: [
            { required: true, message: "不能为空", trigger: "blur" }
          ],
          remark: [{ required: true, message: "不能为空", trigger: "blur" }],
          standard: [{ required: true, message: "不能为空", trigger: "blur" }]
        }
      },
      //工单转交
      dotData: [], //网点名称的数组
      turn: {
        modal: false,
        itemValue: {
          dotName: "", //网点名称
          dotData: [], //网点名称的数组
          loading4: false,
          err4: false,
          loading5: false,
          peopleName: "", //员工名称

          processName: "",
          processSite: "", //网点名称
          processSiteCode: "", //网点code

          ProcessByName: "",
          ProcessBy: "", //员工名称
          ProcessUserId: "", //员工id
          proData: [], //工单转交中  员工名称的数组

          companyId: ""
        }
      },
      //挂起
      applyData: {
        applyModal: false
      },
      selectedArray: [] //被选中的table中的数据
    };
  },
  mounted() {
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
    //全量工单类型
    getAllType().then(res => {
      //          	console.log(res,'全量工单类型')
      if (res && res.success) {
        this.formHandleItem.submitorderData = res.data;
      }
    });
    this.formHandleItem.beginTime = this.defaultStart;
    this.formHandleItem.endTime = this.defaultEnd;
    //          this.typeValue=this.formHandleItem.submitorderData

    this.handleResize();
    window.addEventListener("resize", this.handleResize, false);
  },
  updated() {
    if (this.remarkState) {
      let div2 = document.getElementById("mr_remark");
      drag(div2);
    }
    let inputs = document.getElementsByClassName("p2")[0];
    var div = document.getElementsByClassName("drop")[0];
    //			console.log(inputs)
    //			console.log(div)
    document.onclick = function(event) {
      event = event || window.event;
      if (div) {
        //此处会报错，先增加为空报错
        div.style.display = "none";
      }
      event.stopPropagation();
    };
    //			inputs.onclick=function(event){
    //			　　event=event||window.event;
    //			　　div.style.display="block";
    //			　　event.stopPropagation();
    //			}
    //			div.onclick=function(event){
    //			　　event=event||window.event;
    //			　　div.style.display="block";
    //			　　event.stopPropagation();
    //			}
  },
  created() {
    if (
      this.$store.state.companyCode === "2155" ||
      this.$store.state.companyCode === "800302"
    ) {
      this.roleType = "1";
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.path != "/") {
        //      vm.data1 = vm.$store.state.handleDetail;
        //      vm.totalNumber = vm.data1.length;
        vm.handleQuery();
      }
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize, false);
  },
  watch: {
    tableHight: function(newValue, oldValue) {
      //				console.log(newValue,'新')
      //				console.log(newValue,'旧')
    },
    typeValue: function(newValue, oldValue) {
      if (newValue.length === 0) {
        this.params.FirstTypeCode = ""; //一级类型编码
        this.params.SecondTypeCode = "";
        this.params.ThreeTypeCode = "";
      } else {
        let code = newValue[2].__value.split(",");
        let values = newValue[2].__label.split("/");
        this.params.FirstTypeCode = code[0]; //一级类型编码
        this.params.SecondTypeCode = code[1];
        this.params.ThreeTypeCode = code[2];
      }
    },
    "RefreshQuery.state": function(newValue, oldValue) {
      var $this = this;
      if (newValue) {
        this.RefreshQuery.setInterval = setInterval(function() {
          console.log(`开始查询${new Date()}`);
          $this.handleQuery("formHandleItem");
        }, Number(this.RefreshQuery.time) * 1000);
      } else {
        clearInterval(this.RefreshQuery.setInterval);
      }
    },
    "RefreshQuery.time": function(newValue, oldValue) {
      var $this = this;
      clearInterval(this.RefreshQuery.setInterval);
      if (this.RefreshQuery.state) {
        this.RefreshQuery.setInterval = setInterval(function() {
          console.log(`开始查询${new Date()}`);
          $this.handleQuery("formHandleItem");
        }, Number(newValue) * 1000);
      }
    }
  },
  methods: {
    sortFun(sort, direction) {
      this.sort = sort;
      this.direction = direction;
      this.handleQuery();
    },

    handleResize() {
      let th = document.querySelector(".query_header").clientHeight;
      let fh = document.querySelector(".query_form").clientHeight;
      //				let bh = document.querySelector(".btnOptions").clientHeight
      let ph = document.querySelector(".tab_page").clientHeight;
      this.$nextTick(() => {
        this.tableHight = window.innerHeight - th - fh - ph - 70;
      });
      //    this.$nextTick(() => {
      //      this.tableHight = window.innerHeight - 47 - 84 - 31 - 32 - 80;
      //    });
    },
    //首跟按钮
    shouReply(data) {
      //				console.log(data,'shougenhuifu ')
      this.$Spin.show();
      let value = data.id;
      getFirstReply({
        id: value
      }).then(res => {
        this.$Spin.hide();
        if (res && res.success) {
          this.$Message.success(res.msg);
          if (
            this.$refs.handleTable &&
            this.$refs.handleTable.data1 &&
            this.$refs.handleTable.data1.length > 0
          ) {
            this.$refs.handleTable.data1.forEach((v, i, a) => {
              if (v.id === value) a[i].dataStateName = "待处理";
            });
          }
          //this.$refs.handleTable
          //this.handleQuery();
        } else {
          this.$Message.success(res.msg);
        }
        //					console.log(res)
      });
    },
    //分页按钮中的改变页数
    pageChangeNumber(page) {
      this.pageNo = page;
      this.handleQuery();
    },
    changePageSize(page) {
      this.pageSize = page;
      this.handleQuery();
    },
    //查询
    handleQuery(infor) {
      this.isDisable = true;
      this.$Spin.show();
      //				this.queryState=false
      this.data1 = [];
      this.params.Id = this.formHandleItem.yunNumber;
      let start =
        this.formHandleItem.beginTime === ""
          ? this.defaultStart
          : formatDateTime(this.formHandleItem.beginTime);
      let end =
        this.formHandleItem.endTime === ""
          ? this.defaultEnd
          : formatDateTime(this.formHandleItem.endTime);
      this.params.beginTime = start;
      this.params.endTime = end;
      //				this.params.beginTime='2019-02-01 00:00:00';
      //				this.params.endTime='2019-03-31 23:59:59';

      let par = this.params;
      getHandlePageData({
        data: this.params,
        pageNo: this.pageNo, //当前页数
        pageSize: this.pageSize, //当前页数的数据行数
        sort: this.sort, //排序字段
        direction: this.direction //排序顺序
      }).then(res => {
        this.$Spin.hide();
        this.isDisable = false;
        //					console.log(res,'点击查询后的数据')
        if (res && res.success) {
          this.data1 = res.data;
          this.totalNumber = res.rowCount;
          this.$Message.success(res.msg);
        } else {
          this.$Message.warning(res.msg);
        }
      });
    },
    //待处理
    handleWait() {
      this.handleQuery();
    },
    //待协助
    handleHelp() {
      //待协助
      //this.params.dataType=2
      this.handleQuery();
    },
    //工单转交
    orderTurns() {
      //				this.$refs.childTable.selectedData
      this.selectedArray = this.$refs.handleTable.chosenItem; //得到被选择的table中的数据
      if (this.selectedArray.length != 0) {
        this.turn.modal = true;
      } else {
        this.$Message.info("请至少选择表格中的一条数据进行操作");
      }
    },
    //工单转交模态框中的确定按钮
    turnOk() {
      this.$Spin.show();
      //				this.selectedArray=this.$refs.childTable.selectedData
      this.selectedArray = this.$refs.handleTable.chosenItem; //得到被选择的table中的数据
      //				console.log(this.selectedArray,'被选择')
      let par = {
        ids: this.selectedArray.map(t => t.id), //工单id
        processSite: this.turn.itemValue.processName, //网点名称
        processSiteCode: this.turn.itemValue.processSiteCode, //网点code
        ProcessUserId: this.turn.itemValue.ProcessUserId, //员工id,
        ProcessBy: this.turn.itemValue.ProcessByName //员工名称
      };
      orderTurn(par).then(res => {
        this.$Spin.hide();
        if (res && res.success) {
          this.$Message.info(res.msg);
          this.turn.modal = false;
          this.handleQuery();
        } else {
          this.$Message.info(res.msg);
        }
        //          		console.log(res,'工单转交的按钮')
      });
    },
    //工单转交中的网点名称
    handleSearch4(value) {
      GetSiteByCategoryCode({
        key: value
      }).then(res => {
        if (res && res.success) {
          console.log(res.data);
          this.dotData = res.data;
        } else {
          this.dotData = [];
        }
      });
    },
    handleSelect4(value) {
      console.log(value);
      if (value) {
        this.turn.itemValue.processSiteCode = value.value;
        this.turn.itemValue.companyId = value.value;
        this.turn.itemValue.processName = value.label.split("|")[0];
      } else {
        this.turn.itemValue.processSiteCode = "";
        this.turn.itemValue.companyId = "";
        this.turn.itemValue.processName = "";
      }
    },
    //工单转交中的 员工名称
    handleSearch5(value) {
      //获取员工的基础信息
      getBasicInfor({
        key: value,
        companyId: this.turn.itemValue.companyId
      }).then(res => {
        //					console.log(res,'员工名称')
        if (res && res.success) {
          this.turn.itemValue.proData = res.data;
          //						console.log(res,'获取员工的基本信息')
        } else {
          this.turn.itemValue.proData = [];
        }
      });
    },
    handleSelect5(value) {
      if (value) {
        console.log(value);
        console.log(value.label);
        console.log(this.turn.itemValue.ProcessUserId); //员工Id
        console.log(this.turn.itemValue.ProcessByName);
        this.turn.itemValue.ProcessUserId = value.value;
        this.turn.itemValue.ProcessByName = value.label.split("|")[0]; //员工名称
      } else {
        this.turn.itemValue.ProcessUserId = "";
        this.turn.itemValue.ProcessByName = "";
      }
    },
    //挂起 的按钮
    hangUp() {
      this.applyData.applyModal = true;
      //          	if(!this.applyData.applyModal){
      //					this.applyData.applyModal=!this.applyData.applyModal
      //					this.$refs.queryApply.applyForm.complainedDot=this.$store.state.querySelected[0].complainedDot
      //					this.$refs.queryApply.applyForm.yunNumber=this.$store.state.querySelected[0].waybillNumber
      //				}
    },
    //挂起中的确定按钮
    hangOk() {
      sureHang().then(res => {
        if (res && res.success) {
          this.$Message.success(res.msg);
        } else {
          this.$Message.info(res.msg);
        }
        console.log(res, "挂起");
      });
    },
    //挂起中的取消按钮
    hangCanael() {
      cancelHang().then(res => {
        if (res && res.success) {
          this.$Message.success(res.msg);
        } else {
          this.$Message.info(res.msg);
        }
        console.log(res, "取消挂起");
      });
    },

    //批量处理
    handleBatch() {
      //				let mySelect=this.$store.state.querySelected;
      let mySelect = this.$refs.handleTable.chosenItem;
      if (mySelect.length != 0) {
        this.batch.modal = true;
      } else {
        this.$Message.info("请至少选择表格中的一条数据进行操作");
      }
    },
    batchOk() {
      //				this.selectedArray=this.$refs.childTable.selectedData
      //				this.selectedArray=this.$store.state.querySelected;//得到被选择的table中的数据
      this.selectedArray = this.$refs.handleTable.chosenItem;
      let ids = "";
      for (let i = 0; i < this.selectedArray.length; i++) {
        ids = ids + this.selectedArray[i].id + "\r\n";
      }
      console.log(ids);
      console.log(this.selectedArray, "IDID");
      let sw = {
        id: ids, //工单id
        processContent: this.batch.item.handleContent, //处理内容
        reply: this.batch.item.standard, //首跟回复内容
        remark: this.batch.item.remark //备注
      };
      console.log(sw, "批量处理的参数");
      getProcReferral(sw).then(res => {
        if (res && res.success) {
          this.$Message.success(res.msg);
          this.batch.modal = false;
          this.batch.item.handleContent = "";
          this.batch.item.standard = "";
          this.batch.item.remark = "";
        } else {
          this.$Message.info(res.msg);
        }
        console.log(res, "批量处理");
      });
    },
    batchCancel() {
      //this.$refs.batch.resetFields();//清理form
      this.batch.item.handleContent = "";
      this.batch.item.standard = "";
      this.batch.item.remark = "";
      this.$refs.upload.clearFiles(); //清理上传文件
    },
    handleBeforeUpload() {
      const check = this.batch.uploadList.length < 5;
      if (!check) {
        this.$Notice.warning({
          title: "Up to five pictures can be uploaded."
        });
      }
      return check;
    },
    //id来源
    changeIdSource(value) {
      if (value.label === "工单ID") {
        this.params.queryType = 2;
      } else {
        this.params.queryType = 1;
      }
      //				this.params.queryType
    },
    //工单来源改变
    changeSource(value, label) {
      //				let str1=[];
      //				let str2=''
      //				for(let i=0;i<value.length;i++){
      //					str1.push(value[i].value)
      //				}
      //				this.params.DataSourceList=str1.join('\r\n')
      //				console.log(this.params.DataSourceList)

      let str1 = [];
      let str2 = "";
      for (let i = 0; i < value.length; i++) {
        str1.push(value[i].value);
      }
      this.params.DataSourceList = str1;
      console.log(this.params.DataSourceList);
    },
    //工单状态的改变
    changeState(value, label) {
      console.log(value, label);
      if (value.value === "待首跟") {
        this.params.DataState = 1; //待首跟
      } else if (value.value === "待处理") {
        this.params.DataState = 2;
      } else if (value.value === "待申请完结") {
        this.params.DataState = 3;
      } else if (value.value === "处理完成") {
        this.params.DataState = 4;
      } else {
        this.params.DataState = "";
      }
    },
    //工单类型改变
    handleChange(value, selectedData) {
      console.log(selectedData);
      this.typeValue = selectedData;
      this.formHandleItem.submitorderStyle = selectedData[2].__label;
      let code = selectedData[2].__value.split(",");
      let values = selectedData[2].__label.split("/");
      this.params.FirstTypeCode = code[0]; //一级类型编码
      this.params.SecondTypeCode = code[1];
      this.params.ThreeTypeCode = code[2];
    },
    //时间类型改变
    changeTime(value, label) {
      console.log(value, "时间类型");
      if (value === "create") {
        //创建时间
        this.params.dateType = 1;
      } else {
        //处理时间
        this.params.dateType = 2;
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "../orderQuery/orderQuery.less";
</style>