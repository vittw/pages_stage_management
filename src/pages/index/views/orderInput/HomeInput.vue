<template>
  <div class="homeInput_outBox" :style="{height:boxHeight}">
    <!--最上面的头部-->
    <div class="homeInput_topheader">
      <div class="homeInput_top_left">
        <span class="colorBlock"></span>
        <span>客服 > 工单管理 > 工单录入</span>
      </div>
      <div class>
        <Button type="primary" @click="handleSubmit()" :disabled="isDisable">提交网点</Button>
        <Button style="margin-left: 8px" @click="handleReset('formItem')">重置</Button>
      </div>
    </div>
    <div class="homeInput_main">
      <Form ref="formItem" :model="formItem" class="inputForm" inline :rules="ruleValidate">
        <!--第一部分（快件信息）-->
        <div class="main_step stepOne">
          <div class="step_top">
            <span class="step_top_title">1、快件信息</span>
          </div>
          <div class="step_bottom">
            <FormItem label="运单号" prop="billCode">
              <Input v-model="formItem.billCode" @on-blur="onBlur" placeholder="请输入运单编号" clearable/>
            </FormItem>
            <!--<FormItem label="单号类别" prop="orderType">
	        				<Input v-model="formItem.orderType" placeholder=""></Input>
            </FormItem>-->
            <FormItem label="内件品名" prop="goodsName">
              <Input v-model="formItem.goodsName" placeholder="请输入内件品名" clearable></Input>
            </FormItem>
            <FormItem label="内件价值" prop="itemValue">
              <Input v-model="formItem.itemValue" placeholder="请输入内件价值" clearable></Input>
            </FormItem>
          </div>
        </div>
        <!--第二部分（发起人信息）-->
        <div class="main_step stepTwo">
          <div class="step_top">
            <span class="step_top_title">2、投诉人信息</span>
          </div>
          <div class="step_bottom">
            <FormItem label="投诉人角色" prop="initRole">
              <Select
                v-model="formItem.initRole"
                placeholder="请选择投诉人角色"
                label-in-value
                @on-change="onChange"
              >
                <Option value="0">收件人</Option>
                <Option value="1">发件人</Option>
                <Option value="2">第三方</Option>
              </Select>
            </FormItem>
            <FormItem label="投诉人电话" prop="initPhone">
              <Input
                v-model="formItem.initPhone"
                placeholder="投诉人电话"
                @on-keyup="initNumber"
                clearable
              ></Input>
            </FormItem>
          </div>
        </div>
        <!--第三部分（用户信息）-->
        <div class="main_step stepThree">
          <div class="step_top">
            <span class="step_top_title">3、用户信息</span>
          </div>
          <div class="step_bottom">
            <div class="step_bottom_part1">
              <div class="p1">
                <FormItem label="发件人姓名" prop="sendName">
                  <Input v-model="formItem.sendName" placeholder="请输入姓名" clearable></Input>
                </FormItem>
                <div class="contact">
                  <FormItem label="发件人座机" prop="sendPhone">
                    <Input
                      v-if="wholeData.isValidSendPhone!=1"
                      v-model="formItem.sendPhone"
                      @on-keyup="sendPh"
                      placeholder="请输入发件人座机"
                      clearable
                    ></Input>
                    <Input
                      v-if="wholeData.isValidSendPhone===1"
                      disabled="disabled"
                      v-model="formItem.sendPhone"
                      @on-keyup="sendPh"
                      placeholder="请输入发件人座机"
                      clearable
                    ></Input>
                  </FormItem>
                  <Button
                    v-if="wholeData.isValidSendPhone===1"
                    v-on:click="EditPhone('isValidSendPhone')"
                  >
                    <Icon type="ios-create-outline" :size="17"/>
                  </Button>
                </div>

                <div class="contact">
                  <FormItem label="发件人手机" prop="sendMobile">
                    <Input
                      v-if="wholeData.isValidSendMobile!=1"
                      v-model="formItem.sendMobile"
                      :maxlength="11"
                      @on-keyup="sendMo"
                      placeholder="请输入手机"
                      clearable
                    ></Input>
                    <Input
                      v-if="wholeData.isValidSendMobile===1"
                      disabled="disabled"
                      v-model="formItem.sendMobile"
                      :maxlength="11"
                      @on-keyup="sendMo"
                      placeholder="请输入手机"
                      clearable
                    ></Input>
                  </FormItem>

                  <Button
                    v-if="wholeData.isValidSendMobile===1"
                    v-on:click="EditPhone('isValidSendMobile')"
                  >
                    <Icon type="ios-create-outline" :size="17"/>
                  </Button>
                </div>
              </div>
              <div class="p2">
                <FormItem label="发件人省市区" prop="sendArea">
                  <Select
                    v-model="formItem.sendArea"
                    :placeholder="formItem.sendArea===''?'请输入':formItem.sendArea"
                    filterable
                    clearable
                    label-in-value
                    remote
                    :remote-method="handleSearch2"
                  >
                    <Option
                      v-for="item in sendData"
                      :value="item.Value"
                      :key="item.Key"
                    >{{ item.Value }}</Option>
                  </Select>
                </FormItem>
                <FormItem label="发件人地址" prop="sendAddress">
                  <Input v-model="formItem.sendAddress" placeholder="请输入发件人地址" clearable></Input>
                </FormItem>
              </div>
            </div>

            <div class="step_bottom_part1">
              <div class="p1">
                <FormItem label="收件人姓名" prop="receiveName">
                  <Input v-model="formItem.receiveName" placeholder="请输入姓名" clearable></Input>
                </FormItem>
                <div class="contact">
                  <FormItem label="收件人座机" prop="receivePhone">
                    <Input
                      v-if="wholeData.isValidReceivePhone!=1"
                      v-model="formItem.receivePhone"
                      @on-keyup="recePh"
                      placeholder="请输入收件人座机"
                      clearable
                    ></Input>
                    <Input
                      v-if="wholeData.isValidReceivePhone===1"
                      disabled="disabled"
                      v-model="formItem.receivePhone"
                      @on-keyup="recePh"
                      placeholder="请输入收件人座机"
                      clearable
                    ></Input>
                  </FormItem>
                  <Button
                    v-if="wholeData.isValidReceivePhone===1"
                    v-on:click="EditPhone('isValidReceivePhone')"
                  >
                    <Icon type="ios-create-outline" :size="17"/>
                  </Button>
                </div>
                <div class="contact">
                  <FormItem label="收件人手机" prop="receiveMobile">
                    <Input
                      v-if="wholeData.isValidReceiveMobile!=1"
                      v-model="formItem.receiveMobile"
                      :maxlength="11"
                      @on-keyup="receMo"
                      placeholder="请输入手机"
                      clearable
                    ></Input>
                    <Input
                      v-if="wholeData.isValidReceiveMobile===1"
                      v-model="formItem.receiveMobile"
                      disabled="disabled"
                      :maxlength="11"
                      @on-keyup="receMo"
                      placeholder="请输入手机"
                      clearable
                    ></Input>
                  </FormItem>
                  <Button
                    v-if="wholeData.isValidReceiveMobile===1"
                    v-on:click="EditPhone('isValidReceiveMobile')"
                  >
                    <Icon type="ios-create-outline" :size="17"/>
                  </Button>
                </div>
              </div>
              <div class="p2">
                <FormItem label="收件人省市区" prop="receiveArea">
                  <Select
                    v-model="formItem.receiveArea"
                    :placeholder="formItem.receiveArea===''?'请输入':formItem.receiveArea"
                    filterable
                    clearable
                    label-in-value
                    remote
                    :remote-method="handleSearch1"
                  >
                    <Option
                      v-for="item in receiveData"
                      :value="item.Value"
                      :key="item.Key"
                    >{{ item.Value }}</Option>
                  </Select>
                </FormItem>
                <FormItem label="收件人地址" prop="receiveAddress">
                  <Input v-model="formItem.receiveAddress" placeholder="请输入收件人地址" clearable></Input>
                </FormItem>
              </div>
            </div>

            <!--第三方人信息-->
            <div class="step_bottom_part1" v-if="inforThird">
              <div class="p1">
                <FormItem label="第三方姓名" prop="otherName">
                  <Input v-model="formItem.otherName" placeholder="请输入姓名" clearable></Input>
                </FormItem>
                <div class="contact">
                  <FormItem label="第三方座机" prop="otherPhone">
                    <Input
                      v-if="wholeData.isValiOtherPhone!=1"
                      v-model="formItem.otherPhone"
                      @on-keyup="otherPh"
                      placeholder="请输入第三方座机"
                      clearable
                    ></Input>
                    <Input
                      v-if="wholeData.isValiOtherPhone===1"
                      disabled="disabled"
                      v-model="formItem.otherPhone"
                      @on-keyup="otherPh"
                      placeholder="请输入第三方座机"
                      clearable
                    ></Input>
                  </FormItem>
                  <Button
                    v-if="wholeData.isValiOtherPhone===1"
                    v-on:click="EditPhone('isValiOtherPhone')"
                  >
                    <Icon type="ios-create-outline" :size="17"/>
                  </Button>
                </div>
                <div class="contact">
                  <FormItem label="第三方手机" prop="otherMobile">
                    <Input
                      v-if="wholeData.isValidOtherMobile!=1"
                      v-model="formItem.otherMobile"
                      :maxlength="11"
                      @on-keyup="otherMo"
                      placeholder="请输入手机"
                      clearable
                    ></Input>
                    <Input
                      v-if="wholeData.isValidOtherMobile===1"
                      disabled="disabled"
                      v-model="formItem.otherMobile"
                      :maxlength="11"
                      @on-keyup="otherMo"
                      placeholder="请输入手机"
                      clearable
                    ></Input>
                  </FormItem>
                  <Button
                    v-if="wholeData.isValidOtherMobile===1"
                    v-on:click="EditPhone('isValidOtherMobile')"
                  >
                    <Icon type="ios-create-outline" :size="17"/>
                  </Button>
                </div>
              </div>
              <div class="p2">
                <FormItem label="第三方省市区" prop="otherArea">
                  <Select
                    v-model="formItem.otherArea"
                    placeholder="请输入"
                    filterable
                    clearable
                    label-in-value
                    remote
                    :remote-method="handleSearch3"
                  >
                    <Option
                      v-for="item in otherData"
                      :value="item.Value"
                      :key="item.Key"
                    >{{ item.Value }}</Option>
                  </Select>
                </FormItem>
                <FormItem label="第三方地址" prop="otherAddress">
                  <Input v-model="formItem.otherAddress" placeholder="请输入发件人地址" clearable></Input>
                </FormItem>
              </div>
            </div>
          </div>
        </div>
        <!--第四部分（工单信息）-->
        <div class="main_step stepFour">
          <div class="step_top">
            <span class="step_top_title">4、工单信息</span>
          </div>
          <div class="step_bottom order_infor p2">
            <FormItem label="被投诉网点" prop="beComplainsiteName">
              <Select
                v-model="formItem.beComplainsiteName"
                placeholder="请输入"
                filterable
                clearable
                label-in-value
                remote
                :remote-method="handleSearch4"
                @on-change="handleSelect4"
              >
                <Option
                  v-for="(item,index) in comData"
                  :lable="item.key"
                  :value="item.value"
                  :key="item.key"
                >{{ item.value }}</Option>
              </Select>
            </FormItem>
            <FormItem label="工单类型" prop="submitorderStyle">
              <Cascader
                :data="submitorderData"
                v-model="formItem.typeName"
                placeholder="请选择工单类型"
                @on-change="handleChange"
              ></Cascader>
            </FormItem>
          </div>
        </div>
        <!--第五部分（其他）-->
        <div class="main_step stepFive">
          <!--<div class="step_top">
						<span class="step_top_title">5、其他</span>
          </div>-->
          <div class="step_bottom">
            <FormItem prop="reqDescription" label="需求描述（累积输入不超过500字）">
              <Input
                :maxlength="max"
                v-model="formItem.reqDescription"
                type="textarea"
                @on-keyup="requireTotal()"
                :autosize="{minRows: 4,maxRows: 4}"
                placeholder="请输入"
              />
              <span class="inputTotal">
                已输入：
                <span>{{tot1}}</span>
                <span>/{{max}}</span>
              </span>
            </FormItem>
            <FormItem label="备注（累积输入不超过500字）" prop="remark">
              <Input
                :maxlength="max"
                v-model="formItem.remark"
                type="textarea"
                @on-keyup="remarkTotal()"
                :autosize="{minRows: 4,maxRows: 4}"
                placeholder="请输入"
              />
              <span class="inputTotal">
                已输入：
                <span>{{tot2}}</span>
                <span>/{{max}}</span>
              </span>
            </FormItem>
          </div>
          <!--上传文件-->
          <div class="uploadFile">
            <myUploadFiles ref="uploadFiles" :defaultList="defaultList"></myUploadFiles>
          </div>
          
          
          
          
        </div>
      </Form>
    </div>
  </div>
