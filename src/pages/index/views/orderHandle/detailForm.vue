<template>
  <Form class="detailForm" :model="formDetailItem" inline>
    <div class="part p1">
      <p>内件物品：{{formItem.goodsName}}</p>
      <p>内件价值：{{formItem.itemValue}}</p>
      <p>投诉人角色：{{formItem.initRole}}</p>
      <p>投诉人电话：{{formItem.initPhone}}</p>
      <p>被投诉网点：{{formItem.becomplainSiteName}}</p>
    </div>
    <div class="part p2">
      <div class="receive re" style="width:33.3%">
        <p>收件人姓名：{{formItem.receiveName}}</p>
        <p>收件人座机：{{formItem.receivePhone}}</p>
        <p>收件人手机：{{formItem.receiveMobile}}</p>
        <p>收件人省市区：{{formItem.receiveArea}}</p>
        <p class="addr">
          <span class="addr_title">收件人地址：</span>
          <span class="desc">{{formItem.receiveAddress}}</span>
        </p>
      </div>
      <div class="send re" style="width:33.3%">
        <p>发件人姓名：{{formItem.sendName}}</p>
        <p>发件人座机：{{formItem.sendPhone}}</p>
        <p>发件人手机：{{formItem.sendMobile}}</p>
        <p>发件人省市区：{{formItem.sendArea}}</p>
        <p class="addr">
          <span class="addr_title">发件人地址：</span>
          <span class="desc">{{formItem.sendAddress}}</span>
        </p>
      </div>
      <div class="other re" style="width:33.3%" v-if="formItem.otherName!=''">
        <p>第三方姓名：{{formItem.otherName}}</p>
        <p>第三方座机：{{formItem.otherPhone}}</p>
        <p>第三方手机：{{formItem.otherMobile}}</p>
        <p>第三方省市区：{{formItem.otherArea}}</p>
        <p class="addr">
          <span class="addr_title">第三方地址：</span>
          <span class="desc">{{formItem.otherAddress}}</span>
        </p>
      </div>
    </div>
    <div class="part p3">
      <p>当前处理时效：{{formItem.siteProcessTime}}</p>
      <p>工单类型：{{formItem.dataTypeDisplay}}</p>
      <p>末端扫描网点：{{formItem.lastScanSite}}</p>
    </div>
  </Form>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      formItem: {}
    };
  },
  props: {
    formDetailItem: Object,
    labelArray: Array
  },
  mounted() {
    // let self = this;
    // setTimeout(function() {
    //   self.formItem = self.$parent.firstArray;
    // }, 200);
  },
  methods: {
    isArrayFn(value) {
      if (typeof Array.isArray === "function") {
        return Array.isArray(value);
      } else {
        return Object.prototype.toString.call(value) === "[object Array]";
      }
    },
    isMatch(value, flag) {
      //value中包含flag时，返回true，否则返回false
      if (value.search(flag) != -1) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.detailForm {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  .part {
    p {
      padding: 8px;
    }
  }
  .p1 {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: #f5f5f5;
    p {
      margin-right: 30px;
    }
  }
  .p2 {
    width: 100%;
    border-bottom: 1px solid #f5f5f5;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .re {
      border-right: 1px solid #f5f5f5;
      .addr {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        .addr_title {
          min-width: 80px;
          max-width: 88px;
        }
        .desc {
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          flex-wrap: wrap;
        }
      }
    }
    .re:last-child {
      border-right-width: 0px !important;
    }
  }
  .p3 {
    background-color: #f5f5f5;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    p {
      margin-right: 30px;
    }
  }
}
</style>