<template>
	<div class="checkBox">
		<Form class="checkInputBox" :model="applyForm" label-position="left" :label-width="100" inline>
			<div class="check_remarek">
	        	<div class="checkItem">
		        	<FormItem label="运单编号">
			            <Input v-model="applyForm.yunNumber" disabled="disabled"></Input>
			        </FormItem>
		        </div>
		        <div class="checkItem">
		        	<FormItem label="被投诉网点">
			            <Input v-model="applyForm.complainedDot" disabled="disabled"></Input>
			        </FormItem>
		        </div>
	        </div>
	        <div class="check_remarek applyCause">
        		<FormItem label="申述原因">
		            <Input v-model="applyForm.cause" type="textarea" :autosize="{minRows: 4}"></Input>
		        </FormItem>
	        </div>
		</Form>
		
		
	</div>
</template>

<script>
	export default{
		components:{},
		data(){
			return{
				applyForm:{
					yunNumber:'',//运单编号
					complainedDot:'',//被投诉网点
					cause:'',//申述原因
				}
			}
		},
		methods:{},
		mounted(){}
	}
</script>

<style lang="less" scoped>
	
</style>