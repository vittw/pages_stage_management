<template>
	<div class="exam_outerBox">
		<template v-if="contCont && contCont.length != 0">
			<div class="tab-head">
				<p class="exam_title">历史处理记录</p>
				<div class="tab_list">
					<p v-for="(item,index) in contCont" @click="changeTab(index)" :class="{'selected': index == activeIndex}" >{{item.createOn}}</p>
				</div>
			</div>
			<div class="tab-content eB_right">
				<div class="sd" :class="{'show': index == activeIndex}"  v-for="(item,index) in contCont">
					<Form :model="item" label-position="left" :label-width="88">
						<Row :gutter="16">
	            <Col span="8">
								<FormItem label="工单来源">
									<Input v-model="item.dataSource" disabled="disabled"></Input>
								</FormItem>
	            </Col>
							<Col span="16">
								<FormItem label="工单类型">
									<Input v-model="item.dataSource" disabled="disabled"></Input>
								</FormItem>
	            </Col>
	          </Row>

						<Row :gutter="16">
							<Col span="8">
								<FormItem label="工单状态">
									<Input v-model="item.dateState" disabled="disabled"></Input>
								</FormItem>
							</Col>
							<Col span="8">
								<FormItem label="内件物品">
									<Input v-model="item.goodsName" disabled="disabled"></Input>
								</FormItem>
							</Col>
							<Col span="8">
								<FormItem label="内件价值">
									<Input v-model="item.itemValue" disabled="disabled"></Input>
								</FormItem>
							</Col>
						</Row>
						<Row :gutter="16">
							<Col span="24">
								<FormItem label="需求描述">
									<Input v-model="item.reqDescription" disabled="disabled"></Input>
								</FormItem>
							</Col>
						</Row>
						<Row :gutter="16">
							<Col span="24">
								<FormItem label="处理内容">
									<Input v-model="item.processContent" disabled="disabled"></Input>
								</FormItem>
							</Col>
						</Row>

						<Row :gutter="16">
							<Col span="8">
								<FormItem label="被投诉网点">
									<Input v-model="item.becomplainSiteName" disabled="disabled"></Input>
								</FormItem>
							</Col>
							<Col span="8">
								<FormItem label="当前处理人">
									<Input v-model="item.processBy" disabled="disabled"></Input>
								</FormItem>
							</Col>
						</Row>

						<Row :gutter="16">
							<Col span="16">
								<FormItem label="附件说明">
									<Input v-model="item.processBy" disabled="disabled"></Input>
								</FormItem>
							</Col>
						</Row>

						<Row :gutter="16">
							<Col span="8">
								<FormItem label="投诉录入人">
									<Input v-model="item.createBy" disabled="disabled"></Input>
								</FormItem>
							</Col>
							<Col span="8">
								<FormItem label="投诉录入时间">
									<Input v-model="item.createOn" disabled="disabled"></Input>
								</FormItem>
							</Col>
						</Row>

						<Row :gutter="16">
							<Col span="8">
								<FormItem label="投诉方">
									<Input v-model="item.initRole" disabled="disabled"></Input>
								</FormItem>
							</Col>
							<Col span="8">
								<FormItem label="投诉客户电话">
									<Input v-model="item.initPhone" disabled="disabled"></Input>
								</FormItem>
							</Col>
						</Row>

						<Row :gutter="16">
							<Col span="8">
								<FormItem label="收件客户名称">
									<Input v-model="item.receiveName" disabled="disabled"></Input>
								</FormItem>
							</Col>
							<Col span="8">
								<FormItem label="收件客户电话">
									<Input v-model="item.receivePhone" disabled="disabled"></Input>
								</FormItem>
							</Col>
						</Row>

						<Row :gutter="16">
							<Col span="16">
								<FormItem label="收件客户地址">
									<Input v-model="item.receiveAddress" disabled="disabled"></Input>
								</FormItem>
							</Col>
						</Row>
						<Row :gutter="16">
							<Col span="8">
								<FormItem label="发件人">
									<Input v-model="item.sendName" disabled="disabled"></Input>
								</FormItem>
							</Col>
							<Col span="8">
								<FormItem label="发件人联系方式">
									<Input v-model="item.sendPhone" disabled="disabled"></Input>
								</FormItem>
							</Col>
						</Row>
						<Row :gutter="16">
							<Col span="16">
								<FormItem label="发件人地址">
									<Input v-model="item.sendAddress" disabled="disabled"></Input>
								</FormItem>
							</Col>
						</Row>
					</Form>
				</div>
			</div>
		</template>
		<div class="no_data" v-if="contCont && contCont.length == 0">
			暂无数据
		</div>
	</div>
</template>

<script>
	import { Form, FormItem, Select, Option, Input, Sider, Menu, Submenu, MenuItem } from 'iview'
	import { addClass, removeClass } from '@/functions/function.js'
	import { getInfor } from '@/api/callCenter/callCenter.js'
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
			timeArray:{
				type:Array
			},
			billCode: {
	      type: String,
	      default: '',
	    },
			isChange: {
				type: Boolean,
			}
		},
		data() {
			return {
				activeIndex: 0,
				contCont: []
			}
		},
		created(){
			this.getHistoryInfor()
		},
		watch: {
	    isChange(){
	      this.getHistoryInfor()
	    }
	  },
		methods: {
			//获取历史处理记录
			getHistoryInfor(){
				getInfor({
					billCode: this.billCode
				}).then((res)=>{
					this.contCont = res.data
				})
			},
			changeTab(index) {
				this.activeIndex = index
			}
		}
	}
</script>

<style lang="less" scoped>
	.exam_outerBox {
		position: relative;
		width: 100%;
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		height: 200px;
		border: 1px solid #e8eaec;
		.tab-head {
			width:120px;
			height: 100%;
			display: flex;
			justify-content: flex-start;
			align-items: flex-start;
			flex-flow: column nowrap;
			background-color: #F8F8F9;
			.exam_title {
				width: 100%;
				text-align: center;
				color: #000000;
				line-height: 42px;
				height: 42px;
				font-weight: bold;
				font-size: 14px;
				border-bottom: 1px solid #e8eaec;
			}
			.tab_list {
				width: 100%;
				flex: 1;
				overflow-y: auto;
				p {
					height: 46px;
					display: flex;
					font-size: 12px;
					justify-content: center;
					align-items: center;
					color: #333333;
					text-align: center;
					cursor: pointer;
				}
			}
		}
		.tab-content {
			flex: 1;
			height: 100%;
			background-color:#FFFFFF;
			overflow-y: scroll;
		}
		.no_data {
			width: 100px;
			height: 20px;
			text-align: center;
			line-height: 20px;
			position: absolute;
			left: 50%;
			top: 50%;
			margin-top: -10px;
			margin-left: -50px;
		}
	}

	.tab-content .sd {
		padding: 10px;
		display: none;
	}
	.selected {
		background-color: #F1701E;
		color: #ffffff !important;
	}

	.tab-content .show {
		display: block;
	}

	.eB_right {
		padding-top: 10px;
		padding-left: 10px;
		border-left: 1px solid #e8eaec;
	}

	.ivu-form-item {
	  margin-bottom: 12px
	}
</style>
