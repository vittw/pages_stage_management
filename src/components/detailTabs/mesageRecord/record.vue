<template>
	<div class="record_box">
		<!--<Button type="primary" @click="addMes" class="messageAdd">增加留言</Button>-->

		<div class="re_item" v-for="(item,index) in messageArray">
			<div class="re_item_title">
				<span>留言时间：{{item.createOn}}</span>
				<span style="width:60%;">留言主题：{{item.theme}}</span>
				<span style="width:15%;">类型：{{item.messageType}}</span>
			</div>
			<div class="re_item_main">
				<div class="m_title">
					<span class="name">发起人：{{item.createBy}}</span>
					<span>对方网点：{{item.targetSite}}</span>
				</div>
				<div class="m_desc">
					<div class="">
						详细描述：{{item.describe}}
					</div>
				</div>
				<a class="clickMore" @click="more(index)" v-if="item.contents">{{mes}}</a>
				<div class="more_remark" style="display:none">
					<div class="list" v-for="(data,indexs) in item.contents">
						<div class="line_left">
							<span></span>
						</div>
						<div class="line_right">
							<p class="remark_time">{{data.createBy}}</p>
							<p class="remark_main">
								<span class="title">{{data.createSite}}</span>
								<span class="desc">{{data.content}}</span>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>

	</div>
</template>

<script>
	import { Button, Timeline, TimelineItem } from 'iview'
	export default {
		components: {
			Button,
			Button,
			Timeline,
			TimelineItem
		},
		props: {
			messageArray: {
				type: Array
			}
		},
		data() {
			return {
				mes:'点击查看更多留言',
				mesState:false
			}
		},
		mounted(){
			let arr=[1,2,3]
			let arr2
			let w=this.isEmpty(arr2)
			console.log(w,'看看是否为空')
		},
		methods: {
			//点击添加留言
			addMes() {
				this.$emit('mesAdd')
			},
			//点击查看更多留言
			more(index) {
				console.log(index,'序号')
				let sw=document.getElementsByClassName('more_remark')
				let clicks=document.getElementsByClassName('clickMore')
				console.log(sw[index],'当前点击了')
				if(!this.mesState){
					sw[index].style.display='block'
					clicks[index].innerHTML='点击收起'
					this.mesState=true
				}else{
					sw[index].style.display='none'
					clicks[index].innerHTML='点击查看更多留言'
					this.mesState=false
				}
			},
			//判断数组是否为空
			isEmpty(obj) {
				// 检验 undefined 和 null
				if(!obj && obj !== 0 && obj !== '') {　　　　　　　　　　
					return true;
				}
				if(Array.prototype.isPrototypeOf(obj) && obj.length === 0) {　　　　
					return true;　　
				}
				if(Object.prototype.isPrototypeOf(obj) && Object.keys(obj).length === 0) {　　　　
					return true;　　　　
				}　　　　
				return false;
			}
		}
	}
</script>

<style lang="less" scoped>
	@import './record.less';
	.more_remark {
		width: 100%;
		.list {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			margin-bottom: 15px;
			width: 100%;
			.line_left {
				margin-right: 10px;
				span {
					display: block;
					width: 8px;
					height: 8px;
					background-color: #FF9B4D;
					border-radius: 50%;
				}
			}
			.line_right {
				.remark_time {
					padding-left: 10px;
				}
				.remark_main {
					padding: 10px;
					display: flex;
					justify-content: flex-start;
					align-items: flex-start;
					flex-direction: column;
					background-color: #F5F5F5;
					.title {
						color: #657180;
						font-size: 14px;
					}
					.desc {
						background-color: ;
					}
				}
			}
		}
	}
	
	.more_remark .list:nth-child(2n) {
		flex-direction: row-reverse;
		align-items: center;
		.line_left {
			margin-left: 10px;
		}
		.line_right {
			.remark_time {
				text-align: right;
				padding-right: 10px;
			}
			.remark_main {
				justify-content: flex-end;
				align-items: flex-end
			}
		}
	}
</style>