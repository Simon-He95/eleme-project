// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '../static/css/global.css'
import Axios from 'axios'
import Moment from 'moment'

//配置axios
Vue.prototype.$axios = Axios.create({baseURL:'http://localhost:3333'});
console.log(Axios);
Vue.config.productionTip = false

//引入全局star组件
import star from './components/common/star/star'
Vue.component(star.name,star);

//BUS总线传值
import EventBus from './EventBus'
Vue.prototype.$bus = EventBus;

//引入全局cartControl组件
import cartControl from './components/common/cart/cartControl'
Vue.component(cartControl.name,cartControl);

//引入全局时间过滤器
Vue.filter('convertTime',function (data,formatStr) {
  return Moment(data).format(formatStr);
})
Moment.locale('zh-cn');

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
