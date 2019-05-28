<template>
	<div class="">
		 <Table ref="tableData" :columns="columns1" :data="data1" border 
		 	 	@on-selection-change="handleSelectRow()"
		 	 	draggable @on-drag-drop="drag"
		 	>
		 	<!--操作列-->
		 	<template slot-scope="{ row, index }" slot="action">
	            <Button type="primary" size="small" @click="show(row,index)" style="margin-right: 5px">详情</Button>
	        </template>
	        <!--运单编号-->
	        <template slot-scope="{ row, index }" slot="yun">
	        	<span style="cursor: pointer;" @click="numClick(row,index)">{{row.waybillNumber}}</span>
	        </template>
	        
		 </Table>
		 <div style="margin: 10px;overflow: hidden">
	        <div style="float: right;">
	            <Page show-sizer :page-size='20' show-total :total="100" :current="1" @on-change="changePage"></Page>
	        </div>
	    </div>
	    
	    <!--点击详情出来的详情清单-->
	    <qtableDetail :newmodal="newmodal"></qtableDetail>
	    
	    
	</div>
</template>

<script>
	import { Table,RadioGroup,Radio,Page,Dropdown,DropdownMenu,DropdownItem,Modal,ButtonGroup  } from 'iview';
	import {addClass,removeClass,formatDateTime} from '@/functions/function.js'
	import qData from '@/mock/queryData.js'
	import qtableDetail from './newDetail.vue'
	export default{
		components:{Table,qData,RadioGroup,Radio,Page,Dropdown,DropdownMenu,DropdownItem,Modal,
			ButtonGroup,addClass,removeClass,qtableDetail
		},
		
		data(){
			return{
				buttonSize: 'default',
				shareState:false,//分享按钮下面的
				settingState:false,//设置按钮
				//详情表单的状态
				newmodal:false,
				modal10:false,//设置模态框开始时不显示
				columns1: [
					{
                        type: 'selection',
                        width: 60,
                        align: 'center',
                    },
                    {
                        type: 'index',
                        title:'序号',
                        width: 70,
                        align: 'center',
//                      fixed: 'left'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        slot: 'action',
                        width:70,
                        fixed: 'right'
                    },
                    {
                        title: '运单号',
                        key: 'waybillNumber',
                        width:130,
                        slot:'yun'
//                      fixed: 'left'
                    },
                    {
                        title: '菜鸟工单ID',
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
                        title: '工单类型（一）',
                        key: 'orderType',
                        width:250
                    },
                    {
                        title: '工单类型（二）',
                        key: 'orderType2',
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
                        title: '创建网点',
                        key: 'complainedDot',
                        width:200
                    }
                    
                ],
                data1: qData,
			}
		},
		methods:{
			
			//分页中改变页数的按钮方法
			changePage(){},
			//点击查看详情
			show(row,index){
				this.newmodal=!this.newmodal
				this.modalStata.state=!this.modalStata.state
//				this.modalStata.title=row.waybillNumber+'工单信息'
				console.log(row)
				console.log(index)
			},
			//导出数据
			exportData (type) {},
            //获取选中行
            handleSelectRow(selection, index) {
            	let clus=this.$refs.tableData.getSelection()
            	this.$store.commit('saveQuerySelected', clus)
            	
            	console.log(this.$store.state.querySelected)
		    },
		    //行排序
		    drag(a,b){
		    	console.log(a,b)
		    	
		    },
		    numClick(row,index){
		    	console.log(row,"整行的数据")
		    	console.log(row.waybillNumber,'当前行的  运单编号')
		    	this.$router.push({name:'Integrated'})
		    }
		    
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