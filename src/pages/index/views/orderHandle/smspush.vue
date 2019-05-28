<template>
	<Form class="subStation" :model="smsItem" inline>
		<p class="title">接收对象</p>
		<CheckboxGroup v-model="social">
	        <Checkbox label="收件人">
	            <span>收件人</span>
	            <Input v-model="smsItem.shoujian"></Input>
	        </Checkbox>
	        <Checkbox label="发件人">
	            <span>发件人</span>
	            <Input v-model="smsItem.fajian"></Input>
	        </Checkbox>
	        <Checkbox label="第三方">
	            <span>第三方</span>
	            <Input v-model="smsItem.third"></Input>
	        </Checkbox>
	    </CheckboxGroup>
		
		<p class="title" style="margin-top: 15px;">短信内容</p>
		<div class="">
			<RadioGroup v-model="huifu" style="width: 100% !important;">
		        <Radio label="标准回复">
		        	<span style="line-height: 40px;">标准回复</span>
		        </Radio>
		        <!--<Collapse v-model="value1">-->
		         <Collapse>
			        <Panel name="1">
			            您的问题我们已在努力处理中，如有疑问可拨打申通总部客服热线95543为您服务，给您带来不便敬请谅解！
			            <div slot="content">
			            	美国发明家、企业家、美国苹果公司联合创办人。
			            </div>
			        </Panel>
		        </Collapse>
		         
		        <Radio label="自定义回复">
		        	<span style="line-height: 40px;">自定义回复（温馨提示：短信内容将直接展示给客户，请慎重对待）</span>
		        </Radio>
		        <Input type="textarea" v-model="smsItem.desc"></Input>
			 </RadioGroup>
		</div>
		<p style="color: red;">（温馨提示：短信内容将直接展示给客户，请慎重对待）</p>
		
	</Form>
</template>

<script>
	export default{
		components:{},
		props:{
			social:{
				type:Array,
				default:[]
			},
			huifu:{
				type:String,
				default:'标准回复'
			},
			smsItem:{
				type:Object,
				default:{
					fajian:'',//发件人
					shoujian:'',//收件人
					third:'',//第三方
					desc:'',//自定义回复
				}
			}
		},
		data(){
			return{
//				social:[],
//				huifu:'标准回复',
//				smsItem:{
//					fajian:'',//发件人
//					shoujian:'',//收件人
//					third:'',//第三方
//					
//					complain:'',//投诉人角色
//					complainName:'',//投诉人姓名
//					complainPhone:'',//投诉人电话
//					typeOne:'',//工单类型一
//					typeTwo:'',//工单类型二
//					apply:'',//支付宝账号
//					desc:'',//需求描述
//					
//				}
			}
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