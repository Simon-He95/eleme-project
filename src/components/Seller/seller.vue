<template>
    <div class="seller" ref="sellerDom" >
      <div>
        <div class="seller-wrapper">
          <div class="seller-info border-bottom">
            <div class="info">
              <div class="name">{{seller.name}}</div>
              <Star :size="36" :score="seller.score"></Star>
              <span class="ratingCount">({{seller.ratingCount}})</span>
              <span class="sellCount">月售{{seller.sellCount}}单</span>
            </div>
            <div class="collect" @click="toggleFavorite($event)">
              <div class="icon-favorite" :class="{'active':favorite}"></div>
              <div class="text">{{favoriteText}}</div>
            </div>
          </div>
          <div class="seller-need">
            <div class="initialPrice">
              <div class="text">起送价</div>
              <div class="content">{{seller.minPrice}}<span class="word">元</span></div>
            </div>
            <div class="sendPrice">
              <div class="text">商家配送</div>
              <div class="content">{{seller.deliveryPrice}}<span class="word">元</span></div>
            </div>
            <div class="sendTime">
              <div class="text">平均配送时间</div>
              <div class="content">{{seller.deliveryTime}}<span class="word">分钟</span></div>
            </div>
          </div>
        </div>
        <Split></Split>
        <div class="bulletin">
          <h1 class="title">公告与活动</h1>
          <div class="content-wrapper border-bottom">
            <p class="content">{{seller.bulletin}}</p>
          </div>
          <ul v-if="seller.supports" >
            <li v-for="(item,key) in seller.supports" class="bulletin-item border-bottom">
              <span class="icon" :class="classMap[seller.supports[key].type]"></span>
              <span class="text">{{seller.supports[key].description}}</span>
            </li>
          </ul>
        </div>
        <Split></Split>
        <div class="pics">
          <h1 class="title">商家实景</h1>
          <div class="pic-wrapper" ref="picWrapper">
            <ul class="pic-list" ref="picList">
              <li class="pic-item" v-for="(pic,index) in seller.pics">
                <img :src="pic" width="120" height="90" alt="">
              </li>
            </ul>
          </div>
        </div>
        <Split></Split>
        <div class="company-info">
          <h1 class="title border-bottom">商家信息</h1>
          <ul>
            <li class="info-item border-bottom" v-for="(info,index) in seller.infos" :key="index">
              {{info}}
            </li>
          </ul>
        </div>
      </div>
  </div>
</template>

<script>
  import Star from '../common/star/star'
  import Split from '../common/split/split'
  import {saveToLocal,loadFromLocal} from "../../common/js/store";
  import BScroll from 'better-scroll'

  export default {
    name: "seller",
    data() {
      return {
        favorite: (() => {
          return loadFromLocal(this.seller.id,'favorite',false)
        })()
      }
    },
    props: {
      seller: {
        type: Object
      }
    },
    components: {
      Split,
      Star
    },
    created() {
      this.classMap = ['decrease-bg', 'discount-bg', 'special-bg', 'invoice-bg', 'guarantee-bg']
    },
    watch:{
      seller(){
        this._initialScroll();
        this._initaialPicsScroll();
      }
    },
    mounted(){
      this._initialScroll();
      this._initaialPicsScroll();
    },
    methods:{
      _initialScroll(){
        if(!this.scroll){
          this.scroll = new BScroll(this.$refs.sellerDom,{click:true})
        }
      },
      _initaialPicsScroll(){
        if(this.seller.pics) {
          let picWidth = 120;
          let margin = 6;
          let width =(picWidth + margin) * this.seller.pics.length - margin;  //计算出ul 的图片长度,只有内部ul长度超出外部盒子，才可发生滚动
          this.$refs.picList.style.width = width + 'px'
          this.$nextTick(() => {
            if(!this.picScroll){
              this.picScroll = new BScroll(this.$refs.picWrapper,{scrollX: true,eventPassthrough:'vertical'})
            }else {
              this.picScroll.refresh();
            }
          })
        }
      },
      toggleFavorite(event){
        if(!event._constructed){
          return;
        }
        this.favorite = !this.favorite;
        saveToLocal(this.seller.id,'favorite',this.favorite);
      }
    },
    computed:{
      favoriteText(){
        return this.favorite? '已收藏':'收藏'
      }
    }
  }
</script>

