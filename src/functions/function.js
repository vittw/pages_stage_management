import Axios from 'axios';
import AxUrls from '../api/baseUrl/urls.js'
import FileUrls from '../api/baseUrl/fileUrl.js'
import qs from 'qs';
import store from '../pages/index/store.js'
import settings from '@/api/baseUrl/settings.js'

// import { Message } from 'iview';

//axios
export function requestHttpMethods(url, data, HttpMethod = 'post', commonParam = false, config = AxUrls) {
	let formatDate = commonParam ? Object.assign({}, commonParam, data) : data;
//	console.log(formatDate)
	let formatHttp = HttpMethod.toLowerCase();
	//	if(formatHttp == 'post') {
	//	 	formatDate = qs.stringify(formatDate);
	//	}
	//config.headers['userId'] = store.state.userinfo.id;
	//config.headers['siteId']=store.state.userinfo.companyId;
	let instance = Axios.create(config)
	let HttpSendType = formatHttp == 'post' ? instance.post : instance.get;
	return HttpSendType(url, formatDate, config).then(res => {
			return Promise.resolve(res.data)
		})
		.catch(error => {
			// 请求配置发生的错误
			if(!error.response) {
				return console.log('Error', error.message);
			}
			//其他服务器返回的错误
			let status = error.response.status;
			console.log('status',status);
			console.log('error.response.data.code',error.response.data.code);
			if (status === 500 && error.response.data.code=="isv.invalid-token") {
			  // iview.Message.error(error.response.data.message);
			  window.location.href = settings.loginUrl
			} else if (status === 500 && error.response.data.code=="isp.unknow-error") {
				iview.Message.error('系统维护中,请稍后重试!');
			}else {
				iview.Message.error(error.response.data.msg);
			}
		})
}
//文件上传
export function requestFile(url, data, HttpMethod = 'post', commonParam = false, config = FileUrls) {
	let formatDate = commonParam ? Object.assign({}, commonParam, data) : data;
	let formatHttp = HttpMethod.toLowerCase();
	let instance = Axios.create(config)
	let HttpSendType = formatHttp == 'post' ? instance.post : instance.get;
	return HttpSendType(url, formatDate, config).then(res => {
			return Promise.resolve(res.data)
		})
		.catch(error => {
			// 请求配置发生的错误
			if(!error.response) {
				return console.log('Error', error.message);
			}
			//其他服务器返回的错误
			iview.Message.error(error.response.data.msg);
		})
}

//是否有这个class
export function hasClass(el, className) {
	let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
	return reg.test(el.className)
}

//添加一个class
export function addClass(el, className) {
	if(hasClass(el, className)) {
		return
	}
	let newClass = el.className.split(' ')
	newClass.push(className)
	el.className = newClass.join(' ')
}
//去掉一个class名
export function removeClass(el, className) {
	if(hasClass(el, className)) {
		var newClass = ' ' + el.className.replace(/[\t\r\n]/g, '') + ' ';
		while(newClass.indexOf(' ' + className + ' ') >= 0) {
			newClass = newClass.replace(' ' + className + ' ', ' ');
		}
		el.className = newClass.replace(/^\s+|\s+$/g, '');
	}
}
//日期时间拼接
export function formatDateTime(date1) {
	var date = new Date(date1)
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	m = m < 10 ? ('0' + m) : m;
	var d = date.getDate();
	d = d < 10 ? ('0' + d) : d;
	var h = date.getHours();
	h = h < 10 ? ('0' + h) : h;
	var minute = date.getMinutes();
	minute = minute < 10 ? ('0' + minute) : minute;
	var seconds = date.getSeconds();
	seconds = seconds < 10 ? ('0' + seconds) : seconds;
	return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + seconds;
}

//拼接日期 （显示当前日期再向前推七天的日期）
export function defaultimeStart(deTime) {
	let n = 7;
	let d = new Date();
	let year = d.getFullYear();
	var mon = d.getMonth() + 1;
	let day = d.getDate();
	if(day <= n) {
		if(mon > 1) {
			mon = mon - 1;
		} else {
			year = year - 1;
			mon = 12;
		}
	}
	d.setDate(d.getDate() - n);
	year = d.getFullYear();
	mon = d.getMonth() + 1;
	day = d.getDate();
	let s = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day) + ' ' + '00' + ':' + '00' + ':' + '00';
	return s;
}

export function defaultimeStart2(deTime) {
	let n = 2;
	let d = new Date();
	let year = d.getFullYear();
	var mon = d.getMonth() + 1;
	let day = d.getDate();
	if(day <= n) {
		if(mon > 1) {
			mon = mon - 1;
		} else {
			year = year - 1;
			mon = 12;
		}
	}
	d.setDate(d.getDate() - n);
	year = d.getFullYear();
	mon = d.getMonth() + 1;
	day = d.getDate();
	let s = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day) + ' ' + '00' + ':' + '00' + ':' + '00';
	return s;
}

