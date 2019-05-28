<template>
	<div class="">
		<div class="btnOptions">
			<ButtonGroup :size="buttonSize">
	            <Button :size="buttonSize" type="primary" @click="pending()">全部 </Button>
	            <Button :size="buttonSize" @click="help()">待催办 </Button>
	       </ButtonGroup>
			<div class="btn_right" style="position: relative;">
				<!--<Button class="btn_right_one" @click="share()"><Icon type="ios-redo" /></Button>
		        <div class="btn_group" v-if="shareState">
		        	<Button @click="exportData(1)">导出</Button>
		            <Button @click="exportData(1)">全部导出</Button>
		        </div>-->
			    <Button @click="exportData(1)">导出</Button>
		        <Button @click="exportData(1)">全部导出</Button>
			    <!--<Button @click="setting()"><Icon type="md-settings"/></Button>
			    <div class="btn_group grTwo" v-if="settingState">
			    	<Button @click="exportData(1)">申请介入</Button>
		            <Button @click="exportData(1)">全部导出</Button>
			    </div>-->
			</div>
		</div>
		 <Table ref="tableData" :columns="columns1" :data="data1" border 
		 	 	@on-selection-change="handleSelectRow()"
		 	>
		 	<!--操作列-->
		 	<template slot-scope="{ row, index }" slot="action">
		 		<span style="color: #F1701F;cursor: pointer;" @click="show(row,index)">详情</span>
	            <!--<Button type="primary" size="small" @click="show(row,index)" style="margin-right: 5px">详情</Button>-->
	        </template>
	        
		 </Table>
		 <div style="margin: 10px;overflow: hidden">
	        <div style="float: right;">
	            <Page show-sizer :page-size='20' show-total :total="100" :current="1" @on-change="changePage"></Page>
	        </div>
	    </div>
	    
	    <!--点击详情出来的详情清单-->
    	<Modal
	        :title="modalStata.title"
	        v-model="modalStata.state"
	        fullscreen
	        class-name="tableDetail">
	        <qtableDetail></qtableDetail>
	    </Modal>
	    
	</div>
</template>

