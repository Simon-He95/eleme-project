# eleme-project

仿饿了么的一个app

可通过以下地址看效果：
http://81.68.90.128:8081

commonComponents:cartControl、price、ratingSelect、split、star
util.js：解析url，路由的?id=1234&a=b,转化为Objec {id：1234，a:b}
store.js：通过路由传入不同的id，可以对应的店铺，同时在点击收藏时，能存储到本地"favorite"中
iconStyle.css:讲svg通过icoMoon上传转换成字体样式，下载导入
global.css：全局引入，初始化了字体样式，和不同浏览器下，做了@media图片、样式的适配


