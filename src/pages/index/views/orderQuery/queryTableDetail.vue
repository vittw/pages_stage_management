<template>
	<div class="queryDetailBox" v-if="detailObject">
		<div class="qd_left">
			<!--第一部分-->
			<div class="part">
				<div class="qd_info_inputItem">
					<span class="itemNme">内件物品：</span>
					<span class="itemValue"> {{detailObject.goodsName}}</span>
				</div>
				<div class="qd_info_inputItem">
					<span class="itemNme">内件价值：</span>
					<span class="itemValue">{{detailObject.itemValue}}</span>
				</div>
				<div class="qd_info_inputItem">
					<span class="itemNme">投诉人角色：</span>
					<span class="itemValue">{{detailObject.initRole}}</span>
				</div>
				<div class="qd_info_inputItem">
					<span class="itemNme">投诉人电话：</span>
					<span class="itemValue">{{detailObject.initPhone}}</span>
				</div>
			</div>
			<!--第二部分-->
			<div class="part p2">
				<div class="receive re">
					<div class="qd_info_inputItem">
						<span class="itemNme">收件人姓名：</span>
						<span class="itemValue">{{detailObject.receiveName}}</span>
					</div>
					<div class="qd_info_inputItem">
						<span class="itemNme">收件人座机：</span>
						<span class="itemValue">{{detailObject.receivePhone}}</span>
					</div>
					<div class="qd_info_inputItem">
						<span class="itemNme">收件人手机：</span>
						<span class="itemValue">{{detailObject.receiveMobile}}</span>
					</div>
					<div class="qd_info_inputItem">
						<span class="itemNme">收件人省市区：</span>
						<span class="itemValue">{{detailObject.receiveArea}}</span>
					</div>
					<div class="qd_info_inputItem ">
						<span class="itemNme">收件人地址：</span>
						<span class="itemValue">{{detailObject.receiveAddress}}</span>
					</div>
				</div>
				<div class="send re">
					<div class="qd_info_inputItem">
						<span class="itemNme">发件人姓名：</span>
						<span class="itemValue">{{detailObject.sendName}}</span>
					</div>
					<div class="qd_info_inputItem">
						<span class="itemNme">发件人座机：</span>
						<span class="itemValue">{{detailObject.sendPhone}}</span></div>
					<div class="qd_info_inputItem">
						<span class="itemNme">发件人手机：</span>
						<span class="itemValue">{{detailObject.sendMobile}}</span>
					</div>
					<div class="qd_info_inputItem">
						<span class="itemNme">发件人省市区：</span>
						<span class="itemValue">{{detailObject.sendArea}}</span>
					</div>
					<div class="qd_info_inputItem ">
						<span class="itemNme">发件人地址：</span>
						<span class="itemValue">{{detailObject.sendAddress}}</span>
					</div>
				</div>
				<div class="other re" v-if="detailObject.otherName!=''&&detailObject.otherName!=null">
					<div v-if="detailObject.otherName!=''&&detailObject.otherName!=null" class="qd_info_inputItem">
						<span class="itemNme">第三方姓名：</span>
						<span class="itemValue">{{detailObject.otherName}}</span>
					</div>
					<div v-if="detailObject.otherName!=''&&detailObject.otherName!=null" class="qd_info_inputItem">
						<span class="itemNme">第三方座机：</span>
						<span class="itemValue">{{detailObject.otherPhone}}</span>
					</div>
					<div v-if="detailObject.otherName!=''&&detailObject.otherName!=null" class="qd_info_inputItem">
						<span class="itemNme">第三方手机：</span>
						<span class="itemValue">{{detailObject.otherMobile}}</span>
					</div>
					<div v-if="detailObject.otherName!=''&&detailObject.otherName!=null" class="qd_info_inputItem">
						<span class="itemNme">第三方省市区：</span>
						<span class="itemValue">{{detailObject.otherArea}}</span>
					</div>
					<div v-if="detailObject.otherName!=''&&detailObject.otherName!=null" class="qd_info_inputItem auto">
						<span class="itemNme">第三方地址：</span>
						<span class="itemValue">{{detailObject.otherAddress}}</span>
					</div>
				</div>
			</div>
			<!--第三部分-->
			<div class="part">
				<!--<div class="qd_info_inputItem">
					<span class="itemNme">创建时间：</span>
					<span class="itemValue">{{detailObject.createOn}}</span>
				</div>-->
				<div class="qd_info_inputItem">
					<span class="itemNme">工单来源：</span>
					<span class="itemValue">{{detailObject.dataSource}}</span>
				</div>
				<div class="qd_info_inputItem">
					<span class="itemNme">工单ID：</span>
					<span class="itemValue">{{detailObject.id}}</span>
				</div>
				<div class="qd_info_inputItem">
					<span class="itemNme">工单类型：</span>
					<span class="itemValue">{{detailObject.workType}}</span>
				</div>
				<div class="qd_info_inputItem" v-if="detailObject.issuedNumber!=''&&detailObject.issuedNumber!=null">
					<span class="itemNme">下发次数：</span>
					<span class="itemValue">{{detailObject.issuedNumber}}</span>
				</div>

				
			</div>
			<div class="part">
				<div class="qd_info_inputItem">
					<span class="itemNme">工单状态：</span>
					<span class="itemValue">{{detailObject.dataStateName}}</span>
				</div>
				<div class="qd_info_inputItem">
					<span class="itemNme">处理等级：</span>
					<span class="itemValue">{{detailObject.dealLevel}}</span>
				</div>
				<div class="qd_info_inputItem">
					<span class="itemNme">末端扫描网点：</span>
					<span class="itemValue">{{detailObject.lastScanSite}}</span>
				</div>
				<!--v-if="detailObject.sendSite!=''"-->
				<div class="qd_info_inputItem" >
					<span class="itemNme">发件网点：</span>
					<span class="itemValue">{{detailObject.sendSite}}</span>
				</div>
				<!--<div class="qd_info_inputItem">
					<span class="itemNme">被投诉网点：</span>
					<span class="itemValue">{{detailObject.becomplainSiteName}}</span>
				</div>

				<div class="qd_info_inputItem" v-if="detailObject.lastScanSite!=''">
					<span class="itemNme">录入扫描网点：</span>
					<span class="itemValue">{{detailObject.lastScanSite}}</span>
				</div>
				<div class="qd_info_inputItem">
					<span class="itemNme">当前处理时效：</span>
					<span class="itemValue">{{detailObject.siteProcessTime}}</span>
				</div>-->
				<div class="qd_info_inputItem">
					<span class="itemNme">订单号：</span>
					<span class="itemValue">{{detailObject.billCode}}</span>
				</div>
			</div>
			<!--第四部分-->
			<div class="part p3">
				<!--需求描述-->
				<div class="qd_info_inputItem auto">
					<span class="itemNme">需求描述：</span>
					<span class="itemValue">{{detailObject.reqDescription}}</span>
				</div>
				<!--备注-->
				<div class="qd_info_inputItem auto">
					<span class="itemNme">备注：</span>
					<span class="itemValue">{{detailObject.remark}}</span>
				</div>
				<!--附件-->
				<!--v-if="detailObject.file!=null&&detailObject.file.length!=0"-->
				<div class="qd_info_inputItem qd_info_inputFiles" v-if="detailObject.file!=null&&detailObject.file.length!=0">
					<span class="itemNme">附件</span>
					<myShowFile :myFileData="detailObject.file"></myShowFile>
				</div>
				<!--处理内容-->
				<!--工单状态为  处理完成  时，才显示处理内容和至客户的内容-->
				<!--v-if="detailObject.dataState===4"-->
				<div class="qd_info_inputItem auto" v-if="detailObject.dataState===4">
					<span class="itemNme">处理内容：</span>
					<span class="itemValue">{{detailObject.processContent}}</span>
				</div>
				<!--至客户-->
				<div class="qd_info_inputItem auto" v-if="detailObject.dataState===4">
					<span class="itemNme">至客户：</span>
					<span class="itemValue">{{detailObject.reply}}</span>
				</div>
			</div>

		</div>
		<div class="qd_right">
			<p class="qd_right_title">处理备注</p>
			<div class="qd_right_line">
				<Timeline>
					<TimelineItem v-for="(item,index) in detailObject.processLog" :key="index" v-if="item.processContent!=''">
						<p class="time">{{item.createOn}}</p>
						<div class="content">{{item.processContent}}</div>
					</TimelineItem>
				</Timeline>
			</div>
		</div>
	</div>
