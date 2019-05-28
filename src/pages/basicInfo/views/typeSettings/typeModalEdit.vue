<template>
  <Form :model="formData" ref="formData" :rules="validate" :label-width="80" label-position="left">
    <Row :gutter="20" style="margin-bottom: 24px">
      <Col span="4">
        <span>选择修改的工单类型:</span>
      </Col>
      <Col span="18">
        <RadioGroup v-model="formData.typeLevel">
          <Radio label="first">工单类型（一级）</Radio>
          <Radio label="second">工单类型（二级）</Radio>
          <Radio label="third">工单类型（三级）</Radio>
        </RadioGroup>
      </Col>
    </Row>
    <Row :gutter="32">
      <Col span="9" offset="4">
        <FormItem label="工单类型（一级）" label-position="top" prop='firstTypeCode'>
          <Select v-model="formData.firstTypeCode" placeholder="请选择来源">
            <Option v-if="firstTypeList && firstTypeList.length != 0" v-for="item in firstTypeList" :value="item.typeCode" :key="item.typeCode">{{ item.typeName }}</Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="9" v-if="formData.typeLevel == 'first'">
        <FormItem label="更改为" prop='firstNewName'>
          <Input v-model="formData.firstNewName" placeholder="请输入修改类型名称" />
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="32" v-if="formData.typeLevel == 'second'  || formData.typeLevel == 'third'">
      <Col span="9" offset="4">
        <FormItem label="工单类型（二级）" label-position="top" prop='secondTypeCode'>
          <Select v-model="formData.secondTypeCode" placeholder="请选择来源">
            <Option v-if="secondTypeList && secondTypeList.length != 0" v-for="item in secondTypeList" :value="item.typeCode" :key="item.typeCode">{{ item.typeName }}</Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="9" v-if="formData.typeLevel == 'second'">
        <FormItem label="更改为" prop='secondNewName'>
          <Input v-model="formData.secondNewName" placeholder="请输入修改类型名称" />
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="32" v-if="formData.typeLevel == 'third'">
      <Col span="9" offset="4">
        <FormItem label="工单类型（三级）" prop='thirdTypeCode'>
          <Select v-model="formData.thirdTypeCode" placeholder="请选择来源">
            <Option v-if="thirdTypeList && thirdTypeList.length != 0" v-for="item in thirdTypeList" :value="item.typeCode" :key="item.typeCode">{{ item.typeName }}</Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="9">
        <FormItem label="更改为" prop='thirdNewName'>
          <Input v-model="formData.thirdNewName" placeholder="请输入修改类型名称" />
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="32">
      <Col span="9" offset="4">
        <FormItem label="是否启用" prop='isOpen'>
          <RadioGroup v-model="formData.isOpen">
            <Radio label="启用"></Radio>
            <Radio label="禁用"></Radio>
          </RadioGroup>
        </FormItem>
      </Col>
    </Row>
</Form>
</template>

