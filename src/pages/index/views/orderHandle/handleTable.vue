<template>
  <div class>
    <div class="btnOptions">
      <ButtonGroup :size="buttonSize">
        <!--<Button :size="buttonSize" type="primary" @click="pending()">待处理 </Button>-->
        <!--<Button :size="buttonSize" @click="help()">待协助 </Button>-->
      </ButtonGroup>
      <!--<div class="btn_right" style="position: relative;">
			    <Button @click="exportData(1)">导出</Button>
		        <Button style="margin-left: 10px;" @click="exportData(1)">全部导出</Button>
      </div>-->
    </div>
    <Table
      class="handleTable"
      ref="tableData"
      :columns="columns1"
      :data="data1"
      :height="tableHight"
      border
      @on-selection-change="handleSelectRow"
      @on-sort-change="sortFun"
    >
      <!--操作列-->
      <template slot-scope="{ row, index }" slot="action">
        <Button
          v-if="row.dataStateName==='待首跟'"
          type="primary"
          size="small"
          @click="shouReply(row,index)"
        >首跟</Button>
        <Button
          v-else
          type="primary"
          size="small"
          @click="show(row,index)"
          style="margin-right: 5px"
        >处理</Button>
      </template>
      <!--运单编号-->
      <template slot-scope="{ row, index }" slot="billCode">
        <!--<span style="cursor: pointer;" @click="numClick(row,index)">{{row.billCode}}</span>-->
        <span
          style="cursor: pointer;display: inline-block;width: 100%;height: 100%;color: rgba(243,113,53,1);"
          @click="copyClick(row,index)"
          @contextmenu="showRight"
          id="billCode"
          data-clipboard-action="copy"
          :data-clipboard-text="row.billCode"
        >{{row.billCode}}</span>
      </template>
      <!--工单ID-->
      <template slot-scope="{ row, index }" slot="id">
        <span style="cursor: pointer;" @click="numClick(row,index)">{{row.id}}</span>
      </template>
      <!--工单信息-->
      <template slot-scope="{row,index}" slot="info">
        <p class="orderInfor">
          <span class="inforTitle">投诉网点：</span>
          {{row.createSite}}
          <span class="inforTitle">被投诉网点：</span>
          {{row.becomplainSiteName}}
        </p>
        <p class="orderInfor">
          <span class="inforTitle">发件：</span>
          {{row.sendName}},{{row.sendMobile}},{{row.sendArea}}
        </p>
        <p class="orderInfor">{{row.sendAddress}}</p>
        <p class="orderInfor">
          <span class="inforTitle">收件：</span>
          {{row.receiveName}},{{row.receiveMobile}},{{row.receiveArea}}
        </p>
        <p class="orderInfor">{{row.receiveAddress}}</p>
        <p class="orderInfor">
          <span class="inforTitle">创建时间：</span>
          {{row.createOn}}
          <span class="inforTitle second">处理等级：</span>
          {{row.dealLevel}}
        </p>

        <!--<p class="orderInfor"><span class="inforTitle">投诉网点：</span>{{row.createSite}}   <span class="inforTitle">被投诉网点：</span>{{row.becomplainSiteName}}   <span class="inforTitle second">处理等级：</span>{{row.procLeval}}</p>
	        	
	        	<!--<p class="orderInfor"><span class="inforTitle">投诉网点：</span>{{row.createSite}}   <span class="inforTitle">被投诉网点：</span>{{row.becomplainSiteName}}   <span class="inforTitle second">处理等级：</span>{{row.procLeval}}</p>
	        	<p class="orderInfor"><span class="inforTitle">发件：</span>{{row.sendName}}，{{row.sendMobile}}</p>
				<p class="orderInfor"><span class="inforTitle"></span>{{row.sendArea}}{{row.sendAddress}}</p>
	        	<p class="orderInfor"><span class="inforTitle">收件：</span>{{row.receiveName}}，{{row.receiveMobile}}</p>
				<p class="orderInfor"><span class="inforTitle"></span>{{row.receiveArea}}{{row.receiveAddress}}</p>
        <p class="orderInfor"><span class="inforTitle">创建时间：</span>{{row.createOn}}</p>-->
      </template>
      <!--序号行上面的徽标数-->
      <template slot-scope="{ row, index }" slot="index">
        <div v-if="row.dataState===1" class="cell_state">
          <span class="color_icon" style="background-color: #FF9900;color: #FFFFFF;">催</span>
          <span class="color_title">{{row.index}}</span>
        </div>
        <div v-else class="cell_state">
          <span class="color_title">{{row.index}}</span>
        </div>
      </template>

      <template slot-scope="{row,index}" slot="desc">
        <div
          class
          style="height: 100px;overflow-y: hidden;text-overflow:ellipsis;padding-bottom: 5px;"
        >{{row.reqDescription}}</div>
      </template>
    </Table>
    <div style="margin: 10px;overflow: hidden" class="tab_page">
      <div style="float: right;">
        <Page
          show-sizer
          show-total
          :page-size="pageSize"
          :total="totalNumber"
          :current="cuurPage"
          @on-change="changePageNumber"
          @on-page-size-change="handleChangePageSize"
        ></Page>
      </div>
    </div>
  </div>