</template>

<script>
import { getIsVideo } from "@/functions/function.js";
import {
  getRegions,
  getSecondTypeCache,
  getThreeTypeCache
} from "@/api/orderManage/input.js";
import { GetTypeByDataSource } from "@/api/baseInfo/typeSettings.js";
import {
  getAllType,
  getAllSite,
  GetPowerSiteByEs,
  getorderInfor,
  postAddOrder
} from "@/api/orderManage/input.js";
import myUploadFiles from "@/components/uploadFile/upload";

export default {
  components: {
    myUploadFiles,
  },
  name: "home",

  data() {
    return {
      boxHeight: window.innerHeight + "px",
      tot1: 0,
      tot2: 0,
      max: 500,
      isDisable: false,
      inforThird: false, //第三方信息的状态
      inforFllow: false, //跟进网点的状态
      faqirenRole: "", //发起人角色

      receiveData: [],
      sendData: [],
      otherData: [],
      comData: [],
      submitorderStyle: [], //选中的工单类型
      submitorderData: [], //工单类型的数组

      formItem: {
        typeName: [],
        submitorderStyle: [],
        billCode: "", //运单号
        goodsName: "", //内件品名
        itemValue: "", //内件价值

        initRole: "", //发起人角色
        initPhone: "", //发起人电话

        receiveName: "", //收件人姓名
        receivePhone: "", //收件人座机
        receiveMobile: "", //收件人手机
        receiveArea: "", //收件人省市区
        receiveAddress: "", //收件人地址

        sendName: "", //发件人姓名
        sendPhone: "", //发件人座机
        sendMobile: "", //发件人手机
        sendArea: "", //发件人省市区
        sendAddress: "", //发件人地址
        loading2: false,

        otherName: "", //
        otherPhone: "", //
        otherMobile: "", //
        otherArea: "", //
        otherAddress: "", //
        loading1: false,
        loading3: false,

        beComplainsiteName: "", //被投诉网点
        beComplainsiteCode: "", //被投诉网点code
        loading4: false,
        code: "",
        name: "",

        firstTypeCode: "", //一级类型编码
        firstTypeName: "", //一级类型名称
        secondTypeCode: "",
        secondTypeName: "", //
        threeTypeCode: "",
        threeTypeName: "",

        reqDescription: "", //需求描述
        remark: "" //备注
      },

      ruleValidate: {
        ////运单号
        billCode: [
          {
            required: true,
            message: "运单号不能为空",
            trigger: "blur"
          }
        ],
        //发起人角色
        initRole: [
          {
            required: true,
            message: "投诉人角色不能为空",
            trigger: "blur"
          }
        ],
        // //发起人电话
        // initPhone: [
        //   {
        //     required: true,
        //     message: "投诉人电话不能为空",
        //     trigger: "blur"
        //   }
        // ],
        //收件人姓名
        receiveName: [
          {
            required: true,
            message: "收件人姓名不能为空",
            trigger: "blur"
          }
        ],
        //收件人座机
        //					receivePhone:[
        //						{ required: true, message: '收件人手机不能为空', trigger: 'blur' }
        //					],
        //收件人省市区
        receiveArea: [
          {
            required: true,
            message: "收件人省市区不能为空",
            trigger: "blur"
          }
        ],
        //收件人地址
        receiveAddress: [
          {
            required: true,
            message: "收件人地址不能为空",
            trigger: "blur"
          }
        ],

        //被投诉网点
        beComplainsiteName: [
          {
            required: true,
            message: "被投诉网点不能为空",
            trigger: "blur"
          }
        ],
        //工单类型
        submitorderStyle: [
          {
            required: true,
            message: "工单类型不能为空",
            trigger: "blur"
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
        ],
        // otherPhone: [
        //   {
        //     required: true,
        //     message: "第三方座机不能为空",
        //     trigger: "blur"
        //   }
        // ],
        // otherMobile: [
        //   {
        //     required: true,
        //     message: "第三方手机不能为空",
        //     trigger: "blur"
        //   }
        // ]
      },

      typeValue: [],
      defaultList: [], //上传文件的数组（从子组件中传过来的）
      wholeData: {}
    };
  },
  computed: {
    //			formItem.sendMobile:{
    //				get(){},
    //				set(){}
    //			}
  },
  created() {},
  mounted() {
    console.log(this.boxHeight);
    //全量工单类型
    GetTypeByDataSource({
      type: 1
    }).then(res => {
      if (res && res.success) {
        this.submitorderData = res.data;
      } else {
        console.log(res);
        this.$Message.info(res.msg);
      }
    });
    //			this.handleResize()
    //  		window.addEventListener('resize', this.handleResize, false)
  },
  watch: {
    typeValue: function(newValue, oldValue) {
      if (newValue.length === 0) {
        this.formItem.typeName = "";
        this.formItem.submitorderStyle = "";
      } else {
        this.formItem.submitorderStyle = newValue[2].__label;
        //菜鸟 / 菜鸟111 / 菜鸟111
        //9a7fd91a43dbc667,6baa678bd8034677,6baa678bd8034677
        let code = newValue[2].__value.split(",");
        let values = newValue[2].__label.split("/");
        this.formItem.firstTypeCode = code[0]; //一级类型编码
        this.formItem.firstTypeName = values[0]; //一级类型名称
        this.formItem.secondTypeCode = code[1];
        this.formItem.secondTypeName = values[1];
        this.formItem.threeTypeCode = code[2];
        this.formItem.threeTypeName = values[2];
      }
    }
  },
  updated() {
    //			let inputs=document.getElementsByClassName("p2")[0].childNodes[0]
    //			let div=document.getElementsByClassName('drop')[0];
    //			console.log(inputs)
    //			console.log(div)
    //			document.onclick=function(event){
    //			　　event=event||window.event;
    //			　　div.style.display="none";
    //			　　event.stopPropagation();
    //			}
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
  beforeDestroy() {
    //			window.removeEventListener('resize', this.handleResize, false)
  },
  methods: {
    handleResize() {
      this.$nextTick(() => {
        this.boxHeight = window.innerHeight + "px";
      });
    },
    //发起人电话
    initNumber() {
      //this.formItem.initPhone
      let re = /\D/; // \D代表非数字
      let reg = /0\d{2}-\d{8}|0\d{3}-\d{7}/;
      let value = this.formItem.initPhone;
      let str1 = this.formItem.initPhone.slice(3, 4);
      let str2 = this.formItem.initPhone.slice(4, 5);
      if (str1 === "-" || str2 === "-") {
        if (this.formItem.initPhone.length > 12) {
          this.$Message.error("电话不能超过11位");
          this.formItem.initPhone = this.formItem.initPhone.substring(0, 12);
        } else if (this.formItem.initPhone.length === 12) {
          if (reg.test(this.formItem.initPhone)) {
          } else {
            this.$Message.error("电话号码不能出现非数字，且格式为xxx-xxxxxxxx");
          }
        }
      } else {
        if (re.test(this.formItem.initPhone)) {
          // 返回true,代表在字符串中找到了非数字。
          this.formItem.initPhone = this.formItem.initPhone.replace(/\D/g, "");
          this.$Message.error("手机号码不能出现非数字");
        } else {
          if (this.formItem.initPhone.length > 11) {
            this.formItem.initPhone = this.formItem.initPhone.substring(0, 11);
            this.$Message.error("手机号码不能超过11位");
          }
        }
      }
    },
    //发件人手机
    sendMo() {
      let re = /\D/; // \D代表非数字
      if (re.test(this.formItem.sendMobile)) {
        // 返回true,代表在字符串中找到了非数字。
        this.formItem.sendMobile = this.formItem.sendMobile.replace(/\D/g, "");
        this.$Message.error("手机号码不能出现非数字");
      } else {
        if (this.formItem.sendMobile.length > 11) {
          this.$Message.error("手机号码不能超过11位");
        }
      }
    },
    //发件人座机
    sendPh() {
      let re = /0\d{2}-\d{8}|0\d{3}-\d{7}/;
      if (this.formItem.sendPhone.length > 12) {
        this.$Message.error("电话不能超过11位");
        this.formItem.sendPhone = this.formItem.sendPhone.substring(0, 12);
      } else if (this.formItem.sendPhone.length === 12) {
        if (re.test(this.formItem.sendPhone)) {
        } else {
          this.$Message.error("电话号码不能出现非数字，且格式为xxx-xxxxxxxx");
        }
      }
    },
    //收件人手机
    receMo() {
      let re = /\D/; // \D代表非数字
      if (re.test(this.formItem.receiveMobile)) {
        // 返回true,代表在字符串中找到了非数字。
        this.formItem.receiveMobile = this.formItem.receiveMobile.replace(
          /\D/g,
          ""
        );
        this.$Message.error("手机号码不能出现非数字");
      } else {
        if (this.formItem.receiveMobile.length > 11) {
          this.$Message.error("手机号码不能超过11位");
        }
      }
    },
    //收件人座机
    recePh() {
      let re = /0\d{2}-\d{8}|0\d{3}-\d{7}/;
      if (this.formItem.receivePhone.length > 12) {
        this.$Message.error("电话不能超过11位");
        this.formItem.receivePhone = this.formItem.receivePhone.substring(
          0,
          12
        );
      } else if (this.formItem.receivePhone.length === 12) {
        if (re.test(this.formItem.receivePhone)) {
        } else {
          this.$Message.error("电话号码不能出现非数字，且格式为xxx-xxxxxxxx");
        }
      }
    },
    //第三方手机
    otherMo() {
      let re = /\D/; // \D代表非数字
      if (re.test(this.formItem.otherMobile)) {
        // 返回true,代表在字符串中找到了非数字。
        this.formItem.otherMobile = this.formItem.otherMobile.replace(
          /\D/g,
          ""
        );
        this.$Message.error("手机号码不能出现非数字");
      } else {
        if (this.formItem.otherMobile.length > 11) {
          this.$Message.error("手机号码不能超过11位");
        }
      }
    },
    //第三方座机
    otherPh() {
      let re = /0\d{2}-\d{8}|0\d{3}-\d{7}/;
      if (this.formItem.otherPhone.length > 12) {
        this.$Message.error("电话不能超过11位");
        this.formItem.otherPhone = this.formItem.otherPhone.substring(0, 12);
      } else if (this.formItem.otherPhone.length === 12) {
        if (re.test(this.formItem.otherPhone)) {
        } else {
          this.$Message.error("电话号码不能出现非数字，且格式为xxx-xxxxxxxx");
        }
      }
    },
    //根据运单号，查询订单信息
    getBasicInfor() {
      getorderInfor({
        billCode: this.formItem.billCode
      }).then(res => {
        console.log(res, "根据单号查询信息");
        if (res && res.success && res.data != null) {
          this.wholeData = res.data;
          //						this.$Message.info({
          //							content: res.msg,
          //						});
          this.formItem.goodsName = res.data.goodsName; //内件品名
          this.formItem.itemValue = res.data.itemValue; //内件价值

          this.formItem.sendName = res.data.sendName; //发起人姓名
          this.formItem.sendPhone = res.data.sendPhone; //发起人电话
          this.formItem.sendMobile = res.data.sendMobile; //发起人手机
          this.formItem.sendArea = res.data.sendArea; //发起人区域
          this.formItem.sendAddress = res.data.sendAddress; //发起人地址
          this.sendData.push({
            Value: res.data.sendArea,
            Key: "发件初始"
          });
          this.receiveData.push({
            Value: res.data.receiveArea,
            Key: "收件初始"
          });
          this.formItem.receiveName = res.data.receiveName;
          this.formItem.receivePhone = res.data.receivePhone; //
          this.formItem.receiveMobile = res.data.receiveMobile; //
          this.formItem.receiveArea = res.data.receiveArea; //
          this.formItem.receiveAddress = res.data.receiveAddress; //

          this.formItem.initRole = res.data.initRole; //发起人角色
          this.formItem.initPhone = res.data.initPhone; //发起人电话
          if (res.data.isValidSendMobile === 1) {
            this.switch1 = true;
          } else {
            this.switch1 = false;
          }
          //						this.res.data.isValidSendMobile
        } else {
          this.$Message.info({
            content: res.msg
          });
          this.formItem.goodsName = ""; //内件品名
          this.formItem.itemValue = ""; //内件价值

          this.formItem.sendName = ""; //发起人姓名
          this.formItem.sendPhone = ""; //发起人电话
          this.formItem.sendMobile = ""; //发起人手机
          this.formItem.sendArea = ""; //发起人区域
          this.formItem.sendAddress = ""; //发起人地址

          this.formItem.receiveName = "";
          this.formItem.receivePhone = ""; //
          this.formItem.receiveMobile = ""; //
          this.formItem.receiveArea = ""; //
          this.formItem.receiveAddress = ""; //

          this.formItem.initRole = ""; //发起人角色
          this.formItem.initPhone = ""; //发起人电话
        }
        console.log(res, "信息");
      });
    },
    onBlur() {
      //				let reg=/^[1-9]\d*$|^0$/;
      let reg = /^\d+$/;
      if (reg.test(this.formItem.billCode)) {
        //					this.$Message.info('是数字');
        this.getBasicInfor();
      } else {
        this.$Message.info({
          content: "请输入数字"
        });
      }
    },
    //需求描述中的
    requireTotal() {
      let value = this.formItem.reqDescription;
      // 将换行符不计算为单词数
      //          	value = value.replace(/\n|\r/gi,"");
      value = value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\ ]/g, "");
      if (value.length > this.max) {
        this.$Message.info({
          content: "请输入500个以内的字符"
        });
        return false;
      } else {
        this.tot1 = value.length;
        return true;
      }
    },
    //备注
    remarkTotal() {
      let value = this.formItem.remark;
      // 将换行符不计算为单词数
      //          	value = value.replace(/\n|\r/gi,"");
      value = value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\ ]/g, "");
      if (value.length > this.max) {
        this.$Message.info({
          content: "请输入500个以内的字符"
        });
        return false;
      } else {
        this.tot2 = value.length;
        return true;
      }
    },
    //提交网点
    handleSubmit() {
      this.$refs.formItem.validate(valid => {
        if (valid) {
          //this.$Message.success("Success!");

          this.isDisable = true;
          this.$Spin.show();
          let para = {
            billCode: this.formItem.billCode,
            //"orderId": this.formItem.orderId,
            itemValue: this.formItem.itemValue,
            goodsName: this.formItem.goodsName,
            //"freight": 0,
            initRole: this.formItem.initRole,
            initPhone: this.formItem.initPhone,
            sendName: this.formItem.sendName,
            sendPhone: this.formItem.sendPhone,
            sendMobile: this.formItem.sendMobile,
            sendArea: this.formItem.sendArea,
            sendAddress: this.formItem.sendAddress,
            //"sendNickName":this.formItem.sendNickName,
            receiveName: this.formItem.receiveName,
            receivePhone: this.formItem.receivePhone,
            receiveMobile: this.formItem.receiveMobile,
            receiveArea: this.formItem.receiveArea,
            receiveAddress: this.formItem.receiveAddress,
            //"receiveNickName":this.formItem.receiveNickName,
            otherName: this.formItem.otherName,
            otherPhone: this.formItem.otherPhone,
            otherMobile: this.formItem.otherMobile,
            otherArea: this.formItem.otherArea,
            otherAddress: this.formItem.otherAddress,
            //"otherNickName":this.formItem.otherNickName,
            firstTypeCode: this.formItem.firstTypeCode,
            firstTypeName: this.formItem.firstTypeName,
            secondTypeCode: this.formItem.secondTypeCode,
            secondTypeName: this.formItem.secondTypeName,
            threeTypeCode: this.formItem.threeTypeCode,
            threeTypeName: this.formItem.threeTypeName,
            reqDescription: this.formItem.reqDescription,
            remark: this.formItem.remark,
            beComplainsiteCode: this.formItem.code,
            beComplainsiteName: this.formItem.name,
            files: this.defaultList
          };
          console.log(para, "参数");
          //				console.log(this.formItem.beComplainsiteName,'参数')
          //				console.log(this.defaultList)
          //				console.log(this.$refs.uploadFiles.uploadList)
          //				$this.defaultList=[];//清除上传文件的文件数组
          //				this.$refs.uploadFiles.uploadList=[]
          postAddOrder(para).then(res => {
            this.$Spin.hide();
            if (res && res.success) {
              console.log(res, "提交");
              this.$Message.success(res.msg);
              this.handleReset();
            } else {
              this.$Message.warning({
                content: res.msg,
                duration: 3
              });
              console.log(res);
            }
          });
          let self = this;
          setTimeout(() => {
            this.isDisable = false;
          }, 1000);
        } else {
          this.$Message.error("请检查页面上带星号的输入");
        }
      });
    },
    //取消
    handleReset(name) {
      this.$refs.formItem.resetFields(); //清除表单
      this.formItem.typeName = [];
      this.defaultList = []; //清除上传文件的文件数组
      this.$refs.uploadFiles.uploadList = [];
      Object.assign(this.formItem, this.$options.data().formItem); //清空当前Vue对象的FormItem
    },
    //当发起人角色为第三方时，显示第三方
    onChange(value) {
      if (value) {
        console.log(value);
        console.log(value.value);
        if (value.label === "第三方") {
          this.inforThird = true;
        } else {
          this.inforThird = false;
        }
      }
    },

    //收件人省市区
    handleSearch1(value) {
      getRegions({
        key: value
      }).then(res => {
        console.log(res, "收件人省市区");
        if (res && res.success) {
          this.receiveData = res.data;
        } else {
          this.receiveData = [];
        }
      });
      //				let query=this.formItem.receiveArea
      //				if(query!=''){
      //                  getRegions({
      //	                    key: query
      //                  }).then(res => {
      //                  	console.log(res)
      //                  	if(res && res.success) {
      //                  		this.receiveData=res.data
      //                  		this.formItem.loading1=true
      //						}else{
      //							this.receiveData=[];
      //							this.formItem.loading1=false
      //						}
      //                  })
      //              }else {
      //                  this.receiveData=[];
      //                  this.formItem.loading1=false
      //              }
    },
    handleSelect1(options) {
      this.formItem.receiveArea = options.Value;
      console.log(options, "瘦瘦瘦");
      this.formItem.loading1 = false;
    },
    //发件人省市区
    handleSearch2(value) {
      if (value != "") {
        getRegions({
          key: value
        }).then(res => {
          console.log(res, "发件人省市区");
          if (res && res.success) {
            this.sendData = res.data;
          } else {
            this.sendData = [];
          }
        });
      } else {
        this.sendData = [];
      }

      //				let query=this.formItem.sendArea
      //				if(query!=''){
      //                  getRegions({
      //	                    key: query
      //                  }).then(res => {
      //                  	console.log(res)
      //                  	if(res && res.success) {
      //                  		this.sendData=res.data
      //                  		this.formItem.loading2=true
      //						}else{
      //							this.sendData=[];
      //							this.formItem.loading2=false
      //						}
      //                  })
      //              }else {
      //                  this.sendData=[];
      //                  this.formItem.loading2=false
      //              }
    },
    handleSelect2(options) {
      console.log(this.formItem.sendArea);
      this.formItem.sendArea = options.Value;
      console.log(options);
      this.formItem.loading2 = false;
    },
    handleSearch3(value) {
      getRegions({
        key: value
      }).then(res => {
        console.log(res);
        if (res && res.success) {
          this.otherData = res.data;
        } else {
          this.otherData = [];
        }
      });
      //				let query=this.formItem.otherArea
      //				if(query!=''){
      //                  getRegions({
      //	                    key: query
      //                  }).then(res => {
      //                  	console.log(res)
      //                  	if(res && res.success) {
      //                  		this.otherData=res.data
      //                  		this.formItem.loading3=true
      //						}else{
      //							this.otherData=[];
      //							this.formItem.loading3=false
      //						}
      //                  })
      //              }else {
      //                  this.otherData=[];
      //                  this.formItem.loading3=false
      //              }
    },
    handleSelect3(options) {
      this.formItem.otherArea = options.Value;
      console.log(options);
      this.formItem.loading3 = false;
    },
    handleSearch4(value) {
      //				let query=this
      GetPowerSiteByEs({
        key: value
      }).then(res => {
        console.log(res);
        if (res && res.success) {
          this.comData = res.data;
        } else {
          this.comData = [];
        }
      });
      //.formItem.beComplainsiteName;
      //				if(query!=''){
      //                  getAllSite({
      //	                    key: query
      //                  }).then(res => {
      //                  	console.log(res)
      //                  	if(res && res.success) {
      //                  		this.comData=res.data
      //                  		this.formItem.loading4=true
      //						}else{
      //							this.comData=[];
      //							this.formItem.loading4=false
      //						}
      //                  })
      //              }else {
      //                  this.comData=[];
      //                  this.formItem.loading4=false
      //              }
    },
    handleSelect4(options) {
      if (options) {
        this.formItem.code = options.value.split("|")[1];
        this.formItem.name = options.value.split("|")[0];
        console.log(this.formItem.code);
        console.log(this.formItem.name);
      } else {
        this.formItem.code = "";
        this.formItem.name = "";
      }
    },
    //工单选择之后 的类型编码和名称的数组
    handleChange(value, selectedData) {
      console.log(selectedData);
      if (selectedData.length > 0) {
        this.typeValue = selectedData;
        this.formItem.submitorderStyle = selectedData[2].__label;
        //菜鸟 / 菜鸟111 / 菜鸟111
        //9a7fd91a43dbc667,6baa678bd8034677,6baa678bd8034677
        let code = selectedData[2].__value.split(",");
        let values = selectedData[2].__label.split("/");
        this.formItem.firstTypeCode = code[0]; //一级类型编码
        this.formItem.firstTypeName = values[0]; //一级类型名称
        this.formItem.secondTypeCode = code[1];
        this.formItem.secondTypeName = values[1];
        this.formItem.threeTypeCode = code[2];
        this.formItem.threeTypeName = values[2];
      } else {
        this.formItem.firstTypeCode = ""; //一级类型编码
        this.formItem.firstTypeName = ""; //一级类型名称
        this.formItem.secondTypeCode = "";
        this.formItem.secondTypeName = "";
        this.formItem.threeTypeCode = "";
        this.formItem.threeTypeName = "";
      }
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
@import "./HomeInput.less";
</style>