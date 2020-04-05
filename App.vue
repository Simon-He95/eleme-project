<template>
  <div id="app">
    <vHeader :seller="seller"></vHeader>
    <div class="tab">
      <div class="tab-item border-bottom">
        <router-link :to="{ path: '/goods' }">商品</router-link>
      </div>
      <div class="tab-item border-bottom">
        <router-link :to="{path:'/ratings'}" >评论</router-link>
      </div>
      <div class="tab-item border-bottom">
        <router-link :to="{path:'/seller'}">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import vHeader from './components/Header/vHeader'
  import {urlParse} from './common/js/util'

  const ERR_OK = 0

  export default {
    name: 'App',
    data() {
      return {
        seller: {
          id: (() => {
            let queryParam = urlParse();
            console.log(queryParam)
            return queryParam.id;
          })()
        }
      }
    },
    created() {
      this.$axios.get('/api/seller?id=' + this.seller.id).then(res => {
        if (res.data.errno === ERR_OK) {
          this.seller = Object.assign({},this.seller,res.data.data)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    components: {
      vHeader
    },
  }
</script>

<style scoped>
  #app .tab {
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;

  }

  #app .tab .tab-item {
    text-align: center;
    flex: 1;
    position: relative;
  }

  #app .tab .tab-item a {
    display: block;
    font-size: 14px;
    color: rgb(77, 85, 93);
  }

  #app .tab .tab-item .router-link-active {
    color: rgb(240, 20, 20) !important;
  }

</style>
