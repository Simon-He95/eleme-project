<template>
    <div class="priceComponent">
      <div class="content">
        <h2 class="name">{{food.name}}</h2>
        <p class="desc">{{food.description}}</p>
        <div class="extra">
          <span class="count">月售{{food.sellCount}}</span><span>好评率{{food.rating}}%</span>
        </div>
        <div class="price">
          <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
        </div>
        <div class="cartControl-wrapper">
          <cartControl :food="food"></cartControl>
        </div>
        <transition name="ball">
          <div class="ball-container"></div>
        </transition>
      </div>
    </div>
</template>

<script>
    export default {
        name: "price",
        props:{
            food:{
              type:Object
            }
        }
    }
</script>

<style scoped>
  .priceComponent .content {
    flex: 1;
  }
  .priceComponent .content .cartControl-wrapper{
    position: absolute;
    right: 0;
    bottom: 12px;
  }
  .priceComponent .content .name {
    font-size: 14px;
    color: rgb(7, 17, 27);
    line-height: 14px;
    margin: 2px 0 8px 0;
  }

  .priceComponent .content .extra {
    font-size: 10px;
    color: rgb(147, 153, 159);
    line-height: 10px;
    margin-bottom: 8px;
  }

  .priceComponent .content .desc {
    color: rgb(147, 153, 159);
    font-size: 10px;
    margin-bottom: 8px;
    line-height: 12px;
  }

  .priceComponent .content .extra .count {
    margin-right: 12px;
  }

  .priceComponent .content .price {
    line-height: 24px;
  }

  .priceComponent .content .price .now {
    margin-right: 8px;
    font-size: 14px;
    color: rgb(240, 20, 20);
    font-weight: 700;
  }

  .priceComponent .content .price .old {
    text-decoration: line-through;
    font-size: 10px;
    color: rgb(147, 153, 159);
  }
</style>