</template>

<script>
	import myShowFile from'./showFile'
	export default {
		components: {myShowFile},
		props: {
			detailObject: {
				type: Object
			},
		},
		data() {
			return {
				detail: {},
				tedailData: [],
				videoModal: false, //视频播放的模态框
				musicModal: false
			}
		},
		mounted() {
			
			this.detail = this.$parent.detailObject
			console.log(this.detail)
		},
		created() {
			console.log(this.$parent.detailData,'哈哈2')
		},
		methods: {
//			videoClick() {
//				this.videoModal = true
//			},
//			musicClick() {
//				this.musicModal = true
//			},
//			imgClick(value) {
//				console.log(value)
//				window.open(value, '_blank');
//			},
		}
	}
</script>

<style lang="less" scoped>
	.queryDetailBox {
		width: 100%;
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		.qd_left {
			width: 100%;
			display: flex;
			justify-content: flex-start;
			align-items: flex-start;
			flex-direction: column;
			border-right: 1px solid #F5F5F5;
			.part {
				width: 100%;
				display: flex;
				justify-content: flex-start;
				align-items: flex-start;
				background-color: #F5F5F5;
				padding-left: 16px;
				flex-wrap: wrap;
				.qd_info_inputItem {
					margin-right: 40px;
					line-height: 35px;
				}
			}
			.p2 {
				background-color: #FFFFFF;
				.re {
					border-right: 1px solid #F5F5F5;
					padding: 0px 16px;
					.auto {
						display: flex;
						justify-content: flex-start;
						align-items: flex-start;
						.itemNme {
							display: inline-block;
							width: 80px;
						}
						.itemValue {
							width: 80%;
							display: flex;
							justify-content: flex-start;
							align-items: flex-start;
							flex-wrap: wrap;
						}
					}
				}
				.re:last-child {
					border-right-width: 0px;
				}
			}
			.p3 {
				width: 100%;
				background-color: #FFFFFF;
				display: flex;
				justify-content: flex-start;
				align-items: flex-start;
				flex-direction: column;
				.auto {
					width: 100%;
					display: flex;
					justify-content: flex-start;
					align-items: flex-start;
					.itemNme {
						display: inline-block;
						width:68px;
						text-align: center;
					}
					.itemValue {
						width: 93%;
						display: flex;
						justify-content: flex-start;
						align-items: flex-start;
						flex-wrap: wrap;
					}
				}
			}
		}
		.qd_right {
			width: 25%;
			padding: 10px;
			border-left: 1px solid #F5F5F5;
			.qd_right_title {
				height: 35px;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				font-size: 14px;
				color: #333333;
				font-weight: bold;
			}
		}
	}
	
	.qd_right_line {
		padding-top: 10px;
		.time {
			background-color: #FFB981;
			color: #FFFFFF;
			border-radius: 12px;
			width: 150px;
			height: 25px;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.content {
			margin-top: 10px;
			margin-left: 10px;
			width: 258px;
			background-color: #F5F5F5;
			padding: 10px;
			color: #333333;
		}
	}
	
	.files {
		width: 70%;
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		border: 1px solid #E8EAEC;
		padding: 10px;
		cursor: pointer;
		.itemss {
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			.type {
				display: inline-block;
				width: 50px;
				height: 50px;
				text-align: center;
				line-height: 50px;
				background-color: #F2F2F2;
			}
		}
	}
	
	.imgBox {
		border: 1px solid #DCDEE2;
		border-radius: 4px;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
		padding: 5px;
		width: 100%;
		.imgItem {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			flex-direction: column;
			margin-right: 5px;
			.list_left {
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				.list_img {
					cursor: pointer;
					display: inline-block;
					width: 80px;
					height: 80px;
					padding: 5px;
					border: 1px solid #DCDEE2;
					border-radius: 3px;
					img {
						display: inline-block;
						width: 100%;
						height: 80%;
					}
				}
				.list_name {
					display: inline-block;
					height: 30px;
					line-height: 20px;
					text-align: center;
				}
				a{
					display: inline-block;
					width: 80px;
					line-height: 26px;
					text-align: center;
					border: 1px solid #DCDEE2;
					border-radius: 4px;
				}
			}
		}
	}
</style>