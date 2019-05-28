<template>
  <Form :model="formData" ref="formData" :rules="validate">
    <Row :gutter="32">
        <Col span="12">
            <FormItem label="工单来源名称" label-position="top" prop='dataSourceId'>
                <Select v-model="formData.dataSourceId" placeholder="请选择来源名称" clearable disabled>
                  <Option v-if="nameList && nameList.length != 0" v-for="item in nameList" :value="item.dataSourceId" :key="item.dataSourceId">{{ item.dataSourceName }}</Option>
                </Select>
            </FormItem>
        </Col>
        <Col span="12">
            <FormItem label="工单类型" label-position="top" prop='source'>
              <Cascader v-model="formData.source" :data="sourceTypeData"  disabled placeholder="请选择工单类型"></Cascader>
            </FormItem>
        </Col>
    </Row>
    <Row :gutter="32">
      <Col span="32">
          <FormItem :label="defaultOrExoert" label-position="top" prop='user'>
            <Select
              id="querySelect"
              v-model="formData.user"
              multiple
              filterable
              remote
              :remote-method="handleRemote"
              :loading="assignUsers.loading">
              <Option v-for="(option, index) in assignUsers.options" :value="option.Key" :label="option.Value" :key="index"></Option>
            </Select>
          </FormItem>
      </Col>
    </Row>
</Form>
</template>

<script>
import { addSourceData } from '@/api/baseInfo/sourceSettings';
import { getUserByOrganize, editAssignAllot, editAssignExpert } from '@/api/baseInfo/assignSettings';
export default {
  props: {
    editData:{
      type: Object,
      default: function(){
        return {}
      }
    },
    isExpert:{
      type: Boolean,
      default: false
    }
  },
  computed: {
    nameList(){
      return this.$parent.$parent.nameList
    },
    sourceTypeData(){
      return this.$parent.$parent.sourceTypeData
    },
    defaultOrExoert(){
      return this.isExpert ? '专家座席' : '处理人员'
    }
  },
  data () {
    return {
      assignUsers: {
        loading: false,
        options: this.getDefaultOptions()
      },
      formData: {
        dataSourceId: this.editData.dataSourceId,  //工单来源名称
        source: this.editData.typeCode !=''? [this.editData.typeCode, this.editData.secondCode, this.editData.threeCode]: [], //工单来源类型
        user: [],  // 前台验证用  - 只能获取员工id label 获取不到
      },
      validate: {
        //工单来源名称
				dataSourceId:[
					{ required: true, message: '工单来源名称不能为空', trigger: 'blur' }
				],
        //来源类型
				source:[
					{ required: true, type: 'array', min: 1, message: '工单来源不能为空', trigger: 'change' }
				],
        //是否启用
        user:[
					{ required: true, type: 'array', min: 1, message: '处理人员不能为空', trigger: 'change' }
				],
      }
    }
  },
  mounted(){
    let arr = document.getElementById('querySelect').getElementsByClassName('ivu-select-item')
    for (var i = 0 ;i < arr.length; i++){
      arr[i].click()
    }
  },
  methods: {
    handleRemote(query){
      if (query !== '') {
        this.assignUsers.loading = true;
        getUserByOrganize({
          key: query
        }).then(res=>{
          this.assignUsers.loading = false;
          if(res && res.success){
            this.assignUsers.options = res.data
          }else{
            this.assignUsers.options = []
          }
        })
      } else {
        this.assignUsers.options = []
      }
    },
    handleSubmitEdit(name){
      this.$refs[name].validate((valid) => {
        if (valid) {
          if(this.isExpert){
            editAssignExpert({
              dataSourceId: this.formData.dataSourceId,
              typeCode: this.formData.source[0],
              secondCode: this.formData.source[1],
              threeCode: this.formData.source[2],
              expertSeats: this.formData.user.map(item=>{
                return {ExpertSeatsId: item}
              }),
            }).then(res=>{
              if(res && res.success){
                this.$emit('isSuccess', true)
                this.$Message.success(res.msg);
              }else{
                this.$Message.error(res.msg);
              }
            });
          } else {
            editAssignAllot({
              dataSourceId: this.formData.dataSourceId,
              typeCode: this.formData.source[0],
              secondCode: this.formData.source[1],
              threeCode: this.formData.source[2],
              users: this.formData.user.map(item=>{
                return {UserId: item}
              }),
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
    getDefaultOptions(){
      let user = this.editData.userName.split(',')
      let label = this.editData.userId.split(',').map((item, index)=>{
        return {
          Key: item,
          Value: user[index]
        }
      })
      return label
    }
  },
}
</script>

<style lang="less" scoped>
.ivu-radio-group{
  width: 100%
}
</style>
