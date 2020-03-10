import request from "./request";

export function decodeOpenid(params) {
  return request.get("/api/getTouTiaoOpenId", params);
}

export function getIndexUrl(params) {
  return request.post("/api/getLink", params);
}
