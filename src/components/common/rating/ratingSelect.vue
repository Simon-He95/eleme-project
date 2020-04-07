<template>
  <div class="ratingSelect">
    <div class="rating-type border-bottom">
      <span class="block positive" @click="select(2,$event)">
        <div :class="{'active':SelectType===2}">
        {{desc.all}} <span class="ratingCount">{{ratings.length}}</span>
      </div>
      </span>
      <span class="block positive"  @click="select(0,$event)">
        <div :class="{'active':SelectType===0}">
            {{desc.positive}} <span class="ratingCount">{{positives.length}}</span>
        </div>
      </span>
      <span class="block negative"  @click="select(1,$event)">
        <div :class="{'active':SelectType===1}">
            {{desc.negative}} <span class="ratingCount">{{negatives.length}}</span>
        </div>
      </span>
    </div>
    <div class="switch border-bottom" :class="{'on':OnlyContent===true}" @click="only($event)">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script>
  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;

  export default {
    name: "ratingSelect",
    data() {
      return {
        OnlyContent:this.onlyContent,
        SelectType:this.selectType
      }
    },
    props: {
      ratings: {
        type: Array,
        default() {
          return [];
        }
      },
      selectType: {
        type: Number,
        default: ALL
      },
      onlyContent:{
        type:Boolean,
        default:false
      },
      desc:{
        type:Object,
        default() {
          return {
            all:'全部',
            positive:'满意',
            negative:'不满意'
          };
        }
      }
    },
    methods:{
      select(type,event){
        if(!event._constructed){
          return;
        }
        this.SelectType = type;
        this.$bus.$emit('ratingType',this.SelectType);
      },
      only(){
        if(!event._constructed){
          return;
        }
        this.OnlyContent=!this.OnlyContent;
        this.$bus.$emit('contentRating',this.OnlyContent);
      }
    },
    computed:{
      positives(){
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE;
        });
      },
      negatives(){
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE;
        });
      }
    }
  }
</script>

<style scoped>
  .ratingSelect .rating-type {
    padding: 18px 0;
    margin: 0 18px;
    font-size: 0;
  }
  .ratingSelect .rating-type .block {
    display: inline-block;
    border-radius: 1px;
    margin-right: 8px;
    color: rgb(77,85,93);
    font-size: 12px;
    line-height: 16px;
  }
  .ratingSelect .rating-type .block div{
    padding: 8px 12px;
  }
  .ratingSelect .rating-type .block .active {
    color: #FFFFFF;
  }
  .ratingSelect .rating-type .block .ratingCount {
    font-size: 8px;
    margin-left: 2px;
  }
  .ratingSelect .rating-type .positive {
    background: rgba(0,160,220,0.2);
  }
  .ratingSelect .rating-type .positive .active {
    background: rgb(0,160,220);
  }
  .ratingSelect .rating-type .negative {
    background: rgba(77,85,93,0.2);
  }
  .ratingSelect .rating-type .negative .active {
    background: rgb(77,85,93);
  }
  .ratingSelect .switch {
    padding: 12px 18px;
    font-size: 0;
    color: rgb(147,153,159);
    line-height: 24px;
  }
  .ratingSelect .switch .icon-check_circle{
    display: inline-block;
    font-size: 24px;
    margin-right: 4px;
    vertical-align: top;
  }
  .on .icon-check_circle{
    color: #00c850;
  }
  .ratingSelect .switch .text{
    display: inline-block;
    font-size: 12px;
    vertical-align: top;
  }
</style>
