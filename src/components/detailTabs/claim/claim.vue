<template>
	<div class="claim_out">
		<Form class="claimForm" :model="formClaimItem" inline>
			
			<!--<FormItem v-else v-for="(item,index) in formClaimItem.labelArray" :label="item.name">
				
				<Input v-model="item.value"></Input>
			</FormItem>-->
			<FormItem v-for="(item,index) in formClaimItem.labelArray" :label="item.name" key='index'>
				
				<Input v-if="!(isMatch(item.name,'最大'))" v-model="item.value" disabled="disabled"></Input>
				<Input v-else v-model="item.value" disabled="disabled" type="textarea" :rows="4" placeholder="Enter something..."></Input>
			</FormItem>
			
		</Form>
	</div>
</template>

<script> 
	import { Form,FormItem,Select,Option,Input } from 'iview'
	export default{
		components:{
			Form,FormItem,Select,Option,Input
		},
		props:{},
		data(){
			return{
				formClaimItem:{
					labelArray:[
						{name:'类型（一级）',value:'SWO1235464657'},
						{name:'类型（二级）',value:'SWO1235464657'},
						{name:'中转模式',value:''},
						{name:'被投诉方',value:''},
						{name:'被投诉方联系人',value:''},
						{name:'被投诉方联系电话',value:''},
						{name:'支付宝账号',value:''},
						{name:'目的网点',value:''},
						{name:'快件内件类型',value:''},
						{name:'调查经过（累计输入最大不超过500字符）',value:''},
						{name:'面单附件：【最大1MB，支持.jpg,.png,.rar,.zip,.wav,.mp3',value:''},
						{name:'举证附件：[最大1MB，支持.jpg,.png,.rar,.zip,.wav,.mp3]',value:''}
					]
				}
			}
		},
		methods:{
			//isMatch
			isMatch(value,flag){
				//value中包含flag时，返回true，否则返回false
				if(value.search(flag) != -1){
					return true
				}else{
					return false
				}
			}
		},
		mounted(){
			let s=this.isMatch('1245789','12')
			console.log(s)
		},
	}
</script>

<style lang="less" scoped>
	
</style>