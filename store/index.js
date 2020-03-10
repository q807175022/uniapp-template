/**
 * @author Kenny qiu
 * @date 2020/2/19
 * @description Vuex模块加载主体文件
 */
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

/*
* Vuex 模块文件加载
*/
// 获得模块文件的句柄
const modulesFiles = require.context('./modules', true, /\.js$/)

// 引入所有的vuex module，进行自动加载模块文件
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
	const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1') //使用正则匹配到路径
	const value = modulesFiles(modulePath) //加载模块文件
	modules[moduleName] = value.default
	return modules
}, {})

const store = new Vuex.Store({
	modules,
	getters
})

export default store