<template>
  <Form class="mr_form">
    <div class="mr_ft">
      <FormItem label="需求描述" class="desc">
        <Input type="textarea" :rows="5"  v-model="rightArray.reqDescription" disabled="disabled"></Input>
      </FormItem>
	  <FormItem label="备注：" class="desc">
        <Input type="textarea" :rows="4"  v-model="rightArray.remark" disabled="disabled"></Input>
      </FormItem>

      <FormItem label="附件" v-if="rightArray.file && rightArray.file.length>0" style="width: 100% !important;" class="desc">
        <myShowFile :myFileData="rightArray.file"></myShowFile>
      </FormItem>
    </div>
    <div class="mr_fb">
      <FormItem label="处理回复(累计不超过500字)" class="reply">
		    <Button type="primary" @click="handleFinish" style="float: right;margin-top: -35px;">处理完成</Button>
        <Input
          type="textarea"
          :maxlength="max"
          v-model="handleMess"
          :autosize="{minRows: 4,maxRows: 6}"
          @on-keyup="requireTotal()"
        ></Input>
        <span class="inputTotal">
          已输入：
          <span>{{tot1}}</span>
          <span>/{{max}}</span>
        </span>
      </FormItem>
      <!--标准回复-->
      <div class v-if="showType===1">
        <Collapse v-model="value1">
          <Panel name="1">
            至客户
            <div class="mybox" slot="content" v-for="(item,index) in replyArr" :key="index">
              <div class="little" v-for="(secItem,inds) in item.replies" :key="inds">
                <p v-if="secItem.isEdit===0">{{secItem.replyContent}}</p>
                <!--文本输入框-->
                <Input
                  v-model="secItem.value"
                  v-if="secItem.isEdit===1&&secItem.param.paramType==='0'"
                  :placeholder="secItem.param.paramName"
                  style="width:150px"
                ></Input>
                <!--时间选择框-->
                <DatePicker
                  v-model="secItem.value"
                  v-if="secItem.isEdit===1&&secItem.param.paramType==='1'"
                  type="datetime"
                  :placeholder="secItem.param.paramName"
                  style="width: 150px"
                ></DatePicker>
                <!--下拉框-->
                <Select
                  v-model="secItem.value"
                  v-if="secItem.isEdit===1&&secItem.param.paramType==='2'"
                  :placeholder="secItem.param.paramName"
                  label-in-value
                  style="width:150px"
                >
                  <Option
                    v-for="(datas,its) in secItem.param.dateSourceDictionary"
                    :value="datas.name"
                    :lable="datas.code"
                    :key="its"
                  >{{datas.name}}</Option>
                </Select>

                <!--智能搜索-->
                <div
                  class="smartSearch p2"
                  v-if="secItem.isEdit===1&&secItem.param.paramType==='3'"
                  style="position: relative;width: 150px;"
                >
                  <!--搜索网点-->
                  <Select
                    v-if="secItem.param.dateSource==='1'"
                    v-model="secItem.value"
                    filterable
                    clearable
                    label-in-value
                    remote
                    :remote-method="smartSearch1"
                  >
                    <Option
                      v-for="item in dotList"
                      :value="item.Value"
                      :key="item.Key"
                    >{{ item.Value }}</Option>
                  </Select>
                  <Select
                    v-if="secItem.param.dateSource==='2'"
                    v-model="secItem.value"
                    filterable
                    clearable
                    label-in-value
                    remote
                    :remote-method="smartSearch2"
                  >
                    <Option
                      v-for="item in dotList"
                      :value="item.Value"
                      :key="item.Key"
                    >{{ item.Value }}</Option>
                  </Select>
                </div>
              </div>
              <span class="myBtn" @click="myReply(item,index)">选择</span>
            </div>
          </Panel>
        </Collapse>
        <Input
          type="textarea"
          disabled
          :maxlength="max"
          v-model="handleReply"
          :autosize="{minRows: 4,maxRows: 6}"
          style="margin-top: 10px;"
        ></Input>
      </div>
      <!--附件上传-->
      <div class="agingUpfile">
        <myUploadFiles ref="uploadFiles" :defaultList="defaultList"></myUploadFiles>
      </div>

    </div>
  </Form>
</template>

