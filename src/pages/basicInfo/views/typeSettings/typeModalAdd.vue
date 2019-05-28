<template>
    <Form :label-width="130" label-position="left" :rules="thirdValidate" :model="thirdTypeFormData" ref="thirdTypeFormData">
      <Row :gutter="32">
          <Col span="16">
            <FormItem label="工单类型（一级）" prop='firstTypeCode'>
              <Select v-model="thirdTypeFormData.firstTypeCode" placeholder="请选择来源" clearable>
                <Option v-if="firstTypeList && firstTypeList.length != 0" v-for="item in firstTypeList" :value="item.typeCode" :key="item.typeCode">{{ item.typeName }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="4">
              <Button type="dashed" long @click="addFirstModel.state = !addFirstModel.state" icon="md-add"></Button>
          </Col>
      </Row>
      <Row :gutter="32">
          <Col span="16">
            <FormItem label="工单类型（二级）" prop='second'>
              <Select v-model="thirdTypeFormData.secondTypeCode" placeholder="请选择来源" clearable>
                <Option v-if="secondTypeList && firstTypeList.length != 0" v-for="item in secondTypeList" :value="item.typeCode" :key="item.typeCode">{{ item.typeName }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="4">
              <Button type="dashed" long @click="addSecondModel.state = !addSecondModel.state" icon="md-add"></Button>
          </Col>
      </Row>
      <Row :gutter="32">
          <Col span="16">
            <FormItem label="工单类型（三级）" prop='third'>
              <Input v-model="thirdTypeFormData.thirdTypeCode" placeholder="请输入" clearable />
            </FormItem>
          </Col>
      </Row>
      <!-- 新增一级 -->
      <Modal
        v-model="addFirstModel.state"
        :title="addFirstModel.title"
        class-name="vertical-center-modal">
        <Form :label-width="130" label-position="left" :rules="firstValidate" :model="firstTypeFormData" ref="firstTypeFormData">
          <Row :gutter="32">
              <Col span="16">
                <FormItem label="工单类型（一级）" prop='name'>
                  <Input v-model="firstTypeFormData.name" placeholder="请输入" clearable/>
                </FormItem>
              </Col>
          </Row>
        </form>
        <div slot="footer">
          <Button type="text" size="large" @click="addFirstModel.state = !addFirstModel.state">取消</Button>
          <Button type="primary" size="large" @click="handleSubmitFirstModal">确定</Button>
        </div>
      </Modal>
      <!-- 新增二级 -->
      <Modal
        v-model="addSecondModel.state"
        :title="addSecondModel.title"
        class-name="vertical-center-modal">
        <Form :label-width="130" label-position="left" :rules="secondValidate" :model="secondTypeFormData" ref="secondTypeFormData">
          <Row :gutter="32">
              <Col span="16">
                <FormItem label="工单类型（一级）" prop='first'>
                  <Select v-model="secondTypeFormData.first" placeholder="请选择来源" clearable>
                    <Option v-if="firstTypeList && firstTypeList.length != 0" v-for="item in firstTypeList" :value="item.typeCode" :key="item.typeCode">{{ item.typeName }}</Option>
                  </Select>
                </FormItem>
              </Col>
          </Row>
          <Row :gutter="32">
              <Col span="16">
                <FormItem label="工单类型（二级）" prop='name'>
                  <Input v-model="secondTypeFormData.name" placeholder="请输入" clearable />
                </FormItem>
              </Col>
          </Row>
        </form>
        <div slot="footer">
          <Button type="text" size="large" @click="addSecondModel.state = !addSecondModel.state">取消</Button>
          <Button type="primary" size="large" @click="handleSubmitSecondModal">确定</Button>
        </div>
      </Modal>
    </Form>
</template>

<script>
import { getFirstType, getSecondType, getThirdType, addFirstType, addSecondType, addThirdType } from '@/api/baseInfo/typeSettings';
export default {
  data () {
    return {
      firstTypeList: [],
      secondTypeList: [],
      thirdTypeList: [],
      addFirstModel: {
        state: false,
        title: '新增工单类型（一级）'
      },
      addSecondModel: {
        state: false,
        title: '新增工单类型（二级）'
      },
      addfirstTypeCode: '',
      firstTypeFormData: {
        name: '', //添加第一级类型编码
      },
      firstValidate: {
        name:[
					{ required: true, message: '工单类型名称不能为空', trigger: 'blur' }
				],
      },
      secondTypeFormData: {
        first: '',
        name: '', //添加第一级类型编码
      },
      secondValidate: {
        first:[
					{ required: true, message: '工单类型名称不能为空', trigger: 'change' }
				],
        name:[
					{ required: true, message: '工单类型名称不能为空', trigger: 'blur' }
				],
      },
      thirdTypeFormData: {
        firstTypeCode: '',  //第一级类型编码
        secondTypeCode: '', //第二级类型编码
        thirdTypeCode: '', //第三级类型编码
      },
      thirdValidate: {
        firstTypeCode:[
					{ required: true, message: '工单类型名称不能为空', trigger: 'change' }
				],
        secondTypeCode:[
					{ required: true, message: '工单类型名称不能为空', trigger: 'change' }
				],
        thirdTypeCode:[
					{ required: true, message: '工单类型名称不能为空', trigger: 'blur' }
				],
      },
    }
  },
  watch:{
    'thirdTypeFormData.firstTypeCode': {
      deep: true,
      handler: function (newVal,oldVal){
        this.handleGetSecondType()
      }
    }
  },
  mounted(){
    this.handleGetFirstType()
  },
  methods: {
    handleGetFirstType(){
      getFirstType({
      	deletionStateCode:0
      }).then(res=>{
        if(res && res.success){
          this.firstTypeList = res.data
        }
      })
    },
    handleGetSecondType(){
      getSecondType({
        typeCode: this.thirdTypeFormData.firstTypeCode,
        deletionStateCode:0
      }).then(res=>{
        if(res && res.success){
          this.secondTypeList = res.data
        }
      })
    },
    handleSubmitFirstModal(){
      this.$refs.firstTypeFormData.validate((valid) => {
        if (valid) {
          addFirstType({
            typeName: this.firstTypeFormData.name,
          }).then(res=>{
            if(res && res.success){
              this.addFirstModel.state = false
              this.$Message.success(res.msg)
              this.$emit('isSuccess', false)  //提示上级更新成功 需要更新 Grid 和 选择的动态选项
              this.handleGetFirstType()
            }else{
              this.$Message.error(res.msg);
            }
          });
        } else {
          this.$Message.error('请输入必填项!');
        }
      })
    },
    handleSubmitSecondModal(){
      this.$refs.secondTypeFormData.validate((valid) => {
        if (valid) {
          addSecondType({
            typeCode: this.secondTypeFormData.first,
            secondName: this.secondTypeFormData.name
          }).then(res=>{
            if(res && res.success){
              this.addSecondModel.state = false
              this.$Message.success(res.msg)
              this.$emit('isSuccess', false)  //提示上级更新成功 需要更新 Grid 和 选择的动态选项
              this.handleGetSecondType()
            }else{
              this.$Message.error(res.msg);
            }
          });
        } else {
          this.$Message.error('请输入必填项!');
        }
      })
    },
    handleSubmitAdd(name){
      this.$refs[name].validate((valid) => {
        if (valid) {
          addThirdType({
            typeCode: this.thirdTypeFormData.firstTypeCode,
            secondCode: this.thirdTypeFormData.secondTypeCode,
            threeName: this.thirdTypeFormData.thirdTypeCode,
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
