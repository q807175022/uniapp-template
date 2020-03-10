/* 时间格式化方法
 * time 时间,为null则取当前时间
 * fmt  时间格式
 * */
export function dateFormat(time, fmt) {
  fmt = fmt ? fmt : 'yyyy-MM-dd hh:mm:ss'
  let date = time ? new Date(time) : new Date();
  let o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds() //毫秒
  };

  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  }
  return fmt;
}

/* 引入指舞SDK
*
* */
export function importSDK_zw() {
  let zw = document.createElement("script")
  let date = new Date()
  let datestr = `${date.getFullYear().toString().substr(2, 2)}${(date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)}${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}`
  zw.src = `https://ssl-divine.cdn.h55u.com/platform/js/zwSdk.js?v=${datestr}`
  document.getElementsByTagName("head")[0].appendChild(zw)
}

/* 劫持用户返回
*  type    1：安装劫持  2：卸载劫持
*  link     跳转地址
* */
function goBack() {
  let zwUid = localStorage.getItem("zwUid")
  if (zwUid) {
    window.zwDivine.divineList()
  }else {
    window.location.href = window.back_link
  }
}
export function setRouterHijack(type,link) {
  if (window.location.search.search(/(&|\?)notjump/) !=-1) {
    return false
  }
  if(type==1){
    window.back_link = link
    window.history.pushState(null, null, document.URL);
    window.addEventListener('popstate',goBack, false);
  }else {
    window.removeEventListener('popstate',goBack,false);
  }
}