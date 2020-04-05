<template>
  <div>
    <div class="shopCart">
  <!--购物车底部栏组件-->
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight':totalCount > 0}">
              <i class="icon-shopping_cart" :class="{'highlight':totalCount > 0}"></i>
            </div>
            <div class="num">{{totalCount}}</div>
          </div>
          <div class="price">￥{{totalPrice}}</div>
          <div class="desc">另需配送费{{deliveryPrice}}元</div>
        </div>
        <div class="content-right">
          <div class="pay" :class="payClass" @click.stop.prevent="pay">{{payDesc}}</div>
        </div>
      </div>
  <!--小球飞入购物车动画-->
      <div class="ball-container">
        <transition-group @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter" name="drop">
          <div v-for="(ball,index) in balls" :key="ball.id" v-show="ball.show" class="ball">
            <div class="inner inner-hook"></div>
          </div>
        </transition-group>
      </div>
  <!--底部购物弹出层-->
      <transition name="toggle">
        <div class="cart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="clear">清空</span>
          </div>
          <div class="list-content" ref="listToggle">
            <ul>
              <li class="food border-bottom" v-for="(food,index) in selectFoods">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price*food.count}}</span>
                </div>
                <div class="cartControl-wrapper">
                  <cartControl :food="food"></cartControl>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
    <div class="list-mask" v-show="listShow" @click="fold = true"></div>
    </transition>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  export default {
    name: "shopcart",
    data() {
      return {
        balls: [
          {
            show: false,
            id: 0
          },
          {
            show: false,
            id: 1
          },
          {
            show: false,
            id: 2
          },
          {
            show: false,
            id: 3
          },
          {
            show: false,
            id: 4
          },
        ],  //ball点击完状态变成true，动画完成后变回false，可以重复使用
        dropBalls: [],
        menuToggleScroll:"",
        fold:true
      }
    },
    props: {
      selectFoods: {
        type: Array,
        default() {
          return [
            {
              price: 0,
              count: 0
            }
          ]
        }
      },
      deliveryPrice: {
        type: Number
      },
      minPrice: {
        type: Number
      },
    },
    computed: {
      totalPrice() {
        let total = 0;
        this.selectFoods.forEach((food) => {
          total += food.price * food.count
        })
        return total
      },
      totalCount() {
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        })
        return count;
      },
      payDesc() {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}元起送`
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice;
          return `还差${diff}元起送`
        } else {
          return '去结算'
        }
      },
      payClass() {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough'
        } else {
          return 'enough'
        }
      },
      listShow(){
        if(!this.totalCount){
          this.fold = true;
          return false;
        }
        let show = !this.fold;
        if(show){
          this.$nextTick(() =>{
            if(!this.scroll){   //判断是否存在，不存在重新new一个，存在就刷新，否则每次点击状态变更都要new一个scroll
              this.scroll = new BScroll(this.menuToggleScroll, {click:true})	//通过new BScroll 即可实现
            }else {
              this.scroll.refresh();
            }
          })
        }
        return show
      }
    },
    methods: {
      drop(el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      beforeEnter(el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -rect.top + 22;
            el.style.opacity = 1;
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
        this.clickable = false
      },
      enter(el) {
        let rf = el.offsetHeight; // 主动触发浏览器重绘
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
          el.style.opacity = 0;
        })
      },
      afterEnter(el) {
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
        }
      },
      toggleList() {
        if (!this.totalCount) {
          return;
        }
        this.fold = !this.fold;
      },
      clear(){
        this.selectFoods.forEach((food) => {
          food.count = 0;
        })
      },
      pay(){
        if(this.totalPrice < this.minPrice){
          return;
        }
        window.alert(`需要支付${this.totalPrice}元`);
      }
    },
    mounted() {
      this.menuToggleScroll = this.$refs.listToggle
    },

  }

</script>

<style scoped>
  .shopCart {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 50;
    width: 100%;
    height: 48px;
  }

  .shopCart .content {
    display: flex;
    background: #141d27;
    color: rgba(255, 255, 255, 0.4);
  }

  .shopCart .content .content-left {
    flex: 1;
    font-size: 0;
  }

  .shopCart .content .content-left .logo-wrapper {
    display: inline-block;
    vertical-align: top;
    position: relative;
    top: -10px;
    margin: 0 12px;
    padding: 6px;
    width: 56px;
    height: 56px;
    box-sizing: border-box;
    border-radius: 50%;
    background: #141d27;
  }

  .shopCart .content .content-left .logo-wrapper .num {
    position: absolute;
    top: 0;
    right: 0;
    width: 24px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    border-radius: 16px;
    font-size: 9px;
    font-weight: 700;
    color: #FFFFFF;
    background: rgb(240, 20, 20);
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
  }

  .shopCart .content .content-left .logo-wrapper .logo {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #2b343c;
    text-align: center;
  }

  .shopCart .content .content-left .logo-wrapper .highlight {
    background: rgb(0, 160, 220);
    color: #FFFFFF !important;
  }

  .shopCart .content .content-left .logo-wrapper .logo .icon-shopping_cart {
    font-size: 24px;
    color: #80858a;
    line-height: 44px;
  }

  .shopCart .content .content-left .price {
    display: inline-block;
    vertical-align: top;
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    margin-top: 12px;
    padding-right: 12px;
    box-sizing: border-box;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 16px;
    font-weight: 700;
  }

  .shopCart .content .content-left .desc {
    display: inline-block;
    vertical-align: top;
    margin-left: 12px;
    font-size: 10px;
    line-height: 48px;
    font-weight: 700;
  }

  .shopCart .content .content-right {
    flex: 0 0 105px;
    width: 105px;
  }

  .shopCart .content .content-right .pay {
    font-weight: 700;
    line-height: 48px;
    text-align: center;
    font-size: 12px;
  }

  .shopCart .content .content-right .not-enough {
    background: #2b333b;
  }

  .shopCart .content .content-right .enough {
    background: #00b43c;
    color: #FFFFFF;
  }

  .shopCart .ball-container .ball {
    position: fixed;
    left: 32px;
    bottom: 22px;
    z-index: 200;
    transition: all .4s cubic-bezier(.42, -0.5, .2, .65);
  }

  .shopCart .ball-container .ball .inner {
    width: 16px;
    height: 16px;
    background: rgb(0, 160, 220);
    border-radius: 50%;
    transition: all .4s ease;
  }

  .shopCart .cart-list{
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    width: 100%;
    transform: translate3d(0,-100%,0);
    transition: all .4s ease;
  }

  .shopCart .cart-list .list-header{
    height: 40px;
    background: #f3f5f7;
    padding: 0 18px;
    line-height: 40px;
    border-bottom: 1px solid rgba(7,17,27,0.1);
  }
  .shopCart .cart-list .list-header .title{
    float: left;
    font-size: 14px;
    color: rgb(7,17,27);
  }
  .shopCart .cart-list .list-header .empty{
    float: right;
    font-size: 12px;
    color: rgb(0,160,220);
  }
  .toggle-enter, .toggle-leave-to{
    transform: translate3d(0,0,0);
    opacity: 0;
  }
  .shopCart .cart-list .list-content{
    padding: 0 18px;
    max-height: 217px;
    overflow: hidden;
    background: #FFFFFF;
  }
  .shopCart .cart-list .list-content .food{
    position: relative;
    padding: 12px 0;
    box-sizing: border-box;
  }
  .shopCart .cart-list .list-content .food .name{
    line-height: 24px;
    font-size: 14px;
    color: rgb(7,17,27);
  }
  .shopCart .cart-list .list-content .food .price{
    position: absolute;
    right: 90px;
    bottom: 12px;
    line-height: 24px;
    font-size: 14px;
    font-weight: 700;
    color: rgb(240,20,20);
  }
  .shopCart .cart-list .list-content .food .cartControl-wrapper{
    position: absolute;
    right: 0px;
    bottom: 6px;
  }
  .list-mask{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 40;
    opacity: 1;
    background: rgba(7,17,27,0.6);
    backdrop-filter: blur(10px);
    transition: all 0.5s;
  }
  .fade-enter, .fade-leave-to{
    opacity: 0;
    background: rgba(7,17,27,0);
  }
</style>