export function defaultimeEnd(deTime) {
	let str1, str2;
	let date1 = new Date()
	let y1 = date1.getFullYear()
	let m1 = date1.getMonth() + 1
	let d1 = date1.getDate()
	m1 = m1 < 10 ? ('0' + m1) : m1;
	d1 = d1 < 10 ? ('0' + d1) : d1;
	str2 = y1 + '-' + m1 + '-' + d1 + ' ' + '23' + ':' + '59' + ':' + '59'
	deTime = str1 + '-' + str2
	return str2
}

//判断一个对象是否是数组（返回true，则就是一个数组）
export function isArrayFn(value) {
	if(typeof Array.isArray === "function") {
		return Array.isArray(value);
	} else {
		return Object.prototype.toString.call(value) === "[object Array]";
	}
}

//div在整个页面中可以拖动
export function drag(obj) {
	obj.onmousedown = function(e) {
		var evt = e || window.event;
		var xx = evt.clientX - obj.offsetLeft;
		var yy = evt.clientY - obj.offsetTop;
		document.onmousemove = function(e) {
			var evt = e || window.event;
			var x = evt.clientX - xx;
			var y = evt.clientY - yy;
			if(x < 0) {
				x = 0;
			}
			if(x > document.documentElement.clientWidth - obj.offsetWidth) {
				x = document.documentElement.clientWidth - obj.offsetWidth;
			}
			if(y < 0) {
				y = 0;
			}
			if(y > document.documentElement.clientHeight - obj.offsetHeight) {
				y = document.documentElement.clientHeight - obj.offsetHeight;
			}

			obj.style.left = x + "px";
			obj.style.top = y + "px";
			return false;
		}
		document.onmouseup = function() {
			document.onmousemove = null;
			document.onmouseup = null;
		}
	}
}

//截取特定数组从start-end 给数据，页面，页数计算当前页面数据
export function showDataSlice(data, pageSize, page) {
	return data.slice((page - 1) * pageSize, page * pageSize)
}

//获取cookie
export function getCookie(key) { //获取cookie方法
	/*获取cookie参数*/
	var getCookie = document.cookie.replace(/[ ]/g, ""); //获取cookie，并且将获得的cookie格式化，去掉空格字符
	var arrCookie = getCookie.split(";") //将获得的cookie以"分号"为标识 将cookie保存到arrCookie的数组中
	var tips; //声明变量tips
	for(var i = 0; i < arrCookie.length; i++) { //使用for循环查找cookie中的tips变量
		var arr = arrCookie[i].split("="); //将单条cookie用"等号"为标识，将单条cookie保存为arr数组
		if(key == arr[0]) { //匹配变量名称，其中arr[0]是指的cookie名称，如果该条变量为tips则执行判断语句中的赋值操作
			tips = arr[1]; //将cookie的值赋给变量tips
			break; //终止for循环遍历
		}
	}
	return tips
}

//比较对象是否相等的方法
export function compareObject(obj1, obj2) {
	//Object.getOwnPropertyNames():方法返回一个指定对象所有自身属性的属性名（包括不可枚举属性但不包括Symbol值作为名称的属性）组成的数组。
	//对象内置属性方法:Object.keys()；该方法返回一个数组，数组内包括对象内可枚举属性以及方法名称。数组中属性名的排列顺序和使用 for...in 遍历该对象时返回的顺序一致。
	var attrs1 = Object.keys(obj1);
	var attrs2 = Object.keys(obj2);
	if(attrs1.length != attrs2.length) {
		return false;
	}
	for(var j = 0; j < attrs1.length; j++) {
		var attrNames = attrs1[j];
		if(obj1[attrNames] != obj2[attrNames]) {
			return false;
		}
	}
	return true;
}

// 获取后缀 http:// dfwf/ffwef/fewfwfe.png   => png
export function getFileExtension(file){
	var strFileExtension = file.replace(/.+\./,"");
    return  strFileExtension
}

//判断后缀名是否是video
export function getIsVideo(file){
	let str=getFileExtension(file)
	let str2=0
	if(str==='mp4'||str==='rmvb'||str==='mkv'||str==='wmv'||str==='flv'){
		str2=1
	}else if(str==='mp3'||str==='wma'||str==='rm'||str==='wav'||str==='midi'||str==='ape'||str==='flac'){
		str2=2
	}else{
		str2=3
	}
	return str2
}
//export function compareObject(arr1,arr2) {
//  let newArr = [];
//  for (let i = 0; i < arr2.length; i++) {
//      for (let j = 0; j < arr1.length; j++) {
//          if(arr1[j] === arr2[i]){
//              newArr.push(arr1[j]);
//          }
//      }
//  }
//  return newArr;
//}
