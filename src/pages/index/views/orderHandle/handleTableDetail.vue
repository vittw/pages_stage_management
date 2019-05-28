<template>
  <div class="handleD_box" :style="{height:boxHeight}">
    <div class="hd hd_title" v-if="firstArray">
      <div class="hd_row hd_top">
        <div class="row_l">
          <!--网点名称-->
          <p class="row_item">
            <Icon size="24" color="#ED6900" type="ios-person-outline"/>
            <span class="desc">{{firstArray.processSite}}</span>
          </p>
          <!--待处理-->
          <p class="row_item">
            <Icon size="24" color="#2494E2" type="ios-list-box-outline"/>
            <span class="desc">待处理（{{firstArray.waitDealCount}}）</span>
          </p>
          <!--当前单号-->
          <p class="row_item itemNum">
            <span class="desc">当前单号：{{firstArray.billCode}}</span>
          </p>
          <!--下发次数-->
          <Tooltip content="下发次数" v-if="firstArray.issuedNumber">
            <p class="row_item times">
              <span>{{firstArray.issuedNumber}}</span>
            </p>
          </Tooltip>

          <!--二次申述-->
          <Tooltip content="是否为二次申诉">
            <p class="row_item twice">
              <span v-if="firstArray.isAppeal==='1'">是</span>
              <span v-else>否</span>
            </p>
          </Tooltip>
        </div>
        <div class="row_r">
          <!--当前登录账号为总部账号-->
          <Button @click="back" v-if="roleType==='1'">提交网点</Button>
          <!--当前登录账号为非总部账号-->
          <Button @click="back" v-else>工单打回</Button>
          <!--<Button v-if="firstArray.loginType!='hq'"  @click="back">打回总部</Button>
          <Button v-if="firstArray.loginType==='hq'" @click="back">提交网点</Button>-->
          <Button @click="orderzhuan" style="margin-left: 8px;" type="primary">工单转交</Button>
          <!--网点来源的工单-->
          <!--<Button @click="subStation" style="margin-left: 8px;" type="primary">提交驿站</Button>
					<Button @click="SMS" style="margin-left: 8px;" type="primary">短信推送</Button>
          <Button @click="claim" style="margin-left: 8px;" type="primary">提交先行理赔</Button>-->
          <!--首跟相应-->
          <Button
            @click="delay"
            v-if="showIcon.isDelay==1"
            style="margin-left: 8px;"
            type="primary"
          >申请延迟</Button>
          <!-- <Button
            @click="assist"
            v-if="showIcon.isAssist==1"
            style="margin-left: 8px;"
            type="primary"
          >升级协助</Button>-->
          <!--标准回复的处理界面-->
        </div>
      </div>
      <div class="hd_row hd_bottom">
        <div class="row_l">
          <!--工单ID-->
          <p class="row_item">
            <Icon size="24" color="#999999" type="ios-pricetag"/>
            <span class="desc">{{firstArray.id}}</span>
          </p>
          <!--创建时间-->
          <Tooltip content="创建时间">
            <p class="row_item">
              <Icon size="24" color="#999999" type="md-notifications-outline"/>
              <span class="desc">{{firstArray.createOn}}</span>
            </p>
          </Tooltip>

          <!--来源-->
          <Tooltip content="来源">
            <p class="row_item">
              <Icon size="24" color="#999999" type="md-flag"/>
              <span class="desc">{{firstArray.dataSource}}</span>
            </p>
          </Tooltip>

          <!--倒计时-->
          <Tooltip content="倒计时" v-if="firstArray.countDown">
            <p class="row_item">
              <Icon size="24" color="#999999" type="ios-alarm"/>
              <span class="desc">{{firstArray.countDown}}</span>
            </p>
          </Tooltip>

          <!--处理备注-->
          <p class="row_item" @click="goremark" style="border-radius: 4px;cursor: pointer;">
            <Icon type="ios-compass" color="#ED6900" size="24"/>
            <span class="desc" style="color: #ED6900;margin-right: 5px;">处理备注</span>
          </p>
        </div>
        <div class="row_r">
          <Button @click="goback">返回列表</Button>
          <Button @click="next">
            <Icon size color="#785F77" type="ios-arrow-forward"/>
          </Button>
        </div>
      </div>
    </div>
    <!--工单打回的模态框-->
    <Modal v-model="backData.backmodal" :title="backTitle">
      <div class v-if="roleType==='1'" style="position: relative;">
        <Form>
          <FormItem label="被投诉网点" class="p2">
            <Input
              @on-keyup="searchComp"
              v-model="backData.compintedDot"
              clearable
              style="width: 200px;"
              placeholder="请输入"
            ></Input>
            <ul v-if="loading4" style="width: 200px;" class="drop">
              <li
                @click="compSelect4(option)"
                class="drop_item"
                v-for="(option,index) in backData.comData"
                :key="index"
              >{{option.value}}</li>
            </ul>
          </FormItem>
        </Form>
      </div>
      <div class v-else>
        <p style="color: 备注（累计输入最大不超过500字）;">备注（累计输入最大不超过500字）</p>
        <Input type="textarea" v-model="backData.backDesc" :rows="4"></Input>
      </div>
      <div slot="footer">
        <Button @click="backCancel">取消</Button>
        <Button @click="backOk" type="primary">提交</Button>
      </div>
    </Modal>
    <!--工单转交-->
    <Modal v-model="orderData.ordermodal" title="工单转交  ">
      <Form class="batchForm" ref="batch" :model="orderData" inline>
        <FormItem label="网点名称" class="p2">
          <Select
            v-model="orderData.processSite"
            placeholder="请输入"
            filterable
            clearable
            label-in-value
            remote
            :remote-method="handleSearch4"
            @on-change="handleSelect4"
          >
            <Option
              v-for="(item,index) in orderData.comData"
              :label="item.value"
              :value="item.key"
              :key="item.key"
            >{{ item.value }}</Option>
          </Select>
        </FormItem>
        <FormItem label="员工名称" class="p2">
          <Select
            v-model="orderData.ProcessBy"
            placeholder="请输入"
            filterable
            clearable
            label-in-value
            remote
            :remote-method="handleSearch5"
            @on-change="handleSelect5"
          >
            <Option
              v-for="(item,index) in orderData.proData"
              :label="item.Value"
              :value="item.Key"
              :key="item.Key"
            >{{ item.Value }}</Option>
          </Select>
        </FormItem>
      </Form>
      <p style="color: red;margin-top: 10px;">注：输入关键字进行搜索，选择匹配结果 独立网点可以将工单转交给下属承包区和员工</p>
      <div slot="footer">
        <Button @click="orderCancel">取消</Button>
        <Button @click="orderOk" type="primary">提交</Button>
      </div>
    </Modal>
    <!--提交驿站-->
    <Modal v-model="subData.submodal" title="提交驿站  " :styles="{width:'700px !important'}">
      <subStation :formSubItem="formSubItem"></subStation>
      <div slot="footer">
        <Button @click="subCancel">取消</Button>
        <Button @click="subOk" type="primary">提交</Button>
      </div>
    </Modal>
    <!--短信推送-->
    <Modal v-model="smsData.smsmodal" title="短信推送  " :styles="{width:'700px !important'}">
      <smspush :social="social" :huifu="huifu" :smsItem="smsItem"></smspush>
      <div slot="footer">
        <Button @click="smsCancel">取消</Button>
        <Button @click="smsOk" type="primary">提交</Button>
      </div>
    </Modal>
    <!--提交先行理赔-->
    <Modal v-model="sClaimData.claimodal" title="提交先行理赔  " :styles="{width:'700px !important'}">
      <sClaim :claimItem="claimItem"></sClaim>
      <div slot="footer">
        <Button @click="claimCancel">取消</Button>
        <Button @click="claimOk()" type="primary">提交</Button>
      </div>
    </Modal>
    <!--申请延迟-->
    <Modal v-model="delayData.delaymodal">
      <p>此条工单申请延迟的原因（累计输入最大不超过500字）</p>
      <Input type="textarea" :rows="4" v-model="delayData.desc"></Input>

      <div slot="footer">
        <Button @click="delayCancel">取消</Button>
        <Button @click="delayOk" type="primary">提交</Button>
      </div>
    </Modal>
    <!--升级协助-->
    <Modal v-model="assistData.assistmodal" title="升级协助  " @on-ok="assistOk" ok-text="提交">
      <p style="display: flex;justify-content: space-around;align-items: center;">
        <span style="display: inline-block;width: 60px;">协助方</span>
        <Input v-model="assistData.dot" type="text" placeholder="默认网点上级省区，且不可更改"></Input>
      </p>
      <p style="line-height: 40px;">此条工单申请延迟的原因（累计输入最大不超过500字）</p>
      <Input v-model="assistData.reason" type="textarea" :rows="4"></Input>
      <div slot="footer">
        <Button @click="assistCancel">取消</Button>
        <Button @click="assistOk" type="primary">提交</Button>
      </div>
    </Modal>

    <div class="hd_mainInfo">
      <div class="main_left">
        <div class="ml_t">
          <detailForm ref="detailForm"></detailForm>
        </div>
        <div class="ml_b">
          <Tabs value="name1">
            <TabPane label="物流轨迹" name="name1">
              <Table border :height="theight" :columns="columns1" :data="data1"></Table>
            </TabPane>
            <TabPane label="留言信息" name="name2">
              <div class="messBox">
                <mesRecord :messageArray="messageArray" @mesAdd="mesAdd"></mesRecord>
              </div>
            </TabPane>
            <!--<TabPane label="工单考核记录" name="name3">
				        	<div class="examBox">
				        		<orderExam :formExamItem="examData"></orderExam>
				        	</div>
            </TabPane>-->
            <TabPane label="驿站结果查看" name="name4">
              <Table
                border
                :height="theight"
                :columns="columns2"
                :data="data2"
                style="margin-left: 1px !important;"
              ></Table>
            </TabPane>
            <!--<TabPane label="先行理赔记录" name="name5">
				        	<div class="claimBox">
				        		<orderClaim></orderClaim>
				        	</div>
            </TabPane>-->
            <TabPane label="历史处理记录" name="name6">
              <div class="historyBox">
                <!--<orderExam :formExamItem="historyData"></orderExam>-->
                <orderTabs :contCont="contCont" :title="historytitle"></orderTabs>
              </div>
            </TabPane>
            <!--<TabPane label="底单图片" name="name7">
				        	<div class="historyBox">
				        		<div class="imgBox" style="width: 100%;height: 100%;display: flex;justify-content: center;align-items: center;">
				        			<!--<img src="../../../../../../ServiceQualityOrder/build/logo.png" />
				        			<img src="http://placehold.it/200x200/DFB7D2/ccc.png" alt="">
				        			<img src="http://103.36.134.21:8080//group1/M09/CB/1E/rBTJklyZgcqACGAcAAdZaIOQJ3g554.jpg"/>
				        		</div>
				        		
				        	</div>
            </TabPane>-->
          </Tabs>
        </div>
      </div>
      <!--留言信息中的添加留言-->
      <Modal v-model="addModal" title="发起留言" @on-ok="ok" ok-text="提交" @on-cancel="cancel">
        <addMes></addMes>
        <div slot="footer">
          <!--<Button type="error" size="large" long :loading="modal_loading" @click="del">Delete</Button>-->
        </div>
      </Modal>

      <div class="main_right">
        <!--处理备注-->
        <div class="mr_remark" id="mr_remark" v-if="remarkState">
          <p class="qd_right_title">
            <span class="qd_left">
              <span class="re">处理备注</span>
              <!--<Button size="small" @click="replayClick">协助回复</Button>-->
            </span>
            <span
              @click="goHide()"
              style="display: inline-block;font-size: 16px;cursor: pointer;"
              class="iconfont icon-Reduce"
            ></span>
            <!--<Button size="small" @click="goHide()"><span class="iconfont icon-Reduce"></span></Button>-->
          </p>
          <!--协助回复的模态框-->
          <Modal v-model="replay.state" title="协助回复">
            <p>处理建议（累计输入最大不超过500字）：</p>
            <Input v-model="replay.desc" type="textarea"></Input>
            <div slot="footer">
              <Button @click="reCancel">取消</Button>
              <Button type="primary" @click="reOk">确定</Button>
            </div>
          </Modal>
          <div class="qd_right_line">
            <!--<p style="line-height: 30px;font-weight: bold;">2019-02-21 12:10:23</p>-->
            <Timeline style="margin-top: 10px;">
              <TimelineItem v-for="(item,index) in logArray" key="index">
                <p class="time">{{item.createOn}}</p>
                <div class="content">{{item.processContent}}</div>
              </TimelineItem>
            </Timeline>
          </div>
        </div>
        <handleRight ref="handleRight" :rightArray="rightArray" @handleFinish="handleFinish"></handleRight>
        <!--处理完成后的模态框-->
        <Modal v-model="finishState" title="友情提示" @on-cancel="cancelfinishState">
          <h3>请选择下一步的操作</h3>
          <div slot="footer">
            <Button @click="finishBack">返回列表</Button>
            <Button type="primary" @click="finishNext">处理下一条</Button>
          </div>
        </Modal>
        <Modal
          title="是否首跟？"
          v-model="isShowGen.state"
          :closable="false"
          ok-text="首跟"
          cancel-text="下一条"
          @on-ok="shouGen"
          @on-cancel="next"
          :mask-closable="false"
        >
          <p>{{isShowGen.text}}</p>
        </Modal>
      </div>
    </div>
  </div>
