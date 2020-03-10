/**
 * @author Kenny qiu
 * @date 2020/2/19
 * @description 首页共享数据文件
 */

const state = {
  price: 0,
  tid: 3,
  appid: "tt71a0071dee8aabe3",
  openid: "",
  path_id: null,
  agent_id: null,
  user_id: null
};

const mutations = {
  login(state, response) {
    state.openid = response.openid;
    state.price = response.price;
    uni.setStorageSync("price", response.price);
    uni.setStorageSync("openid", response.openid);
    if (!state.path_id) {
      state.path_id = response.path_id;
      uni.setStorageSync("path_id", response.path_id);
    }
    if (response.agent_id) {
      state.agent_id = response.agent_id;
      uni.setStorageSync("agent_id", response.agent_id);
    }
  },
  set_price(state, price) {
    state.price = price;
    uni.setStorageSync("price", price);
  },
  set_path_id(state, path_id) {
    state.path_id = path_id;
    uni.setStorageSync("path_id", path_id);
  },
  set_userid(state, user_id) {
    state.user_id = user_id;
    uni.setStorageSync("user_id", user_id);
  },
  set_openid(state, openid) {
    state.openid = openid;
    uni.setStorageSync("openid", openid);
  }
};

export default {
  namespaced: true, //设置单独作用域，避免各个模块起冲突
  state,
  mutations
};
