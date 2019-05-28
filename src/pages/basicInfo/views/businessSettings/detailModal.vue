<template>
  <div class v-if="isObjectNull">
    <Row :gutter="48" style="padding: 0px 10px 0px 10px;">
      <Col span="24" style="width:800px">
        <p class="title_header">基础信息</p>
        <div class="demo-drawer-profile">
          <Row>
            <Col span="8">
              工单来源:
              <label>{{detailData.dataSourceName}}</label>
            </Col>
            <Col span="8">
              工单编号（外部）:
              <label>{{detailData.code}}</label>
            </Col>
            <Col span="8">
              工单大类（外部）:
              <label>{{detailData.bigType}}</label>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              工单小类（外部）:
              <label>{{detailData.smallType}}</label>
            </Col>
               <Col span="8">
              外部工单类型:
              <label>{{detailData.caseType==1?'咨询单':'投诉单'}}</label>
            </Col>
            <Col span="8">
              工单一级类型:
              <label>{{detailData.firstName}}</label>
            </Col>
          
          </Row>
          <Row>
            <Col span="8">
              工单二级类型:
              <label>{{detailData.secondName}}</label>
            </Col>
            <Col span="8">
              工单三级类型:
              <label>{{detailData.threeName}}</label>
            </Col>
          </Row>
        </div>
      </Col>
      <Col span="16" class="divider_top_right" style="width:400px">
        <p class="title_header">常规配置</p>
        <div class="demo-drawer-profile">
          <Row>
            <Col span="12">
              是否判断备案:
              <label>{{detailData.isBeian==1?'是':'否'}}</label>
            </Col>
            <Col span="12">
              是否允许催办:
              <label>{{detailData.isUrge==1?'是':'否'}}</label>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              是否允许升级协助:
              <label>{{detailData.isAssist==1?'是':'否'}}</label>
            </Col>
          </Row>
          <div class="bg_gray">
            <Row>
              <Col span="12">
                是否允许申请延迟:
                <label>{{detailData.isDelay==1?'是':'否'}}</label>
              </Col>
              <Col span="12"  v-if="detailData.isDelay==1">
                延迟时间:
                <label>{{detailData.delayTime}} H</label>
              </Col>
            </Row>
          </div>
          <Row>
            <Col span="12">
              完结是否外呼至客户:
              <label>{{detailData.isComplete==1?'是':'否'}}</label>
            </Col>
          </Row>
          <div class="bg_gray" v-if="detailData.isComplete == '1'">
              <Row :gutter="20">
                <Col span="24">
                  是否客户邀评
                  <label>{{detailData.isAssess==1?'是':'否'}}</label>
                </Col>
              </Row>
              <Row :gutter="20">
                <Col span="24">
                  满意是否升级上级处理
                  <label>{{detailData.isOkToParent==1?'是':'否'}}</label>
                </Col>
              </Row>
          </div>
        </div>
        <p class="title_header">网点配置</p>
        <div class="demo-drawer-profile">
          <Row>
            <Col span="12">
              是否网点处理:
              <label>{{detailData.isSiteProcess==1?'是':'否'}}</label>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              是否允许首跟:
              <label v-if="detailData.isSmsNotify==1">系统首跟</label>
              <label v-else-if="detailData.isSmsNotify==2">人工首跟</label>
              <label v-else-if="detailData.isSmsNotify==3">否</label>
            </Col>
            <Col span="12" v-if="detailData.isSmsNotify==2">
              首跟回复时间:
              <label>{{detailData.siteSmsNotifyTime}} H</label>
            </Col>
          </Row>
          <div class="bg_gray">
            <Row>
              <Col span="12">
                时效类型:
                <label v-if="detailData.siteOvertimeType==0">自然小时</label>
                <label v-else-if="detailData.siteOvertimeType==1">工作小时</label>
                <label v-else="detailData.siteOvertimeType==2">自定义小时</label>
              </Col>
              <Col span="12" v-if="detailData.siteOvertimeType==0||detailData.siteOvertimeType==1">
                时效时间:
                <label>{{detailData.siteOvertimeTime}} H</label>
              </Col>
            </Row>
            <Row v-if="detailData.siteOvertimeType==2">
              <Col span="24">
                当天12点前下发的工单:
                <label>{{detailData.siteMorningDealType==1?'当天':'次日'}} &nbsp;&nbsp; {{detailData.siteMorningDealTime}}</label>
              </Col>
              <Col span="24">
                当天12点后下发的工单:
                <label>{{detailData.siteAfternoonDealType==1?'当天':'次日'}} &nbsp;&nbsp; {{detailData.siteAfternoonDealTime}}</label>
              </Col>
            </Row>
          </div>
          <Row>
            <Col span="12">
              网点是否超时罚款:
              <label>{{detailData.isSiteOvertime==1?'是':'否'}}</label>
            </Col>
            <Col span="12" v-if="detailData.isSiteOvertime==1">
              罚款金额:
              <label>{{detailData.siteOvertimeFineMoney}}</label>
            </Col>
          </Row>
          <Row :gutter="20">
            <Col span="24">
              网点超时是否升级上级处理：
              <label>{{detailData.isOvertimeToParent==1?'是':'否'}}</label>
            </Col>
          </Row>
          <Row :gutter="20">
              <Col span="24">
                网点完结是否上级处理
                <label>{{detailData.isFinishedToParent==1?'是':'否'}}</label>
              </Col>
          </Row>
        </div>
        <p class="title_header">申诉罚款</p>
        <div class="demo-drawer-profile">
          <Row>
            <Col span="12">
              首次投诉是否罚款:
              <label>{{detailData.isFirstAppeal==1?'是':'否'}}</label>
            </Col>
            <Col span="12" v-if="detailData.isFirstAppeal==1">
              首次投诉罚款金额:
              <label>{{detailData.firstFineMoney}}</label>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              二次投诉是否罚款:
              <label>{{detailData.isSecondAppeal==1?'是':'否'}}</label>
            </Col>
            <Col span="12" v-if="detailData.isSecondAppeal==1">
              二次投诉罚款金额:
              <label>{{detailData.secondFineMoney}}</label>
            </Col>
          </Row>
        </div>
      </Col>
      <Col span="16" class="divider_top" style="width:400px">
        <p class="title_header">省区配置</p>
        <div class="demo-drawer-profile">
          <Row>
            <Col span="12">
              省区是否首跟：
              <label v-if="detailData.isProvinceSmsNotify==1">系统首跟</label>
              <label v-else-if="detailData.isProvinceSmsNotify==2">人工首跟</label>
              <label v-else-if="detailData.isProvinceSmsNotify==3">否</label>
            </Col>
            <Col span="12" v-if="detailData.isProvinceSmsNotify==2">
              首跟回复时间：
              <label>{{detailData.provinceSmsNotifyTime}} H</label>
            </Col>
          </Row>
          <div class="bg_gray">
            <Row>
              <Col span="12">
                时效类型:
                <label v-if="detailData.provinceOvertimeType==0">自然小时</label>
                <label v-else-if="detailData.provinceOvertimeType==1">工作小时</label>
                <label v-else="detailData.provinceOvertimeType==2">自定义小时</label>
              </Col>
              <Col
                span="12"
                v-if="detailData.provinceOvertimeType==0||detailData.provinceOvertimeType==1"
              >
                时效时间:
                <label>{{detailData.provinceOvertimeTime}} H</label>
              </Col>
            </Row>
            <Row v-if="detailData.provinceOvertimeType==2">
              <Col span="24">
                当天12点前下发的工单:
                <label>{{detailData.provinceMorningDealType ==1 ?'当天':'次日'}} &nbsp;&nbsp; {{detailData.provinceMorningDealTime}}</label>
              </Col>
              <Col span="24">
                当天12点后下发的工单:
                <label>{{detailData.procinceAfternoonDealType==1?'当天':'次日'}} &nbsp;&nbsp; {{detailData.procinceAfternoonDealTime}}</label>
              </Col>
            </Row>
          </div>
          <Row>
            <Col span="12">
              省区是否超时罚款:
              <label>{{detailData.isProvinceOvertime==0?"否":"是"}}</label>
            </Col>
            <Col span="12" v-if="detailData.isProvinceOvertime==1">
              罚款金额：
              <label>{{detailData.provinceOvertimeFineMoney}}</label>
            </Col>
          </Row>
          <Row :gutter="20">
            <Col span="24">
              省区超时是否升级上级处理
              <label>{{detailData.isProvinceOvertimeToParent==1?'是':'否'}}</label>
            </Col>
          </Row>
          <Row :gutter="20">
              <Col span="24">
                省区完结是否上级处理
                <label>{{detailData.isProvinceFinishedToParent==1?'是':'否'}}</label>
              </Col>
          </Row>
        </div>
        <p class="title_header">总部配置</p>
        <div class="demo-drawer-profile">
          <Row>
            <Col span="12">
              是否升级到专家坐席:
              <label>{{detailData.isProficientProcess==0?"否":"是"}}</label>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              总部是否首跟:
              <label v-if="detailData.isHqSmsNotify==1">系统首跟</label>
              <label v-else-if="detailData.isHqSmsNotify==2">人工首跟</label>
              <label v-else-if="detailData.isHqSmsNotify==3">否</label>
            </Col>
            <Col span="12" v-if="detailData.isHqSmsNotify==2">
              首跟回复时间：
              <label>{{detailData.hqSmsNotifyTime}} H</label>
            </Col>
          </Row>
          <div class="bg_gray">
            <Row>
              <Col span="12">
                时效类型:
                <label v-if="detailData.hqOvertimeType==0">自然小时</label>
                <label v-else-if="detailData.hqOvertimeType==1">工作小时</label>
                <label v-else="detailData.hqOvertimeType==2">自定义小时</label>
              </Col>
              <Col span="12" v-if="detailData.hqOvertimeType==0||detailData.hqOvertimeType==1">
                时效时间:
                <label>{{detailData.hqOvertimeTime}} H</label>
              </Col>
            </Row>
            <Row v-if="detailData.hqOvertimeType==2">
              <Col span="24">
                当天12点前下发的工单:
                <label>{{detailData.hqMorningDealType ==1 ?'当天':'次日'}} &nbsp;&nbsp; {{detailData.hqMorningDealTime}}</label>
              </Col>
              <Col span="24">
                当天12点后下发的工单:
                <label>{{detailData.hqAfternoonDealType==1?'当天':'次日'}} &nbsp;&nbsp; {{detailData.hqAfternoonDealTime}}</label>
              </Col>
            </Row>
          </div>
          <Row>
            <Col span="12">
              总部是否超时罚款:
              <label>{{detailData.isHqOvertime==0?"否":"是"}}</label>
            </Col>
            <Col span="12" v-if="detailData.isHqOvertime==1">
              罚款金额：
              <label>{{detailData.hqOvertimeFineMoney}}</label>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  props: {
    detailData: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  computed: {
    isObjectNull() {
      return JSON.stringify(this.detailData) !== "{}";
    }
  },
  created() {
    console.log(this.detailData);
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
  margin: 8px 0;
}
.demo-drawer-profile p {
  margin: 14px 0;
}
.divider_top {
  border-top: 1px dashed #e8eaec;
}
.divider_top_right {
  border-top: 1px dashed #e8eaec;
  border-right: 1px dashed #e8eaec;
}
.divider_right {
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
  margin-left: -12px;
  padding-left: 12px;
}
</style>
