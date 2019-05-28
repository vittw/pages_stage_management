<template>
  <div class="addWrap">
    <Tabs :value="currentPane">
      <TabPane label="标签一" name="firstPane">
        <Form
          :label-width="110"
          label-position="left"
          :model="firstFormData"
          ref="firstFormData"
          :rules="firstValidate"
        >
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="工单来源" prop="dataSourceId">
                <Select placeholder="请选择来源名称" v-model="firstFormData.dataSourceId" :transfer="true">
                  <Option
                    v-if="nameList && nameList.length != 0"
                    v-for="item in nameList"
                    :value="item.dataSourceId"
                    :key="item.dataSourceId"
                  >{{ item.dataSourceName }}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="工单类型" prop="typeName">
                <Cascader
                  :data="sourceTypeData"
                  v-model="firstFormData.typeName"
                  placeholder="请选择工单类型"
                  :transfer="true"
                ></Cascader>
              </FormItem>
            </Col>
          </Row>
          <Divider :dashed="true"/>
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="工单编号（外部）">
                <Input v-model="firstFormData.code" placeholder="请输入名称"/>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="工单大类（外部）">
                <Input v-model="firstFormData.bigType" placeholder="请输入名称"/>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="工单小类（外部）">
                <Input v-model="firstFormData.smallType" placeholder="请输入名称"/>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="外部工单类型">
                <Select
                  v-model="firstFormData.caseType"
                  placeholder="请选择"
                  clearable
                  transfer
                  @on-clear="typeDelete"
                >
                  <Option :value="1">咨询单</Option>
                  <Option :value="2">投诉单</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </TabPane>
      <TabPane label="标签二" name="secondPane">
        <Form :label-width="90" label-position="left" v-show="currentPane=='secondPane'">
          <Row :gutter="48">
            <Col span="12" class="divider_left">
              <p class="title_header">常规配置</p>
              <div class="demo-drawer-profile">
                <Row :gutter="20">
                  <Col span="12">
                    <FormItem label="是否判断备案">
                      <Select v-model="secondFormData.isBeian" placeholder="请选择" :transfer="true">
                        <Option :value="1">是</Option>
                        <Option :value="0">否</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span="12">
                    <FormItem label="是否允许催办">
                      <Select v-model="secondFormData.isUrge" placeholder="请选择" :transfer="true">
                        <Option :value="1">是</Option>
                        <Option :value="0">否</Option>
                      </Select>
                    </FormItem>
                  </Col>
                </Row>
                <Row :gutter="20">
                  <Col span="12">
                    <FormItem label="是否允许升级协助">
                      <Select v-model="secondFormData.isAssist" placeholder="请选择" :transfer="true">
                        <Option :value="1">是</Option>
                        <Option :value="0">否</Option>
                      </Select>
                    </FormItem>
                  </Col>
                </Row>

                <Row :gutter="20">
                  <Col span="12">
                    <FormItem label="是否允许申请延迟">
                      <Select v-model="secondFormData.isDelay" placeholder="请选择" :transfer="true">
                        <Option :value="1">是</Option>
                        <Option :value="0">否</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span="12" v-if="secondFormData.isDelay == '1'">
                      <FormItem label="延迟时间">
                        <Input v-model="secondFormData.delayTime" placeholder="请输入" :number="true">
                          <span slot="append">H</span>
                        </Input>
                      </FormItem>
                   </Col>
                </Row>
                <Row :gutter="20">
                  <Col span="12">
                    <FormItem label="完结是否外呼至客户">
                      <Select
                        v-model="secondFormData.isComplete"
                        placeholder="请选择"
                        :transfer="true"
                      >
                        <Option :value="1">是</Option>
                        <Option :value="0">否</Option>
                      </Select>
                    </FormItem>
                  </Col>
                </Row>
                <div class="bg_gray" v-if="secondFormData.isComplete == '1'">
                  <Row :gutter="20">
                    <Col span="24">
                      <FormItem label="是否客户邀评" :label-width="180">
                          <Select
                            v-model="secondFormData.isAssess"
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
                            v-model="secondFormData.isOkToParent"
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
                            v-model="secondFormData.isSiteProcess"
                            placeholder="请选择"
                            :transfer="true"
                          >
                            <Option :value="1">是</Option>
                            <Option :value="0">否</Option>
                          </Select>
                        </FormItem>
                      </Col>
                  </Row>
                <Row :gutter="20" v-if="secondFormData.isSiteProcess=='1'">
                  <Col span="12">
                    <FormItem label="网点是否首跟">
                      <Select
                        v-model="secondFormData.isSmsNotify"
                        placeholder="请选择"
                        :transfer="true"
                      >
                        <Option :value="1">系统首跟</Option>
                        <Option :value="2">人工首跟</Option>
                        <Option :value="3">否</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span="12" v-if="secondFormData.isSmsNotify == '2'">
                    <FormItem label="首跟回复时间">
                      <Input
                        v-model="secondFormData.siteSmsNotifyTime"
                        placeholder="请输入"
                        :number="true"
                      >
                        <span slot="append">H</span>
                      </Input>
                    </FormItem>
                  </Col>
                </Row>
                <div class="bg_gray" v-if="secondFormData.isSiteProcess=='1'">
                  <Row :gutter="20">
                    <Col span="12">
                      <FormItem label="时效类型">
                        <Select
                          v-model="secondFormData.siteOvertimeType"
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
                      v-if="secondFormData.siteOvertimeType==0 || secondFormData.siteOvertimeType==1"
                    >
                      <FormItem label="时效时间">
                        <Input
                          v-model="secondFormData.siteOvertimeTime"
                          :disabled="secondFormData.isSiteProcess == '1' ? false : true"
                          placeholder="请输入"
                          :number="true"
                        >
                          <span slot="append">H</span>
                        </Input>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row :gutter="20" v-if="secondFormData.siteOvertimeType==2">
                    <Col span="17">
                      <FormItem label="当天12点前下发的工单" :label-width="140">
                        <RadioGroup v-model="secondFormData.siteMorningDealType">
                          <Radio :label="1">当天</Radio>
                          <Radio :label="2">次日</Radio>
                        </RadioGroup>
                      </FormItem>
                    </Col>
                    <Col span="7">
                      <TimePicker
                        type="time"
                        v-model="secondFormData.siteMorningDealTime"
                        placeholder="选择时间"
                      ></TimePicker>
                    </Col>
                  </Row>
                  <Row :gutter="20" v-if="secondFormData.siteOvertimeType==2">
                    <Col span="17">
                      <FormItem label="当天12点后下发的工单" :label-width="140">
                        <RadioGroup v-model="secondFormData.siteAfternoonDealType">
                          <Radio :label="1">当天</Radio>
                          <Radio :label="2">次日</Radio>
                        </RadioGroup>
                      </FormItem>
                    </Col>
                    <Col span="7">
                      <TimePicker
                        type="time"
                        v-model="secondFormData.siteAfternoonDealTime"
                        placeholder="选择时间"
                      ></TimePicker>
                    </Col>
                  </Row>
                </div>
                <Row :gutter="20" v-if="secondFormData.isSiteProcess=='1'">
                  <Col span="12">
                    <FormItem label="网点是否超时罚款">
                      <Select
                        v-model="secondFormData.isSiteOvertime"
                        placeholder="请选择"
                        :transfer="true"
                      >
                        <Option :value="1">是</Option>
                        <Option :value="0">否</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span="12" v-if="secondFormData.isSiteOvertime == '1'">
                    <FormItem label="罚款金额">
                      <Input v-model="secondFormData.siteOvertimeFineMoney" placeholder="请输入"/>
                    </FormItem>
                  </Col>
                </Row>
                <Row :gutter="20" v-if="secondFormData.isSiteProcess=='1'">
                    <Col span="24">
                      <FormItem label="网点超时是否升级上级处理" :label-width="180">
                          <Select
                            v-model="secondFormData.isOverTimeToParent"
                            placeholder="请选择"
                            :transfer="true"
                          >
                            <Option :value="1">是</Option>
                            <Option :value="0">否</Option>
                          </Select>
                      </FormItem>
                    </Col>
                </Row>
                <Row :gutter="20" v-if="secondFormData.isSiteProcess=='1'">
                    <Col span="24">
                      <FormItem label="网点完结是否上级处理" :label-width="180">
                          <Select
                            v-model="secondFormData.isFinishedToParent"
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
                        v-model="secondFormData.isProvinceSmsNotify"
                        placeholder="请选择"
                        :transfer="true"
                      >
                        <Option :value="1">系统首跟</Option>
                        <Option :value="2">人工首跟</Option>
                        <Option :value="3">否</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span="12" v-if="secondFormData.isProvinceSmsNotify == '2'">
                    <FormItem label="首跟回复时间">
                      <Input
                        v-model="secondFormData.provinceSmsNotifyTime"
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
                          v-model="secondFormData.provinceOvertimeType"
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
                      v-if="secondFormData.provinceOvertimeType==0 || secondFormData.provinceOvertimeType==1"
                    >
                      <FormItem label="时效时间">
                        <Input
                          v-model="secondFormData.provinceOvertimeTime"
                          placeholder="请输入"
                          :number="true"
                        >
                          <span slot="append">H</span>
                        </Input>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row :gutter="20" v-if="secondFormData.provinceOvertimeType==2">
                    <Col span="17">
                      <FormItem label="当天12点前下发的工单" :label-width="140">
                        <RadioGroup v-model="secondFormData.provinceMorningDealType">
                          <Radio :label="1">当天</Radio>
                          <Radio :label="2">次日</Radio>
                        </RadioGroup>
                      </FormItem>
                    </Col>
                    <Col span="7">
                      <TimePicker
                        type="time"
                        v-model="secondFormData.provinceMorningDealTime"
                        transfer
                        placeholder="选择时间"
                      ></TimePicker>
                    </Col>
                  </Row>
                  <Row :gutter="20" v-if="secondFormData.provinceOvertimeType==2">
                    <Col span="17">
                      <FormItem label="当天12点后下发的工单" :label-width="140">
                        <RadioGroup v-model="secondFormData.procinceAfternoonDealType">
                          <Radio :label="1">当天</Radio>
                          <Radio :label="2">次日</Radio>
                        </RadioGroup>
                      </FormItem>
                    </Col>
                    <Col span="7">
                      <TimePicker
                        type="time"
                        v-model="secondFormData.procinceAfternoonDealTime"
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
                        v-model="secondFormData.isProvinceOvertime"
                        placeholder="请选择"
                        :transfer="true"
                      >
                        <Option :value="1">是</Option>
                        <Option :value="0">否</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span="12" v-if="secondFormData.isProvinceOvertime == '1'">
                    <FormItem label="罚款金额">
                      <Input
                        v-model="secondFormData.provinceOvertimeFineMoney"
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
                            v-model="secondFormData.isProvinceOvertimeToParent"
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
                            v-model="secondFormData.isProvinceFinishedToParent"
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
                        v-model="secondFormData.isHqSmsNotify"
                        placeholder="请选择"
                        :transfer="true"
                      >
                        <Option :value="1">系统首跟</Option>
                        <Option :value="2">人工首跟</Option>
                        <Option :value="3">否</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span="12" v-if="secondFormData.isHqSmsNotify == '2'">
                    <FormItem label="首跟回复时间">
                      <Input
                        v-model="secondFormData.hqSmsNotifyTime"
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
                          v-model="secondFormData.hqOvertimeType"
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
                      v-if="secondFormData.hqOvertimeType==0 || secondFormData.hqOvertimeType==1"
                    >
                      <FormItem label="时效时间">
                        <Input
                          v-model="secondFormData.hqOvertimeTime"
                          placeholder="请输入"
                          :number="true"
                        >
                          <span slot="append">H</span>
                        </Input>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row :gutter="20" v-if="secondFormData.hqOvertimeType==2">
                    <Col span="17">
                      <FormItem label="当天12点前下发的工单" :label-width="140">
                        <RadioGroup v-model="secondFormData.hqMorningDealType">
                          <Radio :label="1">当天</Radio>
                          <Radio :label="2">次日</Radio>
                        </RadioGroup>
                      </FormItem>
                    </Col>
                    <Col span="7">
                      <TimePicker
                        type="time"
                        v-model="secondFormData.hqMorningDealTime"
                        transfer
                        placeholder="选择时间"
                      ></TimePicker>
                    </Col>
                  </Row>
                  <Row :gutter="20" v-if="secondFormData.hqOvertimeType==2">
                    <Col span="17">
                      <FormItem label="当天12点后下发的工单" :label-width="140">
                        <RadioGroup v-model="secondFormData.hqAfternoonDealType">
                          <Radio :label="1">当天</Radio>
                          <Radio :label="2">次日</Radio>
                        </RadioGroup>
                      </FormItem>
                    </Col>
                    <Col span="7">
                      <TimePicker
                        type="time"
                        v-model="secondFormData.hqAfternoonDealTime"
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
                        v-model="secondFormData.isHqOvertime"
                        placeholder="请选择"
                        :transfer="true"
                      >
                        <Option :value="1">是</Option>
                        <Option :value="0">否</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span="12">
                    <FormItem label="罚款金额" v-if="secondFormData.isHqOvertime == '1'">
                      <Input v-model="secondFormData.hqOvertimeFineMoney" placeholder="请输入"/>
                    </FormItem>
                  </Col>
                </Row>
                <Row :gutter="20">
                  <Col span="12">
                    <FormItem label="是否升级到专家坐席">
                      <Select
                        v-model="secondFormData.isProficientProcess"
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
                        v-model="secondFormData.isFirstAppeal"
                        placeholder="请选择"
                        :transfer="true"
                      >
                        <Option :value="1">是</Option>
                        <Option :value="0">否</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span="12" v-if="secondFormData.isFirstAppeal==1">
                    <FormItem label="首次投诉罚款金额">
                      <Input v-model="secondFormData.firstFineMoney" placeholder="请输入"/>
                    </FormItem>
                  </Col>
                </Row>
                <Row :gutter="20">
                  <Col span="12">
                    <FormItem label="二次投诉是否罚款">
                      <Select
                        v-model="secondFormData.isSecondAppeal"
                        placeholder="请选择"
                        :transfer="true"
                      >
                        <Option :value="1">是</Option>
                        <Option :value="0">否</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span="12" v-if="secondFormData.isSecondAppeal==1">
                    <FormItem label="二次投诉罚款金额">
                      <Input v-model="secondFormData.secondFineMoney" placeholder="请输入"/>
                    </FormItem>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Form>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import { getAllType } from "@/api/baseInfo/typeSettings";
