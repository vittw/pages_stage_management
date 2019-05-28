<template>
    <div class="messageBox">
        <div class="h_left">
            <span class="color"></span>
            <span>消息中心</span>
        </div>
        <div class="h_right">
        	<slot></slot>
            
        </div>
    </div>
</template>

<script>
	import { Button } from 'iview'
    export default {
        name: "header",
        components:{},
        data(){
        	return{
        		
        	}
        },
        methods:{
        	
        },
        mounted(){
        	
        }
    }
</script>

<style lang="less" scoped>
	.messageBox{
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 45px;
		background-color: #F5F5F5;
		
		.h_left{
			display:flex;	
			justify-content:flex-start;
			align-items:center;	
			.color{
				display: flex;
				width: 3px;
				height: 14px;
				background-color: #F26E2E;
				margin-right: 10px;
			}
		}
		.h_right{
			
		}
	}
</style>
