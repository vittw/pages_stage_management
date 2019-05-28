<template>
  <div class="addWrap" >
    <Form :label-width="110" label-position="left" :model="formData" ref="formData" :rules='validate'>
      <Row :gutter="32">
          <Col span="12">
            <FormItem label="工单来源" prop="dataSourceId">
              <Select placeholder="请选择来源名称" v-model="formData.dataSourceId" :transfer="true">
                <Option v-if="nameList && nameList.length != 0" v-for="item in nameList" :value="item.dataSourceId" :key="item.dataSourceId">{{ item.dataSourceName }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="投诉人角色" prop="initRole">
              <Select v-model="formData.initRole" placeholder="请选择">
                <Option value="0">客户</Option>
                <Option value="1">商家</Option>
              </Select>
            </FormItem>
          </Col>
      </Row>
      <Row :gutter="32">
        <Col span="12">
          <FormItem label="工单类型" prop="typeName">
            <Cascader :data="sourceTypeData" v-model="formData.typeName" placeholder="请选择工单类型" :transfer="true"></Cascader>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="32">
        <Col span="12">
          <FormItem label="是否可编辑回复">
            <RadioGroup v-model="formData.isEditContent">
              <Radio label="是"></Radio>
              <Radio label="否"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
        <Col span="12" v-if="formData.isEditContent=='是'" style="margin-bottom: 16px;display: flex;justify-content: flex-end;">
          <Button icon="md-add" @click="paramsModal.state=!paramsModal.state" >新增</Button>
        </Col>
      </Row>
      <Row :gutter="32">
        <ReplyListTable :replyParams = 'replyParams' @receiveParams="receiveParams" @deleteState="getParams" v-if="formData.isEditContent=='是'"></ReplyListTable>
      </Row>
      <Row :gutter="32">
        <Col span="24">
          <FormItem label="标准回复模板">
            <div style="width: 100%; height: 64px; border: 1px solid #dcdee2;border-radius: 4px;">
              <iframe id="replyTextarea" style="width:100%;height:100%;"></iframe>
            </div>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="32">
          <Col span="12">
            <FormItem label="回复编码">
              <Input v-model="formData.replyCode" placeholder="请输入" clearable/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="备注">
              <Input v-model="formData.remark" placeholder="请输入" clearable/>
            </FormItem>
          </Col>
      </Row>
    </form>
    <!-- 修改 -->
    <Modal
      v-model="paramsModal.state"
      :title="paramsModal.title"
      class-name="vertical-center-modal">
      <Form v-if="paramsModal.state" :label-width="90" label-position="left" :model="paramsFormData" ref="paramsFormData" :rules='paramsValidate'>
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="标签" prop="paramName">
              <Input v-model="paramsFormData.paramName" placeholder="请输入" clearable/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="类型" prop="paramType">
              <Select v-model="paramsFormData.paramType" placeholder="请选择">
                <Option value="0">文本框</Option>
                <Option value="1">时间</Option>
                <Option value="2">下拉框</Option>
                <Option value="3">智能输入框</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32" v-if="paramsFormData.paramType==0 || paramsFormData.paramType==1">
          <Col span="12">
            <FormItem label="是否必填" prop="isRequired">
              <Select v-model="paramsFormData.isRequired" placeholder="请选择">
                <Option value="0">是</Option>
                <Option value="1">否</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="长度">
              <Input v-model="paramsFormData.contentLength" placeholder="请输入" clearable/>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="12" v-if="paramsFormData.paramType==0 || paramsFormData.paramType==1">
            <FormItem label="约束条件" prop="dataSourceId">
              <Input placeholder="请输入" v-model="paramsFormData.restrict" clearable/>
            </FormItem>
          </Col>
          <Col span="12" v-if="paramsFormData.paramType==2">
            <FormItem label="数据来源" prop="dataSourceId">

		          <Select
		          	v-model="paramsFormData.dateSource"
		          	clearable
		          	placeholder="请选择">
		          	<Option v-for="(item,index) in sourceArr" :value="item.name" :key="item.code">{{item.name}}</Option>
		          </Select>
            </FormItem>
          </Col>
          <Col span="12" v-if="paramsFormData.paramType==3">
            <FormItem label="数据来源" prop="dataSourceId">
	            <Select v-model="paramsFormData.dateSource" clearable placeholder="请选择">
		            <Option value="1">网点</Option>
		            <Option value="2">员工</Option>
		          </Select>
	          </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="提示语" >
              <Input placeholder="请输入" v-model="paramsFormData.tips" clearable/>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="paramsModal.state=false">取消</Button>
        <Button type="primary" size="large" @click="addParams()">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getAllType } from '@/api/baseInfo/typeSettings';