import { addBusinessConfig } from "@/api/baseInfo/businessSettings";
export default {
  computed: {
    nameList() {
      return this.$parent.$parent.nameList;
    },
    currentPane() {
      return this.$parent.$parent.currentPane;
    }
  },
  data() {
    return {
      sourceTypeData: [],
      firstFormData: {
        dataSourceId: "", //工单来源ID
        typeName: [], //工单类型--工单一级类型Code--二级--三级
        code: "", //工单编号（外部）
        bigType: "", //工单大类（外部）
        smallType: "", //工单小类（外部）
        caseType: "" //外部工单类型
      },
      secondFormData: {
        // 常规配置
        isBeian: 0, //是否备案
        isUrge: 0, //是否允许催办
        isAssist: 0, //是否允许升级协助
        isDelay: 0, //是否允许申请延迟
        delayCount: 0, //可申请延迟次数
        delayTime: 0, //延迟时间
        isComplete: 0, //完结是否外呼至客户
        isAssess: 0, //是否客户邀评
        isOkToParent:0,//满意是否升级上级处理
        
        // 网点配置
        isSiteProcess: 1, //是否网点处理
        isSmsNotify: 3, //网点是否首跟
        siteSmsNotifyTime: 2, //网点首跟回复时间
        siteOvertimeType: 0, //网点超时类型
        siteOvertimeTime: 0, //网点超时时间
        siteMorningDealType: 1, //网点12点前处理类型
        siteMorningDealTime: "", //网点12点前处理时间
        siteAfternoonDealType: 1, //网点12点后处理类型
        siteAfternoonDealTime: "", //网点12后处理时间
        isSiteOvertime: 0, //是否判断网点超时
        siteOvertimeFineMoney: "", //网点超时罚款金额
        isOverTimeToParent: 0, //网点超时是否升级上级处理
        isFinishedToParent: 0, //网点完结是否上级处理

        //省区配置
        isProvinceSmsNotify: 3, //省区是否允许首跟
        provinceSmsNotifyTime: 1, //省区首跟时间
        provinceOvertimeType: 0, //省区超时类型
        provinceOvertimeTime: 0, //省区超时时间
        provinceMorningDealType: 1, //省区12点前处理类型
        provinceMorningDealTime: "", //省区12点前处理时间
        procinceAfternoonDealType: 1, //省区12点后处理类型
        procinceAfternoonDealTime: "", //省区12后处理时间
        isProvinceOvertime: 0, //是否判断省区超时罚款
        provinceOvertimeFineMoney: 0, //是否判断省区超时罚款金额
        isProvinceOvertimeToParent:0,//省区超时是否升级上级处理
        isProvinceFinishedToParent:0,//省区完结是否上级处理

        //总部配置
        isHqSmsNotify: 3, //总部是否首跟
        hqSmsNotifyTime: 1, //总部首跟时间
        hqOvertimeType: 0, //总部超时类型
        hqOvertimeTime: 0, //总部时效时间
        isProficientProcess: 0, //是否升级到专家坐席
        hqMorningDealType: 1, //总部12点前处理类型
        hqMorningDealTime: "", //总部12点前处理时间
        hqAfternoonDealType: 1, //总部12点后处理类型
        hqAfternoonDealTime: "", //总部12后处理时间
        isHqOvertime: 0, //是否判断网点超时
        hqOvertimeFineMoney: 0, //总部超时罚款金额

        //二次申诉
        isSecondAppeal: 0, //二次投诉是否罚款
        secondFineMoney: "", //二次投诉罚款金额
        isFirstAppeal: 0, //首次投诉是否罚款
        firstFineMoney: "" //首次投诉罚款金额
      },
      firstValidate: {
        //工单来源名称
        dataSourceId: [
          { required: true, message: "工单来源名称不能为空", trigger: "change" }
        ],
        //来源类型
        typeName: [
          {
            required: true,
            type: "array",
            min: 1,
            message: "工单来源类型不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    this.$el.getElementsByClassName("ivu-tabs-bar")[0].style.display = "none";
    getAllType().then(res => {
      if (res && res.success) {
        this.sourceTypeData = res.data;
      }
    });
  },
  methods: {
    handleFirstStep(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$emit("changePane", "secondPane");
        } else {
          this.$Message.error("请输入必填项!");
        }
      });
    },
    handleSubmitAdd() {
      addBusinessConfig({
        //工单来源ID
        // typeName: this.firstFormData.typeName,             //工单类型--工单一级类型Code--二级--三级
        firstCode: this.firstFormData.typeName[0],
        secondCode: this.firstFormData.typeName[1],
        threeCode: this.firstFormData.typeName[2],
        dataSourceId: this.firstFormData.dataSourceId,
        code: this.firstFormData.code, //工单编号（外部）
        bigType: this.firstFormData.bigType, //工单大类（外部）
        smallType: this.firstFormData.smallType, //工单小类（外部）
        caseType: this.firstFormData.caseType, //外部工单类型

        // 常规配置
        isBeian: this.secondFormData.isBeian, //是否备案
        isUrge: this.secondFormData.isUrge, //是否允许催办
        isAssist: this.secondFormData.isAssist, //是否允许升级协助
        isDelay: this.secondFormData.isDelay, //是否允许申请延迟
        delayTime: this.secondFormData.delayTime, //延迟时间
        isComplete: this.secondFormData.isComplete, //完结是否外呼至客户
        isAssess: this.secondFormData.isAssess, //是否客户邀评
        isOkToParent:this.secondFormData.isOkToParent,//满意是否升级上级处理
        //网点配置
        isSiteProcess: this.secondFormData.isSiteProcess, //是否网点处理
        isSmsNotify: this.secondFormData.isSmsNotify, //网点是否首跟
        siteSmsNotifyTime: this.secondFormData.siteSmsNotifyTime, //网点首跟回复时间
        siteOvertimeType: this.secondFormData.siteOvertimeType, //网点超时类型
        siteOvertimeTime: this.secondFormData.siteOvertimeTime, //网点超时时间
        siteMorningDealType: this.secondFormData.siteMorningDealType, //网点12点前处理类型
        siteMorningDealTime: this.secondFormData.siteMorningDealTime, //网点12点前处理时间
        siteAfternoonDealType: this.secondFormData.siteAfternoonDealType, //网点12点后处理类型
        siteAfternoonDealTime: this.secondFormData.siteAfternoonDealTime, //网点12后处理时间
        isSiteOvertime: this.secondFormData.isSiteOvertime, //是否判断网点超时
        siteOvertimeFineMoney: this.secondFormData.siteOvertimeFineMoney, //网点超时罚款金额
        isOverTimeToParent: this.secondFormData.isOverTimeToParent, //网点超时是否升级上级处理
        isFinishedToParent: this.secondFormData.isFinishedToParent, //网点完结是否上级处理
        //省区配置
        isProvinceSmsNotify: this.secondFormData.isProvinceSmsNotify, //省区是否允许首跟
        provinceSmsNotifyTime: this.secondFormData.provinceSmsNotifyTime, //省区首跟时间
        provinceOvertimeType: this.secondFormData.provinceOvertimeType, //省区超时类型
        provinceOvertimeTime: this.secondFormData.provinceOvertimeTime, //省区超时时间
        provinceMorningDealType: this.secondFormData.provinceMorningDealType, //省区12点前处理类型
        provinceMorningDealTime: this.secondFormData.provinceMorningDealTime, //省区12点前处理时间
        procinceAfternoonDealType: this.secondFormData.procinceAfternoonDealType, //省区12点后处理类型
        procinceAfternoonDealTime: this.secondFormData.procinceAfternoonDealTime, //省区12后处理时间
        isProvinceOvertime: this.secondFormData.isProvinceOvertime, //是否判断省区超时
        provinceOvertimeFineMoney: this.secondFormData.provinceOvertimeFineMoney, //是否判断省区超时
        isProvinceOvertimeToParent: this.secondFormData.isProvinceOvertimeToParent, //省区超时是否升级上级处理
        isProvinceFinishedToParent: this.secondFormData.isProvinceFinishedToParent, //省区完结是否上级处理
        //总部配置
        isHqProcess: this.secondFormData.isHqProcess, //是否总部处理
        isHqSmsNotify: this.secondFormData.isHqSmsNotify, //总部是否首跟
        hqSmsNotifyTime: this.secondFormData.hqSmsNotifyTime, //总部首跟时间
        isHqOvertime: this.secondFormData.isHqOvertime, //是否判断网点超时
        hqOvertimeFineMoney: this.secondFormData.hqOvertimeFineMoney, //总部超时罚款金额
        hqOvertimeType: this.secondFormData.hqOvertimeType, //总部超时类型
        hqOvertimeTime: this.secondFormData.hqOvertimeTime, //总部超时时间
        isProficientProcess: this.secondFormData.isProficientProcess, //是否升级到专家坐席
        hqMorningDealType: this.secondFormData.hqMorningDealType, //总部12点前处理类型
        hqMorningDealTime: this.secondFormData.hqMorningDealTime, //总部12点前处理时间
        hqAfternoonDealType: this.secondFormData.hqAfternoonDealType, //总部12点后处理类型
        hqAfternoonDealTime: this.secondFormData.hqAfternoonDealTime, //总部12后处理时间

        //二次申述
        isSecondAppeal: this.secondFormData.isSecondAppeal, //二次投诉是否罚款
        secondFineMoney: this.secondFormData.secondFineMoney, //二次投诉罚款金额
        isFirstAppeal: this.secondFormData.isFirstAppeal, //首次投诉是否罚款
        firstFineMoney: this.secondFormData.firstFineMoney //首次投诉罚款金额
      }).then(res => {
        if (res && res.success) {
          this.$emit("isSuccess", true);
          this.$Message.success(Array.isArray(res.msg) ? res.msg[0] : res.msg);
        } else {
          console.info(res);
          this.$Message.error({
            content: Array.isArray(res.msg) ? res.msg[0] : res.msg,
            closable: true,
            duration: 5
          });
        }
      });
    },
    typeDelete() {
      this.firstFormData.caseType = "";
    }
  }
};
</script>

<style lang="less" scoped>
// .addWrap{
//   margin: -16px;
//   max-height: 400px;
//   overflow-y: scroll;
//   padding: 16px;
// }
.ivu-divider-horizontal {
  margin: 0 0 24px 0;
}
.demo-drawer-profile .ivu-form-item {
  margin-bottom: 4px;
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
</style>
