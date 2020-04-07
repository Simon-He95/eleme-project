<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <div class="grades">{{seller.score}}</div>
          <div class="rating">综合评分</div>
          <div class="over">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <Star :size="36" :score="seller.score"></Star>
            <span class="score">{{seller.score}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <Star :size="36" :score="seller.foodScore"></Star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="arrive-time">
            <span class="title">送达时间</span>
            <span class="time">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <Split></Split>
      <ratingSelect :ratings="ratings" :selectType="selectType" :desc="desc" :onlyContent="onlyContent"></ratingSelect>
      <div class="comment-list ">
        <ul>
          <li v-show="needShow(comment.rateType,comment.text)" v-for="(comment,index) in ratings" :key="index">
            <div class="content border-bottom">
              <img :src="comment.avatar" width="28" height="28" alt="" class="avatar">
              <div class="info">
                <div class="name">{{comment.username}}</div>
                <Star :size="24" :score="comment.score"></Star>
                <span class="time">{{comment.deliveryTime}}分钟送达</span>
              </div>
              <div class="comment-time">{{comment.rateTime | convertTime('YYYY-MM-DD HH:ss')}}</div>
              <div class="comment-bottom">
                <div class="comment-content">
                  {{comment.text}}
                </div>
                <div class="comment-recommend" >
                  <span :class="{'icon-thumb_up':comment.rateType===0,'icon-thumb_down':comment.rateType===1}"></span>
                  <ul v-show="comment.recommend" class="recommend-ul">
                    <li v-for="(recommend,index) in comment.recommend" class="recommend">
                      {{recommend}}
                    </li>
                  </ul>

                </div>
              </div>
            </div>
          </li>
        </ul>
        <!--如果评价为空,则显示暂无评价-->
        <div class="no-rating" v-show="!ratings.length">暂无评价</div>
      </div>
    </div>
  </div>
</template>

<script>
  import Star from '../common/star/star'
  import Split from '../common/split/split'
  import ratingSelect from '../common/rating/ratingSelect'
  import shopCart from '../ShopCart/shopcart'
  import BScroll from 'better-scroll'

  const ERR_OK = 0;
  const ALL = 2;

  export default {
    name: "ratings",
    props:{
      seller:{
        type:Object
      }
    },
    data() {
      return {
        ratings:[],
        selectType: ALL,
        desc: {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        },
        onlyContent: false,
        scrollWrapper:""
      }
    },
    components: {
      Star,
      Split,
      ratingSelect,
      shopCart
    },
    methods:{
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
    created() {
      this.$axios.get('./api/ratings').then(res => {
        if (res.data.errno === ERR_OK) {
          this.ratings = res.data.data
          this.$nextTick(() => {
            if(!this.scroll){
              this.scroll = new BScroll(this.scrollWrapper,{click:true});
            }else {
              this.scroll.refresh();
            }
          })
        }
      }).catch(err => {
        console.log(err)
      })
      //数据更新通知到父组件
      this.$nextTick(() => {
        this.$bus.$on('ratingType',(data) => {
          this.selectType = data;
          console.log(data)
        });
        this.$bus.$on('contentRating',(data) => {
          this.onlyContent = data;
          console.log(data)
        })
      })
    },
    mounted() {
      this.scrollWrapper = this.$refs.ratings;
    }
  }
</script>

<style scoped>
  .ratings {
    position: absolute;
    top: 177px;
    width: 100%;
    left: 0;
    bottom: 0;
    overflow: hidden;
  }

  .ratings .ratings-content .overview {
    display: flex;
    padding: 18px 0;
  }

  .ratings .ratings-content .overview .overview-left {
    flex: 0 0 137px;
    width: 137px;
    text-align: center;
    border-right: 1px solid rgba(7,17,27,0.1);
    padding: 6px 0;
  }

  .ratings .ratings-content .overview .overview-right {
    flex: 1;
  }
  .ratings .ratings-content .overview .overview-left .grades {
    font-size: 24px;
    color: rgb(255,153,0);
    line-height: 28px;
    margin-bottom: 6px;
    font-weight: 700;
  }
  .ratings .ratings-content .overview .overview-left .rating {
    font-size: 12px;
    color: rgb(7,17,27);
    line-height: 12px;
    margin-bottom: 8px;
    font-weight: 700;
  }
  .ratings .ratings-content .overview .overview-left .over {
    font-size: 12px;
    color: rgb(147,153,159);
    line-height: 12px;
  }
  .ratings .ratings-content .overview .overview-right {
    padding: 6px 0 6px 24px;
  }
  .ratings .ratings-content .overview .overview-right .score-wrapper {
    margin-bottom: 8px;
  }
  .ratings .ratings-content .overview .overview-right .score-wrapper, .arrive-time{
    font-size: 0;
  }
  .ratings .ratings-content .overview .overview-right .score-wrapper .score {
    font-size: 12px;
    color: rgb(255,153,0);
    line-height: 18px;
    margin-right: 24px;
  }
  .ratings .ratings-content .overview .overview-right .score-wrapper .title, .arrive-time .title {
    font-size: 12px;
    color: rgb(7,17,27);
    line-height: 18px;
  }
  .star{
    display: inline-block;
    margin: 0 12px;
  }
  .ratings .ratings-content .overview .overview-right .arrive-time .time {
    font-size: 12px;
    color: rgb(147,153,159);
    line-height: 18px;
    margin: 0 12px;
  }
  .ratings .ratings-content .comment-list {
    margin: 0 18px ;
  }
  .ratings .ratings-content .comment-list  .content {
    padding: 18px 0;
    position: relative;
    font-size: 0;
  }
  .ratings .ratings-content .comment-list  .content .info{
    display: inline-block;
    font-size: 0;
  }
  .ratings .ratings-content .comment-list .content .info .time {
    font-size: 10px;
    color: rgb(147,153,159);
    line-height: 12px;
  }
  .ratings .ratings-content .comment-list .content .info .name {
    font-size: 10px;
    color: rgb(7,17,27);
    line-height: 12px;
    margin-bottom: 4px;
  }
  .ratings .ratings-content .comment-list .content .comment-time {
    position: absolute;
    right: 0;
    top: 18px;
    font-size: 10px;
    color: rgb(147,153,159);
    line-height: 12px;
  }
  .ratings .ratings-content .comment-list .content .info .star {
    margin: 0 6px 6px 0;
  }
  .ratings .ratings-content .comment-list .content .avatar {
    border-radius: 50%;
    margin-right: 12px;
  }
  .ratings .ratings-content .comment-list .content .comment-bottom {
    padding-left: 40px;
  }
  .ratings .ratings-content .comment-list .content .comment-bottom .comment-content {
    font-size: 12px;
    color: rgb(7,17,27);
    line-height: 18px;
    margin-bottom: 8px;
  }
  .ratings .ratings-content .comment-list .content .comment-bottom .comment-recommend {
    font-size: 0;
    line-height: 18px;
    display: flex;
  }
  .ratings .ratings-content .comment-list .content .comment-bottom .comment-recommend .icon-thumb_up{
    color: rgb(0,160,220);
    font-size: 12px;
  }
  .ratings .ratings-content .comment-list .content .comment-bottom .comment-recommend .icon-thumb_down {
    color: rgb(183,187,191);
    font-size: 12px;
  }
  .ratings .ratings-content .comment-list .content .comment-bottom .comment-recommend .recommend {
    display: inline-block;
    box-sizing: border-box;
    border: 1px solid rgba(7,17,27,0.1);
    border-radius: 2px;
    padding: 0 6px;
    font-size: 9px;
    color: rgb(147,153,159);
    line-height: 16px;
    margin-left: 8px;
  }
  .ratings .ratings-content .comment-list .content .comment-bottom .comment-recommend .recommend-ul {
    display: inline-block;
  }
  .ratings .ratings-content .comment-list .no-rating{
    padding: 16px 0;
    font-size: 12px;
    color: rgb(147,153,159);
  }
</style>
