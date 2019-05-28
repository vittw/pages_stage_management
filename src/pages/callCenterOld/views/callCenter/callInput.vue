<template lang="html">
  <div class="source_warper warper normal">
    <Header>
      <span class="colorBlock"></span>
      <span>工单录入</span>
      <template slot = "rightWarper">
        <Button type="primary" @click="handleSubmit(1)">提交内部</Button>
        <Button @click="handleSubmit(2)">提交网点</Button>
        <Button @click="handleSubmit(3)">处理</Button>
        <Button @click="handleReset">重置</Button>
      </template>
    </Header>
    <Section :isNormal="true">
      <template slot="form">
  <Form
    autocomplete="off"
    ref="formItem"
    :model="formItem"
    :rules="ruleValidate"
    label-position="left"
  >
    <ButtonGroup style="margin-bottom: 12px">
      <Button
        v-for="(item,index) in gridTxt"
        :type="checkType(index)"
        :key="index"
        @click="changeGrid(index)"
      >{{item}}</Button>
    </ButtonGroup>
    <OrderGrid v-if="this.type==0" :billCode="this.formItem.billCode" :isChange="isChange"></OrderGrid>
    <Record v-if="this.type==1" :billCode="this.formItem.billCode" :isChange="isChange"></Record>
    <ExamTabs v-if="this.type==2" :billCode="this.formItem.billCode" :isChange="isChange"></ExamTabs>
    <!-- 第一步 -->
    <div class="step_title">1、快件信息</div>
    <Divider dashed/>
    <Row :gutter="16">
      <Col span="6">
        <FormItem label="运单编号" :label-width="88" prop="billCode">
          <Input
            clearable
            placeholder="请输入运单号"
            v-model="formItem.billCode"
            @on-blur="getOrderInfo"
          />
        </FormItem>
      </Col>
      <!-- <Col span="6">
        <FormItem label="订单号" :label-width="88" prop="orderId">
          <Input clearable v-model="formItem.orderId" placeholder="请输入订单号"/>
        </FormItem>
      </Col>-->
      <!-- <Col span="6">
                <FormItem label="单号类别" :label-width="88">
                    <Input clearable placeholder="请输入单号类别" />
                </FormItem>
      </Col>-->
      <Col span="6">
        <FormItem label="内件价值" :label-width="88" prop="itemValue">
          <Input clearable v-model="formItem.itemValue" placeholder="请输入内件价值"/>
        </FormItem>
      </Col>
      <Col span="6">
        <FormItem label="内件品名" :label-width="88" prop="goodsName">
          <Input clearable v-model="formItem.goodsName" placeholder="请输入内件物品"/>
        </FormItem>
      </Col>
      <Col span="6">
        <FormItem label="快件运费" :label-width="88" prop="freight">
          <Input clearable v-model="formItem.freight" placeholder="请输入快件运费"/>
        </FormItem>
      </Col>
    </Row>

    <!-- 第二步 -->
    <div class="step_title">2、用户信息</div>
    <Divider dashed/>
    <Row :gutter="16">
      <Col span="6">
        <FormItem label="投诉人角色" :label-width="88" prop="initRole">
          <Select placeholder="请选择投诉人角色类型" v-model="formItem.initRole" clearable>
            <Option value="0">收件人</Option>
            <Option value="1">发件人</Option>
            <Option value="2">第三方</Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="6">
        <FormItem label="投诉人电话" :label-width="88" prop="initPhone">
          <Input clearable v-model="formItem.initPhone" placeholder="请输入投诉人电话" @on-blur="GetOrderInfoByPhone"/>
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="16">
      <Col span="6">
        <FormItem label="发件人姓名" :label-width="88" prop="sendName">
          <Input clearable v-model="formItem.sendName" placeholder="请输入发件人姓名"/>
        </FormItem>
      </Col>
      <Col span="6" class="contact">
        <FormItem label="发件人座机" :label-width="88" prop="sendPhone">
          <Input
            clearable
            v-if="wholeData.isValidSendPhone!=1"
            v-model="formItem.sendPhone"
            placeholder="请输入发件人座机"
          />
          <Input
            clearable
            v-if="wholeData.isValidSendPhone===1"
            disabled="disabled"
            v-model="formItem.sendPhone"
            placeholder="请输入发件人座机"
          />
        </FormItem>
          <Button v-if="wholeData.isValidSendPhone===1" v-on:click="EditPhone('isValidSendPhone')">
	          <Icon type="ios-create-outline" :size="17"/>
	        </Button>
      </Col>
      <Col span="6" class="contact">
        <FormItem label="发件人手机" :label-width="88" prop="sendMobile">
          <Input
            clearable
            v-if="wholeData.isValidSendMobile!=1"
            v-model="formItem.sendMobile"
            placeholder="请输入发件人手机"
          />
          <Input
            clearabl
            v-if="wholeData.isValidSendMobile===1"
            disabled="disabled"
            v-model="formItem.sendMobile"
            placeholder="请输入发件人手机"
          />
        </FormItem>
        <Button v-if="wholeData.isValidSendMobile===1" v-on:click="EditPhone('isValidSendMobile')">
          <Icon type="ios-create-outline" :size="17"/>
        </Button>
      </Col>
      <Col span="12">
        <FormItem label="发件人省市区" :label-width="88" prop="sendArea">
          <Select
            id="querySelect"
            ref="sendArea"
            filterable
            remote
            clearable
            placeholder="请输入发件人地址"
            v-model="formItem.sendArea"
            :remote-method="handleSendArea"
            :loading="sendArea.loading"
          >
            <Option
              v-for="(option, index) in sendArea.options"
              :value="option.Value"
              :key="index"
            >{{option.Value}}</Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="发件人地址" :label-width="88" prop="sendAddress">
          <Input clearable v-model="formItem.sendAddress" placeholder="请输入发件人地址"/>
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="16">
      <Col span="6">
        <FormItem label="收件人姓名" :label-width="88" prop="receiveName">
          <Input clearable v-model="formItem.receiveName" placeholder="请输入收件人姓名"/>
        </FormItem>
      </Col>
      <Col span="6" class="contact">
        <FormItem label="收件人座机" :label-width="88" prop="receivePhone">
          <Input
            clearable
            v-if="wholeData.isValidReceivePhone!=1"
            v-model="formItem.receivePhone"
            placeholder="请输入收件人座机"
          />
          <Input
            clearable
            v-if="wholeData.isValidReceivePhone===1"
            disabled="disabled"
            v-model="formItem.receivePhone"
            placeholder="请输入收件人座机"
          />
        </FormItem>

        <Button
          v-if="wholeData.isValidReceivePhone===1"
          v-on:click="EditPhone('isValidReceivePhone')"
        >
          <Icon type="ios-create-outline" :size="17"/>
        </Button>
      </Col>
      <Col span="6" class="contact">
        <FormItem label="收件人手机" prop="receiveMobile" :label-width="88">
          <Input
            clearable
            v-if="wholeData.isValidReceiveMobile!=1"
            v-model="formItem.receiveMobile"
            placeholder="请输入收件人手机"
          />
          <Input
            clearable
            v-if="wholeData.isValidReceiveMobile===1"
            disabled="disabled"
            v-model="formItem.receiveMobile"
            placeholder="请输入收件人手机"
          />
        </FormItem>
        <Button
          v-if="wholeData.isValidReceiveMobile===1"
          v-on:click="EditPhone('isValidReceiveMobile')"
        >
          <Icon type="ios-create-outline" :size="17"/>
        </Button>
      </Col>
      <Col span="12">
        <FormItem label="收件人省市区" :label-width="88" prop="receiveArea">
          <Select
            filterable
            remote
            clearable
            placeholder="请输入收件人地址"
            v-model="formItem.receiveArea"
            :remote-method="handleReceiveArea"
            :loading="sendArea.loading"
          >
            <Option
              v-for="(option, index) in receiveArea.options"
              :value="option.Value"
              :key="index"
            >{{option.Value}}</Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="收件人地址" :label-width="88" prop="receiveAddress">
          <Input clearable v-model="formItem.receiveAddress" placeholder="请输入收件人地址"/>
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="16" v-if="formItem.initRole == 2">
      <Col span="6">
        <FormItem label="第三方姓名" :label-width="88" prop="otherName">
          <Input clearable v-model="formItem.otherName" placeholder="请输入第三方姓名"/>
        </FormItem>
      </Col>
      <Col span="6" class="contact">
        <FormItem label="第三方座机" :label-width="88" prop="otherPhone">
          <Input
            clearable
            v-if="wholeData.isValiOtherPhone!=1"
            v-model="formItem.otherPhone"
            placeholder="请输入第三方座机"
          />
          <Input
            clearable
            v-if="wholeData.isValiOtherPhone===1"
            disabled="disabled"
            v-model="formItem.otherPhone"
            placeholder="请输入第三方座机"
          />
        </FormItem>
        <Button v-if="wholeData.isValiOtherPhone===1" v-on:click="EditPhone('isValiOtherPhone')">
          <Icon type="ios-create-outline" :size="17"/>
        </Button>
      </Col>
      <Col span="6" class="contact">
        <FormItem label="第三方手机" :label-width="88" prop="otherMobile">
          <Input
            clearable
            v-if="wholeData.isValidOtherMobile!=1"
            v-model="formItem.otherMobile"
            placeholder="请输入第三方手机"
          />
          <Input
            clearable
            v-if="wholeData.isValidOtherMobile===1"
            disabled="disabled"
            v-model="formItem.otherMobile"
            placeholder="请输入第三方手机"
          />
        </FormItem>
        <Button
          v-if="wholeData.isValidOtherMobile===1"
          v-on:click="EditPhone('isValidOtherMobile')"
        >
          <Icon type="ios-create-outline" :size="17"/>
        </Button>
      </Col>
      <Col span="12">
        <FormItem label="第三方省市区" :label-width="88" prop="otherArea">
          <Select
            filterable
            remote
            clearable
            placeholder="请输入收件人地址"
            v-model="formItem.otherArea"
            :remote-method="handleOtherArea"
            :loading="otherArea.loading"
          >
            <Option
              v-for="(option, index) in otherArea.options"
              :value="option.Value"
              :key="index"
            >{{option.Value}}</Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="第三方地址" :label-width="88" prop="otherAddress">
          <Input clearable v-model="formItem.otherAddress" placeholder="请输入第三方地址"/>
        </FormItem>
      </Col>
    </Row>
    <!-- 第三步 -->
    <div class="step_title">3、工单信息</div>
    <Divider dashed/>
    <Row :gutter="16">
      <Col span="12">
        <FormItem label="工单类型" :label-width="88" prop="typeName">
          <Cascader
            :data="sourceTypeData"
            @on-change="changeTypeData"
            v-model="formItem.typeName"
            placeholder="请选择工单类型"
          ></Cascader>
        </FormItem>
      </Col>
      <Col span="6">
        <FormItem label="被投诉网点" :label-width="88" prop="beComplainsiteCode">
          <Select
            ref="beComplainsite"
            filterable
            remote
            clearable
            placeholder="请输入被投诉网点"
            v-model="formItem.beComplainsiteCode"
            @on-change="beComplainsiteChange"
            :remote-method="handleBeComplainsite"
            :loading="beComplainsite.loading"
          >
            <Option
              v-for="(option, index) in beComplainsite.options"
              :value="option.Key"
              :key="index"
            >{{option.Value}}</Option>
          </Select>
        </FormItem>
      </Col>
    </Row>
    <!-- 其他 -->
    <div class="step_title">4、其他</div>
    <Divider dashed/>
    <Row :gutter="16">
      <Col span="12">
        <FormItem label="需求描述（累计输入最大不超过500字）" prop="reqDescription">
          <Input
            type="textarea"
            v-model="formItem.reqDescription"
            clearable
            placeholder="请输入录入扫描网点"
            :maxlength="500"
            :autosize="{minRows: 4,maxRows: 4}"
          />
          <span class="input_number">{{formItem.reqDescription.length}} / 500</span>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="备注（累计输入最大不超过500字）" prop="remark">
          <Input
            type="textarea"
            v-model="formItem.remark"
            clearable
            placeholder="备注"
            :maxlength="500"
            :autosize="{minRows: 4,maxRows: 4}"
          />
          <span class="input_number">{{formItem.remark.length}} / 500</span>
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="16">
      <Col span="12">
        <myUploadFiles ref="uploadFiles" :defaultList="defaultList" class="uploader_warper"></myUploadFiles>
      </Col>
      <Col span="12">
        <FormItem label="用户标签" prop="DealLevel">
          <Select v-model="formItem.DealLevel" placeholder="请选择用户标签" clearable>
            <Option value="normal">正常用户</Option>
            <Option value="0">特殊群体</Option>
            <Option value="1">媒体、政府</Option>
            <Option value="2">孕妇</Option>
            <Option value="3">老年人</Option>
            <Option value="4">特殊地址</Option>
            <Option value="5">小区公司件</Option>
          </Select>
        </FormItem>
      </Col>
    </Row>
  </Form>
