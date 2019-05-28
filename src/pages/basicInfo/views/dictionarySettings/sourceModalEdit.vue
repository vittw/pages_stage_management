<template>
  <Form :model="formData" ref="formData" :rules="validate">
    <Row :gutter="32">
        <Col span="12">
            <FormItem label="工单来源名称" label-position="top" prop='name'>
                <Input v-model="formData.name" placeholder="请输入工单来源名称" />
            </FormItem>
        </Col>
        <Col span="12">
            <FormItem label="来源类型" label-position="top" prop='source'>
                <Select v-model="formData.source" placeholder="请选择来源类型">
                  <Option value="1">内部</Option>
                  <Option value="2">外部</Option>
                </Select>
            </FormItem>
        </Col>
    </Row>
    <Row :gutter="32">
      <Col span="12">
          <FormItem label="appkey" label-position="top">
              <Input v-model="formData.appkey" placeholder="请输入工单appkey" />
          </FormItem>
      </Col>
      <Col span="12">
          <FormItem label="appsecret" label-position="top">
              <Input v-model="formData.appsecret" placeholder="请输入工单appsecret" />
          </FormItem>
      </Col>
    </Row>
    <Row :gutter="32">
      <Col span="12">
        <FormItem label="是否启用" label-position="top" prop='isOpen'>
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
import { editSourceData } from '@/api/baseInfo/sourceSettings';
export default {
  props: {
    editData:{
      type: Object,
      default: function(){
        return {}
      }
    }
  },
  data () {
    return {
      validate: {
        //工单来源名称
				name:[
					{ required: true, message: '工单来源名称不能为空', trigger: 'blur' }
				],
        //来源类型
				source:[
					{ required: true, message: '工单来源类型不能为空', trigger: 'change'}
				],
        //是否启用
				isOpen:[
					{ required: true, message: '运单号不能为空', trigger: 'blur' }
				],
      }
    }
  },
  computed: {
    formData(){
      let data = {};
      data.name = this.editData.dataSourceName
      data.source = this.editData.dataSourceType + ''
      data.appkey = this.editData.appkey ? this.editData.appkey :''
      data.appsecret = this.editData.appsecret ? this.editData.appsecret :''
      data.isOpen = this.editData.deletionStateCode == 0 ? '启用':'禁用'
      return data
    }
  },
  methods: {
    handleSubmitEdit(name){
      this.$refs[name].validate((valid) => {
        if (valid) {
          editSourceData({
            dataSourceId: this.editData.dataSourceId,
            dataSourceName: this.formData.name,
            dataSourceType: this.formData.source,
            appkey: this.formData.appkey,
            appsecret: this.formData.appsecret,
            deletionStateCode: this.formData.isOpen == '启用' ? 0 : 1
          }).then(res=>{
            if(res && res.success){
              this.$emit('isSuccess', true)
              this.$Message.success(res.msg);
            }else{
              this.$emit('isSuccess', true)
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
.ivu-radio-group{
  width: 100%
}
</style>
