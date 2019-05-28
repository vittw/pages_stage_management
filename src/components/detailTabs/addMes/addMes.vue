<template>
	<div class="addBox">
		<Form class="formAdd" ref="formItem" :model="formAdd" :rules="ruleInline" inline>
	        <FormItem prop="mseType" label="留言类型">
	            <Select v-model="formAdd.mseType" placeholder="请选择">
	                <Option value="beijing">疑难件</Option>
	                <Option value="shanghai">留仓件</Option>
	                <Option value="keep">备案</Option>
	                <Option value="free">费用问题</Option>
	                <Option value="pei">理赔件</Option>
	                <Option value="serive">服务质量</Option>
	                <Option value="jie">截件</Option>
	                <Option value="gai">改收件信息</Option>
	                <Option value="other">其他</Option>
	            </Select>
	        </FormItem>
	        <FormItem prop="yunNum" label="运单编号">
	            <Input type="text" v-model="formAdd.yunNum" placeholder="Username"></Input>
	        </FormItem>
	        <FormItem label="发起人">
	            <Input type="text" v-model="formAdd.leadPeople" placeholder="Username"></Input>
	        </FormItem>
	        <FormItem label="目标网点" prop="goalDot">
	            <Input type="text" v-model="formAdd.goalDot" placeholder="Username"></Input>
	        </FormItem>
	        <FormItem label="主题" prop="theme">
	            <Input type="text" v-model="formAdd.theme" placeholder="请输入主题，最多50字"></Input>
	        </FormItem>
	        <FormItem label="内容" prop="content">
	            <Input type="textarea" :autosize="{minRows: 2,maxRows: 5}" v-model="formAdd.content" placeholder="请输入主题，最多200字"></Input>
	        </FormItem>
	        <FormItem label="附件">
	            <!--<Input type="text" v-model="formAdd.files" placeholder="Username"></Input>-->
	            <p>【支持.bmp,.jpg,.png,.gif,.rar,.zip,.7-zip,.MP3,.WAV,.xls,.xlsx,.doc,.docx；最多上传3个附件，每个不得大于500KB】</p>
	            <Upload
	            	ref="uploadFiles"
			        multiple
			        :max-size="500"
        			:default-file-list="defaultList"
        			:on-success="handleSuccess"
			        :before-upload="handleBeforeUpload"
			        :on-format-error="handleFormatError"
        			:on-exceeded-size="handleMaxSize"
			        type="drag"
			        action="//jsonplaceholder.typicode.com/posts/">
			        <div style="padding: 10px 0">
			            <!--<Icon type="ios-cloud-upload" size="40" style="color: #3399ff"></Icon>-->
			            <p>点击或拖拽上传</p>
			        </div>
			    </Upload>
	        </FormItem>
	        <div style="margin: 0 auto;">
	        	<Button @click="handleReset('formItem')">取消</Button>
	        	<Button style="margin-left: 8px;" @click="handleSubmit('formItem')">提交</Button>
	        </div>
    	</Form>
	</div>
</template>

<script>
	import { Form, FormItem,Input,Select,Option,Upload,Icon } from 'iview';
	export default{
		components:{
			Form, FormItem,Input,Select,Option,Upload,Icon
		},
		props:{
//			formAdd:{
//				type:Object,
//				default:{
//					mseType:'',//留言类型
//					yunNum:'',//运单编号
//					leadPeople:'',//发起人
//					goalDot:'',//目标网点
//					theme:'',//主题
//					content:'',//内容
//					files:'',//附件
//					uploadList: [],
//				}
//			}
		},
		data(){
			return{
				defaultList: [
                ],
				
				formAdd:{
					mseType:'',//留言类型
					yunNum:'',//运单编号
					leadPeople:'',//发起人
					goalDot:'',//目标网点
					theme:'',//主题
					content:'',//内容
					files:'',//附件
					uploadList: [],
				},
				ruleInline:{
					mseType:[
						{ required: true, message: '留言类型不能为空', trigger: 'blur' }
					],
					yunNum:[
						{ required: true, message: '运单编号不能为空', trigger: 'blur' }
					],
					goalDot:[
						{ required: true, message: '目标网点不能为空', trigger: 'blur' }
					],
					theme:[
						{ required: true, message: '主题不能为空', trigger: 'blur' }
					],
					content:[
						{ required: true, message: '内容不能为空', trigger: 'blur' }
					]
				}
			}
		},
		methods:{
			handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('Success!');
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            handleReset(name){
            	this.$refs[name].resetFields();//清除表单数据
            	this.$refs.uploadFiles.clearFiles();//清除上传文件的数组
            },
            handleSuccess (res, file) {
//              file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
//              file.name = '7eb99afb9d5f317c912f08b5212fd69a';
            },
            handleBeforeUpload () {
                const check = this.formAdd.uploadList.length < 3;
                if (!check) {
                    this.$Notice.warning({
                        title: '最多只能上传3个附件'
                    });
                }
                return check;
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: 'The file format is incorrect',
                    desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
                });
            },
            handleMaxSize (file) {
                this.$Notice.warning({
                    title: 'Exceeding file size limit',
                    desc: 'File  ' + file.name + ' is too large, no more than 2M.'
                });
            },
		},
		mounted () {
            this.formAdd.uploadList = this.$refs.uploadFiles.fileList;
        }
	}
</script>

<style lang="less" scoped="scoped">
	/*@import './addMes.less';*/
	.addBox{
		.formAdd{
			display: flex;
			justify-content: flex-start;
			align-items: flex-start;
			flex-wrap:wrap;
			.ivu-form-item{
				display: flex;
				justify-content: flex-start;
				align-items: flex-start;
				.ivu-form-item-content{
				}
				
			}
		}
	}
</style>