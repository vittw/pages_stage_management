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
								<p class="inte_bot_list" v-for="(item,indexs) in yunArray" :key="indexs">{{item.name}}:{{item.value}}</p>
							</div>
						</Panel>
						<Panel name="2">订单信息（1）</Panel>
						<Panel name="3">物流轨迹</Panel>
						<Panel name="4">留言信息</Panel>
					</Collapse>
					<div class="myLittle" @click="clickDraw">
						<Icon type="ios-list" />
					</div>
					<div class="list_small" id="list_small" v-if="value2">
						<Icon class="close" type="ios-close-circle" @click="close"/>
						<p style="line-height: 30px; padding-left: 10px;" v-for="(items,index) in inteArray">{{items.title}}</p>
					</div>
				</div>
				
			</div>
			
		</div>
	</div>
</template>

<script>
	import { getTrail,getMessages,getHandleIdData } from '@/api/orderManage/handle.js'
	import { getorderInfor } from '@/api/orderManage/input.js'
	import { Collapse, Panel,Drawer } from 'iview'
	import {addClass,removeClass,formatDateTime,drag } from '@/functions/function.js'
	export default {
		components: {
			Collapse,Panel,Drawer,addClass,removeClass,formatDateTime,drag
		},
		data() {
			return {
				value1: '1',
				value2:false,
				yunArray:[
					{
						name:'使用网点',
						value:'上海'
					},
					{
						name:'发放网点',
						value:'上海'
					},
					{
						name:'发放人',
						value:'上海'
					},
					{
						name:'发放日期',
						value:'上海'
					},
					{
						name:'发放类型',
						value:'上海'
					},
					{
						name:'备注',
						value:'时代峻峰环境和'
					}
				]
			}
		},
		mounted(){
			console.log(this.$route.query,'点击一体化查询出来的参数')
			//  37003354235621
			//根据单号获取订单信息
//			getorderInfor().then((res)=>{
//				billCode:""
//			})
			//获取物流轨迹
//			getTrail(
//				billCode:sw
//			).then((res)=>{
//				
//			})
			//获取留言信息
//			getMessages({
//				billCode:sw
//			}).then((res)=>{
//				this.messageArray=res.data
//				console.log(res,'留言记录')
////					console.log(this.messageArray[2].contents[1].files)
//			})
			//根据ID获取详情
			// getHandleIdData({
			// 	Id:'SWO19040200000026'
			// }).then((res)=>{
			// 	console.log(res,'一体化中的详情')
			// })
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
					padding-left: 15px;
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