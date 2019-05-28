<template>
	<Form class="claim" :model="claimItem" :rules="claimRules" inline >
		<FormItem label="类型（一级）" prop="typeOne">
			<Select v-model="claimItem.typeOne" placeholder="请选择">
                <Option value="beijing">替消费者发起</Option>
                <Option value="shanghai">替商家发起</Option>
            </Select>
		</FormItem>
		<FormItem label="类型（二级）" prop="typeTwo">
			<Select v-model="claimItem.typeTwo" placeholder="请选择">
                <Option value="beijing">替消费者发起</Option>
                <Option value="shanghai">替商家发起</Option>
            </Select>
		</FormItem>
		<FormItem label="被投诉方" prop="complaint">
			<Input v-model="claimItem.complaint"></Input>
		</FormItem>
		<FormItem label="被投诉方联系人" prop="compPeople">
			<Input v-model="claimItem.compPeople"></Input>
		</FormItem>
		<FormItem label="被投诉方联系电话" prop="compPhone">
			<Input v-model="claimItem.compPhone"></Input>
		</FormItem>
		<FormItem label="中转模式" prop="transfer">
			<Select v-model="claimItem.transfer" placeholder="请选择">
                <Option value="beijing">替消费者发起</Option>
                <Option value="shanghai">替商家发起</Option>
            </Select>
		</FormItem>
		<FormItem label="目的网点" prop="aimDot">
			<Input v-model="claimItem.aimDot"></Input>
		</FormItem>
		<FormItem label="支付宝账号" prop="alipay">
			<Input v-model="claimItem.alipay"></Input>
		</FormItem>
		<FormItem label="快件内件类型" prop="kuaiType">
			<Input v-model="claimItem.kuaiType"></Input>
		</FormItem>
		<FormItem label="需求描述（累计输入最大不超过500字）">
			<Input v-model="claimItem.demandDes" type="textarea" :autosize="{minRows: 4}"></Input>
		</FormItem>
		<FormItem label="面单附件：【最大1MB，支持.jpg,.png】">
			<!--<Input v-model="claimItem.orderFiles" type="textarea" :autosize="{minRows: 4}"></Input>-->
			<Upload
				ref="orderUpload"
		        multiple
		        
		        :format="['jpg','jpeg','png']"
		        :on-format-error="handleFormatError"
        		:max-size="1024"
		        action="//jsonplaceholder.typicode.com/posts/">
		        <div style="padding: 10px 0px 0px 10px">
		           <!-- <p>拖拽文件至此或者点击这里上传</p>-->
		            <Button icon="ios-cloud-upload-outline">附件上传</Button>
		        </div>
		    </Upload>
		</FormItem>
		<FormItem label="举证附件：【最大1MB，支持.jpg,.png,.rar,.zip,.wav,.mp3】">
			<!--<Input v-model="claimItem.proofFiles" type="textarea" :autosize="{minRows: 4}"></Input>-->
			<Upload
				ref="proofUpload"
		        multiple
		        :format="['jpg','jpeg','png','rar','zip','wav','mp3']"
		        :on-format-error="handleError"
		        :max-size="1024"
		        action="//jsonplaceholder.typicode.com/posts/">
		        <div style="padding: 10px 0px 0px 10px">
		            <!--<p>拖拽文件至此或者点击这里上传</p>-->
		            <Button icon="ios-cloud-upload-outline">附件上传</Button>
		        </div>
		    </Upload>
		</FormItem>
	</Form>
</template>

<script>
	import { Form,FormItem,Input,Tabs,TabPane,Table,Split,Modal,Select,Option,Upload  } from 'iview';
	export default{
		components:{
			Form,FormItem,Input,Tabs,TabPane,Table,Split,Modal,Select,Option,Upload
		},
		props:{
			claimItem:{
				type:Object,
				default:{
					typeOne:'',//类型一
					typeTwo:'',//类型二
					complaint:'',//被投诉方
					compPeople:'',//被投诉方联系人
					compPhone:'',//被投诉方联系电话
					transfer:'',//中转模式
					aimDot:'',//目的网点
					alipay:'',//支付宝账号
					kuaiType:'',//快件内件类型
					
					demandDes:'',//希求描述
					orderFiles:'',//面单附件
					proofFiles:'',//举证附件
				}
			}
		},
		data(){
			return{
//				claimItem:{
//					typeOne:'',//类型一
//					typeTwo:'',//类型二
//					complaint:'',//被投诉方
//					compPeople:'',//被投诉方联系人
//					compPhone:'',//被投诉方联系电话
//					transfer:'',//中转模式
//					aimDot:'',//目的网点
//					alipay:'',//支付宝账号
//					kuaiType:'',//快件内件类型
//					
//					demandDes:'',//希求描述
//					orderFiles:'',//面单附件
//					proofFiles:'',//举证附件
//					
//				},
				claimRules:{
					typeOne:[
						{ required: true, message: '不能为空', trigger: 'blur' },
//                      { type: 'email', message: 'Incorrect email format', trigger: 'blur' }
					],
					typeTwo:[
						{ required: true, message: '不能为空', trigger: 'blur' }
					],
					complaint:[
						{ required: true, message: '不能为空', trigger: 'blur' }
					],
					compPeople:[
						{ required: true, message: '不能为空', trigger: 'blur' }
					],
					compPhone:[
						{ required: true, message: '不能为空', trigger: 'blur' }
					],
					transfer:[
						{ required: true, message: '不能为空', trigger: 'blur' }
					],
					aimDot:[
						{ required: true, message: '不能为空', trigger: 'blur' }
					],
					alipay:[
						{ required: true, message: '不能为空', trigger: 'blur' }
					],
					kuaiType:[
						{ required: true, message: '不能为空', trigger: 'blur' }
					]
				}
			}
		},
		methods:{
			handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件类型错误',
                    desc:'“'+ file.name + '” 的文件格式错误, 请选择文件类型为 jpg或png.'
                });
            },
            handleError(file){
            	this.$Notice.warning({
                    title: '文件格式类型错误',
                    desc:'“'+ file.name + '” 的文件格式错误, 请选择正确的文件格式'
                });
            },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('Success!');
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
		}
	}
</script>

<style lang="less" scoped>
	.title{
		color: #464C5B;
		font-size: 14px;
		font-weight: bold;
	}
</style>