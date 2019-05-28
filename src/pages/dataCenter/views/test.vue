<template>
	<div class="infor_box">
		<div class="infor_top">
			<Mheader>
				<Button>默认1</Button>
				<Button>默认2</Button>
				<Button>默认3</Button>
			</Mheader>
		</div>
		<div class="infor_bot">
			<div class="infor_left">
				<Collapse v-model="value1">
					<Panel name="1">
						史蒂夫·乔布斯
						<p slot="content">
							
						</p>
					</Panel>
					<Panel name="2">
						斯蒂夫·盖瑞·沃兹尼亚克
						<p slot="content">
							
						</p>
					</Panel>
					<Panel name="3">
						乔纳森·伊夫
						<p slot="content">
							乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人。
							
						</p>
					</Panel>
				</Collapse>
			</div>
			<div class="infor_right">
				<div class="infor_innr">
					<div class="part1">
						<p class="title">1、快件信息</p>
						<Form inline label-position="left" :label-width="80">
							<div class="">
								<FormItem label="运单编号">
									<Input></Input>
								</FormItem>
								<FormItem label="运单编号">
									<Input></Input>
								</FormItem>
								<FormItem label="运单编号">
									<Input></Input>
								</FormItem>
							</div>
							<div class="">
								<FormItem label="运单编号">
									<Input></Input>
								</FormItem>
								<FormItem label="运单编号">
									<Input></Input>
								</FormItem>
								<FormItem label="运单编号">
									<Input></Input>
								</FormItem>
							</div>
						</Form>
					</div>
				</div>
			</div>
		</div>
		
		<!---->
	</div>
</template>

<script>
	import { Collapse, Panel,Form,FormItem,Input } from 'iview';
	import Mheader from './header';
	export default {
		components: {
			Collapse,Panel,Form,FormItem,Input,
			Mheader
		},
		data() {
			return {
				value1: '1'
			}
		},
		methods: {},
		mounted() {}
	}
</script>

<style lang="less" scoped>
	.infor_box{
		padding: 0px 10px 10px 10px;
		background-color: #F5F5F5;
		.infor_top{
			
		}
		.infor_bot{
			display: flex;
			justify-content: flex-start;
			align-items: flex-start;
			background-color: #FFFFFF;
			padding: 10px;
			.infor_left{
				width: 20%;
				background-color: #F5F5F5;
			}
			.infor_right{
				width: 80%;
				padding: 10px 20px 10px 20px;
				/*background-color: #F29100;*/
				.infor_innr{
					.part1{
						.title{
							line-height: 30px;
							color: #464C5B;
							font-size: 14px;
							font-weight: bold;
							border-bottom: 1px solid #E8E8E8;
						}
					}
				}
			}
		}
		
	}
</style>