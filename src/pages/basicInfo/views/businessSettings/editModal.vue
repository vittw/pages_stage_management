<template>
  <Form :label-width="90" label-position="left">
    <Row :gutter="48">
      <Col span="12" class="divider_left">
        <p class="title_header">基础信息</p>
        <div class="demo-drawer-profile">
          <Row :gutter="32">
            <Col span="24">
              <FormItem label="工单来源" prop="dataSourceId">
                <Select placeholder="请选择来源名称" v-model="detailData.dataSourceId" :transfer="true">
                  <Option
                    v-if="nameList && nameList.length != 0"
                    v-for="item in nameList"
                    :value="item.dataSourceId"
                    :key="item.dataSourceId"
                  >{{ item.dataSourceName }}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="24">
              <FormItem label="工单类型" prop="typeName">
                <Cascader
                  :data="sourceTypeData"
                  v-model="typeName"
                  placeholder="请选择工单类型"
                  :transfer="true"
                ></Cascader>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="工单编号（外部）">
                <Input v-model="detailData.code" placeholder="请输入名称"/>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="工单大类（外部）">
                <Input v-model="detailData.bigType" placeholder="请输入名称"/>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="工单小类（外部）">
                <Input v-model="detailData.smallType" placeholder="请输入名称"/>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="外部工单类型">
                <Select
                    v-model="detailData.caseType"
                    placeholder="请选择"
                    :transfer="true"
                  >
                    <Option value="1">咨询单</Option>
                    <Option value="2">投诉单</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
        </div>
        <p class="title_header">常规配置</p>
        <div class="demo-drawer-profile">
          <Row :gutter="20">
            <Col span="12">
              <FormItem label="是否判断备案">
                <Select v-model="detailData.isBeian" placeholder="请选择" :transfer="true">
                  <Option :value="1">是</Option>
                  <Option :value="0">否</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="是否允许催办">
                <Select v-model="detailData.isUrge" placeholder="请选择" :transfer="true">
                  <Option :value="1">是</Option>
                  <Option :value="0">否</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="20">
            <Col span="12">
              <FormItem label="是否允许升级协助">
                <Select v-model="detailData.isAssist" placeholder="请选择" :transfer="true">
                  <Option :value="1">是</Option>
                  <Option :value="0">否</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="20">
            <Col span="12">
              <FormItem label="是否允许申请延迟">
                <Select v-model="detailData.isDelay" placeholder="请选择" :transfer="true">
                  <Option :value="1">是</Option>
                  <Option :value="0">否</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12" v-if="detailData.isDelay == '1'">
                <FormItem label="延迟时间">
                  <Input v-model="detailData.delayTime" placeholder="请输入" :number="true">
                    <span slot="append">H</span>
                  </Input>
                </FormItem>
              </Col>
          </Row>
          <Row :gutter="20">
            <Col span="12">
              <FormItem label="完结是否外呼至客户">
                <Select
                  v-model="detailData.isComplete"
                  placeholder="请选择"
                  :transfer="true"
                >
                  <Option :value="1">是</Option>
                  <Option :value="0">否</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <div class="bg_gray" v-if="detailData.isComplete == '1'">
            <Row :gutter="20">
              <Col span="24">
                <FormItem label="是否客户邀评" :label-width="180">
                    <Select
                      v-model="detailData.isAssess"
                      placeholder="请选择"
                      :transfer="true"
                    >
                      <Option :value="1">是</Option>
                      <Option :value="0">否</Option>
                    </Select>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="20">
              <Col span="24">
                <FormItem label="满意是否升级上级处理" :label-width="180">
                    <Select
                      v-model="detailData.isOkToParent"
                      placeholder="请选择"
                      :transfer="true"
                    >
                      <Option :value="1">是</Option>
                      <Option :value="0">否</Option>
                    </Select>
                </FormItem>
              </Col>
            </Row>
          </div>
        </div>
        <p class="title_header">网点配置</p>
        <div class="demo-drawer-profile">
            <Row :gutter="20">
              <Col span="12">
                  <FormItem label="是否网点处理">
                    <Select
                      v-model="detailData.isSiteProcess"
                      placeholder="请选择"
                      :transfer="true"
                    >
                      <Option :value="1">是</Option>
                      <Option :value="0">否</Option>
                    </Select>
                  </FormItem>
                </Col>
            </Row>
            <Row :gutter="20" v-if="detailData.isSiteProcess=='1'">
              <Col span="12">
                <FormItem label="网点是否首跟">
                  <Select
                    v-model="detailData.isSmsNotify"
                    placeholder="请选择"
                    :transfer="true"
                  >
                    <Option :value="1">系统首跟</Option>
                    <Option :value="2">人工首跟</Option>
                    <Option :value="3">否</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="12" v-if="detailData.isSmsNotify == '2'">
                <FormItem label="首跟回复时间">
                  <Input
                    v-model="detailData.siteSmsNotifyTime"
                    placeholder="请输入"
                    :number="true"
                  >
                    <span slot="append">H</span>
                  </Input>
                </FormItem>
              </Col>
            </Row>
            <div class="bg_gray"  v-if="detailData.isSiteProcess=='1'">
              <Row :gutter="20">
                <Col span="12">
                  <FormItem label="时效类型">
                    <Select
                      v-model="detailData.siteOvertimeType"
                      placeholder="请选择"
                      :transfer="true"
                    >
                      <Option :value="0">自然小时</Option>
                      <Option :value="1">工作小时</Option>
                      <Option :value="2">自定义小时</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col
                  span="12"
                  v-if="detailData.siteOvertimeType==0 || detailData.siteOvertimeType==1"
                >
                  <FormItem label="时效时间">
                    <Input
                      v-model="detailData.siteOvertimeTime"
                      :disabled="detailData.isSiteProcess == '1' ? false : true"
                      placeholder="请输入"
                      :number="true"
                    >
                      <span slot="append">H</span>
                    </Input>
                  </FormItem>
                </Col>
              </Row>
              <Row :gutter="20" v-if="detailData.siteOvertimeType==2">
                <Col span="17">
                  <FormItem label="当天12点前下发的工单" :label-width="140">
                    <RadioGroup v-model="detailData.siteMorningDealType">
                      <Radio :label="1">当天</Radio>
                      <Radio :label="2">次日</Radio>
                    </RadioGroup>
                  </FormItem>
                </Col>
                <Col span="7">
                  <TimePicker
                    type="time"
                    v-model="detailData.siteMorningDealTime"
                    placeholder="选择时间"
                  ></TimePicker>
                </Col>
              </Row>
              <Row :gutter="20" v-if="detailData.siteOvertimeType==2">
                <Col span="17">
                  <FormItem label="当天12点后下发的工单" :label-width="140">
                    <RadioGroup v-model="detailData.siteAfternoonDealType">
                      <Radio :label="1">当天</Radio>
                      <Radio :label="2">次日</Radio>
                    </RadioGroup>
                  </FormItem>
                </Col>
                <Col span="7">
                  <TimePicker
                    type="time"
                    v-model="detailData.siteAfternoonDealTime"
                    placeholder="选择时间"
                  ></TimePicker>
                </Col>
              </Row>
            </div>
            <Row :gutter="20"  v-if="detailData.isSiteProcess=='1'">
              <Col span="12">
                <FormItem label="网点是否超时罚款">
                  <Select
                    v-model="detailData.isSiteOvertime"
                    placeholder="请选择"
                    :transfer="true"
                  >
                    <Option :value="1">是</Option>
                    <Option :value="0">否</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="12" v-if="detailData.isSiteOvertime == '1'">
                <FormItem label="罚款金额">
                  <Input v-model="detailData.siteOvertimeFineMoney" placeholder="请输入"/>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="20" v-if="detailData.isSiteProcess=='1'"> 
                <Col span="24">
                  <FormItem label="网点超时是否升级上级处理" :label-width="180">
                      <Select
                        v-model="detailData.isOvertimeToParent"
                        placeholder="请选择"
                        :transfer="true"
                      >
                        <Option :value="1">是</Option>
                        <Option :value="0">否</Option>
                      </Select>
                  </FormItem>
                </Col>
            </Row>
            <Row :gutter="20"  v-if="detailData.isSiteProcess=='1'">
                <Col span="24">
                  <FormItem label="网点完结是否上级处理" :label-width="180">
                      <Select
                        v-model="detailData.isFinishedToParent"
                        placeholder="请选择"
                        :transfer="true"
                      >
                        <Option :value="1">是</Option>
                        <Option :value="0">否</Option>
                      </Select>
                  </FormItem>
                </Col>
            </Row>
        </div>
      </Col>
      <Col span="12" divider_right>
        <p class="title_header">省区配置</p>
        <div class="demo-drawer-profile">
          <Row :gutter="20">
            <Col span="12">
              <FormItem label="省区是否首跟">
                <Select
                  v-model="detailData.isProvinceSmsNotify"
                  placeholder="请选择"
                  :transfer="true"
                >
                  <Option :value="1">系统首跟</Option>
                  <Option :value="2">人工首跟</Option>
                  <Option :value="3">否</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12" v-if="detailData.isProvinceSmsNotify == '2'">
              <FormItem label="首跟回复时间">
                <Input
                  v-model="detailData.provinceSmsNotifyTime"
                  placeholder="请输入"
                  :number="true"
                >
                  <span slot="append">H</span>
                </Input>
              </FormItem>
            </Col>
          </Row>
          <div class="bg_gray">
            <Row :gutter="20">
              <Col span="12">
                <FormItem label="时效类型">
                  <Select
                    v-model="detailData.provinceOvertimeType"
                    placeholder="请选择"
                    :transfer="true"
                  >
                    <Option :value="0">自然小时</Option>
                    <Option :value="1">工作小时</Option>
                    <Option :value="2">自定义小时</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col
                span="12"
                v-if="detailData.provinceOvertimeType==0 || detailData.provinceOvertimeType==1"
              >
                <FormItem label="时效时间">
                  <Input
                    v-model="detailData.provinceOvertimeTime"
                    placeholder="请输入"
                    :number="true"
                  >
                    <span slot="append">H</span>
                  </Input>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="20" v-if="detailData.provinceOvertimeType==2">
              <Col span="17">
                <FormItem label="当天12点前下发的工单" :label-width="140">
                  <RadioGroup v-model="detailData.provinceMorningDealType">
                    <Radio :label="1">当天</Radio>
                    <Radio :label="2">次日</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
              <Col span="7">
                <TimePicker
                  type="time"
                  v-model="detailData.provinceMorningDealTime"
                  transfer
                  placeholder="选择时间"
                ></TimePicker>
              </Col>
            </Row>
            <Row :gutter="20" v-if="detailData.provinceOvertimeType==2">
              <Col span="17">
                <FormItem label="当天12点后下发的工单" :label-width="140">
                  <RadioGroup v-model="detailData.procinceAfternoonDealType">
                    <Radio :label="1">当天</Radio>
                    <Radio :label="2">次日</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
              <Col span="7">
                <TimePicker
                  type="time"
                  v-model="detailData.procinceAfternoonDealTime"
                  transfer
                  placeholder="选择时间"
                ></TimePicker>
              </Col>
            </Row>
          </div>
          <Row :gutter="20">
            <Col span="12">
              <FormItem label="省区是否超时罚款">
                <Select
                  v-model="detailData.isProvinceOvertime"
                  placeholder="请选择"
                  :transfer="true"
                >
                  <Option :value="1">是</Option>
                  <Option :value="0">否</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12" v-if="detailData.isProvinceOvertime == '1'">
              <FormItem label="罚款金额">
                <Input
                  v-model="detailData.provinceOvertimeFineMoney"
                  isProvinceOvertime
                  placeholder="请输入"
                />
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="20">
              <Col span="24">
                <FormItem label="省区超时是否升级上级处理" :label-width="180">
                    <Select
                      v-model="detailData.isProvinceOvertimeToParent"
                      placeholder="请选择"
                      :transfer="true"
                    >
                      <Option :value="1">是</Option>
                      <Option :value="0">否</Option>
                    </Select>
                </FormItem>
              </Col>
          </Row>
          <Row :gutter="20">
              <Col span="24">
                <FormItem label="省区完结是否上级处理" :label-width="180">
                    <Select
                      v-model="detailData.isProvinceFinishedToParent"
                      placeholder="请选择"
                      :transfer="true"
                    >
                      <Option :value="1">是</Option>
                      <Option :value="0">否</Option>
                    </Select>
                </FormItem>
              </Col>
          </Row>
        </div>
        <p class="title_header">总部配置</p>
        <div class="demo-drawer-profile">
          <Row :gutter="20">
            <Col span="12">
              <FormItem label="总部是否首跟">
                <Select
                  v-model="detailData.isHqSmsNotify"
                  placeholder="请选择"
                  :transfer="true"
                >
                  <Option :value="1">系统首跟</Option>
                  <Option :value="2">人工首跟</Option>
                  <Option :value="3">否</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12" v-if="detailData.isHqSmsNotify == '2'">
              <FormItem label="首跟回复时间">
                <Input
                  v-model="detailData.hqSmsNotifyTime"
                  placeholder="请输入"
                  :number="true"
                >
                  <span slot="append">H</span>
                </Input>
              </FormItem>
            </Col>
          </Row>
          <div class="bg_gray">
            <Row :gutter="20">
              <Col span="12">
                <FormItem label="时效类型">
                  <Select
                    v-model="detailData.hqOvertimeType"
                    placeholder="请选择"
                    :transfer="true"
                  >
                    <Option :value="0">自然小时</Option>
                    <Option :value="1">工作小时</Option>
                    <Option :value="2">自定义小时</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col
                span="12"
                v-if="detailData.hqOvertimeType==0 || detailData.hqOvertimeType==1"
              >
                <FormItem label="时效时间">
                  <Input
                    v-model="detailData.hqOvertimeTime"
                    placeholder="请输入"
                    :number="true"
                  >
                    <span slot="append">H</span>
                  </Input>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="20" v-if="detailData.hqOvertimeType==2">
              <Col span="17">
                <FormItem label="当天12点前下发的工单" :label-width="140">
                  <RadioGroup v-model="detailData.hqMorningDealType">
                    <Radio :label="1">当天</Radio>
                    <Radio :label="2">次日</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
              <Col span="7">
                <TimePicker
                  type="time"
                  v-model="detailData.hqMorningDealTime"
                  transfer
                  placeholder="选择时间"
                ></TimePicker>
              </Col>
            </Row>
            <Row :gutter="20" v-if="detailData.hqOvertimeType==2">
              <Col span="17">
                <FormItem label="当天12点后下发的工单" :label-width="140">
                  <RadioGroup v-model="detailData.hqAfternoonDealType">
                    <Radio :label="1">当天</Radio>
                    <Radio :label="2">次日</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
              <Col span="7">
                <TimePicker
                  type="time"
                  v-model="detailData.hqAfternoonDealTime"
                  transfer
                  placeholder="选择时间"
                ></TimePicker>
              </Col>
            </Row>
          </div>
          <Row :gutter="20">
            <Col span="12">
              <FormItem label="总部是否超时罚款">
                <Select
                  v-model="detailData.isHqOvertime"
                  placeholder="请选择"
                  :transfer="true"
                >
                  <Option :value="1">是</Option>
                  <Option :value="0">否</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="罚款金额" v-if="detailData.isHqOvertime == '1'">
                <Input v-model="detailData.hqOvertimeFineMoney" placeholder="请输入"/>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="20">
            <Col span="12">
              <FormItem label="是否升级到专家坐席">
                <Select
                  v-model="detailData.isProficientProcess"
                  placeholder="请选择"
                  :transfer="true"
                >
                  <Option :value="1">是</Option>
                  <Option :value="0">否</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
        </div>
        <p class="title_header">申诉罚款</p>
        <div class="demo-drawer-profile">
          <Row :gutter="20">
            <Col span="12">
              <FormItem label="首次投诉是否罚款">
                <Select
                  v-model="detailData.isFirstAppeal"
                  placeholder="请选择"
                  :transfer="true"
                >
                  <Option :value="1">是</Option>
                  <Option :value="0">否</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12" v-if="detailData.isFirstAppeal==1">
              <FormItem label="首次投诉罚款金额">
                <Input v-model="detailData.firstFineMoney" placeholder="请输入"/>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="20">
            <Col span="12">
              <FormItem label="二次投诉是否罚款">
                <Select
                  v-model="detailData.isSecondAppeal"
                  placeholder="请选择"
                  :transfer="true"
                >
                  <Option :value="1">是</Option>
                  <Option :value="0">否</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12" v-if="detailData.isSecondAppeal==1">
              <FormItem label="二次投诉罚款金额">
                <Input v-model="detailData.secondFineMoney" placeholder="请输入"/>
              </FormItem>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  </Form>
