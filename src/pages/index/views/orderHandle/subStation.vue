<template>
	<!--<div class="">-->
	<Form ref="sub" class="subStation" :model="formSubItem" :rules="ruleItem" inline>
		<p class="title">快件信息</p>
		<div class="s_input">
			<FormItem label="运单号" prop="yunNumber">
				<Input v-model="formSubItem.yunNumber"></Input>
			</FormItem>
			<FormItem label="单号类别" prop="orderType">
				<Input v-model="formSubItem.orderType"></Input>
			</FormItem>
			<FormItem label="内件物品" prop="orderPro">
				<Input v-model="formSubItem.orderPro"></Input>
			</FormItem>
		</div>
		
		<p class="title">用户信息</p>
		<div class="s_input">
			<FormItem label="投诉人角色" prop="complain">
				<Select v-model="formSubItem.complain" placeholder="请选择">
	                <Option value="beijing">替消费者发起</Option>
	                <Option value="shanghai">替商家发起</Option>
	            </Select>
			</FormItem>
			<FormItem label="投诉人姓名" prop="complainName">
				<Input v-model="formSubItem.complainName"></Input>
			</FormItem>
			
			<FormItem label="投诉人电话" prop="complainPhone">
				<Input v-model="formSubItem.complainPhone"></Input>
			</FormItem>
		</div>
		
		<p class="title">投诉信息</p>
		<div class="s_input">
			<FormItem label="工单类型（一）" prop="typeOne">
				<Select v-model="formSubItem.typeOne" placeholder="请选择">
	                <Option value="type1">货品丢失</Option>
	                <Option value="type2">服务态度</Option>
	                <Option value="type3">货品破坏</Option>
	                <Option value="type4">信息不符</Option>
	                <Option value="type5">对费用异议</Option>
	                <Option value="type6">非校园件不同意放驿站</Option>
	            </Select>
			</FormItem>
			<FormItem label="工单类型（二）" prop="typeTwo">
				<Select v-model="formSubItem.typeTwo" placeholder="请选择">
	                <Option value="type1">货品丢失</Option>
	                <Option value="type2">服务态度</Option>
	                <Option value="type3">货品破坏</Option>
	                <Option value="type4">信息不符</Option>
	                <Option value="type5">对费用异议</Option>
	                <Option value="type6">非校园件不同意放驿站</Option>
	            </Select>
			</FormItem>
			<FormItem label="支付宝账号" prop="apply">
				<Input v-model="formSubItem.apply"></Input>
			</FormItem>
		</div>
		<p class="title">需求描述（累计输入最大不超过500字）</p>
		<div class="s_input s_desc" style="width: 100%;">
			<FormItem prop="desc">
				<Input v-model="formSubItem.desc" type="textarea" :autosize="{minRows: 4}"></Input>
			</FormItem>
			
		</div>
		
	</Form>
</template>

<script>
	export default{
		components:{},
		props:{
			formSubItem:{
				type:Object,
				default:{
					yunNumber:'',//运单号
					orderType:'',//单号类别
					orderPro:'',//内件物品
					
					complain:'',//投诉人角色
					complainName:'',//投诉人姓名
					complainPhone:'',//投诉人电话
					typeOne:'',//工单类型一
					typeTwo:'',//工单类型二
					apply:'',//支付宝账号
					desc:'',//需求描述
				}
			}
		},
		data(){
			return{
//				formSubItem:{
//					yunNumber:'',//运单号
//					orderType:'',//单号类别
//					orderPro:'',//内件物品
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
				ruleItem:{
					yunNumber:[
						{ required: true, message: '该项不能为空', trigger: 'blur' }
					],
					orderPro:[
						{ required: true, message: '该项不能为空', trigger: 'blur' }
					],
					complain:[
						{ required: true, message: '该项不能为空', trigger: 'blur' }
					],
					complainName:[
						{ required: true, message: '该项不能为空', trigger: 'blur' }
					],
					complainPhone:[
						{ required: true, message: '该项不能为空', trigger: 'blur' }
					],
					typeOne:[
						{ required: true, message: '该项不能为空', trigger: 'blur' }
					],
					typeTwo:[
						{ required: true, message: '该项不能为空', trigger: 'blur' }
					],
					apply:[
						{ required: true, message: '该项不能为空', trigger: 'blur' }
					],
					desc:[
						{ required: true, message: '该项不能为空', trigger: 'blur' }
					]
				}
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