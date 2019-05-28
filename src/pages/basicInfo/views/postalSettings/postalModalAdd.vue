<template>
  <Form :model="formData" ref="formData" :rules="validate">
    <Row :gutter="32">
        <Col span="12">
          <FormItem label="省份" label-position="top" prop='provinceCode'>
            <Select v-model="formData.provinceCode" placeholder="请选择省份" filterable clearable :label-in-value="true" @on-change="changeProvince">
              <Option v-if="provinceOptions && provinceOptions.length != 0" v-for="item in provinceOptions" :value="item.key" :key="item.key">{{ item.value }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="用户名称" label-position="top" prop='userCode'>
              <Select
                v-model="formData.userCode"
                filterable
                remote
                clearable
                @on-change = "changeRemoteName"
                :label-in-value="true"
                :remote-method="handleRemote"
                :loading="userState.loading">
                <Option v-for="(option, index) in userState.options" :value="option.Key" :key="index">{{option.Value}}</Option>
              </Select>
          </FormItem>
        </Col>
    </Row>
    <Row :gutter="32">
      <Col span="32">
          <FormItem label="备注" label-position="top">
              <Input v-model="formData.remark" placeholder="请输入备注信息" />
          </FormItem>
      </Col>
    </Row>
    <!-- <Row :gutter="32">
      <Col span="12">
        <FormItem label="是否启用" label-position="top" prop='isOpen'>
          <RadioGroup v-model="formData.isOpen">
            <Radio label="启用"></Radio>
            <Radio label="禁用"></Radio>
          </RadioGroup>
        </FormItem>
      </Col>
    </Row> -->
</Form>
</template>

<script>
import { getProvince, addPostalData } from '@/api/baseInfo/postalSettings';
import { getUserByOrganize } from '@/api/baseInfo/assignSettings';
export default {
  data () {
    return {
      userState: {
        loading: false,
        options: []
      },
      provinceOptions: [],
      formData: {
        provinceData: '',   //省份对象 包含Id 和 name
        provinceCode: '',   //省份编号
        userData: '',       //用户对象 包含Id 和 name
        userCode: '',       //用户编号
        remark: '',
      },
      validate: {
				provinceCode:[
					{ required: true, message: '省份不能为空', trigger: 'change' }
				],
				userCode:[
					{ required: true, message: '用户不能为空', trigger: 'change' }
				],
        //是否启用
				// isOpen:[
				// 	{ required: true, message: '运单号不能为空', trigger: 'blur' }
				// ],
      }
    }
  },
  created(){
    getProvince().then(res=>{
      if(res && res.success){
        this.provinceOptions = res.data
      }
    })
  },
  methods: {
    handleSubmitAdd(name){
      this.$refs[name].validate((valid) => {
        if (valid) {
          addPostalData({
            provinceCode: this.formData.provinceData.value,
            province: this.formData.provinceData.label,
            userCode: this.formData.userData.value,
            userName: this.formData.userData.label.split('|')[0],
            remark: this.formData.remark
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
    changeProvince(data){
      this.formData.provinceData = data
    },
    handleRemote(query){
      if (query !== '') {
        this.userState.loading = true;
        getUserByOrganize({
          key: query
        }).then(res=>{
          this.userState.loading = false;
          if(res && res.success){
            this.userState.options = res.data
          }else{
            this.userState.options = []
          }
        })
      } else {
        this.userState.options = []
      }
    },
    changeRemoteName(options){
      this.formData.userData = options
    },
  },
}
</script>

<style lang="less" scoped>
.ivu-radio-group{
  width: 100%
}
</style>
