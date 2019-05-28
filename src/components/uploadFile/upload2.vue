<template>
	<div class>
		<input name="file" type="file" id="file" class="files" @change="handleSuccess" 
			vaccept="image/png,image/jpeg,.bmp,image/gif,.avi,.wma,.m4a,.wav,.rmvb,.rm,audio/mpeg,audio/mp4,audio/3gpp,
					.3gp,aplication/zip,.rar,.7z,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,
					application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
					application/vnd.ms-powerpoint,.pptx,application/pdf"
			   multiple="multiple">
		<span class="blank"></span>
		<div class="myFileBox">
			<div class="up_header">
				<div class="hh" @click="addFile">
					<Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
					<span class="title">上传附件（支持类型：图片、语音压缩包，最多5个附件，单个文件最大5M）</span>
				</div>
				<span class="warn" v-if="uploadList.length!=0">已经添加{{uploadList.length}}/5个</span>
			</div>
			<ul class="content" v-if="uploadList.length!=0">
				<li class="fileList" v-for="(item,index) in uploadList" :key="index">
					<!--音频-->
					<div @click="musicClick" v-if="(item.fileName.split('.')[1]==='mp3')||(item.fileName.split('.')[1]==='wma')||(item.fileName.split('.')[1]==='rm')||(item.fileName.split('.')[1]==='wav')||(item.fileName.split('.')[1]==='midi')||(item.fileName.split('.')[1]==='ape')||(item.fileName.split('.')[1]==='flac')" class="list_left" id="list_left" :href="item.browseUrl">
						<span class="list_img">
              <img src="../../assets/img/news_music@3x.png">
            </span>
						<span class="list_name">{{item.fileName}}</span>
						<!--音频的模态框-->
						<Modal v-model="musicModal" title="播放音频">
							<video style="width: 100%;height: 60px;" :src="item.browseUrl" controls="controls"></video>
						</Modal>
					</div>
					<!--视频-->
					<div @click="videoClick" v-else-if="(item.fileName.split('.')[1]==='mp4')||(item.fileName.split('.')[1]==='rmvb')||(item.fileName.split('.')[1]==='ogg')||(item.fileName.split('.')[1]==='mkv')||(item.fileName.split('.')[1]==='wmv')||(item.fileName.split('.')[1]==='flv')" class="list_left" id="list_left">
						<span class="list_img">
              <img src="../../assets/img/news_video@3x.png">
            </span>
						<span class="list_name">{{item.fileName}}</span>
						<!--视频的模态框-->
						<Modal v-model="videoModal" title="请播放视频">
							<video style="width: 100%;height: 200px;" :src="item.browseUrl" controls="controls"></video>
						</Modal>
					</div>
					<!--文件-->
					<a class="list_left" id="list_left" :href="item.browseUrl" v-else-if="(item.fileName.split('.')[1]==='ppt')||(item.fileName.split('.')[1]==='pptx')">
						<span class="list_img">
          		<img src="../../assets/img/news_ppt@3x.png">
          	</span>
						<span class="list_name">{{item.fileName}}</span>
					</a>
					<a class="list_left" id="list_left" :href="item.browseUrl" v-else-if="(item.fileName.split('.')[1]==='xls')||(item.fileName.split('.')[1]==='xlsx')">
						<span class="list_img">
          		<img src="../../assets/img/news_Excel@3x.png">
          	</span>
						<span class="list_name">{{item.fileName}}</span>
					</a>
					<a class="list_left" id="list_left" :href="item.browseUrl" v-else-if="(item.fileName.split('.')[1]==='docx')||(item.fileName.split('.')[1]==='doc')">
						<span class="list_img">
          		<img src="../../assets/img/news_word@3x.png">
          	</span>
						<span class="list_name">{{item.fileName}}</span>
					</a>
					<a class="list_left" id="list_left" :href="item.browseUrl" v-else-if="item.fileName.split('.')[1]==='pdf'">
						<span class="list_img">
          		<img src="../../assets/img/news_pdf@3x.png">
          	</span>
						<span class="list_name">{{item.fileName}}</span>
					</a>
					<a class="list_left" id="list_left" @click="wenjianClick(item.browseUrl)" v-else-if="item.fileName.split('.')[1]==='txt'">
						<span class="list_img">
          		<img src="../../assets/img/news_txt@3x.png">
          	</span>
						<span class="list_name">{{item.fileName}}</span>
						<!--<Modal v-model="wenjianModel" :title="item.fileName">
          		<a :href="wenjianHref"></a>
          	</Modal>-->

					</a>
					<a class="list_left" id="list_left" :href="item.browseUrl" v-else-if="(item.fileName.split('.')[1]==='tiff')||(item.fileName.split('.')[1]==='tif')">
						<span class="list_img">
          		<img src="../../assets/img/news_file@3x.png">
          	</span>
						<span class="list_name">{{item.fileName}}</span>
					</a>
					<!--图片-->
					<div v-else @click="imgClick(item.browseUrl)" class="list_left" id="list_left">
						<span class="list_img">
              <img :src="item.browseUrl">
            </span>
						<span class="list_name">{{item.fileName}}</span>
						<Modal v-model="imgModal" title="图片查看" class="myImg">
							<img :src="imgSurl">
						</Modal>

					</div>

					<span class="list_delete" @click="detele(index)">
            <Icon size="20" type="md-close"/>
          </span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	//文件的类型
	import { ACCEPT_CONFIG } from "@/api/orderManage/accept.js";
	import { getToken, upFiles } from "@/api/orderManage/handle.js";
	import fileUrls from './../../api/baseUrl/fileUrl.js'
	export default {
		props: {
			defaultList: {
				type: Array
			}
			//			uploadList:{
			//				type:Array,
			//				default:[]
			//			},
		},
		data() {
			return {
				uploadList: [],
				accept: ACCEPT_CONFIG,
				videoModal: false, //视频播放的模态框
				musicModal: false,
				imgModal: false,
				imgSurl: '',

				wenjianModel: false,
				wenjianHref: '',
			};
		},
		mounted() {

		},
		created() {
			//	console.log(this.$parent.model)
			//	console.log(this.$parent.$parent.$parent.model.typeName.length)
			//	console.log(this.$parent.model)
			//	console.log(this.$parent.model.typeName.length)
		},
		methods: {
			videoClick() {
				this.videoModal = true;
			},
			musicClick() {
				this.musicModal = true;
			},
			imgClick(value) {
				console.log(value);
				//    window.open(value, "_blank");
				this.imgSurl = value
				this.imgModal = true
			},
			wenjianClick(value) {
				window.open(value, "_blank");
				//  	this.wenjianModel=true
				//  	this.wenjianHref=value

			},
			//文件选择确定之后上传文件函数
			handleSuccess(e) {
				let files = e.target.files[0];
				console.log(files)
				let filesMaxStatus = true;
				if('png,jpg,jpeg,bmp,gif,avi,wma,m4a,wav,rmvb,rm,mp3,mp4,3gp,zip,rar,7z,txt,doc,docx,xIs,xIsx,ppt,pptx,pdf'.indexOf(files.type.split('/')[1])>=0)
				{
					filesMaxStatus=true;
				}
				else
				{
					filesMaxStatus=false;
					this.$Message.info("不支持的附件类型");
				}

				if(filesMaxStatus)
				{
					if(files.size / 1024 > 5120) {
					filesMaxStatus = false;
					this.$Message.info("单个文件大小不能超过5M");
					}
				}
				if(filesMaxStatus) {
					let forDatas = new FormData();
					forDatas.append('file', files);
					forDatas.append('saveDay', 360);
					//得到上传文件的token
					getToken().then((res) => {
						if(res.success) {
							fileUrls.headers.accessToken = res.data
							if(fileUrls.headers.accessToken != undefined && fileUrls.headers.accessToken != '') {
								//上传文件
								upFiles(forDatas).then((res) => {
									if(res.respCode === '000') {
										let sw = {
											name: e.target.files[0].name,
											filePath: res.data
										};
										let ssw = {
											fileName: e.target.files[0].name,
											url: res.data,
											browseUrl: this.getFileURL(e.target.files[0])
										};
										this.uploadList.push(ssw);
										this.defaultList.push(sw);
									} else {
										this.$Message.info(res.resMessage);
									}
								})
							} else {
								this.$Message.info('没有获取相应的token');
							}
						}
					})

					console.log()

				}
			},
			//删除当前的一个附件
			detele(index) {
				console.log(index);
				this.uploadList.splice(index, 1);
			},
			//点击添加附件
			addFile() {
				if(this.uploadList.length >= 5) {
					this.$Message.info("最多添加5个文件");
				} else {
					document.getElementById("file").click();
				}
			},
			//获取文件的本地路径（可用于图片的本地路径回显）
			getFileURL(file) {
				var getUrl = null;
				if(window.createObjectURL != undefined) {
					// basic
					getUrl = window.createObjectURL(file);
				} else if(window.URL != undefined) {
					// mozilla(firefox)
					getUrl = window.URL.createObjectURL(file);
				} else if(window.webkitURL != undefined) {
					// webkit or chrome
					getUrl = window.webkitURL.createObjectURL(file);
				}
				return getUrl;
			}
			//文件上传完成————————————————————
		}
	};
