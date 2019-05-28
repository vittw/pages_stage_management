<template>
  <div class="tabOuter">
    <div class="btnOptions">
      <ButtonGroup :size="buttonSize">
        <Button :size="buttonSize" type="primary" @click="pending()">全部</Button>
        <Button :size="buttonSize" @click="help()">待催办</Button>
        <!--<Button :size="buttonSize" @click="overTime">已超时</Button>-->
      </ButtonGroup>
      <!-- <div class="btn_right" style="position: relative;">
        <Button @click="exportData(1)">导出</Button>
        <Button style="margin-left: 8px;" @click="exportData(2)">全部导出</Button>
      </div>-->
    </div>

    <div class="table">
      <Table
        ref="tableData"
        :columns="columns1"
        :data="datas"
        border
        highlight-row
        @on-select="selects"
        @on-selection-change="handleSelectRow()"
        :height="tableHight"
        @on-sort-change="sortFun"
        @on-drag-drop="drag"
        size="small"
      >
        <!--3700341571339-->
        <!--操作列-->

        <!--运单编号-->
        <template slot-scope="{ row, index }" slot="billCode">
          <!--<span 
		        		style="cursor: pointer;" 
		        		@click="copyClick(row,index)"
		        		@contextmenu.prevent='showRight'
		        		id="billCode"
		        		data-clipboard-action="copy"
          :data-clipboard-text="row.billCode">{{row.billCode}}</span>-->

          <!--onmousedown      @onmousedown="which(event)"-->
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
        <template slot-scope="{row,index}" slot="infor">
          <p class="orderInfor">
            <span class="inforTitle">投诉人角色：</span>
            {{row.initRole}}
            <span class="inforTitle">下发次数：</span>
            {{row.issuedNumber}}
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
            <span class="inforTitle">投诉网点：</span>
            {{row.createSite}},{{row.createBy}}
          </p>
          <p class="orderInfor">
            <span class="inforTitle">创建时间：</span>
            {{row.createOn}}
            <span class="inforTitle">处理等级</span>
            {{row.dealLevel}}
          </p>

          <!--<p class="orderInfor"><span class="inforTitle">投诉网点：</span>{{row.createSite}}   <span class="inforTitle">被投诉网点：</span>{{row.becomplainSiteName}}</p>
	        		<p class="orderInfor"><span class="inforTitle">发件：</span>{{row.sendName}}，{{row.sendMobile}}</p>
					<p class="orderInfor"><span class="inforTitle"></span>{{row.sendArea}}{{row.sendAddress}}</p>
	        		<p class="orderInfor"><span class="inforTitle">收件：</span>{{row.receiveName}}，{{row.receiveMobile}}</p>
					<p class="orderInfor"><span class="inforTitle"></span>{{row.receiveArea}}{{row.receiveAddress}}</p>
          <p class="orderInfor"><span class="inforTitle">创建时间：</span>{{row.createOn}}</p>-->
        </template>
        <template slot-scope="{row,index}" slot="desc">
          <div
            class
            style="height: 100px;overflow-y: hidden;text-overflow:ellipsis;"
          >{{row.reqDescription}}</div>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" size="small" @click="show(row,index)" style="margin-right: 5px">详情</Button>
        </template>
      </Table>
      <!--点击详情出来的详情清单-->
      <Modal
        :title="modalStata.title"
        v-model="modalStata.state"
        fullscreen
        class-name="tableDetail"
      >
        <qtableDetail :detailObject="detailObject"></qtableDetail>
        <div class slot="footer"></div>
      </Modal>
    </div>
    <div class="tab_page" style="margin: 10px;overflow: hidden;height">
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
import {
  addClass,
  removeClass,
  formatDateTime,
  compareObject
} from "@/functions/function.js";
import qtableDetail from "@/pages/index/views/orderQuery/queryTableDetail.vue";

import { getIdQueryDetail } from "@/api/orderManage/query.js";