<style scoped>
  .seller {
    position: absolute;
    top: 177px;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
  }
  .seller .seller-wrapper .seller-info {
    margin: 0 18px;
    font-size: 0;
    padding: 18px 0;
    position: relative;
  }
  .seller .seller-wrapper .seller-info .name {
    font-size: 14px;
    color: rgb(7,17,27);
    line-height: 14px;
    margin-bottom: 8px;
    font-weight: 700;
  }
  .seller .seller-wrapper .seller-info .star {
    display: inline-block;
    margin-right: 8px;
  }
  .seller .seller-wrapper .seller-info .ratingCount {
    margin-right: 12px;
    vertical-align: top;
  }
  .seller .seller-wrapper .seller-info .ratingCount, .sellCount {
    font-size: 10px;
    color: rgb(77,85,93);
    line-height: 18px;
    vertical-align: top;
  }
  .seller .seller-wrapper .seller-info .collect {
    position: absolute;
    right: 0px;
    top: 19px;
    text-align: center;
  }
  .seller .seller-wrapper .seller-info .collect .active {
    color: rgb(240,20,20) !important;
  }
  .seller .seller-wrapper .seller-info .collect .icon-favorite{
    font-size: 24px;
    color: #d4d6d9;
    line-height: 24px;
    margin-bottom: 4px;
  }
  .seller .seller-wrapper .seller-info .collect .text {
    font-size: 10px;
    color: rgb(77,85,93);
    line-height: 10px;
  }
  .seller-need {
    display: flex;
    flex-flow: row;
    justify-content: space-around;
  }
  .seller-need .initialPrice, .sendPrice, .sendTime {
    margin: 18px 0;
    padding: 0 18px;
    text-align: center;
    border-right: 1px solid rgba(7,17,27,0.1);
  }
  .seller-need .sendTime {
    border-right: none;
  }
  .seller-need .initialPrice .text, .sendPrice .text, .sendTime .text {
    color: rgb(147,153,159);
    line-height: 10px;
    font-size: 10px;
    margin-bottom: 4px;
  }
  .seller-need .initialPrice .content, .sendPrice .content, .sendTime .content {
    color: rgb(7,17,27);
    line-height: 24px;
    font-size: 24px;
  }
  .seller-need .initialPrice .content .word, .sendPrice .content .word, .sendTime .content .word {
    line-height: 24px;
    font-size: 10px;
  }
  .seller .bulletin {
    padding: 18px 0 0px 0;
    margin: 0 18px;
  }
  .seller .bulletin .title {
    font-size: 14px;
    color: rgb(7,17,27);
    line-height: 14px;
    margin-bottom: 8px;
    font-weight: 700;
  }
  .seller .bulletin .content-wrapper {
    padding: 0 12px 16px 12px;
  }
  .seller .bulletin .content-wrapper .content {
    font-size: 12px;
    color: rgb(240,20,20);
    line-height: 24px;
  }
  .bulletin .bulletin-item {
    padding: 16px 12px;
  }
  .bulletin .bulletin-item:last-child:after {
    display: none;
  }
 .bulletin .bulletin-item .icon {
    display: inline-block;
    vertical-align: top;
    width: 16px;
    height: 16px;
    margin-right: 6px;
    background-size: 16px 16px;
    background-repeat: no-repeat;
  }
  .bulletin .bulletin-item .text {
    font-size: 12px;
    color: rgb(7,17,27);
    line-height: 16px;
  }
  .pics {
    padding: 18px;
  }
  .pics .title {
    margin-bottom: 12px;
    line-height: 14px;
    color: rgb(7,17,27);
    font-size: 14px;
  }
  .pics .pic-wrapper {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
  }
  .pics .pic-wrapper .pic-list {
    font-size: 0;
  }
  .pics .pic-wrapper .pic-list .pic-item {
    display: inline-block;
    margin-right: 6px;
    width: 120px;
    height: 90px;
  }
  .pics .pic-wrapper .pic-list .pic-item:last-child {
    margin-right: 0;
  }
  .company-info {
    padding-top: 18px;
    margin: 0 18px;
  }
  .company-info .title {
    padding-bottom: 12px;
    font-size: 14px;
    color: rgb(7,17,27);
    line-height: 14px;
    font-weight: 700;
  }
  .company-info .info-item {
    padding: 16px 12px;
    font-size: 12px;
    color: rgb(7,17,27);
    line-height: 16px;
  }
  .company-info .info-item:last-child:after {
    display: none;
  }
</style>
