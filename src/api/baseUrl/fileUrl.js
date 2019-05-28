import settings from '@/api/baseUrl/settings.js'

//可以在这里存放各种地址
const fileUrls={
	baseURL: settings.fileBaseUrl,
	retry: 4,
	retryDelay: 1000,
	timeout: 80000,
	headers: {
		'Content-Type': 'multipart/form-data',
	}
}
export default fileUrls
