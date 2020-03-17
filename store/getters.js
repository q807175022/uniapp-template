const getters = {
  path_id: state => {
    return state.index.path_id || uni.getStorageSync("path_id");
  },
  openid: state => {
    return state.index.openid || uni.getStorageSync("openid");
  },
  price: state => {
    return state.index.price || uni.getStorageSync("price");
  },
  tid: state => state.index.tid,
  appid: state => state.index.appid,
  user_id: state => state.index.user_id,
  agent_id: state => state.index.agent_id
};
export default getters;