<script>
	import { Table,RadioGroup,Radio,Page,Dropdown,DropdownMenu,DropdownItem,Modal,ButtonGroup  } from 'iview';
	import {addClass,removeClass,formatDateTime} from '@/functions/function.js'
	import qData from '@/mock/queryData.js'
	import qtableDetail from '@/pages/index/views/orderQuery/queryTableDetail.vue'
	export default{
		components:{Table,qData,RadioGroup,Radio,Page,Dropdown,DropdownMenu,DropdownItem,Modal,
			ButtonGroup,addClass,removeClass,qtableDetail
		},
		
		data(){
			return{
				buttonSize: 'default',
				shareState:false,//分享按钮下面的
				settingState:false,//设置按钮
				modalStata:{//模态框信息
					state:false,
					title:'',
				},
				modal10:false,//设置模态框开始时不显示
				columns1: [
					{
                        type: 'selection',
                        width: 60,
                        align: 'center',
//                      fixed: 'left'
                    },
                    {
                        type: 'index',
                        width: 60,
                        align: 'center',
//                      fixed: 'left'
                    },
                    {
                        title: '工单来源',
                        key: 'orderSource',
                        width:200
                    },
                    {
                        title: '最晚完成时间',
                        key: 'latestTime',
                        width:150
                    },
                    {
                        title: '运单号',
                        key: 'waybillNumber',
                        width:130,
//                      fixed: 'left'
                    },
                    {
                        title: '工单ID',
                        key: 'orderID',
                        width:200
                    },
                    {
                        title: '创建时间',
                        key: 'orderCreateTime',
                        width:150,
                        sortable: true
                    },
                    
                    {
                        title: '工单类型',
                        key: 'orderType',
                        width:250
                    },
                    {
                        title: '工单状态',
                        key: 'orderState',
                        width:120,
                        filters: [
                            {
                                label: '待处理',
                                value: '待处理'
                            },
                            {
                                label: '未首跟',
                                value: '未首跟'
                            },
                            {
                                label: '等待完结',
                                value: '等待完结'
                            },
                            {
                                label: '已完结',
                                value: '已完结'
                            }
                        ],
                        filterMultiple: false,
                        filterMethod (value, row) {
                        	return value === row.orderState
                        }
                    },
                    {
                        title: '倒计时',
                        key: 'orderCountdown',
                        width:100
                    },
                    {
                        title: '处理等级',
                        key: 'handleLevel',
                        width:100
                    },
                    {
                        title: '当前处理时效',
                        key: 'handleAgingnow',
                        width:150
                    },
                    {
                        title: '处理时间',
                        key: 'handleAging',
                        width:150
                    },
                    {
                    	title:'发起角色',
                    	key:'headerrole',
                    	width:150
                    },
                    
                    
                    {
                        title: '当前处理网点',
                        key: 'handleDot',
                        width:200
                    },
                    {
                        title: '当前处理人',
                        key: 'handlePeople',
                        width:200
                    },
                    {
                        title: '被投诉网点',
                        key: 'complainedDot',
                        width:200
                    },
                    {
                        title: '末端扫描网点',
                        key: 'endScanDot',
                        width:200
                    },
                    {
                        title: '发件网点',
                        key: 'sendDot',
                        width:200
                    },
                    {
                        title: '录入网点',
                        key: 'inputDot',
                        width:200
                    },
                    {
                        title: '录入人',
                        key: 'inputPeople',
                        width:200
                    },
                    {
                        title: '下发次数',
                        key: 'xiafaTimes',
                        width:100
                    },
                    {
                        title: '操作',
                        key: 'action',
                        slot: 'action',
                        width:70,
                        fixed: 'right'
                    }
                    
                ],
                data1: qData,
			}
		},
		methods:{
			//全部
			pending(){
				console.log(this.columns1)
				console.log(this.$refs.tableData)
				let w=document.querySelector('.ivu-btn-group').children
				addClass(w[0], 'ivu-btn-primary')
				removeClass(w[1],'ivu-btn-primary')
			},
			//待催办
			help(){
				let w=document.querySelector('.ivu-btn-group').children
				addClass(w[1], 'ivu-btn-primary')
				removeClass(w[0],'ivu-btn-primary')
			},
			
			//分享按钮
			share(){
				if(!this.shareState){
					this.shareState=!this.shareState
				}else{
					this.shareState=!this.shareState
				}
			},
			//设置按钮
			setting(){
				if(!this.settingState){
					this.settingState=!this.settingState
				}else{
					this.settingState=!this.settingState
				}
			},
			//分页中改变页数的按钮方法
			changePage(){},
			//点击查看详情
			show(row,index){
				this.modalStata.state=true
				this.modalStata.title=row.waybillNumber+'工单信息'
				console.log(row)
				console.log(index)
			},
			//导出数据
			exportData (type) {
                if (type === 1) {
                    this.$refs.tableData.exportCsv({
                        filename: '导出原始数据表',
//                      data:formatDateTime
						data:this.data1.filter((data, index) => formatDateTime(data.orderCreateTime))
                    });
                } else if (type === 2) {
                    this.$refs.tableData.exportCsv({
                        filename: '排序后的数据',
                        original: false
                    });
                } else if (type === 3) {
                    this.$refs.tableData.exportCsv({
                        filename: '自定义数据',
                        columns: this.columns1.filter((col, index) => index < 4),
                        data: this.data1.filter((data, index) => index < 4)
                    });
                }
                this.shareState=!this.shareState
            },
            //获取选中行
            handleSelectRow(selection, index) {
            	let clus=this.$refs.tableData.getSelection()
            	this.$store.commit('saveQuerySelected', clus)
            	
            	console.log(this.$store.state.querySelected)
		    },
		    
		    
		},
		mounted(){
			
		}
	}
</script>

<style lang="less" scoped>
	.btnOptions{
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		margin-bottom: 10px;
		
		.btn_right{
			.btn_right_one{
				margin-right: 5px;
			}
		}
	}
	.ivu-radio-wrapper-checked{
		background-color: #F1701F !important;
		color: #FFFFFF !important;
	}
	.colorAdd{
		background-color: #f1701f;
		color: #FFFFFF;
	}
	
	
	.btn_group{
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		position: absolute;
		top: 33px;
		left: 0px;
		z-index: 99999 !important;
		button{
			width: 80px !important;
			border-radius: 0px !important;
		}
		button:nth-child(2){
			border-top-width: 0px !important;
		}
	}
	.grTwo{
		
		left: 12px !important;
	}
</style>