/* 时间格式化方法
 * time 时间,为null则取当前时间
 * fmt  时间格式
 * */
export function dateFormat(time, fmt) {
  fmt = fmt ? fmt : "yyyy-MM-dd hh:mm:ss";
  let date = time ? new Date(time) : new Date();
  let o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds() //毫秒
  };

  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return fmt;
}

/* 引入指舞SDK
 *
 * */
export function importSDK_zw() {
  let zw = document.createElement("script");
  let date = new Date();
  let datestr = `${date
    .getFullYear()
    .toString()
    .substr(2, 2)}${
    date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
  }${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}${
    date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
  }`;
  zw.src = `https://ssl-divine.cdn.h55u.com/platform/js/zwSdk.js?v=${datestr}`;
  document.getElementsByTagName("head")[0].appendChild(zw);
}

/* 劫持用户返回
 *  type    1：安装劫持  2：卸载劫持
 *  link     跳转地址
 * */
function goBack() {
  let zwUid = localStorage.getItem("zwUid");
  if (zwUid) {
    window.zwDivine.divineList();
  } else {
    window.location.href = window.back_link;
  }
}
export function setRouterHijack(type, link) {
  if (window.location.search.search(/(&|\?)notjump/) != -1) {
    return false;
  }
  if (type == 1) {
    window.back_link = link;
    window.history.pushState(null, null, document.URL);
    window.addEventListener("popstate", goBack, false);
  } else {
    window.removeEventListener("popstate", goBack, false);
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== "object") {
    throw new Error("error arguments", "deepClone");
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === "object") {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}

/*
 * json序列化为query形式
 * */
export function jsonToQuery(obj) {
  return Object.keys(obj)
    .map(function(key) {
      return encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]);
    })
    .join("&");
}

/*
 * UV统计方法
 * */
export function recordUv(type) {
  if (!type) {
    return false;
  }
  // #ifndef H5
  let baseURL =
    process.env.NODE_ENV === "development"
      ? "https://dev.ya73r.cn"
      : "https://www.yizhiclass.com";
  // #endif

  // #ifdef H5
  let baseURL =
    process.env.NODE_ENV === "development"
      ? "https://dev.ya73r.cn"
      : window.location.origin;
  // #endif

  const createRequest = function(data) {
    //创建image请求，以统计UV
    let str = "";
    for (let prop in data) {
      str += prop + "=" + data[prop] + "&";
    }
    let url = baseURL + "/api/statistics?" + str.substr(0, str.length - 1);
    uni.request({
      url: url
    });
  };
  let openid = uni.getStorageSync("openid");
  openid = openid && openid != "undefined" ? openid : 0;
  let path_id = uni.getStorageSync("path_id");
  path_id = path_id && path_id != "undefined" ? path_id : 0;
  switch (type) {
    case 1:
      //链接首页UV
      createRequest({
        spr_id: path_id,
        openid: openid,
        type: "spread_index_uv"
      });
      break;
    case 2:
      //首页返回退出UV
      createRequest({
        spr_id: path_id,
        openid: openid,
        type: "index_backUrl_click"
      });
      break;
    case 3:
      //付费亲算UV
      createRequest({
        spr_id: path_id,
        openid: openid,
        type: "ooo_click_uv"
      });
      break;
    case 4:
      //点击立即测算UV
      createRequest({
        spr_id: path_id,
        openid: openid,
        type: "click_forecast_uv"
      });
      break;
    case 5:
      //提交输入信息UV
      createRequest({
        spr_id: path_id,
        openid: openid,
        type: "input_data_uv"
      });
      break;
    case 6:
      //唤起订单弹窗UV
      createRequest({
        spr_id: path_id,
        openid: openid,
        type: "order_popup_uv"
      });
      break;
    case 7:
      //正常支付UV
      createRequest({
        spr_id: path_id,
        openid: openid,
        type: "normal_pay_uv"
      });
      break;
    case 8:
      //结果页UV
      createRequest({
        spr_id: path_id,
        openid: openid,
        type: "result_uv"
      });
      break;
    case 9:
      //结果页二次支付UV
      createRequest({
        spr_id: path_id,
        openid: openid,
        type: "result_twice_pay_uv"
      });
      break;
    case 10:
      //挽回页UV
      createRequest({
        spr_id: path_id,
        openid: openid,
        type: "recover_uv"
      });
      break;
    case 11:
      //挽回页支付UV
      createRequest({
        spr_id: path_id,
        openid: openid,
        type: "recover_pay_uv"
      });
      break;
    case 12:
      //领取报告UV
      createRequest({
        spr_id: path_id,
        openid: openid,
        type: "get_report_uv"
      });
      break;
  }
}
