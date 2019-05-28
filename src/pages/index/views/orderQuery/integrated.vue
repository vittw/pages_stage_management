<template>
	<div class="inteBox">
		<div class="inte_inn">
			<div class="inte_header">
				<span class="colorBlock"></span>
				<p>一体化查询</p>
			</div>
			<div class="inte_bot">
				<p class="inte_bot_title">
					<span>1341351456415452125</span>
				</p>
				<div class="inte_bot_main">
					<Collapse v-model="value1">
						<Panel name="1">
							运单信息（1）
							<div slot="content">
								<p class="inte_bot_list"><span class="fist">使用网点：</span><span class="items">3700527075307</span></p>
								<p class="inte_bot_list"><span class="fist">发放网点：</span><span class="items">3700527075307</span></p>
								<p class="inte_bot_list"><span class="fist">发放人：</span><span class="items">3700527075307</span></p>
								<p class="inte_bot_list"><span class="fist">发放日期：</span><span class="items">3700527075307</span></p>
								<p class="inte_bot_list"><span class="fist">发放类型：</span><span class="items">3700527075307</span></p>
								<p class="inte_bot_list"><span class="fist">备注：</span><span class="items">3700527075307</span></p>
							</div>
						</Panel>
						<Panel name="2">
							订单信息（1）
							<div slot="content">
								<p class="inte_bot_list"><span class="fist">运单编号：</span><span class="items">3700527075307</span></p>
								<p class="inte_bot_list"><span class="fist">订单编号：</span><span class="items">3700527075307</span></p>
								<p class="inte_bot_list"><span class="fist">内件品名：</span><span class="items">3700527075307</span></p>
								<p class="inte_bot_list"><span class="fist">寄件客户：</span><span class="items">3700527075307</span></p>
								<p class="inte_bot_list"><span class="fist">寄件人：</span><span class="items">3700527075307</span></p>
								<p class="inte_bot_list"><span class="fist">寄件日期：</span><span class="items">3700527075307</span></p>
								<p class="inte_bot_list"><span class="fist">寄件人电话：</span><span class="items">3700527075307</span></p>
								<p class="inte_bot_list"><span class="fist">寄件网点：</span><span class="items">3700527075307</span></p>
								<p class="inte_bot_list"><span class="fist">寄件省份：</span><span class="items">3700527075307</span></p>
								<p class="inte_bot_list"><span class="fist">寄件城市：</span><span class="items">3700527075307</span></p>
								<p class="inte_bot_list"><span class="fist">寄件地区：</span><span class="items">3700527075307</span></p>
								<p class="inte_bot_list"><span class="fist">寄件地址：</span><span class="items">3700527075307</span></p>
								
								<p class="inte_bot_list"><span class="fist">收件客户：</span><span class="items">3700527075307</span></p>
								<p class="inte_bot_list"><span class="fist">收件人：</span><span class="items">3700527075307</span></p>
								<p class="inte_bot_list"><span class="fist">件日期：</span><span class="items">3700527075307</span></p>
								<p class="inte_bot_list"><span class="fist">收件人座机：</span><span class="items">3700527075307</span></p>
								<p class="inte_bot_list"><span class="fist">收件省份：</span><span class="items">3700527075307</span></p>
								<p class="inte_bot_list"><span class="fist">收件城市：</span><span class="items">3700527075307</span></p>
								<p class="inte_bot_list"><span class="fist">收件地区：</span><span class="items">3700527075307</span></p>
								<p class="inte_bot_list"><span class="fist">收件地址：</span><span class="items">3700527075307</span></p>
							</div>
						</Panel>
						<Panel name="3">
							物流轨迹
							<div slot="content">
								<Table ref="logistTable" :columns="logistColumns" :data="logistData" height='300' border>
									<template slot-scope="{ row, index }" slot="billCode">
										<span>{{billCode}}</span>
									</template>
								</Table>
							</div>
						</Panel>
						<Panel name="4">
							留言信息
							<div slot="content">
								<Table ref="logistTable" :columns="messColumns" :data="messageData" height='300' border>
									<template slot-scope="{ row, index }" slot="billCode">
										<span>{{billCode}}</span>
									</template>
								</Table>
							</div>
						</Panel>
					</Collapse>
					<div class="myLittle" @click="clickDraw">
						<Icon type="ios-list" />
					</div>
					<div class="list_small" id="list_small" v-if="value2">
						<Icon class="close" type="ios-close-circle" @click="close"/>
						<p style="line-height: 30px; padding-left: 10px;" v-for="(items,index) in inteArray">{{items}}</p>
					</div>
				</div>
				
			</div>
			
		</div>
	</div>
</template>