</template>

<script>
import { getAllType } from "@/api/baseInfo/typeSettings";
import { editBusinessConfig } from "@/api/baseInfo/businessSettings";
export default {
  data() {
    return {
      sourceTypeData: [],
      typeName: [
        this.detailData.firstCode,
        this.detailData.secondCode,
        this.detailData.threeCode
      ]
    };
  },
  props: {
    detailData: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  computed: {
    nameList() {
      return this.$parent.$parent.nameList;
    }
  },
  mounted() {
    getAllType().then(res => {
      if (res && res.success) {
        this.sourceTypeData = res.data;
      }
    });
  },
  methods: {
    handleSubmitEdit() {
      editBusinessConfig({
        id: this.detailData.id,
        dataSourceId: this.detailData.dataSourceId, //工单来源ID
        // typeName: this.firstFormData.typeName,             //工单类型--工单一级类型Code--二级--三级
        firstCode: this.typeName[0],
        secondCode: this.typeName[1],
        threeCode: this.typeName[2],
        code: this.detailData.code, //工单编号（外部）
        bigType: this.detailData.bigType, //工单大类（外部）
        smallType: this.detailData.smallType, //工单小类（外部）
        caseType: this.detailData.caseType,
        // 常规配置
        isBeian: this.detailData.isBeian, //是否备案
        isUrge: this.detailData.isUrge, //是否允许催办
        isAssist: this.detailData.isAssist, //是否允许升级协助
        isDelay: this.detailData.isDelay, //是否允许申请延迟
        delayTime: this.detailData.delayTime, //延迟时间
        isComplete: this.detailData.isComplete, //完结是否外呼至客户
        isAssess: this.detailData.isAssess, //是否客户邀评
        isOkToParent:this.detailData.isOkToParent,//满意是否升级上级处理
        //网点配置
        isSiteProcess: this.detailData.isSiteProcess, //是否网点处理
        isSmsNotify: this.detailData.isSmsNotify, //网点是否首跟
        siteSmsNotifyTime: this.detailData.siteSmsNotifyTime, //网点首跟回复时间
        siteOvertimeType: this.detailData.siteOvertimeType, //网点超时类型
        siteOvertimeTime: this.detailData.siteOvertimeTime, //网点超时时间
        siteMorningDealType: this.detailData.siteMorningDealType, //网点12点前处理类型
        siteMorningDealTime: this.detailData.siteMorningDealTime, //网点12点前处理时间
        siteAfternoonDealType: this.detailData.siteAfternoonDealType, //网点12点后处理类型
        siteAfternoonDealTime: this.detailData.siteAfternoonDealTime, //网点12后处理时间
        isSiteOvertime: this.detailData.isSiteOvertime, //是否判断网点超时
        siteOvertimeFineMoney: this.detailData.siteOvertimeFineMoney, //网点超时罚款金额
        isOvertimeToParent: this.detailData.isOvertimeToParent, //网点超时是否升级上级处理
        isFinishedToParent: this.detailData.isFinishedToParent, //网点完结是否上级处理
        //省区配置
        isProvinceSmsNotify: this.detailData.isProvinceSmsNotify, //省区是否允许首跟
        provinceSmsNotifyTime: this.detailData.provinceSmsNotifyTime, //省区首跟时间
        provinceOvertimeType: this.detailData.provinceOvertimeType, //省区超时类型
        provinceOvertimeTime: this.detailData.provinceOvertimeTime, //省区超时时间
        provinceMorningDealType: this.detailData.provinceMorningDealType, //省区12点前处理类型
        provinceMorningDealTime: this.detailData.provinceMorningDealTime, //省区12点前处理时间
        procinceAfternoonDealType: this.detailData.procinceAfternoonDealType, //省区12点后处理类型
        procinceAfternoonDealTime: this.detailData.procinceAfternoonDealTime, //省区12后处理时间
        isProvinceOvertime: this.detailData.isProvinceOvertime, //是否判断省区超时
        provinceOvertimeFineMoney: this.detailData.provinceOvertimeFineMoney, //是否判断省区超时
        isProvinceOvertimeToParent: this.detailData.isProvinceOvertimeToParent, //省区超时是否升级上级处理
        isProvinceFinishedToParent: this.detailData.isProvinceFinishedToParent, //省区完结是否上级处理

        //总部配置
        isHqProcess: this.detailData.isHqProcess, //是否总部处理
        isHqSmsNotify: this.detailData.isHqSmsNotify, //总部是否首跟
        hqSmsNotifyTime: this.detailData.hqSmsNotifyTime, //总部首跟时间
        isHqOvertime: this.detailData.isHqOvertime, //是否判断网点超时
        hqOvertimeFineMoney: this.detailData.hqOvertimeFineMoney, //总部超时罚款金额
        hqOvertimeType: this.detailData.hqOvertimeType, //总部超时类型
        hqOvertimeTime: this.detailData.hqOvertimeTime, //总部超时时间
        isProficientProcess: this.detailData.isProficientProcess, //是否升级到专家坐席
        hqMorningDealType: this.detailData.hqMorningDealType, //总部12点前处理类型
        hqMorningDealTime: this.detailData.hqMorningDealTime, //总部12点前处理时间
        hqAfternoonDealType: this.detailData.hqAfternoonDealType, //总部12点后处理类型
        hqAfternoonDealTime: this.detailData.hqAfternoonDealTime, //总部12后处理时间
        //申诉罚款
        isFirstAppeal: this.detailData.isFirstAppeal, //首次投诉是否罚款
        firstFineMoney: this.detailData.firstFineMoney, //首次投诉罚款金额
        isSecondAppeal: this.detailData.isSecondAppeal, //二次投诉是否罚款
        secondFineMoney: this.detailData.secondFineMoney //二次投诉罚款金额
      }).then(res => {
        if (res && res.success) {
          this.$emit("isSuccess", true);
          console.log(res.msg);
          this.$Message.success(res.msg);
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
    typeDelete() {
      this.detailData.caseType = "";
    }
  }
};
</script>

<style lang="less" scoped>
.demo-drawer-profile {
  font-size: 14px;
  color: #777777;
}
.demo-drawer-profile label {
  color: #333333;
}
.demo-drawer-profile .ivu-col {
  margin: 4px 0;
}
.demo-drawer-profile p {
  margin: 14px 0;
}
.divider_left {
  border-right: 1px dashed #e8eaec;
}
.divider_right {
  height: 500px;
  border-right: 1px dashed #e8eaec;
}
.title_header {
  font-weight: bold;
  font-size: 14px;
  line-height: 24px;
  display: block;
  margin-bottom: 16px;
}
.bg_gray {
  background: #f7f3ef;
  padding-top: 6px;
  margin-bottom: 6px;
}
.ivu-form-item {
  margin-bottom: 0;
  vertical-align: top;
  zoom: 1;
}
</style>
