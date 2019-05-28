let env = process.env.NODE_ENV === 'development' ? 'development' :
    process.env.VUE_APP_TITLE === 'testing' ? 'testing' : 'production';

let baseUrl = '';                //接口请求url
let fileBaseUrl = '';            //文件上传接口请求url
let loginUrl = '';               //token失效跳转登录地址
let homeShow = true;             //验证权限首页限制默认不允许进入子页
switch (env) {
  case 'development':            //本地开发
    baseUrl = "http://192.168.122.34:18080/fwzl-test/";
    fileBaseUrl = "http://192.168.122.23:8888/";
    loginUrl = "http://192.168.124.54:8888/Authenticate/Login";
    break
  case 'testing':               //测试环境
    baseUrl = "http://192.168.122.34:18080/fwzl-test/";
    fileBaseUrl = "http://192.168.122.23:8888/";
    loginUrl = "http://192.168.124.54:8888/Authenticate/Login";
    homeShow = false;
    break
  case 'production':            //生产环境
    baseUrl = "http://wutonggateway.sto-express.cn/fwzl-xingongdan/";
    fileBaseUrl = "http://fastdfs-api.stosystem.com/";
    loginUrl = "http://sso.sto-express.cn/Authenticate/Login";
    homeShow = false;
    break
}

let settings = {
  baseUrl,
  fileBaseUrl,
  loginUrl,
  homeShow
}

export default settings;
