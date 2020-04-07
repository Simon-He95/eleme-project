<template>
  <transition name="move">
    <div class="food" v-show="showFlag" ref="foodDetail">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image" alt="" class="img">
          <div class="back" @click="showFlag = false">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="detail">
          <priceComponent :food="food"></priceComponent>
          <transition name="buy">
            <div class="buy" v-show="!food.count || food.count === 0" @click.stop.prevent="addCart($event)">
              加入购物车
            </div>
          </transition>
        </div>
        <!--底部分界线-->
        <Split v-show="food.info"></Split>
        <!--商品信息-->
        <div class="food-intro" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <!--底部分界线-->
        <Split></Split>
        <!--商品评价-->
        <div class="food-rating">
          <h1 class="title">商品评价</h1>
          <ratingSelect :selectType="selectType" :onlyContent="onlyContent" :desc="desc"
                        :ratings="food.ratings"></ratingSelect>
        </div>
        <div class="rating-wrapper">
          <ul v-show="food.ratings && food.ratings.length">
            <li v-show="needShow(rating.rateType,rating.text)" v-for="(rating,index) in food.ratings" :key="index" class="rating-item border-bottom">
              <div class="user">
                <span class="name">{{rating.username}}</span>
                <img class="avatar" width="12" height="12" :src="rating.avatar" alt="">
              </div>
              <div class="time">{{rating.rateTime | convertTime('YYYY-MM-DD HH:mm')}}</div>
              <p class="comment">
                <span class="icon" :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
              </p>
            </li>
          </ul>
          <!--如果评价为空,则显示暂无评价-->
          <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Vue from 'vue'
  import priceComponent from '../common/price/price'
  import BScroll from 'better-scroll'
  import Split from '../common/split/split'
  import ratingSelect from '../common/rating/ratingSelect'


  const ALL = 2;

  export default {
    name: "food",
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false,
        scrollWrapper: "",
        selectType: ALL,
        onlyContent: false,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      }
    },
    methods: {
      show() {
        this.showFlag = true;
        this.selectType = ALL;
        this.onlyContent = false;


        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.scrollWrapper, {click: true})
          } else {
            this.scroll.refresh();
          }
        })
      },
      addCart(event) {
        if (!event._constructed) {
          return;
        }
        Vue.set(this.food, 'count', 1)
        this.$bus.$emit('sendCount', event.target)
        //因为点击完购物车display为none，event对象拿不到，小球加入购物车动画就失效了
        // 方法：给加入购物车也添加动画，让他不是立即display变为none，来实现动画
      },
      needShow(type,text){
        if(this.onlyContent && !text){  //只显示有内容的评价为true，且rating.text内容为空时,返回false，这一条不显示
          return false;
        }
        if (this.selectType === ALL){   //如果选择类型是全部，则返回true，显示
          return true;
        }else {
          return type === this.selectType;  //否则，判断rating.type，这一条数据的type和选择的type类型一致，则显示，否则不显示
        }
      }
    },
    components: {
      priceComponent,
      Split,
      ratingSelect
    },
    mounted() {
      this.scrollWrapper = this.$refs.foodDetail
    },
    created() {
      this.$nextTick(() => {
        this.$bus.$on('ratingType',(data) => {
          this.selectType = data;
        });
        this.$bus.$on('contentRating',(data) => {
          this.onlyContent = data;
        })
      })
    }
  }
</script>

<style scoped>
  .food {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 48px;
    z-index: 30;
    width: 100%;
    background: #FFFFFF;
    transition: all .2s linear;
    transform: translate3d(0, 0, 0);
  }

  .move-enter, .move-leave-to {
    transform: translate3d(100%, 0, 0);
  }

  .food .food-content .image-header {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 100%;
  }

  .food .food-content .image-header .img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .food .food-content .image-header .back {
    position: absolute;
    top: 10px;
    left: 0;
  }

  .food .food-content .image-header .back .icon-arrow_lift {
    display: block;
    padding: 10px;
    font-size: 20px;
    color: #FFFFFF;
  }

  .priceComponent >>> .content .name {
    font-weight: 700 !important;
  }

  .priceComponent >>> .content .desc {
    display: none;
  }

  .priceComponent >>> .content .extra {
    margin-bottom: 18px !important;
  }

  .priceComponent >>> .content .cartControl-wrapper {
    right: 18px !important;
    bottom: 12px !important;
  }

  .food .food-content .detail {
    position: relative;
  }

  .food .food-content .detail .buy {
    position: absolute;
    right: 18px;
    bottom: 18px;
    z-index: 10;
    line-height: 24px;
    text-align: center;
    padding: 0 12px;
    font-size: 10px;
    border-radius: 12px;
    background: rgb(0, 160, 220);
    color: #FFFFFF;
    transition: all .5s;
  }

  .buy-enter, .buy-leave-to {
    display: none;
  }

  .food .food-content .food-intro, .priceComponent {
    padding: 18px;
  }

  .food .food-content .food-intro .title, .food-rating .title {
    font-size: 14px;
    color: rgb(7, 17, 27);
    line-height: 14px;
  }

  .food .food-content .food-rating {
    padding-top: 18px;
  }

  .food .food-content .food-rating .title {
    margin-left: 18px;
  }

  .food .food-content .food-intro .title {
    margin-bottom: 6px;
  }

  .food .food-content .food-intro .text {
    font-size: 12px;
    line-height: 24px;
    color: rgb(77, 85, 93);
    padding: 0 8px;
  }
  .food .rating-wrapper {
    padding: 0 18px;
  }
  .food .rating-wrapper .rating-item {
    position: relative;
    padding: 16px 0;
  }
  .food .rating-wrapper .rating-item .user {
    position: absolute;
    right: 0;
    top: 16px;
    line-height: 12px;
    font-size: 0;
  }
  .food .rating-wrapper .rating-item .user .name {
    display: inline-block;
    margin-right: 6px;
    vertical-align: top;
    font-size: 10px;
    color: rgb(147,153,159);
  }
  .food .rating-wrapper .rating-item .user .avatar{
    border-radius: 50%;
  }
  .food .rating-wrapper .rating-item .time {
    margin-bottom: 6px;
    font-size: 10px;
    color: rgb(147,153,159);
    line-height: 12px;
  }
  .food .rating-wrapper .rating-item .comment {
    font-size: 12px;
    color: rgb(7,17,27);
    line-height: 16px;
    vertical-align: top;
  }
  .food .rating-wrapper .rating-item .comment .icon {
    font-size: 12px;
    color: rgb(147,153,159);
    line-height: 16px;
    margin-right: 4px;
    vertical-align: top;
  }
  .food .rating-wrapper .rating-item .comment .icon-thumb_up{
    color: rgb(0,160,220);
  }
  .food .rating-wrapper .no-rating{
    padding: 16px 0;
    font-size: 12px;
    color: rgb(147,153,159);
  }
</style>
