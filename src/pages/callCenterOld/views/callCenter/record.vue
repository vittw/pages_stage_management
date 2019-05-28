<template>
	<div class="record_box">
		<div class="re_item" v-if="messageArray.length != 0" v-for="(item,index) in messageArray">
			<div class="re_item_title">
				<span>留言时间：{{item.createOn}}</span>
				<span>留言主题：{{item.theme}}</span>
				<span>类型：{{item.messageType}}</span>
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
		<div class="no_data" v-if="messageArray.length == 0">
			暂无数据
		</div>
	</div>
</template>

<script>
	import { getMessages } from '@/api/callCenter/callCenter.js'
	import { Button, Timeline, TimelineItem } from 'iview'
	export default {
		components: {
			Button,
			Button,
			Timeline,
			TimelineItem
		},
		props: {
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
				mes: '点击查看更多留言',
				mesState: false,
				messageArray: []
			}
		},
		created(){
			this.getRemark()
		},
		watch: {
	    isChange(){
	      this.getRemark()
	    }
	  },
		methods: {
			//获取留言记录
			getRemark(){
				getMessages({
					billCode: this.billCode
				}).then((res)=>{
					if(res&&res.success){
						this.messageArray = res.data
					} else {
						this.messageArray = []
					}
				})
			},
			//点击添加留言
			addMes() {
				this.$emit('mesAdd')
			},
			//点击查看更多留言
			more(index) {
				let sw=document.getElementsByClassName('more_remark')
				let clicks=document.getElementsByClassName('clickMore')
				if(!this.mesState){
					sw[index].style.display='block'
					clicks[index].innerHTML='点击收起'
					this.mesState=true
				}else{
					sw[index].style.display='none'
					clicks[index].innerHTML='点击查看更多留言'
					this.mesState=false
				}
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
