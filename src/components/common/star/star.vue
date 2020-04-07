<template>
    <div class="star" :class="classType">
      <span v-for="(item,index) in itemClass" :class="item" class="star-item"></span>
    </div>
</template>

<script>
  const LENGTH = 5;
  const CLS_ON = 'on';
  const CLS_HALF = 'half';
  const CLS_OFF = 'off';

    export default {
        name: "star",
        props:{
            size:{
              type:Number
            },
          score:{
              type:Number
          }
        },
        computed:{
          classType() {
            return 'star-'+this.size;
          },
          itemClass() {
            let result = [];
            let score = Math.floor(this.score*2)/2;
            let hasDecimal = score%1 !==0;  //取余数是否为0，不为0，则说明是有.5，存在半星
            let integer = Math.floor(score);
            for(let i=0;i<integer;i++){
              result.push(CLS_ON)
            }
            if(hasDecimal){
              result.push(CLS_HALF)
            }
            while (result.length < LENGTH){
              result.push(CLS_OFF)
            }
            return result;
          }
        }
    }
</script>

<style scoped>
  .star-48 .star-item{
    width: 20px;
    height: 20px;
    margin-right: 22px;
    background-size: 20px 20px;
  }
  .star-48 .star-item:last-child{
    margin-right: 0px;
  }
  .star-36 .star-item{
    width: 15px;
    height: 15px;
    margin-right: 6px;
    background-size: 15px 15px;
  }
  .star-36 .star-item:last-child{
    margin-right: 0px;
  }
  .star-24 .star-item{
    width: 10px;
    height: 10px;
    margin-right: 3px;
    background-size: 10px 10px;
  }
  .star-24 .star-item:last-child{
    margin-right: 0px;
  }
  .star .star-item{
    display: inline-block;
    background-repeat: no-repeat;
  }
</style>
