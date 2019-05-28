<template>
	<div class="exam_outerBox">
        <div class="eB_left">
        	<p class="exam_title">{{formExamItem.title}}</p>
    		<Sider class="exam_ul" hide-trigger :style="{background: '#fff'}">
                <Menu active-name="1-1" theme="light" width="auto" :open-names="['1']">
                    <MenuItem name="1-1">2018-01-15 21:21:21</MenuItem>
                    <MenuItem name="1-2">2018-01-16 21:21:21</MenuItem>
                    <MenuItem name="1-3">2018-01-17 21:21:21</MenuItem>
                </Menu>
           </Sider>
    	
        </div>
        <div class="eB_right">
        	<Form class="examForm" :model="formExamItem" inline>
				<FormItem v-for="(item,index) in formExamItem.labelArray" :label="item.name" key='index'>
					<Input v-model="item.value" disabled="disabled"></Input>
				</FormItem>
			</Form>
        </div>
    </div>
</template>

<script>
	import { Form,FormItem,Select,Option,Input,Sider,Menu,Submenu,MenuItem } from 'iview'
	export default{
		components:{
			Form,FormItem,Select,Option,Input,Sider,Menu,Submenu,MenuItem
		},
		props:{
			formExamItem:{
				type:Object
			}
		},
		data(){
			return{
				
//				formExamItem:{
//					title:'罚款时间',
//					labelArray:[
//						{name:'工单ID',value:'SWO1235464657'},
//						{name:'工单类型',value:'SWO1235464657'},
//						{name:'罚款网点',value:''},
//						{name:'罚款时间',value:''},
//						{name:'罚款人',value:''},
//						{name:'被处罚网点',value:''},
//						{name:'受款网点',value:''},
//						{name:'处罚金额',value:''},
//						{name:'受款客户',value:''},
//						{name:'罚款类型',value:''},
//						{name:'受款金额',value:''},
//						{name:'调查经过',value:''},
//						{name:'发件时间',value:''},
//						{name:'撤销人',value:''},
//						{name:'撤销时间',value:''},
//						{name:'撤销网点',value:''},
//						{name:'撤销原因',value:''},
//						{name:'备注',value:''}
//				
//					]
//				},
				
			}
		},
		methods:{
			
		}
	}
</script>

<style lang="less" scoped>
	@import './exam.less';
	
	
</style>