</template>

<script>
import { addClass, removeClass, formatDateTime } from "@/functions/function.js";
import qData from "@/mock/queryData.js";
import qtableDetail from "./handleTableDetail.vue";
import { getHandleIdData, getFirstReply } from "@/api/orderManage/handle.js";
export default {
  components: { qData, addClass, removeClass, qtableDetail },
  props: {
    tableHight: {
      type: Number
    },
    data1: {
      type: Array,
      default: qData
    },
    columns1: {
      type: Array
    },
    pageSize: {
      type: Number,
      default: 20
    },
    cuurPage: {
      type: Number,
      default: 1
    },
    totalNumber: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      offset: [-10, 20], //徽标的位置
      buttonSize: "default",
      shareState: false, //分享按钮下面的
      settingState: false, //设置按钮
      modalStata: {
        //模态框信息
        state: false,
        title: ""
      },
      modal10: false, //设置模态框开始时不显示
      theight: "", //table的高度
      wholeH: 0, //整体的高度
      chosenItem: []
    };
  },

  methods: {
    sortFun({ column, key, order }) {
      this.$emit("sortFun", key, order);
    },
    copyClick(row, index) {
      this.right();
    },
    //右键点击事件
    showRight(event) {
      console.log(event.button, "呦呦呦");
      this.right();
    },
    right() {
      let self = this;
      let clipboard = new ClipboardJS("#billCode");
      //成功回调
      clipboard.on("success", function(e) {
        console.info("Text:", e.text);
        event.path[0].style.backgroundColor = "rgba(243,243,243,1)";
        e.clearSelection();
        self.$Message.success({
          content: "单号：" + e.text + "  复制成功！",
          duration: 2
        });
        let events = event;
        setTimeout(function() {
          events.path[0].style.backgroundColor = "rgba(243,243,243,0)";
        }, 2000);
        clipboard.destroy();
      });
      //失败回调
      clipboard.on("error", function(e) {
        console.error("Action:", e.action);
        console.error("Trigger:", e.trigger);
        clipboard.destroy();
      });
    },
    //待处理
    pending() {
      console.log(this.columns1);
      console.log(this.$refs.tableData);
      let w = document.querySelector(".ivu-btn-group").children;
      addClass(w[0], "ivu-btn-primary");
      removeClass(w[1], "ivu-btn-primary");

      this.$emit("handleWait");
    },
    //待协助
    help() {
      let w = document.querySelector(".ivu-btn-group").children;
      addClass(w[1], "ivu-btn-primary");
      removeClass(w[0], "ivu-btn-primary");
      this.$emit("handleHelp");
    },

    //分享按钮
    share() {
      if (!this.shareState) {
        this.shareState = !this.shareState;
      } else {
        this.shareState = !this.shareState;
      }
    },
    //设置按钮
    setting() {
      if (!this.settingState) {
        this.settingState = !this.settingState;
      } else {
        this.settingState = !this.settingState;
      }
    },
    //分页中改变页数的按钮方法
    changePageNumber(page) {
      this.$emit("handleChangeNumber", page);
    },
    handleChangePageSize(page) {
      this.$emit("changePageSize", page);
    },
    //点击查看详情
    show(row, index) {
      this.modalStata.state = true;
      this.modalStata.title = row.billCode + "工单信息";
      getHandleIdData({
        Id: row.id
      }).then(res => {
        if (res && res.success) {
          this.$router.push({
            name: "orderHandleDetail",
            query: {
              r: row,
              i: index,
              d: this.$refs.tableData.data
            }
          });
          this.$store.commit("saveHandleDetail", this.$refs.tableData.data);
          sessionStorage.setItem(
            "saveHandleDetail",
            JSON.stringify(this.$refs.tableData.data)
          );
        } else {
          this.$Message.info(res.msg);
        }
      });
    },
    //首跟回复按钮
    shouReply(row, index) {
      this.$emit("shouReply", row);
    },
    //导出数据
    exportData(type) {
      if (type === 1) {
        this.$refs.tableData.exportCsv({
          filename: "导出原始数据表",
          //                      data:formatDateTime
          data: this.data1.filter((data, index) =>
            formatDateTime(data.createOn)
          )
        });
      } else if (type === 2) {
        this.$refs.tableData.exportCsv({
          filename: "排序后的数据",
          original: false
        });
      } else if (type === 3) {
        this.$refs.tableData.exportCsv({
          filename: "自定义数据",
          columns: this.columns1.filter((col, index) => index < 4),
          data: this.data1.filter((data, index) => index < 4)
        });
      }
      this.shareState = !this.shareState;
    },
    //获取选中行
    handleSelectRow(selection, index) {
      let clus = this.$refs.tableData.getSelection();
      this.$store.commit("saveQuerySelected", clus);
      this.chosenItem = clus;
      //          	console.log(this.$store.state.querySelected,'当前选中行的数据')
    },
    //点击 “运单编号”
    numClick(row, index) {
      console.log(row, "整行的数据");
      console.log(row.billCode, "当前行的  运单编号");
      //下面这种写法可以跳转到新的页面
      //		    	let routeUrl = this.$router.resolve({
      //		           name:'Integrated',
      //		           query:{
      //		           	bill:row.billCode
      //		           }
      //		        });
      //		        window.open(routeUrl .href, '_blank');
    },
    getHeight() {
      let wh = document.body.clientHeight;
      let th = document.querySelector(".query_header").clientHeight;
      let fh = document.querySelector(".query_form").clientHeight;
      let bh = document.querySelector(".btnOptions").clientHeight;
      let cur = wh - th - fh - bh - 160 + "px";
      this.theight = cur;
      //		    	console.log(wh,'整体窗口的高度');
      //		    	console.log(th,'头部高度');
      //		    	console.log(fh,'表单的高度');
      //		    	console.log(bh,'按钮组的高度');
      //		    	console.log(cur)
    }
  },
  mounted() {
    this.getHeight();

    //			console.log(this.wholeH)
  },
  watch: {
    //			wholeH:function(newValue,oldValue){
    //				console.log(newValue,oldValue)
    //			}
  },
  computed: {}
};
</script>

<style lang="less" scoped>
.btnOptions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  margin-bottom: 10px;

  .btn_right {
    .btn_right_one {
      margin-right: 5px;
    }
  }
}
.ivu-radio-wrapper-checked {
  background-color: #f1701f !important;
  color: #ffffff !important;
}
.colorAdd {
  background-color: #f1701f;
  color: #ffffff;
}

.btn_group {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  position: absolute;
  top: 33px;
  left: 0px;
  z-index: 99999 !important;
  button {
    width: 80px !important;
    border-radius: 0px !important;
  }
  button:nth-child(2) {
    border-top-width: 0px !important;
  }
}
.grTwo {
  left: 12px !important;
}
.orderInfor {
  line-height: 21px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  .inforTitle {
    font-weight: bold;
  }
  .second {
    margin-left: 40px !important;
  }
}
</style>