</template>
    </Section>
  </div>
</template>

<script>
import Header from "@/components/header";
import Section from "@/components/section";
import OrderGrid from "./orderGrid.vue";
import Record from "./record.vue";
import ExamTabs from "./exam_tabs.vue";
import MyUploadFiles from "@/components/uploadFile/upload";
import {
  getOrderInforByBillCode,
  GetOrderInfoByPhone,
  getRegions,
  getAllSite,
  addCallCenterOrder
} from "@/api/callCenter/callCenter.js";
import { GetTypeByDataSource } from "@/api/baseInfo/typeSettings";
export default {
  name: "callInput",
  components: { Header, Section, OrderGrid, Record, ExamTabs, MyUploadFiles },
  props: {
    callPhone: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      isChange: false,
      defaultList: [],
      type: 0,
      gridTxt: ["物流轨迹", "留言信息", "历史处理记录"],
      // trailState: false,
      sendArea: {
        state: false,
        loading: false,
        options: []
      },
      receiveArea: {
        state: false,
        loading: false,
        options: []
      },
      otherArea: {
        loading: false,
        options: []
      },
      beComplainsite: {
        loading: false,
        options: []
      },
      sourceTypeData: [],
      formItem: {
        billCode: "", //运单号
        orderId: "", //订单号
        itemValue: "", //内件价值
        goodsName: "", //内件物品
        freight: "", //快件运费
        //少个类别
        initRole: "", //发起角色
        initPhone: this.callPhone, //发起电话
        sendName: "", //发件人姓名
        sendPhone: "", //发件人座机
        sendMobile: "", //发件人手机
        sendArea: "", //发件人省市区
        sendAddress: "", //发件人地址

        receiveName: "", //收件人姓名
        receivePhone: "", //收件人座机
        receiveMobile: "", //收件人手机
        receiveArea: "", //收件人省市区
        receiveAddress: "", //收件人地址

        otherName: "", //第三方姓名
        otherPhone: "", //第三方座机
        otherMobile: "", //第三方手机
        otherArea: "", //第三方区域
        otherAddress: "", //第三方地址

        beComplainsiteName: "", //被投诉网点
        beComplainsiteCode: "", //被投诉网点code

        reqDescription: "", //需求描述
        remark: "", //备注
        DealLevel: "",

        firstTypeName: "",
        secondTypeName: "",
        threeTypeName: "",

        typeName: [] //三级类型
      },
      wholeData: {},
      ruleValidate: {
        //运单号
        // billCode: [
        //   { required: true, message: "运单号不能为空", trigger: "blur" }
        // ],
        //发起人角色
        initRole: [
          { required: true, message: "投诉人角色不能为空", trigger: "blur" }
        ],
        //发起人电话
        initPhone: [
          { required: true, message: "投诉人电话不能为空", trigger: "blur" }
        ],
        //收件人姓名
        receiveName: [
          { required: true, message: "收件人姓名不能为空", trigger: "blur" }
        ],

        // receiveMobile: [
        //   { required: true, message: "收件人手机不能为空", trigger: "blur" }
        // ],
        //收件人省市区
        receiveArea: [
          { required: true, message: "收件人省市区不能为空", trigger: "blur" }
        ],
        //收件人地址
        receiveAddress: [
          { required: true, message: "收件人地址不能为空", trigger: "blur" }
        ],

        //被投诉网点
        beComplainsiteCode: [
          { required: true, message: "被投诉网点不能为空", trigger: "blur" }
        ],
        //工单类型
        typeName: [
          {
            required: true,
            type: "array",
            min: 1,
            message: "工单类型不能为空",
            trigger: "change"
          }
        ],
        //跟进网点的工单类型
        flloworderStyle: [
          {
            required: true,
            message: "跟进网点的工单类型不能为空",
            trigger: "blur"
          }
        ],

        //需求描述
        reqDescription: [
          {
            required: true,
            message: "需求描述不能为空",
            trigger: "blur"
          }
        ],
        otherName: [
          {
            required: true,
            message: "第三方姓名不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    callPhone(newVal) {
      // console.log('2222222');
      this.formItem.initPhone = this.callPhone;
      // if(newVal != ''){
      //   this.formItem.initPhone = this.callPhone
      // }
    }
  },
  created() {
    this.handleGetAllType();
  },
  methods: {
    getOrderInfo() {
      if (!this.formItem.billCode) {
        return false;
      }
      this.isChange = !this.isChange
      // this.formItem;
      getOrderInforByBillCode({
        billCode: this.formItem.billCode
      }).then(res => {
        if (res && res.success) {
          this.wholeData = res.data;
          this.sendArea.state = true;
          this.receiveArea.state = true;
          this.otherArea.state = true;
          this.formItem.goodsName = res.data.goodsName; //内件品名
          this.formItem.itemValue = res.data.itemValue; //内件价值
          this.formItem.freight = res.data.freight; //快件运费
          
          this.formItem.sendName = res.data.sendName; //发起人姓名
          this.formItem.sendPhone = res.data.sendPhone; //发起人电话
          this.formItem.sendMobile = res.data.sendMobile; //发起人手机
          this.formItem.sendArea = res.data.sendArea; //发起人区域
          this.formItem.sendAddress = res.data.sendAddress; //发起人地址

          this.formItem.receiveName = res.data.receiveName; // 收件人姓名
          this.formItem.receivePhone = res.data.receivePhone; //收件人电话
          this.formItem.receiveMobile = res.data.receiveMobile; //收件人手机
          this.formItem.receiveArea = res.data.receiveArea; //收件人区域
          this.formItem.receiveAddress = res.data.receiveAddress; //收件人地址

          this.formItem.initRole = res.data.initRole; //发起人角色
          this.formItem.initPhone = res.data.initPhone; //发起人电话
          this.formItem.reqDescription = res.data.reqDescription; //需求描述
          this.formItem.dealLevel = res.data.dealLevel; //用户标签
        }
        // else {
        //   this.$refs.formItem.resetFields();
        // }
      });
    },
    GetOrderInfoByPhone(){
      if (!this.formItem.initPhone) {
        return false;
      }
      this.isChange = !this.isChange
      GetOrderInfoByPhone({
      sendMobile:this.formItem.initPhone
      }).then(res=>{
      if(res && res.success){
          this.wholeData = res.data;
          this.sendArea.state = true;
          this.receiveArea.state = true;
          this.otherArea.state = true;
          this.formItem.billCode = res.data.billCode; //运单号
          this.formItem.goodsName = res.data.goodsName; //内件品名
          this.formItem.itemValue = res.data.itemValue; //内件价值
          this.formItem.freight = res.data.freight; //快件运费

          this.formItem.sendName = res.data.sendName; //发起人姓名
          this.formItem.sendPhone = res.data.sendPhone; //发起人电话
          this.formItem.sendMobile = res.data.sendMobile; //发起人手机
          this.formItem.sendArea = res.data.sendArea; //发起人区域
          this.formItem.sendAddress = res.data.sendAddress; //发起人地址

          this.formItem.receiveName = res.data.receiveName; // 收件人姓名
          this.formItem.receivePhone = res.data.receivePhone; //收件人电话
          this.formItem.receiveMobile = res.data.receiveMobile; //收件人手机
          this.formItem.receiveArea = res.data.receiveArea; //收件人区域
          this.formItem.receiveAddress = res.data.receiveAddress; //收件人地址

          this.formItem.initRole = res.data.initRole; //发起人角色
          this.formItem.reqDescription = res.data.reqDescription; //需求描述
          this.formItem.dealLevel = res.data.dealLevel; //用户标签
        }
       });
    },
    handleGetAllType() {
      GetTypeByDataSource({
        type: 2
      }).then(res => {
        if (res && res.success) {
          this.sourceTypeData = res.data;
        }
      });
    },
    handleSendArea(query) {
      if (query !== "") {
        if (this.sendArea.state) {
          this.sendArea.options = [
            { Key: this.formItem.sendArea, Value: this.formItem.sendArea }
          ];
          this.sendArea.state = false;
        } else {
          this.sendArea.loading = true;
          getRegions({
            key: query
          }).then(res => {
            this.sendArea.loading = false;
            if (res && res.success) {
              this.sendArea.options = res.data;
            } else {
              this.sendArea.options = [];
            }
          });
        }
      } else {
        this.sendArea.options = [];
      }
    },
    handleReceiveArea(query) {
      if (query !== "") {
        if (this.receiveArea.state) {
          this.receiveArea.options = [
            { Key: this.formItem.receiveArea, Value: this.formItem.receiveArea }
          ];
          this.receiveArea.state = false;
        } else {
          this.receiveArea.loading = true;
          getRegions({
            key: query
          }).then(res => {
            this.receiveArea.loading = false;
            if (res && res.success) {
              this.receiveArea.options = res.data;
            } else {
              this.receiveArea.options = [];
            }
          });
        }
      } else {
        this.receiveArea.options = [];
      }
    },
    handleOtherArea(query) {
      if (query !== "") {
        this.otherArea.loading = true;
        getRegions({
          key: query
        }).then(res => {
          this.otherArea.loading = false;
          if (res && res.success) {
            this.otherArea.options = res.data;
          } else {
            this.otherArea.options = [];
          }
        });
      } else {
        this.otherArea.options = [];
      }
    },
    handleBeComplainsite(query) {
      if (query !== "") {
        this.beComplainsite.loading = true;
        getAllSite({
          key: query
        }).then(res => {
          this.beComplainsite.loading = false;
          if (res && res.success) {
            this.beComplainsite.options = res.data;
          } else {
            this.beComplainsite.options = [];
          }
        });
      } else {
        this.beComplainsite.options = [];
      }
    },
    beComplainsiteChange() {
      if (this.$refs.beComplainsite.values[0]) {
        this.formItem.beComplainsiteName = this.$refs.beComplainsite.values[0].label.split(
          "|"
        )[0];
      } else {
        this.formItem.beComplainsiteName = "";
      }
    },
    //提交
    handleSubmit(type) {
      this.$refs.formItem.validate(valid => {
        if (valid) {
          let newForm = Object.assign({}, this.formItem, {
            addType: newForm,
            initPhone: Number(this.formItem.initPhone),
            files: this.defaultList
          });
          addCallCenterOrder(newForm).then(res => {
            if (res && res.success) {
              this.$emit("submitOver");
              this.handleReset();
              this.$Message.success(res.msg);
            } else {
              this.$Message.error(res.msg);
            }
          });
        } else {
          this.$Message.error("请输入必填项!");
        }
      });
    },
    //重置
    handleReset() {
      this.$emit("submitOver");
      this.$refs.formItem.resetFields();
      this.isChange = !this.isChange;
      this.defaultList = []; //清除上传文件的文件数组
      this.$refs.uploadFiles.uploadList = [];
    },
    // changeTrailState() {
    //   this.trailState = !this.trailState
    // },
    changeTypeData(value, selectedData) {
      this.formItem.firstTypeName = selectedData[0].label;
      this.formItem.secondTypeName = selectedData[1].label;
      this.formItem.threeTypeName = selectedData[2].label;
      this.formItem.firstTypeCode = selectedData[0].value;
      this.formItem.secondTypeCode = selectedData[1].value;
      this.formItem.threeTypeCode = selectedData[2].value;
    },
    checkType(index) {
      if (index == this.type) {
        return "primary";
      } else {
        return;
      }
    },
    changeGrid(index) {
      this.type = index;
    },
        //选择编辑电话
    /**
     *
     * @param {String} AttributeName 属性名称
     */
    EditPhone(AttributeName) {
      this.wholeData[AttributeName] = Number(
        !Boolean(this.wholeData[AttributeName])
      );
    }
  }
};
</script>

<style lang="less" scoped>
.step_title {
  font-size: 14px;
  font-weight: bold;
  color: #333333;
  margin-top: 12px;
}
.ivu-divider-horizontal {
  margin: 12px 0;
}
.ivu-form-item {
  margin-bottom: 12px;
}
.align_r {
  text-align: right;
  line-height: 32px;
  a {
    color: #0b9afc;
  }
}
.input_number {
  position: absolute;
  right: 10px;
  bottom: 0;
}
.uploader_warper .myFileBox .content {
  width: 100% !important;
}

.contact{
  display: flex !important;
  justify-content: flex-start !important;
  align-items: center !important;
  margin-right: 10px !important;
  .ivu-btn{
      width: 36px !important;
      display: flex !important;
        margin-top: -10px;
      justify-content: center !important;
      align-items: center !important;
  }
}
.contact .ivu-form-item .ivu-form-item-content{
 display: flex !important;
  justify-content: flex-start !important;
  align-items: center !important;
}
</style>