</template>

<script>
import {
  addClass,
  removeClass,
  formatDateTime,
  drag
} from "@/functions/function.js";
import detailTable2 from "@/mock/detailHandle.js";
import detailForm from "./detailForm.vue";
import mesRecord from "@/components/detailTabs/mesageRecord/record.vue";
import orderExam from "@/components/detailTabs/orderExam/exam.vue";

import orderTabs from "@/components/detailTabs/orderExam/exam_tabs.vue";

import orderClaim from "@/components/detailTabs/claim/claim.vue";
import addMes from "@/components/detailTabs/addMes/addMes.vue";
import subStation from "@/pages/index/views/orderHandle/subStation.vue"; //提交驿站
import smspush from "@/pages/index/views/orderHandle/smspush.vue"; //短信推送
import sClaim from "@/pages/index/views/orderHandle/s_claim.vue"; //提交先行理赔
import handleRight from "@/pages/index/views/orderHandle/orderAging.vue"; //右边部分可操作的选项

import {
  getHandlePageData,
  getHandleIdData,
  getLogs,
  getTrail,
  getMessages,
  getYizhan,
  getReply
} from "@/api/orderManage/handle.js";
import {
  GetHistory,
  getFirstReply,
  getDealReply,
  getOrdReply,
  getComeBack,
  orderTurn,
  getBasicInfor,
  delayById
} from "@/api/orderManage/handle.js";
import {
  getAllType,
  getAllSite,
  getorderInfor,
  getAllTypes,
  getorderSource,
  getAllSiteByHqPro,
  GetSiteByCategoryCode
} from "@/api/orderManage/input.js";
export default {
  components: {
    detailForm,
    mesRecord,
    orderExam,
    orderClaim,
    addMes,
    subStation,
    smspush,
    sClaim,
    handleRight,
    drag,
    orderTabs
  },
  props: {},
  data() {
    return {
      boxHeight: window.innerHeight + "px",
      roleType: "",
      backTitle: "",
      firstArray: {},
      rightArray: {},
      logArray: [], //处理备注的数组（日志）
      flag: false,
      cur: {
        x: 0,
        y: 0
      },
      nx: 0,
      ny: 0,
      dx: 0,
      dy: 0,
      x: 0,
      y: 0,

      isShowGen: {
        state: false,
        text: ""
      },
      remarkState: false,
      addModal: false, //留言信息中的添加留言的模态框的显示
      backData: {
        backmodal: false, //打回总部 的模态框显示
        backDesc: "",
        compintedDot: "", //被投诉网点
        compintedCode: "", //被投诉网点的code
        comData: []
      },
      //工单转交
      orderData: {
        ordermodal: false,
        processSite: "", //网点名称
        processName: "",
        processSiteCode: "", //网点code
        ProcessBy: "", //员工名称
        ProcessByName: "",
        ProcessUserId: "", //员工id
        comData: [], //工单转交中网点的数组
        proData: [], //工单转交中  员工名称的数组
        companyId: "",
        loading4: false,
        loading5: false
      },

      //提交驿站
      subData: {
        submodal: false
      },
      formSubItem: {
        yunNumber: "", //运单号
        orderType: "", //单号类别
        orderPro: "", //内件物品

        complain: "", //投诉人角色
        complainName: "", //投诉人姓名
        complainPhone: "", //投诉人电话
        typeOne: "", //工单类型一
        typeTwo: "", //工单类型二
        apply: "", //支付宝账号
        desc: "" //需求描述
      },
      //短信推送
      smsData: {
        smsmodal: false
      },
      social: [],
      huifu: "标准回复",
      smsItem: {
        fajian: "", //发件人
        shoujian: "", //收件人
        third: "", //第三方
        desc: "" //自定义回复
      },
      //提交先行理赔
      sClaimData: {
        claimodal: false
      },
      //协助回复
      replay: {
        state: false,
        desc: ""
      },
      claimItem: {
        typeOne: "", //类型一
        typeTwo: "", //类型二
        complaint: "", //被投诉方
        compPeople: "", //被投诉方联系人
        compPhone: "", //被投诉方联系电话
        transfer: "", //中转模式
        aimDot: "", //目的网点
        alipay: "", //支付宝账号
        kuaiType: "", //快件内件类型

        demandDes: "", //希求描述
        orderFiles: "", //面单附件
        proofFiles: "" //举证附件
      },
      //申请延迟
      delayData: {
        delaymodal: false,
        desc: ""
      },
      //升级协助
      assistData: {
        assistmodal: false,
        reason: "",
        dot: ""
      },
      //是否显示某些固定按钮
      showIcon: {
        isAssist: 0, //是否允许升级协助
        isDelay: 0, //是否申请延迟
        isUrge: 0 //是否催办
      },
      //				formAdd:{
      //					mseType:'',//留言类型
      //					yunNum:'',//运单编号
      //					leadPeople:'zhangsan',//发起人
      //					goalDot:'',//目标网点
      //					theme:'',//主题
      //					content:'',//内容
      //					files:'',//附件
      //					uploadList: [],
      //				},
      //工单考核记录
      examData: {
        title: "罚款时间",
        labelArray: [
          { name: "工单ID", value: "" },
          { name: "工单类型", value: "" },
          { name: "罚款网点", value: "" },
          { name: "罚款时间", value: "" },
          { name: "罚款人", value: "" },
          { name: "被处罚网点", value: "" },
          { name: "受款网点", value: "" },
          { name: "处罚金额", value: "" },
          { name: "受款客户", value: "" },
          { name: "罚款类型", value: "" },
          { name: "受款金额", value: "" },
          { name: "调查经过", value: "" },
          { name: "发件时间", value: "" },
          { name: "撤销人", value: "" },
          { name: "撤销时间", value: "" },
          { name: "撤销网点", value: "" },
          { name: "撤销原因", value: "" },
          { name: "备注", value: "" }
        ]
      },
      //先行理赔记录
      claimData: {},
      //历史处理记录
      historytitle: "投诉录入时间",
      contCont: [],
      //留言信息
      messageArray: [],
      theight: "400",
      columns2: [
        {
          title: "驿站工单处理时间（倒序）",
          key: "actionTime",
          width: 200
        },
        {
          title: "处理内容",
          key: "memo"
        },
        {
          title: "处理状态",
          key: "bizStatus",
          width: 100
        }
      ],
      //驿站结果查看的数组
      data2: [],
      columns1: [
        {
          title: "扫描时间",
          key: "scanDate",
          width: 150
        },
        {
          title: "扫描网点",
          key: "uploadSiteName",
          width: 150
        },
        {
          title: "类型",
          key: "scanType",
          width: 80
        },
        {
          title: "跟踪记录",
          key: "memo",
          width: 240
        },
        {
          title: "扫描员",
          key: "employeeName",
          width: 100
        },
        {
          title: "包号",
          key: "packageNo",
          width: 100
        },
        {
          title: "重量",
          key: "weight",
          width: 100
        },
        {
          title: "班次",
          key: "banCi",
          width: 100
        },
        {
          title: "车签号",
          key: "carSignCode",
          width: 150
        },
        {
          title: "上传时间",
          key: "uploadDate",
          width: 200
        },
        {
          title: "巴枪ID",
          key: "PdaSn",
          width: 200
        },
        {
          title: "其他",
          key: "Remark",
          width: 200
        }
      ],
      data1: [],

      replyparams: {},
      id: "",
      indexs: "",
      quanData: [],
      finishState: false,
      loading4: false
    };
  },
  mounted() {
    //			console.log(this.$route.query,'从table传过来的行数据')
    this.backTitle = this.roleType === "1" ? "提交网点" : "工单打回";
    // let sw = "SWO21552019031300026";
    this.id = this.$route.query.d[this.$route.query.i].id;
    this.indexs = this.$route.query.i;
    this.quanData = this.$store.state.handleDetail;

    //此处已经对indexs做了监听请求数据，否则会请求接口2此
    //this.getInfor(); //根据单号获取信息
  },
  created() {
    //			console.log(this.$store.state.companyCode)
    if (
      this.$store.state.companyCode === "2155" ||
      this.$store.state.companyCode === "800302" ||
      this.firstArray.loginProvinceType === "1"
    ) {
      this.roleType = "1";
    } else {
      this.roleType = "2";
    }
  },
  methods: {
    //被投诉网点的模糊查询
    searchComp() {
      let value = this.backData.compintedDot;
      if (value != "") {
        getAllSiteByHqPro({
          key: value
        }).then(res => {
          //	            		console.log('被投诉网点',res.data)
          if (res && res.success) {
            this.loading4 = true;
            this.backData.comData = res.data;
          } else {
            this.loading4 = false;
          }
        });
      } else {
        this.backData.comData = [];
        this.loading4 = false;
      }
    },
    compSelect4(options) {
      this.loading4 = false;
      this.backData.compintedDot = options.value;
      this.backData.compintedCode = options.key; //被投诉网点的code
      //          	console.log(options)
    },
    /**
     * 获取处理单号的详细信息
     */
    getInfor() {
      this.firstArray = {};
      var detailFormView = this.$refs["detailForm"];
      console.log(this.id, "传过来的id");
      //debugger;
      if (!this.quanData[this.indexs]) {
        this.goback();
        return false;
      }
      getHandleIdData({
        Id: this.quanData[this.indexs].id
      }).then(res => {
        //判断是否是首跟状态
        if (res.data.dataState == 1) {
          this.isShowGen.state = true;
          this.isShowGen.text = `运单 ${
            res.data.billCode
          } 没有进行首跟，是否进行首跟并处理？`;

          return false;
        }
        this.firstArray = res.data;
        //----------------------------------------------------------------
        if (
          this.$store.state.companyCode === "2155" ||
          this.$store.state.companyCode === "800302" ||
          this.firstArray.loginProvinceType === "1"
        ) {
          this.roleType = "1";
        } else {
          this.roleType = "2";
        }
        this.backTitle = this.roleType === "1" ? "提交网点" : "工单打回";
        //----------------------------------------------------------------
        //此处要主动给子页面传入值
        detailFormView.formItem = res.data;

        console.log(res, "处理界面的详情");
        console.log(res.data.file, "处理界面中的附件显示");
        if (this.firstArray) {
          this.replyparams = {
            id: this.firstArray.id,
            receiveName: this.firstArray.receiveName,
            receivePhone: this.firstArray.receivePhone,
            receiveMobile: this.firstArray.receiveMobile,
            receiveArea: this.firstArray.receiveArea,
            receiveAddress: this.firstArray.receiveAddress,
            sendName: this.firstArray.sendName,
            sendPhone: this.firstArray.sendPhone,
            sendMobile: this.firstArray.sendMobile,
            sendArea: this.firstArray.sendArea,
            sendAddress: this.firstArray.sendAddress
          };
        }
        //					console.log(this.firstArray.files,'附件')
        this.getInforOrder(); //基本信息展示
        this.getInforTrail(); //获取物流轨迹
        this.getRemark(); //获取留言记录
        this.getYizhan(); //驿站
        this.getLogs(); //获取日志（处理备注）
        this.getHistoryInfor(); //获取历史处理记录
      });
    },

    //处理完成的按钮
    handleFinish(mes) {
      this.$Spin.show();
      console.log(mes, "处理完成的内容");
      let fhparams = {
        id: this.firstArray.id,
        receiveName: this.firstArray.receiveName,
        receivePhone: this.firstArray.receivePhone,
        receiveMobile: this.firstArray.receiveMobile,
        receiveArea: this.firstArray.receiveArea,
        receiveAddress: this.firstArray.receiveAddress,
        sendName: this.firstArray.sendName,
        sendPhone: this.firstArray.sendPhone,
        sendMobile: this.firstArray.sendMobile,
        sendArea: this.firstArray.sendArea,
        sendAddress: this.firstArray.sendAddress,
        processContent: mes.handleCont,
        files: mes.files
      };
//    debugger;
      if (mes.type === 0) {
        //没有标准回复的处理完成按钮
        //处理完成的按钮
        console.log(fhparams);
        getDealReply(fhparams).then(res => {
          this.$Spin.hide();
          if (res && res.success) {
            this.$Message.info(res.msg);
            this.finishState = true;
            this.$refs["handleRight"].handleMess = "";
          } else {
            this.$Message.info(res.msg);
          }
        });
      } else if (mes.type === 1) {
        //带标准回复的   处理完成按钮
        fhparams.reply = mes.reply; //
        console.log(fhparams);
        getOrdReply(fhparams).then(res => {
          this.$Spin.hide();
          if (res && res.success) {
            this.$Message.info(res.msg);
            this.finishState = true;
            this.$refs["handleRight"].handleMess = "";
          } else {
            this.$Message.info(res.msg);
          }
        });
      }
    },
    //获取日志
    async getLogs() {
      let sw = "";
      if (this.firstArray) {
        sw = this.firstArray.id;
      }
      getLogs({
        workOrderId: sw
      }).then(res => {
        //					console.log(res,'日志')
        this.logArray = res.data;
        //					let arr=res.data
        //					arr.sort();
        //					let arr1=[]
        //				    for (var i = 0; i < arr.length; i++) {
        //				    	arr[i].createOn.split(" ")[0]
        //				    	arr1.push(arr[i].createOn.split(" ")[0])
        //				    }
        //				    let arr2=[]
        //				    arr1.forEach(function(val){
        //				    	if(arr2.indexOf(val)==-1){
        //				    		arr2.push(val)
        //				    	}
        //				    })
        //				    let arr3=[],arr4=[];
        //				    for(let i=0;i<arr.length;i++){
        //				    	if(arr[i].createOn.split(" ")[0]==arr[i+1].createOn.split(" ")[0]){
        //				    		arr3.push(arr[i])
        //				    	}else{
        //				    		arr3.push(arr[i]);
        //				    		arr4.push(arr3.slice(0))
        //				    		arr3.length=0
        //				    	}
        //				    }
        //				    console.log(arr4)
      });
    },
    //根据运单号获取物流轨迹
    async getInforTrail() {
      let sw = "";
      if (this.firstArray) {
        sw = this.firstArray.billCode;
      }

      getTrail({
        billCode: sw
      }).then(res => {
        console.log(res, "物流轨迹");
        if (res && res.success) {
          this.data1 = res.data;
        } else {
          const res = res || { msg: "请求失败" };
          this.$Notice.warning({
            title: "提示信息",
            desc: res.msg
          });
        }
        //					console.log(res,'物流轨迹')
      });
    },
    //获取留言记录
    async getRemark() {
      let sw = "";
      if (this.firstArray) {
        sw = this.firstArray.billCode;
      }
      //				console.log(sw)
      //3700341571339
      getMessages({
        billCode: sw
      }).then(res => {
        this.messageArray = res.data;
        //					console.log(res,'留言记录')
        //					console.log(this.messageArray[2].contents[1].files)
      });
    },
    //驿站结果查看
    async getYizhan() {
      let sw = "";
      if (this.firstArray) {
        sw = this.firstArray.billCode;
      }
      getYizhan({
        billCode: sw
      }).then(res => {
        //					res.data.forEach((item,index.arr)=>{
        //
        //					})
        this.data2 = res.data;
        //					console.log(res,'驿站结果')
      });
    },
    //获取历史处理记录
    async getHistoryInfor() {
      let sw = "";
      if (this.firstArray) {
        sw = this.firstArray.billCode;
      }
      GetHistory({
        billCode: sw
      }).then(res => {
        //					console.log(res,'历史处理记录')
        this.contCont = res.data;
      });
    },
    //获取基本信息
    async getInforOrder() {
      if (this.firstArray) {
        this.rightArray = {
          siteProcessTime: this.firstArray.siteProcessTime,
          becomplainSiteName: this.firstArray.becomplainSiteName,
          lastScanSite: this.firstArray.lastScanSite,
          reqDescription: this.firstArray.reqDescription,
          remark: this.firstArray.remark,
          file: this.firstArray.file,
          dataTypeDisplay: this.firstArray.dataTypeDisplay
        };
        this.showIcon = this.firstArray.showIcon;
      }
    },

    //返回列表按钮
    goback() {
      this.$router.push({
        name: "orderHandle"
      });
    },

    next() {
      this.indexs = this.indexs + 1;
      //				console.log(this.indexs)
      //
      //				console.log(JSON.parse(sessionStorage.getItem('saveHandleDetail')))
      //				setTimeout(function)
      ////				this.getInfor()//根据单号获取信息
      //				console.log(this.$route.query.r,'传过来的参数')
      //				console.log(this.$route.query.i,'传过来的参数')
      //				console.log(this.$route.query.d,'传过来的所有的行数据')
    },
    //查看备注的按钮
    goremark() {
      this.remarkState = !this.remarkState;
    },

    getHeight() {
      let wh = document.querySelector(".handleD_box").clientHeight;
      let hh = document.querySelector(".hd_title").clientHeight;
      let zh = document.querySelector(".ml_t").clientHeight;
      let mh = wh - hh - zh - 1400 + "px";
      let mth = wh - hh - zh;
      //				this.theight=mth
      //				console.log(wh,'整体的高度')
      //				console.log(hh,'头部')
      //				console.log(zh,'表格')
      //				console.log(mh,'table')
      //				console.log(mth,'table2')
      //				document.querySelector(".ivu-tabs-content").style.height=mh
      //				document.querySelector(".ivu-table-wrapper").style.height=mh
    },
    //点击添加留言按钮
    mesAdd() {
      this.addModal = true;
      alert("你点击了添加留言按钮");
    },
    //			添加留言模态框中的确定按钮
    ok() {
      this.$Message.info("Clicked ok");
    },
    //添加留言模态框中的取消按钮
    cancel() {
      //              this.$Message.info('Clicked cancel');
      this.formAdd.resetFields();
    },
    //打回总部按钮
    back() {
      this.backData.backmodal = true;
    },
    backOk() {
      this.$Spin.show();
      let par = {};
      if (this.roleType === "1") {
        //提交网点的参数
        par = {
          id: this.firstArray.id, //工单id
          beComplainsiteCode: this.backData.compintedCode, //被投诉网点
          repulseyType: 2
        };
      } else {
        //工单打回的参数
        par = {
          id: this.firstArray.id, //工单id
          remark: this.backData.backDesc,
          repulseyType: 1
        };
      }
      //          	console.log(par,'参数参数')
      //打回总部按钮
      getComeBack(par).then(res => {
        this.$Spin.hide();
        if (res && res.success) {
          this.$Message.success(res.msg);
          this.backData.backmodal = false;
          //打回总部成功，调取下一条信息记录
          this.finishState = true;
          //          			console.log(res,'打回总部按钮')
        } else {
          this.$Message.info(res.msg);
        }
      });
    },
    backCancel() {
      this.backData.backDesc = "";
      this.backData.backmodal = false;
    },

    //工单转交
    orderzhuan() {
      this.orderData.ordermodal = true;
    },
    orderOk() {
      //          	this.$Message.info('工单转交中的提交');

      this.$Spin.show();
      this.orderData.ordermodal = false;
      let par = {
        id: this.firstArray.id, //工单id
        processSite: this.orderData.processName, //网点名称
        processSiteCode: this.orderData.processSiteCode, //网点code
        ProcessUserId: this.orderData.ProcessUserId, //员工id,
        ProcessBy: this.orderData.ProcessByName //员工名称
      };
      //          	console.log(par,'参数参数')
      orderTurn(par).then(res => {
        this.$Spin.hide();
        if (res && res.success) {
          this.$Message.info(res.msg);
          this.next();
        } else {
          this.$Message.info(res.msg);
        }
        //          		console.log(res,'工单转交的按钮')
      });
    },
    orderCancel() {
      this.orderData.processSite = "";
      this.orderData.ProcessBy = "";
      this.orderData.ordermodal = false;
    },
    //工单转交中的网点名称
    handleSearch4(value) {
      GetSiteByCategoryCode({
        key: value
      }).then(res => {
        if (res && res.success) {
          this.orderData.comData = res.data;
        } else {
          this.orderData.comData = [];
        }
      });
    },
    handleSelect4(value) {
      console.log(value);

      this.orderData.processName = value.label.split("|")[0];
      this.orderData.processSiteCode = value.value;
      this.orderData.companyId = value.value;
    },
    //工单转交中的 员工名称
    handleSearch5(value) {
      //获取员工的基础信息
      getBasicInfor({
        key: value,
        companyId: this.orderData.companyId
      }).then(res => {
        if (res && res.success) {
          this.orderData.proData = res.data;
          console.log(res, "获取员工的基本信息");
        } else {
          this.orderData.proData = [];
        }
      });
    },
    handleSelect5(value) {
      this.orderData.ProcessByName = value.label.split("|")[0]; //员工名称
      this.orderData.ProcessUserId = value.value;
    },
    //提交驿站
    subStation() {
      this.subData.submodal = true;
    },
    subOk() {
      this.$Message.info("提交驿站中的提交");
      this.subData.submodal = false;
    },
    subCancel() {
      this.formSubItem.yunNumber = ""; //运单号
      this.formSubItem.orderType = ""; //单号类别
      this.formSubItem.orderPro = ""; //内件物品
      this.formSubItem.complain = ""; //投诉人角色
      this.formSubItem.complainName = ""; //投诉人姓名
      this.formSubItem.complainPhone = ""; //投诉人电话
      this.formSubItem.typeOne = ""; //工单类型一
      this.formSubItem.typeTwo = ""; //工单类型二
      this.formSubItem.apply = ""; //支付宝账号
      this.formSubItem.desc = ""; //需求描述
    },
    //短信推送
    SMS() {
      this.smsData.smsmodal = true;
    },
    smsOk() {
      this.$Message.info("短信推送中的提交");
      this.smsData.smsmodal = false;
    },
    smsCancel() {
      this.social = [];
      this.huifu = "标准回复";

      this.smsItem.fajian = ""; //发件人
      this.smsItem.shoujian = ""; //收件人
      this.smsItem.third = ""; //第三方

      this.smsItem.complain = ""; //投诉人角色
      this.smsItem.complainName = ""; //投诉人姓名
      this.smsItem.complainPhone = ""; //投诉人电话
      this.smsItem.typeOne = ""; //工单类型一
      this.smsItem.typeTwo = ""; //工单类型二
      this.smsItem.apply = ""; //支付宝账号
      this.smsItem.desc = ""; //需求描述
    },
    //提交先行理赔
    claim() {
      this.sClaimData.claimodal = true;
    },
    claimOk() {
      let _w = this.claimItem;
      let _t =
        _w.typeOne === "" ||
        _w.typeTwo === "" ||
        _w.complaint === "" ||
        _w.compPeople === "" ||
        _w.compPhone === "" ||
        _w.transfer === "" ||
        _w.aimDot === "" ||
        _w.alipay === "" ||
        _w.kuaiType === "";
      if (_t) {
        alert("带星号的选项不能为空");
      } else {
        this.$Message.info("先行提交理赔 的提交");
        this.sClaimData.claimodal = false;
      }
    },
    claimCancel() {
      this.claimItem.typeOne = ""; //类型一
      this.claimItem.typeTwo = ""; //类型二
      this.claimItem.complaint = ""; //被投诉方
      this.claimItem.compPeople = ""; //被投诉方联系人
      this.claimItem.compPhone = ""; //被投诉方联系电话
      this.claimItem.transfer = ""; //中转模式
      this.claimItem.aimDot = ""; //目的网点
      this.claimItem.alipay = ""; //支付宝账号
      this.claimItem.kuaiType = ""; //快件内件类型
      this.claimItem.demandDes = ""; //希求描述
      this.claimItem.orderFiles = ""; //面单附件
      this.claimItem.proofFiles = ""; //举证附件
    },

    //申请延迟
    delay() {
      this.delayData.delaymodal = true;
    },
    delayOk() {
      this.$Spin.show();
      delayById({ id: this.id, ReqDescription: this.delayData.desc }).then(
        res => {
          this.$Spin.hide();
          if (res && res.success) {
            this.$Message.success(res.msg);
            this.delayData.delaymodal = false;
            this.delayData.desc = "";
            this.finishState = true;
          } else if (res && !res.success) {
            this.$Message.error(res.msg);
          } else {
            this.$Message.error("操作失败！");
          }
        }
      );
    },
    delayCancel() {
      this.delayData.desc = "";
      this.delayData.delaymodal = false;
    },
    //升级协助
    assist() {
      this.assistData.assistmodal = true;
    },
    assistOk() {
      this.$Message.info("升级协助的提交");
      this.assistData.assistmodal = false;
    },
    assistCancel() {
      this.assistData.dot = "";
      this.assistData.reason = "";
      this.assistData.assistmodal = false;
    },
    goHide() {
      this.remarkState = !this.remarkState;
    },
    //协助回复
    replayClick() {
      this.replay.state = !this.replay.state;
    },
    reCancel() {
      this.replay.desc = "";
      this.replay.state = !this.replay.state;
    },
    reOk() {
      alert("点击了无额定");
    },
    cancelfinishState() {
      this.finishBack();
    },
    //返回列表
    finishBack() {
      this.goback();
      this.finishState = false;
    },
    //处理下一条
    finishNext() {
      this.next();
      this.finishState = false;
    },
    //确认首跟
    shouGen() {
      getFirstReply({
        id: this.quanData[this.indexs].id
      }).then(res => {
        if (res && res.success) {
          this.$Message.success("首跟成功！");
          this.getInfor();
        } else {
          this.$Message.success("首跟失败，自动跳转到下一条");
          this.next();
        }
        this.isShowGen.state = false;
      });
    }
  },
  updated() {
    if (this.remarkState) {
      let div2 = document.getElementById("mr_remark");
      drag(div2);
    }
    if (this.loading4) {
      let inputs = document.getElementsByClassName("p2")[0];
      var div = document.getElementsByClassName("drop")[0];
      document.onclick = function(event) {
        event = event || window.event;
        if (div) {
          div.style.display = "none";
        }
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
  watch: {
    indexs: function(newName, oldName) {
      if (newName !== oldName) {
        //					console.log(newName,'新')
        //					console.log(oldName,'旧')
        this.getInfor();
      }
    },
    remarkState: function(newName, oldName) {}
  }
};
</script>

<style lang="less" scoped>
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    top: 0;
  }
}

.handleD_box {
  width: 100%;
  background-color: #f5f5f5;
  padding: 10px;
  overflow-y: auto !important;
  .hd {
    background-color: #ffffff;
    padding: 10px;
    .hd_row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .row_l {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .row_item {
          margin-right: 20px;
          .desc {
            margin-left: 10px;
            font-size: 14px;
            color: rgba(51, 51, 51, 1);
          }
        }
        .itemNum {
          padding-left: 20px;
          border-left: 1px solid #dddddd;
        }
        .times {
          span {
            display: inline-block;
            width: 20px;
            height: 20px;
            text-align: center;
            line-height: 20px;
            color: #ffffff;
            border-radius: 50%;
            background-color: #ed4014;
          }
        }
        .twice {
          span {
            display: inline-block;
            width: 66px;
            height: 20px;
            text-align: center;
            line-height: 20px;
            color: #ffffff;
            border-radius: 8px;
            background-color: #ed4014;
          }
        }
      }
    }
    .hd_bottom {
      color: #999999;
      margin-top: 10px;
    }
  }
  /*第一部分*/
  .hd_title {
    margin-bottom: 10px;
  }
  /*第二部分*/
  .hd_mainInfo {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    background-color: #ffffff;
  }
  .hd_mainInfo .main_left {
    width: 60%;
    border-right: 1px solid #cccccc;
    .ml_t {
      border-bottom: 1px solid #cccccc;
      padding: 10px;
    }
    .ml_b {
      border-top: 1px solid #cccccc;
      padding: 10px;
      margin-top: 10px;
      .messBox,
      .examBox,
      .historyBox {
        border: 1px solid #dcdee2;
        height: 400px;
        overflow-y: scroll;
        box-sizing: border-box;
      }
      .examBox {
        margin-left: 1px;
      }
      .historyBox {
        margin-left: 1px;
      }
      .claimBox {
        overflow-y: scroll;
        border: 1px solid #dcdee2;
        height: 400px;
        margin-left: 2px;
      }
    }
  }
  .hd_mainInfo .main_right {
    width: 40%;
    padding: 10px;
    /*position: relative;*/
    .mr_form .mr_ft {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-wrap: wrap;
      border-bottom: 1px dashed #e8eaec;
    }
    .mr_form .mr_fb {
      padding-top: 20px;
    }
    .mr_remark {
      position: absolute;
      top: 100px;
      right: 610px;
      background-color: #ffffff;
      border: 1px solid #dcdee2;
      padding: 10px;
      width: 25%;
      height: 640px;
      overflow-y: scroll;
      z-index: 999999;
      .qd_right_title {
        height: 35px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        color: #333333;
        font-weight: bold;
        border-bottom: 1px solid #e8eaec;
        .qd_left {
          .re {
            display: inline-block;
            width: 62px;
            line-height: 35px;
            border-bottom: 2px solid #ed6900;
            margin-right: 10px;
          }
        }
      }
      .qd_right_line {
        .time {
          background-color: #ffb981;
          color: #ffffff;
          border-radius: 12px;
          width: 150px;
          height: 25px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .content {
          margin-top: 10px;
          margin-left: 10px;
          /*width: 258px;*/
          background-color: #f5f5f5;
          padding: 10px;
          color: #333333;
        }
      }
    }
  }
}
</style>