/**
 * 通用uni-app网络请求
 * 基于 Promise 对象实现更简单的 request 使用方式，支持请求和响应拦截
 */

/*
// 开放的接口
http.request(url:'user/list',method:'GET').then((res)=>{
	console.log(JSON.stringify(res))
})

http.get('user/list').then((res)=>{
	console.log(JSON.stringify(res))
})
http.get('user/list', {status: 1}).then((res)=>{
	console.log(JSON.stringify(res))
})
http.post('user', {id:1, status: 1}).then((res)=>{
	console.log(JSON.stringify(res))
})
http.put('user/1', {status: 2}).then((res)=>{
	console.log(JSON.stringify(res))
})
http.delete('user/1').then((res)=>{
	console.log(JSON.stringify(res))
}) 
*/
// #ifdef MP
let baseUrl =
  process.env.NODE_ENV === "development"
    ? "https://dev.ya73r.cn"
    : "https://www.yizhiclass.com";
// #endif

// #ifdef H5
let baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://class.amghpry.cn:443"
    : window.location.origin;
// #endif

export default {
  config: {
    baseUrl: baseUrl,
    header: {
      "Content-Type": "application/json;charset=UTF-8"
      // 'Content-Type':'application/x-www-form-urlencoded'
    },
    data: {},
    method: "GET",
    dataType: "json" /* 如设为json，会对返回的数据做一次 JSON.parse */,
    responseType: "text",
    success() {},
    fail() {},
    complete() {}
  },
  interceptor: {
    // 请求发起拦截
    request: config => {
      //添加通用参数,开启加载loading
      // config.header = {
      // 		"token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      // }
      let zwUid = uni.getStorageSync("zwUid");
      if (zwUid) {
        config.data.openid = zwUid;
      }
      uni.showLoading({
        title: "请稍候"
      });
    },
    // 请求响应拦截
    response: response => {
      const res = response.data;
      if (res.code == 200 || res.error == 0) {
        return res;
      } else {
        uni.showModal({
          title: "提示",
          content: res.msg || "请求错误:" + response.statusCode,
          showCancel: false
        });
        return Promise.reject(res);
      }
      //判断返回状态 执行相应操作
    }
  },
  request(options) {
    if (!options) {
      options = {};
    }
    options.baseUrl = options.baseUrl || this.config.baseUrl;
    options.dataType = options.dataType || this.config.dataType;
    options.url = options.baseUrl + options.url;
    options.data = options.data || {};
    options.method = options.method || this.config.method;
    //TODO 加密数据

    //TODO 数据签名
    /* 
		_token = {'token': getStorage(STOREKEY_LOGIN).token || 'undefined'},
		_sign = {'sign': sign(JSON.stringify(options.data))}
		options.header = Object.assign({}, options.header, _token,_sign) 
		*/

    return new Promise((resolve, reject) => {
      let _config = null;

      options.complete = response => {
        let statusCode = response.statusCode;
        if (this.interceptor.response) {
          let newResponse = this.interceptor.response(response);
          if (newResponse) {
            response = newResponse;
          }
        }
        response.config = _config;
        // 统一的响应日志记录,关闭加载提示
        _reslog(response);
        uni.hideLoading();
        if (statusCode === 200) {
          //成功
          resolve(response);
        } else {
          reject(response);
        }
      };

      _config = Object.assign({}, this.config, options);
      _config.requestId = new Date().getTime();

      if (this.interceptor.request) {
        this.interceptor.request(_config);
      }

      // 统一的请求日志记录
      _reqlog(_config);
      uni.request(_config);
    });
  },
  get(url, data, options) {
    if (!options) {
      options = {};
    }
    options.url = url;
    options.data = data;
    options.method = "GET";
    return this.request(options);
  },
  post(url, data, options) {
    if (!options) {
      options = {};
    }
    options.url = url;
    options.data = data;
    options.method = "POST";
    return this.request(options);
  },
  put(url, data, options) {
    if (!options) {
      options = {};
    }
    options.url = url;
    options.data = data;
    options.method = "PUT";
    return this.request(options);
  },
  delete(url, data, options) {
    if (!options) {
      options = {};
    }
    options.url = url;
    options.data = data;
    options.method = "DELETE";
    return this.request(options);
  }
};

/**
 * 请求接口日志记录
 */
function _reqlog(req) {
  if (process.env.NODE_ENV === "development") {
    if (req.data) {
      console.log(
        "【" + req.requestId + "】 请求参数：" + JSON.stringify(req.data)
      );
    }
  }
  //TODO 调接口异步写入日志数据库
}

/**
 * 响应接口日志记录
 */
function _reslog(res) {
  if (process.env.NODE_ENV === "development") {
    console.log(
      "【" + res.config.requestId + "】 响应结果：" + JSON.stringify(res)
    );
  }
  //TODO 除了接口服务错误外，其他日志调接口异步写入日志数据库
  // switch(_statusCode){
  // 	case 200:
  // 		break;
  // 	case 401:
  // 		break;
  // 	case 404:
  // 		break;
  // 	default:
  // 		break;
  // }
}