<script>
import { getFirstType, getSecondType, getThirdType, editFirstType, editSecondType, editThirdType } from '@/api/baseInfo/typeSettings';
export default {
  data () {
    return {
      firstTypeList: [],
      secondTypeList: [],
      thirdTypeList: [],
      formData: {
        typeLevel: 'first',
        firstTypeCode: '',
        secondTypeCode: '',
        thirdTypeCode: '',
        firstNewName: '',
        secondNewName: '',
        thirdNewName: '',
        isOpen: '启用'
      },
      validate: {
        //一级工单类型
				firstTypeCode:[
					{ required: true, message: '请选择工单类型', trigger: 'change' }
				],
        //一级修改名称
				firstNewName:[
					{ required: true, message: '修改名称不能为空', trigger: 'blur' }
				],
        //二级工单类型
				secondTypeCode:[
					{ required: true, message: '请选择工单类型', trigger: 'change'}
				],
        //二级修改名称
				secondNewName:[
					{ required: true, message: '修改名称不能为空', trigger: 'blur' }
				],
        //三级工单类型
        thirdTypeCode:[
					{ required: true, message: '请选择工单类型', trigger: 'change'}
				],
        //三级修改名称
				thirdNewName:[
					{ required: true, message: '修改名称不能为空', trigger: 'blur' }
				],
        //是否启用
				isOpen:[
					{ required: true, message: '运单号不能为空', trigger: 'blur' }
				],
      }
    }
  },
  watch:{
    'formData.typeLevel': {
      deep: true,
      handler: function (newVal,oldVal){
        this.formData.firstTypeCode =  ''
        this.formData.secondTypeCode = ''
        this.formData.thirdTypeCode = ''
        this.formData.firstNewName = ''
        this.formData.secondNewName = ''
        this.formData.thirdNewName = ''
        if(newVal=='first'){
          this.handleGetFirstType(-1)
        } else {
          this.handleGetFirstType(0)
        }
      }
    },
    'formData.firstTypeCode': {
      deep: true,
      handler: function (newVal,oldVal){
        if(newVal!=''){
          this.firstTypeList.map((item)=>{
            if(item.typeCode==this.formData.firstTypeCode){
              this.formData.firstNewName = item.typeName
            }
          })
          this.formData.secondNewName = ''
          this.formData.thirdNewName = ''
          if(this.formData.typeLevel=='second'){
            this.handleGetSecondType(-1)
          }else if (this.formData.typeLevel=='third') {
            this.handleGetSecondType(0)
          }
        }
      }
    },
    'formData.secondTypeCode': {
      deep: true,
      handler: function (newVal,oldVal){
        if(newVal!=''){
          this.secondTypeList.map((item)=>{
            if(item.typeCode==this.formData.secondTypeCode){
              this.formData.secondNewName = item.typeName
            }
          })
          this.formData.thirdNewName = ''
          if(this.formData.typeLevel=='third'){
            this.handleGetThirdType(-1)
          }
        }
      }
    },
    'formData.thirdTypeCode': {
      deep: true,
      handler: function (newVal,oldVal){
        if(newVal!=''){
          this.thirdTypeList.map((item)=>{
            if(item.typeCode==this.formData.thirdTypeCode){
              this.formData.thirdNewName = item.typeName
            }
          })
          // this.handleGetThirdType()
        }
      }
    },
  },
  mounted(){
    this.handleGetFirstType(-1)
  },
  methods: {
    handleGetFirstType(index){
      getFirstType({
      	deletionStateCode:index
      }).then(res=>{
        if(res && res.success){
          this.firstTypeList = res.data
        }
      })
    },
    handleGetSecondType(index){
      getSecondType({
        typeCode: this.formData.firstTypeCode,
        deletionStateCode:index
      }).then(res=>{
        if(res && res.success){
          this.secondTypeList = res.data
        }
      })
    },
    handleGetThirdType(index){
      getThirdType({
        secondCode: this.formData.secondTypeCode,
        deletionStateCode:index
      }).then(res=>{
        if(res && res.success){
          this.thirdTypeList = res.data
        }
      })
    },
    handleSubmitEdit(name){
      this.$refs[name].validate((valid) => {
        if (valid) {
          if(this.formData.typeLevel == 'first'){
            editFirstType({
              typeCode: this.formData.firstTypeCode,
              typeName: this.formData.firstNewName,
              deletionStateCode: this.formData.isOpen == '启用' ? 0 : 1
            }).then(res=>{
              if(res && res.success){
                this.$emit('isSuccess', true)
                this.$Message.success(res.msg);
              }else{
                this.$Message.error(res.msg);
              }
            });
          } else if (this.formData.typeLevel == 'second'){
            editSecondType({
              typeCode: this.formData.firstTypeCode,
              secondCode: this.formData.secondTypeCode,
              secondName: this.formData.secondNewName,
              deletionStateCode: this.formData.isOpen == '启用' ? 0 : 1
            }).then(res=>{
              if(res && res.success){
                this.$emit('isSuccess', true)
                this.$Message.success(res.msg);
              }else{
                this.$Message.error(res.msg);
              }
            });
          } else {
            editThirdType({
              secondCode: this.formData.secondTypeCode,
              threeCode: this.formData.thirdTypeCode,
              threeName: this.formData.thirdNewName,
              deletionStateCode: this.formData.isOpen == '启用' ? 0 : 1
            }).then(res=>{
              if(res && res.success){
                this.$emit('isSuccess', true)
                this.$Message.success(res.msg);
              }else{
                this.$Message.error(res.msg);
              }
            });
          }
        } else {
          this.$Message.error('请输入必填项!');
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.ivu-radio-group{
  width: 100%
}
.ivu-radio-wrapper {
  margin-right: 40px;
}
</style>
