<template>
	<div class="imgBox">

		<div class="imgItem" v-for="(item,ind) in myFileData">
			<!--音频-->
			<div @click="musicClick" class="list_left" v-if="(item.name.split('.')[1]==='mp3')||(item.name.split('.')[1]==='wma')||(item.name.split('.')[1]==='rm')||(item.name.split('.')[1]==='wav')||(item.name.split('.')[1]==='midi')||(item.name.split('.')[1]==='ape')||(item.name.split('.')[1]==='flac')">
				<span class="list_img">
					<img src="../../../../assets/img/news_music@3x.png">
				</span>
				<span class="list_name">{{item.name}}</span>
				<!--音频的模态框-->
				<Modal v-model="musicModal" title="播放音频">
					<video style="width: 100%;height: 60px;" :src="item.browseUrl" controls="controls"></video>
				</Modal>
			</div>
			<!--视频-->
			<div @click="videoClick" class="list_left" v-else-if="(item.name.split('.')[1]==='mp4')||(item.name.split('.')[1]==='rmvb')||(item.name.split('.')[1]==='ogg')||(item.name.split('.')[1]==='mkv')||(item.name.split('.')[1]==='wmv')||(item.name.split('.')[1]==='flv')">
				<span class="list_img">
					<img src="../../../../assets/img/news_video@3x.png">
				</span>
				<span class="list_name">{{item.name}}</span>
				<!--视频的模态框-->
				<Modal v-model="videoModal" title="请播放视频">
					<video style="width: 100%;height: 200px;" :src="item.browseUrl" controls="controls"></video>
				</Modal>
			</div>
			<!--文件-->
			<div class="list_left" v-else-if="(item.name.split('.')[1]==='ppt')||(item.name.split('.')[1]==='pptx')">
				<span class="list_img">
					<img src="../../../../assets/img/news_ppt@3x.png">
				</span>
				<span class="list_name">{{item.name}}</span>
				<a :href="item.browseUrl">点击下载</a>
			</div>
			
			<div class="list_left" v-else-if="(item.name.split('.')[1]==='xls')||(item.name.split('.')[1]==='xlsx')">
				<span class="list_img">
					<img src="../../../../assets/img/news_Excel@3x.png">
				</span>
				<span class="list_name">{{item.name}}</span>
				<a :href="item.browseUrl">点击下载</a>
			</div>
			
			<div class="list_left" v-else-if="(item.name.split('.')[1]==='docx')||(item.name.split('.')[1]==='doc')">
				<span class="list_img">
					<img src="../../../../assets/img/news_word@3x.png">
				</span>
				<span class="list_name">{{item.name}}</span>
				<a :href="item.browseUrl">点击下载</a>
			</div>
			<div class="list_left" v-else-if="item.name.split('.')[1]==='pdf'">
				<span class="list_img">
					<img src="../../../../assets/img/news_pdf@3x.png">
				</span>
				<span class="list_name">{{item.name}}</span>
				<a :href="item.browseUrl">点击下载</a>
			</div>
			<div class="list_left" v-else-if="item.name.split('.')[1]==='txt'">
				<span class="list_img">
					<img src="../../../../assets/img/news_txt@3x.png">
				</span>
				<span class="list_name">{{item.name}}</span>
				<a :href="item.browseUrl">点击下载</a>
			</div>
			
			<div class="list_left" v-else-if="(item.name.split('.')[1]==='tiff')||(item.name.split('.')[1]==='tif')">
				<span class="list_img">
					<img src="../../../../assets/img/news_file@3x.png">
				</span>
				<span class="list_name">{{item.name}}</span>
				<a :href="item.browseUrl">点击下载</a>
			</div>
			<!--图片-->
			<div class="list_left" v-else>
				<span class="list_img" @click="imgClick(item.browseUrl)">
					<img :src="item.browseUrl">
				</span>
				<span class="list_name" @click="imgClick(item.browseUrl)">{{item.name}}</span>
				<a :href="item.browseUrl">点击下载</a>
				
				<Modal v-model="imgModal" fullscreen title="图片查看" class="myImg">
		          	<img :src="imgSurl">
		        </Modal>
				
			</div>

		</div>
	</div>
</template>

<script>
	export default{
		props:{
			myFileData:{
				type:Array
			}
		},
		data(){
			return{
				videoModal: false, //视频播放的模态框
				musicModal: false,
				
				imgModal:false,
      			imgSurl:'',
			}
		},
		methods:{
			videoClick() {
				this.videoModal = true
			},
			musicClick() {
				this.musicModal = true
			},
			imgClick(value) {
				console.log(value)
				this.imgSurl=value
				this.imgModal=true
//				window.open(value, '_blank');
			},
		}
	}
</script>

<style lang="less" scoped="scoped">
.imgItem{
	box-sizing: border-box;
	margin-right: 12px;
	margin-top: 12px;
}
	.list_left{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		a{
			display: inline-block;
			height: 30px;
			width: 120px;
			line-height: 30px;
			border: 1px solid #E8E8E8;
			border-radius: 4px;
			text-align: center;
		}
		.list_img{
			width: 100px;
			height: 120px;
			img{
				display: inline-block;
				width: 100%;
				height: 100%;
			}
		}
	}
</style>