export const ACCEPT_CONFIG = {
    image: ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
    video: ['.mp4', '.rmvb','.avi','.3gp'],
    audio:['.mp3','.wma','.rm','.wav','.m4a'],
    document: ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf', '.txt','.zip','.rar','.7z'],
    getAll(){
        return [...this.image, ...this.video, ...this.audio, ...this.document]
    },
};


