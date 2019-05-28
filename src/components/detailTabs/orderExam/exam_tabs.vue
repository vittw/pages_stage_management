<template>
	<div class="exam_outerBox">
		<div class="tab-head">
			<p class="exam_title">{{title}}</p>
			<div class="tab_list">
				<p v-if="index===0" v-for="(item,index) in contCont" @click="changeTab(index)" class="lists selected">{{item.createOn}}</p>
				<p v-if="index!=0" v-for="(item,index) in contCont" @click="changeTab(index)" class="lists">{{item.createOn}}</p>
			</div>
		</div>
		<div class="tab-content eB_right">
			
			<div class="sd show" v-if="index===0" v-for="(item,index) in contCont">
				<Form class="examForm" :model="item" inline>
					<!--<FormItem :label="datas.name" v-for="(datas,itt) in item.formExamItem.labelArray">
						<Input v-model="datas.value" disabled="disabled"></Input>
					</FormItem>-->
					<FormItem label="工单来源">
						<Input v-model="item.dataSource" disabled="disabled"></Input>
					</FormItem>
					<FormItem label="工单类型">
						<Input v-model="item.typeCodeDisplay" disabled="disabled"></Input>
					</FormItem>
					<FormItem label="工单状态">
						<Input v-model="item.dataState" disabled="disabled"></Input>
					</FormItem>
					<FormItem label="内件物品">
						<Input v-model="item.goodsName" disabled="disabled"></Input>
					</FormItem>
					<!--<FormItem label="内件价值">
						<Input v-model="item.itemValue" disabled="disabled"></Input>
					</FormItem>-->
					
					<FormItem label="内件价值">
						<Input v-model="item.itemValue" disabled="disabled"></Input>
					</FormItem>
					<FormItem label="需求描述">
						<Input v-model="item.reqDescription" disabled="disabled"></Input>
					</FormItem>
					<FormItem label="处理内容">
						<Input v-model="item.processContent" disabled="disabled"></Input>
					</FormItem>
					<FormItem label="被投诉网点">
						<Input v-model="item.becomplainSiteName" disabled="disabled"></Input>
					</FormItem>
					<FormItem label="当前处理人">
						<Input v-model="item.processBy" disabled="disabled"></Input>
					</FormItem>
					<FormItem label="附件说明">
						<Input disabled="disabled"></Input>
					</FormItem>
					<FormItem label="投诉录入人">
						<Input v-model="item.createBy" disabled="disabled"></Input>
					</FormItem>
					<!-- <FormItem label="投诉录入时间">
						<Input v-model="item.createOn" disabled="disabled"></Input>
					</FormItem> -->
					<FormItem label="投诉方">
						<Input v-model="item.initRole" disabled="disabled"></Input>
					</FormItem>
					<FormItem label="投诉客户电话">
						<Input v-model="item.initPhone" disabled="disabled"></Input>
					</FormItem>
					
					<FormItem label="收件客户名称">
						<Input v-model="item.receiveName" disabled="disabled"></Input>
					</FormItem>
					<FormItem label="收件客户电话">
						<Input v-model="item.receiveMobile" disabled="disabled"></Input>
					</FormItem>
					<FormItem label="收件客户地址">
						<Input v-model="item.receiveAddress" disabled="disabled"></Input>
					</FormItem>
					<FormItem label="发件人">
						<Input v-model="item.sendName" disabled="disabled"></Input>
					</FormItem>
					<FormItem label="发件人联系方式">
						<Input v-model="item.sendMobile" disabled="disabled"></Input>
					</FormItem>
					<FormItem label="发件人地址">
						<Input v-model="item.sendAddress" disabled="disabled"></Input>
					</FormItem>
					
				</Form>
			</div>
			<div class="sd" v-if="index!=0" v-for="(item,index) in contCont">
				<Form class="examForm" :model="item" inline>
					<!--<FormItem :label="datas.name" v-for="(datas,itt) in item.formExamItem.labelArray">
						<Input v-model="datas.value" disabled="disabled"></Input>
					</FormItem>-->
					
					<FormItem label="工单来源">
						<Input v-model="item.dataSource" disabled="disabled"></Input>
					</FormItem>
					<FormItem label="工单类型">
						<Input v-model="item.typeCodeDisplay" disabled="disabled"></Input>
					</FormItem>
					<FormItem label="工单状态">
						<Input v-model="item.dataState" disabled="disabled"></Input>
					</FormItem>
					<FormItem label="内件物品">
						<Input v-model="item.goodsName" disabled="disabled"></Input>
					</FormItem>
					<!--<FormItem label="内件价值">
						<Input v-model="item.itemValue" disabled="disabled"></Input>
					</FormItem>-->
					
					<FormItem label="内件价值">
						<Input v-model="item.itemValue" disabled="disabled"></Input>
					</FormItem>
					<FormItem label="需求描述">
						<Input v-model="item.reqDescription" disabled="disabled"></Input>
					</FormItem>
					<FormItem label="处理内容">
						<Input v-model="item.processContent" disabled="disabled"></Input>
					</FormItem>
					<FormItem label="被投诉网点">
						<Input v-model="item.becomplainSiteName" disabled="disabled"></Input>
					</FormItem>
					<FormItem label="当前处理人">
						<Input v-model="item.processBy" disabled="disabled"></Input>
					</FormItem>
					<FormItem label="附件说明">
						<Input disabled="disabled"></Input>
					</FormItem>
					<FormItem label="投诉录入人">
						<Input v-model="item.createBy" disabled="disabled"></Input>
					</FormItem>
					<!-- <FormItem label="投诉录入时间">
						<Input v-model="item.createOn" disabled="disabled"></Input>
					</FormItem> -->
					<FormItem label="投诉方">
						<Input v-model="item.initRole" disabled="disabled"></Input>
					</FormItem>
					<FormItem label="投诉客户电话">
						<Input v-model="item.initPhone" disabled="disabled"></Input>
					</FormItem>
					
					<FormItem label="收件客户名称">
						<Input v-model="item.receiveName" disabled="disabled"></Input>
					</FormItem>
					<FormItem label="收件客户电话">
						<Input v-model="item.receiveMobile" disabled="disabled"></Input>
					</FormItem>
					<FormItem label="收件客户地址">
						<Input v-model="item.receiveAddress" disabled="disabled"></Input>
					</FormItem>
					<FormItem label="发件人">
						<Input v-model="item.sendName" disabled="disabled"></Input>
					</FormItem>
					<FormItem label="发件人联系方式">
						<Input v-model="item.sendMobile" disabled="disabled"></Input>
					</FormItem>
					<FormItem label="发件人地址">
						<Input v-model="item.sendAddress" disabled="disabled"></Input>
					</FormItem>
				</Form>
			</div>
		</div>
		
		<!--
							{name: '收件客户名称',value: arr[i].receiveName},
							{name: '收件客户电话',value: arr[i].receiveMobile},
							{name: '收件客户地址',value: arr[i].receiveAddress},
							{name: '发件人',value: arr[i].sendName},
							{name: '发件人联系方式',value:arr[i].receivePhone },
							{name: '发件人地址',value: arr[i].receiveAddress}-->
	</div>
