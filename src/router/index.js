import Vue from 'vue'
import Router from 'vue-router'
import App from "../App";
import goods from "../components/Goods/goods";
import ratings from "../components/Ratings/ratings";
import seller from "../components/Seller/seller";

Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      redirect:'/goods'
    },
    {
      path: '/goods',
      name: 'goods',
      component: goods
    },
    {
      path: '/ratings',
      name: 'ratings',
      component: ratings
    },
    {
      path: '/seller',
      name: 'seller',
      component: seller
    }
  ]
})
