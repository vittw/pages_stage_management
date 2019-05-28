import settings from '@/api/baseUrl/settings.js'

//可以在这里存放各种地址
const axUrls={
	baseURL: settings.baseUrl,
	retry: 4,
	retryDelay: 1000,
	timeout: 80000,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
		// 'x-company-code': '2155',    //2155    311111
		// 'x-employee-code': '2155500156'    //2155500478  2155500156   311111
	}
}
export default axUrls
