import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "../../../qiyeshixun/reggie-frontend-manager/src/styles/common.css";
import "../../../qiyeshixun/reggie-frontend-manager/src/styles/page.css";
import "../../../qiyeshixun/reggie-frontend-manager/src/styles/icon/iconfont.css";
import store from '../../../qiyeshixun/reggie-frontend-manager/src/store';

Vue.config.productionTip = false; //这段代码是一个基于Vue.js框架的前端应用程序的入口文件。

Vue.use(ElementUI);


Vue.prototype.$apiBaseUrl = process.env.VUE_APP_API_BASE_URL;


new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount("#app");