</template>

<script>
	import { Form, FormItem, Select, Option, Input, Sider, Menu, Submenu, MenuItem } from 'iview'
	import { addClass, removeClass } from '@/functions/function.js'
	export default {
		components: {
			Form,
			FormItem,
			Select,
			Option,
			Input,
			Sider,
			Menu,
			Submenu,
			MenuItem
		},
		props:{
			title:{
				type:String
			},
			timeArray:{
				type:Array
			},
			contCont:{
				type:Array
			}
		},
		data() {
			return {
//				timeArray: [
//					'2019-03-21 02:22:22', '2019-03-22 02:22:22', '2019-03-24 02:22:22'
//				],
//				contCont: [{
//						formExamItem: {
//							labelArray: [{
//									name: '工单ID',
//									value: 'SWO1235464657'
//								},
//								{
//									name: '工单类型',
//									value: 'SWO1235464657'
//								},
//								{
//									name: '罚款网点',
//									value: ''
//								},
//								{
//									name: '罚款时间',
//									value: ''
//								},
//								{
//									name: '罚款人',
//									value: ''
//								},
//								{
//									name: '被处罚网点',
//									value: ''
//								},
//								{
//									name: '受款网点',
//									value: ''
//								},
//								{
//									name: '处罚金额',
//									value: ''
//								},
//								{
//									name: '受款客户',
//									value: ''
//								},
//								{
//									name: '罚款类型',
//									value: ''
//								},
//								{
//									name: '受款金额',
//									value: ''
//								},
//								{
//									name: '调查经过',
//									value: ''
//								},
//								{
//									name: '发件时间',
//									value: ''
//								},
//								{
//									name: '撤销人',
//									value: ''
//								},
//								{
//									name: '撤销时间',
//									value: ''
//								},
//								{
//									name: '撤销网点',
//									value: ''
//								},
//								{
//									name: '撤销原因',
//									value: ''
//								},
//								{
//									name: '备注',
//									value: ''
//								}
//
//							]
//						}
//					},
//					{
//						formExamItem: {
//							labelArray: [{
//									name: '工单ID',
//									value: 'SWO1235464657'
//								},
//								{
//									name: '工单类型',
//									value: 'SWO1235464657'
//								},
//								{
//									name: '罚款网点',
//									value: ''
//								},
//								{
//									name: '罚款时间',
//									value: ''
//								},
//								{
//									name: '罚款人',
//									value: ''
//								}
//
//							]
//						}
//					},
//					{
//						formExamItem: {
//							labelArray: [{
//									name: '工单ID',
//									value: 'SWO1235464657'
//								},
//								{
//									name: '工单类型',
//									value: 'SWO1235464657'
//								}
//
//							]
//						}
//					}
//				],
			}
		},
		mounted() {
			
			
		},
		methods: {
			getInit(){
				let tabs = document.getElementsByClassName("tab_list")[0].getElementsByTagName('p')
				let w=contents = document.getElementsByClassName('tab-content')[0].getElementsByClassName('sd')
				addClass(tabs[0], 'selected')
				addClass(w[0], 'show')
			},
			changeTab(index) {
				let tabs = document.getElementsByClassName("tab_list")[0].getElementsByTagName('p'),
					contents = document.getElementsByClassName('tab-content')[0].getElementsByClassName('sd');
				for(var i = 0, len = tabs.length; i < len; i++) {
					if(i === index) {
						addClass(tabs[i], 'selected')
						addClass(contents[i], 'show')
					} else {
						removeClass(tabs[i], 'selected')
						removeClass(contents[i], 'show')
					}
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	@import './exam_tabs.less';
	.exam_outerBox {
		position: relative;
		width: 100%;
		
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		.tab-head {
			width:15%;
			display: flex;
			justify-content: flex-start;
			align-items: flex-start;
			flex-direction: column;
			background-color: #F8F8F9;
			.exam_title {
				width: 100%;
				text-align: center;
				color: #515A6E;
				line-height: 42px;
				height: 42px;
				font-weight: bold;
				border-bottom: 1px solid #DCDEE2;
			}
			.tab_list {
				width: 100%;
				height: 100%;
				height: 508px;
				overflow-y: scroll;
				p {
					height: 55px;
					display: flex;
					justify-content: center;
					align-items: center;
					color: #515A6E;
					text-align: center;
					cursor: pointer;
				}
			}
		}
		.tab-content {
			width: 85%;
			background-color:#FFFFFF;
			/*height: 300px;*/
			/*border: solid cornflowerblue 1px;*/
		}
	}
	
	.tab-content .sd {
		padding: 10px;
		display: none;
		position: absolute;
		top: 0;
		left: 15%;
		/*height: 508px;
		overflow-y: scroll;*/
		
	}
	.selected {
		background-color: #CCCCCC;
	}
	
	.tab-content .show {
		display: block;
	}
	
	.eB_right {
		padding-top: 10px;
		width: 85%;
		padding-left: 10px;
		border-left: 1px solid #DCDEE2;
		.examForm {
			display: flex;
			justify-content: flex-start;
			flex-wrap: wrap;
			width: 100%;
			.ivu-form-item {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.ivu-form-item-content {
					width: 150px !important;
				}
			}
		}
	}
</style>