<script>
import { getAllTypes, getAllSite } from "@/api/orderManage/input.js";
import {
  getReply,
  getBasicInfor,
  getBasicInfor2
} from "@/api/orderManage/handle.js";
import { formatDateTime } from "@/functions/function.js";
import myUploadFiles from "@/components/uploadFile/upload2";
import myShowFile from '../orderQuery/showFile';
export default {
  components: { myUploadFiles, myShowFile},
  props: {
    rightArray: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      max: 500,
      tot1: 0,
      uploadList: [],
      selects: "",
      firstMess: "",
      handleMess: "", //处理回复的内容
      orderType: {
        submitorderData: []
      },
      //被投诉网点
      comp: {
        compintedDot: "",
        comData: [],
        beComplainsiteCode: ""
      },
      //录入扫描网点
      inputScanData: [],
      inputScan: "",
      inputCode: "",
      dropState: false,
      secondArray: {},
      //标准回复中的相关
      value1: "0",
      smartData: [],

      showType: 0,
      replyArr: [],
      smartLoading: false,

      handleReply: "",
      searchType: 0,
      dropArr: [],
      dotList: [],
      defaultList: [],

      videoModal: false, //视频播放的模态框
      musicModal: false
    };
  },
  mounted() {
    //          this.uploadList = this.$refs.upload.fileList;
    let self = this;
    setTimeout(function() {
      self.secondArray = self.$parent.firstArray;
      //工单标准回复
      getReply({
        dataSourceId: self.secondArray.dataSourceId,
        threeTypeCode: self.secondArray.threeTypeCode
        //					dataSourceId: 'afe363dc85ae589b',
        //					threeTypeCode: '9f0f1acb0955ecef'
      }).then(res => {
        if (res && res.success) {
          if (res.data != null && res.data.length != 0) {
            self.showType = 1;
            self.replyArr = res.data;
          }
        }
      });
    }, 1000);
  },
  created() {},
  watch: {},
  methods: {
    videoClick() {
      this.videoModal = true;
    },
    musicClick() {
      this.musicModal = true;
    },
    imgClick(value) {
      console.log(value);
      window.open(value, "_blank");
    },
    //标准回复中智能搜索中的搜索
    smartSearch1(value) {
      getAllSite({
        key: value
      }).then(res => {
        if (res && res.success) {
          this.dotList = res.data;
        } else {
          this.dotList = [];
        }
      });
    },
    smartSearch2(value) {
      //获取员工的基础信息
      getBasicInfor2({
        key: value
      }).then(res => {
        if (res && res.success) {
          this.dotList = res.data;
        } else {
          this.dotList = [];
        }
      });
    },
    handleBeforeUpload() {
      const check = this.uploadList.length < 5;
      if (!check) {
        this.$Notice.warning({
          title: "Up to five pictures can be uploaded."
        });
      }
      return check;
    },
    //标准回复中的点击事件
    myReply(secItem, inds) {
      this.handleReply = "";
      let arr1 = "";
      let arr = secItem.replies;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].param != null && arr[i].param.length != 0) {
          if (arr[i].value != "" && arr[i].value != undefined) {
            if (arr[i].param.paramType === "1") {
              arr[i].value = formatDateTime(arr[i].value);
            }
            arr1 = arr1 + arr[i].value + "";
          }
        } else {
          arr1 = arr1 + arr[i].replyContent + "";
        }
      }
      this.handleReply = arr1 + this.handleReply;
    },
    //处理完成
    handleFinish() {
      let par = {
        type: this.showType,
        handleCont: this.handleMess,
        reply: this.handleReply,
        files: this.defaultList
      };
      this.$emit("handleFinish", par);
    },
    //工单类型改变
    handleChange(value, selectedData) {
      this.rightArray.isDelay = selectedData[2].__label;
      //				console.log(this.rightArray.isDelay)
      //				console.log(selectedData)
      //          	this.formHandleItem.submitorderStyle=selectedData[2].__label
      //          	//菜鸟 / 菜鸟111 / 菜鸟111
      //          	//9a7fd91a43dbc667,6baa678bd8034677,6baa678bd8034677
      //          	let code=selectedData[2].__value.split(",")
      //          	let values=selectedData[2].__label.split("/")
      //          	this.params.FirstTypeCode=code[0]//一级类型编码
      //				this.params.SecondTypeCode=code[1]
      //				this.params.ThreeTypeCode=code[2]
    },
    requireTotal() {
      let value = this.handleMess;
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
    }
  }
};
</script>

<style lang="less" scoped>
.mr_form {
  flex: 1;
  overflow: auto;
  /*height: 836px;*/
}

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

.up_list {
  padding: 10px 0px 0px 10px;
  color: #0b9afc;
  text-decoration: underline;
  cursor: pointer;
  i {
    transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    /* IE 9 */
    -moz-transform: rotate(45deg);
    /* Firefox */
    -webkit-transform: rotate(45deg);
    /* Safari 和 Chrome */
    -o-transform: rotate(45deg);
  }
}

.imgBox {
  border: 1px solid #dcdee2;
  border-radius: 4px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  padding: 5px;
  width: 100%;
  .imgItem {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    margin-right: 5px;
    .list_left {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .list_img {
        cursor: pointer;
        display: inline-block;
        width: 80px;
        height: 80px;
        padding: 5px;
        border: 1px solid #dcdee2;
        border-radius: 3px;
        img {
          display: inline-block;
          width: 100%;
          height: 80%;
        }
      }
      .list_name {
        display: inline-block;
        height: 30px;
        line-height: 20px;
        text-align: center;
      }
    }
  }
}

.ivu-collapse-content-box {
  height: 300px;
  flex: 1;
  overflow: auto;
}

.mybox {
  padding: 10px;
  border: 1px solid #dcdee2;
  border-radius: 3px;
  margin-bottom: 5px;
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  overflow: auto;
  .little {
    /*float: left;*/
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    margin-right: 15px;
    margin-bottom: 15px;
  }
  .myBtn {
    display: inline-block;
    width: 40px;
    text-align: center;
    /*border: 1px solid #E8E8E8;*/
    border-radius: 3px;
    line-height: 20px;
    background-color: #fe7621;
    color: #ffffff;
  }
}
.smartSearch {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>