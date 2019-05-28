<template>
  <Form :model="formData" ref="formData" :rules="validate">
    <Row :gutter="32">
        <Col span="12">
            <FormItem label="工单来源名称" label-position="top" prop='name'>
                <Input v-model="formData.name" clearable placeholder="请输入工单来源名称" />
            </FormItem>
        </Col>
        <Col span="12">
            <FormItem label="来源类型" label-position="top" prop='source'>
                <Select v-model="formData.source" clearable placeholder="请选择来源类型">
                  <Option value="1">内部</Option>
                  <Option value="2">外部</Option>
                </Select>
            </FormItem>
        </Col>
    </Row>
    <Row :gutter="32">
      <Col span="12">
          <FormItem label="appkey" label-position="top">
              <Input v-model="formData.appkey" clearable placeholder="请输入工单appkey" />
          </FormItem>
      </Col>
      <Col span="12">
          <FormItem label="appsecret" label-position="top">
              <Input v-model="formData.appsecret" clearable placeholder="请输入工单appsecret" />
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
import { addSourceData } from '@/api/baseInfo/sourceSettings';
export default {
  data () {
    return {
      formData: {
        name: '',  //工单来源名称
        source: '', //工单来源类型
        appkey: '', //appkey
        appsecret: '', //appsecret
        isOpen: '启用',  //是否启用
      },
      validate: {
        //工单来源名称
				name:[
					{ required: true, message: '工单来源名称不能为空', trigger: 'blur' }
				],
        //来源类型
				source:[
					{ required: true, message: '工单来源类型不能为空', trigger: 'blur' }
				],
        //是否启用
				isOpen:[
					{ required: true, message: '运单号不能为空', trigger: 'blur' }
				],
      }
    }
  },
  methods: {
    handleSubmitAdd(name){
      this.$refs[name].validate((valid) => {
        if (valid) {
          addSourceData({
            dataSourceName: this.formData.name,
            dataSourceType: this.formData.source,
            appkey: this.formData.appkey,
            appsecret: this.formData.appsecret,
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
.ivu-radio-group{
  width: 100%
}
</style>