<script>
	import { getTrail,getMessages,getHandleIdData } from '@/api/orderManage/handle.js'
	import { getorderInfor } from '@/api/orderManage/input.js'
	import {addClass,removeClass,formatDateTime,drag } from '@/functions/function.js'
	export default {
		components: {addClass,removeClass,formatDateTime,drag},
		data() {
			return {
				inteArray:['运单信息','订单信息','物流跟踪轨迹','留言信息'],
				value1: '4',
				value2:false,
				billCode:'',//运单编号
				yunInfor:{},//运单信息
				dingInfor:{},//订单信息
				logistData:[],//物流跟踪轨迹
				logistColumns:[
					{
						title:'运单编号',
						key:'billCode',
						width:110,
						slot:'billCode'
					},
					{
						title:'扫描时间',
						key:'scanDate',
						width:130
					},
					{
						title:'扫描网点',
						key:'uploadSiteName',
						width:150
					},
					{
						title:'扫描类型',
						key:'scanType',
						width:80
					},
					{
						title:'跟踪记录',
						key:'memo',
						width:180
					},
					{
						title:'扫描员',
						key:'employeeName',
						width:100
					},
					{
						title:'重量',
						key:'weight',
						width:100
					},
					{
						title:'班次',
						key:'banCi',
						width:100
					},
					{
						title:'包号',
						key:'packageNo',
						width:100
					},
					{
						title:'车签号',
						key:'carSignCode',
						width:100
					},
					{
						title:'其他',
						key:'remark',
						width:150
					},
					{
						title:'上传时间',
						key:'uploadDate',
						width:130
					},
					{
						title:'巴枪ID',
						key:'pdaSn',
						width:120
					}
				],
				messageData:[],//留言信息
				messColumns:[
					{
						title:'操作',
						key:'action',
						width:80
					},
					{
						title:'发起留言附件',
						key:'',
						width:100
					},
					{
						title:'运单号',
						key:'billCode',
						width:100,
						slot:'billCode'
					},
					{
						title:'留言来源',
						key:'',
						width:100
					},
					{
						title:'发起网点名称',
						key:'',
						width:100
					},
					{
						title:'发起用户名',
						key:'',
						width:100
					},
					{
						title:'接收网点名称',
						key:'',
						width:100
					},
					{
						title:'留言创建时间',
						key:'createOn',
						width:130
					},
					{
						title:'留言主题',
						key:'theme',
						width:100
					},
					{
						title:'留言内容',
						key:'describe'
					}
				],
			}
		},
		mounted(){
			console.log(this.$route.query,'点击一体化查询出来的参数')
			this.billCode='3703354235621'
			//  37003354235621
			//根据单号获取订单信息
//			getorderInfor().then((res)=>{
//				billCode:""
//			})
			//获取物流轨迹
			getTrail(
				{billCode:'3703354235621'}
			).then((res)=>{
				console.log(res)
				this.logistData=res.data
			})
			//获取留言信息
			getMessages({
				billCode:'3703354235621'
			}).then((res)=>{
				this.messageData=res.data
				console.log(res,'留言记录')
			})
			//根据ID获取详情
//			getHandleIdData({
//				Id:'SWO19040200000026'
//			}).then((res)=>{
//				console.log(res,'一体化中的详情')
//				
//			})
		},
		methods:{
			clickDraw(){
				this.value2=!this.value2
			},
			close(){
				this.value2=!this.value2
			},
		},
		updated(){
			if(this.value2===true){
				let div2 = document.getElementById("list_small");
				drag(div2)
			}
		},
	}
</script>

<style lang="less" scoped>
	.inteBox{
		background-color: #F5F5F5;
		padding: 10px;
		.inte_header{
			height: 40px;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			color:#515A6E;
			font-size:14px;
			.colorBlock{
				display: inline-block;
				width: 3px;
				height: 15px;
				background-color: #F26E2E;
				margin-right: 20px;
			}
		}
		/*#F26E2E*/
		.inte_bot{
			background-color: #FFFFFF;
			padding: 20px;
			.inte_bot_title{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				margin-bottom: -3px;
				height: 30px;
				span{
					display: inline-block;
					width: 150px;
					color: #657180;
					font-size: 14px;
					font-weight: bold;
					border-bottom: 2px solid #F26E2E;
				}
			}
			.inte_bot_main{
				/*position: relative;*/
				.inte_bot_list{
					height: 32px;
					line-height: 32px;
					padding-left: 10px;
					.fist{
						display: inline-block;
						width: 80px;
						text-align: right;
					}
					.items{
						font-weight: bold;
					}
				}
				.myLittle{
					position: absolute;
					top: 100px;
					right: 40px;
					width: 35px;
					height: 35px;
					border-radius: 50%;
					cursor: pointer;
					display: flex;
					justify-content: center;
					align-items: center;	
					font-size: 30px;	
					border: 1px solid black;
					color: black;		
				}
				.list_small{
					position: absolute;
					width: 200px;
					top: 98px;
					right: 37px;
					border: 1px solid black;
					background-color: #FFFFFF;
					.close{
						position: absolute;
						font-size: 20px;
						top: -10px;
						right: 189px;
					}
				}
				
			}
			.inte_bot_main .inte_bot_list:nth-child(2n){
				background-color: #F5F5F5;
			}
		}
	}
</style>