</script>

<style lang="less" scoped="scoped">
	.myImg .ivu-modal-wrap .ivu-modal .ivu-modal-content .ivu-modal-body {
		display: flex !important;
		justify-content: center;
		align-items: center;
	}
	
	.files {
		width: 100%;
		opacity: 0;
		cursor: pointer;
	}
	
	.blank {
		position: absolute;
		top: 0px;
		left: 0px;
		display: inline-block;
		height: 24px;
		width: 100%;
	}
	
	.myFileBox {
		width: 100%;
		.up_header {
			width: 100%;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.hh {
				cursor: pointer;
				margin-right: 20px;
				.title {
					color: #0b9afc;
					text-decoration: underline;
				}
			}
			.warn {
				color: red;
			}
		}
		.content {
			z-index: 3;
			width: 50%;
			border: 1px solid #dcdee2;
			border-radius: 3px;
			padding: 10px;
			cursor: pointer;
			.fileList {
				background-color: #f5f5f5;
				list-style: none;
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 10px;
				padding: 5px;
				.list_left {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					.list_img {
						display: inline-block;
						width: 50px;
						height: 50px;
						margin-right: 10px;
						img {
							display: inline-block;
							width: 50px;
							height: 50px;
						}
					}
					.list_name {
						display: inline-block;
						width: 78%;
					}
				}
				.list_delete {
					cursor: pointer;
					width: 50px;
					height: 50px;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}
		}
	}
</style>