export default {
  components: {
    addClass,
    removeClass,
    qtableDetail,
    compareObject
  },
  props: {
    tableHight: {
      type: Number
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
    },
    datas: {
      type: Array
    },
    columns1: {
      type: Array
    }
  },
  data() {
    return {
      detailObject: {},
      buttonSize: "default",
      modalStata: {
        //模态框信息
        state: false,
        title: ""
      },
      dataTypes: 1,
      modal10: false, //设置模态框开始时不显示
      selectedData: []
    };
  },
  mounted() {
    this.handleResize();
    //			window.onresize=this.handleResize
    window.addEventListener("onresize", this.handleResize, false);
    let Code = document.getElementById("billCode");

    //  		window.onload = function() {
    //				var menu = document.getElementById("billCode");
    //				document.oncontextmenu = function(ev) {
    //					var ev = ev || event;
    //					return false;
    //				}
    //				document.onclick = function(e) {
    //					if (e.target.tagName.toLowerCase() === 'li') {
    //						console.log('您点击的是：' + e.target.outerText);
    //					}
    //				}
    //			}
  },
  on: {
    contextmenu: function(e) {
      e.preventDefault();
    }.bind(this)
  },
  updated() {},
  created() {
    this.dataTypes = this.$parent.formItem.dataType;
    console.log(this.$parent.formItem.dataType);
  },
  methods: {
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
          events.path[0].style.backgroundColor = "rgba(243,143,243,0)";
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
    //跳转到一体化查询
    numClick(row, index) {
      console.log(row, "整行的数据");
      console.log(row.billCode, "当前行的  运单编号");

      //				let routeUrl = this.$router.resolve({
      //					name: 'queryInter',
      //					query:{
      //						bill:row.billCode,
      //						id:row.id
      //					}
      //				});
      //				window.open(routeUrl.href, '_blank');
      //		    	this.$router.push({name:'Integrated'})
    },

    handleResize() {
      this.$nextTick(() => {
        //		        this.tableHight = this.$el.getElementsByClassName('table')[0].clientHeight
      });
    },

    /**
     * 排序函数监听
     */
    sortFun({ column, key, order }) {
      this.$emit("sortFun", key, order);
    },
    //分页中改变页数的按钮方法
    changePageNumber(page) {
      //				console.log(12354545)
      console.log(page, "table");
      this.$emit("handleChangePageNumber", page);
    },
    handleChangePageSize(page) {
      this.$emit("changePageSize", page);
    },

    //全部
    pending() {
      console.log(this.columns1);
      console.log(this.$refs.tableData);
      let w = document.querySelector(".ivu-btn-group").children;
      addClass(w[0], "ivu-btn-primary");
      removeClass(w[1], "ivu-btn-primary");
      //    removeClass(w[2], "ivu-btn-primary");

      this.$emit("handWhole");
    },
    //待催办
    help() {
      let w = document.querySelector(".ivu-btn-group").children;
      addClass(w[1], "ivu-btn-primary");
      removeClass(w[0], "ivu-btn-primary");
      //    removeClass(w[2], "ivu-btn-primary");

      this.$emit("handleCui");
    },
    //已超时
    overTime() {
      //    let w = document.querySelector(".ivu-btn-group").children;
      //    addClass(w[2], "ivu-btn-primary");
      //    removeClass(w[0], "ivu-btn-primary");
      //    removeClass(w[1], "ivu-btn-primary");
      //
      //    this.$emit("handleOvertime");
    },
    //分页中改变页数的按钮方法
    changePage() {},
    //点击查看详情
    show(row, index) {
      this.modalStata.state = true;
      this.modalStata.title = row.billCode + "工单信息";
      let orderId = row.id;
      getIdQueryDetail(orderId).then(res => {
        console.log(res, "查询页的详情");
        if (res && res[0] && res[0].data && res[0].success) {
          this.detailObject = res[0].data;
        }
        if (res && res[1] && res[1].data && res[1].success) {
          this.detailObject.file = res[1].data;
        }
      });

      console.log(row);
      console.log(index);
    },
    //导出数据
    exportData(type) {
      this.datas.forEach(element => {
        element.billCode = "\t" + element.billCode;
      });
      if (type === 1) {
        this.$refs.tableData.exportCsv({
          filename: "被选中的数据",
          columns: this.columns1.filter((col, index) => index > 2),
          data: this.datas.filter((data, index) => {
            index = index > -1;
            let arr1 = this.datas;
            let arr2 = this.selectedData;
            let newArr = [];
            for (let i = 0; i < arr2.length; i++) {
              for (let j = 0; j < arr1.length; j++) {
                if (arr1[j].id === arr2[i].id) {
                  newArr.push(arr1[j]);
                }
              }
            }
            console.log(newArr);
            return newArr, index;
          })
        });
      } else if (type === 2) {
        this.$refs.tableData.exportCsv({
          filename: "全部数据表",
          columns: this.columns1.filter((col, index) => index > 2),
          data: this.datas
        });
      } else if (type === 3) {
        this.$refs.tableData.exportCsv({
          filename: "排序后的数据",
          original: false
        });
      }
    }, //比较对象是否相等的方法
    selects(selection, index) {
      //          	let clus=selection
      //          	this.$store.commit('saveQuerySelected', clus)
      //          	this.selectedData=clus
      //          	console.log(this.$store.state.querySelected)
    },
    //获取选中行
    handleSelectRow(selection, index) {
      console.log(selection, index);
      let clus = this.$refs.tableData.getSelection();
      this.$store.commit("saveQuerySelected", clus);
      this.selectedData = clus;
      console.log(this.$store.state.querySelected);
    },
    //行排序
    drag(a, b) {
      console.log(a, b);
    }
  },

  beforeDestroy() {
    window.removeEventListener("onresize", this.handleResize, false);
  }
};
</script>

<style lang="less" scoped>
.table {
  flex: 1;
  overflow: hidden;
}

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