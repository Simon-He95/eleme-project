<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img width="64" height="64" :src="seller.avatar" alt="">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand bg-image"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}时间送达
        </div>
        <div class="supports" v-if="seller.supports">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div v-if="seller.supports" class="support-count" @click="detailShow=!detailShow">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="detailShow=!detailShow">
      <span class="title bulletin-bg"></span><span class="text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%" alt="">
    </div>
    <!-- 弹出层开始-->
    <transition name="fade">
      <div v-show="detailShow" class="detail">
        <div class="detail-wrapper clearfix">
          <div class="detail-main">
            <h1 class="name">{{seller.name}}</h1>
            <star :size="48" :score="seller.score" class="star"></star>
          </div>
          <div class="title">
            <div class="line"></div>
            <div class="text">优惠信息</div>
            <div class="line"></div>
          </div>
          <ul v-if="seller.supports" class="supports">
            <li v-for="(item,key) in seller.supports" class="supports-item">
              <span class="icon" :class="classMap[seller.supports[key].type]"></span>
              <span class="text">{{seller.supports[key].description}}</span>
            </li>
          </ul>
          <div class="title">
            <div class="line"></div>
            <div class="text">商家公告</div>
            <div class="line"></div>
          </div>
          <div class="bulletin">
            <p class="content">{{seller.bulletin}}</p>
          </div>
        </div>
        <div class="detail-close" @click="detailShow = !detailShow">
          <i class="icon-close"></i>
        </div>
      </div>
    </transition>
    <!-- 弹出层结束-->

  </div>
</template>

<script>
  export default {
    name: "vHeader",
    props: ['seller'],
    data() {
      return {
        detailShow: false,
        deliveryPrice: "",
        minPrice: ""
      }
    },
    created() {
      this.classMap = ['decrease-bg', 'discount-bg', 'special-bg', 'invoice-bg', 'guarantee-bg']
    },
  }
</script>

<style scoped>
  .header {
    color: #FFFFFF;
    position: relative;
    background: rgba(7, 17, 27, 0.5);
    overflow: hidden;
  }

  .header .content-wrapper {
    padding: 24px 12px 18px 24px;
    position: relative;
  }

  .header .content-wrapper .avatar img {
    border-radius: 2px;
  }

  .header .content-wrapper .avatar, .content {
    display: inline-block;
    vertical-align: top;
  }

  .header .content-wrapper .content {
    margin-left: 16px;
  }

  .header .content-wrapper .content .title .name {
    font-size: 16px;
    font-weight: bold;
    line-height: 18px;
    margin-left: 6px;
  }

  .header .content-wrapper .content .title {
    margin: 2px 0px 8px 0px;
  }

  .header .content-wrapper .content .brand {
    display: inline-block;
    width: 30px;
    height: 18px;
    background-size: 30px 18px;
    background-repeat: no-repeat;
    vertical-align: top;
  }

  .header .content-wrapper .content .description {
    font-size: 12px;
    line-height: 12px;
    margin-bottom: 10px;
  }

  .header .content-wrapper .content .supports .icon {
    display: inline-block;
    vertical-align: top;
    width: 12px;
    height: 12px;
    margin-right: 4px;
    background-size: 12px 12px;
    background-repeat: no-repeat;
  }

  .header .content-wrapper .content .supports .text {
    vertical-align: top;
    line-height: 12px;
    font-size: 10px;
  }

  .header .content-wrapper .support-count {
    position: absolute;
    right: 12px;
    bottom: 14px;
    padding: 0 8px;
    height: 24px;
    line-height: 24px;
    border-radius: 14px;
    background: rgba(0, 0, 0, 0.2);
    text-align: center;
  }

  .header .content-wrapper .support-count .count {
    font-size: 10px;
  }

  .header .content-wrapper .support-count i {
    font-size: 10px;
    vertical-align: top;
    line-height: 24px;
    margin-left: 2px;
  }

  .header .bulletin-wrapper {
    height: 28px;
    padding: 0px 22px 0px 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
    line-height: 28px;
  }

  .header .bulletin-wrapper .title {
    display: inline-block;
    width: 22px;
    height: 12px;
    background-size: 22px 12px;
    background-repeat: no-repeat;
    vertical-align: top;
    margin-top: 8px;
  }

  .header .bulletin-wrapper .text {
    margin: 0px 4px;
    font-size: 10px;
    vertical-align: top;
  }

  .header .bulletin-wrapper i {
    position: absolute;
    font-size: 10px;
    right: 12px;
    top: 8px;
  }

  .header .background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    filter: blur(10px);
  }

  .header .detail {
    position: fixed;
    top: 0px;
    left: 0px;
    z-index: 100;
    width: 100%;
    height: 100%;
    overflow: auto;
    background: rgba(7, 17, 27, 0.8);
    backdrop-filter: blur(7px);
  }

  .header .detail-wrapper {
    min-height: 100%;
    width: 100%;
    margin-top: 64px;
    padding-bottom: 64px;
  }

  .header .detail-close {
    position: relative;
    width: 32px;
    height: 32px;
    margin: -64px auto 0 auto;
    clear: both;
    font-size: 32px;
  }

  .header .detail-wrapper .detail-main .name {
    line-height: 16px;
    text-align: center;
    font-size: 16px;
    font-weight: 700;
  }

  .header .detail-wrapper .detail-main .star {
    margin-top: 18px;
    padding: 2px 0;
    text-align: center;
  }

  .header .detail-wrapper .title {
    display: flex;
    width: 80%;
    margin: 28px auto 24px auto;
  }

  .header .detail-wrapper .title .line {
    flex: 1;
    position: relative;
    top: -6px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }

  .header .detail-wrapper .title .text {
    padding: 0px 12px;
    font-size: 14px;
    font-weight: 700;
  }

  .header .detail-wrapper .supports {
    width: 80%;
    margin: 0 auto;
  }

  .header .detail-wrapper .supports .supports-item {
    padding: 0 12px;
    margin-bottom: 12px;
    font-size: 0px;
  }

  .header .detail-wrapper .supports .supports-item:last-child {
    margin-bottom: 0px;
  }

  .header .detail-wrapper .supports .supports-item .icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    vertical-align: top;
    margin-right: 6px;
    background-size: 16px 16px;
    background-repeat: no-repeat;
  }

  .header .detail-wrapper .supports .supports-item .text {
    line-height: 16px;
    font-size: 12px;
  }

  .header .detail-wrapper .bulletin {
    width: 80%;
    margin: 0 auto;
  }

  .header .detail-wrapper .bulletin .content {
    padding: 0 12px;
    font-size: 12px;
    line-height: 24px;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    opacity: 0;
  }
</style>
