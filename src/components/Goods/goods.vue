<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul class="menu-items">
        <li v-for="(item,index) in goods" :key="index" class="menu-item menu-list-hook"
            :class="{'current':currentIndex === index}" @click="selectMenu(index,$event)">
            <span class="text border-bottom">
              <span v-show="item.type>0" :class="classMap[item.type]" class="icon"></span>{{item.name}}
            </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodWrapper">
      <ul>
        <li v-for="(item,index) in goods" :key="index" class="food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="(food,index) in item.foods" :key="index" class="foods-item border-bottom" @click="selectFood(food,$event)">
              <div class="icon">
                <img width="57" height="57" :src="food.icon" alt="">
              </div>
              <priceComponent :food="food"></priceComponent>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <Food :food="selectedFood" ref="foodInfo" ></Food>
    <shopCart ref="shopCart"  :selectFoods="selectFoods" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice"></shopCart>
  </div>
</template>

<script>
  import BScroll from 'better-scroll' //引入better-scroll插件
  import shopCart from '../ShopCart/shopcart'
  import Food from '../Food/food'
  import priceComponent from '../common/price/price'
  import {goods} from '../../../data.json'

  const ERR_OK = 0;
  const ALL = 2;


  export default {
    name: "goods",
    props: ['seller'],
    data() {
      return {
        goods: [],
        menuWrapper: "",
        foodWrapper: "",
        listHeight: [],
        scrollY: 0,
        selectedFood:{}
      }
    },
    created() {
      this.$axios.get('/api/goods').then(res => {
        if (res.data.errno === ERR_OK) {
          this.goods = res.data.data;
          this.$nextTick(() => {
            this._initScroll();
            this._calculateHeight();
          })
        }
      }).catch(err => {
        this.goods = goods
        this.$nextTick(() => {
            this._initScroll();
            this._calculateHeight();
          })
        console.log(err)
      }),
        this.classMap = ['decrease-bg', 'discount-bg', 'special-bg', 'invoice-bg', 'guarantee-bg'];
      this.$bus.$on('sendCount',(target)=>{
        this._drop(target)
      })
    },
    methods: {
      _initScroll() {
        this.menuScroll = new BScroll(this.menuWrapper, {click: true})
        this.foodScroll = new BScroll(this.foodWrapper, {click: true,probeType: 3})
        this.foodScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y)); //讲better-scroll监听的y转换为整数，并取绝对值
        })
      },
      _calculateHeight() {
        let foodList = this.foodWrapper.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      },
      selectMenu(index,event) {
        if(!event._constructed){
          return
        }
        let foodList = this.foodWrapper.getElementsByClassName('food-list-hook');
        let el = foodList[index];
        this.foodScroll.scrollToElement(el, 300);
      },
      _drop(target){
        //优化体验，异步去执行下落动画
        this.$nextTick(() =>{
          this.$refs.shopCart.drop(target);
        })
      },
      selectFood(food,event){
        if(!event._constructed){
          return
        }
        this.selectedFood = food;
        this.$refs.foodInfo.show();
      }
    },
    watch: {
      currentIndex: {
        handler(newVal, oldVal) {
          let menuList = this.menuWrapper.getElementsByClassName('menu-list-hook');
          let el = menuList[newVal];
            this.menuScroll.scrollToElement(el, 300);
        },
      }
    },
    computed: {
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (this.scrollY >= height1 && this.scrollY < height2) {  //如果不是最后一个，且落在区间，则返回上一个值
            return i;
          }
        }
        return 0;
      },
      selectFoods(){
        let foods = [];
        this.goods.forEach((good)=>{
          good.foods.forEach( (food)=>{
            if (food.count){
              foods.push(food);
            }
          })
        })
        return foods
      }
    }
    ,
    mounted() {
      this.menuWrapper = this.$refs.menuWrapper
      this.foodWrapper = this.$refs.foodWrapper;
    }
    ,
    components: {
      shopCart,
      Food,
      priceComponent
    }
  }
</script>

<style scoped>
  .goods {
    position: absolute;
    top: 177px;
    bottom: 46px;
    width: 100%;
    display: flex;
    overflow: hidden;
  }

  .goods .menu-wrapper {
    flex: 0 0 80px;
    width: 80px;
    background: #f3f5f7;
  }

  .goods .menu-wrapper .menu-items {
    padding: 0 12px;
  }

  .goods .menu-wrapper .menu-items .current {
    position: relative;
    margin-top: -1px;
    z-index: 10;
    font-size: 12px;
    margin-left: -12px;
    padding: 0 12px;
    background: #FFFFFF;
    font-weight: 700;
  }

  .goods .menu-wrapper .menu-items .current .text:after {
    border: none;
  }

  .goods .menu-wrapper .menu-item {
    display: table;
    height: 54px;
    width: 56px;
    line-height: 14px;
  }

  .goods .menu-wrapper .menu-item .icon {
    display: inline-block;
    vertical-align: top;
    width: 12px;
    height: 12px;
    margin-right: 2px;
    background-size: 12px 12px;
    background-repeat: no-repeat;
  }

  .goods .menu-wrapper .menu-item .text {
    display: table-cell;
    width: 56px;
    vertical-align: middle;
    font-size: 12px;
  }

  .goods .foods-wrapper {
    flex: 1;
  }

  .foods-wrapper .title {
    padding-left: 14px;
    height: 26px;
    line-height: 26px;
    border-left: 2px solid #d9dde1;
    font-size: 12px;
    color: rgb(147, 153, 159);
    background: #f3f5f7;
  }

  .foods-wrapper .foods-item {
    display: flex;
    margin: 18px;
    padding-bottom: 18px;
  }

  .foods-wrapper .foods-item:last-child:after {
    border: none;
  }

  .foods-wrapper .foods-item:last-child {
    margin-bottom: 0px;
  }

  .foods-wrapper .foods-item .icon {
    flex: 0 0 57px;
    margin-right: 10px;
  }

</style>
