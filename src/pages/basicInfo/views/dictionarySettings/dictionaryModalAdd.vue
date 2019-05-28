<template>
  <Form :model="formData" ref="formData" :rules="validate">
    <Row :gutter="32">
      <Col span="12">
        <FormItem label="父节点">
          <Select v-model="formData.parentId" placeholder="请选择字典父节点">
            <Option v-if="parentList && parentList.length != 0" v-for="item in parentList" :value="item.parentId" :key="item.parentId">{{ item.parentName }}</Option>
          </Select>
        </FormItem>
      </Col>
        <Col span="12">
            <FormItem label="字值code" label-position="top" prop='code'>
                <Input v-model="formData.code" placeholder="请输入字典值Code" />
            </FormItem>
        </Col>
    </Row>
    <Row :gutter="32">
      <Col span="12">
          <FormItem label="字典值" label-position="top" prop='name'>
              <Input v-model="formData.name" placeholder="请输入字典值" />
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
import { addDictionary } from '@/api/baseInfo/dictionarySettings';
export default {
  computed: {
    parentList(){
      return this.$parent.$parent.parentList

    }
  },
  data () {
    return {
      formData: {
        parentId: '',
        name: '',
        code: '',
      },
      validate: {
				name:[
					{ required: true, message: '字典值不能为空', trigger: 'blur' }
				],
				code:[
					{ required: true, message: '字典值code不能为空', trigger: 'blur' }
				],
      }
    }
  },
  methods: {
    handleSubmitAdd(name){
      this.$refs[name].validate((valid) => {
        if (valid) {
          addDictionary({
            parentId: this.formData.parentId,
            name: this.formData.name,
            code: this.formData.code
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
