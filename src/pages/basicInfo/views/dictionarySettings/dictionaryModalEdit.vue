<template>
  <!-- :rules="validate" prop='Code'  prop='source' -->
  <Form :model="formData" ref="formData" :rules="validate">
    <Row :gutter="32">
      <Col span="12">
        <FormItem label="父节点">
          <Select v-model="formData.parentId" placeholder="请选择父节点" disabled>
            <Option v-if="parentList && parentList.length != 0" v-for="item in parentList" :value="item.parentId" :key="item.parentId">{{ item.parentName }}</Option>
          </Select>
        </FormItem>
      </Col>
        <Col span="12">
            <FormItem label="字值code" label-position="top" prop='code'>
                <Input v-model="formData.code" placeholder="请输入工单来源名称" />
            </FormItem>
        </Col>
    </Row>
    <Row :gutter="32">
      <Col span="12">
          <FormItem label="字典值" label-position="top" prop='name'>
              <Input v-model="formData.name" placeholder="请输入工单appkey" />
          </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="是否启用" label-position="top" prop='isOpen'>
          <RadioGroup v-model="formData.deletionStateCode">
            <Radio label="启用"></Radio>
            <Radio label="禁用"></Radio>
          </RadioGroup>
        </FormItem>
      </Col>
    </Row>
</Form>
</template>

<script>
import { editDictionary } from '@/api/baseInfo/dictionarySettings';
export default {
  props: {
    editData:{
      type: Object,
      default: function(){
        return {}
      }
    }
  },
  computed: {
    parentList(){
      return this.$parent.$parent.parentList
    },
  },
  data () {
    return {
      formData: {
        id: this.editData.id,
        parentId: this.editData.parentId,
        name: this.editData.name,
        code: this.editData.code,
        deletionStateCode: this.editData.deletionStateCode == 0 ? '启用':'禁用'
      },
      validate: {
				name:[
					{ required: true, message: '字典值不能为空', trigger: 'blur' }
				],
				code:[
					{ required: true, message: '字值code不能为空', trigger: 'blur' }
				],
      }
    }
  },
  methods: {
    handleSubmitEdit(name){
      this.$refs[name].validate((valid) => {
        if (valid) {
          editDictionary({
            id: this.editData.id,
            parentId: this.formData.parentId,
            name: this.formData.name,
            code: this.formData.code,
            deletionStateCode: this.formData.deletionStateCode == '启用' ? 0 : 1
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
