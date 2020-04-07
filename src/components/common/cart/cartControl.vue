<template>
  <div class="cartControl">
    <transition name="move">
      <div class="cart-decrease icon-remove_circle_outline" v-show="food.count>0" @click.stop.prevent="decreaseCart">
      </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart($event)">
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default {
    name: "cartControl",
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        clickStatus: true,
        isDisable: true
      }
    },
    methods: {
      addCart(event) {
        if(!event._constructed){
          return;
        }
        if(this.isDisable){
          if (!this.food.count) {
            // this.food.count = 1;  //这种方式vue无法观测到，需要使用vue.set
            Vue.set(this.food, 'count', 1)
          } else {
            this.food.count++;
          }
          this.isDisable = false;
          this.$bus.$emit('sendCount', event.target)
        }
        this.$nextTick(() =>{
          setTimeout(() => {
            this.isDisable = true;
          },700)
        })
      },
      decreaseCart() {
        if (this.food.count) {
          this.food.count--;
        }
      }
    }
  }
</script>

<style scoped>
  .cartControl {
    font-size: 0;
  }

  .cartControl .cart-decrease, .cart-add {
    display: inline-block;
    font-size: 24px;
    line-height: 24px;
    padding: 6px;
    color: rgb(0, 160, 220);
  }

  .cartControl .cart-decrease {
  }

  .cartControl .cart-count {
    display: inline-block;
    vertical-align: top;
    width: 12px;
    padding-top: 6px;
    line-height: 24px;
    text-align: center;
    font-size: 10px;
    color: rgb(147, 153, 159);

  }

  .cartControl .cart-add {

  }

  .move-enter-active, .move-leave-active {
    transition: all .3s linear;
    opacity: 1;
    transform: translate3d(0, 0, 0) rotate(0);
  }

  .move-enter, .move-leave-to {
    transform: translate3d(24px, 0, 0) rotate(180deg);
    opacity: 0;
  }
</style>
