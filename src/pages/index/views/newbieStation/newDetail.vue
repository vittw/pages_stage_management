<template>
	<Modal
	    v-model="newmodal"
	    title="详情" :styles="{width:'700px !important'}">
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
	    
	    <div slot="footer">
	    	
	    </div>
	</Modal>
</template>

<script>
	import { Table,RadioGroup,Radio,Page,Dropdown,DropdownMenu,DropdownItem,Modal  } from 'iview';
	export default{
		components:{
			Table,RadioGroup,Radio,Page,Dropdown,DropdownMenu,DropdownItem,Modal
		},
		props:{
			newmodal:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return{
				columns1:[
					{
                        title: '处理时间',
                        key: 'time',
                        width:120
                   	},
                   	{
                        title: '处理结果',
                        key: 'result'
                    },
                    {
                        title: '处理状态',
                        key: 'state',
                        width:120
                    }
				],
				data1:[]
			}
		}
	}
</script>

<style>
</style>