import { getReplyConfigParams, addReplyConfigParams, addReplyConfig, editReplyConfig } from '@/api/baseInfo/replySettings';
import { getDictionary } from '@/api/baseInfo/replySettings';
import ReplyListTable from './replyListTable.vue';
import { addClass } from '@/functions/function'

//Range对象兼容性处理
function range (iframeDOM) {
  return iframeDOM.selection ? iframeDOM.selection.createRange() : iframeDOM.getSelection().getRangeAt(0);
}
export default {
  components: {
    ReplyListTable
  },
  props: {
    detailData:{
      type: Object,
      default: function(){
        return {}
      }
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    nameList(){
      return this.$parent.$parent.nameList
    },
    // currentPane(){
    //   return this.$parent.$parent.currentPane
    // },
  },
  data(){
    return {
    	sourceArr:[],
      iframObj: {},
      rangeObj: {},
      replyTextarea: '',
      currentParams: {}, //当前选中行的数据
      selectParams: {},  //已经选中标签对象 -- 不用数组 方便用键值获取
      replyParams:[],    //
      sourceTypeData: [],
      formData:{
        dataSourceId: this.isEdit ? this.detailData.dataSourceId : '',         //工单来源ID
        initRole: this.isEdit ? this.detailData.initRole.toString() : '',              //发件人角色
        typeName: this.isEdit ? [this.detailData.firstCode,this.detailData.secondCode,this.detailData.threeCode] : [],             //工单类型--工单一级类型Code--二级--三级
        isEditContent: this.isEdit ? (this.detailData.initRole==0?'是':'否'): '否'  ,       //是否允许编辑
        replyCode: this.isEdit ? this.detailData.replyCode : '',
        remark: this.isEdit ? this.detailData.remark : ''
      },
      validate: {
        dataSourceId:[
          { required: true, message: '工单来源为空', trigger: 'change' }
        ],
        initRole:[
          { required: true, message: '投诉人角色不能为空', trigger: 'change'},
        ],
        typeName:[
          { required: true, type: 'array', min: 1, message: '工单类型不能为空', trigger: 'change' },
        ],
      },
      paramsModal: {
        state: false,
        title: '新增参数'
      },
      paramsFormData: {
        paramName: '',
        paramType: '',
        isRequired: '',
        dateSource: '',
        contentLength: '',
        tips:'',
        restrict: '',
      },
      paramsValidate: {
        //工单主键id
				paramName:[
					{ required: true, message: '标签不能为空', trigger: 'blur' }
				],
        //参数类型
				paramType:[
          { required: true, message: '参数类型不能为空', trigger: 'change'},
					// { required: true, type: 'array', min: 1, message: '工单来源类型不能为空', trigger: 'blur' },
				],
        //是否必填
				isRequired:[
					{ required: true, message: '请选择是否必填', trigger: 'change' }
				],
      }
    }
  },
  mounted(){
    getAllType().then(res=>{
      if(res && res.success){
        this.sourceTypeData = res.data
      }
    })
    //获取数据字典  (数据来源中的内容)
    getDictionary().then((res)=>{
    	if(res && res.success){
        this.sourceArr=res.data
     	}
		})
    this.getParams() //获取添加的参数
    //初始化回复富文本
    this.iframObj = document.getElementById('replyTextarea');
    this.iframObj.contentDocument.body.setAttribute("contenteditable","true");
    this.iframObj.contentDocument.body.setAttribute("style","font-size: 12px;");
    this.iframObj.contentDocument.body.focus()
    let div = document.createElement('style');
    div.innerHTML =  `div{display:inline-block} .ivu-tag {display: inline-block;height: 22px;line-height: 22px;margin: 0px 4px 0px 4px;padding: 0 4px;border: 1px solid #e8eaec;border-radius: 3px;background: #f7f7f7;font-size: 12px;vertical-align: middle;opacity: 1;overflow: hidden;cursor: pointer;}`;
    this.iframObj.contentDocument.head.appendChild(div);
    //如果是编辑状态 初始化编辑内容
    this.setDefaultContent()


  },
  methods: {
    getParams(){
      getReplyConfigParams().then(res=>{
        if(res && res.success){
          this.replyParams = res.data
        }
      })
    },
    addParams(){
      this.$refs.paramsFormData.validate((valid) => {
        if (valid) {
          addReplyConfigParams({
            paramName: this.paramsFormData.paramName,
            paramType: this.paramsFormData.paramType,
            isRequired: this.paramsFormData.isRequired,
            dateSource: this.paramsFormData.dateSource,
            contentLength: this.paramsFormData.contentLength,
            tips: this.paramsFormData.tips,
            restrict: this.paramsFormData.restrict,
          }).then(res=>{
            if(res && res.success){
              this.getParams()
              this.paramsModal.state = false
              this.$Message.success(res.msg);
            }else{
              this.$Message.error(res.msg);
            }
          });
        } else {
          this.$Message.error('请输入必填项!');
        }
      })
    },
    receiveParams(row){
      this.iframObj.focus()
      this.currentParams = row
      let range = this.iframObj.contentWindow.getSelection().getRangeAt(0);//找到焦点位置
      var div = document.createElement('div');
      div.setAttribute("contenteditable","false");
      div.setAttribute("class","ivu-tag");
      div.innerHTML = `<span class="ivu-tag-text" params-id="${this.currentParams.id}">${this.currentParams.paramName}</span><i class="ivu-icon ivu-icon-ios-close"></i>`;
      range.insertNode(div);//在焦点插入节点
    },
    setDefaultContent(){
      if(!this.isEdit) return false
      this.iframObj.focus()
      let contentStr = ''
      this.detailData.replyContents.forEach(function(item){
        item = JSON.parse(item)
        if(item.stringType==0){
          contentStr += item.name
        }else{
          contentStr += `<div contenteditable="false" class="ivu-tag" style="display: inline-block;height: 22px;line-height: 22px;margin: 0px 4px 0px 4px;padding: 0 4px;border: 1px solid #e8eaec;border-radius: 3px;background: #f7f7f7;font-size: 12px;vertical-align: middle;opacity: 1;overflow: hidden;cursor: pointer;"><span class="ivu-tag-text" params-id="${item.id}">${item.name}</span><i class="ivu-icon ivu-icon-ios-close"></i></div>`
        }
      });
      this.iframObj.contentDocument.body.innerHTML = contentStr
    },
    addReplyTemplate(){
      let domString = this.iframObj.contentDocument.body.innerHTML
      let domArr = domString.replace(/^\s+|\s+$/g,"").split(/<div.*?>(.*?)<\/div>/gi)   //移除空格及分割  str = str.replace(/^\s+|\s+$/g,""); 首位  (/\s+/g,"")
      let filterArr = domArr.filter(function(item){
        return item !=""
      })
      let newArr = filterArr.map(function(item){
        if (item.indexOf("params-id") == -1 ){
          return item
        } else {
        let arr = item.split('params-id')
          return '#' + arr[1].substring(2,18)
        }
      })
      newArr.forEach((v,i,a)=>{ a[i]=v.replace('&nbsp;',' ')})
      return newArr;
    },
    handleSubmitAdd(name){
      this.$refs[name].validate((valid) => {
        if (valid) {
          addReplyConfig({
            dataSourceId: this.formData.dataSourceId,
            initRole: this.formData.initRole == '0'? 0 : 1,
            firstCode: this.formData.typeName[0],
            secondCode: this.formData.typeName[1],
            threeCode: this.formData.typeName[2],
            isEditContent: this.formData.isEditContent == '是' ? 0 : 1,
            replyCode: this.formData.replyCode,
            replyContents: this.addReplyTemplate(),
            remark: this.formData.remark,
          }).then(res=>{
            if(res && res.success){
              this.$emit('isSuccess', true)
              this.$Message.success(res.msg);
            }else{
              this.$Message.error(res.msg);
            }
          });
        } else {
          this.$Message.error('请输入必填项!');
        }
      })
    },
    handleSubmitEdit(name){
      this.$refs[name].validate((valid) => {
        if (valid) {
          editReplyConfig({
            id: this.detailData.id,
            dataSourceId: this.formData.dataSourceId,
            initRole: this.formData.initRole == '0'? 0 : 1,
            firstCode: this.formData.typeName[0],
            secondCode: this.formData.typeName[1],
            threeCode: this.formData.typeName[2],
            isEditContent: this.formData.isEditContent == '是' ? 0 : 1,
            replyCode: this.formData.replyCode,
            replyContents: this.addReplyTemplate(),
            remark: this.formData.remark,
          }).then(res=>{
            if(res && res.success){
              this.$emit('isSuccess', true)
              this.$Message.success(res.msg);
            }else{
              this.$Message.error(res.msg);
            }
          });
        } else {
          this.$Message.error('请输入必填项!');
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.ivu-form-item {
  margin-bottom: 16px
}
.ivu-divider-horizontal {
  margin: 0 0 10px 0;
}

</style>
