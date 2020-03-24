import request from "./request";
// 计算OPENID
export function decodeOpenid(params) {
  return request.get("/api/getTouTiaoOpenId", params);
}
// 绑定代理商
export function bindAgents(params) {
  return request.post("/api/agent/bind_agents", params);
}
// 获取首页链接
export function getIndexUrl(params) {
  return request.post("/api/getLink", params);
}
import { jsonToQuery } from "../utils/utils";

export function doPay(params, type) {
  if (type === 2) {
    return window.location.assign(
      request.config.baseUrl + "/api/v1/invest/DoPay?" + jsonToQuery(params)
    );
  } else {
    return request.post("/api/v1/invest/DoPay", params);
  }
}

export function getResult(params, type) {
  return request.get("/api/v1/invest/Result", params);
}
