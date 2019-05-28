<template>
	<div class="checkBox">
		<Form class="checkInputBox" :model="checkForm" :rules="ruleCheck" label-position="left" :label-width="100" inline>
	        <div class="checkItem">
	        	<FormItem label="ID编号">
		            <Input v-model="checkForm.IDnumber" disabled="disabled"></Input>
		        </FormItem>
	        </div>
	        <div class="checkItem">
	        	<FormItem  label="运单编号">
		            <Input v-model="checkForm.yunNumber" disabled="disabled"></Input>
		        </FormItem>
	        </div>
	        <div class="checkItem">
	        	<FormItem label="处罚网点" prop="punishDot">
		            <Input v-model="checkForm.punishDot"></Input>
		        </FormItem>
	        </div>
	        <div class="checkItem">
	        	<FormItem label="处罚金额" prop="punishMoney">
		            <Input v-model="checkForm.punishMoney"></Input>
		        </FormItem>
	        </div>
	        
	        <div class="checkItem">
	        	<FormItem label="受款网点">
		            <Input v-model="checkForm.receiveDot"></Input>
		        </FormItem>
	        </div>
	        <div class="checkItem">
	        	<FormItem label="受款金额">
		            <Input v-model="checkForm.receiveMoney"></Input>
		        </FormItem>
	        </div>
	        <div class="checkItem">
	        	<FormItem label="受款客户">
		            <Input v-model="checkForm.receiveCustomer"></Input>
		        </FormItem>
	        </div>
	        <div class="checkItem">
	        	<FormItem label="支付宝账号">
		            <Input v-model="checkForm.alipay"></Input>
		        </FormItem>
	        </div>
	        <div class="checkItem">
	        	<FormItem label="是否生成留言">
	        		<Select v-model="checkForm.ifRemark" placeholder="请选择" :on-change="onChange(checkForm.ifRemark)">
						<Option value="yes">是</Option>
						<Option value="no">否</Option>
					</Select>
	        	</FormItem>
	        </div>
	        <div class="checkItem">
	        	<FormItem label="考核类型一" prop="checkTypeOne">
		            <Select v-model="checkForm.checkTypeOne" placeholder="请选择">
						<Option value="类型一">类型一</Option>
						<Option value="类型二">类型二</Option>
					</Select>
		        </FormItem>
	        </div>
	        <div class="checkItem">
	        	<FormItem label="考核类型二" prop="checkTypeTwo">
		            <Select v-model="checkForm.checkTypeTwo" placeholder="请选择">
						<Option value="类型一">类型一</Option>
						<Option value="类型二">类型二</Option>
					</Select>
		        </FormItem>
	        </div>
	        <div class="checkItem">
	        	<FormItem label="考核类型三" prop="checkTypeThree">
		            <Select v-model="checkForm.checkTypeThree" placeholder="请选择">
						<Option value="类型一">类型一</Option>
						<Option value="类型二">类型二</Option>
					</Select>
		        </FormItem>
	        </div>
	        <div class="checkItem">
	        	<FormItem label="考核人电话" prop="checkPhone">
		            <Input v-model="checkForm.checkPhone"></Input>
		        </FormItem>
	        </div>
	        
	        <div class="check_remarek">
	        	<div class="checkItem">
		        	<FormItem label="调查经过（累积输入最大不超过500字）" prop="pass">
			            <Input v-model="checkForm.pass" type="textarea" :autosize="{minRows: 4}"></Input>
			        </FormItem>
		        </div>
		        <div class="checkItem">
		        	<FormItem label="备注：（累积输入最大不超过500字）">
			            <Input v-model="checkForm.remark" type="textarea" :autosize="{minRows: 4}"></Input>
			        </FormItem>
		        </div>
	        </div>
	        <!--上传附件-->
	        <div class="check_upload">
        		<FormItem>
	        		<Upload 
	        			ref="upload"
	        			v-model="checkForm.uploadList"
	        			action="//jsonplaceholder.typicode.com/posts/"
	        			:max-size="500"
	        			:on-success="handleSuccess"
	        			:before-upload="handleBeforeUpload"
	        			>
				        <p style="color: #3399FF;text-decoration: underline;cursor: pointer;">
		        			<Icon type="ios-attach" size="20"/>
		        			上传附件（支持类型：图片、语音压缩包，最多5个附件，单个文件最大500K）
		        		</p>
				    </Upload>
	        	</FormItem>
	        	
	        </div>
	    </Form>
	</div>
</template>

<script>
	export default{
		components:{},
		data(){
			return{
				uploadList:[],
				defaultList: [
                    {
                        'name': 'a42bdcc1178e62b4694c830f028db5c0',
                        'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
                    },
                    {
                        'name': 'bc7521e033abdd1e92222d733590f104',
                        'url': 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
                    }
                ],
				checkForm: {
                    IDnumber:'',//ID编号
                    yunNumber:'',//运单编号
                    punishDot:'',//处罚网点
                    punishMoney:'',//处罚金额
                    receiveDot:'',//受款网点
                    receiveMoney:'',//受款金额
                    alipay:'',//支付宝账号
                    ifRemark:'',//是否生成留言
                    checkTypeOne:'',//考核类型一
                    checkTypeTwo:'',//考核类型二
                    checkTypeThree:'',//考核类型三
                    checkPhone:'',//考核人电话
                    pass:'',//调查经过
                    remark:'',//备注
                    uploadList:[],//上传的文件数组
                },
                ruleCheck:{
                	//处罚网点
                	punishDot:[
                		{ required: true, message: '处罚网点不能为空', trigger: 'blur' }
                	],
                	//处罚金额
                	punishMoney:[
                		{ required: true, message: '处罚金额不能为空', trigger: 'blur' }
                	],
                	//考核类型
                	checkTypeOne:[
                		{ required: true, message: '考核类型不能为空', trigger: 'blur' }
                	],
                	checkTypeTwo:[
                		{ required: true, message: '考核类型不能为空', trigger: 'blur' }
                	],
                	checkTypeThree:[
                		{ required: true, message: '考核类型不能为空', trigger: 'blur' }
                	],
                	//考核人电话
                	checkPhone:[
                		{ required: true, message: '考核人电话不能为空', trigger: 'blur' }
                	],
                	//调查经过
                	pass:[
                		{ required: true, message: '调查经过不能为空', trigger: 'blur' }
                	]
                },
                tableselected:[],//table中选中的参数
                
			}
		},
		mounted(){
			this.checkForm.uploadList = this.$refs.upload.fileList;
		},
		methods:{
			onChange(value){
//				console.log(value)//yes  no
			},
			//文件上传成功的函数
            handleSuccess(res,file){
//          	file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
//              file.name = '7eb99afb9d5f317c912f08b5212fd69a';
//              console.log(this.$refs.upload.fileList)
            },
            //上传之前的判断
            handleBeforeUpload(){
            	const check = this.checkForm.uploadList.length < 5;
                if (!check) {
                    this.$Notice.warning({
                        title: '最多只能上传5个附件'
                    });
                }
                return check;
            },
		},
		watch:{
			
		}
	}
</script>

<style lang="less" scoped>
	
</style>