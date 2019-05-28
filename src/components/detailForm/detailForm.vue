<template>
	<Form class="detailForm" :model="formDetailItem" inline>
		<FormItem v-for="(item,index) in labelArray" :label="item.name" :key="item.name">
			<Input v-if="isMatch(item.name,'收件人')" v-model="item.value"></Input>
			<Input v-else-if="isMatch(item.name,'发件人')" v-model="item.value"></Input>
			<Input v-else v-model="item.value" disabled="disabled"></Input>
		</FormItem>
	</Form>
</template>

<script>
	import { Form, FormItem, Input,Select,Option } from 'iview';
	export default {
		components: {Form,FormItem,Input,Select,Option
		},
		data() {
			return {

			}
		},
		props: {
			formDetailItem: Object,
			labelArray: Array
		},
		mounted(){
			let self=this
			setTimeout(function(){
				console.log(self.$parent.firstArray)
//				self.secondArray=self.$parent.firstArray
			},1000)
		},
		methods: {
			isArrayFn(value) {
				if(typeof Array.isArray === "function"){
					return Array.isArray(value);
				} else {
					return Object.prototype.toString.call(value) === "[object Array]";
				}
			},
			isMatch(value,flag){
				//value中包含flag时，返回true，否则返回false
				if(value.search(flag) != -1){
					return true
				}else{
					return false
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	@import './detailForm.less';
</style>