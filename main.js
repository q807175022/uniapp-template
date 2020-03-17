import Vue from "vue";
import App from "./App";
import store from "./store";
import { recordUv } from "./utils/utils";
Vue.config.productionTip = false;

Vue.prototype.recordUv = recordUv;
Vue.prototype.$store = store;

App.mpType = "app";

const app = new Vue({
  store,
  ...App
});
app.$mount();
