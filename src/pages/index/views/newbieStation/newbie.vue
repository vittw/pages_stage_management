<template>
	<div class="query_outBox">
		<div class="query_header">
			<div class="query_header_left">
				<span class="colorBlock"></span>
				<span>菜鸟驿站</span>
			</div>
			<div class="query_header_right">
				<Button type="primary" @click="handleQuery('newbieItem')">查询</Button>
				<Button style="margin-left: 8px" @click="handleAdd">新增</Button>
			</div>
		</div>
		<!--新增-->
		<NewAdd :state="state"></NewAdd>
		
		<!--下面的主要内容-->
		<div class="query_mainBox">
			<Form class="query_form newbieForm" ref="newbieItem" :model="newbieItem" :rules="ruleValidate">
				<div class="query_mleft">
					<FormItem>
						<Select v-model="newbieItem.yunOrder" placeholder="运单号">
							<Option value="beijing">运单号</Option>
							<Option value="shanghai">工单ID</Option>
						</Select>
						<Input v-model="newbieItem.yunNumber" type="textarea" :autosize="{minRows: 4,maxRows: 10}" placeholder="请输入" />
					</FormItem>
				</div>
				<div class="query_mright">
					<div class="q_mr_part">
						<FormItem label="创建时间">
							<DatePicker v-model="newbieItem.orderFoundtime" type="datetimerange" placeholder="" style="width: 300px"></DatePicker>
						</FormItem>
					</div>
					<div class="q_mr_part">
					
					<FormItem label="工单来源">
						<Select v-model="newbieItem.orderSource" placeholder="请选择" multiple>
							<Option value="source1">来源一</Option>
							<Option value="source2">菜鸟</Option>
							<Option value="source3">拼多多</Option>
						</Select>
					</FormItem>
					
					<FormItem label="网点名称">
						<Input v-model="newbieItem.compintedDot" placeholder="请输入" />
					</FormItem>
					
					</div>
					<div class="q_mr_part">
						<FormItem label="工单状态">
						<Select v-model="newbieItem.orderstate" placeholder="请选择">
							<Option value="state1">全部</Option>
							<Option value="state2">待处理</Option>
							<Option value="state3">未首跟</Option>
							<Option value="state4">等待完结</Option>
							<Option value="state5">已完结</Option>
						</Select>
					</FormItem>
					<FormItem label="工单类型（一）">
						<Select v-model="newbieItem.orderType" placeholder="请选择">
							<Option value="类型一">类型一</Option>
							<Option value="类型二">类型二</Option>
							<Option value="类型三">类型三</Option>
						</Select>
					</FormItem>
					<FormItem label="工单类型（二）">
						<Select v-model="newbieItem.queryType" placeholder="请选择">
							<Option value="query1">全部</Option>
							<Option value="query2">本网点处理</Option>
							<Option value="query3">本网点提交</Option>
							<Option value="query4">提交到本网点</Option>
							<Option value="query5">提交到本网点及承包区</Option>
							<Option value="query6">本网点及承包区提交</Option>
						</Select>
					</FormItem>
					</div>
				</div>
			</Form>
			<div class="queryTable" style="margin-top: 15px;">
				<NewTable ref="childTable"></NewTable>
			</div>

		</div>
	</div>
</template>

<script>
	import { Button, BreadcrumbItem, Breadcrumb, Form, FormItem, Input, Icon } from 'iview';
	import { Select, Option, Upload, Cell, cellGroup, DatePicker, Modal } from 'iview';
	import NewTable from '@/pages/index/views/newbieStation/newTable.vue'
	import NewAdd from './newAdd.vue'
	export default {
		components: {
			Button,BreadcrumbItem,Breadcrumb,Form,FormItem,Input,
			Icon,Select,Option,Upload,Cell,cellGroup,DatePicker,Modal,
			NewTable,NewAdd
		},
		data() {
			return {
				newbieItem: {
					yunOrder: '', //运单号
					yunNumber: '', //输入的单号
					orderSource: '', //工单来源
					orderFoundtime: '', //创建时间
					compintedDot: '', //被投诉网点
					orderType: '', //工单类型
					orderstate: '', //工单状态
					sendTimes: '', //下发次数
					queryType: '', //查询类型

				},
				ruleValidate: {},
				state:false
			}
		},
		methods: {
			//查询按钮
			handleQuery(name) {
				
			},
			//新增按钮
			handleAdd() {
				this.state=!this.state
			}
		},
		mounted(){
			//通过路由传递过来的参数
			console.log(this.$route.query.id,'传过来的参数')
		}
	}
</script>

<style lang="less" scoped>
	@import '../orderQuery/orderQuery.less';
	.q_mr_part{
		margin-bottom: 10px !important;
	}
	.q_mr_part:last-child{
		margin-bottom: 0px !important;
	}
</style>