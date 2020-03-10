const getters = {
	path_id: state => state.index.path_id,
	tid: state => state.index.tid,
	appid: state => state.index.appid,
	openid: state => state.index.openid,
	price: state => state.index.price,
	user_id: state => state.index.user_id,
	Counter: state => state.progress.Counter
}
export default getters